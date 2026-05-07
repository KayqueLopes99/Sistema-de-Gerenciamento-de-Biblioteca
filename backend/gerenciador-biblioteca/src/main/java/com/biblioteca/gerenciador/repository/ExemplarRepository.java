package com.biblioteca.gerenciador.repository;

import com.biblioteca.gerenciador.model.Exemplar;
import com.biblioteca.gerenciador.enums.StatusExemplar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExemplarRepository extends JpaRepository<Exemplar, Integer> {
    List<Exemplar> findByObra_IdObra(int idObra);
    List<Exemplar> findByStatus(StatusExemplar status);
}