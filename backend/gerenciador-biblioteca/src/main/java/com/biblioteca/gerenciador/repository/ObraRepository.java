package com.biblioteca.gerenciador.repository;

import com.biblioteca.gerenciador.model.Obra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ObraRepository extends JpaRepository<Obra, Integer> {

    List<Obra> findByTituloContainingIgnoreCase(String titulo);
    Optional<Obra> findByIsbn(String isbn);
    List<Obra> findByAutorContainingIgnoreCase(String autor);
    List<Obra> findByAnoPublicacao(int ano);
    List<Obra> findByCategoriasNomeContainingIgnoreCase(String categoria);
  
    @Query("SELECT o FROM Obra o " +
           "LEFT JOIN Exemplar ex ON ex.obra.idObra = o.idObra " +
           "LEFT JOIN Emprestimo e ON e.exemplar.idExemplar = ex.idExemplar " +
           "LEFT JOIN Reserva r ON r.obra.idObra = o.idObra " +
           "GROUP BY o.idObra " +
           "ORDER BY (COUNT(e) + COUNT(r)) DESC")
    List<Obra> findLivrosEmAlta();

    
}