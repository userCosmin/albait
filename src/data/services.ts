// Services ALBA IT has published on its own website (albait.ro, 2021–2024
// archives) and that match its registered activity (CAEN 9510). Wording is
// rewritten, scope is not extended. Items listed under "De confirmat" in
// docs/research-and-design.md need the owner's confirmation before launch.

export interface Service {
  slug: string;
  title: string;
  short: string;
  intro: string;
  points: string[];
  /** legacy albait.ro URLs that now redirect here */
  legacy: string[];
}

export const services: Service[] = [
  {
    slug: 'service-case-de-marcat',
    title: 'Service case de marcat',
    short: 'Asistență pentru casele de marcat Daisy și Incotex pe care le vindem.',
    intro:
      'ALBA IT vinde case de marcat Daisy și Incotex și oferă, alături de ele, service și mentenanță. Vă ajutăm cu punerea în funcțiune, cu întrebările despre rapoarte și cu intervențiile de care aveți nevoie pe durata utilizării.',
    points: [
      'Consultanță pentru alegerea modelului potrivit activității',
      'Explicarea pașilor pentru obținerea seriei fiscale și fiscalizare',
      'Instruire pentru emiterea bonurilor și a rapoartelor X și Z',
      'Service și mentenanță pentru modelele distribuite',
      'Role de hârtie termică și accesorii, la cerere',
    ],
    legacy: [],
  },
  {
    slug: 'mentenanta-it',
    title: 'Mentenanță IT',
    short: 'Vizite periodice, prevenție și intervenții pentru echipamentele firmei.',
    intro:
      'Mentenanța IT înseamnă verificarea periodică a calculatoarelor, serverelor și rețelei, ca să prevenim defecțiunile înainte să vă oprească activitatea. Stabilim împreună un plan de revizii potrivit firmei dumneavoastră și intervenim când ne semnalați o problemă.',
    points: [
      'Analiza echipamentelor de lucru și a rețelei',
      'Vizite periodice la sediul firmei, după un plan de revizii agreat',
      'Diagnosticarea și remedierea defecțiunilor hardware',
      'Instalarea componentelor noi și verificarea compatibilității',
      'Instalarea și testarea echipamentelor periferice',
      'Curățarea internă a calculatoarelor și actualizarea BIOS',
    ],
    legacy: ['/mentenanta-it/'],
  },
  {
    slug: 'service-hardware',
    title: 'Service hardware',
    short: 'Diagnoză și reparații pentru calculatoare și periferice.',
    intro:
      'Oferim asistență tehnică hardware și software pentru calculatoare și echipamente periferice. Sesizările se preiau telefonic sau pe e-mail, iar tehnicianul pleacă spre dumneavoastră pregătit pentru problema semnalată.',
    points: [
      'Diagnosticarea defecțiunilor hardware și software',
      'Înlocuirea și instalarea componentelor',
      'Intervenții la sediul clientului',
      'Configurarea echipamentelor periferice',
    ],
    legacy: ['/service-hardware/', '/service-hardware-it/'],
  },
  {
    slug: 'configurare-servere',
    title: 'Configurare servere și rețele',
    short: 'Servere Linux, firewall, VPN, e-mail și backup pentru firme.',
    intro:
      'Un server propriu înseamnă control asupra datelor firmei și servicii configurate exact pentru nevoile dumneavoastră. Instalăm și configurăm în principal servere Linux, de la sistemul de bază până la serviciile de rețea.',
    points: [
      'Instalarea sistemului de operare Linux și administrare la distanță prin SSH',
      'Firewall, rutare și controlul accesului',
      'Server web, server de e-mail cu antispam și antivirus',
      'Server de fișiere, DNS, FTP și proxy cu filtrare web',
      'VPN pentru accesul securizat la rețeaua firmei',
      'Scripturi de backup automat și comutare între conexiuni de internet',
    ],
    legacy: ['/configurare-servere/'],
  },
  {
    slug: 'audit-securitate-it',
    title: 'Audit de securitate IT',
    short: 'Evaluarea infrastructurii: rețea, servere, echipamente și angajați.',
    intro:
      'Auditul de securitate verifică infrastructura IT a firmei — arhitectura rețelei, firewall-ul, serverele, routerele, switch-urile și stațiile de lucru — și arată unde sunteți vulnerabil, înainte să o afle altcineva.',
    points: [
      'Auditarea serverelor, routerelor și switch-urilor',
      'Teste de penetrare din internet și din rețeaua internă',
      'Audit periodic al echipamentelor vulnerabile',
      'Evaluarea dispozitivelor personale folosite în firmă (BYOD)',
      'Analiză de social engineering, la cerere, cu măsuri de prevenție pentru angajați',
    ],
    legacy: ['/audit/'],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
