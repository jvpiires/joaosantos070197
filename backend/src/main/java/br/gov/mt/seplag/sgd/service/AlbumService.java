package br.gov.mt.seplag.sgd.service;

import br.gov.mt.seplag.sgd.dto.AlbumDTO;
import br.gov.mt.seplag.sgd.dto.AlbumImageDTO;
import br.gov.mt.seplag.sgd.dto.AlbumNotificationDTO;
import br.gov.mt.seplag.sgd.dto.ArtistDTO;
import br.gov.mt.seplag.sgd.entity.Album;
import br.gov.mt.seplag.sgd.entity.AlbumImage;
import br.gov.mt.seplag.sgd.entity.Artist;
import br.gov.mt.seplag.sgd.repository.AlbumImageRepository;
import br.gov.mt.seplag.sgd.repository.AlbumRepository;
import br.gov.mt.seplag.sgd.repository.ArtistRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlbumService {

    @Autowired
    private AlbumRepository repository;

    @Autowired
    private ArtistRepository artistRepository;

    @Autowired
    private AlbumImageRepository albumImageRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private WebSocketService webSocketService;

    @Transactional(readOnly = true)
    public Page<AlbumDTO> findAll(Long artistId, String title, Pageable pageable) {
        Page<Album> page;
        
        if (artistId != null) {
            page = repository.findByArtistsId(artistId, pageable);
        } else if (title != null && !title.isBlank()) {
            page = repository.findByTitleContainingIgnoreCase(title, pageable);
        } else {
            page = repository.findAll(pageable);
        }
        
        return page.map(this::toDTO);
    }

    @Transactional(readOnly = true)
    public AlbumDTO findById(Long id) {
        Album album = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Álbum não encontrado"));
        return toDTO(album);
    }

    @Transactional
    public AlbumDTO create(AlbumDTO dto) {
        Album album = new Album();
        album.setTitle(dto.title());
        
        // Se artistIds for fornecido, use para adicionar múltiplos artistas
        if (dto.artistIds() != null && !dto.artistIds().isEmpty()) {
            List<Artist> artists = artistRepository.findAllById(dto.artistIds());
            if (artists.isEmpty()) {
                throw new EntityNotFoundException("Nenhum artista encontrado com os IDs fornecidos");
            }
            album.setArtists(artists);
        } else if (dto.artists() != null && !dto.artists().isEmpty()) {
            // Se artists for fornecido via DTO
            List<Long> ids = dto.artists().stream()
                    .map(ArtistDTO::id)
                    .collect(Collectors.toList());
            List<Artist> artists = artistRepository.findAllById(ids);
            album.setArtists(artists);
        }
        
        Album savedAlbum = repository.save(album);
        
        // Enviar notificação WebSocket
        if (!savedAlbum.getArtists().isEmpty()) {
            String artistNames = savedAlbum.getArtists().stream()
                    .map(Artist::getName)
                    .collect(Collectors.joining(", "));
            AlbumNotificationDTO notification = new AlbumNotificationDTO(
                savedAlbum.getId(),
                savedAlbum.getTitle(),
                artistNames,
                savedAlbum.getCreatedAt()
            );
            webSocketService.notifyNewAlbum(notification);
        }
        
        return toDTO(savedAlbum);
    }

    @Transactional
    public AlbumDTO update(Long id, AlbumDTO dto) {
        Album album = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Álbum não encontrado"));
        
        album.setTitle(dto.title());
        
        // Atualiza artistas se fornecido
        if (dto.artistIds() != null && !dto.artistIds().isEmpty()) {
            List<Artist> artists = artistRepository.findAllById(dto.artistIds());
            album.setArtists(artists);
        }

        return toDTO(repository.save(album));
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Álbum não encontrado");
        }
        repository.deleteById(id);
    }

    @Transactional
    public AlbumDTO uploadImage(Long id, MultipartFile file) {
        Album album = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Álbum não encontrado"));
        
        String fileKey = fileStorageService.uploadFile(file);
        
        AlbumImage image = new AlbumImage();
        image.setAlbum(album);
        image.setFileKey(fileKey);
        image.setFileName(file.getOriginalFilename());
        image.setContentType(file.getContentType());
        
        albumImageRepository.save(image);
        album.getImages().add(image);
        
        return toDTO(album);
    }

    private AlbumDTO toDTO(Album album) {
        List<AlbumImageDTO> images = album.getImages().stream()
                .map(img -> new AlbumImageDTO(
                        img.getId(), 
                        fileStorageService.getPresignedUrl(img.getFileKey()), 
                        img.getFileName()
                ))
                .collect(Collectors.toList());

        List<ArtistDTO> artistDtos = album.getArtists().stream()
                .map(artist -> new ArtistDTO(artist.getId(), artist.getName()))
                .collect(Collectors.toList());

        return new AlbumDTO(
            album.getId(), 
            album.getTitle(), 
            artistDtos,
            null,
            images,
            album.getCreatedAt()
        );
    }
}

