package br.gov.mt.seplag.sgd.dto;

import jakarta.validation.constraints.NotBlank;

public record ChangeRoleDTO(
    @NotBlank(message = "Role não pode estar vazio")
    String role
) {}
