import { useState, useEffect } from 'react';
import { DataTable, type DataTableExpandedRows } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import apiClient from '../../services/apiClient';
import { toast } from 'sonner';
import './ArtistsDataTable.css';

interface Artist {
  id: number;
  name: string;
  createdAt: string;
}

export function ArtistsDataTable() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows>({});
  const [showDialog, setShowDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: 0, name: '', createdAt: '' });
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  useEffect(() => {
    loadArtists();
  }, []);

  async function loadArtists() {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/artists');
      setArtists(response.data.content || response.data);
    } catch (error) {
      toast.error('Erro ao carregar artistas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function openDialog(artist?: Artist) {
    if (artist) {
      setFormData(artist);
      setIsEditing(true);
    } else {
      setFormData({ id: 0, name: '', createdAt: '' });
      setIsEditing(false);
    }
    setShowDialog(true);
  }

  async function handleSave() {
    if (!formData.name.trim()) {
      toast.error('Nome do artista é obrigatório');
      return;
    }

    try {
      if (isEditing) {
        await apiClient.put(`/api/artists/${formData.id}`, { name: formData.name });
        toast.success('Artista atualizado com sucesso');
      } else {
        await apiClient.post('/api/artists', { name: formData.name });
        toast.success('Artista criado com sucesso');
      }
      setShowDialog(false);
      await loadArtists();
    } catch (error) {
      toast.error('Erro ao salvar artista');
      console.error(error);
    }
  }

  async function handleDelete(id: number) {
    if (window.confirm('Tem certeza que deseja deletar este artista?')) {
      try {
        await apiClient.delete(`/api/artists/${id}`);
        toast.success('Artista deletado com sucesso');
        await loadArtists();
      } catch (error) {
        toast.error('Erro ao deletar artista');
        console.error(error);
      }
    }
  }

  const rowExpansionTemplate = (data: Artist) => {
    return (
      <div className="artists-expansion">
        <div className="expansion-content">
          <p><strong>ID:</strong> {data.id}</p>
          <p><strong>Criado em:</strong> {new Date(data.createdAt).toLocaleDateString('pt-BR')}</p>
          <div className="expansion-actions">
            <Button
              icon="pi pi-pencil"
              severity="info"
              rounded
              text
              onClick={() => openDialog(data)}
              tooltip="Editar"
            />
            <Button
              icon="pi pi-trash"
              severity="danger"
              rounded
              text
              onClick={() => handleDelete(data.id)}
              tooltip="Deletar"
            />
          </div>
        </div>
      </div>
    );
  };

  const actionBodyTemplate = (rowData: Artist) => {
    return (
      <div className="action-buttons">
        <Button
          icon="pi pi-pencil"
          severity="info"
          rounded
          text
          onClick={() => openDialog(rowData)}
          tooltip="Editar"
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          rounded
          text
          onClick={() => handleDelete(rowData.id)}
          tooltip="Deletar"
        />
      </div>
    );
  };

  const dateBodyTemplate = (rowData: Artist) => {
    return new Date(rowData.createdAt).toLocaleDateString('pt-BR');
  };

  const header = (
    <div className="datatable-header">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          value={globalFilterValue}
          onChange={(e) => setGlobalFilterValue(e.target.value)}
          placeholder="Buscar artista..."
        />
      </span>
      <Button
        icon="pi pi-plus"
        severity="success"
        rounded
        onClick={() => openDialog()}
        tooltip="Novo artista"
      />
    </div>
  );

  return (
    <>
      <DataTable
        value={artists}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data as DataTableExpandedRows)}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="id"
        header={header}
        paginator
        rows={10}
        globalFilter={globalFilterValue}
        globalFilterFields={['name']}
        loading={loading}
        tableStyle={{ minWidth: '60rem' }}
        rowsPerPageOptions={[5, 10, 20]}
        className="artists-datatable"
        emptyMessage="Nenhum artista encontrado"
      >
        <Column expander style={{ width: '5rem' }} />
        <Column field="id" header="ID" sortable style={{ width: '8rem' }} />
        <Column field="name" header="Nome" sortable />
        <Column field="createdAt" header="Criado em" body={dateBodyTemplate} sortable />
        <Column body={actionBodyTemplate} style={{ width: '10rem' }} />
      </DataTable>

      <Dialog
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        header={isEditing ? 'Editar Artista' : 'Novo Artista'}
        modal
        className="dialog-form"
      >
        <div className="form-field">
          <label>Nome do Artista</label>
          <InputText
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Digite o nome do artista"
          />
        </div>
        <div className="form-actions">
          <Button
            label="Salvar"
            icon="pi pi-check"
            onClick={handleSave}
            loading={loading}
          />
          <Button
            label="Cancelar"
            icon="pi pi-times"
            severity="secondary"
            onClick={() => setShowDialog(false)}
          />
        </div>
      </Dialog>
    </>
  );
}
