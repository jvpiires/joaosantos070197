package br.gov.mt.seplag.sgd.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;

import java.util.List;

@Schema(
        name = "CreateArtistRequest",
        description = "Dados para criar um novo artista",
        example = """
                {
                  "name": "The Beatles",
                  "year": 1960,
                  "albumIds": [1, 2, 3]
                }
                """
)
public record CreateArtistRequest(
    @NotBlank(message = "Nome é obrigatório")
    @Schema(description = "Nome do artista", example = "The Beatles")
    String name,
    
    @Schema(description = "Ano de formação/nascimento do artista", example = "1960")
    Integer year,
    
    @Schema(description = "IDs dos álbuns do artista", example = "[1, 2, 3]")
    List<Long> albumIds
) {
}
