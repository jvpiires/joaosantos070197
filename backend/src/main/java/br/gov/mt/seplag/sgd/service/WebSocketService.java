package br.gov.mt.seplag.sgd.service;

import br.gov.mt.seplag.sgd.dto.AlbumNotificationDTO;
import br.gov.mt.seplag.sgd.dto.AlbumUpdateNotificationDTO;
import br.gov.mt.seplag.sgd.dto.ArtistNotificationDTO;
import br.gov.mt.seplag.sgd.dto.ArtistUpdateNotificationDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void notifyNewArtist(ArtistNotificationDTO notification) {
        messagingTemplate.convertAndSend("/topic/artists", notification);
    }

    public void notifyArtistUpdate(ArtistUpdateNotificationDTO notification) {
        messagingTemplate.convertAndSend("/topic/artists/updates", notification);
    }

    public void notifyNewAlbum(AlbumNotificationDTO notification) {
        messagingTemplate.convertAndSend("/topic/albums", notification);
    }

    public void notifyAlbumUpdate(AlbumUpdateNotificationDTO notification) {
        messagingTemplate.convertAndSend("/topic/albums/updates", notification);
    }
}
