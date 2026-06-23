package com.biblioteca.gerenciador.config;

import com.biblioteca.gerenciador.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer; // IMPORT ADICIONADO
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource; 
import org.springframework.web.cors.UrlBasedCorsConfigurationSource; 

import java.util.Arrays;

@Configuration
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults()) 
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/usuarios/login").permitAll()
                .requestMatchers("/api/usuarios/auto-cadastro").permitAll()
                .requestMatchers("/api/acervo/buscar").permitAll()  
                .requestMatchers(HttpMethod.GET, "/api/avaliacoes/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/acervo/obras/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/acervo/localizacoes").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categorias").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/acervo/exemplares").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/favoritos/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/favoritos/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/favoritos/**").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/acervo/recomendados").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("https://sistema-de-gerenciamento-de-biblioteca-n7tlo9hjt.vercel.app", "http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}