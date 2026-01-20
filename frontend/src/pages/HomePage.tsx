import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

export const HomePage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Sistema de Gestão de Discografia</h1>
        <Button
          label="Sair"
          icon="pi pi-sign-out"
          className="p-button-danger"
          onClick={handleLogout}
        />
      </div>

      <div className="home-content">
        <Card className="welcome-card">
          <h2>Bem-vindo ao Sistema!</h2>
          <p>Você está autenticado e pode acessar todas as funcionalidades do sistema.</p>
          <div className="info-box">
            <i className="pi pi-info-circle"></i>
            <p>
              O token JWT será renovado automaticamente quando estiver próximo de expirar.
              Caso o token expire ou seja inválido, você será redirecionado para a tela de login.
            </p>
          </div>
        </Card>

        <div className="features-grid">
          <Card className="feature-card">
            <i className="pi pi-users feature-icon"></i>
            <h3>Artistas</h3>
            <p>Gerencie os artistas cadastrados no sistema</p>
          </Card>

          <Card className="feature-card">
            <i className="pi pi-folder feature-icon"></i>
            <h3>Álbuns</h3>
            <p>Administre os álbuns e suas informações</p>
          </Card>

          <Card className="feature-card">
            <i className="pi pi-images feature-icon"></i>
            <h3>Imagens</h3>
            <p>Gerencie as capas dos álbuns</p>
          </Card>

          <Card className="feature-card">
            <i className="pi pi-shield feature-icon"></i>
            <h3>Segurança</h3>
            <p>Sistema protegido com autenticação JWT</p>
          </Card>
        </div>
      </div>
    </div>
  );
};
