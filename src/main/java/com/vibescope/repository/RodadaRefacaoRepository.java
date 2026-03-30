package com.vibescope.repository;

import com.vibescope.domain.entity.RodadaRefacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RodadaRefacaoRepository extends JpaRepository<RodadaRefacao, Long> {
    Optional<RodadaRefacao> findByIdAndProjetoId(Long id, UUID projetoId);

    List<RodadaRefacao> findByProjetoMagicTokenOrderByNumeroRodadaDesc(String magicToken);

    long countByProjetoId(UUID projetoId);
}
