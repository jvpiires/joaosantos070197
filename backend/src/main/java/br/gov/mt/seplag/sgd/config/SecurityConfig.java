package br.gov.mt.seplag.sgd.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    SecurityFilter securityFilter;

    @Autowired
    CorsConfigurationSource corsConfigurationSource;

    @Autowired
    RateLimitFilter rateLimitFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        // 1. Rotas de Autenticação (Públicas)
                        .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/refresh").authenticated()

                        // 2. WebSocket e Documentação
                        .requestMatchers("/ws/**", "/ws/sgd/**").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()

                        // 3. Gestão de Usuários (Apenas ADMIN) - DEVE VIR ANTES DAS REGRAS GENÉRICAS
                        .requestMatchers("/api/users/**").hasRole("ADMIN")

                        // 4. ARTISTAS - Regras específicas DEVEM VIR ANTES das genéricas
                        .requestMatchers(HttpMethod.POST, "/api/v1/artists").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/artists/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/artists/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/v1/artists", "/api/v1/artists/**").permitAll()

                        // 5. ÁLBUNS - Regras específicas
                        .requestMatchers(HttpMethod.POST, "/api/v1/albums").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/albums/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/albums/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/v1/albums", "/api/v1/albums/**").permitAll()

                        // 6. REGIONAIS - Apenas leitura pública
                        .requestMatchers(HttpMethod.GET, "/api/regionais", "/api/regionais/**").permitAll()

                        // 7. Tudo mais exige autenticação
                        .anyRequest().authenticated()
                )
                .addFilterBefore(rateLimitFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}