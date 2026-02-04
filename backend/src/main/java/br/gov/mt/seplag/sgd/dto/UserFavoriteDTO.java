package br.gov.mt.seplag.sgd.dto;

import br.gov.mt.seplag.sgd.entity.UserFavorite;

public record UserFavoriteDTO(
    Long id,
    Long userId,
    Long albumId,
    String albumTitle,
    java.time.LocalDateTime createdAt
) {
    public static UserFavoriteDTO fromEntity(UserFavorite favorite) {
        return new UserFavoriteDTO(
            favorite.getId(),
            favorite.getUser().getId(),
            favorite.getAlbum().getId(),
            favorite.getAlbum().getTitle(),
            favorite.getCreatedAt()
        );
    }
}