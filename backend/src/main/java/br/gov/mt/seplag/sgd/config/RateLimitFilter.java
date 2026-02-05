package br.gov.mt.seplag.sgd.config;

import br.gov.mt.seplag.sgd.infra.RateLimitExceededException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
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
        log.info("🔍 RateLimitFilter executado para: {} {}", request.getMethod(), request.getRequestURI());
        
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String identifier;
            boolean isAuthenticated = false;
            
            // Se autenticado, usa o nome do usuário; senão, usa o IP
            if (authentication != null && authentication.isAuthenticated() 
                && !(authentication.getPrincipal() instanceof String && authentication.getPrincipal().equals("anonymousUser"))) {
                identifier = authentication.getName();
                isAuthenticated = true;
                log.info("✅ Verificando rate limit para usuário autenticado: {} (limite: 10/min)", identifier);
            } else {
                identifier = getClientIP(request);
                log.info("✅ Verificando rate limit para IP: {} (limite: 30/min)", identifier);
            }
            
            boolean allowed = rateLimitStore.allowRequest(identifier, isAuthenticated);
            log.info("Rate limit result: {}", allowed ? "PERMITIDO" : "BLOQUEADO");
            
            if (!allowed) {
                String limit = isAuthenticated ? "10 requisições por minuto" : "30 requisições por minuto";
                log.warn("⛔ Rate limit excedido para: {}", identifier);
                response.setStatus(429);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Rate limit excedido: máximo " + limit + "\"}");
                return;
            }
            
            filterChain.doFilter(request, response);
        } catch (RateLimitExceededException e) {
            log.warn("Rate limit exception: {}", e.getMessage());
            response.setStatus(429);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
        } catch (Exception e) {
            log.error("❌ Erro no RateLimitFilter: {}", e.getMessage(), e);
            filterChain.doFilter(request, response);
        }
    }
    
    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
