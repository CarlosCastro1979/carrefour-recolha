# Carrefour Recolha

App para recolha de dados nas lojas Carrefour: stock físico, stock de sistema, preços e fotos dos lineares.

## Funcionalidades

- **Mobile** (`/mobile`) — recolha na loja com nome do recolhedor, data, produtos e fotos
- **Desktop** (`/dashboard`) — histórico, comparação stock físico vs sistema, galeria de fotos
- **10 lojas** — BSP, CPS, ERB, PLN, SAN, SJC, SOR, SPP, TBE, TTE
- **Produtos Delta Q** — pré-carregados a partir da folha de recolha

## Arranque

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## Estrutura

| Rota | Descrição |
|------|-----------|
| `/` | Página inicial — escolher mobile ou desktop |
| `/mobile` | Interface de recolha (otimizada para telemóvel) |
| `/dashboard` | Painel de gestão e histórico |

## Dados recolhidos por produto

- Stock físico (contagem na loja)
- Stock de sistema (Carrefour)
- Preço
- Nome do recolhedor + data/hora
- Fotos dos lineares

## Tecnologias

- Next.js 15 + React 19
- Prisma + SQLite
- Tailwind CSS 4
