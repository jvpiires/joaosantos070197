package br.gov.mt.seplag.sgd.service;

import br.gov.mt.seplag.sgd.dto.StatsDTO;
import br.gov.mt.seplag.sgd.repository.AlbumRepository;
import br.gov.mt.seplag.sgd.repository.ArtistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final AlbumRepository albumRepository;
    private final ArtistRepository artistRepository;

    public StatsDTO getStats() {
        long totalArtists = artistRepository.count();
        long totalAlbums = albumRepository.count();
        
        return new StatsDTO(totalArtists, totalAlbums);
    }
}
