package br.gov.mt.seplag.sgd.controller;

import br.gov.mt.seplag.sgd.dto.AuthenticationDTO;
import br.gov.mt.seplag.sgd.dto.LoginResponseDTO;
import br.gov.mt.seplag.sgd.dto.RegisterDTO;
import br.gov.mt.seplag.sgd.entity.User;
import br.gov.mt.seplag.sgd.repository.UserRepository;
import br.gov.mt.seplag.sgd.service.TokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
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
@Tag(name = "🔐 Autenticação", description = "Endpoints de autenticação e autorização")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository repository;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    @Operation(
            summary = "Fazer Login",
            description = "Autentica o usuário e retorna um token JWT. Use as credenciais padrão para testar: admin/password123"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Login realizado com sucesso",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = LoginResponseDTO.class))
            ),
            @ApiResponse(responseCode = "401", description = "Usuário ou senha inválida"),
            @ApiResponse(responseCode = "400", description = "Dados de entrada inválidos")
    })
    public ResponseEntity login(@RequestBody @Valid AuthenticationDTO data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.login(), data.password());
        var auth = this.authenticationManager.authenticate(usernamePassword);

        var token = tokenService.generateToken((User) auth.getPrincipal());
        
        System.out.println("✅ Login bem-sucedido para: " + data.login());

        return ResponseEntity.ok(new LoginResponseDTO(token));
    }

    @PostMapping("/register")
    @Operation(
            summary = "Registrar Novo Usuário",
            description = "Cria uma nova conta de usuário com a role de USER"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuário registrado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos ou usuário já existe"),
            @ApiResponse(responseCode = "409", description = "Usuário já cadastrado")
    })
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
    @Operation(
            summary = "Renovar Token JWT",
            description = "Renova um token JWT válido. Envie o token atual no header Authorization: Bearer {token}"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Token renovado com sucesso",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = LoginResponseDTO.class))
            ),
            @ApiResponse(responseCode = "401", description = "Token inválido ou expirado"),
            @ApiResponse(responseCode = "500", description = "Erro ao renovar token")
    })
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