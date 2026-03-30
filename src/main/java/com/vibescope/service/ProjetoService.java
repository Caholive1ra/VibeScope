package com.vibescope.service;

import com.vibescope.domain.entity.Projeto;
import com.vibescope.domain.enums.ProjetoStatus;
import com.vibescope.dto.ProjetoRequestDTO;
import com.vibescope.exception.ResourceNotFoundException;
import com.vibescope.repository.ProjetoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjetoService {

    private final ProjetoRepository projetoRepository;
    private final GeminiService geminiService;

    @Transactional
    public Projeto criarProjetoComResumo(ProjetoRequestDTO dto) {
        String resumoIa = null;
        if (dto.briefingBruto() != null && !dto.briefingBruto().isBlank()) {
            String prompt = "Você é um Diretor de Pós-Produção. Resuma o briefing abaixo para um EDITOR DE VÍDEO. Seja técnico, direto e use no máximo 5 tópicos (Objetivo, Tom, Elementos Obrigatórios, Formato).";
            try {
                resumoIa = geminiService.processarComIA(prompt, dto.briefingBruto(), null);
            } catch (Exception e) {
                resumoIa = "Erro ao gerar resumo da IA.";
            }
        }

        Projeto projeto = Projeto.builder()
                .clienteNome(dto.clienteNome())
                .nomeProjeto(dto.nomeProjeto())
                .videoUrl(dto.videoUrl())
                .briefingUrl(dto.briefingUrl())
                .briefingBruto(dto.briefingBruto())
                .resumoIa(resumoIa)
                .limiteRefacoes(dto.limiteRefacoes() != null ? dto.limiteRefacoes() : 3)
                .status(ProjetoStatus.PENDENTE)
                .magicToken(UUID.randomUUID().toString())
                .build();

        return projetoRepository.save(projeto);
    }

    @Transactional(readOnly = true)
    public List<Projeto> getAllProjects() {
        return projetoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Projeto getProjectByMagicToken(String magicToken) {
        return projetoRepository.findByMagicToken(magicToken)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com o token informado."));
    }

    @Transactional
    public Projeto regerarResumo(UUID id) {
        Projeto projeto = projetoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado"));

        if (projeto.getBriefingBruto() == null || projeto.getBriefingBruto().isBlank()) {
            projeto.setResumoIa(
                    "Não é possível regerar o resumo: o briefing original não foi encontrado para este projeto (provavelmente um projeto antigo).");
            return projetoRepository.save(projeto);
        }

        String novoResumo;
        try {
            novoResumo = geminiService.gerarResumoEstrategico(projeto.getBriefingBruto());
        } catch (Exception e) {
            log.error("Erro ao regerar resumo para o projeto {}: {}", id, e.getMessage());
            novoResumo = "Não foi possível gerar o resumo neste momento. Verifique a API de IA.";
        }

        projeto.setResumoIa(novoResumo);
        return projetoRepository.save(projeto);
    }
}
