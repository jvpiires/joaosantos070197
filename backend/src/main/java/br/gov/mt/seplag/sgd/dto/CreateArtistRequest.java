package br.gov.mt.seplag.sgd.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;

import java.util.List;

public record CreateArtistRequest(
    @NotBlank(message = "Nome é obrigatório")
    String name,
    
    Integer year,
    
    List<Long> albumIds
) {
}
