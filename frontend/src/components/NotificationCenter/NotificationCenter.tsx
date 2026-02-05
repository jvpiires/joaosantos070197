import { useEffect, useState } from 'react';
import { webSocketService, type Notification } from '../../services/webSocketService';
import './NotificationCenter.css';

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    webSocketService.connect();

    const notificationSub = webSocketService.notification$.subscribe((notification) => {
      setNotifications((prev) => [notification, ...prev]);
      showNotificationToast(notification);
    });

    const connectionSub = webSocketService.connection$.subscribe((connected) => {
      setIsConnected(connected);
    });

    return () => {
      notificationSub.unsubscribe();
      connectionSub.unsubscribe();
      webSocketService.disconnect();
    };
  }, []);

  function showNotificationToast(notification: Notification) {
    let message = '';
    if ('title' in notification) {
      // Álbum (novo ou atualização)
      if ('action' in notification && notification.action) {
        message = notification.action === 'DELETED' 
          ? `Álbum removido: "${notification.title}"`
          : `Álbum atualizado: "${notification.title}"`;
      } else {
        message = `Novo álbum: "${notification.title}"`;
      }
    } else {
      // Artista (novo ou atualização)
      if ('action' in notification && notification.action) {
        message = notification.action === 'DELETED'
          ? `Artista removido: "${notification.name}"`
          : `Artista atualizado: "${notification.name}"`;
      } else {
        message = `Novo artista: "${notification.name}"${notification.year ? ` (${notification.year})` : ''}`;
      }
    }
    console.log('🔔 Notificação recebida:', message);
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
                    {'title' in notification ? (
                      <>
                        <div className="notification-title">
                          {'action' in notification && notification.action === 'DELETED' ? '❌ Álbum Removido' : '✏️ Álbum Atualizado'}
                          {!('action' in notification) && '✨ Novo Álbum'}
                          : {notification.title}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="notification-title">
                          {'action' in notification && notification.action === 'DELETED' ? '❌ Artista Removido' : '✏️ Artista Atualizado'}
                          {!('action' in notification) && '✨ Novo Artista'}
                          : {notification.name}
                        </div>
                        {notification.year && (
                          <div className="notification-artist">
                            {notification.year}
                          </div>
                        )}
                      </>
                    )}
                    <div className="notification-time">
                      {(() => {
                        const timestamp = 'timestamp' in notification ? notification.timestamp : notification.createdAt;
                        return new Date(timestamp).toLocaleString('pt-BR');
                      })()}
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
