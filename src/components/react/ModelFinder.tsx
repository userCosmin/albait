import { useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Check, Minus } from 'lucide-react';

export type Need = 'mobil' | 'sertar' | 'cantar' | 'coduri' | 'volum';

export interface FinderModel {
  slug: string;
  name: string;
  tagline: string;
  capabilities: string[];
  /** manufacturer recommends it for high receipt volume */
  volume: boolean;
  keyFigures: { value: string; label: string }[];
  image: { src: string; srcSet: string; width: number; height: number; alt: string; kind: 'cutout' | 'photo' };
}

const needs: { id: Need; label: string; hint: string; test: (m: FinderModel) => boolean; missing: string }[] = [
  {
    id: 'mobil',
    label: 'Lucrez pe drum',
    hint: 'ambulant, livrări, ridesharing',
    test: (m) => m.capabilities.includes('portabil'),
    missing: 'nu e gândită pentru lucru mobil',
  },
  {
    id: 'sertar',
    label: 'Am sertar de bani',
    hint: 'deschidere automată',
    test: (m) => m.capabilities.includes('sertar-bani'),
    missing: 'nu deschide sertarul de bani',
  },
  {
    id: 'cantar',
    label: 'Vând la cântar',
    hint: 'cântar electronic',
    test: (m) => m.capabilities.includes('cantar'),
    missing: 'nu se conectează la cântar',
  },
  {
    id: 'coduri',
    label: 'Scanez coduri de bare',
    hint: 'cititor coduri',
    test: (m) => m.capabilities.includes('cititor-coduri'),
    missing: 'nu se conectează la cititor de coduri',
  },
  {
    id: 'volum',
    label: 'Emit multe bonuri',
    hint: 'volum mare zilnic',
    test: (m) => m.volume,
    missing: 'nu e recomandată pentru volum mare',
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function ModelFinder({ models }: { models: FinderModel[] }) {
  const [selected, setSelected] = useState<Need[]>([]);
  const reduce = useReducedMotion();

  const ranked = useMemo(() => {
    const active = needs.filter((n) => selected.includes(n.id));
    return models
      .map((m, index) => {
        const misses = active.filter((n) => !n.test(m));
        return { m, index, misses, score: active.length - misses.length };
      })
      .sort((a, b) => b.score - a.score || a.index - b.index);
  }, [models, selected]);

  const best = selected.length ? ranked.filter((r) => r.misses.length === 0) : [];
  const toggle = (id: Need) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div>
      <fieldset>
        <legend className="eyebrow text-muted">Bifați ce se potrivește activității dumneavoastră</legend>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {needs.map((n) => {
            const on = selected.includes(n.id);
            return (
              <button
                key={n.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(n.id)}
                className={`group flex items-center gap-3 rounded-full border px-4 py-2.5 text-left transition-colors duration-300 ${
                  on ? 'border-ink-950 bg-ink-950 text-white' : 'border-fg/15 bg-white hover:border-fg/40'
                }`}
              >
                <span
                  className={`flex size-5 items-center justify-center rounded-full border transition-colors ${
                    on ? 'border-brand-400 bg-brand-400 text-ink-950' : 'border-fg/25'
                  }`}
                  aria-hidden="true"
                >
                  {on && <Check size={12} strokeWidth={3} />}
                </span>
                <span>
                  <span className="block text-[0.95rem] font-semibold leading-tight">{n.label}</span>
                  <span className={`block text-xs ${on ? 'text-ink-300' : 'text-muted'}`}>{n.hint}</span>
                </span>
              </button>
            );
          })}
          {selected.length > 0 && (
            <button type="button" onClick={() => setSelected([])} className="link-underline px-2 text-sm font-medium text-muted">
              Resetează
            </button>
          )}
        </div>
      </fieldset>

      <p className="mt-6 min-h-[1.5rem] text-[0.95rem]" aria-live="polite">
        {selected.length === 0
          ? 'Toate cele patru modele au jurnal electronic și comunicare cu ANAF.'
          : best.length
            ? `${best.length === 1 ? 'Un model îndeplinește' : `${best.length} modele îndeplinesc`} toate criteriile: ${best.map((b) => b.m.name).join(', ')}.`
            : 'Niciun model nu le îndeplinește pe toate — sunați-ne și găsim împreună varianta potrivită.'}
      </p>

      <LayoutGroup>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {ranked.map(({ m, misses }, i) => {
            const match = selected.length > 0 && misses.length === 0;
            const dim = selected.length > 0 && misses.length > 0;
            return (
              <motion.li
                key={m.slug}
                layout={!reduce}
                transition={{ layout: { duration: 0.7, ease } }}
                className={`relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border transition-[opacity,border-color,background-color] duration-500 ${
                  match ? 'border-brand-500 bg-white shadow-[0_30px_60px_-30px_rgba(15,111,198,0.45)]' : 'border-fg/10 bg-white'
                } ${dim ? 'opacity-55' : 'opacity-100'}`}
              >
                <AnimatePresence>
                  {match && i === 0 && (
                    <motion.span
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute left-4 top-4 z-10 rounded-full bg-brand-600 px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-white"
                    >
                      Potrivire
                    </motion.span>
                  )}
                </AnimatePresence>
                <a href={`/case-de-marcat/${m.slug}/`} className="group flex flex-1 flex-col p-5 pt-6">
                  <div className="relative flex aspect-[4/3] items-center justify-center rounded-2xl bg-studio">
                    <img
                      src={m.image.src}
                      srcSet={m.image.srcSet}
                      sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 90vw"
                      width={m.image.width}
                      height={m.image.height}
                      alt={m.image.alt}
                      loading="lazy"
                      decoding="async"
                      className={`h-[82%] w-auto object-contain transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:-translate-y-1 group-hover:scale-[1.04] ${
                        m.image.kind === 'photo' ? 'blend-multiply' : 'drop-shadow-[0_18px_22px_rgba(0,0,0,0.28)]'
                      }`}
                    />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">{m.name}</h3>
                  <p className="mt-1 text-[0.95rem] text-muted">{m.tagline}</p>
                  <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-fg/10 pt-4">
                    {m.keyFigures.map((k) => (
                      <div key={k.label}>
                        <dt className="sr-only">{k.label}</dt>
                        <dd className="text-[0.95rem] font-semibold tabular-nums">{k.value}</dd>
                        <dd className="text-[0.72rem] leading-tight text-muted">{k.label}</dd>
                      </div>
                    ))}
                  </dl>
                  {dim && (
                    <ul className="mt-4 space-y-1 text-[0.82rem] text-muted">
                      {misses.map((n) => (
                        <li key={n.id} className="flex items-center gap-1.5">
                          <Minus size={12} aria-hidden="true" /> {n.missing}
                        </li>
                      ))}
                    </ul>
                  )}
                  <span className="mt-auto flex items-center gap-1.5 pt-5 text-[0.92rem] font-semibold text-brand-600">
                    Detalii și specificații
                    <ArrowUpRight size={16} aria-hidden="true" className="transition-transform duration-500 group-hover:rotate-45" />
                  </span>
                </a>
              </motion.li>
            );
          })}
        </ul>
      </LayoutGroup>
    </div>
  );
}
