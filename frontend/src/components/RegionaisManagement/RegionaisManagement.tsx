import { useEffect, useState } from 'react';
import { apiService } from '../../services/apiService';
import apiClient from '../../services/apiClient';
import { toast } from 'sonner';
import { type Regional } from '../../types/api.types';
import './RegionaisManagement.css';

export function RegionaisManagement() {
  const [regionais, setRegionais] = useState<Regional[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  // const [showAddModal, setShowAddModal] = useState(false);
  // const [newRegionalName, setNewRegionalName] = useState('');
  // const [filtroStatus, setFiltroStatus] = useState<'todos' | 'ativos' | 'inativos'>('todos');

  useEffect(() => {
    loadRegionais();
    const subscription = apiService.getRegionais().subscribe((r) => setRegionais(r));
    return () => subscription.unsubscribe();
  }, []);

  async function loadRegionais() {
    try {
      setLoading(true);
      await apiService.loadRegionais();
    } catch (error) {
      toast.error('Erro ao carregar regionais');
      console.error('Erro ao carregar regionais:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSync() {
    setSyncing(true);
    try {
      await apiClient.post('/api/v1/regionais/sync');
      toast.success('Sincronização concluída com sucesso!');
      await loadRegionais();
    } catch (error) {
      toast.error('Erro ao sincronizar regionais');
      console.error('Erro ao sincronizar:', error);
    } finally {
      setSyncing(false);
    }
  }

  // async function handleAddRegional(e: React.FormEvent) {
  //   e.preventDefault();
  //   if (!newRegionalName.trim()) {
  //     toast.error('Nome da regional é obrigatório');
  //     return;
  //   }

  //   try {
  //     await apiClient.post('/api/v1/regionais', { nome: newRegionalName.trim() });
  //     toast.success('Regional adicionada com sucesso!');
  //     setNewRegionalName('');
  //     setShowAddModal(false);
  //     await loadRegionais();
  //   } catch (error) {
  //     toast.error('Erro ao adicionar regional');
  //     console.error('Erro ao adicionar:', error);
  //   }
  // }

  // async function handleToggleStatus(id: number, ativoAtual: boolean) {
  //   try {
  //     await apiClient.patch(`/api/v1/regionais/${id}/status`, { ativo: !ativoAtual });
  //     toast.success(`Regional ${!ativoAtual ? 'ativada' : 'inativada'} com sucesso!`);
  //     await loadRegionais();
  //   } catch (error) {
  //     toast.error('Erro ao alterar status da regional');
  //     console.error('Erro ao alterar status:', error);
  //   }
  // }

  // Filtra apenas regionais ativos
  const regionaisFiltrados = regionais.filter((regional) => regional.ativo);

  return (
    <div className="regionais-management">
      <div className="regionais-header">
        <div className="header-title">
          <h2>Regionais Disponíveis</h2>
        </div>
        <div className="header-buttons">
          <button 
            onClick={handleSync} 
            disabled={syncing || loading} 
            className="btn-sync"
            title="Sincronizar com API externa"
          >
            {syncing ? 'Sincronizando...' : '🔄 Sincronizar'}
          </button>
        </div>
      </div>

      <div className="regionais-grid">
        {regionaisFiltrados.map((regional) => (
          <div key={regional.id} className="regional-card ativo">
            <div className="regional-header">
              <h3>{regional.nome}</h3>
              <span className="status-badge ativo">
                ✓ Ativo
              </span>
            </div>
            <div className="regional-info">
              <p><strong>ID:</strong> {regional.id}</p>
              {regional.idExternal && <p><strong>ID Externo:</strong> {regional.idExternal}</p>}
            </div>
          </div>
        ))}
      </div>

      {regionaisFiltrados.length === 0 && !loading && (
        <div className="empty-state">
          <p>Nenhuma regional encontrada</p>
        </div>
      )}
    </div>
  );
}