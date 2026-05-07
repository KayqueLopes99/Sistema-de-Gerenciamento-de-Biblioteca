package com.biblioteca.gerenciador.repository;

import com.biblioteca.gerenciador.model.Leitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface LeitorRepository extends JpaRepository<Leitor, Integer> {
    Optional<Leitor> findByCpf(String cpf);
    Optional<Leitor> findByEmail(String email);
}