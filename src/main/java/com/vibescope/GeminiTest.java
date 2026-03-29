package com.vibescope;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vibescope.service.GeminiService;
import com.vibescope.dto.FeedbackRequestDTO;
import java.util.List;
import java.util.Collections;

public class GeminiTest {
    public static void main(String[] args) {
        try {
            String apiKey = System.getenv("GEMINI_API_KEY");
            String apiUrl = System.getenv("GEMINI_API_URL");

            System.out.println("URL: " + apiUrl);
            // Mascarando a chave
            System.out.println("KEY: " + (apiKey != null ? apiKey.substring(0, 5) + "..." : "NULL"));

            ObjectMapper mapper = new ObjectMapper();
            GeminiService service = new GeminiService(apiKey, apiUrl, mapper);

            String prompt = "Dê um 'Oi'";
            String result = service.processarComIA("Você é um assistente útil.", prompt, Collections.emptyList());

            System.out.println("RESULTADO: " + result);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
