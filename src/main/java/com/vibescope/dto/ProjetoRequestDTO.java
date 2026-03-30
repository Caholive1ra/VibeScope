package com.vibescope.dto;

public record ProjetoRequestDTO(
        String clienteNome,
        String nomeProjeto,
        String videoUrl,
        String briefingUrl,
        String briefingBruto,
        Integer limiteRefacoes) {
}
