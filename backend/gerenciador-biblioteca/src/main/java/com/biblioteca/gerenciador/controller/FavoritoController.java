package com.biblioteca.gerenciador.controller;

import com.biblioteca.gerenciador.model.Favorito;
import com.biblioteca.gerenciador.service.FavoritoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.biblioteca.gerenciador.repository.LeitorRepository;
import java.util.List;

@RestController
@RequestMapping("/api/favoritos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FavoritoController {

    private final FavoritoService favoritoService;
    private final LeitorRepository leitorRepository;

    private int getCurrentLeitorId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return leitorRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Leitor não encontrado"))
                .getIdUsuario();
    }

    @GetMapping
    public ResponseEntity<List<Favorito>> listarFavoritos() {
        int idLeitor = getCurrentLeitorId();
        return ResponseEntity.ok(favoritoService.listarFavoritos(idLeitor));
    }

    @PostMapping("/{idObra}")
    public ResponseEntity<Void> adicionarFavorito(@PathVariable int idObra) {
        int idLeitor = getCurrentLeitorId();
        favoritoService.adicionarFavorito(idLeitor, idObra);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{idObra}")
    public ResponseEntity<Void> removerFavorito(@PathVariable int idObra) {
        int idLeitor = getCurrentLeitorId();
        favoritoService.removerFavorito(idLeitor, idObra);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check/{idObra}")
    public ResponseEntity<Boolean> isFavorito(@PathVariable int idObra) {
        int idLeitor = getCurrentLeitorId();
        return ResponseEntity.ok(favoritoService.isFavorito(idLeitor, idObra));
    }
}