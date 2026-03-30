package com.vibescope.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class GroqService {

    private static final String GROQ_CHAT_COMPLETIONS_URL = "https://api.groq.com/openai/v1/chat/completions";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final String apiKey;

    public GroqService(
            @Value("${groq.api.key}") String apiKey,
            ObjectMapper objectMapper
    ) {
        this.apiKey = apiKey;
        this.objectMapper = objectMapper;
        this.restTemplate = new RestTemplate();
    }

    public String processarComIA(String promptSistema, String textoUsuario) {
        if (textoUsuario == null || textoUsuario.isBlank()) {
            return "Resumo técnico pendente (IA indisponível). Leia o briefing original.";
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> body = Map.of(
                    "model", "llama-3.1-8b-instant",
                    "messages", List.of(
                            Map.of("role", "system", "content", promptSistema != null ? promptSistema : ""),
                            Map.of("role", "user", "content", textoUsuario)
                    ),
                    "temperature", 0.5
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    GROQ_CHAT_COMPLETIONS_URL,
                    HttpMethod.POST,
                    request,
                    String.class
            );

            String responseBody = response.getBody();
            if (responseBody == null || responseBody.isBlank()) {
                return "Resumo técnico pendente (IA indisponível). Leia o briefing original.";
            }

            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode contentNode = root.path("choices")
                    .path(0)
                    .path("message")
                    .path("content");

            String content = contentNode.asText("");
            if (content == null || content.isBlank()) {
                return "Resumo técnico pendente (IA indisponível). Leia o briefing original.";
            }

            return content.trim();
        } catch (RestClientException | JsonProcessingException e) {
            log.error("Falha ao chamar Groq/parsear resposta: {}", e.getMessage(), e);
            return "Resumo técnico pendente (IA indisponível). Leia o briefing original.";
        } catch (Exception e) {
            log.error("Erro inesperado no GroqService: {}", e.getMessage(), e);
            return "Resumo técnico pendente (IA indisponível). Leia o briefing original.";
        }
    }
}

