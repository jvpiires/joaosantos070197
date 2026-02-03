package br.gov.mt.seplag.sgd.dto;

import jakarta.validation.constraints.NotBlank;

public record ArtistDTO(
    Long id,

    String name
) {
}
