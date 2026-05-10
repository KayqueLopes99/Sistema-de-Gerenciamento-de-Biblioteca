package com.biblioteca.gerenciador.service;

import com.biblioteca.gerenciador.dto.LeitorRequestDTO;
import com.biblioteca.gerenciador.dto.LoginRequestDTO;
import com.biblioteca.gerenciador.dto.LoginResponseDTO;
import com.biblioteca.gerenciador.enums.StatusLeitor;
import com.biblioteca.gerenciador.enums.TipoUsuario;
import com.biblioteca.gerenciador.model.Leitor;
import com.biblioteca.gerenciador.model.Usuario;
import com.biblioteca.gerenciador.repository.LeitorRepository;
import com.biblioteca.gerenciador.repository.UsuarioRepository;
import com.biblioteca.gerenciador.security.JwtUtil;
import com.biblioteca.gerenciador.util.CpfValidator;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;



@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final LeitorRepository leitorRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final JwtUtil jwtUtil;

    @Transactional(readOnly = true)
    public LoginResponseDTO login(LoginRequestDTO dto) {
       
        Usuario usuario = usuarioRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Email não encontrado"));

        if (!passwordEncoder.matches(dto.getSenha(), usuario.getSenha())) {
            throw new RuntimeException("Senha inválida");
        }
        
        String token = jwtUtil.generateToken(
            usuario.getEmail(), 
            usuario.getTipoUsuario().name(),
            usuario.getNome()
        );
        
        return new LoginResponseDTO(
            token,
            usuario.getTipoUsuario().name(),
            usuario.getNome(),
            usuario.getEmail()
        );
    }

    @Transactional
    public void solicitarAutoCadastro(LeitorRequestDTO dto) {

        if (!CpfValidator.isValid(dto.getCpf())) {
            throw new RuntimeException("O CPF informado é inválido");
        }

        // Validações (dados já vêm limpos do DTO)
        if (usuarioRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email já cadastrado");
        }
        if (leitorRepository.findByCpf(dto.getCpf()).isPresent()) {
            throw new RuntimeException("CPF já cadastrado");
        }
        
        Leitor leitor = criarLeitorFromDTO(dto);
        leitor.setStatusLeitor(StatusLeitor.PENDENTE_APROVACAO);
        leitorRepository.save(leitor);
    }

    @Transactional
    public void cadastrarLeitor(LeitorRequestDTO dto) {

        if (!CpfValidator.isValid(dto.getCpf())) {
            throw new RuntimeException("O CPF informado é inválido");
        }

        if (usuarioRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email já cadastrado");
        }
        if (leitorRepository.findByCpf(dto.getCpf()).isPresent()) {
            throw new RuntimeException("CPF já cadastrado");
        }
        
        Leitor leitor = criarLeitorFromDTO(dto);
        leitor.setStatusLeitor(StatusLeitor.ATIVO);
        leitorRepository.save(leitor);
    }

    @Transactional
    public void editarLeitor(int idLeitor, LeitorRequestDTO dto) {

        if (!CpfValidator.isValid(dto.getCpf())) {
            throw new RuntimeException("Não é possível salvar um CPF inválido");
        }
        
        Leitor leitor = leitorRepository.findById(idLeitor)
                .orElseThrow(() -> new RuntimeException("Leitor não encontrado"));
        
        leitor.setNome(dto.getNome());
        leitor.setEmail(dto.getEmail());
        leitor.setCpf(dto.getCpf());
        leitor.setMatricula(dto.getMatricula());
        
        if (dto.getSenha() != null && !dto.getSenha().isEmpty()) {
            leitor.setSenha(passwordEncoder.encode(dto.getSenha()));
        }
        
        leitorRepository.save(leitor);
    }

    @Transactional
    public void bloquearLeitor(int idLeitor) {
        Leitor leitor = leitorRepository.findById(idLeitor)
                .orElseThrow(() -> new RuntimeException("Leitor não encontrado"));
        
        leitor.setStatusLeitor(StatusLeitor.SUSPENSO);
        leitor.setDataFimSuspensao(LocalDate.now().plusDays(30));
        leitorRepository.save(leitor);
    }

    @Transactional
    public void desbloquearLeitor(int idLeitor) {
        Leitor leitor = leitorRepository.findById(idLeitor)
                .orElseThrow(() -> new RuntimeException("Leitor não encontrado"));
        
        leitor.setStatusLeitor(StatusLeitor.ATIVO);
        leitor.setDataFimSuspensao(null);
        leitorRepository.save(leitor);
    }

    @Transactional
    public void aprovarLeitor(int idLeitor) {
        Leitor leitor = leitorRepository.findById(idLeitor)
                .orElseThrow(() -> new RuntimeException("Leitor não encontrado"));
        
        if (leitor.getStatusLeitor() != StatusLeitor.PENDENTE_APROVACAO) {
            throw new RuntimeException("Leitor não está pendente de aprovação");
        }
        
        leitor.setStatusLeitor(StatusLeitor.ATIVO);
        leitorRepository.save(leitor);
    }


    private Leitor criarLeitorFromDTO(LeitorRequestDTO dto) {
        Leitor leitor = new Leitor();
        leitor.setNome(dto.getNome());
        leitor.setEmail(dto.getEmail());
        leitor.setSenha(passwordEncoder.encode(dto.getSenha()));
        leitor.setCpf(dto.getCpf());
        leitor.setMatricula(dto.getMatricula());
        leitor.setDataCadastro(LocalDate.now());
        leitor.setTipoUsuario(TipoUsuario.LEITOR);
        return leitor;
    }
}