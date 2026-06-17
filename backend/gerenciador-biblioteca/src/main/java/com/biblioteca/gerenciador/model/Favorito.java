package com.biblioteca.gerenciador.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "favorito")
public class Favorito {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idFavorito;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Leitor leitor;

    @ManyToOne
    @JoinColumn(name = "id_obra")
    private Obra obra;

    private LocalDateTime dataFavorito = LocalDateTime.now();
}