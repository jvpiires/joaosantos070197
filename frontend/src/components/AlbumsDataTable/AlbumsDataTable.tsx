import { useState, useEffect } from 'react';
import { DataTable, type DataTableExpandedRows,  } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { MultiSelect } from 'primereact/multiselect';
import apiClient from '../../services/apiClient';
import { toast } from 'sonner';
import './AlbumsDataTable.css';

interface Artist {
  id: number;
  name: string;
}

interface Album {
  id: number;
  title: string;
  artists: Artist[];
  createdAt: string;
}

export function AlbumsDataTable() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows>({});
  const [showDialog, setShowDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: 0, title: '', artists: [] as Artist[] });
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  useEffect(() => {
    loadAlbums();
    loadArtists();
  }, []);

  async function loadAlbums() {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/albums');
      setAlbums(response.data.content || response.data);
    } catch (error) {
      toast.error('Erro ao carregar álbuns');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function loadArtists() {
    try {
      const response = await apiClient.get('/api/artists');
      setArtists(response.data.content || response.data);
    } catch (error) {
      toast.error('Erro ao carregar artistas');
      console.error(error);
    }
  }

  function openDialog(album?: Album) {
    if (album) {
      setFormData({ ...album });
      setIsEditing(true);
    } else {
      setFormData({ id: 0, title: '', artists: [] });
      setIsEditing(false);
    }
    setShowDialog(true);
  }

  async function handleSave() {
    if (!formData.title.trim()) {
      toast.error('Título do álbum é obrigatório');
      return;
    }

    try {
      const payload = {
        title: formData.title,
        artistIds: formData.artists.map(a => a.id)
      };

      if (isEditing) {
        await apiClient.put(`/api/albums/${formData.id}`, payload);
        toast.success('Álbum atualizado com sucesso');
      } else {
        await apiClient.post('/api/albums', payload);
        toast.success('Álbum criado com sucesso');
      }
      setShowDialog(false);
      await loadAlbums();
    } catch (error) {
      toast.error('Erro ao salvar álbum');
      console.error(error);
    }
  }

  async function handleDelete(id: number) {
    if (window.confirm('Tem certeza que deseja deletar este álbum?')) {
      try {
        await apiClient.delete(`/api/albums/${id}`);
        toast.success('Álbum deletado com sucesso');
        await loadAlbums();
      } catch (error) {
        toast.error('Erro ao deletar álbum');
        console.error(error);
      }
    }
  }

  const rowExpansionTemplate = (data: Album) => {
    return (
      <div className="albums-expansion">
        <div className="expansion-content">
          <div className="expansion-section">
            <h4>Detalhes do Álbum</h4>
            <p><strong>ID:</strong> {data.id}</p>
            <p><strong>Criado em:</strong> {new Date(data.createdAt).toLocaleDateString('pt-BR')}</p>
          </div>
          <div className="expansion-section">
            <h4>Artistas ({data.artists.length})</h4>
            {data.artists.length > 0 ? (
              <ul className="artists-list">
                {data.artists.map(artist => (
                  <li key={artist.id}>{artist.name}</li>
                ))}
              </ul>
            ) : (
              <p className="no-artists">Nenhum artista vinculado</p>
            )}
          </div>
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

  const actionBodyTemplate = (rowData: Album) => {
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

  const artistsBodyTemplate = (rowData: Album) => {
    return (
      <div className="artists-badges">
        {rowData.artists.slice(0, 2).map(artist => (
          <span key={artist.id} className="artist-badge">
            {artist.name}
          </span>
        ))}
        {rowData.artists.length > 2 && (
          <span className="artist-badge more">
            +{rowData.artists.length - 2}
          </span>
        )}
      </div>
    );
  };

  const dateBodyTemplate = (rowData: Album) => {
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
          placeholder="Buscar álbum..."
        />
      </span>
      <Button
        icon="pi pi-plus"
        severity="success"
        rounded
        onClick={() => openDialog()}
        tooltip="Novo álbum"
      />
    </div>
  );

  return (
    <>
      <DataTable
        value={albums}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data as DataTableExpandedRows)}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="id"
        header={header}
        paginator
        rows={10}
        globalFilter={globalFilterValue}
        globalFilterFields={['title']}
        loading={loading}
        tableStyle={{ minWidth: '60rem' }}
        rowsPerPageOptions={[5, 10, 20]}
        className="albums-datatable"
        emptyMessage="Nenhum álbum encontrado"
      >
        <Column expander style={{ width: '5rem' }} />
        <Column field="id" header="ID" sortable style={{ width: '8rem' }} />
        <Column field="title" header="Título" sortable />
        <Column
          field="artists"
          header="Artistas"
          body={artistsBodyTemplate}
          style={{ width: '250px' }}
        />
        <Column field="createdAt" header="Criado em" body={dateBodyTemplate} sortable />
        <Column body={actionBodyTemplate} style={{ width: '10rem' }} />
      </DataTable>

      <Dialog
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        header={isEditing ? 'Editar Álbum' : 'Novo Álbum'}
        modal
        className="dialog-form"
      >
        <div className="form-field">
          <label>Título do Álbum</label>
          <InputText
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Digite o título do álbum"
          />
        </div>

        <div className="form-field">
          <label>Artistas</label>
          <MultiSelect
            value={formData.artists}
            onChange={(e) => setFormData({ ...formData, artists: e.value })}
            options={artists}
            optionLabel="name"
            placeholder="Selecione artistas..."
            className="w-full"
            filter
            display="chip"
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
