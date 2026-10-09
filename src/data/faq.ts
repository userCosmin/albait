// FAQ entries. Legal statements cite their source and are worded as general
// information, not legal advice. Re-check `qr` after 1 November 2026.

export interface FaqItem {
  q: string;
  a: string;
  source?: { label: string; href: string };
}

type FaqKey = 'who' | 'models' | 'c801' | 'fiscalizare' | 'qr' | 'mobile' | 'periferice' | 'zona' | 'it';

export const faq: Record<FaqKey, FaqItem> = {
  who: {
    q: 'Ce face ALBA IT?',
    a: 'ALBA IT SRL este o firmă din Alba Iulia, înregistrată în 2014, care vinde case de marcat fiscale Daisy ca distribuitor în rețeaua Zeus Service și oferă service pentru acestea, plus servicii IT pentru firme: mentenanță, service hardware, configurare servere și audit de securitate.',
  },
  models: {
    q: 'Ce modele de case de marcat vindeți?',
    a: 'Patru modele Daisy, toate cu jurnal electronic și modem pentru comunicarea cu ANAF: Compact S (portabilă, pentru comerț ambulant și ridesharing), Compact M (punct fix cu volum mare de bonuri), Perfect M (sertar de bani, cântar și cititor de coduri de bare) și eXpert SX (punct fix sau ambulant, cu cântar și cititor de coduri).',
  },
  c801: {
    q: 'Cum obțin seria fiscală pentru casa de marcat?',
    a: 'După achiziție, firma care cumpără casa de marcat depune la ANAF formularul C801, online, prin Spațiul Privat Virtual (SPV), și primește numărul unic de identificare (NUI). Cu acest număr se face apoi fiscalizarea aparatului. Vă explicăm fiecare pas când alegeți modelul.',
    source: { label: 'ANAF — formularul 801', href: 'https://static.anaf.ro/static/10/Anaf/Declaratii_R/801.html' },
  },
  fiscalizare: {
    q: 'Ce înseamnă fiscalizarea?',
    a: 'Fiscalizarea este trecerea casei de marcat în modul de lucru fiscal: aparatul este programat cu datele firmei și cu seria fiscală, iar de atunci toate vânzările se înregistrează în memoria fiscală și în jurnalul electronic.',
  },
  qr: {
    q: 'Bonul fiscal trebuie să aibă cod QR?',
    a: 'Legislația prevede ca bonul fiscal să conțină un cod QR. Prin OUG nr. 68/2025, sancționarea emiterii bonurilor fără cod QR a fost suspendată până la 1 noiembrie 2026. Sunați-ne pentru a afla ce înseamnă acest termen pentru casa dumneavoastră de marcat.',
    source: { label: 'Datecs — informare privind OUG 68/2025', href: 'https://www.datecs.ro/' },
  },
  mobile: {
    q: 'Am nevoie de casă de marcat pentru ridesharing sau livrări. Ce model se potrivește?',
    a: 'Daisy Compact S este recomandată de producător pentru comerț ambulant și ridesharing: are acumulator Li-Ion de 2200 mAh, cântărește aproximativ 300 g, se încarcă prin micro USB, din mașină (adaptor opțional) sau de la un power bank și trimite automat rapoartele XML la ANAF.',
  },
  periferice: {
    q: 'Ce casă de marcat se conectează la sertar de bani, cântar sau cititor de coduri de bare?',
    a: 'Daisy Perfect M deschide sertarul de bani (conector RJ45) și se conectează prin RS232 la cântar electronic sau cititor de coduri de bare. Daisy eXpert SX se conectează la cântar și cititor de coduri, dar nu are ieșire pentru sertar de bani. Compact M nu are aceste conexiuni.',
  },
  zona: {
    q: 'Unde vă găsesc?',
    a: 'Ne găsiți în Alba Iulia, în Piața Iuliu Maniu nr. 20, de luni până vineri, între 09:00 și 16:00. Ne puteți suna la 0758 343 653.',
  },
  it: {
    q: 'Oferiți și servicii IT pentru firme?',
    a: 'Da. Pe lângă casele de marcat, ALBA IT oferă mentenanță IT pe bază de plan de revizii, service hardware, instalarea și configurarea serverelor Linux (firewall, VPN, e-mail, backup) și audit de securitate IT.',
  },
};

export const homeFaq: FaqItem[] = [faq.who, faq.models, faq.mobile, faq.periferice, faq.c801, faq.qr, faq.zona];
export const registerFaq: FaqItem[] = [faq.models, faq.c801, faq.fiscalizare, faq.qr, faq.mobile, faq.periferice];
export const serviceFaq: FaqItem[] = [faq.it, faq.zona];
