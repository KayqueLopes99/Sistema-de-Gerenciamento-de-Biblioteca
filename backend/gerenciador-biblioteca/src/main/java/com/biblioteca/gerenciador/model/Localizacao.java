package com.biblioteca.gerenciador.model;

import jakarta.persistence.*;
import java.util.List;

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

   
    public Localizacao() {
    }

    public Localizacao(int idLocalizacao, String sala, String estante, String sessao, String descricao) {
        this.idLocalizacao = idLocalizacao;
        this.sala = sala;
        this.estante = estante;
        this.sessao = sessao;
        this.descricao = descricao;
    }

    public Localizacao(String sala, String estante, String sessao, String descricao) {
        this.sala = sala;
        this.estante = estante;
        this.sessao = sessao;
        this.descricao = descricao;
    }


    public int getIdLocalizacao() {
        return idLocalizacao;
    }

    public void setIdLocalizacao(int idLocalizacao) {
        this.idLocalizacao = idLocalizacao;
    }

    public String getSala() {
        return sala;
    }

    public void setSala(String sala) {
        this.sala = sala;
    }

    public String getEstante() {
        return estante;
    }

    public void setEstante(String estante) {
        this.estante = estante;
    }

    public String getSessao() {
        return sessao;
    }

    public void setSessao(String sessao) {
        this.sessao = sessao;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public List<Exemplar> getExemplares() {
        return exemplares;
    }

    public void setExemplares(List<Exemplar> exemplares) {
        this.exemplares = exemplares;
    }
}