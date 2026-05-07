package com.biblioteca.gerenciador.service;

import com.biblioteca.gerenciador.dto.ObraRequestDTO;
import com.biblioteca.gerenciador.model.Categoria;
import com.biblioteca.gerenciador.model.Obra;
import com.biblioteca.gerenciador.repository.CategoriaRepository;
import com.biblioteca.gerenciador.repository.ObraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ObraService {

    private final ObraRepository obraRepository;
    private final CategoriaRepository categoriaRepository;

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

    public List<Obra> buscarObras(String termo) {
        return obraRepository.findByTituloContainingIgnoreCase(termo);
    }
}