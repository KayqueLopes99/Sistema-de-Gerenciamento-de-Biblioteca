package com.biblioteca.gerenciador.controller;

import com.biblioteca.gerenciador.model.Avaliacao;
import com.biblioteca.gerenciador.service.AvaliacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
}