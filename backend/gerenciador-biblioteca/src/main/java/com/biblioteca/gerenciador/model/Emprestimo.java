package com.biblioteca.gerenciador.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;



@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
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

}