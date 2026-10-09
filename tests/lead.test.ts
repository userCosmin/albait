import { describe, expect, it } from 'vitest';
import { MIN_FILL_MS, normalizePhone, validateLead } from '../src/lib/lead';

const now = 1_800_000_000_000;
const base = {
  name: 'Ion Popescu',
  phone: '0758 343 653',
  interest: 'Daisy Compact S',
  consent: true,
  website: '',
  t: now - 10_000,
};

describe('normalizePhone', () => {
  it.each([
    ['0758 343 653', '0758343653'],
    ['+40 758 343 653', '0758343653'],
    ['0040758343653', '0758343653'],
    ['0258-818-095', '0258818095'],
    ['+49 30 1234567', '+49301234567'],
  ])('%s → %s', (input, out) => expect(normalizePhone(input)).toBe(out));

  it.each(['123', '0858343653', 'telefon', '07583436531'])('rejects %s', (input) => {
    expect(normalizePhone(input)).toBeNull();
  });
});

describe('validateLead', () => {
  it('accepts a complete request and normalises fields', () => {
    const r = validateLead({ ...base, email: '  Ion@Firma.RO ', company: '  Firma   SRL ' }, now);
    expect(r).toEqual({
      ok: true,
      lead: {
        name: 'Ion Popescu',
        company: 'Firma SRL',
        phone: '0758343653',
        email: 'ion@firma.ro',
        interest: 'Daisy Compact S',
        message: null,
      },
    });
  });

  it('accepts e-mail without phone', () => {
    const r = validateLead({ ...base, phone: '', email: 'a@b.ro' }, now);
    expect(r.ok).toBe(true);
  });

  it('requires a way to reply', () => {
    const r = validateLead({ ...base, phone: '', email: '' }, now);
    expect(r).toMatchObject({ ok: false, errors: { contact: expect.any(String) } });
  });

  it('reports each invalid field', () => {
    const r = validateLead({ ...base, name: 'I', phone: '12', email: 'x@', interest: 'Altceva', consent: false }, now);
    expect(r.ok).toBe(false);
    if (!r.ok && 'errors' in r) {
      expect(Object.keys(r.errors).sort()).toEqual(['consent', 'email', 'interest', 'name', 'phone']);
    }
  });

  it('accepts the consent value sent by a plain HTML form', () => {
    expect(validateLead({ ...base, consent: 'on' }, now).ok).toBe(true);
  });

  it('flags the honeypot as spam', () => {
    expect(validateLead({ ...base, website: 'http://spam.example' }, now)).toEqual({ ok: false, spam: true });
  });

  it('flags forms submitted faster than a human could', () => {
    expect(validateLead({ ...base, t: now - (MIN_FILL_MS - 1) }, now)).toEqual({ ok: false, spam: true });
    expect(validateLead({ ...base, t: 'abc' }, now)).toEqual({ ok: false, spam: true });
  });

  it('caps long input', () => {
    const r = validateLead({ ...base, name: 'A'.repeat(500) }, now);
    expect(r.ok && r.lead.name.length).toBe(120);
  });
});
