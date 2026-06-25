-- Executar no SQL Editor do Supabase (projeto qnscwppgljobelplgbkp)
-- v5: validade_curta como data de validade (por produto/visita)

ALTER TABLE carrefour_recolha_itens DROP COLUMN IF EXISTS validade_curta;
ALTER TABLE carrefour_recolha_itens ADD COLUMN validade_curta DATE;
