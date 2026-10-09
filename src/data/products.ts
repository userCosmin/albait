// Cash registers ALBA IT distributes, per the Zeus Service partner network
// (județul Alba). Specs are copied from the importer's product pages and the
// official Romanian user manuals linked below — no values are inferred.
// Prices are intentionally absent: ALBA IT has not confirmed a public price list.
import type { ImageMetadata } from 'astro';

import compactSCutout from '@/assets/products/compact-s-cutout.png';
import compactSAngle from '@/assets/products/compact-s-angle-cutout.png';
import compactSCar from '@/assets/products/compact-s-car-mounted.jpg';
import compactSHand from '@/assets/products/compact-s-car-hand.jpg';
import compactMCutout from '@/assets/products/compact-m-cutout.png';
import compactMBack from '@/assets/products/compact-m-back.jpg';
import perfectMCutout from '@/assets/products/perfect-m-cutout.png';
import perfectMTop from '@/assets/products/perfect-m-top-cutout.png';
import expertSx from '@/assets/products/expert-sx.jpg';
import expertSxFront from '@/assets/products/expert-sx-front.jpg';
import expertSxTop from '@/assets/products/expert-sx-top.jpg';

export type Capability =
  | 'portabil'
  | 'acumulator'
  | 'alimentare-auto'
  | 'sertar-bani'
  | 'cantar'
  | 'cititor-coduri'
  | 'pc'
  | 'bluetooth'
  | 'gprs-anaf'
  | 'imprimanta-fiscala';

export const capabilityLabels: Record<Capability, string> = {
  portabil: 'Portabilă',
  acumulator: 'Acumulator inclus',
  'alimentare-auto': 'Alimentare din mașină (opțional)',
  'sertar-bani': 'Deschide sertar de bani',
  cantar: 'Conectare cântar electronic',
  'cititor-coduri': 'Conectare cititor coduri de bare',
  pc: 'Conectare la PC',
  bluetooth: 'Bluetooth',
  'gprs-anaf': 'Modem GPRS pentru ANAF',
  'imprimanta-fiscala': 'Funcție imprimantă fiscală',
};

export interface ProductImage {
  src: ImageMetadata;
  alt: string;
  /** cutouts are transparent PNGs; photos have their own background */
  kind: 'cutout' | 'photo';
}

export interface Product {
  slug: string;
  name: string;
  model: string;
  brand: 'Daisy';
  tagline: string;
  summary: string;
  bestFor: string[];
  capabilities: Capability[];
  highlights: { title: string; text: string }[];
  specs: { label: string; value: string }[];
  images: ProductImage[];
  manualUrl: string;
  sourceUrl: string;
  /** shown on cards: short, factual key figures */
  keyFigures: { value: string; label: string }[];
}

const common = {
  jurnal: { label: 'Jurnal electronic', value: 'microSD 8 GB, capacitate 40 milioane de linii' },
  memorie: { label: 'Memorie fiscală', value: 'Nevolatilă, 1.830 rapoarte zilnice' },
  crypto: { label: 'Modul criptografic', value: 'EAL 5+ cu Crypto-Card pentru certificatul digital' },
  plu: { label: 'Articole (PLU)', value: '30.000, denumire de 30 de caractere' },
  tva: { label: 'Cote TVA', value: '5' },
  operatori: { label: 'Operatori', value: '20, cu parolă' },
  plata: {
    label: 'Metode de plată',
    value: '9 (numerar, card, tichete de masă, tichete valorice, voucher, credit, metode moderne, altele)',
  },
  clienti: { label: 'Clienți programabili', value: '10.000, cu CIF introdus direct pe bon' },
  imprimanta: { label: 'Imprimantă', value: 'Termică liniară, 12 linii/s, 32 caractere pe linie' },
};

export const products: Product[] = [
  {
    slug: 'daisy-compact-s',
    name: 'Daisy Compact S',
    model: 'Compact S 01',
    brand: 'Daisy',
    tagline: 'Casa de marcat care încape în palmă.',
    summary:
      'Casă de marcat portabilă, recomandată de producător pentru comerț ambulant și ridesharing. Acumulator Li-Ion de 2200 mAh, încărcare prin micro USB, de la bricheta mașinii (adaptor opțional) sau de la un power bank. Trimite automat rapoartele XML la serverul ANAF după raportul Z.',
    bestFor: ['Comerț ambulant', 'Ridesharing și transport alternativ', 'Livrări', 'Servicii la domiciliu'],
    capabilities: ['portabil', 'acumulator', 'alimentare-auto', 'bluetooth', 'gprs-anaf', 'imprimanta-fiscala'],
    highlights: [
      {
        title: 'Bon emis cu o singură mână',
        text: 'Tastezi suma, apeși D+ și TOTAL. Cântărește aproximativ 300 g, iar tastatura iluminată se citește și noaptea.',
      },
      {
        title: 'Conectare directă la ANAF',
        text: 'Rapoartele XML pleacă automat către serverul ANAF imediat după emiterea raportului Z.',
      },
      {
        title: 'Aplicații gratuite pe Android',
        text: 'Daisy Ride pentru emiterea rapidă a bonului din telefon și Daisy XML pentru citirea rapoartelor prin Bluetooth și trimiterea lor la contabil.',
      },
      {
        title: 'Energie oriunde ești',
        text: 'Acumulator Li-Ion 2200 mAh, încărcare prin micro USB, adaptor auto 12 V/24 V opțional sau power bank.',
      },
    ],
    specs: [
      { label: 'Tip', value: 'Casă de marcat portabilă cu jurnal electronic' },
      { label: 'Acumulator', value: 'Li-Ion 2200 mAh' },
      { label: 'Alimentare', value: 'Adaptor USB 5 V (micro USB); adaptor auto sau power bank opțional' },
      { label: 'Articole (PLU)', value: '30.000' },
      { label: 'Departamente', value: '99 + 5' },
      { label: 'Cote TVA', value: '5' },
      { label: 'Operatori', value: '20' },
      { label: 'Rolă hârtie', value: 'Termică 57 mm, diametru max. 55 mm' },
      { label: 'Comunicare ANAF', value: 'Transmitere automată XML după raportul Z' },
      { label: 'Conectivitate', value: 'Bluetooth (aplicațiile Daisy XML și Daisy Ride), USB' },
      { label: 'Funcție imprimantă fiscală', value: 'Da' },
      { label: 'Temperatură de lucru', value: '−15 °C … +45 °C' },
      { label: 'Dimensiuni', value: '165 × 85 × 65 mm' },
      { label: 'Greutate', value: 'aprox. 300 g' },
    ],
    images: [
      { src: compactSCutout, alt: 'Casa de marcat Daisy Compact S, vedere în perspectivă, afișajul indicând TOTAL 326.70', kind: 'cutout' },
      { src: compactSAngle, alt: 'Daisy Compact S văzută din lateral, cu imprimanta termică în spate', kind: 'cutout' },
      { src: compactSCar, alt: 'Daisy Compact S montată pe bordul unei mașini, pentru ridesharing', kind: 'photo' },
      { src: compactSHand, alt: 'Șofer care emite un bon fiscal cu Daisy Compact S ținută într-o mână', kind: 'photo' },
    ],
    manualUrl: 'https://www.zeusservice.ro/media/productattachment/0/494/CompactSRomaniaUserManualV1420180828.pdf',
    sourceUrl: 'https://www.zeusservice.ro/casa-de-marcat-compact-s-01-494.html',
    keyFigures: [
      { value: '300 g', label: 'greutate' },
      { value: '2200 mAh', label: 'acumulator Li-Ion' },
      { value: 'XML', label: 'trimis automat la ANAF' },
    ],
  },
  {
    slug: 'daisy-compact-m',
    name: 'Daisy Compact M',
    model: 'Compact M 01',
    brand: 'Daisy',
    tagline: 'Taste mari pentru un ritm alert.',
    summary:
      'Casă de marcat fiscală cu jurnal electronic și acumulator Li-Ion de 2200 mAh, staționară sau mobilă, cu taste mari și afișaje generoase. Recomandată de producător pentru un punct de lucru fix cu intensitate mare a emiterii bonurilor. Avizată conform noii legislații (aviz nr. 42 din 24.08.2018).',
    bestFor: ['Punct de lucru fix', 'Volum mare de bonuri', 'Chioșcuri și magazine mici'],
    capabilities: ['acumulator', 'pc', 'bluetooth', 'gprs-anaf', 'imprimanta-fiscala'],
    highlights: [
      {
        title: 'Rolă de 30 m',
        text: 'Rolă de hârtie de 57 mm × 30 m și sistem EASY LOAD pentru schimbarea rapidă a rolei.',
      },
      {
        title: 'Modem GPRS integrat',
        text: 'Modemul de pe placa de bază asigură comunicația GPRS cu serverul ANAF, fără dispozitive suplimentare.',
      },
      {
        title: 'Taste mari, afișaje clare',
        text: '31 de taste, afișaj grafic operator 132 × 48 px și afișaj client 132 × 24 px.',
      },
      {
        title: 'Rapoarte la îndemână',
        text: 'Conectare la PC prin micro USB (aplicația Daisy Manager) și slot SD pentru exportul fișierelor XML lunare.',
      },
    ],
    specs: [
      common.plu,
      { label: 'Departamente', value: '95 + 4' },
      common.tva,
      common.operatori,
      { label: 'Alimentare', value: 'Adaptor 220 V c.a. – 5 V c.c. 2 A, micro USB' },
      { label: 'Acumulator', value: 'Li-Ion 3,7 V, 2200 mAh (inclus)' },
      { label: 'Tastatură', value: '31 de taste' },
      common.imprimanta,
      { label: 'Afișaje', value: 'Operator LCD grafic 132 × 48 px · Client LCD grafic 132 × 24 px' },
      { label: 'Porturi', value: 'Micro USB (PC) · slot SD pentru export XML' },
      common.plata,
      common.clienti,
      common.jurnal,
      common.memorie,
      common.crypto,
      { label: 'Bluetooth', value: 'Da, pentru conectarea la PC' },
      { label: 'Modem GSM/GPRS', value: 'Integrat, pentru comunicația cu serverul ANAF' },
      { label: 'Rolă hârtie', value: '57 mm × 30 m' },
      { label: 'Sertar de bani / cântar / cititor coduri', value: 'Nu' },
      { label: 'Temperatură de lucru', value: '0 °C … 45 °C, umiditate 10 – 90 %' },
      { label: 'Dimensiuni', value: '195 × 180 × 65 mm' },
      { label: 'Greutate', value: '475 g cu acumulator' },
    ],
    images: [
      { src: compactMCutout, alt: 'Casa de marcat Daisy Compact M neagră, cu taste mari și afișaj client', kind: 'cutout' },
      { src: compactMBack, alt: 'Daisy Compact M văzută din spate, cu afișajul pentru client și imprimanta', kind: 'photo' },
    ],
    manualUrl: 'https://www.zeusservice.ro/media/productattachment/0/87/CompactMRomaniaUserManual20180828TRADUCERE.pdf',
    sourceUrl: 'https://www.zeusservice.ro/casa-de-marcat-model-compact-m-01.html',
    keyFigures: [
      { value: '30 m', label: 'rolă de hârtie' },
      { value: '31', label: 'taste' },
      { value: 'GPRS', label: 'modem integrat' },
    ],
  },
  {
    slug: 'daisy-perfect-m',
    name: 'Daisy Perfect M',
    model: 'Perfect M 02',
    brand: 'Daisy',
    tagline: 'Centrul de comandă al tejghelei.',
    summary:
      'Casă de marcat destinată activităților cu volum mediu și mare de bonuri emise zilnic. Acceptă role de până la 35 m, deschide sertarul de bani și se conectează la cântar electronic și la cititor de coduri de bare. Tasta HELP explică informațiile afișate pe ecranul operatorului.',
    bestFor: ['Magazine cu volum mediu și mare', 'Puncte de lucru cu sertar de bani', 'Vânzare la gramaj', 'Produse cu cod de bare'],
    capabilities: ['acumulator', 'sertar-bani', 'cantar', 'cititor-coduri', 'pc', 'bluetooth', 'gprs-anaf', 'imprimanta-fiscala'],
    highlights: [
      {
        title: 'Sertar, cântar, cititor',
        text: 'Conector RJ45 pentru sertar de bani (6 V), port RS232 pentru cântar electronic sau cititor de coduri de bare.',
      },
      {
        title: 'Role de până la 35 m',
        text: 'Gândită pentru activitățile cu multe bonuri pe zi: schimbi rola mai rar.',
      },
      {
        title: 'Tasta HELP',
        text: 'Explică direct pe ecran informațiile afișate operatorului — util pentru casieri noi.',
      },
      {
        title: 'Afișaj client 128 × 128 px',
        text: 'Afișaj grafic generos pentru client și afișaj operator 132 × 64 px.',
      },
    ],
    specs: [
      common.plu,
      { label: 'Departamente', value: '95 + 4' },
      common.tva,
      common.operatori,
      { label: 'Alimentare', value: 'Adaptor 220 V c.a. – 7,5 V c.c. 3,5 A' },
      { label: 'Acumulator', value: 'NiMH 6 V, 1800 mAh (inclus)' },
      { label: 'Tastatură', value: '32 de taste, inclusiv tasta HELP' },
      common.imprimanta,
      { label: 'Afișaje', value: 'Operator LCD grafic 132 × 64 px · Client LCD grafic 128 × 128 px' },
      { label: 'Porturi', value: 'RS232 (cititor coduri de bare / cântar) · USB (PC) · slot SD pentru export XML' },
      { label: 'Sertar de bani', value: 'Da, conector RJ45 8 pini, tensiune de deschidere 6 V' },
      common.plata,
      common.clienti,
      common.jurnal,
      common.memorie,
      common.crypto,
      { label: 'Bluetooth', value: 'Activ, Bluetooth standard sau BLE' },
      { label: 'Modem GSM/GPRS', value: 'Integrat, pentru comunicația cu serverul ANAF' },
      { label: 'Rolă hârtie', value: '57 mm, până la 35 m' },
      { label: 'Temperatură de lucru', value: '0 °C … 45 °C, umiditate 10 – 90 %' },
      { label: 'Greutate', value: '870 g cu acumulator' },
    ],
    images: [
      { src: perfectMCutout, alt: 'Casa de marcat Daisy Perfect M neagră, cu bon fiscal ieșit din imprimantă', kind: 'cutout' },
      { src: perfectMTop, alt: 'Daisy Perfect M văzută de sus: imprimanta, afișajul și tastatura cu tasta HELP', kind: 'cutout' },
    ],
    manualUrl: 'https://www.zeusservice.ro/media/productattachment/0/92/PerfectMRomania20180803ROTraducereV115.pdf',
    sourceUrl: 'https://www.zeusservice.ro/casa-de-marcat-model-perfect-m-02-negru.html',
    keyFigures: [
      { value: '35 m', label: 'rolă maximă' },
      { value: 'RJ45', label: 'sertar de bani' },
      { value: 'RS232', label: 'cântar / cititor' },
    ],
  },
  {
    slug: 'daisy-expert-sx',
    name: 'Daisy eXpert SX',
    model: 'eXpert SX',
    brand: 'Daisy',
    tagline: 'Fixă la tejghea, mobilă la nevoie.',
    summary:
      'Casă de marcat recomandată pentru un punct de lucru fix, care se pretează și pentru comerț ambulant: acumulator NiMH de 1800 mAh, încărcare din mașină cu adaptor opțional, port pentru cântar electronic și cititor de coduri de bare. Echipată cu toate dispozitivele necesare conectării la serverele ANAF.',
    bestFor: ['Punct de lucru fix', 'Comerț ambulant', 'Vânzare la gramaj', 'Produse cu cod de bare'],
    capabilities: ['portabil', 'acumulator', 'alimentare-auto', 'cantar', 'cititor-coduri', 'pc', 'bluetooth', 'gprs-anaf', 'imprimanta-fiscala'],
    highlights: [
      {
        title: 'Cântar și cititor de coduri',
        text: 'Port RS232 pentru cântar electronic sau cititor de coduri de bare, USB pentru PC.',
      },
      {
        title: 'Acumulator inclus',
        text: 'NiMH 6 V, 1800 mAh, cu încărcare de la bricheta mașinii prin adaptor opțional.',
      },
      {
        title: 'Modem GSM/GPRS activ',
        text: 'Integrat pe placa de bază, cu card SIM, pentru versiunile vândute după 1 februarie 2021.',
      },
      {
        title: 'Logo pe bon',
        text: 'Imprimă logo grafic pe bon, de până la 344 × 144 px.',
      },
    ],
    specs: [
      common.plu,
      { label: 'Departamente', value: '96 + 3' },
      common.tva,
      common.operatori,
      { label: 'Alimentare', value: 'Adaptor 220 V c.a. – 7,5 V c.c. 3,5 A' },
      { label: 'Acumulator', value: 'NiMH 6 V, 1800 mAh (inclus)' },
      { label: 'Tastatură', value: '29 de taste' },
      common.imprimanta,
      { label: 'Afișaje', value: 'Operator LCD grafic 132 × 48 px · Client LCD grafic 132 × 24 px' },
      { label: 'Porturi', value: 'RS232 (cititor coduri de bare / cântar) · USB (PC) · slot SD pentru export XML' },
      { label: 'Sertar de bani', value: 'Nu' },
      common.plata,
      common.clienti,
      common.jurnal,
      common.memorie,
      common.crypto,
      { label: 'Bluetooth', value: 'Activ, Bluetooth standard sau BLE' },
      { label: 'Modem GSM/GPRS', value: 'Integrat, cu card SIM (versiunile vândute după 01.02.2021)' },
      { label: 'Rolă hârtie', value: '57 mm × 15 m' },
      { label: 'Temperatură de lucru', value: '0 °C … 45 °C, umiditate 10 – 90 %' },
      { label: 'Dimensiuni', value: '225 × 109 × 70 mm' },
      { label: 'Greutate', value: '550 g cu acumulator' },
    ],
    images: [
      { src: expertSxFront, alt: 'Daisy eXpert SX văzută din față, cu tastatura și afișajul operatorului', kind: 'photo' },
      { src: expertSx, alt: 'Casa de marcat Daisy eXpert SX albă cu negru, afișajul indicând 326.70', kind: 'photo' },
      { src: expertSxTop, alt: 'Daisy eXpert SX văzută de sus, cu imprimanta termică', kind: 'photo' },
    ],
    manualUrl: 'https://www.zeusservice.ro/media/productattachment/0/85/USERManualROexpertSXRomania.pdf',
    sourceUrl: 'https://www.zeusservice.ro/casa-de-marcat-expert-sx-02-model-expert-sx.html',
    keyFigures: [
      { value: '550 g', label: 'cu acumulator' },
      { value: 'RS232', label: 'cântar / cititor' },
      { value: '1800 mAh', label: 'acumulator NiMH' },
    ],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
