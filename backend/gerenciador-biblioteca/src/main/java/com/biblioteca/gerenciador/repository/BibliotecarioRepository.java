package com.biblioteca.gerenciador.repository;

import com.biblioteca.gerenciador.model.Bibliotecario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface BibliotecarioRepository extends JpaRepository<Bibliotecario, Integer> {
    Optional<Bibliotecario> findByRegistroFuncional(String registroFuncional);
}