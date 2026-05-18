package com.biblioteca.gerenciador.controller;

import com.biblioteca.gerenciador.dto.AvaliacaoRequestDTO;
import com.biblioteca.gerenciador.model.Avaliacao;
import com.biblioteca.gerenciador.service.AvaliacaoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/avaliacoes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GerenciadorAvaliacao {

    private final AvaliacaoService avaliacaoService;

    @GetMapping("/obra/{idObra}")
    public ResponseEntity<List<Avaliacao>> visualizarAvaliacoes(@PathVariable int idObra) {
        return ResponseEntity.ok(avaliacaoService.visualizarAvaliacoes(idObra));
    }

    @PostMapping("/obra/{idObra}")
    public ResponseEntity<Void> avaliarLivro(
            @PathVariable int idObra,
            @Valid @RequestBody AvaliacaoRequestDTO dto) {
        
        String emailLogado = SecurityContextHolder.getContext().getAuthentication().getName();
        
        avaliacaoService.avaliarLivro(idObra, emailLogado, dto);
        return ResponseEntity.ok().build();
    }
}