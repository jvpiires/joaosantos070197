package br.gov.mt.seplag.sgd.controller;

import br.gov.mt.seplag.sgd.dto.AuthenticationDTO;
import br.gov.mt.seplag.sgd.dto.LoginResponseDTO;
import br.gov.mt.seplag.sgd.dto.RegisterDTO;
import br.gov.mt.seplag.sgd.entity.User;
import br.gov.mt.seplag.sgd.repository.UserRepository;
import br.gov.mt.seplag.sgd.service.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("auth")
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

        return ResponseEntity.ok(new LoginResponseDTO(token));
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody @Valid RegisterDTO data) {
        if (this.repository.findByLogin(data.login()) != null)
            return ResponseEntity.badRequest().body("Usuário já existe");

        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());
        User newUser = new User();
        newUser.setLogin(data.login());
        newUser.setPassword(encryptedPassword);

        newUser.setRole(data.userRole());

        this.repository.save(newUser);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh")
    public ResponseEntity refreshToken() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof User user) {
            var newToken = tokenService.generateToken(user);
            return ResponseEntity.ok(new LoginResponseDTO(newToken));
        }

        return ResponseEntity.status(403).build();
    }
}