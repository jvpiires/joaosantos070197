package br.gov.mt.seplag.sgd.dto;

import java.time.LocalDateTime;

public record SyncDTO(
    Long id,
    String idExternal,
    String entityType,
    Long entityId,
    String externalData,
    String status,
    LocalDateTime lastSyncAt,
    String syncErrorMessage,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
