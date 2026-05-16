package com.biblioteca.gerenciador.service;

import com.biblioteca.gerenciador.dto.RenovacaoRequestDTO;
import com.biblioteca.gerenciador.enums.StatusExemplar;
import com.biblioteca.gerenciador.enums.StatusLeitor;
import com.biblioteca.gerenciador.model.Emprestimo;
import com.biblioteca.gerenciador.model.Exemplar;
import com.biblioteca.gerenciador.model.Leitor;
import com.biblioteca.gerenciador.model.Reserva;
import com.biblioteca.gerenciador.repository.EmprestimoRepository;
import com.biblioteca.gerenciador.repository.ExemplarRepository;
import com.biblioteca.gerenciador.repository.LeitorRepository;
import com.biblioteca.gerenciador.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmprestimoService {

    private final EmprestimoRepository emprestimoRepository;
    private final ExemplarRepository exemplarRepository;
    private final LeitorRepository leitorRepository;
    private final ReservaRepository reservaRepository;

    private static final int DIAS_EMPReSTIMO = 14; 
    private static final int MAX_RENOVACOES = 2;  
    private static final int DIAS_RENOVACAO = 7;   
    private static final int MAX_EMPRESTIMOS_ATIVOS = 5;

    @Transactional(readOnly = true)
    public List<Emprestimo> consultarHistoricoLeitor(int idLeitor) {
        Leitor leitor = leitorRepository.findById(idLeitor)
                .orElseThrow(() -> new RuntimeException("Leitor não encontrado"));
        
        return emprestimoRepository.findByLeitorOrderByDataEmprestimoDesc(leitor);
    }


    @Transactional(readOnly = true)
    public List<Emprestimo> consultarMeusEmprestimos(int idLeitor) {
        Leitor leitor = leitorRepository.findById(idLeitor)
                .orElseThrow(() -> new RuntimeException("Leitor não encontrado"));
        
        if (leitor.getStatusLeitor() == StatusLeitor.SUSPENSO) {

            System.out.println("Aviso: Leitor está suspenso até " + leitor.getDataFimSuspensao());
        }
        
        return emprestimoRepository.findByLeitorAndDataDevolucaoRealIsNullOrderByDataDevolucaoPrevistaAsc(leitor);
    }

    @Transactional
    public void solicitarRenovacao(RenovacaoRequestDTO dto) {
        Emprestimo emprestimo = emprestimoRepository.findById(dto.getIdEmprestimo())
                .orElseThrow(() -> new RuntimeException("Empréstimo não encontrado"));
        
        // Verifica se o empréstimo pertence ao leitor (segurança)
        if (emprestimo.getLeitor().getIdUsuario() != dto.getIdLeitor()) {
            throw new RuntimeException("Este empréstimo não pertence ao leitor informado");
        }
        
     
        if (emprestimo.getDataDevolucaoReal() != null) {
            throw new RuntimeException("Este empréstimo já foi devolvido");
        }
        
    
        Leitor leitor = emprestimo.getLeitor();
        if (leitor.getStatusLeitor() == StatusLeitor.SUSPENSO) {
            throw new RuntimeException("Leitor está suspenso. Não é possível renovar.");
        }
        
       
        if (emprestimo.getQuantidadeRenovacoes() >= MAX_RENOVACOES) {
            throw new RuntimeException("Limite de renovações atingido (máximo " + MAX_RENOVACOES + " renovações)");
        }
        
   
        boolean temReservaAtiva = reservaRepository.existsByObraAndStatus(
            emprestimo.getExemplar().getObra(), 
            com.biblioteca.gerenciador.enums.StatusReserva.PENDENTE
        );
        if (temReservaAtiva) {
            throw new RuntimeException("Não é possível renovar. O livro está reservado por outro leitor.");
        }
        
   
        emprestimo.setQuantidadeRenovacoes(emprestimo.getQuantidadeRenovacoes() + 1);
        emprestimo.setDataDevolucaoPrevista(emprestimo.getDataDevolucaoPrevista().plusDays(DIAS_RENOVACAO));
        
        emprestimoRepository.save(emprestimo);
    }

    @Transactional
    public void realizarEmprestimo(int idLeitor, int idExemplar) {
        Leitor leitor = leitorRepository.findById(idLeitor)
                .orElseThrow(() -> new RuntimeException("Leitor não encontrado"));
        
        Exemplar exemplar = exemplarRepository.findById(idExemplar)
                .orElseThrow(() -> new RuntimeException("Exemplar não encontrado"));
        
   
        if (leitor.getStatusLeitor() != StatusLeitor.ATIVO) {
            throw new RuntimeException("Leitor não está ativo para realizar empréstimos");
        }

            long emprestimosAtivos = emprestimoRepository.countByLeitorAndDataDevolucaoRealIsNull(leitor);
            if (emprestimosAtivos >= MAX_EMPRESTIMOS_ATIVOS) {
                throw new RuntimeException("Limite de empréstimos ativos atingido (máximo " + MAX_EMPRESTIMOS_ATIVOS + " livros)");
            }
                    
        // Verifica se leitor tem suspensão ativa
        if (leitor.getDataFimSuspensao() != null && leitor.getDataFimSuspensao().isAfter(LocalDate.now())) {
            throw new RuntimeException("Leitor está suspenso até " + leitor.getDataFimSuspensao());
        }
        
     
        if (exemplar.getStatus() != StatusExemplar.DISPONIVEL) {
            throw new RuntimeException("Exemplar não está disponível para empréstimo");
        }
        
  
        boolean jaTemEmprestimo = emprestimoRepository
            .findByExemplar_IdExemplarAndDataDevolucaoRealIsNull(idExemplar)
            .isPresent();
        if (jaTemEmprestimo) {
            throw new RuntimeException("Leitor já possui este livro emprestado");
        }
        
    
        Emprestimo emprestimo = new Emprestimo();
        emprestimo.setLeitor(leitor);
        emprestimo.setExemplar(exemplar);
        emprestimo.setDataEmprestimo(LocalDate.now());
        emprestimo.setDataDevolucaoPrevista(LocalDate.now().plusDays(DIAS_EMPReSTIMO));
        emprestimo.setQuantidadeRenovacoes(0);
        emprestimo.setDiasSuspensao(0);
        
       
        exemplar.setStatus(StatusExemplar.EMPRESTADO);
        exemplarRepository.save(exemplar);
        
        emprestimoRepository.save(emprestimo);
    }
}