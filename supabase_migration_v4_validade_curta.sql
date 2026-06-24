-- Executar no SQL Editor do Supabase (projeto qnscwppgljobelplgbkp)
-- v4: validade curta na prateleira (por produto/visita)

ALTER TABLE carrefour_recolha_itens ADD COLUMN IF NOT EXISTS validade_curta BOOLEAN DEFAULT FALSE;
