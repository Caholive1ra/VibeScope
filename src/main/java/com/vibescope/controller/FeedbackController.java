package com.vibescope.controller;

import com.vibescope.dto.FeedbackRequestDTO;
import com.vibescope.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/projetos/magic/{magic_token}/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<String> submeterFeedback(
            @PathVariable("magic_token") String magicToken,
            @RequestBody FeedbackRequestDTO request) {

        feedbackService.processarFeedback(magicToken, request);

        return ResponseEntity.ok("Feedback recebido com sucesso. Rodada de refação processada.");
    }
}
