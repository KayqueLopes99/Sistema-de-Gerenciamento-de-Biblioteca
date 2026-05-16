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
    

    List<Emprestimo> findByLeitorOrderByDataEmprestimoDesc(Leitor leitor);
    

    List<Emprestimo> findByLeitorAndDataDevolucaoRealIsNullOrderByDataDevolucaoPrevistaAsc(Leitor leitor);
    
    
    Optional<Emprestimo> findByExemplar_IdExemplarAndDataDevolucaoRealIsNull(int idExemplar);
    
  
    long countByLeitorAndDataDevolucaoRealIsNull(Leitor leitor);
    
    @Query("SELECT e FROM Emprestimo e WHERE e.dataDevolucaoReal IS NULL AND e.dataDevolucaoPrevista < :dataAtual")
    List<Emprestimo> findEmprestimosVencidos(@Param("dataAtual") LocalDate dataAtual);
    

    Optional<Emprestimo> findById(int id);

   


}
