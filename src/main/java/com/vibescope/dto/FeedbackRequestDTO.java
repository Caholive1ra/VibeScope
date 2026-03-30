package com.vibescope.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import java.util.List;

public record FeedbackRequestDTO(
                @JsonAlias("feedback_texto") String feedbackTexto,
                List<AnexoDTO> anexos) {
        public record AnexoDTO(
                        String tipo,
                        String url) {
        }
}
