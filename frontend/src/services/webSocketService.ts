import { BehaviorSubject, Subject } from 'rxjs';
import { Client, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { type AlbumNotification } from '../types/api.types';

export type Notification = AlbumNotification | ArtistNotification;

export interface ArtistNotification {
  id: number;
  name: string;
  year?: number;
  createdAt: string;
}

class WebSocketService {
  private client: Client | null = null;
  private notificationSubject = new Subject<Notification>();
  private connectionSubject = new BehaviorSubject<boolean>(false);

  public notification$ = this.notificationSubject.asObservable();
  public connection$ = this.connectionSubject.asObservable();

  connect(): void {
    if (this.client && this.client.active) {
      return;
    }

    const token = localStorage.getItem('token');

    const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

    this.client = new Client({
      webSocketFactory: () => new SockJS(`${baseUrl}/ws/sgd`),
      reconnectDelay: 5000,
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      onConnect: () => {
        this.connectionSubject.next(true);
        console.log('✅ WebSocket conectado!');
        
        // Inscrever em notificações de artistas
        this.client?.subscribe('/topic/artists', (message: IMessage) => {
          try {
            const notification = JSON.parse(message.body) as ArtistNotification;
            this.notificationSubject.next(notification);
          } catch (error) {
            console.error('Erro ao parsear notificação de artista:', error);
          }
        });
        
        // Inscrever em notificações de álbuns
        this.client?.subscribe('/topic/albums', (message: IMessage) => {
          try {
            const notification = JSON.parse(message.body) as AlbumNotification;
            this.notificationSubject.next(notification);
          } catch (error) {
            console.error('Erro ao parsear notificação de álbum:', error);
          }
        });
        
        // NOVO: Inscrever em notificações de refresh token
        this.client?.subscribe('/topic/auth-refresh', (message: IMessage) => {
          try {
            const data = JSON.parse(message.body);
            console.log('🔐 Refresh token recebido via WebSocket:', data);
            // Você pode mostrar um toast aqui se quiser
          } catch (error) {
            console.error('Erro ao parsear notificação de refresh:', error);
          }
        });
      },
      onStompError: (error) => {
        console.error('Erro STOMP:', error);
        this.connectionSubject.next(false);
      },
      onWebSocketError: (error) => {
        console.error('Erro WebSocket:', error);
        this.connectionSubject.next(false);
      },
      onWebSocketClose: () => {
        this.connectionSubject.next(false);
      }
    });

    this.client.activate();
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.connectionSubject.next(false);
    }
  }

  isConnected(): boolean {
    return this.connectionSubject.value;
  }
}

export const webSocketService = new WebSocketService();
