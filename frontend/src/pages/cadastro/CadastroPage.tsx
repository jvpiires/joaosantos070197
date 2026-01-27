// React Imports
import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { artistService } from '../../services/artistService';
import type { Artist } from '../../types/models';


// PrimeReact Imports
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FaSave, FaTimes } from 'react-icons/fa';

import './CadastroPage.css';
import { DashboardLayout } from '../../components/DashboardLayout';

export const CadastroPage: React.FC = () => {
    const { logout, username, userRole } = useAuth();
    const toast = useRef<Toast>(null);
    const isAdmin = userRole === 'ADMIN';

    const [artistName, setArtistName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [artistErrors, setArtistErrors] = useState<{ name?: string }>({});

    const validateArtistForm = (): boolean => {
        const errors: { name?: string } = {};

        if (!artistName.trim()) {
            errors.name = 'Nome do artista é obrigatório';
        }

        setArtistErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleArtistSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAdmin) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Permissão insuficiente',
                detail: 'Apenas administradores podem cadastrar artistas.',
                life: 3500
            });
            return;
        }

        if (!validateArtistForm()) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Atenção',
                detail: 'Preencha todos os campos obrigatórios',
                life: 3000
            });
            return;
        }

        setIsSubmitting(true);

        try {
            await artistService.create({ name: artistName } as Artist);

            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Artista cadastrado com sucesso!',
                life: 3000
            });

            // Limpar formulário
            setArtistName('');
            setArtistErrors({});
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Erro ao cadastrar artista';
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: errorMessage,
                life: 4000
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClearArtistForm = () => {
        if (!isAdmin) return;
        setArtistName('');
        setArtistErrors({});
    };

    return (
        <>
            <Toast ref={toast} />

            <DashboardLayout
                title="Cadastro"
                userName={username || 'Usuário'}
                userRole={userRole || 'USER'}
                onLogout={logout}
            >
                <div className="cadastro-container">
                    <Card className="cadastro-card">
                        <TabView>
                            {/* ABA: Cadastro de Artistas */}
                            <TabPanel header="Cadastro de Artistas">
                                <form onSubmit={handleArtistSubmit} className="cadastro-form">
                                    <div className="form-header">
                                        <h3>Novo Artista</h3>
                                        <p className="form-subtitle">
                                            Preencha os dados para cadastrar um novo artista
                                        </p>
                                        {!isAdmin && (
                                            <p className="form-alert">Somente administradores podem cadastrar ou editar.</p>
                                        )}
                                    </div>

                                    <div className="form-content">
                                        <div className="field-group">
                                            <label htmlFor="artistName" className="field-label">
                                                Nome do Artista <span className="required">*</span>
                                            </label>
                                            <InputText
                                                id="artistName"
                                                value={artistName}
                                                onChange={(e) => {
                                                    setArtistName(e.target.value);
                                                    if (artistErrors.name) {
                                                        setArtistErrors({ ...artistErrors, name: undefined });
                                                    }
                                                }}
                                                placeholder="Digite o nome do artista"
                                                className={`field-input ${artistErrors.name ? 'p-invalid' : ''}`}
                                                disabled={isSubmitting || !isAdmin}
                                            />
                                            {artistErrors.name && (
                                                <small className="p-error">{artistErrors.name}</small>
                                            )}
                                        </div>
                                    </div>

                                    <div className="form-actions">
                                        <Button
                                            type="button"
                                            label="Limpar"
                                            icon={<FaTimes className="mr-2" />}
                                            onClick={handleClearArtistForm}
                                            className="p-button-outlined p-button-secondary"
                                            disabled={isSubmitting || !isAdmin}
                                        />
                                        <Button
                                            type="submit"
                                            label="Salvar Artista"
                                            icon={<FaSave className="mr-2" />}
                                            className="p-button-success"
                                            loading={isSubmitting}
                                            disabled={!isAdmin}
                                        />
                                    </div>
                                </form>
                            </TabPanel>

                            {/* ABA: Cadastro de Álbuns (será implementada na próxima parte) */}
                            <TabPanel header="Cadastro de Álbuns" disabled>
                                <div className="coming-soon">
                                    <i className="pi pi-info-circle" style={{ fontSize: '2rem', color: '#64748b' }}></i>
                                    <p>Em breve...</p>
                                </div>
                            </TabPanel>
                        </TabView>
                    </Card>
                </div>
            </DashboardLayout>
        </>
    );
};