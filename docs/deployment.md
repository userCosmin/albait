# Publicare: GitHub → Cloudflare Workers Builds → albait.ro

## Ce există deja (verificat la 9 octombrie 2026)

| Element | Stare |
| --- | --- |
| Worker Cloudflare `albait` | Publicat cu `wrangler deploy` din acest repository |
| URL de test | https://albait.aldea-sorin-cosmin.workers.dev |
| D1 `albait-leads` (EEUR, id `3b74163b-8375-4b8f-92f1-0e317c0af024`) | Creată, migrarea `0001_leads.sql` aplicată local și remote |
| Formular | Testat live: solicitarea ajunge în D1 (rândul de test a fost șters) |
| Redirecturi 301, headere de securitate, 404 | Verificate pe URL-ul de test |
| Domeniul albait.ro | **Neatins.** DNS la Hostico; site-ul vechi rămâne până decideți mutarea |
| Repository GitHub | **De creat** (vezi pasul 1) |

## Comenzi

| Scop | Comandă |
| --- | --- |
| Instalare | `npm ci` |
| Dezvoltare locală (runtime workerd, D1 local) | `npm run dev` |
| Verificare completă | `npm run verify` (astro check + teste + build + verificări dist) |
| Build | `npm run build` → `dist/` |
| Previzualizare build pe runtime Workers | `npx astro preview` |
| Deploy manual | `npm run deploy` (`astro build && wrangler deploy`) |
| Migrații D1 | `npx wrangler d1 migrations apply albait-leads --remote` |
| Citire solicitări | `npx wrangler d1 execute albait-leads --remote --command "SELECT * FROM leads ORDER BY created_at DESC"` |

Solicitările se pot citi și din dashboard: **Storage & Databases → D1 → albait-leads → Console**, cu `SELECT * FROM leads ORDER BY created_at DESC;`.

---

## Pași care necesită acțiunea dumneavoastră

### 1. Creați repository-ul GitHub (2 minute)

Pe github.com, cont `userCosmin`: **New repository** → nume `albait` → **Private** → *fără* README, .gitignore sau licență → **Create**.

Apoi, din acest director:

```sh
git remote add origin https://github.com/userCosmin/albait.git
git push -u origin main
```

### 2. Conectați Worker-ul la GitHub (Workers Builds)

În Cloudflare: **Workers & Pages → albait → Settings → Builds → Connect**.

1. Autorizați aplicația **Cloudflare Workers & Pages** pe GitHub pentru repository-ul `userCosmin/albait` (doar acel repo).
2. Setări:

   | Câmp | Valoare |
   | --- | --- |
   | Git branch (producție) | `main` |
   | Build command | `npm run build` |
   | Deploy command | `npx wrangler deploy` |
   | Root directory | `/` (implicit) |
   | Builds for non-production branches | **Activat** |
   | Preview command | `npx wrangler preview` (implicit) |

   Numele Worker-ului din dashboard (`albait`) trebuie să fie același cu `name` din `wrangler.jsonc` — este deja așa.
3. Workers Builds instalează dependențele cu `npm ci` din `package-lock.json`. Versiunea Node: proiectul cere Node ≥ 22.12 (`.nvmrc` = 22); dacă build-ul folosește altă versiune, adăugați variabila de build `NODE_VERSION=22`.

De acum: **push pe `main` → build + deploy automat în producție**; push pe orice alt branch / pull request → **Preview URL** separat, cu comentariu pe PR.

### 3. Conectați domeniul albait.ro (când decideți lansarea)

Workers Custom Domains cer ca zona să fie în Cloudflare. Pași:

1. Cloudflare → **Add a domain** → `albait.ro` → planul Free. Cloudflare importă înregistrările DNS existente — **verificați că apar MX `mail.albait.ro` și TXT SPF**, altfel e-mailul @albait.ro se oprește.
2. La Hostico, schimbați nameserverele domeniului cu cele două indicate de Cloudflare.
3. După activarea zonei: **Workers & Pages → albait → Settings → Domains & Routes → Add → Custom domain** → `albait.ro`, apoi încă o dată pentru `www.albait.ro` (sau o regulă de redirect www → apex).
4. Verificați https://albait.ro, apoi trimiteți un formular de test.

Recomandare: dezactivați listarea directoarelor la Hostico chiar dacă amânați mutarea (acum `https://albait.ro/` expune `php.ini`).

### 4. Notificări pe e-mail pentru solicitări (după pasul 3)

Necesită ca albait.ro să folosească DNS Cloudflare și planul Workers Paid (Email Sending).

1. **Compute → Email Service → Email Sending → Onboard Domain** → `albait.ro` (Cloudflare adaugă SPF/DKIM pe `cf-bounce` și DMARC).
2. În `wrangler.jsonc`, decomentați:
   ```jsonc
   "send_email": [{ "name": "EMAIL", "allowed_sender_addresses": ["formular@albait.ro"] }]
   ```
3. Confirmați destinatarul în `vars.LEAD_NOTIFY_TO` (acum `flavius@albait.ro`), rulați `npm run cf-typegen`, commit și push.

Codul (`src/pages/api/contact.ts`) trimite automat e-mailul când binding-ul există și marchează `notified = 1`. Fără binding, solicitările se salvează oricum în D1.

### 5. Google Search Console (după lansare)

1. Search Console → **Add property → Domain** → `albait.ro`, verificare prin TXT în DNS Cloudflare.
2. **Sitemaps** → trimiteți `https://albait.ro/sitemap-index.xml`.
3. Inspectați `/`, `/case-de-marcat/` și o pagină de produs; cereți indexarea.

### Opțional: Turnstile

Formularul are deja honeypot, timp minim de completare, verificare Origin și limită de 5 solicitări/oră. Dacă apare spam, adăugați un widget Turnstile (Cloudflare → Turnstile), cheia publică în componentă și secretul cu `npx wrangler secret put TURNSTILE_SECRET`.

## Secrete

Nu există secrete în repository. `wrangler.jsonc` conține doar ID-ul bazei D1 (nu e secret) și adresele de notificare. Eventualele secrete se adaugă cu `npx wrangler secret put` sau din dashboard (Settings → Variables and Secrets), niciodată în cod. `.dev.vars` și `.env*` sunt în `.gitignore`.
