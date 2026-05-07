package com.biblioteca.gerenciador.repository;

import com.biblioteca.gerenciador.model.Obra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ObraRepository extends JpaRepository<Obra, Integer> {
    List<Obra> findByTituloContainingIgnoreCase(String titulo);
    Optional<Obra> findByIsbn(String isbn);
    List<Obra> findByAutorContainingIgnoreCase(String autor);
}