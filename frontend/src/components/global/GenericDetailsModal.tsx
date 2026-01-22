import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

interface DetailField {
    label: string;
    field: string;
}

interface GenericDetailsModalProps<T> {
    visible: boolean;
    entity: T | null;
    entityName: string;
    fields: DetailField[];
    titleField: string;
    onHide: () => void;
}

export const GenericDetailsModal = <T extends Record<string, any>>({
    visible,
    entity,
    entityName,
    fields,
    titleField,
    onHide
}: GenericDetailsModalProps<T>) => {
    const footer = (
        <Button 
            label="Fechar" 
            icon="pi pi-times" 
            onClick={onHide}
            className="p-button-outlined"
            style={{ color: 'var(--primary-color)', borderColor: 'var(--border-color)' }}
        />
    );

    return (
        <Dialog 
            visible={visible} 
            style={{ width: '32rem' }} 
            breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
            header={`Detalhes - ${entity?.[titleField] || entityName}`}
            modal 
            className="p-fluid" 
            footer={footer} 
            onHide={onHide}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {fields.map((fieldConfig) => (
                    <div key={fieldConfig.field}>
                        <label style={{ 
                            display: 'block', 
                            color: 'var(--primary-color)', 
                            fontWeight: '600', 
                            marginBottom: '0.5rem' 
                        }}>
                            {fieldConfig.label}
                        </label>
                        <p style={{ margin: '0', color: '#374151', fontSize: '0.95rem' }}>
                            {entity?.[fieldConfig.field] || '-'}
                        </p>
                    </div>
                ))}
            </div>
        </Dialog>
    );
};
