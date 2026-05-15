package com.biblioteca.gerenciador.controller;

import com.biblioteca.gerenciador.dto.DisponibilidadeDTO;
import com.biblioteca.gerenciador.dto.ExemplarRequestDTO;
import com.biblioteca.gerenciador.dto.LocalizacaoRequestDTO;
import com.biblioteca.gerenciador.dto.ObraRequestDTO;
import com.biblioteca.gerenciador.model.Obra;
import com.biblioteca.gerenciador.service.ExemplarService;
import com.biblioteca.gerenciador.service.LocalizacaoService;
import com.biblioteca.gerenciador.service.ObraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/acervo")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GerenciadorAcervo {

    private final ObraService obraService;
    private final ExemplarService exemplarService;
    private final LocalizacaoService localizacaoService;

    @PostMapping("/obras")
    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    public ResponseEntity<Void> cadastrarObra(@Valid @RequestBody ObraRequestDTO dto) {
        obraService.cadastrarObra(dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Obra>> buscar(
            @RequestParam(required = false) String termo,
            @RequestParam(required = false) Integer ano, 
            @RequestParam(required = false) String categoria, 
            @RequestParam(defaultValue = "false") boolean emAlta 
    ) {
        return ResponseEntity.ok(obraService.buscarObrasAvancada(termo, ano, categoria, emAlta));
    }

    @PutMapping("/obras/{id}")
    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    public ResponseEntity<Void> editarObra(@PathVariable int id, @Valid @RequestBody ObraRequestDTO dto) {
        obraService.editarObra(id, dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/obras/{id}")
    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    public ResponseEntity<Void> removerObra(@PathVariable int id) {
        obraService.removerObra(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/exemplares")
    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    public ResponseEntity<Void> cadastrarExemplar(@Valid @RequestBody ExemplarRequestDTO dto) {
        exemplarService.cadastrarExemplar(dto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/exemplares/{id}")
    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    public ResponseEntity<Void> editarExemplar(@PathVariable int id, @Valid @RequestBody ExemplarRequestDTO dto) {
        exemplarService.editarExemplar(id, dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/exemplares/{id}")
    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    public ResponseEntity<Void> removerExemplar(@PathVariable int id) {
        exemplarService.removerExemplar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/localizacoes")
    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    public ResponseEntity<Void> cadastrarLocalizacao(@Valid @RequestBody LocalizacaoRequestDTO dto) {
        localizacaoService.cadastrarLocalizacao(dto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/localizacoes/{id}")
    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    public ResponseEntity<Void> editarLocalizacao(@PathVariable int id, @Valid @RequestBody LocalizacaoRequestDTO dto) {
        localizacaoService.editarLocalizacao(id, dto);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/exemplares/{idExemplar}/localizacao/{idLocalizacao}")
    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    public ResponseEntity<Void> associarLocalizacao(
            @PathVariable int idExemplar,
            @PathVariable int idLocalizacao) {

        exemplarService.associarLocalizacao(idExemplar, idLocalizacao);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/obras/{idObra}/disponibilidade")
    public ResponseEntity<DisponibilidadeDTO> verificarDisponibilidade(@PathVariable int idObra) {
        return ResponseEntity.ok(exemplarService.consultarDisponibilidade(idObra));
    }
}