-- Executar no SQL Editor do Supabase (projeto qnscwppgljobelplgbkp)
-- Oba Hortifruti — mesma estrutura que carrefour_* (sem dados iniciais)

CREATE TABLE IF NOT EXISTS oba_lojas (
  id BIGSERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS oba_produtos (
  id BIGSERIAL PRIMARY KEY,
  posicao INT NOT NULL DEFAULT 1,
  material TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  ean TEXT
);

CREATE TABLE IF NOT EXISTS oba_recolhas (
  id BIGSERIAL PRIMARY KEY,
  loja_codigo TEXT NOT NULL,
  recolhedor TEXT NOT NULL,
  data_recolha TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notas TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS oba_recolha_itens (
  id BIGSERIAL PRIMARY KEY,
  recolha_id BIGINT NOT NULL REFERENCES oba_recolhas(id) ON DELETE CASCADE,
  produto_id BIGINT NOT NULL REFERENCES oba_produtos(id),
  stock_fisico INT,
  stock_sistema INT,
  preco NUMERIC,
  preco_de NUMERIC,
  preco_por NUMERIC,
  validade_curta DATE
);

CREATE TABLE IF NOT EXISTS oba_stock_sistema (
  id BIGSERIAL PRIMARY KEY,
  loja_codigo TEXT NOT NULL,
  produto_id BIGINT NOT NULL REFERENCES oba_produtos(id),
  stock_sistema INT,
  importado_em TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (loja_codigo, produto_id)
);

CREATE TABLE IF NOT EXISTS oba_recolha_fotos (
  id BIGSERIAL PRIMARY KEY,
  recolha_id BIGINT NOT NULL REFERENCES oba_recolhas(id) ON DELETE CASCADE,
  foto_data TEXT,
  descricao TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_oba_recolhas_loja ON oba_recolhas(loja_codigo);
CREATE INDEX IF NOT EXISTS idx_oba_recolhas_data ON oba_recolhas(data_recolha DESC);
CREATE INDEX IF NOT EXISTS idx_oba_itens_recolha ON oba_recolha_itens(recolha_id);
CREATE INDEX IF NOT EXISTS idx_oba_fotos_recolha ON oba_recolha_fotos(recolha_id);
CREATE INDEX IF NOT EXISTS idx_oba_stock_sistema_loja ON oba_stock_sistema(loja_codigo);

ALTER TABLE oba_lojas ENABLE ROW LEVEL SECURITY;
ALTER TABLE oba_produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE oba_recolhas ENABLE ROW LEVEL SECURITY;
ALTER TABLE oba_recolha_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE oba_recolha_fotos ENABLE ROW LEVEL SECURITY;
ALTER TABLE oba_stock_sistema ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_all oba_lojas" ON oba_lojas;
DROP POLICY IF EXISTS "anon_all oba_produtos" ON oba_produtos;
DROP POLICY IF EXISTS "anon_all oba_recolhas" ON oba_recolhas;
DROP POLICY IF EXISTS "anon_all oba_recolha_itens" ON oba_recolha_itens;
DROP POLICY IF EXISTS "anon_all oba_recolha_fotos" ON oba_recolha_fotos;
DROP POLICY IF EXISTS "anon_all oba_stock_sistema" ON oba_stock_sistema;

CREATE POLICY "anon_all oba_lojas" ON oba_lojas FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all oba_produtos" ON oba_produtos FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all oba_recolhas" ON oba_recolhas FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all oba_recolha_itens" ON oba_recolha_itens FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all oba_recolha_fotos" ON oba_recolha_fotos FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all oba_stock_sistema" ON oba_stock_sistema FOR ALL TO anon USING (true) WITH CHECK (true);

-- Depois de definir lojas/produtos em CLIENTS.oba / OBA_LOJAS / OBA_CATALOG no index.html,
-- a app sincroniza via syncLojas/syncCatalog na primeira ligação.
