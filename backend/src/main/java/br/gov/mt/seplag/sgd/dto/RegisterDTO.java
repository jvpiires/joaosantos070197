package br.gov.mt.seplag.sgd.dto;

import br.gov.mt.seplag.sgd.enums.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterDTO(
    @NotBlank(message = "O login é obrigatório")
    @Size(min = 3, max = 20, message = "O login deve ter entre 3 e 20 caracteres")
    @Pattern(regexp = "^[a-zA-Z0-9._-]+$", message = "Login deve conter apenas letras, números, ponto ou traço")
    String login,

    @NotBlank(message = "A senha é obrigatória")
    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres")
    String password,

    @NotNull(message = "A role de usuário é obrigatória")
    UserRole userRole
) {
}