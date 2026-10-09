import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import type { ResponsiveImage } from '@/lib/images';

export interface Chapter {
  kicker: string;
  title: string;
  text: string;
  figure: string;
  figureLabel: string;
  /** index into `images` */
  image: number;
}

interface Props {
  chapters: Chapter[];
  images: ResponsiveImage[];
  alts: string[];
  productName: string;
}

const ease = [0.16, 1, 0.3, 1] as const;
const poses = [
  { rotate: -4, scale: 1, x: '0%' },
  { rotate: 3, scale: 1.06, x: '4%' },
  { rotate: 0, scale: 0.96, x: '0%' },
  { rotate: -2, scale: 1.02, x: '-3%' },
];

export default function ProductStory({ chapters, images, alts, productName }: Props) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLElement | null)[]>([]);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start center', 'end center'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const barScale = useTransform(progress, [0, 1], [0, 1]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    chapterRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const current = chapters[active];
  const pose = poses[active % poses.length];

  return (
    <div ref={wrapRef} className="grid gap-12 lg:grid-cols-12 lg:gap-8">
      {/* Stage: sticky on desktop only, so mobile scrolls natively. */}
      <div className="lg:col-span-7">
        <div className="relative flex aspect-[5/4] items-center justify-center overflow-hidden rounded-[2rem] bg-studio lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:aspect-auto lg:h-[calc(100svh-var(--header-h)-3rem)]">
          <div aria-hidden="true" className="grid-lines-light absolute inset-0 [mask-image:radial-gradient(65%_65%_at_50%_50%,black,transparent)]" />

          {/* Giant spec figure behind the device */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[8%] overflow-hidden text-center">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={current.figure}
                className="block text-[clamp(4.5rem,13vw,12rem)] font-bold leading-none tracking-[-0.06em] text-fg/[0.07]"
                initial={reduce ? { opacity: 0 } : { y: '60%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={reduce ? { opacity: 0 } : { y: '-60%', opacity: 0 }}
                transition={{ duration: 0.8, ease }}
              >
                {current.figure}
              </motion.span>
            </AnimatePresence>
          </div>

          <motion.div
            className="relative w-[78%] max-w-[36rem]"
            animate={reduce ? undefined : pose}
            transition={{ duration: 1.1, ease }}
          >
            {images.map((img, i) => (
              <motion.picture
                key={i}
                className={i === 0 ? 'relative block' : 'absolute inset-0 flex items-center justify-center'}
                initial={false}
                animate={{ opacity: current.image === i ? 1 : 0, scale: current.image === i ? 1 : 0.94 }}
                transition={{ duration: 0.7, ease }}
                aria-hidden={current.image !== i}
              >
                <source type="image/avif" srcSet={img.avif} sizes={img.sizes} />
                <source type="image/webp" srcSet={img.webp} sizes={img.sizes} />
                <img
                  src={img.fallback}
                  alt={alts[i]}
                  width={img.width}
                  height={img.height}
                  loading="lazy"
                  decoding="async"
                  className={`h-auto drop-shadow-[0_40px_40px_rgba(11,14,19,0.28)] ${i === 0 ? 'w-full' : 'max-h-full w-auto'}`}
                />
              </motion.picture>
            ))}
          </motion.div>

          {/* Caption + progress */}
          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 sm:inset-x-8 sm:bottom-7">
            <div aria-live="polite">
              <p className="eyebrow text-muted">{productName}</p>
              <p className="mt-1 font-mono text-sm font-medium">
                {current.figure} <span className="text-muted">· {current.figureLabel}</span>
              </p>
            </div>
            <p className="font-mono text-sm tabular-nums text-muted" aria-hidden="true">
              0{active + 1} / 0{chapters.length}
            </p>
          </div>
          <motion.div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 hidden h-[3px] origin-left bg-brand-500 lg:block"
            style={{ scaleX: barScale }}
          />
        </div>
      </div>

      {/* Chapters */}
      <ol className="lg:col-span-5">
        {chapters.map((c, i) => (
          <li
            key={c.title}
            ref={(el) => {
              chapterRefs.current[i] = el;
            }}
            data-index={i}
            className="flex min-h-0 flex-col justify-center border-t border-fg/10 py-10 first:border-t-0 lg:min-h-[78svh] lg:py-0"
          >
            <motion.div
              animate={{ opacity: reduce || active === i ? 1 : 0.32 }}
              transition={{ duration: 0.5 }}
              className="max-lg:!opacity-100"
            >
              <p className="eyebrow text-brand-600">
                0{i + 1} — {c.kicker}
              </p>
              <h3 className="mt-4 text-h3 font-semibold">{c.title}</h3>
              <p className="mt-4 max-w-md text-lead text-muted">{c.text}</p>
              <p className="mt-6 inline-flex items-baseline gap-2 rounded-full border border-fg/12 px-4 py-2 font-mono text-sm lg:hidden">
                <strong className="font-medium">{c.figure}</strong>
                <span className="text-muted">{c.figureLabel}</span>
              </p>
            </motion.div>
          </li>
        ))}
      </ol>
    </div>
  );
}
