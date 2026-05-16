package com.biblioteca.gerenciador.repository;

import com.biblioteca.gerenciador.model.Emprestimo;
import com.biblioteca.gerenciador.model.Leitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmprestimoRepository extends JpaRepository<Emprestimo, Integer> {
    
    // RF18 - Histórico completo de empréstimos de um leitor
    List<Emprestimo> findByLeitorOrderByDataEmprestimoDesc(Leitor leitor);
    
    // RF26 - Empréstimos ativos (sem data de devolução real)
    List<Emprestimo> findByLeitorAndDataDevolucaoRealIsNullOrderByDataDevolucaoPrevistaAsc(Leitor leitor);
    
    // Verificar se leitor tem empréstimo ativo com um exemplar específico
    Optional<Emprestimo> findByExemplar_IdExemplarAndDataDevolucaoRealIsNull(int idExemplar);
    
    // Verificar se leitor tem empréstimos ativos (para bloquear novos empréstimos)
    long countByLeitorAndDataDevolucaoRealIsNull(Leitor leitor);
    
    // Empréstimos com data de devolução prevista vencida
    @Query("SELECT e FROM Emprestimo e WHERE e.dataDevolucaoReal IS NULL AND e.dataDevolucaoPrevista < :dataAtual")
    List<Emprestimo> findEmprestimosVencidos(@Param("dataAtual") LocalDate dataAtual);
    
    // Buscar empréstimo por ID com leitor e exemplar carregados
    Optional<Emprestimo> findById(int id);
}