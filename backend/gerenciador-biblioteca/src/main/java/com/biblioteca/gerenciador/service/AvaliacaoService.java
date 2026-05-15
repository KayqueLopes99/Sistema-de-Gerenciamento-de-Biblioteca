package com.biblioteca.gerenciador.service;

import java.util.List;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.biblioteca.gerenciador.model.Avaliacao;
import com.biblioteca.gerenciador.repository.AvaliacaoRepository;


@Service
@RequiredArgsConstructor
public class AvaliacaoService {

    private final AvaliacaoRepository avaliacaoRepository;

    public List<Avaliacao> visualizarAvaliacoes(int idObra) {
        return avaliacaoRepository.findByObraIdObra(idObra);
    }
}