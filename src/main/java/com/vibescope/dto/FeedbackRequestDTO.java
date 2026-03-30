package com.vibescope.dto;

import java.util.List;

public record FeedbackRequestDTO(
                String feedbackTexto,
                List<AnexoDTO> anexos) {
        public record AnexoDTO(
                        String tipo,
                        String url) {
        }
}
