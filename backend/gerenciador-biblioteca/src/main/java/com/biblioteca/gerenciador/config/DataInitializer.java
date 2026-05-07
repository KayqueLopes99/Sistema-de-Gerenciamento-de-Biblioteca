package com.biblioteca.gerenciador.config;

import com.biblioteca.gerenciador.enums.TipoUsuario;
import com.biblioteca.gerenciador.model.Bibliotecario;
import com.biblioteca.gerenciador.repository.BibliotecarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final BibliotecarioRepository bibliotecarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        
        if (bibliotecarioRepository.count() == 0) {
            
            Bibliotecario admin = new Bibliotecario();
            admin.setNome("Administrador do Sistema");
            admin.setEmail("admin@biblioteca.com");
            admin.setSenha(passwordEncoder.encode("Admin123"));
            admin.setRegistroFuncional("ADMIN001");
            admin.setTipoUsuario(TipoUsuario.BIBLIOTECARIO);
            
            bibliotecarioRepository.save(admin);
    
            System.out.println("BIBLIOTECÁRIO ADMIN CRIADO COM SUCESSO!");
            System.out.println("   Email: admin@biblioteca.com");
            System.out.println("   Senha: Admin123");
          
        } else {
            System.out.println("ℹBibliotecário já existe no sistema.");
        }
    }
}