package br.gov.mt.seplag.sgd.service;

import br.gov.mt.seplag.sgd.dto.AlbumNotificationDTO;
import br.gov.mt.seplag.sgd.dto.ArtistNotificationDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class WebSocketService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Envia notificação de novo artista para todos os clientes conectados
     */
    public void notifyNewArtist(ArtistNotificationDTO notification) {
        log.info("Enviando notificação de novo artista: {}", notification.name());
        messagingTemplate.convertAndSend("/topic/artists", notification);
    }

    /**
     * Envia notificação de novo álbum para todos os clientes conectados
     */
    public void notifyNewAlbum(AlbumNotificationDTO notification) {
        log.info("Enviando notificação de novo álbum: {}", notification.title());
        messagingTemplate.convertAndSend("/topic/albums", notification);
    }
}
