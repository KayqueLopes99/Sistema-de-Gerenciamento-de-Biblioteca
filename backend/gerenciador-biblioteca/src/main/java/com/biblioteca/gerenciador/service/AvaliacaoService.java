package com.biblioteca.gerenciador.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import com.biblioteca.gerenciador.model.Avaliacao;
import com.biblioteca.gerenciador.model.Leitor;
import com.biblioteca.gerenciador.model.Obra;
import com.biblioteca.gerenciador.dto.AvaliacaoRequestDTO;
import com.biblioteca.gerenciador.repository.AvaliacaoRepository;
import com.biblioteca.gerenciador.repository.EmprestimoRepository;
import com.biblioteca.gerenciador.repository.LeitorRepository;
import com.biblioteca.gerenciador.repository.ObraRepository;

@Service
@RequiredArgsConstructor
public class AvaliacaoService {

    private final AvaliacaoRepository avaliacaoRepository;
    private final EmprestimoRepository emprestimoRepository;
    private final ObraRepository obraRepository;
    private final LeitorRepository leitorRepository;

    public List<Avaliacao> visualizarAvaliacoes(int idObra) {
        return avaliacaoRepository.findByObraIdObra(idObra);
    }

    @Transactional
    public void avaliarLivro(int idObra, String emailUsuario, AvaliacaoRequestDTO dto) {
        Leitor leitor = leitorRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new RuntimeException("Leitor não encontrado"));

        
        Obra obra = obraRepository.findById(idObra)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));

        
        boolean jaEmprestou = emprestimoRepository.existsByLeitorIdUsuarioAndExemplarObraIdObra(leitor.getIdUsuario(), idObra);
        if (!jaEmprestou) {
            throw new RuntimeException("Acesso negado: Você só pode avaliar livros que já foram emprestados para você.");
        }

       
        Avaliacao avaliacao = new Avaliacao();
        avaliacao.setNota(dto.getNota());
        avaliacao.setComentario(dto.getComentario());
        avaliacao.setLeitor(leitor);
        avaliacao.setObra(obra);

        avaliacaoRepository.save(avaliacao);
    }
}