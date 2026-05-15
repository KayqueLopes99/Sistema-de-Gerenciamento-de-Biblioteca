package com.biblioteca.gerenciador.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class DisponibilidadeDTO {
    private boolean disponivel;
    private List<String> localizacoes; 
}