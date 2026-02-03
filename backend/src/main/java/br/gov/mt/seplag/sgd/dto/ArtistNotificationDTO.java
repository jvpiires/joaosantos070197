package br.gov.mt.seplag.sgd.dto;

import java.time.LocalDateTime;

public record ArtistNotificationDTO(
    Long id,
    String name,
    Integer year,
    LocalDateTime createdAt
) {
}
