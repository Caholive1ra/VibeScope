package com.vibescope.repository;

import com.vibescope.domain.entity.TarefaTecnica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TarefaTecnicaRepository extends JpaRepository<TarefaTecnica, Long> {
    List<TarefaTecnica> findByRodadaId(Long rodadaId);
}
