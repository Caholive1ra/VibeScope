package com.vibescope.service;

import com.vibescope.domain.entity.Projeto;
import com.vibescope.domain.enums.ProjetoStatus;
import com.vibescope.dto.ProjetoCreateDTO;
import com.vibescope.exception.ResourceNotFoundException;
import com.vibescope.repository.ProjetoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjetoService {

    private final ProjetoRepository projetoRepository;
    private final GeminiService geminiService;

    @Transactional
    public Projeto createProject(ProjetoCreateDTO dto) {
        String resumoIa = null;
        if (dto.briefingTexto() != null && !dto.briefingTexto().isBlank()) {
            String prompt = "Resuma este briefing de vídeo para um editor de forma técnica e ultra-rápida. Foque em: Objetivo, Tom, e Elementos Obrigatórios. Máximo 5 tópicos.";
            try {
                resumoIa = geminiService.processarComIA(prompt, dto.briefingTexto(), null);
            } catch (Exception e) {
                // If AI fails during project creation, we log but still create the project
                resumoIa = "Erro ao gerar resumo da IA.";
            }
        }

        Projeto projeto = Projeto.builder()
                .clienteNome(dto.clienteNome())
                .nomeProjeto(dto.nomeProjeto())
                .videoUrl(dto.videoUrl())
                .briefingUrl(dto.briefingUrl())
                .resumoIa(resumoIa)
                .limiteRefacoes(dto.limiteRefacoes() != null ? dto.limiteRefacoes() : 3)
                .status(ProjetoStatus.AGUARDANDO_CLIENTE)
                .magicToken(UUID.randomUUID().toString())
                .build();

        return projetoRepository.save(projeto);
    }

    @Transactional(readOnly = true)
    public Projeto getProjectByMagicToken(String magicToken) {
        return projetoRepository.findByMagicToken(magicToken)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com o token informado."));
    }
}
