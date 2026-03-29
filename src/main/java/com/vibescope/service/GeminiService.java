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

    public GeminiService(
            @Value("${gemini.api.key}") String apiKey,
            @Value("${gemini.api.url}") String apiUrl,
            ObjectMapper objectMapper) {
        this.apiKey = apiKey;
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder()
                .baseUrl(apiUrl)
                .build();
    }

    public String processarComIA(String promptSistema, String textoCliente, List<FeedbackRequestDTO.AnexoDTO> anexos) {
        try {
            // Montagem simplificada do JSON para o Gemini 1.5
            // Estrutura: { contents: [{ parts: [{ text: "..." }] }], system_instruction: {
            // parts: { text: "..." } } }

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

            // Configuração de Resposta (JSON)
            Map<String, Object> generationConfig = new HashMap<>();
            generationConfig.put("responseMimeType", "application/json");
            requestBody.put("generationConfig", generationConfig);

            String responseJson = restClient.post()
                    .uri(uriBuilder -> uriBuilder.queryParam("key", apiKey).build())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            // Extração do campo text de forma robusta
            JsonNode root = objectMapper.readTree(responseJson);

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
}
