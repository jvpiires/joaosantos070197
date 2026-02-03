-- V3__add_ativo_column_to_regionais.sql
-- Adiciona a coluna 'ativo' à tabela regionais que estava faltando

ALTER TABLE regionais ADD COLUMN IF NOT EXISTS ativo BOOLEAN NOT NULL DEFAULT TRUE;