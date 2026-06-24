-- Executar no SQL Editor do Supabase (projeto qnscwppgljobelplgbkp)
-- v6: catálogo 11 produtos — remove Cuba/Caramelo, adiciona Qharisma, renomeia categoria cápsulas

INSERT INTO carrefour_produtos (posicao, material, nome, categoria, ean) VALUES
  (1,'7801734','DELTA COLÔMBIA COFFEE MU 250g','Café moído','5601082035154'),
  (2,'7806713','DELTA VIETNAM COFFEE MU 250g','Café moído','5601082045429'),
  (3,'7802415','DELTA TIMOR COFFEE MU 250g','Café moído','5601082035161'),
  (1,'7805019','DELTA Q QALIDUS COFFEE 10CAP','Café cápsulas','5601082026909'),
  (2,'7803139','DELTA Q CANELA COFFEE 10CAP','Café cápsulas','5601082042558'),
  (3,'7805110','DELTA Q COLÔMBIA COFFEE 10CAP','Café cápsulas','5601082047522'),
  (4,'7862809','DELTA Q MENTA & CHOCOLATE 10CAP','Café cápsulas','5601082056098'),
  (5,'7805022','DELTA Q QONVICTUS COFFEE 10CAP','Café cápsulas','5601082026954'),
  (6,'7805020','DELTA Q QHARACTER COFFEE 10CAP','Café cápsulas','5601082026930'),
  (7,'7805023','DELTA Q AQTIVUS COFFEE 10CAP','Café cápsulas','5601082026978'),
  (8,'7805021','DELTA Q QHARISMA COFFEE 10CAP','Café cápsulas','5601082040226')
ON CONFLICT (material) DO UPDATE SET
  posicao = EXCLUDED.posicao, nome = EXCLUDED.nome,
  categoria = EXCLUDED.categoria, ean = EXCLUDED.ean;

-- Descontinuar produtos removidos do catálogo (mantém histórico em recolhas)
UPDATE carrefour_produtos SET categoria = 'Descontinuado', posicao = 99
WHERE material IN ('7806814', '7805155');

-- Renomear categoria antiga em produtos ainda activos (idempotente)
UPDATE carrefour_produtos SET categoria = 'Café cápsulas'
WHERE categoria = 'Café Caps 10Un' AND material NOT IN ('7806814', '7805155');
