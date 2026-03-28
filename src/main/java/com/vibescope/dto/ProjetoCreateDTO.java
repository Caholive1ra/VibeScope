package com.vibescope.dto;

public record ProjetoCreateDTO(
        String clienteNome,
        String nomeProjeto,
        String videoUrl,
        Integer limiteRefacoes) {
}
