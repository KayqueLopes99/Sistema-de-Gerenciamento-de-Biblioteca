package com.biblioteca.gerenciador.service;

import com.biblioteca.gerenciador.dto.LocalizacaoRequestDTO;
import com.biblioteca.gerenciador.model.Localizacao;
import com.biblioteca.gerenciador.repository.LocalizacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LocalizacaoService {

    private final LocalizacaoRepository localizacaoRepository;

    @Transactional
    public void cadastrarLocalizacao(LocalizacaoRequestDTO dto) {
        Localizacao loc = new Localizacao();
        loc.setSala(dto.getSala());
        loc.setEstante(dto.getEstante());
        loc.setSessao(dto.getSessao());
        loc.setDescricao(dto.getDescricao());

        localizacaoRepository.save(loc);
    }

    @Transactional
    public void editarLocalizacao(int id, LocalizacaoRequestDTO dto) {
        Localizacao loc = localizacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Localização não encontrada"));

        loc.setSala(dto.getSala());
        loc.setEstante(dto.getEstante());
        loc.setSessao(dto.getSessao());
        loc.setDescricao(dto.getDescricao());

        localizacaoRepository.save(loc);
    }

    public List<Localizacao> listarTodas() {
        return localizacaoRepository.findAll();
    }
}