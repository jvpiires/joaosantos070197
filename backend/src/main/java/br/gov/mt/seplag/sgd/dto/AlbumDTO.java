package br.gov.mt.seplag.sgd.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AlbumDTO(
    Long id,
    
    @NotBlank(message = "O título do álbum é obrigatório")
    String title,
    
    @NotNull(message = "O ID do artista é obrigatório")
    Long artistId,
    
    String artistName, // Opcional, para exibição na listagem

    java.util.List<AlbumImageDTO> images // Imagens do álbum
) {}
