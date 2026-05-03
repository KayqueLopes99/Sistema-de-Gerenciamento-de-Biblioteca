package com.biblioteca.gerenciador.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "localizacao")
public class Localizacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idLocalizacao;

    private String sala;
    private String estante;
    private String sessao;
    private String descricao;

    @OneToMany(mappedBy = "localizacao")
    private List<Exemplar> exemplares;
    // Uma Localizacao pode ter vários Exemplares
    // mappedBy indica que o relacionamento é controlado pelo atributo "localizacao" na classe Exemplar

    // public Localizacao(int idLocalizacao, String sala, String estante, String sessao, String descricao) {
    //     this.idLocalizacao = idLocalizacao;
    //     this.sala = sala;
    //     this.estante = estante;
    //     this.sessao = sessao;
    //     this.descricao = descricao;
    // }

    // public Localizacao(String sala, String estante, String sessao, String descricao) {
    //     this.sala = sala;
    //     this.estante = estante;
    //     this.sessao = sessao;
    //     this.descricao = descricao;
    // }
}