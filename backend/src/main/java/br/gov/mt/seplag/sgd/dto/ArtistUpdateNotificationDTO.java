package br.gov.mt.seplag.sgd.dto;

import java.time.LocalDateTime;

public record ArtistUpdateNotificationDTO(
    Long id,
    String name,
    Integer year,
    String action,
    LocalDateTime timestamp
) {}
