package com.biblioteca.gerenciador.service;

import com.biblioteca.gerenciador.dto.DisponibilidadeDTO;
import com.biblioteca.gerenciador.dto.ExemplarRequestDTO;
import com.biblioteca.gerenciador.enums.StatusExemplar;
import com.biblioteca.gerenciador.model.Exemplar;
import com.biblioteca.gerenciador.model.Localizacao;
import com.biblioteca.gerenciador.model.Obra;
import com.biblioteca.gerenciador.repository.ExemplarRepository;
import com.biblioteca.gerenciador.repository.LocalizacaoRepository;
import com.biblioteca.gerenciador.repository.ObraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExemplarService {

    private final ExemplarRepository exemplarRepository;
    private final ObraRepository obraRepository;
    private final LocalizacaoRepository localizacaoRepository;

    @Transactional
    public void cadastrarExemplar(ExemplarRequestDTO dto) {
        if (exemplarRepository.findByCodigoBarras(dto.getCodigoBarras()).isPresent()) {
            throw new RuntimeException("Código de barras já cadastrado");
        }

        Obra obra = obraRepository.findById(dto.getIdObra())
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        
        Localizacao localizacao = localizacaoRepository.findById(dto.getIdLocalizacao())
                .orElseThrow(() -> new RuntimeException("Localização não encontrada"));

        Exemplar exemplar = new Exemplar();
        exemplar.setCodigoBarras(dto.getCodigoBarras());
        exemplar.setEstadoConservacao(dto.getEstadoConservacao());
        exemplar.setStatus(dto.getStatus());
        exemplar.setObra(obra);
        exemplar.setLocalizacao(localizacao);

        exemplarRepository.save(exemplar);
    }

    @Transactional
    public void editarExemplar(int id, ExemplarRequestDTO dto) {
        Exemplar exemplar = exemplarRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exemplar não encontrado"));

        exemplarRepository.findByCodigoBarras(dto.getCodigoBarras()).ifPresent(outroExemplar -> {
            if (outroExemplar.getIdExemplar() != id) {
                throw new RuntimeException("Este código de barras já pertence a outro exemplar");
            }
        });

        Obra obra = obraRepository.findById(dto.getIdObra())
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        
        Localizacao localizacao = localizacaoRepository.findById(dto.getIdLocalizacao())
                .orElseThrow(() -> new RuntimeException("Localização não encontrada"));

        exemplar.setCodigoBarras(dto.getCodigoBarras());
        exemplar.setEstadoConservacao(dto.getEstadoConservacao());
        exemplar.setStatus(dto.getStatus());
        exemplar.setObra(obra);
        exemplar.setLocalizacao(localizacao);

        exemplarRepository.save(exemplar);
    }

    @Transactional
    public void removerExemplar(int id) {
        if (!exemplarRepository.existsById(id)) {
            throw new RuntimeException("Exemplar não encontrado para remoção");
        }
        exemplarRepository.deleteById(id);
    }

    public List<Exemplar> listarTodos() {
        return exemplarRepository.findAll();
    }

    @Transactional
    public void associarLocalizacao(int idExemplar, int idLocalizacao) {
        Exemplar exemplar = exemplarRepository.findById(idExemplar)
                .orElseThrow(() -> new RuntimeException("Exemplar não encontrado"));

        Localizacao localizacao = localizacaoRepository.findById(idLocalizacao)
                .orElseThrow(() -> new RuntimeException("Localização não encontrada"));

        exemplar.setLocalizacao(localizacao);
        
        exemplarRepository.save(exemplar);
    }

    public DisponibilidadeDTO consultarDisponibilidade(int idObra) {
        // Busca todos os exemplares disponíveis para aquela obra
        List<Exemplar> exemplaresDisponiveis = exemplarRepository.findByObraIdObraAndStatus(idObra, StatusExemplar.DISPONIVEL);

        boolean estaDisponivel = !exemplaresDisponiveis.isEmpty();
        
        // Mapeia a localização de cada exemplar disponível em uma lista de strings
        List<String> localizacoes = exemplaresDisponiveis.stream()
            .map(ex -> {
                Localizacao loc = ex.getLocalizacao();
                return String.format("%s, %s, %s", loc.getSala(), loc.getEstante(), loc.getSessao());
            })
            .distinct() // Evita repetir a mesma localização se houver vários exemplares no mesmo lugar
            .toList();

        return new DisponibilidadeDTO(estaDisponivel, localizacoes);
    }
}