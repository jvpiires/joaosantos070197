import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column, type ColumnBodyOptions } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

interface ColumnConfig<T> {
    field: keyof T;
    header: string;
    body?: (rowData: T, options: ColumnBodyOptions) => React.ReactNode;
    style?: React.CSSProperties;
}

interface GenericTableProps<T> {
    data: T[];
    columns: ColumnConfig<T>[];
    loading: boolean;
    globalFilter: string;
    globalFilterFields: string[];
    userRole: string | null;
    entityName: string;
    entityNamePlural: string;
    onSearch: (value: string) => void;
    onNew: () => void;
    onEdit: (item: T) => void;
    onDelete: (item: T) => void;
    onView: (item: T) => void;
}

export const GenericTable = <T extends { id: number }>({
    data,
    columns,
    loading,
    globalFilter,
    globalFilterFields,
    userRole,
    entityName,
    entityNamePlural,
    onSearch,
    onNew,
    onEdit,
    onDelete,
    onView
}: GenericTableProps<T>) => {
    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0 text-900" style={{ color: 'var(--primary-color)', fontSize: '1.1rem', fontWeight: '700' }}>
                {userRole === 'ADMIN' ? `Gerenciar ${entityNamePlural}` : `Consultar ${entityNamePlural}`}
            </h4>
            <div className="p-input-icon-left">
                <InputText 
                    type="search" 
                    onInput={(e) => onSearch(e.currentTarget.value)} 
                    placeholder={`Pesquisar ${entityName.toLowerCase()}...`}
                    className="p-inputtext-sm"
                />
            </div>
            {userRole === 'ADMIN' && (
                <Button
                    style={{ color: 'var(--primary-color)', borderColor: 'var(--border-color)' }}
                    label={`Novo ${entityName}`}
                    icon={<FaPlus className="mr-2"/>}
                    onClick={onNew}
                    className='p-button-outlined'
                />
            )}
        </div>
    );

    const actionBodyTemplate = (rowData: T) => {
        if (userRole !== 'ADMIN') {
            return (
                <div className="flex gap-2 justify-content-center">
                    <Button 
                        icon={<FaEye />} 
                        rounded 
                        text 
                        severity="info"
                        tooltip={`Consultar ${entityName}`}
                        aria-label="Consultar" 
                        onClick={() => onView(rowData)}
                    />
                </div>
            );
        }

        return (
            <div className="flex gap-2 justify-content-center">
                <Button 
                    icon={<FaEdit />} 
                    rounded 
                    text 
                    severity="info" 
                    aria-label="Editar" 
                    onClick={() => onEdit(rowData)} 
                />
                <Button 
                    icon={<FaTrash />} 
                    rounded 
                    text 
                    severity="danger" 
                    aria-label="Deletar" 
                    onClick={() => onDelete(rowData)} 
                />
            </div>
        );
    };

    return (
        <div className="custom-card p-4">
            <DataTable 
                value={data} 
                paginator 
                rows={10}
                loading={loading}
                rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate={`Mostrando {first} a {last} de {totalRecords} ${entityNamePlural.toLowerCase()}`}
                globalFilter={globalFilter}
                globalFilterFields={globalFilterFields}
                header={header}
                emptyMessage={`Nenhum ${entityName.toLowerCase()} encontrado.`}
                className="custom-datatable"
            >
                {columns.map((col) => (
                    <Column
                        key={String(col.field)}
                        field={String(col.field)}
                        header={col.header}
                        body={col.body}
                        sortable
                        style={col.style}
                    />
                ))}
                <Column
                    body={actionBodyTemplate}
                    header="Ações"
                    exportable={false}
                    style={{ width: '30%', textAlign: 'center' }}
                />
            </DataTable>
        </div>
    );
};
