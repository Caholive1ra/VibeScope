package com.vibescope.service;

import com.fasterxml.jackson.databind.JsonNode;
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
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class FeedbackPersistenceService {

    private final ProjetoRepository projetoRepository;
    private final RodadaRefacaoRepository rodadaRefacaoRepository;
    private final AnexoFeedbackRepository anexoFeedbackRepository;
    private final TarefaTecnicaRepository tarefaTecnicaRepository;

    /**
     * Persiste feedback bruto e anexos numa transação própria que faz commit antes da chamada à IA.
     * Assim falhas no Groq/parse de JSON não desfazem o registro da rodada.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public RodadaRefacao salvarFeedbackBruto(String magicToken, FeedbackRequestDTO request) {
        Projeto projeto = projetoRepository.findByMagicToken(magicToken)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com o token informado."));

        int proximoNumero = (int) rodadaRefacaoRepository.countByProjetoId(projeto.getId()) + 1;
        RodadaRefacao rodada = RodadaRefacao.builder()
                .projeto(projeto)
                .numeroRodada(proximoNumero)
                .feedbackBruto(request.feedbackTexto())
                .build();

        rodada = rodadaRefacaoRepository.save(rodada);

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

        projeto.setStatus(ProjetoStatus.EM_ANALISE);
        projetoRepository.save(projeto);

        return rodada;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void aplicarTarefasGeradasPelaIA(Long rodadaId, JsonNode root) {
        RodadaRefacao rodada = rodadaRefacaoRepository.findById(rodadaId)
                .orElseThrow(() -> new ResourceNotFoundException("Rodada não encontrada."));

        if (!root.isArray()) {
            log.warn("Resposta da IA não é um array JSON; rodada {} permanece sem tarefas geradas.", rodadaId);
            return;
        }

        for (JsonNode t : root) {
            TarefaTecnica tarefa = TarefaTecnica.builder()
                    .rodada(rodada)
                    .timecode(t.path("timecode").asText("[Geral]"))
                    .descricao(t.path("descricao").asText("Sem descrição"))
                    .esforco(safeParseEsforco(t.path("esforco").asText()))
                    .statusTarefa(StatusTarefa.PENDENTE)
                    .build();
            tarefaTecnicaRepository.save(tarefa);
        }

        rodada.setConsumiuEscopo(true);
        rodadaRefacaoRepository.save(rodada);
    }

    private EsforcoTarefa safeParseEsforco(String esforco) {
        if (esforco == null) {
            return EsforcoTarefa.MEDIO;
        }
        try {
            String clean = esforco.toUpperCase()
                    .replace("É", "E")
                    .replace("Í", "I")
                    .replace("Ó", "O")
                    .trim();
            return EsforcoTarefa.valueOf(clean);
        } catch (IllegalArgumentException e) {
            log.warn("Esforço inválido recebido da IA: {}. Usando MÉDIO como padrão.", esforco);
            return EsforcoTarefa.MEDIO;
        }
    }
}
