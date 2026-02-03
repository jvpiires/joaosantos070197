package br.gov.mt.seplag.sgd.dto;

import java.time.LocalDateTime;

public record AlbumNotificationDTO(
    Long albumId,
    String title,
    String artistName,
    LocalDateTime createdAt
) {}
