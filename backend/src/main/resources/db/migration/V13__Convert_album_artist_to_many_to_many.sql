-- V8__Convert_album_artist_to_many_to_many.sql
-- Converte o relacionamento de Album-Artist de Many-to-One para Many-to-Many

-- Criar tabela de junção album_artist
CREATE TABLE IF NOT EXISTS album_artist (
    album_id BIGINT NOT NULL,
    artist_id BIGINT NOT NULL,
    PRIMARY KEY (album_id, artist_id),
    FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

-- Migrar dados existentes: cada album vinculado a seu artista atual
INSERT INTO album_artist (album_id, artist_id)
SELECT a.id, a.artist_id FROM albums a
WHERE a.artist_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Remover constraint de chave estrangeira e coluna artist_id
ALTER TABLE albums DROP CONSTRAINT IF EXISTS albums_artist_id_fkey;
ALTER TABLE albums DROP COLUMN IF EXISTS artist_id;

-- Criar índices para performance
CREATE INDEX idx_album_artist_album_id ON album_artist(album_id);
CREATE INDEX idx_album_artist_artist_id ON album_artist(artist_id);
