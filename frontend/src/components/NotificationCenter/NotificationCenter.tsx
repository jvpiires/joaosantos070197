import { useEffect, useState } from 'react';
import { webSocketService } from '../../services/webSocketService';
import { type AlbumNotification } from '../../types/api.types';
import './NotificationCenter.css';

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<AlbumNotification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Conectar ao WebSocket
    webSocketService.connect();

    // Subscrever a notificações
    const notificationSub = webSocketService.notification$.subscribe((notification) => {
      setNotifications((prev) => [notification, ...prev]);
      // Mostrar toast
      showNotificationToast(notification);
    });

    // Subscrever ao status de conexão
    const connectionSub = webSocketService.connection$.subscribe((connected) => {
      setIsConnected(connected);
    });

    return () => {
      notificationSub.unsubscribe();
      connectionSub.unsubscribe();
      webSocketService.disconnect();
    };
  }, []);

  function showNotificationToast(notification: AlbumNotification) {
    // Usar toast para exibir notificação
    const message = `Novo álbum: "${notification.title}" de ${notification.artistName}`;
    // Você pode integrar com 'sonner' ou outro toast aqui
    console.log('Notificação:', message);
  }

  function dismissNotification(index: number) {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  }

  function clearAll() {
    setNotifications([]);
  }

  return (
    <div className="notification-center">
      <button
        className={`notification-btn ${isConnected ? 'connected' : 'disconnected'}`}
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <span className="notification-icon">🔔</span>
        {notifications.length > 0 && (
          <span className="notification-badge">{notifications.length}</span>
        )}
      </button>

      {showNotifications && (
        <div className="notification-panel">
          <div className="notification-header">
            <h3>Notificações</h3>
            <div className="notification-controls">
              <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
                {isConnected ? '✓ Conectado' : '✗ Desconectado'}
              </span>
              {notifications.length > 0 && (
                <button onClick={clearAll} className="btn-clear">
                  Limpar
                </button>
              )}
            </div>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="empty-notifications">
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div key={index} className="notification-item">
                  <div className="notification-content">
                    <div className="notification-title">
                      Novo Álbum: {notification.title}
                    </div>
                    <div className="notification-artist">
                      {notification.artistName}
                    </div>
                    <div className="notification-time">
                      {new Date(notification.createdAt).toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <button
                    onClick={() => dismissNotification(index)}
                    className="btn-dismiss"
                    title="Descartar"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
