package com.biblioteca.gerenciador.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AvaliacaoRequestDTO {
    @Min(value = 1, message = "A nota mínima é 1")
    @Max(value = 5, message = "A nota máxima é 5")
    private int nota;

    @Size(max = 1000, message = "O comentário deve ter no máximo 1000 caracteres")
    private String comentario;
}