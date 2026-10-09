# ALBA IT — cercetare, direcție vizuală și decizii tehnice

Document de lucru pentru albait.ro. Data cercetării: 9 octombrie 2026.

---

## 1. Starea website-ului actual

- `https://albait.ro/` răspunde cu **o listare de director deschisă** („Index of /”), cu un singur fișier vizibil: `php.ini`. Pentru clienții fără browser „real” serverul răspunde 404. **Nu există conținut public.**
  - ⚠️ Recomandare de securitate, indiferent de noul site: dezactivați listarea directoarelor pe hostingul Hostico și eliminați `php.ini` din rădăcina publică.
- DNS: nameserverele sunt la Hostico (`ns1–ns4.hostico.ro`), `A 188.241.222.17`, `MX mail.albait.ro`, SPF `v=spf1 +a +mx +ip4:188.241.222.17 ~all`.
- Istoric (Wayback Machine):
  - **2016–2022**: WordPress (temă Themify). Pagini: `/case-de-marcat/`, `/echipamente-it/` („În curând”), `/service-hardware(-it)/`, `/configurare-servere/`, `/audit/`, `/mentenanta-it/`, `/alege-alba-it/`, `/parteneri`, `/contact/`. Modelele de case de marcat listate atunci (Karat Mobika, Daisy Expert, Eltrade A100/A300S/A300SD/A500D/A500JE, Euro 50T Mini, Incotex 170F, Optima CR21) sunt **generația veche, fără jurnal electronic conectat la ANAF** și nu au fost preluate.
  - **2024**: magazin OpenCart (platformă aweb) cu un catalog mare de calculatoare/monitoare refurbished și second-hand (flux de la un furnizor), categoria „Case de marcat de generație nouă (7)” și un banner „Doar pentru profesorii care oferă meditații — Compact S”. Paginile de produs nu sunt arhivate.

## 2. Surse cercetate

| Sursă | Ce confirmă |
| --- | --- |
| ANAF — `webservicesp.anaf.ro/api/PlatitorTvaRest/v9/tva` (CUI 33901616, interogat 09.10.2026) | Denumire, CUI, Nr. Reg. Com. J2014000735017, sediu social Str. Emil Racoviță 55, 510175 Alba Iulia, înregistrare 16.12.2014, CAEN 9510, plătitor TVA din 09.01.2015, TVA la încasare, activ |
| cauta.ro/companies/33901616-alba-it-srl | Aceleași date; 2 angajați (2025) — **nefolosit pe site** |
| zeusservice.ro/retea-parteneri-zeusservice | ALBA IT SRL, Str. Emil Racoviță 55, 0758.343.653 — distribuitor pentru **Expert SX, Compact M 01, Perfect M 02, Compact S 01** (nu Expert L, nu Beko X30TR) |
| zeusservice.ro — paginile de produs + manualele PDF în limba română | Specificațiile Daisy Compact S și eXpert SX-02 |
| milo-trading.ro — paginile Incotex Succes M7/M4 + manualele PDF | Specificațiile Incotex Succes M7 și M4 |
| albait-website.pages.dev/case-de-marcat | Lista de modele stabilită de proprietar; decupajele de produs |
| Wayback: albait.ro 2021 (contact, servicii) | Telefon 0758.343.653, office@albait.ro, flavius@albait.ro, servicii IT (mentenanță, service hardware, configurare servere, audit) |
| Wayback: albait.ro 2024 (contact) | Piața Iuliu Maniu 20, Alba Iulia; 0758343653; L–V 9:00–16:00; flavius@albait.ro; logo |
| firmadeaur.ro/company/alba-it-srl-vanzari-case-de-marcat-1974418 | „ALBA IT SRL — Vânzări Case de Marcat”, Piața Iuliu Maniu 20; premiul Firma de Aur 2024, 2025, 2026 (pe baza recenziilor; 5/5 din 11 recenzii Google) |
| Waze | „ALBA IT SRL – Vanzari Case de Marcat”, Piața Iuliu Maniu 20 |
| facebook.com/AlbaIuliaTechnology | Pagina oficială (nu a fost accesibilă fără autentificare) |
| datecs.ro (informare) + startupcafe.ro, profit.ro, cotidianul.ro | OUG 68/2025: sancțiunea pentru bon fără cod QR suspendată până la 1.11.2026 |
| static.anaf.ro/.../801.html, fiscalitatea.ro | Formularul C801 (NUI) se depune prin SPV de cumpărător |

## 3. Informații confirmate despre ALBA IT

- **ALBA IT SRL**, CUI **RO33901616**, **J2014000735017**, înregistrată 16.12.2014, activă, plătitor de TVA.
- Sediu social: Str. Emil Racoviță nr. 55, Alba Iulia 510175, jud. Alba.
- Punct de lucru / showroom: **Piața Iuliu Maniu nr. 20, Alba Iulia**.
- Telefon: **0758 343 653**. E-mail: flavius@albait.ro (2024), office@albait.ro (2021).
- Program publicat (2024): luni–vineri 09:00–16:00.
- Distribuitor în rețeaua **Zeus Service** (importatorul Daisy în România) pentru **Daisy eXpert SX, Compact M, Perfect M, Compact S**.
- Servicii publicate pe site-ul propriu: case de marcat + service și mentenanță; mentenanță IT; service hardware; configurare servere (în principal Linux); audit de securitate și VPN.
- Logo oficial: triunghi albastru stilizat + „Alba IT” (PNG 512×512 din arhiva 2016). Nu există variantă vectorială publică.

## 4. Inventar produse și servicii (folosit pe site)

**Lista de modele este cea stabilită de proprietar** pe https://albait-website.pages.dev/case-de-marcat (actualizare 9.10.2026): Succes M7, Succes M4, Compact S, Expert SX-02. Daisy Compact M și Perfect M au fost scoase din ofertă (redirect 301 spre `/case-de-marcat/`).

| Produs | Profil | Sursa specificațiilor |
| --- | --- | --- |
| Incotex Succes M7 | staționară cu acumulator 7,4 V/1800 mAh (60 h standby), 38 taste, sertar RJ-14, 2 × serial RJ-11, USB, PS/2, Ethernet, 223×196×80 mm, 950 g | milo-trading.ro (importator Incotex) + manualul SUCCES M7 2018 |
| Incotex Succes M4 | staționară cu acumulator, afișaj operator 128×64, 30 taste, 2 × serial RJ-45 (sertar, cântar, scanner, POS Verifone), Wi-Fi, ETH opțional, 700 g | milo-trading.ro + manualul INCOTEX 777 (Succes M4) 2019 |
| Daisy Compact S | portabilă, ~300 g, Li-Ion 2200 mAh, XML automat la ANAF după raportul Z | Zeus Service + manual |
| Daisy eXpert SX-02 | punct fix sau ambulant, NiMH 1800 mAh, RS232 cântar/cititor, fără sertar, GPRS | Zeus Service + manual |

Imagini: Succes M7, Succes M4 și eXpert SX-02 — decupajele (WebP transparent) de pe albait-website.pages.dev; Compact S și fotografiile secundare — Zeus Service.

Discrepanțe între sursele Incotex (am folosit manualul): Succes M4 acumulator 1900 mAh (pagina) vs 1800 mAh (manual); adâncime 105 mm (pagina) vs 111 mm (manual).

Specificații de pe albait-website.pages.dev **nepreluate** pentru că nu apar în documentația importatorilor: „SAM cryptocard FIPS 140-2” la Compact S/eXpert SX (Zeus indică EAL 5+), „1,2 milioane bonuri”, „Wi-Fi opțional” la Compact S (Zeus: Wi-Fi inactiv), „cea mai mică casă de marcat din România”.

Servicii: service case de marcat · mentenanță IT · service hardware · configurare servere și rețele · audit de securitate IT.

**Neincluse (dovezi insuficiente / neconfirmate acum):** sisteme POS, imprimante fiscale, cântare, software de gestiune, vânzare de calculatoare/monitoare refurbished (catalogul OpenCart din 2024 nu mai e online), prețuri, garanții, termene de intervenție.

## 5. Analiza concurenței (12 site-uri)

| Site | Tip | Observații |
| --- | --- | --- |
| zeusservice.ro | Importator Daisy/Beko/Eltrade, magazin | Pop-up la intrare + banner cookie mare; meniu lateral dens; **fără H1**; fără `tel:` clicabil; documentație bună (manuale PDF) |
| datecs.ro | Producător/distribuitor | H1 prezent, JSON-LD bogat; homepage dominat de un anunț legislativ (roșu) — util (QR/OUG 68/2025), dar sufocă oferta |
| daisy.ro | Producător | Hero tipografic roșu/negru; preț în bara de sus (Compact M 760 lei, Compact S 730 lei — Daisy Tech); **fără H1**, fără `tel:` |
| tremol.ro | Producător/distribuitor | Layout split, text mult, slider vertical; WordPress 5.2 (vechi); fără H1 |
| danubius-exim.ro | Integrator fiscal | Hero video greu (336 KB HTML, 67 scripturi); descriere meta greșită (URL-uri video) |
| casedemarcat.eu (AttoSoft) | Magazin online | Banner promo aglomerat (prețuri „de la 410 lei fără TVA”, logo-uri Uber/Bolt) — bun pe nișa ridesharing, slab vizual |
| albasoft.ro | Concurent local (Alba) — software + case Datecs | WhatsApp, telefon vizibil; hero stock foto; fără H1 |
| amecs.ro | Concurent local (Alba/Cluj) — cântare, case de marcat, metrologie | Joomla, fără meta description, banner bitmap |
| posnet.ro | Soft POS HoReCa | H1 bun, JSON-LD Service/OfferCatalog, 101 scripturi |
| smartcash.ro | Soft retail | Hero foto stock; H1 = formular |
| fiscalnet.ro | Driver universal case de marcat | H1 „Home”; WordPress |
| elcom.ro | Distribuitor | Pagină aproape goală (5 KB) |

**Concluzii**
- Nimeni din nișă nu tratează casa de marcat ca **produs tehnologic premium**: peste tot sunt bannere promo, pop-up-uri, cataloage dense, fotografii pe fundal alb în grilă.
- Mai mult de jumătate nu au H1 sau au meta description greșită; JSON-LD minimal. Avantaj SEO ușor de obținut.
- Puțini explică **pentru cine** e fiecare model. ALBA IT are doar 4 modele — un avantaj: alegere ghidată, nu catalog.
- Nișe confirmate de piață: **ridesharing/ambulant** (casedemarcat.eu, Daisy) și **meditații** (banner-ul ALBA IT din 2024).
- Concurenții locali (Albasoft, AMECS) au site-uri vechi → diferențiere clară pentru căutările „case de marcat Alba Iulia”.

**Ce preluăm (fără a copia):** documentația oficială (manuale) la vedere; informarea legislativă (QR, C801) — dar ca ghid calm, nu ca banner; telefon mereu vizibil.

## 6. MotionSites — tehnici selectate

Din galeria motionsites.ai (Hero, Landing, Technology, 3D) am ales doar ce servește produsul și conversia:
- **Cinematic hero** cu produs mare în lumină de studio, tipografie editorială, reveal pe cuvinte;
- **Product reveal cu mască** + „light sweep” pe silueta aparatului;
- **2.5D tilt la cursor** și **parallax pe straturi** (aparat / bon / etichete);
- **Pinned split-screen** (povestea Perfect M) cu cifre-gigant animate;
- **Layout animations** (ghidul de alegere reordonează modelele);
- **Accordion editorial**, **marquee** discret, **clip-path reveals** la scroll, micro-interacțiuni pe butoane.
Excluse: WebGL/3D fals, scroll-jacking, video autoplay, rotații ample.

## 7. Direcția vizuală și design system

- **Concept:** „studio fiscal” — aparatul tratat ca obiect de design, fotografiat în lumină de studio, pe fundal „ink”; bonul termic ca element grafic recurent (mono, perforații).
- **Culori:** Ink `#07090D`/`#0C1017` (secțiuni cinematice), Paper `#F3F2EE` (lectură), Studio `#E6E9ED` (fundal produse), un singur accent — **albastrul logo-ului** (`#1E8FE1`, `#0F6FC6` pentru butoane, contrast 5,1:1 cu alb; `#8CCBFF` pe fundal închis). Contraste verificate WCAG AA.
- **Tipografie:** *Schibsted Grotesk* (variabil; titluri strânse, corp), *Instrument Serif Italic* (accente editoriale), *IBM Plex Mono* (etichete tehnice, „bon”). Toate cu subseturi latin + latin-ext (ș, ț, ă, î, â). Ierarhie: display 3–9 rem, h2 2,1–4,4 rem, lead 1,08–1,3 rem.
- **Spațiere/grid:** container 92 rem, gutter fluid 1–2,5 rem, secțiuni 5–10 rem, grilă 12 coloane, raze 1,5 rem (carduri) / pill (butoane).
- **Componente:** butoane pill cu umplere glisantă, câmpuri de 52 px cu focus albastru, carduri produs pe fundal studio, liste editoriale numerotate.
- **Motion:** easing `cubic-bezier(.16,1,.3,1)`; intrări 0,9–1,3 s; doar `transform`/`opacity`/`clip-path`; totul dezactivat la `prefers-reduced-motion`; conținutul e vizibil fără JavaScript (clasa `js-motion` este adăugată doar când animația e binevenită).
- **Imagini:** fotografiile oficiale Daisy (via Zeus Service), decupate automat (`scripts/prepare-images.mjs`) pentru a sta pe orice fundal; convertite la AVIF/WebP la build. Nu au fost generate imagini care să sugereze modele inexistente.

## 8. Decizii tehnice

| Decizie | Motiv |
| --- | --- |
| Astro 7.3 (static) + `@astrojs/cloudflare` 14.3 | HTML prerenderat pentru toate paginile; un singur endpoint on-demand (`/api/contact/`) |
| React 19 doar în insule | Hero stage (`client:load`), ghid de alegere, poveste produs, formular (`client:visible`), meniu mobil (`client:idle`) |
| Motion 13.5.1 (nu 14.0.0) | 14.0.0 apăruse cu o săptămână înainte, fără patch; 13.5.x este stabil |
| Tailwind 4.3 via `@tailwindcss/vite` | Tokens în `@theme`, fără config JS |
| `imageService: 'compile'` | Imagini optimizate la build cu sharp; fără binding Images la runtime |
| `session: false` | Nu folosim sesiuni; evită provizionarea unui KV inutil |
| `_redirects` / `_headers` (Workers Static Assets) | 301 reale pentru URL-urile vechi; headere de securitate |
| D1 `albait-leads` (EEUR) | Stocare reală a solicitărilor; e-mail opțional prin Email Service după mutarea DNS |
| Anti-spam: honeypot + timp minim de completare + verificare Origin + rate-limit 5/oră pe amprentă IP zilnică (fără IP stocat) | Fără cookie-uri sau CAPTCHA terț; Turnstile poate fi adăugat ulterior |
| CSS inline (`inlineStylesheets: 'always'`) | Elimină singura resursă care bloca randarea |
| Header de hero: animații CSS, nu JS | LCP nu depinde de hidratarea React; conținutul nu e ascuns fără JS |

## 9. De confirmat cu ALBA IT înainte de lansare

1. **Adresa de e-mail principală** (flavius@ sau office@) și dacă ambele funcționează.
2. **Programul**: albait.ro (2024) spune L–V 09:00–16:00; un listing terț spune L–J 9–16, V 9–14.
3. Dacă **service-ul/fiscalizarea** sunt făcute direct de ALBA IT sau prin unitatea de service a Zeus Service (formularea de pe site e prudentă: „service și mentenanță pentru modelele distribuite”).
4. Dacă **serviciile IT** (mentenanță, servere, audit) sunt încă oferite (sursa este site-ul din 2021 + CAEN 9510).
5. Dacă se doresc **prețuri publice** (Daisy Tech afișează 730/760 lei pentru Compact S/M; nu le-am preluat).
6. **Dreptul de folosire a fotografiilor** Daisy (Zeus Service) și Incotex (Milo Trading 2000) — uzual permis distribuitorilor; de confirmat.
11. Dacă ALBA IT este partener al Milo Trading 2000 pentru Incotex (pe pages.dev apar „Parteneri autorizați”, fără nume); site-ul nou nu afirmă statutul de distribuitor autorizat Incotex.
7. Dacă se mai vând **calculatoare/echipamente IT refurbished, POS, cântare** (catalogul OpenCart din 2024).
8. Logo vectorial (SVG/AI) — există doar un PNG 512×512.
9. Perioada de păstrare a solicitărilor (am propus 24 de luni în politica de confidențialitate).
10. Specificația „Dimensiuni” pentru Perfect M: pagina Zeus repetă valorile eXpert SX; am omis-o.
