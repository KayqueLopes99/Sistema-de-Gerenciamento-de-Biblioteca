package com.biblioteca.gerenciador.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LocalizacaoRequestDTO {

    @NotBlank(message = "A sala é obrigatória")
    @Size(max = 50, message = "A sala deve ter no máximo 50 caracteres")
    private String sala;

    @NotBlank(message = "A estante é obrigatória")
    @Size(max = 50, message = "A estante deve ter no máximo 50 caracteres")
    private String estante;

    @NotBlank(message = "A sessão é obrigatória")
    @Size(max = 50, message = "A sessão deve ter no máximo 50 caracteres")
    private String sessao;

    @Size(max = 255, message = "A descrição deve ter no máximo 255 caracteres")
    private String descricao;
}
