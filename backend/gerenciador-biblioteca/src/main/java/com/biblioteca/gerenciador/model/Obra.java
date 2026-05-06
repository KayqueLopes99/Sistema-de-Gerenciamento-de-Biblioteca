package com.biblioteca.gerenciador.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "obra")
public class Obra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idObra;

    @Column(nullable = false)
    private String titulo;
    
    @Column(nullable = false)
    private String autor;

    @Column(unique = true, nullable = false)
    private String isbn;

    private String editora;
    
    private int anoPublicacao;
    
    private String edicao;
    
    private String idioma;

    @Column(columnDefinition = "TEXT")
    private String sinopse;

    private String urlCapa;
    
    private int paginas;

    @ManyToMany
    @JoinTable(
        name = "obra_categoria",
        joinColumns = @JoinColumn(name = "id_obra"),
        inverseJoinColumns = @JoinColumn(name = "id_categoria")
    )
    private List<Categoria> categorias;
}
