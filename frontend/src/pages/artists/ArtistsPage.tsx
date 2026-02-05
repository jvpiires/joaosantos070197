import { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from 'primereact/button';
import { DataTable, type DataTableStateEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';
import { CreateArtistModal } from '../../components/Modal/CreateArtistModal';
import { artistService } from '../../services/artistService';
import type { Artist } from '../../types/models';
import { toast } from 'sonner';
import './ArtistsPage.css';
import { useNavigate } from 'react-router-dom';

interface PageResponse {
    content: Artist[];
    totalElements: number;
    totalPages: number;
    size: number;
}

export const ArtistsPage = () => {
    const { userRole } = useAuth();
    const isAdmin = userRole === 'ADMIN';
    const isUser = userRole === 'USER';
    const [artists, setArtists] = useState<Artist[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [expandedRows, setExpandedRows] = useState<Artist[]>([]);
    const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!isAdmin && !isUser) {
            navigate('/');
        }
    }, [isAdmin, isUser, navigate]);

    if (!isAdmin && !isUser) {
        return null;
    }

    const loadArtists = async () => {
        setLoading(true);
        try {
            const currentPage = Math.floor(first / rows);

            const response = await artistService.getAll({
                name: searchTerm || undefined,
                sort: 'name,asc',
                page: currentPage,
                size: rows
            }) as PageResponse;

            setArtists(response.content);
            setTotalRecords(response.totalElements);

        } catch (error) {
            console.error('Erro ao carregar artistas:', error);
            toast.error('Erro ao carregar artistas');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setFirst(0);
        loadArtists();
    };

    useEffect(() => {
        loadArtists();
    }, [first, rows]);

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Tem certeza que deseja excluir o artista "${name}"?`)) {
            return;
        }

        try {
            await artistService.delete(id);
            toast.success('Artista excluído com sucesso');
            loadArtists();
        } catch (error) {
            toast.error('Erro ao excluir artista');
            console.error(error);
        }
    };

    const handleEdit = (artist: Artist) => {
        setSelectedArtist(artist);
        setShowCreateModal(true);
    };

    const actionsBodyTemplate = (rowData: Artist) => {
        if (!isAdmin) return null;

        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-pencil"
                    className="p-button-text p-button-sm"
                    onClick={() => handleEdit(rowData)}
                    tooltip="Editar"
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-text p-button-danger p-button-sm"
                    onClick={() => handleDelete(rowData.id, rowData.name)}
                    tooltip="Excluir"
                />
            </div>
        );
    };

    const imageBodyTemplate = (rowData: Artist) => {
        if (!rowData.imageUrl) {
            return (
                <div className="w-8 h-8 bg-gray-200 border-2 border-black flex items-center justify-center flex-shrink-0">
                    <i className="pi pi-image text-gray-400 text-[10px]"></i>
                </div>
            );
        }
        return (
            <img
                src={rowData.imageUrl}
                alt={rowData.name}
                className="w-1 h-1 object-cover border-2 border-black flex-shrink-0"
            />
        );
    };

    const nameBodyTemplate = (rowData: Artist) => {
        return (
            <div className="flex items-center gap-3">
                {imageBodyTemplate(rowData)}
                <span className="font-bold text-sm uppercase">{rowData.name}</span>
            </div>
        );
    };

    const yearBodyTemplate = (rowData: Artist) => {
        return rowData.year ? (
            <span className="font-mono font-bold text-sm">{rowData.year}</span>
        ) : (
            <span className="text-gray-400 text-xs">-</span>
        );
    };

    const albumsBodyTemplate = (rowData: Artist) => {
        if (!rowData.albums || rowData.albums.length === 0) {
            return <span className="text-gray-400 text-xs">Nenhum</span>;
        }
        return (
            <span className="font-bold text-sm">
                {rowData.albums.length} {rowData.albums.length === 1 ? 'álbum' : 'álbuns'}
            </span>
        );
    };

    const skeletonBodyTemplate = () => (
        <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 flex-shrink-0" />
            <Skeleton className="flex-1 h-5" />
        </div>
    );

    const rowExpand = (rowData: Artist) => {
        return (
            <div className="bg-white p-8 border-t-4 border-black">
                <div className="space-y-6">
                    <h3 className="font-black text-base uppercase tracking-[0.15em] mb-4 text-black">
                        📀 Álbuns ({rowData.albums?.length || 0})
                    </h3>

                    {rowData.albums && rowData.albums.length > 0 ? (
                        <div className="grid grid-cols-4 gap-4">
                            {rowData.albums.map((album) => (
                                <div key={album.id} className="group">
                                    <div className="border-2 border-black bg-gradient-to-b from-white to-gray-50 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 h-full flex flex-col">
                                        <div className="w-full aspect-square bg-gradient-to-br from-gray-900 to-black flex items-center justify-center border-b-2 border-black">
                                            <i className="pi pi-compact-disc text-gray-600 text-4xl"></i>
                                        </div>

                                        <div className="p-3 flex-1 flex flex-col">
                                            <h4 className="font-bold text-xs uppercase line-clamp-3 text-black leading-tight">
                                                {album.title}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 border-2 border-dashed border-gray-300">
                            <i className="pi pi-inbox text-gray-300 text-2xl block mb-2"></i>
                            <p className="text-gray-400 font-mono text-xs">
                                Sem álbuns
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <Layout>
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter">
                            Artistas
                        </h1>
                        <p className="text-gray-600 mt-2 font-mono">Descubra nossos artistas</p>
                    </div>
                </div>
                <div className="flex justify-between items-center p-4">
                    <h1 className="text-2xl font-black uppercase"></h1>
                    {isAdmin && (
                        <Button
                            label="Novo Artista"
                            icon="pi pi-plus"
                            severity='contrast'
                            onClick={() => setShowCreateModal(true)}
                            className="border-none bg-black text-white px-6 py-3 font-black uppercase tracking-[0.2em] hover:!bg-cyan-400 hover:!text-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                        />
                    )}
                </div>

                <div className="flex gap-2 items-center bg-white p-4 border-2 border-black">
                    <i className="pi pi-search text-gray-600"></i>
                    <InputText
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Global Search"
                        className="flex-1 border-none bg-transparent p-0 text-base focus:outline-none focus:shadow-none placeholder-gray-400"
                    />
                    <Button
                        icon="pi pi-search"
                        onClick={handleSearch}
                        className="border-2 border-black bg-white text-black hover:!bg-cyan-400 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
                        label='Buscar'
                        style={{color: 'black'}}
                        severity='contrast'
                    />
                </div>

                <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <DataTable
                        value={loading ? Array(rows).fill({}) : artists}
                        lazy
                        paginator
                        first={first}
                        rows={rows}
                        totalRecords={totalRecords}
                        onPage={(e: DataTableStateEvent) => {
                            setFirst(e.first || 0);
                            setRows(e.rows || 10);
                        }}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
                        paginatorClassName="p-4 flex justify-center items-center gap-4 border-t-2 border-black bg-gray-50"
                        emptyMessage="Nenhum artista encontrado"
                        className="font-mono"
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        expandedRows={expandedRows}
                        onRowToggle={(e) => {
                            setExpandedRows(e.data as Artist[]);
                        }}
                        rowExpansionTemplate={loading ? undefined : rowExpand}
                    >
                        <Column expander style={{ width: '3rem' }} />
                        <Column
                            field="name"
                            header="Name"
                            body={loading ? skeletonBodyTemplate : nameBodyTemplate}
                            className="font-bold text-sm p-3"
                            sortable
                        />
                        <Column
                            field="year"
                            header="Ano"
                            body={loading ? skeletonBodyTemplate : yearBodyTemplate}
                            className="text-center p-3"
                            sortable
                            style={{ width: '90px' }}
                        />
                        <Column
                            field="albums"
                            header="Álbuns"
                            body={loading ? skeletonBodyTemplate : albumsBodyTemplate}
                            className="text-center p-3 font-bold"
                            sortable
                            style={{ width: '100px' }}
                        />
                        {isAdmin && (
                            <Column
                                header="Ações"
                                body={loading ? skeletonBodyTemplate : actionsBodyTemplate}
                                style={{ width: '90px' }}
                                className="text-center p-3"
                            />
                        )}
                    </DataTable>
                </div>
            </div>

            <CreateArtistModal
                visible={showCreateModal}
                artist={selectedArtist}
                onHide={() => {
                    setShowCreateModal(false);
                    setSelectedArtist(null);
                }}
                onSuccess={loadArtists}
            />
        </Layout>
    );
};
