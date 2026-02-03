package br.gov.mt.seplag.sgd.dto;

import java.time.LocalDateTime;

public record RegionalDTO(
    Integer id,
    String idExternal,
    String nome,
    Boolean ativo,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
