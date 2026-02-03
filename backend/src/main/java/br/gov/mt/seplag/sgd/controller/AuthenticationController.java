package br.gov.mt.seplag.sgd.controller;

import br.gov.mt.seplag.sgd.dto.AuthenticationDTO;
import br.gov.mt.seplag.sgd.dto.LoginResponseDTO;
import br.gov.mt.seplag.sgd.dto.RegisterDTO;
import br.gov.mt.seplag.sgd.entity.User;
import br.gov.mt.seplag.sgd.repository.UserRepository;
import br.gov.mt.seplag.sgd.service.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import br.gov.mt.seplag.sgd.infra.UserAlreadyExistsException;

@RestController
@RequestMapping("auth")
@CrossOrigin(origins = "*")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository repository;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid AuthenticationDTO data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.login(), data.password());
        var auth = this.authenticationManager.authenticate(usernamePassword);

        var token = tokenService.generateToken((User) auth.getPrincipal());
        
        System.out.println("✅ Login bem-sucedido para: " + data.login());

        return ResponseEntity.ok(new LoginResponseDTO(token));
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody @Valid RegisterDTO data) {
        if (this.repository.findByLogin(data.login()) != null) {
            throw new UserAlreadyExistsException("Este usuário já está cadastrado.");
        }

        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());
        br.gov.mt.seplag.sgd.enums.UserRole role = data.userRole() != null ? data.userRole() : br.gov.mt.seplag.sgd.enums.UserRole.USER;
        User newUser = new User(null, data.login(), encryptedPassword, role);

        this.repository.save(newUser);
        
        System.out.println("✅ Registro bem-sucedido para: " + data.login());

        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh")
    public ResponseEntity refreshToken(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            System.out.println("🔍 Header recebido: " + authHeader);
            
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                System.err.println("❌ Refresh: Sem header Authorization válido");
                return ResponseEntity.status(401).body(new LoginResponseDTO("Sem token"));
            }
            
            String token = authHeader.substring("Bearer ".length());
            System.out.println("🔄 Token de refresh recebido: " + token.substring(0, 20) + "...");
            
            String userLogin = tokenService.getSubject(token);
            System.out.println("👤 User login extraído: " + userLogin);
            
            if (userLogin == null || userLogin.isEmpty()) {
                System.err.println("❌ Refresh: Não foi possível extrair o usuário do token");
                return ResponseEntity.status(401).body(new LoginResponseDTO("Token inválido"));
            }
            
            User user = (User) repository.findByLogin(userLogin);
            
            if (user == null) {
                System.err.println("❌ Refresh: Usuário não encontrado: " + userLogin);
                return ResponseEntity.status(401).body(new LoginResponseDTO("Usuário não encontrado"));
            }

            String newToken = tokenService.generateToken(user);
            System.out.println("✅ Token renovado com sucesso para: " + user.getLogin());
            
            return ResponseEntity.ok(new LoginResponseDTO(newToken));
            
        } catch (Exception e) {
            System.err.println("❌ Erro no refresh: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(new LoginResponseDTO("Erro ao renovar token"));
        }
    }
}