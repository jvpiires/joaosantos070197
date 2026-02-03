package br.gov.mt.seplag.sgd.config;

import br.gov.mt.seplag.sgd.repository.UserRepository;
import br.gov.mt.seplag.sgd.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    TokenService tokenService;

    @Autowired
    UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        var token = this.recoverToken(request);

        System.out.println("=== SECURITY FILTER DEBUG ===");
        System.out.println("URI: " + request.getRequestURI());
        System.out.println("Method: " + request.getMethod());
        System.out.println("Token presente? " + (token != null));

        if (token != null) {
            var subject = tokenService.validateToken(token);
            System.out.println("Token válido? Subject: " + subject);

            if (!subject.isEmpty()) {
                UserDetails user = repository.findByLogin(subject);

                if (user != null) {
                    System.out.println("Usuário encontrado: " + user.getUsername());
                    System.out.println("Authorities do usuário: " + user.getAuthorities());

                    var authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    System.out.println("Autenticação setada no contexto!");
                } else {
                    System.out.println("ERRO: Usuário não encontrado no banco!");
                }
            } else {
                System.out.println("ERRO: Token inválido ou expirado!");
            }
        } else {
            System.out.println("Nenhum token enviado na requisição");
        }

        System.out.println("=== FIM DEBUG ===\n");
        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;
        return authHeader.replace("Bearer ", "");
    }
}