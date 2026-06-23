package com.biblioteca.gerenciador.controller;

import com.biblioteca.gerenciador.model.Categoria;
import com.biblioteca.gerenciador.repository.CategoriaRepository;
import com.biblioteca.gerenciador.repository.LocalizacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaRepository categoriaRepository;
    private final LocalizacaoRepository localizacaoRepository;

    @GetMapping
    public ResponseEntity<List<Categoria>> listarCategorias() {
        List<String> sessoes = localizacaoRepository.findDistinctSessao();

        if (sessoes.isEmpty()) {
            return ResponseEntity.ok(categoriaRepository.findAll());
        }

        AtomicInteger idGen = new AtomicInteger(1);
        List<Categoria> categorias = sessoes.stream()
                .map(sessao -> new Categoria(idGen.getAndIncrement(), sessao))
                .collect(Collectors.toList());

        return ResponseEntity.ok(categorias);
    }
}