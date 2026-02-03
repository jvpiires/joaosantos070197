import { useEffect, useState } from 'react';
import { apiService } from '../../services/apiService';
import { type Regional } from '../../types/api.types';
import './RegionaisManagement.css';

export function RegionaisManagement() {
  const [regionais, setRegionais] = useState<Regional[]>([]);
  const [loading, setLoading] = useState(false);

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
      console.error('Erro ao carregar regionais:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="regionais-management">
      <div className="regionais-header">
        <h2>Regionais Disponíveis</h2>
        <button onClick={loadRegionais} disabled={loading} className="btn-refresh">
          {loading ? 'Carregando...' : 'Atualizar'}
        </button>
      </div>

      <div className="regionais-grid">
        {regionais.map((regional) => (
          <div key={regional.id} className={`regional-card ${regional.ativo ? 'ativo' : 'inativo'}`}>
            <div className="regional-header">
              <h3>{regional.nome}</h3>
              <span className={`status-badge ${regional.ativo ? 'ativo' : 'inativo'}`}>
                {regional.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <div className="regional-info">
              <p><strong>ID:</strong> {regional.id}</p>
            </div>
          </div>
        ))}
      </div>

      {regionais.length === 0 && !loading && (
        <div className="empty-state">
          <p>Nenhuma regional encontrada</p>
        </div>
      )}
    </div>
  );
}
