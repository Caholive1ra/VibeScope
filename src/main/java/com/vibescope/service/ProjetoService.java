package com.vibescope.service;

import com.vibescope.domain.entity.Projeto;
import com.vibescope.domain.entity.RodadaRefacao;
import com.vibescope.domain.enums.ProjetoStatus;
import com.vibescope.domain.enums.StatusTarefa;
import com.vibescope.dto.EntregarRodadaRequestDTO;
import com.vibescope.dto.ProjetoRequestDTO;
import com.vibescope.dto.TimelineItemDTO;
import com.vibescope.exception.ResourceNotFoundException;
import com.vibescope.repository.ProjetoRepository;
import com.vibescope.repository.RodadaRefacaoRepository;
import com.vibescope.repository.TarefaTecnicaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjetoService {

    private final ProjetoRepository projetoRepository;
    private final RodadaRefacaoRepository rodadaRefacaoRepository;
    private final TarefaTecnicaRepository tarefaTecnicaRepository;
    private final GroqService groqService;

    private static final String PROMPT_DIRETOR_TECNICO = "Você é um Diretor de Pós-Produção Técnico altamente experiente. Sua função é ler briefings criativos desestruturados (Brain Dumps) de clientes e traduzi-los em um resumo técnico e acionável para o Editor de Vídeo. "
            + "REGRA ABSOLUTA: Retorne APENAS o resumo formatado em Markdown. Não use saudações. "
            + "Estruture exatamente com os seguintes tópicos: "
            + "**🎬 Visão Geral:** (resumo de 2 linhas). "
            + "**⏱️ Tarefas Técnicas:** (bullet points com ações e dedução de timecodes ex: [0:15] ou [Geral]). "
            + "**⚡ Nível de Esforço Estimado:** (responda apenas BAIXO, MÉDIO ou ALTO).";

    @Transactional
    public Projeto criarProjetoComResumo(ProjetoRequestDTO dto) {
        String resumoIa = null;
        if (dto.briefingBruto() != null && !dto.briefingBruto().isBlank()) {
            try {
                resumoIa = groqService.processarComIA(PROMPT_DIRETOR_TECNICO, dto.briefingBruto());
            } catch (Exception e) {
                // Blindagem extra: GroqService já faz fallback e não lança, mas garantimos
                // consistência.
                resumoIa = "Resumo técnico pendente (IA indisponível). Leia o briefing original.";
            }
        }

        Projeto projeto = Projeto.builder()
                .clienteNome(dto.clienteNome())
                .nomeProjeto(dto.nomeProjeto())
                .videoUrl(dto.videoUrl())
                .briefingUrl(dto.briefingUrl())
                .briefingBruto(dto.briefingBruto())
                .resumoIa(resumoIa)
                .limiteRefacoes(dto.limiteRefacoes() != null ? dto.limiteRefacoes() : 3)
                .status(ProjetoStatus.EM_EDICAO)
                .magicToken(UUID.randomUUID().toString())
                .build();

        Projeto saved = projetoRepository.save(projeto);

        // Cria a primeira rodada (v1.0) automaticamente
        RodadaRefacao primeiraRodada = RodadaRefacao.builder()
                .projeto(saved)
                .numeroRodada(1)
                .consumiuEscopo(false) // A primeira rodada não consome o limite de refações
                .build();
        rodadaRefacaoRepository.save(primeiraRodada);

        return saved;
    }

    @Transactional(readOnly = true)
    public List<Projeto> getAllProjects() {
        return projetoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Projeto getProjectByMagicToken(String magicToken) {
        return projetoRepository.findByMagicToken(magicToken)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com o token informado."));
    }

    @Transactional
    public Projeto regerarResumo(UUID id) {
        Projeto projeto = projetoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado"));

        if (projeto.getBriefingBruto() == null || projeto.getBriefingBruto().isBlank()) {
            projeto.setResumoIa(
                    "Não é possível regerar o resumo: o briefing original não foi encontrado para este projeto (provavelmente um projeto antigo).");
            return projetoRepository.save(projeto);
        }

        String novoResumo;
        try {
            novoResumo = groqService.processarComIA(PROMPT_DIRETOR_TECNICO, projeto.getBriefingBruto());
        } catch (Exception e) {
            log.error("Erro ao regerar resumo para o projeto {}: {}", id, e.getMessage());
            novoResumo = "Resumo técnico pendente (IA indisponível). Leia o briefing original.";
        }

        projeto.setResumoIa(novoResumo);
        return projetoRepository.save(projeto);
    }

    @Transactional
    public Projeto entregarRodada(UUID projetoId, Long rodadaId, EntregarRodadaRequestDTO dto) {
        RodadaRefacao rodada = rodadaRefacaoRepository.findByIdAndProjetoId(rodadaId, projetoId)
                .orElseThrow(() -> new ResourceNotFoundException("Rodada não encontrada para o projeto informado."));

        if (dto.videoUrl() == null || dto.videoUrl().isBlank()) {
            throw new IllegalArgumentException("videoUrl é obrigatório para concluir a entrega.");
        }

        rodada.setVideoUrlEntrega(dto.videoUrl().trim());
        rodada.setObservacoesEditor(dto.observacoesEditor());
        rodada.setDataConclusao(LocalDateTime.now());
        rodadaRefacaoRepository.save(rodada);

        var tarefas = tarefaTecnicaRepository.findByRodadaId(rodada.getId());
        for (var tarefa : tarefas) {
            tarefa.setStatusTarefa(StatusTarefa.CONCLUIDA);
        }
        tarefaTecnicaRepository.saveAll(tarefas);

        Projeto projeto = rodada.getProjeto();
        projeto.setVideoUrl(dto.videoUrl().trim());
        projeto.setStatus(ProjetoStatus.AGUARDANDO_CLIENTE);
        return projetoRepository.save(projeto);
    }

    @Transactional(readOnly = true)
    public List<TimelineItemDTO> getTimelineByMagicToken(String magicToken) {
        var projeto = projetoRepository.findByMagicToken(magicToken)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com o token informado."));

        return rodadaRefacaoRepository.findByProjetoMagicTokenOrderByNumeroRodadaDesc(magicToken)
                .stream()
                .sorted(Comparator.comparing(RodadaRefacao::getNumeroRodada).reversed())
                .map(rodada -> new TimelineItemDTO(
                        rodada.getId(),
                        rodada.getNumeroRodada(),
                        "v" + rodada.getNumeroRodada() + ".0",
                        "Alterações da rodada " + rodada.getNumeroRodada(),
                        rodada.getDataConclusao() != null ? "Entregue" : "Em Edição",
                        rodada.getDataConclusao() != null ? "Produção" : "VibeScope IA",
                        rodada.getVideoUrlEntrega() != null ? rodada.getVideoUrlEntrega() : projeto.getVideoUrl(),
                        rodada.getFeedbackBruto(),
                        rodada.getObservacoesEditor(),
                        rodada.getDataConclusao() != null ? rodada.getDataConclusao() : rodada.getCreatedAt()))
                .collect(Collectors.toList());
    }
}
