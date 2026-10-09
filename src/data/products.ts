// The cash registers ALBA IT sells: the four models listed by the owner on
// albait-website.pages.dev/case-de-marcat. Specs are copied from the Romanian
// importers' product pages and official user manuals linked on each product
// (Zeus Service for Daisy, Milo Trading 2000 for Incotex) — no values are
// inferred. Prices are intentionally absent: no public price list confirmed.
import type { ImageMetadata } from 'astro';

import compactSCutout from '@/assets/products/compact-s-cutout.png';
import compactSAngle from '@/assets/products/compact-s-angle-cutout.png';
import compactSCar from '@/assets/products/compact-s-car-mounted.jpg';
import compactSHand from '@/assets/products/compact-s-car-hand.jpg';
import succesM7 from '@/assets/products/succes-m7-cutout.webp';
import succesM4 from '@/assets/products/succes-m4-cutout.webp';
import expertSx from '@/assets/products/expert-sx.jpg';
import expertSxCutout from '@/assets/products/expert-sx-02-cutout.webp';
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
  | 'imprimanta-fiscala'
  | 'ethernet'
  | 'wifi';

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
  ethernet: 'Ethernet',
  wifi: 'Wi-Fi',
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
  brand: 'Daisy' | 'Incotex';
  /** importer whose product page/manual the specs come from */
  sourceLabel: string;
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
    slug: 'incotex-succes-m7',
    name: 'Incotex Succes M7',
    model: 'Succes M7',
    brand: 'Incotex',
    sourceLabel: 'Milo Trading 2000',
    tagline: 'Tejgheaua completă, cu toate porturile.',
    summary:
      'Casă de marcat electronică fiscală cu jurnal electronic și export de fișiere XML semnate pentru raportările ANAF. Staționară, destinată comerțului și prestărilor de servicii, dar poate lucra și portabil datorită acumulatorului intern. Se conectează la calculator, cântar, scanner, sertar de bani și rețea prin USB, serial, Ethernet și port dedicat de sertar.',
    bestFor: ['Magazine alimentare și nealimentare', 'Vânzare la gramaj', 'Produse cu cod de bare', 'Cafenele, restaurante, prestări servicii'],
    capabilities: ['acumulator', 'sertar-bani', 'cantar', 'cititor-coduri', 'pc', 'ethernet', 'imprimanta-fiscala'],
    highlights: [
      {
        title: 'Porturi pentru tot ce e pe tejghea',
        text: 'Două porturi seriale (RJ-11) pentru PC, scanner, cântar sau afișaj extern, port dedicat de sertar (RJ-14), USB, PS/2 pentru tastatură externă și Ethernet.',
      },
      {
        title: 'Lucrează și fără priză',
        text: 'Acumulator intern de 7,4 V / 1800 mAh: până la 60 de ore în standby sau 40.000 de linii tipărite.',
      },
      {
        title: '38 de taste, 8 cote TVA',
        text: 'Tastatură cu 12 taste numerice și 26 de funcții, până la 32.190 de articole, 100 de grupe și 10 casieri cu drepturi programabile.',
      },
      {
        title: 'Imprimantă termică rapidă',
        text: 'Imprimantă termică Seiko de 75 mm/s, hârtie de 57 mm, 38 de caractere pe linie și încărcare EasyLoad a rolei.',
      },
    ],
    specs: [
      { label: 'Tip', value: 'Casă de marcat staționară, cu funcționare portabilă' },
      { label: 'Articole (PLU)', value: '23.980 – 32.190, în funcție de setări (cod de bare, stoc); denumire de 38 de caractere' },
      { label: 'Grupe', value: '100' },
      { label: 'Cote TVA', value: '8 (6 programabile)' },
      { label: 'Operatori', value: '10, cu drepturi programabile' },
      { label: 'Metode de plată', value: '10 (2 programabile)' },
      { label: 'Clienți programabili', value: '200 (CUI/CIF, denumire, adresă pe bon)' },
      { label: 'Tastatură', value: '38 de taste (12 numerice, 26 funcții)' },
      { label: 'Afișaje', value: 'Operator și client LCD grafic 128 × 32 px, iluminate' },
      { label: 'Imprimantă', value: 'Termică Seiko LTP01-245-12, 75 mm/s, 38 caractere pe linie' },
      { label: 'Rolă hârtie', value: '57 mm, încărcare EasyLoad' },
      { label: 'Porturi', value: 'USB (PC) · USB host (export XML) · 2 × serial RJ-11 (PC, scanner, cântar, afișaj) · sertar RJ-14 · PS/2 · Ethernet' },
      { label: 'Sertar de bani', value: 'Da, port dedicat RJ-14' },
      { label: 'Jurnal electronic', value: 'Card microSD 8 GB' },
      { label: 'Memorie fiscală', value: '1.830 rapoarte zilnice' },
      { label: 'Modul criptografic', value: 'TPM SLB 97601.2 (Infineon), Common Criteria EAL 4' },
      { label: 'Procesor', value: 'STM32F103VCT, 32 biți' },
      { label: 'Raportare ANAF', value: 'Export XML semnat; Ethernet pentru transferul fișierelor .xml' },
      { label: 'Mod de lucru', value: 'Offline și imprimantă fiscală' },
      { label: 'Logo pe bon', value: '384 × 144 px' },
      { label: 'Acumulator', value: 'Li-Ion 7,4 V, 1800 mAh (max. 60 h standby sau 40.000 linii)' },
      { label: 'Alimentare', value: 'Alimentator extern 100–240 V c.a. / 9 V' },
      { label: 'Temperatură de lucru', value: '−10 °C … +45 °C, umiditate 20 – 80 %' },
      { label: 'Dimensiuni', value: '223 × 196 × 80 mm' },
      { label: 'Greutate', value: '950 g' },
    ],
    images: [{ src: succesM7, alt: 'Casa de marcat Incotex Succes M7 neagră, cu tastatură mare și imprimantă termică', kind: 'cutout' }],
    manualUrl: 'https://milo-trading.ro/wp-content/uploads/2018/05/Manual-Utilizare-SUCCES-M7-2018.pdf',
    sourceUrl: 'https://milo-trading.ro/incotex-succes-m7/',
    keyFigures: [
      { value: '38', label: 'taste' },
      { value: 'RJ-14', label: 'sertar de bani' },
      { value: 'ETH', label: 'Ethernet' },
    ],
  },
  {
    slug: 'incotex-succes-m4',
    name: 'Incotex Succes M4',
    model: 'Succes M4',
    brand: 'Incotex',
    sourceLabel: 'Milo Trading 2000',
    tagline: 'Compactă, cu afișaj mare pentru operator.',
    summary:
      'Casă de marcat fiscală cu jurnal electronic pe card microSD și export de fișiere XML semnate pentru ANAF. Staționară, pentru comerț și prestări servicii, cu acumulator intern pentru lucru portabil. Afișaj operator 128 × 64 px, Wi-Fi pentru conectarea la PC și două porturi seriale pentru sertar, cântar, scanner sau POS bancar.',
    bestFor: ['Magazine mici', 'Prestări servicii', 'Puncte de lucru cu POS bancar', 'Vânzare la gramaj'],
    capabilities: ['acumulator', 'sertar-bani', 'cantar', 'cititor-coduri', 'pc', 'wifi', 'imprimanta-fiscala'],
    highlights: [
      {
        title: 'Afișaj operator mai mare',
        text: 'Afișaj grafic iluminat de 128 × 64 px pentru operator și 128 × 32 px pentru client.',
      },
      {
        title: 'Două porturi seriale, multe periferice',
        text: 'Porturile RJ-45 acceptă PC, scanner, sertar de bani, cântar, afișaj extern sau POS bancar Verifone.',
      },
      {
        title: 'Wi-Fi pentru rapoarte',
        text: 'Conexiune Wi-Fi pentru legătura cu PC-ul și extragerea fișierelor XML; Ethernet opțional.',
      },
      {
        title: 'Factură simplă',
        text: 'Emite factură simplificată, cu CUI, denumire și adresa clientului.',
      },
    ],
    specs: [
      { label: 'Tip', value: 'Casă de marcat staționară, cu funcționare portabilă' },
      { label: 'Articole (PLU)', value: '23.980 – 32.190, în funcție de setări (cod de bare, stoc); denumire de 38 de caractere' },
      { label: 'Grupe', value: '100' },
      { label: 'Cote TVA', value: '8 (6 programabile)' },
      { label: 'Operatori', value: '10, cu drepturi programabile' },
      { label: 'Metode de plată', value: '10 (2 programabile)' },
      { label: 'Clienți programabili', value: '200 (CUI/CIF, denumire, adresă)' },
      { label: 'Tastatură', value: '30 de taste (12 numerice, 18 funcții)' },
      { label: 'Afișaje', value: 'Operator LCD grafic 128 × 64 px · Client LCD grafic 128 × 32 px, iluminate' },
      { label: 'Imprimantă', value: 'Termică LTP01-245-12, 75 mm/s, 38 caractere pe linie' },
      { label: 'Rolă hârtie', value: '57 mm, încărcare EasyLoad' },
      { label: 'Porturi', value: 'USB (PC) · USB host (export XML) · 2 × serial RJ-45 (PC, scanner, sertar, cântar, afișaj, POS Verifone) · Wi-Fi · Ethernet opțional' },
      { label: 'Sertar de bani', value: 'Da, prin port serial RJ-45' },
      { label: 'Jurnal electronic', value: 'Card microSD 8 GB' },
      { label: 'Memorie fiscală', value: '1.830 rapoarte zilnice' },
      { label: 'Modul criptografic', value: 'TPM SLB 97601.2 (Infineon), Common Criteria EAL 4' },
      { label: 'Procesor', value: 'STM32F103VCT, 32 biți' },
      { label: 'Raportare ANAF', value: 'Export XML semnat' },
      { label: 'Mod de lucru', value: 'Offline și imprimantă fiscală' },
      { label: 'Acumulator', value: 'Li-Ion 7,4 V, 1800 mAh (conform manualului)' },
      { label: 'Alimentare', value: 'Alimentator extern 100–240 V c.a. / 9 V' },
      { label: 'Temperatură de lucru', value: '−10 °C … +45 °C, umiditate 20 – 80 %' },
      { label: 'Dimensiuni', value: '240 × 111 × 82 mm' },
      { label: 'Greutate', value: '700 g' },
    ],
    images: [{ src: succesM4, alt: 'Casa de marcat Incotex Succes M4 roșu cu negru, cu afișaj albastru și rolă de hârtie', kind: 'cutout' }],
    manualUrl: 'https://milo-trading.ro/wp-content/uploads/2020/07/Manual-Utilizare-INCOTEX-777-2019_09.pdf',
    sourceUrl: 'https://milo-trading.ro/incotex-succes-m4-casa-de-marcat-cu-jurnal-electronic/',
    keyFigures: [
      { value: '700 g', label: 'greutate' },
      { value: 'Wi-Fi', label: 'conectare PC' },
      { value: '128×64', label: 'afișaj operator' },
    ],
  },
  {
    slug: 'daisy-compact-s',
    name: 'Daisy Compact S',
    model: 'Compact S 01',
    brand: 'Daisy',
    sourceLabel: 'Zeus Service',
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
    slug: 'daisy-expert-sx',
    name: 'Daisy eXpert SX-02',
    model: 'eXpert SX 02',
    brand: 'Daisy',
    sourceLabel: 'Zeus Service',
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
      { src: expertSxCutout, alt: 'Casa de marcat Daisy eXpert SX-02 albă cu negru, afișajul indicând 326.70', kind: 'cutout' },
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
