-- Adicionar coluna id_external à tabela regionais
ALTER TABLE regionais ADD COLUMN id_external VARCHAR(255) UNIQUE;

-- Inserir id_external para regionais existentes (opcional, baseado no ID)
UPDATE regionais SET id_external = 'REG-' || id WHERE id_external IS NULL;

-- Criar índice para melhor performance
CREATE INDEX idx_regionais_id_external ON regionais(id_external);
