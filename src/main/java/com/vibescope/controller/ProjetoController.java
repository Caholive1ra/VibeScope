package com.vibescope.controller;

import com.vibescope.domain.entity.Projeto;
import com.vibescope.dto.EntregarRodadaRequestDTO;
import com.vibescope.dto.ProjetoRequestDTO;
import com.vibescope.dto.TimelineItemDTO;
import com.vibescope.service.ProjetoService;
import com.vibescope.service.TarefaService;
import com.vibescope.domain.entity.TarefaTecnica;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/projetos")
@RequiredArgsConstructor
public class ProjetoController {

    private final ProjetoService projetoService;
    private final TarefaService tarefaService;

    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    public Projeto createProject(@RequestBody ProjetoRequestDTO dto) {
        return projetoService.criarProjetoComResumo(dto);
    }

    @GetMapping
    public List<Projeto> getAllProjects() {
        return projetoService.getAllProjects();
    }

    @GetMapping("/{id}")
    public Projeto getProjectById(@PathVariable("id") UUID id) {
        return projetoService.getProjectById(id);
    }

    @GetMapping("/magic/{magic_token}")
    public Projeto getProjectByMagicToken(@PathVariable("magic_token") String magicToken) {
        return projetoService.getProjectByMagicToken(magicToken);
    }

    @GetMapping("/magic/{magic_token}/timeline")
    public List<TimelineItemDTO> getTimelineByMagicToken(@PathVariable("magic_token") String magicToken) {
        return projetoService.getTimelineByMagicToken(magicToken);
    }

    @GetMapping("/{id}/rodadas/{rodada_id}/tarefas")
    public List<TarefaTecnica> getTarefasDaRodada(
            @PathVariable("id") UUID projetoId,
            @PathVariable("rodada_id") Long rodadaId) {
        return tarefaService.getTarefasByRodada(rodadaId);
    }

    @PostMapping("/{id}/resumo")
    public Projeto rethinkProjectSummary(@PathVariable("id") UUID id) {
        return projetoService.regerarResumo(id);
    }

    @PostMapping("/{id}/rodadas/{rodada_id}/entrega")
    public Projeto entregarRodada(
            @PathVariable("id") UUID id,
            @PathVariable("rodada_id") Long rodadaId,
            @RequestBody EntregarRodadaRequestDTO dto) {
        return projetoService.entregarRodada(id, rodadaId, dto);
    }
}
