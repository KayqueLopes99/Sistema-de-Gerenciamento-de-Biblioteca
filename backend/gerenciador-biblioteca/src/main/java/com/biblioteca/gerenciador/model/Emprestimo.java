package com.biblioteca.gerenciador.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "emprestimo")
public class Emprestimo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idEmprestimo;

    private LocalDate dataEmprestimo;
    private LocalDate dataDevolucaoPrevista;
    private LocalDate dataDevolucaoReal;

    private int quantidadeRenovacoes;
    private int diasSuspensao;

    @ManyToOne
    @JoinColumn(name = "id_leitor")
    private Leitor leitor;

    @ManyToOne
    @JoinColumn(name = "id_exemplar")
    private Exemplar exemplar;

    public Emprestimo() {}

    public Emprestimo(int idEmprestimo, LocalDate dataEmprestimo,
                       LocalDate dataDevolucaoPrevista, LocalDate dataDevolucaoReal,
                       int quantidadeRenovacoes, int diasSuspensao,
                       Leitor leitor, Exemplar exemplar) {
        this.idEmprestimo = idEmprestimo;
        this.dataEmprestimo = dataEmprestimo;
        this.dataDevolucaoPrevista = dataDevolucaoPrevista;
        this.dataDevolucaoReal = dataDevolucaoReal;
        this.quantidadeRenovacoes = quantidadeRenovacoes;
        this.diasSuspensao = diasSuspensao;
        this.leitor = leitor;
        this.exemplar = exemplar;
    }

    // Getters e Setters
    public int getIdEmprestimo() {
        return idEmprestimo;
    }

    public void setIdEmprestimo(int idEmprestimo) {
        this.idEmprestimo = idEmprestimo;
    }

    public LocalDate getDataEmprestimo() {
        return dataEmprestimo;
    }

    public void setDataEmprestimo(LocalDate dataEmprestimo) {
        this.dataEmprestimo = dataEmprestimo;
    }

    public LocalDate getDataDevolucaoPrevista() {
        return dataDevolucaoPrevista;
    }

    public void setDataDevolucaoPrevista(LocalDate dataDevolucaoPrevista) {
        this.dataDevolucaoPrevista = dataDevolucaoPrevista;
    }

    public LocalDate getDataDevolucaoReal() {
        return dataDevolucaoReal;
    }

    public void setDataDevolucaoReal(LocalDate dataDevolucaoReal) {
        this.dataDevolucaoReal = dataDevolucaoReal;
    }

    public int getQuantidadeRenovacoes() {
        return quantidadeRenovacoes;
    }

    public void setQuantidadeRenovacoes(int quantidadeRenovacoes) {
        this.quantidadeRenovacoes = quantidadeRenovacoes;
    }

    public int getDiasSuspensao() {
        return diasSuspensao;
    }

    public void setDiasSuspensao(int diasSuspensao) {
        this.diasSuspensao = diasSuspensao;
    }

    public Leitor getLeitor() {
        return leitor;
    }

    public void setLeitor(Leitor leitor) {
        this.leitor = leitor;
    }

    public Exemplar getExemplar() {
        return exemplar;
    }

    public void setExemplar(Exemplar exemplar) {
        this.exemplar = exemplar;
    }
}