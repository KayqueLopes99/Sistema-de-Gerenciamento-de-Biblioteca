package com.biblioteca.gerenciador.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

@Data
public class ObraRequestDTO {
    
    @NotBlank(message = "Título é obrigatório")
    @Size(min = 1, max = 200, message = "Título deve ter entre 1 e 200 caracteres")
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\p{Punct}]+$", 
             message = "Título deve conter apenas letras, números, espaços e pontuação básica")
    private String titulo;
    
    @NotBlank(message = "Autor é obrigatório")
    @Size(min = 2, max = 100, message = "Autor deve ter entre 2 e 100 caracteres")
    @Pattern(regexp = "^[\\p{L}\\s.]+$", 
             message = "Autor deve conter apenas letras, espaços e pontos")
    private String autor;
    
    @NotBlank(message = "ISBN é obrigatório")
    @Pattern(regexp = "^(97(8|9))?\\d{9}(\\d|X)$", 
             message = "ISBN inválido (formato: 10 ou 13 dígitos, pode terminar com X)")
    private String isbn;
    
    @Size(max = 100, message = "Editora deve ter no máximo 100 caracteres")
    @Pattern(regexp = "^[\\p{L}\\s]+$", 
             message = "Editora deve conter apenas letras e espaços")
    private String editora;
    
    @Min(value = 1000, message = "Ano de publicação deve ser maior que 1000")
    @Max(value = 2026, message = "Ano de publicação não pode ser maior que o ano atual")
    private int anoPublicacao;
    
    @Size(max = 50, message = "Edição deve ter no máximo 50 caracteres")
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s]+$", 
             message = "Edição deve conter apenas letras, números e espaços")
    private String edicao;
    
    @Size(max = 50, message = "Idioma deve ter no máximo 50 caracteres")
    @Pattern(regexp = "^[\\p{L}\\s]+$", 
             message = "Idioma deve conter apenas letras e espaços")
    private String idioma;
    
    @Size(max = 5000, message = "Sinopse deve ter no máximo 5000 caracteres")
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\p{Punct}]+$", 
             message = "Sinopse contém caracteres não permitidos")
    private String sinopse;
    
    @Pattern(regexp = "^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?.*$",
             message = "URL da capa inválida")
    private String urlCapa;
    
    @Min(value = 1, message = "Número de páginas deve ser maior que 0")
    @Max(value = 10000, message = "Número de páginas deve ser no máximo 10000")
    private int paginas;
    
    @NotNull(message = "Lista de categorias não pode ser nula")
    private List<@NotNull(message = "ID da categoria não pode ser nulo") Integer> idsCategorias;
}