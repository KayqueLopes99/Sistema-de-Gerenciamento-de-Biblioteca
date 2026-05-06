package com.biblioteca.gerenciador.repository;

import com.biblioteca.gerenciador.model.Leitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeitorRepository extends JpaRepository<Leitor, Integer> {
}