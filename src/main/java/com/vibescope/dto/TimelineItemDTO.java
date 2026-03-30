package com.vibescope.dto;

import java.time.LocalDateTime;

public record TimelineItemDTO(
        Long rodadaId,
        Integer numeroRodada,
        String versao,
        String titulo,
        String status,
        String autor,
        String videoUrl,
        String feedbackCliente,
        String observacoesEditor,
        LocalDateTime dataEvento) {
}

