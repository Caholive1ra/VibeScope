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

    @Transactional
    public Projeto createProject(ProjetoCreateDTO dto) {
        Projeto projeto = Projeto.builder()
                .clienteNome(dto.clienteNome())
                .nomeProjeto(dto.nomeProjeto())
                .videoUrl(dto.videoUrl())
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
