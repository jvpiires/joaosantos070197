package br.gov.mt.seplag.sgd.dto;

import java.time.LocalDateTime;

public record AlbumUpdateNotificationDTO(
    Long id,
    String title,
    String action,
    LocalDateTime timestamp
) {}
