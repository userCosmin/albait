import { useEffect, useId, useRef, useState, type SyntheticEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, CheckCircle2, Loader2, Phone } from 'lucide-react';
import { interestOptions, validateLead, type LeadErrors } from '@/lib/lead';

interface Props {
  phone: { display: string; href: string };
  /** dark: on ink background; light: on paper */
  tone?: 'dark' | 'light';
}

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'limited';

const ease = [0.16, 1, 0.3, 1] as const;

export default function LeadForm({ phone, tone = 'dark' }: Props) {
  const reduce = useReducedMotion();
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<LeadErrors>({});
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [interest, setInterest] = useState('');

  useEffect(() => {
    setStartedAt(Date.now());
    const params = new URLSearchParams(window.location.search);
    const pre = params.get('interes');
    if (pre && (interestOptions as readonly string[]).includes(pre)) setInterest(pre);
    if (params.get('trimis') === 'eroare') setStatus('error');
  }, []);

  const id = (name: string) => `${uid}-${name}`;
  const err = (key: keyof LeadErrors) =>
    errors[key] ? (
      <p id={id(`${key}-err`)} className="field-error" role="alert">
        {errors[key]}
      </p>
    ) : null;

  async function onSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: fd.get('name'),
      company: fd.get('company'),
      phone: fd.get('phone'),
      email: fd.get('email'),
      interest: fd.get('interest'),
      message: fd.get('message'),
      consent: fd.get('consent') === 'on',
      website: fd.get('website'),
      t: startedAt,
      page: window.location.pathname,
    };

    // Client-side check for instant feedback; the server re-validates.
    const check = validateLead({ ...payload, t: Math.min(startedAt, Date.now() - 60_000) });
    if (!check.ok && 'errors' in check) {
      setErrors(check.errors);
      const first = Object.keys(check.errors)[0];
      const target = form.querySelector<HTMLElement>(`[data-field="${first}"]`);
      target?.focus();
      return;
    }
    setErrors({});
    setStatus('sending');
    try {
      const res = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: LeadErrors };
      if (res.ok && data.ok) {
        setStatus('sent');
        form.reset();
        setInterest('');
        return;
      }
      if (res.status === 422 && data.errors) {
        setErrors(data.errors);
        setStatus('idle');
        return;
      }
      setStatus(res.status === 429 ? 'limited' : 'error');
    } catch {
      setStatus('error');
    }
  }

  const dark = tone === 'dark';
  const label = `field-label ${dark ? 'text-ink-100' : ''}`;
  const hint = dark ? 'text-ink-400' : 'text-muted';

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {status === 'sent' ? (
          <motion.div
            key="sent"
            role="status"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease }}
            className={`rounded-[var(--radius-card)] p-8 sm:p-10 ${dark ? 'bg-white/[0.06] text-ink-100' : 'bg-white'}`}
          >
            <CheckCircle2 size={40} className="text-brand-400" aria-hidden="true" />
            <h3 className="mt-6 text-2xl font-semibold tracking-[-0.02em]">Am primit solicitarea. Mulțumim!</h3>
            <p className={`mt-3 max-w-md ${hint}`}>
              Vă contactăm în programul de lucru, la numărul sau adresa de e-mail lăsate. Dacă e urgent, sunați-ne direct.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={phone.href} className={`btn ${dark ? 'btn-light' : 'btn-primary'} tabular-nums`}>
                <Phone size={18} aria-hidden="true" /> {phone.display}
              </a>
              <button type="button" className={`btn ${dark ? 'btn-ghost-dark' : 'btn-ghost'}`} onClick={() => setStatus('idle')}>
                Trimite altă solicitare
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            action="/api/contact/"
            method="post"
            noValidate
            onSubmit={onSubmit}
            initial={false}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="grid gap-5 sm:grid-cols-2"
            aria-describedby={id('intro')}
          >
            <p id={id('intro')} className={`text-sm sm:col-span-2 ${hint}`}>
              Câmpurile marcate cu * sunt obligatorii. Lăsați un telefon sau un e-mail.
            </p>

            <div>
              <label htmlFor={id('name')} className={label}>
                Nume și prenume *
              </label>
              <input
                id={id('name')}
                name="name"
                data-field="name"
                autoComplete="name"
                required
                className="field"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? id('name-err') : undefined}
              />
              {err('name')}
            </div>

            <div>
              <label htmlFor={id('company')} className={label}>
                Firmă <span className={`font-normal ${hint}`}>(opțional)</span>
              </label>
              <input id={id('company')} name="company" autoComplete="organization" className="field" />
            </div>

            <div>
              <label htmlFor={id('phone')} className={label}>
                Telefon
              </label>
              <input
                id={id('phone')}
                name="phone"
                type="tel"
                inputMode="tel"
                data-field="phone"
                autoComplete="tel"
                placeholder="07xx xxx xxx"
                className="field"
                aria-invalid={!!(errors.phone || errors.contact)}
                aria-describedby={errors.phone ? id('phone-err') : errors.contact ? id('contact-err') : undefined}
              />
              {err('phone')}
            </div>

            <div>
              <label htmlFor={id('email')} className={label}>
                E-mail
              </label>
              <input
                id={id('email')}
                name="email"
                type="email"
                inputMode="email"
                data-field="email"
                autoComplete="email"
                placeholder="nume@firma.ro"
                className="field"
                aria-invalid={!!(errors.email || errors.contact)}
                aria-describedby={errors.email ? id('email-err') : undefined}
              />
              {err('email')}
            </div>
            {errors.contact && (
              <p id={id('contact-err')} data-field="contact" tabIndex={-1} className="field-error -mt-2 sm:col-span-2" role="alert">
                {errors.contact}
              </p>
            )}

            <div className="sm:col-span-2">
              <label htmlFor={id('interest')} className={label}>
                Ce vă interesează? *
              </label>
              <select
                id={id('interest')}
                name="interest"
                data-field="interest"
                required
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="field appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22none%22 stroke=%22%235b6470%22 stroke-width=%222%22><path d=%22m4 6 4 4 4-4%22/></svg>')] bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10"
                aria-invalid={!!errors.interest}
                aria-describedby={errors.interest ? id('interest-err') : undefined}
              >
                <option value="" disabled>
                  Alegeți o opțiune
                </option>
                {interestOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              {err('interest')}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor={id('message')} className={label}>
                Mesaj <span className={`font-normal ${hint}`}>(opțional)</span>
              </label>
              <textarea
                id={id('message')}
                name="message"
                rows={4}
                maxLength={1990}
                placeholder="De exemplu: am un magazin alimentar și vând și la cântar."
                className="field resize-y"
              />
            </div>

            {/* Honeypot — hidden from people and assistive tech. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor={id('website')}>Website</label>
              <input id={id('website')} name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <input type="hidden" name="t" value={startedAt} />

            <div className="sm:col-span-2">
              <label className={`flex items-start gap-3 text-[0.92rem] leading-relaxed ${dark ? 'text-ink-300' : 'text-muted'}`}>
                <input
                  type="checkbox"
                  name="consent"
                  data-field="consent"
                  required
                  className="mt-1 size-5 shrink-0 accent-[var(--color-brand-600)]"
                  aria-invalid={!!errors.consent}
                  aria-describedby={errors.consent ? id('consent-err') : undefined}
                />
                <span>
                  Sunt de acord ca ALBA IT să folosească aceste date pentru a-mi răspunde la solicitare, conform{' '}
                  <a href="/politica-de-confidentialitate/" className="underline underline-offset-4">
                    politicii de confidențialitate
                  </a>
                  . *
                </span>
              </label>
              {err('consent')}
            </div>

            <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center">
              <button type="submit" disabled={status === 'sending'} className={`btn ${dark ? 'btn-light' : 'btn-primary'} min-w-[14rem]`}>
                {status === 'sending' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" aria-hidden="true" /> Se trimite…
                  </>
                ) : (
                  <>
                    Trimite solicitarea <ArrowUpRight size={18} className="btn-icon" aria-hidden="true" />
                  </>
                )}
              </button>
              <div aria-live="assertive" className="text-[0.92rem]">
                {status === 'error' && (
                  <p className={dark ? 'text-[#ff9b87]' : 'text-danger'}>
                    Solicitarea nu a putut fi trimisă. Încercați din nou sau sunați-ne la{' '}
                    <a href={phone.href} className="font-semibold underline">
                      {phone.display}
                    </a>
                    .
                  </p>
                )}
                {status === 'limited' && (
                  <p className={dark ? 'text-[#ff9b87]' : 'text-danger'}>
                    Am primit deja mai multe solicitări de la dumneavoastră. Pentru ceva urgent, sunați la {phone.display}.
                  </p>
                )}
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
