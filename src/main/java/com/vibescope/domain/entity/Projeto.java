package com.vibescope.domain.entity;

import com.vibescope.domain.enums.ProjetoStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "projeto")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Projeto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "cliente_nome", nullable = false)
    private String clienteNome;

    @Column(name = "nome_projeto", nullable = false)
    private String nomeProjeto;

    @Column(name = "video_url", length = 500, nullable = false)
    private String videoUrl;

    @Builder.Default
    @Column(name = "limite_refacoes")
    private Integer limiteRefacoes = 3;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private ProjetoStatus status;

    @Column(name = "briefing_url", length = 500)
    private String briefingUrl;

    @Column(name = "resumo_ia", columnDefinition = "TEXT")
    private String resumoIa;

    @Column(name = "magic_token", length = 100, unique = true, nullable = false, updatable = false)
    private String magicToken;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Builder.Default
    @OneToMany(mappedBy = "projeto", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RodadaRefacao> rodadas = new ArrayList<>();
}
