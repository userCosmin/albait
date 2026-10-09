// Shared validation for the offer/contact form: used by the React form for
// instant feedback and by the API route as the source of truth.

export const interestOptions = [
  'Incotex Succes M7',
  'Incotex Succes M4',
  'Daisy Compact S',
  'Daisy eXpert SX-02',
  'Nu știu încă — vreau o recomandare',
  'Service case de marcat',
  'Servicii IT pentru firmă',
] as const;

export type Interest = (typeof interestOptions)[number];

export interface LeadInput {
  name?: unknown;
  company?: unknown;
  phone?: unknown;
  email?: unknown;
  interest?: unknown;
  message?: unknown;
  consent?: unknown;
  /** honeypot: real visitors never fill it */
  website?: unknown;
  /** ms timestamp when the form was rendered */
  t?: unknown;
}

export interface Lead {
  name: string;
  company: string | null;
  phone: string | null;
  email: string | null;
  interest: Interest;
  message: string | null;
}

export type LeadErrors = Partial<Record<'name' | 'contact' | 'phone' | 'email' | 'interest' | 'message' | 'consent', string>>;

export type LeadResult =
  | { ok: true; lead: Lead }
  | { ok: false; errors: LeadErrors }
  | { ok: false; spam: true };

/** Minimum time a human needs to fill in the form. */
export const MIN_FILL_MS = 2500;

const str = (v: unknown, max: number) =>
  typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : '';

const longStr = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Romanian numbers: 07xx xxx xxx, +40 / 0040 prefixes, landlines 02x/03x. */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[\s().-]/g, '');
  let d = digits;
  if (d.startsWith('+40')) d = '0' + d.slice(3);
  else if (d.startsWith('0040')) d = '0' + d.slice(4);
  if (/^0[237]\d{8}$/.test(d)) return d;
  // Accept other international numbers in E.164 form.
  if (/^\+\d{8,15}$/.test(digits)) return digits;
  return null;
}

export function validateLead(input: LeadInput, now = Date.now()): LeadResult {
  if (str(input.website, 200) !== '') return { ok: false, spam: true };
  const t = Number(input.t);
  if (!Number.isFinite(t) || now - t < MIN_FILL_MS) return { ok: false, spam: true };

  const errors: LeadErrors = {};
  const name = str(input.name, 120);
  const company = str(input.company, 160);
  const phoneRaw = str(input.phone, 40);
  const email = str(input.email, 200).toLowerCase();
  const interest = str(input.interest, 80);
  const message = longStr(input.message, 2000);
  const consent = input.consent === true || input.consent === 'on' || input.consent === 'true';

  if (name.length < 2) errors.name = 'Spuneți-ne cum vă numiți.';

  let phone: string | null = null;
  if (phoneRaw) {
    phone = normalizePhone(phoneRaw);
    if (!phone) errors.phone = 'Numărul de telefon nu pare corect (ex. 0758 343 653).';
  }
  if (email && !EMAIL_RE.test(email)) errors.email = 'Adresa de e-mail nu pare corectă.';
  if (!phoneRaw && !email) errors.contact = 'Lăsați un număr de telefon sau o adresă de e-mail, ca să vă putem răspunde.';

  if (!(interestOptions as readonly string[]).includes(interest)) errors.interest = 'Alegeți produsul sau serviciul care vă interesează.';
  if (message.length > 1990) errors.message = 'Mesajul este prea lung.';
  if (!consent) errors.consent = 'Avem nevoie de acordul dumneavoastră pentru a vă contacta.';

  if (Object.keys(errors).length) return { ok: false, errors };

  return {
    ok: true,
    lead: {
      name,
      company: company || null,
      phone,
      email: email || null,
      interest: interest as Interest,
      message: message || null,
    },
  };
}
