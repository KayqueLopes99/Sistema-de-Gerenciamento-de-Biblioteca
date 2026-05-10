package com.biblioteca.gerenciador.dto;

import com.biblioteca.gerenciador.enums.StatusExemplar;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ExemplarRequestDTO {

    @NotBlank(message = "Código de barras é obrigatório")
    @Size(min = 5, max = 50, message = "Código de barras deve ter entre 5 e 50 caracteres")
    @Pattern(regexp = "^[A-Z0-9-]+$", message = "Código de barras deve conter apenas letras maiúsculas, números e hífens")
    private String codigoBarras;

    @Size(max = 255, message = "Estado de conservação deve ter no máximo 255 caracteres")
    private String estadoConservacao;

    @NotNull(message = "ID da obra é obrigatório")
    private Integer idObra;

    @NotNull(message = "ID da localização é obrigatório")
    private Integer idLocalizacao;

    @NotNull(message = "Status do exemplar é obrigatório")
    private StatusExemplar status;
}