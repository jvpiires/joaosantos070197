package br.gov.mt.seplag.sgd.service;

import br.gov.mt.seplag.sgd.dto.AlbumSummaryDTO;
import br.gov.mt.seplag.sgd.dto.ArtistDTO;
import br.gov.mt.seplag.sgd.dto.ArtistNotificationDTO;
import br.gov.mt.seplag.sgd.dto.CreateArtistRequest;
import br.gov.mt.seplag.sgd.entity.Album;
import br.gov.mt.seplag.sgd.entity.Artist;
import br.gov.mt.seplag.sgd.repository.AlbumRepository;
import br.gov.mt.seplag.sgd.repository.ArtistRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ArtistService {

    @Autowired
    private ArtistRepository repository;
    
    @Autowired
    private AlbumRepository albumRepository;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @Autowired
    private WebSocketService webSocketService;

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
    public ArtistDTO create(CreateArtistRequest request, MultipartFile image) {
        Artist artist = new Artist();
        artist.setName(request.name());
        artist.setYear(request.year());
        
        // Upload da imagem se fornecida
        if (image != null && !image.isEmpty()) {
            String imageKey = fileStorageService.uploadFile(image);
            artist.setImageUrl(imageKey);
        }
        
        // Associar álbuns se fornecidos
        if (request.albumIds() != null && !request.albumIds().isEmpty()) {
            List<Album> albums = albumRepository.findAllById(request.albumIds());
            artist.setAlbums(albums);
            // Atualizar o relacionamento bidirecional
            for (Album album : albums) {
                if (!album.getArtists().contains(artist)) {
                    album.getArtists().add(artist);
                }
            }
        }
        
        Artist savedArtist = repository.save(artist);
        
        // Enviar notificação WebSocket
        ArtistNotificationDTO notification = new ArtistNotificationDTO(
            savedArtist.getId(),
            savedArtist.getName(),
            savedArtist.getYear(),
            savedArtist.getCreatedAt()
        );
        webSocketService.notifyNewArtist(notification);
        
        return toDTO(savedArtist);
    }

    @Transactional
    public ArtistDTO update(Long id, ArtistDTO dto) {
        Artist artist = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Artista não encontrado"));
        
        artist.setName(dto.name());
        if (dto.year() != null) {
            artist.setYear(dto.year());
        }
        if (dto.imageUrl() != null) {
            artist.setImageUrl(dto.imageUrl());
        }
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
        List<AlbumSummaryDTO> albumDTOs = artist.getAlbums() != null 
            ? artist.getAlbums().stream()
                .map(album -> new AlbumSummaryDTO(album.getId(), album.getTitle()))
                .collect(Collectors.toList())
            : new ArrayList<>();
            
        // Gerar URL pré-assinada se houver imagem
        String imageUrl = artist.getImageUrl();
        if (imageUrl != null && !imageUrl.isEmpty()) {
            imageUrl = fileStorageService.getPresignedUrl(imageUrl);
        }
        
        return new ArtistDTO(
            artist.getId(), 
            artist.getName(), 
            imageUrl,
            artist.getYear(),
            albumDTOs
        );
    }
}
