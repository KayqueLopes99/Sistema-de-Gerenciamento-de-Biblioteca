package com.biblioteca.gerenciador.service;

import com.biblioteca.gerenciador.model.Favorito;
import com.biblioteca.gerenciador.model.Leitor;
import com.biblioteca.gerenciador.model.Obra;
import com.biblioteca.gerenciador.repository.FavoritoRepository;
import com.biblioteca.gerenciador.repository.LeitorRepository;
import com.biblioteca.gerenciador.repository.ObraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;
    private final LeitorRepository leitorRepository;
    private final ObraRepository obraRepository;

    @Transactional
    public void adicionarFavorito(int idLeitor, int idObra) {
        Leitor leitor = leitorRepository.findById(idLeitor)
                .orElseThrow(() -> new RuntimeException("Leitor não encontrado"));
        Obra obra = obraRepository.findById(idObra)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));

        if (favoritoRepository.findByLeitorIdUsuarioAndObraIdObra(idLeitor, idObra).isPresent()) {
            throw new RuntimeException("Livro já está nos favoritos");
        }

        Favorito favorito = new Favorito();
        favorito.setLeitor(leitor);
        favorito.setObra(obra);
        favoritoRepository.save(favorito);
    }

    @Transactional
    public void removerFavorito(int idLeitor, int idObra) {
        favoritoRepository.deleteByLeitorIdUsuarioAndObraIdObra(idLeitor, idObra);
    }

    public List<Favorito> listarFavoritos(int idLeitor) {
        return favoritoRepository.findByLeitorIdUsuario(idLeitor);
    }

    public boolean isFavorito(int idLeitor, int idObra) {
        return favoritoRepository.findByLeitorIdUsuarioAndObraIdObra(idLeitor, idObra).isPresent();
    }
}