// Verified company facts. Every value here has a public source, listed in
// docs/research-and-design.md. Do not add claims (years, client counts,
// certifications) that are not backed by a source.

export const company = {
  brand: 'ALBA IT',
  legalName: 'ALBA IT SRL',
  cui: 'RO33901616', // ANAF: plătitor de TVA din 09.01.2015
  regCom: 'J2014000735017', // ANAF / ONRC
  founded: '2014-12-16', // data înregistrării (ANAF)
  caen: '9510',
  registeredOffice: {
    street: 'Str. Emil Racoviță nr. 55',
    city: 'Alba Iulia',
    county: 'Alba',
    postalCode: '510175',
    country: 'RO',
  },
  // Punctul de lucru publicat pe albait.ro (2024), Waze și firmadeaur.ro.
  showroom: {
    street: 'Piața Iuliu Maniu nr. 20',
    city: 'Alba Iulia',
    county: 'Alba',
    country: 'RO',
  },
  phone: { display: '0758 343 653', href: 'tel:+40758343653', e164: '+40758343653' },
  // Adresa publicată în subsolul albait.ro (2024). office@albait.ro apare pe
  // varianta din 2021. De confirmat care este adresa principală.
  email: 'flavius@albait.ro',
  // Program publicat pe pagina de contact albait.ro (2024). De confirmat.
  hours: { display: 'Luni – Vineri, 09:00 – 16:00', opens: '09:00', closes: '16:00' },
  facebook: 'https://www.facebook.com/AlbaIuliaTechnology/',
  url: 'https://albait.ro',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=ALBA+IT+SRL+Pia%C8%9Ba+Iuliu+Maniu+20+Alba+Iulia',
} as const;

export const credentials = [
  {
    title: 'Distribuitor în rețeaua Zeus Service',
    detail:
      'Listat în rețeaua de parteneri Zeus Service, județul Alba, pentru Daisy eXpert SX, Compact M, Perfect M și Compact S.',
    href: 'https://www.zeusservice.ro/retea-parteneri-zeusservice',
    source: 'zeusservice.ro',
  },
  {
    title: 'Premiul „Firma de Aur” 2024 · 2025 · 2026',
    detail: 'Acordat de firmadeaur.ro pe baza recenziilor publice lăsate de clienți.',
    href: 'https://www.firmadeaur.ro/company/alba-it-srl-vanzari-case-de-marcat-1974418',
    source: 'firmadeaur.ro',
  },
  {
    title: 'Societate înregistrată în 2014',
    detail: 'ALBA IT SRL · CUI RO33901616 · J2014000735017 · plătitor de TVA.',
    href: 'https://www.anaf.ro/RegistruTVA/',
    source: 'anaf.ro',
  },
] as const;

export const nav = [
  { label: 'Case de marcat', href: '/case-de-marcat/' },
  { label: 'Produse', href: '/produse/' },
  { label: 'Servicii', href: '/servicii/' },
  { label: 'Despre noi', href: '/despre-noi/' },
  { label: 'Contact', href: '/contact/' },
] as const;
