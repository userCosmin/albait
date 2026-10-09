import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Menu, Phone, X } from 'lucide-react';

interface Props {
  items: { label: string; href: string }[];
  phone: { display: string; href: string };
  currentPath: string;
}

const ease = [0.16, 1, 0.3, 1] as const;

export default function MobileMenu({ items, phone, currentPath }: Props) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const prev = body.style.overflow;
    body.style.overflow = 'hidden';
    const first = panelRef.current?.querySelector<HTMLElement>('a, button');
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === 'Tab' && panelRef.current) {
        const nodes = panelRef.current.querySelectorAll<HTMLElement>('a, button');
        const list = Array.from(nodes);
        const firstEl = list[0];
        const lastEl = list[list.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="flex size-11 items-center justify-center rounded-full border border-current/20"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Închide meniul' : 'Deschide meniul'}
        onClick={() => setOpen((v) => !v)}
      >
        <Menu size={20} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label="Meniu"
            className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-ink-950 text-ink-100"
            initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
            exit={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: reduce ? 0.15 : 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="container-x flex h-[var(--header-h)] shrink-0 items-center justify-between">
              <span className="eyebrow text-ink-300">Meniu</span>
              <button
                type="button"
                onClick={() => {
                  close();
                  toggleRef.current?.focus();
                }}
                className="flex size-11 items-center justify-center rounded-full border border-white/20"
                aria-label="Închide meniul"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Navigație mobilă" className="container-x flex-1 pt-6">
              <ul className="flex flex-col">
                {items.map((item, i) => (
                  <li key={item.href} className="overflow-hidden border-b border-white/10">
                    <motion.a
                      href={item.href}
                      onClick={close}
                      aria-current={currentPath.startsWith(item.href) ? 'page' : undefined}
                      className="group flex items-baseline justify-between py-4 text-[clamp(2rem,9vw,3.4rem)] font-semibold leading-none tracking-[-0.04em] aria-[current=page]:text-brand-300"
                      initial={reduce ? false : { y: '110%' }}
                      animate={{ y: 0 }}
                      transition={{ delay: 0.25 + i * 0.06, duration: 0.8, ease }}
                    >
                      {item.label}
                      <span className="font-mono text-xs tracking-normal text-ink-400">0{i + 1}</span>
                    </motion.a>
                  </li>
                ))}
              </ul>
            </nav>

            <motion.div
              className="container-x flex flex-col gap-3 pb-[max(2rem,env(safe-area-inset-bottom))] pt-10"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease }}
            >
              <a href="/contact/#oferta" onClick={close} className="btn btn-light w-full">
                Solicită o ofertă <ArrowUpRight size={18} className="btn-icon" aria-hidden="true" />
              </a>
              <a href={phone.href} className="btn btn-ghost-dark w-full tabular-nums">
                <Phone size={18} aria-hidden="true" /> {phone.display}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
