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

@Service
@RequiredArgsConstructor
@Slf4j
public class FeedbackService {

    private final ProjetoRepository projetoRepository;
    private final RodadaRefacaoRepository rodadaRefacaoRepository;
    private final AnexoFeedbackRepository anexoFeedbackRepository;
    private final TarefaTecnicaRepository tarefaTecnicaRepository;
    private final GeminiService geminiService;
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

        // d) Chamar Gemini Real
        String promptSistema = """
                    Você é o "Árbitro de Escopo", um assistente técnico especializado em edição de vídeo.
                    Sua missão é receber um feedback bruto (texto, transcrição de áudio ou imagens) de um cliente e traduzi-lo em tarefas técnicas acionáveis para um editor de vídeo.

                    REGRAS OBRIGATÓRIAS:
                    1. Extraia o timecode exato de cada solicitação, se mencionado. Se não houver, use "[Geral]".
                    2. Classifique o esforço da edição como "BAIXO", "MEDIO" ou "ALTO".
                    3. Seja direto e técnico na descrição da tarefa.
                    4. Você deve retornar EXCLUSIVAMENTE um objeto JSON válido, sem formatação Markdown ao redor, sem textos introdutórios e sem explicações.

                    ESTRUTURA JSON ESPERADA:
                    {
                      "analise_geral": "string",
                      "tarefas": [
                        { "timecode": "string", "descricao": "string", "esforco": "string" }
                      ],
                      "consumiu_escopo_real": boolean
                    }
                """;

        String jsonIA = geminiService.processarComIA(promptSistema, request.feedback_texto(), request.anexos());

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
                            .esforco(safeParseEsforco(t.path("esforco").asText()))
                            .statusTarefa(StatusTarefa.PENDENTE)
                            .build();
                    tarefaTecnicaRepository.save(tarefa);
                }
            }
        } catch (Exception e) {
            log.error("Erro ao processar resposta da IA", e);
            throw new RuntimeException("Falha no processamento das tarefas técnicas: " + e.getMessage());
        }

        // f) Atualizar status do projeto
        projeto.setStatus(ProjetoStatus.REFACAO_SOLICITADA);
        projetoRepository.save(projeto);
    }

    private EsforcoTarefa safeParseEsforco(String esforco) {
        if (esforco == null)
            return EsforcoTarefa.MEDIO;
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
