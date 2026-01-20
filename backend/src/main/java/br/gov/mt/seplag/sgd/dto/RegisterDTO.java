package br.gov.mt.seplag.sgd.dto;

import br.gov.mt.seplag.sgd.enums.UserRole;

public record RegisterDTO(String login, String password, UserRole userRole) {
}