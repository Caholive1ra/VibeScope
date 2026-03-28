package com.vibescope.domain.entity;

import com.vibescope.domain.enums.EsforcoTarefa;
import com.vibescope.domain.enums.StatusTarefa;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "tarefa_tecnica")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TarefaTecnica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rodada_id", nullable = false)
    private RodadaRefacao rodada;

    @Column(length = 20, nullable = false)
    private String timecode;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private EsforcoTarefa esforco;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_tarefa", length = 30)
    @Builder.Default
    private StatusTarefa statusTarefa = StatusTarefa.PENDENTE;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
