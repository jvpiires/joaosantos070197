package br.gov.mt.seplag.sgd.dto;

public record AlbumImageDTO(
    Long id,
    String url, // URL assinada (temporária) para o frontend exibir
    String fileName
) {
}
