package com.vibescope.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vibescope.domain.entity.RodadaRefacao;
import com.vibescope.dto.FeedbackRequestDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.StringJoiner;

@Service
@RequiredArgsConstructor
@Slf4j
public class FeedbackService {

    private final FeedbackPersistenceService feedbackPersistenceService;
    private final GroqService groqService;
    private final ObjectMapper objectMapper;

    /**
     * Persiste o feedback primeiro (transação própria); depois tenta gerar tarefas via IA.
     * Falhas na IA não apagam a rodada já gravada no banco.
     */
    public void processarFeedback(String magicToken, FeedbackRequestDTO request) {
        RodadaRefacao rodada = feedbackPersistenceService.salvarFeedbackBruto(magicToken, request);

        String promptSistema = """
                    Você é um Assistente Técnico de Edição de Vídeo. Sua função é ler o feedback de um cliente (o "Brain Dump") e transformá-lo em uma lista estrita de tarefas técnicas acionáveis para o editor de vídeo.

                    REGRAS OBRIGATÓRIAS PARA TIMECODE (minutagem):
                    1. EXATO: Se o cliente citar o tempo (ex: "aos 1:20", "no minuto 2"), extraia e formate como [MM:SS].
                    2. CONTEXTUAL: Se o cliente não der o tempo, mas descrever a cena (ex: "na hora que o moço sorri", "no finalzinho"), crie uma tag descritiva curta. Exemplo: [Cena: moço sorrindo] ou [Final].
                    3. GLOBAL: Se o feedback afetar o vídeo como um todo ou o cliente não der nenhuma pista de onde é (ex: "a cor está lavada", "achei o vídeo longo"), use a tag exata: [Geral].

                    REGRAS PARA ESFORÇO:
                    Classifique o esforço da tarefa apenas como: BAIXO, MEDIO ou ALTO.
                    - BAIXO: Textos, volume de áudio, cortes simples.
                    - MEDIO: Correção de cor, transições, animações simples.
                    - ALTO: Refazer motion graphics, trocar trilha sonora inteira, reestruturar a narrativa.

                    FORMATO DE SAÍDA:
                    Retorne EXCLUSIVAMENTE um JSON puro, sem formatação markdown (sem ```json), contendo um array de objetos.
                    Exemplo:
                    [
                      { "timecode": "[Geral]", "descricao": "Aplicar correção de cor primária", "esforco": "MEDIO", "status_tarefa": "PENDENTE" },
                      { "timecode": "[Cena: praia]", "descricao": "Suavizar transição", "esforco": "BAIXO", "status_tarefa": "PENDENTE" }
                    ]
                """;

        StringJoiner userContent = new StringJoiner("\n");
        userContent.add("Feedback do Cliente: " + (request.feedbackTexto() != null ? request.feedbackTexto() : ""));

        if (request.anexos() != null && !request.anexos().isEmpty()) {
            userContent.add("");
            userContent.add("Anexos Recebidos:");
            for (var anexo : request.anexos()) {
                userContent.add("- Tipo: " + anexo.tipo() + " | URL: " + anexo.url());
            }
        }

        try {
            String jsonIA = normalizarJsonDaIA(groqService.processarComIA(promptSistema, userContent.toString()));
            JsonNode root = objectMapper.readTree(jsonIA);
            feedbackPersistenceService.aplicarTarefasGeradasPelaIA(rodada.getId(), root);
        } catch (Exception e) {
            log.error("Falha ao gerar/aplicar tarefas técnicas após rodada {} persistida: {}",
                    rodada.getId(), e.getMessage(), e);
        }
    }

    /** Remove cercas ```json … ``` comuns em respostas de modelo. */
    private static String normalizarJsonDaIA(String raw) {
        if (raw == null) {
            return "";
        }
        String s = raw.trim();
        if (s.startsWith("```")) {
            s = s.replaceFirst("^```(?:json)?\\s*", "");
            int end = s.lastIndexOf("```");
            if (end >= 0) {
                s = s.substring(0, end).trim();
            }
        }
        return s.trim();
    }
}
