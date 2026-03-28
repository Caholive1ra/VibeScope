package com.vibescope.controller;

import com.vibescope.domain.entity.Projeto;
import com.vibescope.dto.ProjetoCreateDTO;
import com.vibescope.service.ProjetoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/projetos")
@RequiredArgsConstructor
public class ProjetoController {

    private final ProjetoService projetoService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Projeto createProject(@RequestBody ProjetoCreateDTO dto) {
        return projetoService.createProject(dto);
    }

    @GetMapping("/magic/{magic_token}")
    public Projeto getProjectByMagicToken(@PathVariable("magic_token") String magicToken) {
        return projetoService.getProjectByMagicToken(magicToken);
    }
}
