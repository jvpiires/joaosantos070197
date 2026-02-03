package br.gov.mt.seplag.sgd.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record AlbumDTO(
    Long id,
    
    @NotBlank(message = "O título do álbum é obrigatório")
    String title,
    
    List<ArtistDTO> artists,
    
    List<Long> artistIds, // Para POST/PUT com lista de IDs

    List<AlbumImageDTO> images, // Imagens do álbum
    
    java.time.LocalDateTime createdAt
) {}

