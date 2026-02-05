-- Criar sequence para a tabela regionais
CREATE SEQUENCE IF NOT EXISTS regionais_id_seq;

-- Definir o valor inicial da sequence baseado no maior ID existente
SELECT setval('regionais_id_seq', COALESCE((SELECT MAX(id) FROM regionais), 0) + 1, false);

-- Alterar a coluna id para usar a sequence como default
ALTER TABLE regionais ALTER COLUMN id SET DEFAULT nextval('regionais_id_seq');

-- Associar a sequence com a coluna
ALTER SEQUENCE regionais_id_seq OWNED BY regionais.id;
