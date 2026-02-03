package br.gov.mt.seplag.sgd.service;

import br.gov.mt.seplag.sgd.dto.AlbumDTO;
import br.gov.mt.seplag.sgd.dto.AlbumNotificationDTO;
import br.gov.mt.seplag.sgd.dto.ArtistDTO;
import br.gov.mt.seplag.sgd.entity.Album;
import br.gov.mt.seplag.sgd.entity.Artist;
import br.gov.mt.seplag.sgd.repository.AlbumRepository;
import br.gov.mt.seplag.sgd.repository.ArtistRepository;
import br.gov.mt.seplag.sgd.repository.AlbumImageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AlbumServiceTest {

    @Mock
    private AlbumRepository albumRepository;

    @Mock
    private ArtistRepository artistRepository;

    @Mock
    private AlbumImageRepository albumImageRepository;

    @Mock
    private FileStorageService fileStorageService;

    @Mock
    private WebSocketService webSocketService;

    @InjectMocks
    private AlbumService albumService;

    private Artist testArtist;
    private Album testAlbum;

    @BeforeEach
    void setUp() {
        testArtist = new Artist();
        testArtist.setId(1L);
        testArtist.setName("Test Artist");

        testAlbum = new Album();
        testAlbum.setId(1L);
        testAlbum.setTitle("Test Album");
        testAlbum.setArtists(List.of(testArtist));
        testAlbum.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void testCreateAlbum() {
        AlbumDTO dto = new AlbumDTO(null, "New Album", null, List.of(1L), List.of(), null);
        
        when(artistRepository.findAllById(List.of(1L))).thenReturn(List.of(testArtist));
        when(albumRepository.save(any(Album.class))).thenReturn(testAlbum);

        AlbumDTO result = albumService.create(dto);

        assertNotNull(result);
        assertEquals("Test Album", result.title());
        verify(webSocketService, times(1)).notifyNewAlbum(any(AlbumNotificationDTO.class));
    }

    @Test
    void testFindAlbumById() {
        when(albumRepository.findById(1L)).thenReturn(Optional.of(testAlbum));

        AlbumDTO result = albumService.findById(1L);

        assertNotNull(result);
        assertEquals("Test Album", result.title());
    }

    @Test
    void testDeleteAlbum() {
        when(albumRepository.existsById(1L)).thenReturn(true);

        albumService.delete(1L);

        verify(albumRepository, times(1)).deleteById(1L);
    }
}
