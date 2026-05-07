package com.biblioteca.gerenciador.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class BibliotecarioRequestDTO {
    
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 3, max = 100, message = "Nome deve ter entre 3 e 100 caracteres")
    @Pattern(regexp = "^[\\p{L}\\s]+$", message = "Nome deve conter apenas letras e espaços")
    private String nome;
    
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    @Size(max = 100, message = "Email deve ter no máximo 100 caracteres")
    @Pattern(regexp = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$", 
             message = "Email deve estar em letras minúsculas e sem espaços")
    private String email;
    
    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, max = 20, message = "Senha deve ter entre 6 e 20 caracteres")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,20}$",
             message = "Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número")
    private String senha;
    
    @NotBlank(message = "Registro funcional é obrigatório")
    @Pattern(regexp = "^[A-Z0-9]{6,20}$", 
             message = "Registro funcional deve ter entre 6 e 20 caracteres, apenas letras maiúsculas e números")
    private String registroFuncional;
}