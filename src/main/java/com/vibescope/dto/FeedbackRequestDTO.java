package com.vibescope.dto;

import java.util.List;

public record FeedbackRequestDTO(
        String feedback_texto,
        List<AnexoDTO> anexos) {
    public record AnexoDTO(
            String tipo,
            String url) {
    }
}
