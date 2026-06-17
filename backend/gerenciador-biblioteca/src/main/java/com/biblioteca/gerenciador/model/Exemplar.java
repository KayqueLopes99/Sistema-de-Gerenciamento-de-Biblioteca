package com.biblioteca.gerenciador.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import com.biblioteca.gerenciador.enums.StatusExemplar;
// import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
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
    // @JsonIgnore
    private Localizacao localizacao;

    @Enumerated(EnumType.STRING)
    private StatusExemplar status;

}