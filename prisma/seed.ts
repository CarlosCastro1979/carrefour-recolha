import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const STORES = [
  { code: "BSP", name: "Loja BSP" },
  { code: "CPS", name: "Loja CPS" },
  { code: "ERB", name: "Loja ERB" },
  { code: "PLN", name: "Loja PLN" },
  { code: "SAN", name: "Loja SAN" },
  { code: "SJC", name: "Loja SJC" },
  { code: "SOR", name: "Loja SOR" },
  { code: "SPP", name: "Loja SPP" },
  { code: "TBE", name: "Loja TBE" },
  { code: "TTE", name: "Loja TTE" },
];

const PRODUCTS = [
  { position: 1, material: "7805019", description: "DELTA Q QALIDUS COFFEE 10CAP", category: "Café Caps 10Un", ean: "5601082026909" },
  { position: 2, material: "7803139", description: "DELTA Q CANELA COFFEE 10CAP", category: "Café Caps 10Un", ean: "5601082042558" },
  { position: 3, material: "7805110", description: "DELTA Q COLÔMBIA COFFEE 10CAP", category: "Café Caps 10Un", ean: "5601082047522" },
  { position: 4, material: "7822809", description: "DELTA Q MENTA & CHOCOLATE 10CAP", category: "Café Caps 10Un", ean: "5601082036088" },
  { position: 5, material: "7805020", description: "DELTA Q QONVICTUS COFFEE 10CAP", category: "Café Caps 10Un", ean: "5601082026916" },
  { position: 6, material: "7805021", description: "DELTA Q QHARACTER COFFEE 10CAP", category: "Café Caps 10Un", ean: "5601082026923" },
  { position: 7, material: "7805022", description: "DELTA Q AKTIVUS COFFEE 10CAP", category: "Café Caps 10Un", ean: "5601082026930" },
  { position: 8, material: "7805023", description: "DELTA Q QHARISMA COFFEE 10CAP", category: "Café Caps 10Un", ean: "5601082026947" },
  { position: 1, material: "7801734", description: "DELTA COLÔMBIA COFFEE MU 250g", category: "Café moído", ean: "5601082035154" },
  { position: 2, material: "7806713", description: "DELTA VIETNAM COFFEE MU 250g", category: "Café moído", ean: "5601082045428" },
  { position: 3, material: "7802413", description: "DELTA TIMOR COFFEE MU 250g", category: "Café moído", ean: "5601082035161" },
];

async function main() {
  for (const store of STORES) {
    await prisma.store.upsert({
      where: { code: store.code },
      update: { name: store.name },
      create: store,
    });
  }

  for (const product of PRODUCTS) {
    await prisma.product.upsert({
      where: { material: product.material },
      update: {
        position: product.position,
        description: product.description,
        category: product.category,
        ean: product.ean,
      },
      create: product,
    });
  }

  console.log(`Seed: ${STORES.length} lojas, ${PRODUCTS.length} produtos`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
