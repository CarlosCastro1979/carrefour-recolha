-- Executar no SQL Editor do Supabase (projeto qnscwppgljobelplgbkp)
-- v2: preços De/Por + stock sistema por loja (import Excel portal)

ALTER TABLE carrefour_recolha_itens ADD COLUMN IF NOT EXISTS preco_de NUMERIC;
ALTER TABLE carrefour_recolha_itens ADD COLUMN IF NOT EXISTS preco_por NUMERIC;

UPDATE carrefour_recolha_itens
SET preco_por = preco
WHERE preco_por IS NULL AND preco IS NOT NULL;

CREATE TABLE IF NOT EXISTS carrefour_stock_sistema (
  id BIGSERIAL PRIMARY KEY,
  loja_codigo TEXT NOT NULL,
  produto_id BIGINT NOT NULL REFERENCES carrefour_produtos(id),
  stock_sistema INT,
  importado_em TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (loja_codigo, produto_id)
);

CREATE INDEX IF NOT EXISTS idx_carrefour_stock_sistema_loja ON carrefour_stock_sistema(loja_codigo);

ALTER TABLE carrefour_stock_sistema ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_all carrefour_stock_sistema" ON carrefour_stock_sistema;
CREATE POLICY "anon_all carrefour_stock_sistema" ON carrefour_stock_sistema FOR ALL TO anon USING (true) WITH CHECK (true);
