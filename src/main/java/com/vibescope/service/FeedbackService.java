package com.vibescope.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vibescope.domain.entity.AnexoFeedback;
import com.vibescope.domain.entity.Projeto;
import com.vibescope.domain.entity.RodadaRefacao;
import com.vibescope.domain.entity.TarefaTecnica;
import com.vibescope.domain.enums.EsforcoTarefa;
import com.vibescope.domain.enums.ProjetoStatus;
import com.vibescope.domain.enums.StatusTarefa;
import com.vibescope.domain.enums.TipoMidia;
import com.vibescope.dto.FeedbackRequestDTO;
import com.vibescope.exception.ResourceNotFoundException;
import com.vibescope.repository.AnexoFeedbackRepository;
import com.vibescope.repository.ProjetoRepository;
import com.vibescope.repository.RodadaRefacaoRepository;
import com.vibescope.repository.TarefaTecnicaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class FeedbackService {

    private final ProjetoRepository projetoRepository;
    private final RodadaRefacaoRepository rodadaRefacaoRepository;
    private final AnexoFeedbackRepository anexoFeedbackRepository;
    private final TarefaTecnicaRepository tarefaTecnicaRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public void processarFeedback(String magicToken, FeedbackRequestDTO request) {
        // a) Buscar o Projeto pelo token
        Projeto projeto = projetoRepository.findByMagicToken(magicToken)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com o token informado."));

        // b) Criar e salvar uma nova RodadaRefacao
        int proximoNumero = projeto.getRodadas().size() + 1;
        RodadaRefacao rodada = RodadaRefacao.builder()
                .projeto(projeto)
                .numeroRodada(proximoNumero)
                .feedbackBruto(request.feedback_texto())
                .build();

        rodada = rodadaRefacaoRepository.save(rodada);

        // c) Iterar sobre os anexos do DTO e salvar as entidades AnexoFeedback
        if (request.anexos() != null) {
            for (FeedbackRequestDTO.AnexoDTO anexoDto : request.anexos()) {
                AnexoFeedback anexo = AnexoFeedback.builder()
                        .rodada(rodada)
                        .tipoMidia(TipoMidia.valueOf(anexoDto.tipo().toUpperCase()))
                        .urlArquivo(anexoDto.url())
                        .build();
                anexoFeedbackRepository.save(anexo);
            }
        }

        // d) Chamar simulador de IA
        String jsonIA = chamarInteligenciaArtificial(request.feedback_texto(), request.anexos());

        // e) Parse do JSON e salvar Tarefas Técnicas
        try {
            JsonNode root = objectMapper.readTree(jsonIA);
            JsonNode tarefasNode = root.get("tarefas");
            boolean consumiuEscopo = root.get("consumiu_escopo_real").asBoolean();

            rodada.setConsumiuEscopo(consumiuEscopo);
            rodadaRefacaoRepository.save(rodada);

            if (tarefasNode.isArray()) {
                for (JsonNode t : tarefasNode) {
                    TarefaTecnica tarefa = TarefaTecnica.builder()
                            .rodada(rodada)
                            .timecode(t.get("timecode").asText())
                            .descricao(t.get("descricao").asText())
                            .esforco(EsforcoTarefa.valueOf(t.get("esforco").asText().toUpperCase()))
                            .statusTarefa(StatusTarefa.PENDENTE)
                            .build();
                    tarefaTecnicaRepository.save(tarefa);
                }
            }
        } catch (Exception e) {
            log.error("Erro ao processar resposta da IA", e);
            throw new RuntimeException("Falha no processamento das tarefas técnicas.");
        }

        // f) Atualizar status do projeto
        projeto.setStatus(ProjetoStatus.REFACAO_SOLICITADA);
        projetoRepository.save(projeto);
    }

    private String chamarInteligenciaArtificial(String texto, List<FeedbackRequestDTO.AnexoDTO> anexos) {
        return """
                {
                  "analise_geral": "Simulação de análise baseada no feedback recebido.",
                  "tarefas": [
                    {
                      "timecode": "[00:15]",
                      "descricao": "Aplicar correção de cor primária para aumentar saturação/contraste.",
                      "esforco": "MEDIO"
                    },
                    {
                      "timecode": "[Geral]",
                      "descricao": "Aumentar a escala da logomarca na cartela final.",
                      "esforco": "BAIXO"
                    }
                  ],
                  "consumiu_escopo_real": true
                }
                """;
    }
}
