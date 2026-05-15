package com.biblioteca.gerenciador.controller;

import com.biblioteca.gerenciador.dto.LeitorRequestDTO;
import com.biblioteca.gerenciador.dto.LoginRequestDTO;
import com.biblioteca.gerenciador.dto.LoginResponseDTO;
import com.biblioteca.gerenciador.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GerenciadorUsuario {

    private final UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        LoginResponseDTO response = usuarioService.login(dto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/auto-cadastro")
    public ResponseEntity<?> solicitarAutoCadastro(@Valid @RequestBody LeitorRequestDTO dto) {
        try {
            usuarioService.solicitarAutoCadastro(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body("Cadastro realizado com sucesso");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrarLeitor(@Valid @RequestBody LeitorRequestDTO dto) {
        try {
            usuarioService.cadastrarLeitor(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body("Leitor cadastrado com sucesso");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/editar/{idLeitor}")
    public ResponseEntity<?> editarLeitor(@PathVariable int idLeitor, @Valid @RequestBody LeitorRequestDTO dto) {
        try {
            usuarioService.editarLeitor(idLeitor, dto);
            return ResponseEntity.ok().body("Leitor editado com sucesso");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/bloquear/{idLeitor}")
    public ResponseEntity<?> bloquearLeitor(@PathVariable int idLeitor) {
        try {
            usuarioService.bloquearLeitor(idLeitor);
            return ResponseEntity.ok().body("Leitor bloqueado com sucesso");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/desbloquear/{idLeitor}")
    public ResponseEntity<?> desbloquearLeitor(@PathVariable int idLeitor) {
        try {
            usuarioService.desbloquearLeitor(idLeitor);
            return ResponseEntity.ok().body("Leitor desbloqueado com sucesso");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/aprovar/{idLeitor}")
    public ResponseEntity<?> aprovarLeitor(@PathVariable int idLeitor) {
        try {
            usuarioService.aprovarLeitor(idLeitor);
            return ResponseEntity.ok().body("Leitor aprovado com sucesso");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}