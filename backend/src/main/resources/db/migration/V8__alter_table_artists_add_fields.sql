-- V8: Adicionar campos imageUrl e year na tabela artists (se não existirem)
-- Verifica se as colunas existem antes de adicionar

DO $$
BEGIN
    -- Adicionar coluna image_url se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'artists' AND column_name = 'image_url'
    ) THEN
        ALTER TABLE artists ADD COLUMN image_url VARCHAR(500);
    END IF;
    
    -- Adicionar coluna year se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'artists' AND column_name = 'year'
    ) THEN
        ALTER TABLE artists ADD COLUMN year INTEGER;
    END IF;
    
    -- Criar índice se não existir
    CREATE INDEX IF NOT EXISTS idx_artists_year ON artists(year);
END $$;
