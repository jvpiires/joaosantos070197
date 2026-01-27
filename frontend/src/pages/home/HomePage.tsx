import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { Artist } from '../../types/models';
import { artistService } from '../../services/artistService';
import { DashboardLayout } from '../../components/DashboardLayout';
import { GenericTable } from '../../components/global/GenericTable';
import { GenericFormModal } from '../../components/global/GenericFormModal';
import { GenericDetailsModal } from '../../components/global/GenericDetailsModal';


// PrimeReact Imports
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import './HomePage.css';


export const HomePage: React.FC = () => {
    const { logout, username, userRole } = useAuth();
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const toast = useRef<Toast>(null);

    // Dialog States
    const [artistDialog, setArtistDialog] = useState(false);
    const [detailsDialog, setDetailsDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [artist, setArtist] = useState<Partial<Artist>>({});
    const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

    useEffect(() => {
        loadArtists();
    }, []);

    const loadArtists = async () => {
        try {
            setLoading(true);
            const data = await artistService.getAll();
            setArtists(data.content);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar artistas' });
        } finally {
            setLoading(false);
        }
    };

    const openNew = () => {
        setArtist({});
        setSubmitted(false);
        setArtistDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setArtistDialog(false);
    };

    const saveArtist = async () => {
        setSubmitted(true);

        if (artist.name?.trim()) {
            try {
                if (artist.id) {
                    await artistService.update(artist.id, artist as Artist);
                    toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Artista atualizado' });
                } else {
                    await artistService.create(artist as Artist);
                    toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Artista criado' });
                }
                loadArtists();
                setArtistDialog(false);
                setArtist({});
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao salvar artista' });
            }
        }
    };

    const editArtist = (artist: Artist) => {
        setArtist({ ...artist });
        setArtistDialog(true);
    };

    const confirmDeleteArtist = (artist: Artist) => {
        confirmDialog({
            message: `Tem certeza que deseja remover ${artist.name}?`,
            header: 'Confirmar Exclusão',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => deleteArtist(artist)
        });
    };

    const deleteArtist = async (artist: Artist) => {
        try {
            await artistService.delete(artist.id);
            toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Artista removido' });
            loadArtists();
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao remover artista' });
        }
    };

    const handleArtistChange = (field: string, value: string | number) => {
        setArtist({ ...artist, [field]: value });
    };
    
    const artistColumns = [
        { field: 'name' as keyof Artist, header: 'Nome', style: { width: '70%' } }
    ];

    const artistFormFields = [
        { name: 'name', label: 'Nome do Artista', type: 'text' as const, required: true, placeholder: 'Digite o nome do artista' }
    ];

    const artistDetailFields = [
        { label: 'ID', field: 'id' },
        { label: 'Nome', field: 'name' }
    ];

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog />

            <DashboardLayout
                title="Artistas"
                userName={username || 'Usuário'}
                userRole={userRole || 'USER'}
                onLogout={logout}
            >
                <GenericTable<Artist>
                    data={artists}
                    columns={artistColumns}
                    loading={loading}
                    globalFilter={globalFilter}
                    globalFilterFields={['name']}
                    userRole={userRole}
                    entityName="Artista"
                    entityNamePlural="Artistas"
                    onSearch={setGlobalFilter}
                    onNew={openNew}
                    onEdit={editArtist}
                    onDelete={confirmDeleteArtist}
                    onView={(artistData) => {
                        setSelectedArtist(artistData);
                        setDetailsDialog(true);
                    }}
                />
            </DashboardLayout>

            <GenericFormModal<Artist>
                visible={artistDialog}
                entity={artist}
                submitted={submitted}
                isEditing={!!artist.id}
                entityName="Artista"
                fields={artistFormFields}
                onHide={hideDialog}
                onSave={saveArtist}
                onChange={handleArtistChange}
            />

            <GenericDetailsModal<Artist>
                visible={detailsDialog}
                entity={selectedArtist}
                entityName="Artista"
                fields={artistDetailFields}
                titleField="name"
                onHide={() => setDetailsDialog(false)}
            />
        </>
    );
};


