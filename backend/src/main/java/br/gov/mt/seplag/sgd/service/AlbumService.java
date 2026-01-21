package br.gov.mt.seplag.sgd.service;

import br.gov.mt.seplag.sgd.dto.AlbumDTO;
import br.gov.mt.seplag.sgd.dto.AlbumImageDTO;
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

    @Transactional(readOnly = true)
    public Page<AlbumDTO> findAll(Long artistId, String title, Pageable pageable) {
        Page<Album> page;
        
        if (artistId != null) {
            page = repository.findByArtistId(artistId, pageable);
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
        Artist artist = artistRepository.findById(dto.artistId())
                .orElseThrow(() -> new EntityNotFoundException("Artista não encontrado com ID: " + dto.artistId()));

        Album album = new Album();
        album.setTitle(dto.title());
        album.setArtist(artist);
        
        repository.save(album);
        return toDTO(album);
    }

    @Transactional
    public AlbumDTO update(Long id, AlbumDTO dto) {
        Album album = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Álbum não encontrado"));
        
        // Atualiza título
        album.setTitle(dto.title());
        
        // Verifica se houve mudança de artista
        if (!album.getArtist().getId().equals(dto.artistId())) {
             Artist newArtist = artistRepository.findById(dto.artistId())
                .orElseThrow(() -> new EntityNotFoundException("Artista não encontrado com ID: " + dto.artistId()));
             album.setArtist(newArtist);
        }

        return toDTO(album);
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
        
        // Adiciona à lista local para refletir no retorno
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

        return new AlbumDTO(
            album.getId(), 
            album.getTitle(), 
            album.getArtist().getId(),
            album.getArtist().getName(),
            images
        );
    }
}
