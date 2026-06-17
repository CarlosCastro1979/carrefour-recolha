-- Executar no SQL Editor do Supabase (projeto qnscwppgljobelplgbkp)
-- Recolha stock Carrefour — 10 lojas

CREATE TABLE IF NOT EXISTS carrefour_lojas (
  id BIGSERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS carrefour_produtos (
  id BIGSERIAL PRIMARY KEY,
  posicao INT NOT NULL DEFAULT 1,
  material TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  ean TEXT
);

CREATE TABLE IF NOT EXISTS carrefour_recolhas (
  id BIGSERIAL PRIMARY KEY,
  loja_codigo TEXT NOT NULL,
  recolhedor TEXT NOT NULL,
  data_recolha TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notas TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS carrefour_recolha_itens (
  id BIGSERIAL PRIMARY KEY,
  recolha_id BIGINT NOT NULL REFERENCES carrefour_recolhas(id) ON DELETE CASCADE,
  produto_id BIGINT NOT NULL REFERENCES carrefour_produtos(id),
  stock_fisico INT,
  stock_sistema INT,
  preco NUMERIC
);

CREATE TABLE IF NOT EXISTS carrefour_recolha_fotos (
  id BIGSERIAL PRIMARY KEY,
  recolha_id BIGINT NOT NULL REFERENCES carrefour_recolhas(id) ON DELETE CASCADE,
  foto_data TEXT,
  descricao TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_carrefour_recolhas_loja ON carrefour_recolhas(loja_codigo);
CREATE INDEX IF NOT EXISTS idx_carrefour_recolhas_data ON carrefour_recolhas(data_recolha DESC);
CREATE INDEX IF NOT EXISTS idx_carrefour_itens_recolha ON carrefour_recolha_itens(recolha_id);
CREATE INDEX IF NOT EXISTS idx_carrefour_fotos_recolha ON carrefour_recolha_fotos(recolha_id);

ALTER TABLE carrefour_lojas ENABLE ROW LEVEL SECURITY;
ALTER TABLE carrefour_produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE carrefour_recolhas ENABLE ROW LEVEL SECURITY;
ALTER TABLE carrefour_recolha_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE carrefour_recolha_fotos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_all carrefour_lojas" ON carrefour_lojas;
DROP POLICY IF EXISTS "anon_all carrefour_produtos" ON carrefour_produtos;
DROP POLICY IF EXISTS "anon_all carrefour_recolhas" ON carrefour_recolhas;
DROP POLICY IF EXISTS "anon_all carrefour_recolha_itens" ON carrefour_recolha_itens;
DROP POLICY IF EXISTS "anon_all carrefour_recolha_fotos" ON carrefour_recolha_fotos;

CREATE POLICY "anon_all carrefour_lojas" ON carrefour_lojas FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all carrefour_produtos" ON carrefour_produtos FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all carrefour_recolhas" ON carrefour_recolhas FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all carrefour_recolha_itens" ON carrefour_recolha_itens FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all carrefour_recolha_fotos" ON carrefour_recolha_fotos FOR ALL TO anon USING (true) WITH CHECK (true);

-- Lojas
INSERT INTO carrefour_lojas (codigo, nome) VALUES
  ('BSP','Loja BSP'),('CPS','Loja CPS'),('ERB','Loja ERB'),('PLN','Loja PLN'),
  ('SAN','Loja SAN'),('SJC','Loja SJC'),('SOR','Loja SOR'),('SPP','Loja SPP'),
  ('TBE','Loja TBE'),('TTE','Loja TTE')
ON CONFLICT (codigo) DO UPDATE SET nome = EXCLUDED.nome;

-- Produtos (folha Carrefour — cápsulas + moídos)
INSERT INTO carrefour_produtos (posicao, material, nome, categoria, ean) VALUES
  (1,'7805019','DELTA Q QALIDUS COFFEE 10CAP','Café Caps 10Un','5601082026909'),
  (2,'7803139','DELTA Q CANELA COFFEE 10CAP','Café Caps 10Un','5601082042558'),
  (3,'7805110','DELTA Q COLÔMBIA COFFEE 10CAP','Café Caps 10Un','5601082047522'),
  (4,'7862809','DELTA Q MENTA & CHOCOLATE 10CAP','Café Caps 10Un','5601082056098'),
  (5,'7805022','DELTA Q QONVICTUS COFFEE 10CAP','Café Caps 10Un','5601082026954'),
  (6,'7805020','DELTA Q QHARACTER COFFEE 10CAP','Café Caps 10Un','5601082026930'),
  (7,'7805023','DELTA Q AQTIVUS COFFEE 10CAP','Café Caps 10Un','5601082026978'),
  (8,'7805155','DELTA Q CARAMELO COFFEE 10CAP','Café Caps 10Un','5601082058061'),
  (1,'7801734','DELTA COLÔMBIA COFFEE MU 250g','Café moído','5601082035154'),
  (2,'7806713','DELTA VIETNAM COFFEE MU 250g','Café moído','5601082045429'),
  (3,'7806814','DELTA CUBA COFFEE MU 250g','Café moído','5601082045436'),
  (4,'7802415','DELTA TIMOR COFFEE MU 250g','Café moído','5601082035161')
ON CONFLICT (material) DO UPDATE SET
  posicao = EXCLUDED.posicao, nome = EXCLUDED.nome,
  categoria = EXCLUDED.categoria, ean = EXCLUDED.ean;
