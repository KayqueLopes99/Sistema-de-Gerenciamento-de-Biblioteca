package com.biblioteca.gerenciador.repository;

import com.biblioteca.gerenciador.model.Favorito;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FavoritoRepository extends JpaRepository<Favorito, Integer> {
    List<Favorito> findByLeitorIdUsuario(int idLeitor);
    Optional<Favorito> findByLeitorIdUsuarioAndObraIdObra(int idLeitor, int idObra);
    void deleteByLeitorIdUsuarioAndObraIdObra(int idLeitor, int idObra);
    long countByObraIdObra(int idObra);
}