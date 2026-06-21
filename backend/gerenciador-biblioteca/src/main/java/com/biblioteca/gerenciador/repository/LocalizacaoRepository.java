package com.biblioteca.gerenciador.repository;

import com.biblioteca.gerenciador.model.Localizacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocalizacaoRepository extends JpaRepository<Localizacao, Integer> {

    @Query("SELECT DISTINCT l.sessao FROM Localizacao l WHERE l.sessao IS NOT NULL AND l.sessao <> ''")
    List<String> findDistinctSessao();
}