package br.gov.mt.seplag.sgd.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatsDTO {
    private long totalArtists;
    private long totalAlbums;
}
