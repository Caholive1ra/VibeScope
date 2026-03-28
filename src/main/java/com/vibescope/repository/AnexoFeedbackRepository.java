package com.vibescope.repository;

import com.vibescope.domain.entity.AnexoFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AnexoFeedbackRepository extends JpaRepository<AnexoFeedback, UUID> {
}
