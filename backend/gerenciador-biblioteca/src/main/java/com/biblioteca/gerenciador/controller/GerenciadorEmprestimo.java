package com.biblioteca.gerenciador.controller;

import com.biblioteca.gerenciador.dto.RenovacaoRequestDTO;
import com.biblioteca.gerenciador.model.Emprestimo;
import com.biblioteca.gerenciador.service.EmprestimoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/emprestimos")
@RequiredArgsConstructor
public class GerenciadorEmprestimo {

    private final EmprestimoService emprestimoService;


    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    @GetMapping("/leitor/{idLeitor}/historico")
    public ResponseEntity<?> consultarHistoricoLeitor(@PathVariable int idLeitor) {
        try {
            List<Emprestimo> emprestimos = emprestimoService.consultarHistoricoLeitor(idLeitor);
            return ResponseEntity.ok(emprestimos);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    @PreAuthorize("hasRole('LEITOR')")
    @GetMapping("/meus-emprestimos/{idLeitor}")
    public ResponseEntity<?> consultarMeusEmprestimos(@PathVariable int idLeitor) {
        try {
            List<Emprestimo> emprestimos = emprestimoService.consultarMeusEmprestimos(idLeitor);
            return ResponseEntity.ok(emprestimos);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    @PreAuthorize("hasRole('LEITOR')")
    @PutMapping("/solicitar-renovacao")
    public ResponseEntity<?> solicitarRenovacao(@Valid @RequestBody RenovacaoRequestDTO dto) {
        try {
            emprestimoService.solicitarRenovacao(dto);
            return ResponseEntity.ok().body("Renovação solicitada com sucesso");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    @PostMapping("/realizar")
    public ResponseEntity<?> realizarEmprestimo(@RequestParam int idLeitor, @RequestParam int idExemplar) {
        try {
            emprestimoService.realizarEmprestimo(idLeitor, idExemplar);
            return ResponseEntity.ok().body("Empréstimo realizado com sucesso");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    @PreAuthorize("hasAnyRole('BIBLIOTECARIO', 'LEITOR')")
    @PostMapping("/reservar")
    public ResponseEntity<?> registrarReserva(@RequestParam int idLeitor, @RequestParam int idObra) {
        try {
            emprestimoService.registrarReserva(idLeitor, idObra);
            return ResponseEntity.ok().body("Reserva realizada com sucesso");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    @PreAuthorize("hasRole('BIBLIOTECARIO')")
    @PutMapping("/devolucao/{idExemplar}")
    public ResponseEntity<?> registrarDevolucao(@PathVariable int idExemplar) {
        try {
            double multa = emprestimoService.registrarDevolucao(idExemplar);
            if (multa > 0) {
                return ResponseEntity.ok().body("Devolução registrada com sucesso. Multa: R$ " + String.format("%.2f", multa));
            }
            return ResponseEntity.ok().body("Devolução registrada com sucesso. Sem multa.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}