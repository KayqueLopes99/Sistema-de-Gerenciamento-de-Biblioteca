package com.biblioteca.gerenciador.service;

import com.biblioteca.gerenciador.dto.ObraRequestDTO;
import com.biblioteca.gerenciador.model.Avaliacao;
import com.biblioteca.gerenciador.model.Categoria;
import com.biblioteca.gerenciador.model.Obra;
import com.biblioteca.gerenciador.repository.AvaliacaoRepository;
import com.biblioteca.gerenciador.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import com.biblioteca.gerenciador.repository.ObraRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ObraService {

    private final ObraRepository obraRepository;
    private final CategoriaRepository categoriaRepository;
    private final AvaliacaoRepository avaliacaoRepository;

    @Transactional
    public void cadastrarObra(ObraRequestDTO dto) {
        if (obraRepository.findByIsbn(dto.getIsbn()).isPresent()) {
            throw new RuntimeException("ISBN já cadastrado");
        }

        Obra obra = new Obra();
        obra.setTitulo(dto.getTitulo());
        obra.setAutor(dto.getAutor());
        obra.setIsbn(dto.getIsbn());
        obra.setEditora(dto.getEditora());
        obra.setAnoPublicacao(dto.getAnoPublicacao());
        obra.setEdicao(dto.getEdicao());
        obra.setIdioma(dto.getIdioma());
        obra.setSinopse(dto.getSinopse());
        obra.setUrlCapa(dto.getUrlCapa());
        obra.setPaginas(dto.getPaginas());

        if (dto.getIdsCategorias() != null && !dto.getIdsCategorias().isEmpty()) {
            List<Categoria> categorias = categoriaRepository.findAllById(dto.getIdsCategorias());
            obra.setCategorias(categorias);
        } else {
            obra.setCategorias(new ArrayList<>());
        }

        obraRepository.save(obra);
    }

    public List<Obra> buscarObrasAvancada(String termo, Integer ano, String categoria, boolean emAlta) {
        if (emAlta) {
            return obraRepository.findLivrosEmAlta();
        }

        if (termo != null && termo.matches("^(97(8|9))?\\d{9}(\\d|X)$")) {
            return obraRepository.findByIsbn(termo).map(List::of).orElse(List.of());
        }

        if (ano != null) {
            return obraRepository.findByAnoPublicacao(ano);
        }

        if (categoria != null && !categoria.isBlank()) {
            return obraRepository.findByCategoriasNomeContainingIgnoreCase(categoria);
        }

        if (termo != null && !termo.isBlank()) {
            List<Obra> porTitulo = obraRepository.findByTituloContainingIgnoreCase(termo);
            if (!porTitulo.isEmpty())
                return porTitulo;

            return obraRepository.findByAutorContainingIgnoreCase(termo);
        }

        return obraRepository.findAll();
    }

    @Transactional
    public void editarObra(int idObra, ObraRequestDTO dto) {
        Obra obra = obraRepository.findById(idObra)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));

        obraRepository.findByIsbn(dto.getIsbn()).ifPresent(outraObra -> {
            if (outraObra.getIdObra() != idObra) {
                throw new RuntimeException("Este ISBN já está cadastrado em outra obra");
            }
        });

        obra.setTitulo(dto.getTitulo());
        obra.setAutor(dto.getAutor());
        obra.setIsbn(dto.getIsbn());
        obra.setEditora(dto.getEditora());
        obra.setAnoPublicacao(dto.getAnoPublicacao());
        obra.setEdicao(dto.getEdicao());
        obra.setIdioma(dto.getIdioma());
        obra.setSinopse(dto.getSinopse());
        obra.setUrlCapa(dto.getUrlCapa());
        obra.setPaginas(dto.getPaginas());

        if (dto.getIdsCategorias() != null && !dto.getIdsCategorias().isEmpty()) {
            List<Categoria> categorias = categoriaRepository.findAllById(dto.getIdsCategorias());
            obra.setCategorias(categorias);
        } else {
            obra.setCategorias(new ArrayList<>());
        }

        obraRepository.save(obra);
    }

    @Transactional
    public void removerObra(int idObra) {
        if (!obraRepository.existsById(idObra)) {
            throw new RuntimeException("Obra não encontrada para remoção");
        }

        obraRepository.deleteById(idObra);
    }

    public Obra buscarPorId(int idObra) {
        return obraRepository.findById(idObra)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada com o ID: " + idObra));
        }

        public List<Obra> buscarRecomendados() {
        // Pega obras com média de avaliação >= 4.5
        List<Obra> todas = obraRepository.findAll();
        // Filtra e ordena por nota (simulado – ideal seria uma query com join e AVG)
        // Para não complicar, pegamos as 6 mais recentes com maior nota (ajustável)
        return todas.stream()
                .sorted((o1, o2) -> Double.compare(
                    getMediaAvaliacoes(o2.getIdObra()),
                    getMediaAvaliacoes(o1.getIdObra())
                ))
                .limit(6)
                .collect(Collectors.toList());
    }

    private double getMediaAvaliacoes(int idObra) {
        List<Avaliacao> avaliacoes = avaliacaoRepository.findByObraIdObra(idObra);
        if (avaliacoes.isEmpty()) return 0;
        return avaliacoes.stream().mapToInt(Avaliacao::getNota).average().orElse(0);
    }
}