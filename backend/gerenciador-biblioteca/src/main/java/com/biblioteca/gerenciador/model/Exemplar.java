package com.biblioteca.gerenciador.model;

import jakarta.persistence.*;
import com.biblioteca.gerenciador.enums.StatusExemplar;

@Entity
@Table(name = "exemplar")
public class Exemplar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idExemplar;


    @Column(unique = true, nullable = false)
    private String codigoBarras;
    private String estadoConservacao;

    @ManyToOne
    @JoinColumn(name = "id_obra")
    private Obra obra;

    @ManyToOne
    @JoinColumn(name = "id_localizacao")
    private Localizacao localizacao;

    @Enumerated(EnumType.STRING)
    private StatusExemplar status;

    public Exemplar() {
    }

    public Exemplar(int idExemplar, String codigoBarras, String estadoConservacao,
                     Obra obra, Localizacao localizacao, StatusExemplar status) {
        this.idExemplar = idExemplar;
        this.codigoBarras = codigoBarras;
        this.estadoConservacao = estadoConservacao;
        this.obra = obra;
        this.localizacao = localizacao;
        this.status = status;
    }

    public Exemplar(String codigoBarras, String estadoConservacao,
                     Obra obra, Localizacao localizacao, StatusExemplar status) {
        this.codigoBarras = codigoBarras;
        this.estadoConservacao = estadoConservacao;
        this.obra = obra;
        this.localizacao = localizacao;
        this.status = status;
    }

    public int getIdExemplar() {
        return idExemplar;
    }

    public void setIdExemplar(int idExemplar) {
        this.idExemplar = idExemplar;
    }

    public String getCodigoBarras() {
        return codigoBarras;
    }

    public void setCodigoBarras(String codigoBarras) {
        this.codigoBarras = codigoBarras;
    }

    public String getEstadoConservacao() {
        return estadoConservacao;
    }

    public void setEstadoConservacao(String estadoConservacao) {
        this.estadoConservacao = estadoConservacao;
    }

    public Obra getObra() {
        return obra;
    }

    public void setObra(Obra obra) {
        this.obra = obra;
    }

    public Localizacao getLocalizacao() {
        return localizacao;
    }

    public void setLocalizacao(Localizacao localizacao) {
        this.localizacao = localizacao;
    }

    public StatusExemplar getStatus() {
        return status;
    }

    public void setStatus(StatusExemplar status) {
        this.status = status;
    }
}