package com.vibescope.repository;

import com.vibescope.domain.entity.RodadaRefacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RodadaRefacaoRepository extends JpaRepository<RodadaRefacao, Long> {
}
