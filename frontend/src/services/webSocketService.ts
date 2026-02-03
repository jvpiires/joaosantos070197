import { BehaviorSubject, Subject } from 'rxjs';
import { Client, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { type AlbumNotification } from '../types/api.types';

class WebSocketService {
  private client: Client | null = null;
  private notificationSubject = new Subject<AlbumNotification>();
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
        console.log('WebSocket conectado');
        this.connectionSubject.next(true);
        this.client?.subscribe('/topic/albums', (message: IMessage) => {
          try {
            const notification = JSON.parse(message.body) as AlbumNotification;
            this.notificationSubject.next(notification);
          } catch (error) {
            console.error('Erro ao parsear notificação:', error);
          }
        });
      },
      onStompError: (frame) => {
        console.error('Erro STOMP:', frame.headers['message'], frame.body);
        this.connectionSubject.next(false);
      },
      onWebSocketError: (error) => {
        console.error('Erro WebSocket:', error);
        this.connectionSubject.next(false);
      },
      onWebSocketClose: () => {
        console.log('WebSocket desconectado');
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
