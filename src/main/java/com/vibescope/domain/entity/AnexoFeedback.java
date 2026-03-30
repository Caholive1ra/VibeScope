package com.vibescope.domain.entity;

import com.vibescope.domain.enums.TipoMidia;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "anexo_feedback")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnexoFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rodada_id", nullable = false)
    private RodadaRefacao rodada;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_midia", length = 20)
    private TipoMidia tipoMidia;

    @Column(name = "url_arquivo", length = 500, nullable = false)
    private String urlArquivo;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
