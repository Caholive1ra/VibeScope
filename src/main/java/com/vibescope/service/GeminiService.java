package com.vibescope.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vibescope.dto.FeedbackRequestDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class GeminiService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String apiUrl;

    public GeminiService(
            @Value("${gemini.api.key}") String apiKey,
            @Value("${gemini.api.url}") String apiUrl,
            ObjectMapper objectMapper) {
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder().build();
    }

    public String processarComIA(String promptSistema, String textoCliente, List<FeedbackRequestDTO.AnexoDTO> anexos) {
        if (textoCliente == null || textoCliente.isBlank()) {
            log.warn("Tentativa de chamada à IA com textoCliente vazio ou nulo.");
            return "Nenhum conteúdo fornecido para resumo.";
        }

        try {
            log.info("Iniciando chamada ao Gemini. Texto cliente (size): {}", textoCliente.length());
            log.debug("Prompt Sistema: {}", promptSistema);
            log.debug("Texto Cliente: {}", textoCliente);

            Map<String, Object> requestBody = new HashMap<>();

            // Instrução de Sistema
            Map<String, Object> systemInstruction = new HashMap<>();
            Map<String, String> systemParts = new HashMap<>();
            systemParts.put("text", promptSistema != null ? promptSistema : "");
            systemInstruction.put("parts", List.of(systemParts));
            requestBody.put("system_instruction", systemInstruction);

            // Conteúdo do Usuário
            Map<String, Object> userContent = new HashMap<>();
            userContent.put("role", "user");

            StringBuilder userPrompt = new StringBuilder();
            userPrompt.append("Feedback do Cliente: ").append(textoCliente).append("\n");

            if (anexos != null && !anexos.isEmpty()) {
                userPrompt.append("\nAnexos Recebidos:\n");
                for (var anexo : anexos) {
                    userPrompt.append("- Tipo: ").append(anexo.tipo()).append(" | URL: ").append(anexo.url())
                            .append("\n");
                }
            }

            Map<String, String> userParts = new HashMap<>();
            userParts.put("text", userPrompt.toString());
            userContent.put("parts", List.of(userParts));
            requestBody.put("contents", List.of(userContent));

            // Request sent without responseMimeType constraint to ensure compatibility with
            // plain text prompts
            log.debug("Enviando request para Gemini. URL: {}?key=HIDDEN", apiUrl);

            String responseJson = restClient.post()
                    .uri(apiUrl + "?key=" + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            log.debug("Resposta bruta do Gemini recebida.");

            // Extração do campo text de forma robusta
            JsonNode root = objectMapper.readTree(responseJson);

            // Verificação de erro de API se presente no JSON
            if (root.has("error")) {
                String errorMsg = root.path("error").path("message").asText("Erro desconhecido da API Gemini");
                log.error("Gemini API Error: {}", errorMsg);
                throw new RuntimeException("Erro da API Gemini: " + errorMsg);
            }

            JsonNode textNode = root.path("candidates")
                    .path(0)
                    .path("content")
                    .path("parts")
                    .path(0)
                    .path("text");

            if (textNode.isMissingNode() || textNode.asText().isBlank()) {
                log.error("Estrutura de resposta inesperada do Gemini: {}", responseJson);
                throw new RuntimeException("A IA não retornou um conteúdo válido.");
            }

            String resultText = textNode.asText();

            // Limpeza de Markdown se necessário
            if (resultText.contains("```json")) {
                resultText = resultText.substring(resultText.indexOf("```json") + 7);
                resultText = resultText.substring(0, resultText.lastIndexOf("```"));
            } else if (resultText.contains("```")) {
                resultText = resultText.substring(resultText.indexOf("```") + 3);
                resultText = resultText.substring(0, resultText.lastIndexOf("```"));
            }

            log.debug("Resposta processada da IA: {}", resultText);
            return resultText.trim();

        } catch (org.springframework.web.client.HttpClientErrorException e) {
            log.error("Erro 4xx do Gemini: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Falha na comunicação com a IA: " + e.getMessage());
        } catch (org.springframework.web.client.HttpServerErrorException e) {
            log.error("Erro 5xx do Gemini: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Erro interno no motor de IA.");
        } catch (Exception e) {
            log.error("Erro inesperado na chamada ao Gemini", e);
            throw new RuntimeException("Falha na comunicação com o motor de IA.");
        }
    }

    public String gerarResumoEstrategico(String briefingBruto) {
        String prompt = "Você é um Diretor de Pós-Produção. Resuma o briefing abaixo para um EDITOR DE VÍDEO. Seja técnico, direto e use no máximo 5 tópicos (Objetivo, Tom, Elementos Obrigatórios, Formato).";
        return processarComIA(prompt, briefingBruto, null);
    }
}
