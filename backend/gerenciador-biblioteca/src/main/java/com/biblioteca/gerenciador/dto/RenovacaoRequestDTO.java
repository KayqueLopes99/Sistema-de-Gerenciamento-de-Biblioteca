package com.biblioteca.gerenciador.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RenovacaoRequestDTO {
    
    @NotNull(message = "ID do empréstimo é obrigatório")
    @Min(value = 1, message = "ID do empréstimo inválido")
    private int idEmprestimo;
    
    @NotNull(message = "ID do leitor é obrigatório")
    @Min(value = 1, message = "ID do leitor inválido")
    private int idLeitor;
}