package com.biblioteca.gerenciador.controller;

import com.biblioteca.gerenciador.dto.ObraRequestDTO;
import com.biblioteca.gerenciador.model.Exemplar;
import com.biblioteca.gerenciador.model.Localizacao;
import com.biblioteca.gerenciador.model.Obra;
import com.biblioteca.gerenciador.service.ObraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/acervo")
@RequiredArgsConstructor
public class GerenciadorAcervo {

    private final ObraService obraService;

    @PostMapping("/obras")
    public ResponseEntity<Void> cadastrarObra(@Valid @RequestBody ObraRequestDTO dto) {
        obraService.cadastrarObra(dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Obra>> buscarObras(@RequestParam String termo) {
        return ResponseEntity.ok(obraService.buscarObras(termo));
    }

}