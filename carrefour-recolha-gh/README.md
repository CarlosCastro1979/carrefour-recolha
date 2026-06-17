# Carrefour Recolha

Mesmo modelo das tuas outras apps:
- [delta-margens](https://carloscastro1979.github.io/delta-margens/)
- [delta-foods-equipamentos](https://carloscastro1979.github.io/delta-foods-equipamentos-app/)

**GitHub Pages + Supabase** — sem Vercel, sem Render.

URL: `https://carloscastro1979.github.io/carrefour-recolha/`

## Ficheiros (igual equipamentos)

| Ficheiro | Função |
|----------|--------|
| `index.html` | App completa |
| `manifest.json` | PWA / ecrã inicial |
| `sw.js` | Service worker |
| `icon-192.png` / `icon-512.png` | Ícones *(copiar do repo equipamentos)* |
| `supabase_schema.sql` | Tabelas no Supabase |
| `.nojekyll` | GitHub Pages |

## Setup

1. **Supabase** (projeto `qnscwppgljobelplgbkp`) → SQL Editor → `supabase_schema.sql`
2. **GitHub** → repo `carrefour-recolha` → upload destes ficheiros na raiz
3. **Settings → Pages** → branch `main`, pasta `/ (root)`
4. Copiar `icon-192.png` e `icon-512.png` do repo equipamentos

## Nota sobre o nome do repo

Se o repo tiver outro nome, altera `BASE` e paths no `manifest.json`:
`/carrefour-recolha/` → `/nome-do-repo/`
