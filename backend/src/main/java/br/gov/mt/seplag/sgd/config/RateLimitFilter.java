package br.gov.mt.seplag.sgd.config;

import br.gov.mt.seplag.sgd.infra.RateLimitExceededException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
public class RateLimitFilter extends OncePerRequestFilter {

    @Autowired
    private RateLimitStore rateLimitStore;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication();
            
            // Se usuário está autenticado, aplicar rate limit
            if (principal != null && principal.toString() != null && !principal.toString().equals("anonymousUser")) {
                String userId = principal.toString();
                
                if (!rateLimitStore.allowRequest(userId)) {
                    log.warn("Rate limit excedido para usuário: {}", userId);
                    response.setStatus(429);
                    response.getWriter().write("{\"error\": \"Rate limit excedido: máximo 10 requisições por minuto\"}");
                    return;
                }
            }
            
            filterChain.doFilter(request, response);
        } catch (RateLimitExceededException e) {
            log.warn("Rate limit exception: {}", e.getMessage());
            response.setStatus(429);
            response.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
