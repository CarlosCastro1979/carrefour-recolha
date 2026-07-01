-- Executar no SQL Editor do Supabase (projeto qnscwppgljobelplgbkp)
-- Supermercados Mambo — mesma estrutura que carrefour_* (sem dados iniciais)

CREATE TABLE IF NOT EXISTS mambo_lojas (
  id BIGSERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS mambo_produtos (
  id BIGSERIAL PRIMARY KEY,
  posicao INT NOT NULL DEFAULT 1,
  material TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  ean TEXT
);

CREATE TABLE IF NOT EXISTS mambo_recolhas (
  id BIGSERIAL PRIMARY KEY,
  loja_codigo TEXT NOT NULL,
  recolhedor TEXT NOT NULL,
  data_recolha TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notas TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mambo_recolha_itens (
  id BIGSERIAL PRIMARY KEY,
  recolha_id BIGINT NOT NULL REFERENCES mambo_recolhas(id) ON DELETE CASCADE,
  produto_id BIGINT NOT NULL REFERENCES mambo_produtos(id),
  stock_fisico INT,
  stock_sistema INT,
  preco NUMERIC,
  preco_de NUMERIC,
  preco_por NUMERIC,
  validade_curta DATE
);

CREATE TABLE IF NOT EXISTS mambo_stock_sistema (
  id BIGSERIAL PRIMARY KEY,
  loja_codigo TEXT NOT NULL,
  produto_id BIGINT NOT NULL REFERENCES mambo_produtos(id),
  stock_sistema INT,
  importado_em TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (loja_codigo, produto_id)
);

CREATE TABLE IF NOT EXISTS mambo_recolha_fotos (
  id BIGSERIAL PRIMARY KEY,
  recolha_id BIGINT NOT NULL REFERENCES mambo_recolhas(id) ON DELETE CASCADE,
  foto_data TEXT,
  descricao TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mambo_recolhas_loja ON mambo_recolhas(loja_codigo);
CREATE INDEX IF NOT EXISTS idx_mambo_recolhas_data ON mambo_recolhas(data_recolha DESC);
CREATE INDEX IF NOT EXISTS idx_mambo_itens_recolha ON mambo_recolha_itens(recolha_id);
CREATE INDEX IF NOT EXISTS idx_mambo_fotos_recolha ON mambo_recolha_fotos(recolha_id);
CREATE INDEX IF NOT EXISTS idx_mambo_stock_sistema_loja ON mambo_stock_sistema(loja_codigo);

ALTER TABLE mambo_lojas ENABLE ROW LEVEL SECURITY;
ALTER TABLE mambo_produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE mambo_recolhas ENABLE ROW LEVEL SECURITY;
ALTER TABLE mambo_recolha_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE mambo_recolha_fotos ENABLE ROW LEVEL SECURITY;
ALTER TABLE mambo_stock_sistema ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_all mambo_lojas" ON mambo_lojas;
DROP POLICY IF EXISTS "anon_all mambo_produtos" ON mambo_produtos;
DROP POLICY IF EXISTS "anon_all mambo_recolhas" ON mambo_recolhas;
DROP POLICY IF EXISTS "anon_all mambo_recolha_itens" ON mambo_recolha_itens;
DROP POLICY IF EXISTS "anon_all mambo_recolha_fotos" ON mambo_recolha_fotos;
DROP POLICY IF EXISTS "anon_all mambo_stock_sistema" ON mambo_stock_sistema;

CREATE POLICY "anon_all mambo_lojas" ON mambo_lojas FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all mambo_produtos" ON mambo_produtos FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all mambo_recolhas" ON mambo_recolhas FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all mambo_recolha_itens" ON mambo_recolha_itens FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all mambo_recolha_fotos" ON mambo_recolha_fotos FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all mambo_stock_sistema" ON mambo_stock_sistema FOR ALL TO anon USING (true) WITH CHECK (true);

-- Depois de definir lojas/produtos em CLIENTS.mambo no index.html, inserir aqui ou deixar a app sincronizar via syncLojas/syncCatalog.
