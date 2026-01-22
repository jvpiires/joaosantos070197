import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

interface FormField {
    name: string;
    label: string;
    type: 'text' | 'number' | 'email';
    placeholder?: string;
    required?: boolean;
}

interface GenericFormModalProps<T> {
    visible: boolean;
    entity: Partial<T>;
    submitted: boolean;
    isEditing: boolean;
    entityName: string;
    fields: FormField[];
    onHide: () => void;
    onSave: () => void;
    onChange: (field: string, value: string | number) => void;
}

export const GenericFormModal = <T extends { id?: number }>({
    visible,
    entity,
    submitted,
    isEditing,
    entityName,
    fields,
    onHide,
    onSave,
    onChange
}: GenericFormModalProps<T>) => {
    const footer = (
        <React.Fragment>
            <Button 
                label="Cancelar" 
                icon="pi pi-times" 
                onClick={onHide}
                className="p-button-outlined"
                style={{ color: 'var(--primary-color)', borderColor: 'var(--border-color)' }}
            />
            <Button 
                label={`Salvar ${entityName}`}
                icon="pi pi-check" 
                className='p-button-outlined'
                onClick={onSave} 
                style={{ borderColor: 'var(--border-color)' }}
            />
        </React.Fragment>
    );

    return (
        <Dialog 
            visible={visible} 
            style={{ width: '32rem' }} 
            breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
            header={isEditing ? `Editar ${entityName}` : `Novo ${entityName}`}
            modal 
            className="p-fluid" 
            footer={footer} 
            onHide={onHide}
        >
            {fields.map((field) => {
                const fieldValue = entity[field.name as keyof T];
                const value = typeof fieldValue === 'string' || typeof fieldValue === 'number' ? fieldValue : '';
                const hasError = submitted && field.required && !value;

                return (
                    <div key={field.name} className="field">
                        <label htmlFor={field.name}>{field.label}</label>
                        <InputText 
                            id={field.name}
                            type={field.type}
                            value={String(value || '')}
                            onChange={(e) => {
                                const newValue = field.type === 'number' 
                                    ? Number(e.target.value) 
                                    : e.target.value;
                                onChange(field.name, newValue);
                            }}
                            required={field.required}
                            autoFocus={field === fields[0]}
                            className={`w-full ${hasError ? 'p-invalid' : ''}`}
                            placeholder={field.placeholder || `Digite ${field.label.toLowerCase()}`}
                        />
                        {hasError && (
                            <small className="p-error">{field.label} é obrigatório.</small>
                        )}
                    </div>
                );
            })}
        </Dialog>
    );
};
