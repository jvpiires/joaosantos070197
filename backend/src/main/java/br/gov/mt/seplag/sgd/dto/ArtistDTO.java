package br.gov.mt.seplag.sgd.dto;

import jakarta.validation.constraints.NotBlank;

public record ArtistDTO(
    Long id,

    @NotBlank(message = "O nome do artista é obrigatório")
    String name
) {
}
