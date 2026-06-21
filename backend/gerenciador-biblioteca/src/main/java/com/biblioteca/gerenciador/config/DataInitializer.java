package com.biblioteca.gerenciador.config;

import com.biblioteca.gerenciador.enums.TipoUsuario;
import com.biblioteca.gerenciador.model.Bibliotecario;
import com.biblioteca.gerenciador.model.Categoria;
import com.biblioteca.gerenciador.repository.BibliotecarioRepository;
import com.biblioteca.gerenciador.repository.CategoriaRepository;
import com.biblioteca.gerenciador.repository.LocalizacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final BibliotecarioRepository bibliotecarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final CategoriaRepository categoriaRepository;
    private final LocalizacaoRepository localizacaoRepository;

    @Override
    public void run(String... args) throws Exception {
        if (bibliotecarioRepository.count() == 0) {
            Bibliotecario admin = new Bibliotecario();
            admin.setNome("Administrador do Sistema");
            admin.setEmail("admin@ufersa.edu.br");
            admin.setSenha(passwordEncoder.encode("Admin123"));
            admin.setRegistroFuncional("ADMIN001");
            admin.setTipoUsuario(TipoUsuario.BIBLIOTECARIO);
            bibliotecarioRepository.save(admin);
            System.out.println("BIBLIOTECÁRIO ADMIN CRIADO COM SUCESSO!");
            System.out.println("   Email: admin@ufersa.edu.br");
            System.out.println("   Senha: Admin123");
        }

        List<String> sessoes = localizacaoRepository.findDistinctSessao();
        for (String sessao : sessoes) {
            if (!categoriaRepository.findAll().stream().anyMatch(c -> c.getNome().equalsIgnoreCase(sessao))) {
                Categoria cat = new Categoria();
                cat.setNome(sessao);
                categoriaRepository.save(cat);
                System.out.println("Categoria criada a partir da sessão: " + sessao);
            }
        }
    }
}