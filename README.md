# albait.ro

Website-ul ALBA IT SRL (Alba Iulia): case de marcat fiscale Daisy, service și servicii IT.

**Stack:** Astro 7 (pagini prerenderate) · React 19 (doar insule interactive) · Motion for React · Tailwind CSS 4 · TypeScript · Cloudflare Workers (static assets + un endpoint) · D1.

- Test: https://albait.aldea-sorin-cosmin.workers.dev
- Publicare și pași rămași: [`docs/deployment.md`](docs/deployment.md)
- Cercetare, surse, concurență, design system: [`docs/research-and-design.md`](docs/research-and-design.md)

## Pornire rapidă

```sh
nvm use            # Node 22
npm ci
npx wrangler d1 migrations apply albait-leads --local   # o singură dată
npm run dev        # http://localhost:4321
```

| Comandă | Ce face |
| --- | --- |
| `npm run dev` | Server de dezvoltare (runtime workerd, D1 local) |
| `npm run check` | Verificare TypeScript / Astro |
| `npm test` | Teste unitare (validarea formularului) |
| `npm run build` | Build de producție în `dist/` |
| `npm run test:dist` | Verifică build-ul: titluri, descrieri, canonical, H1, JSON-LD, linkuri interne, imagini, sitemap |
| `npm run verify` | Toate cele de mai sus, în ordine |
| `npm run test:e2e -- <url>` | Teste în browser (meniu mobil, ghid de alegere, validare formular, reduced motion, fără JS); implicit pe `http://localhost:4321` |
| `npm run deploy` | Build + `wrangler deploy` (în mod normal publicarea se face automat la push pe `main`) |
| `npm run images` | Regenerează decupajele produselor, iconițele și imaginea Open Graph din `assets-src/` |
| `npm run cf-typegen` | Regenerează tipurile pentru binding-urile din `wrangler.jsonc` |

## Structură

```
src/
  data/          site.ts (date firmă, cu surse) · products.ts · services.ts · faq.ts
  pages/         rute Astro; api/contact.ts este singura rută randată la cerere
  layouts/       BaseLayout (meta, OG, JSON-LD, header, footer, reveal la scroll)
  components/    secțiuni Astro (fără JavaScript)
    home/        secțiunile paginii principale
    react/       insule interactive: HeroStage, ModelFinder, ProductStory, LeadForm, MobileMenu
  lib/           schema.ts (JSON-LD) · lead.ts (validare) · images.ts · finder.ts
  styles/        global.css (design tokens Tailwind v4)
  assets/        imagini procesate (intră în pipeline-ul de imagini Astro)
assets-src/      fotografiile originale (Daisy / Zeus Service) și logo-ul oficial
migrations/      schema D1 pentru solicitări
public/          _redirects, _headers, robots.txt, llms.txt, iconițe
scripts/         prepare-images.mjs, verify-dist.mjs
tests/           teste Vitest
```

## Reguli de conținut

- Toate datele despre firmă și produse vin din `src/data/` și au surse în `docs/research-and-design.md`. Nu adăugați prețuri, garanții, statistici sau recenzii fără confirmare.
- Un produs nou = o intrare în `src/data/products.ts` (+ imagini în `src/assets/products/`); pagina, sitemap-ul, ghidul de alegere și tabelul comparativ se generează automat.
- Un URL schimbat = o linie în `public/_redirects`.

## Formularul de ofertă

`POST /api/contact/` validează (`src/lib/lead.ts`), filtrează spam-ul (honeypot, timp minim, Origin, 5 cereri/oră pe amprentă IP zilnică) și salvează în D1 (`leads`). Funcționează și fără JavaScript (redirect la `/multumim/`). Notificarea pe e-mail se activează după configurarea Email Service — vezi `docs/deployment.md`.
