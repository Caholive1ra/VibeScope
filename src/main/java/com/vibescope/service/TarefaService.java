package com.vibescope.service;

import com.vibescope.domain.entity.TarefaTecnica;
import com.vibescope.repository.TarefaTecnicaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TarefaService {

    private final TarefaTecnicaRepository tarefaTecnicaRepository;

    @Transactional(readOnly = true)
    public List<TarefaTecnica> getTarefasByRodada(Long rodadaId) {
        return tarefaTecnicaRepository.findByRodadaId(rodadaId);
    }
}
