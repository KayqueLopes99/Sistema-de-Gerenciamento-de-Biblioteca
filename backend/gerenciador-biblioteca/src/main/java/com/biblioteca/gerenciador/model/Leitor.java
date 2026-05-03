package com.biblioteca.gerenciador.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import com.biblioteca.gerenciador.enums.StatusLeitor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Entity
@DiscriminatorValue("LEITOR")
public class Leitor extends Usuario {

    @Column(unique = true)
    private String cpf;

    @Column(unique = true)
    private String matricula;

    @Enumerated(EnumType.STRING)
    private StatusLeitor statusLeitor;

    private LocalDate dataCadastro;
    
    private LocalDate dataFimSuspensao;
}