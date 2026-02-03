package br.gov.mt.seplag.sgd.service;

import br.gov.mt.seplag.sgd.dto.ArtistDTO;
import br.gov.mt.seplag.sgd.entity.Artist;
import br.gov.mt.seplag.sgd.repository.ArtistRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ArtistService {

    @Autowired
    private ArtistRepository repository;

    @Transactional(readOnly = true)
    public Page<ArtistDTO> findAll(String name, Pageable pageable) {
        Page<Artist> page;
        if (name != null && !name.isBlank()) {
            page = repository.findByNameContainingIgnoreCase(name, pageable);
        } else {
            page = repository.findAll(pageable);
        }
        return page.map(this::toDTO);
    }

    @Transactional(readOnly = true)
    public ArtistDTO findById(Long id) {
        Artist artist = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Artista não encontrado"));
        return toDTO(artist);
    }

    @Transactional
    public ArtistDTO create(ArtistDTO dto) {
        Artist artist = new Artist();
        artist.setName(dto.name());
        repository.save(artist);
        return toDTO(artist);
    }

    @Transactional
    public ArtistDTO update(Long id, ArtistDTO dto) {
        Artist artist = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Artista não encontrado"));
        
        artist.setName(dto.name());
        return toDTO(artist);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Artista não encontrado");
        }
        repository.deleteById(id);
    }

    private ArtistDTO toDTO(Artist artist) {
        return new ArtistDTO(artist.getId(), artist.getName());
    }
}
