package com.vibescope.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rodada_refacao")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RodadaRefacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projeto_id", nullable = false)
    private Projeto projeto;

    @Column(name = "numero_rodada", nullable = false)
    private Integer numeroRodada;

    @Column(name = "feedback_bruto", columnDefinition = "TEXT")
    private String feedbackBruto;

    @Builder.Default
    @Column(name = "consumiu_escopo")
    private Boolean consumiuEscopo = true;

    @Column(name = "prazo_entrega")
    private LocalDateTime prazoEntrega;

    @Column(name = "data_conclusao")
    private LocalDateTime dataConclusao;

    @Column(name = "video_url_entrega", length = 500)
    private String videoUrlEntrega;

    @Column(name = "observacoes_editor", columnDefinition = "TEXT")
    private String observacoesEditor;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Builder.Default
    @OneToMany(mappedBy = "rodada", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AnexoFeedback> anexos = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "rodada", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TarefaTecnica> tarefas = new ArrayList<>();
}
