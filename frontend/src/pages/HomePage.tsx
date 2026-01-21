import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { artistService } from '../services/artistService';
import  type { Artist } from '../types/models';

// PrimeReact Imports
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

// Icons
import { 
    FaHome, 
    FaMusic, 
    FaCompactDisc, 
    FaCog, 
    FaSignOutAlt, 
    FaPlus, 
    FaEdit, 
    FaTrash 
} from 'react-icons/fa';

import './HomePage.css';

export const HomePage: React.FC = () => {
    const { logout } = useAuth();
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const toast = useRef<Toast>(null);

    // Dialog States
    const [artistDialog, setArtistDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [artist, setArtist] = useState<Partial<Artist>>({});

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

    // Table Templates ---------------------------
    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0 text-900">Gerenciar Artistas</h4>
            <div className="p-input-icon-left">
                <InputText 
                    type="search" 
                    onInput={(e) => setGlobalFilter(e.currentTarget.value)} 
                    placeholder="Pesquisar..." 
                    className="p-inputtext-sm"
                />
            </div>
            <Button label="Novo Artista" icon={<FaPlus className="mr-2"/>} className="p-button-primary p-button-sm" onClick={openNew} />
        </div>
    );

    const actionBodyTemplate = (rowData: Artist) => {
        return (
            <div className="flex gap-2 justify-content-center">
                <Button 
                    icon={<FaEdit />} 
                    rounded 
                    text 
                    severity="info" 
                    aria-label="Editar" 
                    onClick={() => editArtist(rowData)} 
                />
                <Button 
                    icon={<FaTrash />} 
                    rounded 
                    text 
                    severity="danger" 
                    aria-label="Deletar" 
                    onClick={() => confirmDeleteArtist(rowData)} 
                />
            </div>
        );
    };

    const dialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" onClick={saveArtist} />
        </React.Fragment>
    );

    return (
        <div className="dashboard-container">
            <Toast ref={toast} />
            <ConfirmDialog />

            {/* SIDEBAR */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <FaMusic color="#3b82f6" />
                        <span>MusicApp</span>
                    </div>
                </div>

                <nav className="sidebar-menu">
                    <a href="#" className="menu-item">
                        <FaHome className="menu-icon" />
                        <span>Dashboard</span>
                    </a>
                    <a href="#" className="menu-item active">
                        <FaMusic className="menu-icon" />
                        <span>Artistas</span>
                    </a>
                    <a href="#" className="menu-item">
                        <FaCompactDisc className="menu-icon" />
                        <span>Álbuns</span>
                    </a>
                    <a href="#" className="menu-item">
                        <FaCog className="menu-icon" />
                        <span>Configurações</span>
                    </a>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={logout} className="logout-btn">
                        <FaSignOutAlt />
                        <span>Sair da Conta</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="main-content">
                {/* TOP HEADER */}
                <header className="topbar">
                    <div className="page-title">
                        <h1>Artistas</h1>
                    </div>
                    
                    <div className="user-profile">
                        <div className="user-info">
                            <span className="user-name">Administrador</span>
                            <span className="user-role">Admin</span>
                        </div>
                        <div className="user-avatar">A</div>
                    </div>
                </header>

                {/* CONTENT AREA */}
                <div className="content-scroll">
                    <div className="custom-card p-4">
                        <DataTable 
                            value={artists} 
                            paginator 
                            rows={10} 
                            rowsPerPageOptions={[5, 10, 25]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} artistas"
                            globalFilter={globalFilter} 
                            header={header}
                            emptyMessage="Nenhum artista encontrado."
                            className="custom-datatable"
                            tableStyle={{ minWidth: '50rem' }}
                        >
                            <Column field="name" header="Nome" sortable style={{ width: '70%' }}></Column>
                            <Column body={actionBodyTemplate} header="Ações" exportable={false} style={{ width: '30%', textAlign: 'center' }}></Column>
                        </DataTable>
                    </div>
                </div>
            </main>

            {/* DIALOG NEW/EDIT */}
            <Dialog 
                visible={artistDialog} 
                style={{ width: '32rem' }} 
                breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
                header={artist.id ? "Editar Artista" : "Novo Artista"} 
                modal 
                className="p-fluid" 
                footer={dialogFooter} 
                onHide={hideDialog}
            >
                <div className="field">
                    <label htmlFor="name" className="font-bold">Nome</label>
                    <InputText 
                        id="name" 
                        value={artist.name || ''} 
                        onChange={(e) => setArtist({ ...artist, name: e.target.value })} 
                        required 
                        autoFocus 
                        className={`w-full ${submitted && !artist.name ? 'p-invalid' : ''}`}
                    />
                    {submitted && !artist.name && <small className="p-error">Nome é obrigatório.</small>}
                </div>
            </Dialog>
        </div>
    );
};


