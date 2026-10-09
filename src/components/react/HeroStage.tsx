import { useEffect, useRef, type PointerEvent } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';

export interface ResponsiveImage {
  avif: string;
  webp: string;
  fallback: string;
  sizes: string;
  width: number;
  height: number;
}

interface Props {
  image: ResponsiveImage;
  alt: string;
  productName: string;
  productHref: string;
  chips: string[];
  receipt: { label: string; value: string }[];
}

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Product stage for the home hero. The product photo itself is server-rendered
 * and revealed with a CSS mask at first paint (so LCP never waits for JS);
 * this island adds the cinematic layer on top: printed receipt, spec chips,
 * light sweep, cursor-driven 2.5D tilt and scroll parallax.
 */
export default function HeroStage({ image, alt, productName, productHref, chips, receipt }: Props) {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);

  // Scroll: layers drift at different speeds as the hero leaves the viewport.
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start 30%', 'end start'] });
  const yDevice = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);
  const yReceipt = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -70]);
  const yChips = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -150]);
  const fade = useTransform(scrollYProgress, [0.55, 1], [1, reduce ? 1 : 0.35]);

  // Pointer: a restrained 2.5D tilt, springy so it never feels twitchy.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 90, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 90, damping: 18, mass: 0.6 });
  const rotateY = useTransform(sx, [-1, 1], [-8, 8]);
  const rotateX = useTransform(sy, [-1, 1], [6, -6]);
  const shiftX = useTransform(sx, [-1, 1], [-14, 14]);
  const shiftY = useTransform(sy, [-1, 1], [-10, 10]);
  const chipX = useTransform(sx, [-1, 1], [18, -18]);
  const chipY = useTransform(sy, [-1, 1], [12, -12]);
  const glowX = useTransform(sx, [-1, 1], [38, 62]);
  const glowY = useTransform(sy, [-1, 1], [40, 60]);
  const glow = useMotionTemplate`radial-gradient(42% 46% at ${glowX}% ${glowY}%, rgb(30 143 225 / 0.34), rgb(30 143 225 / 0.08) 45%, transparent 72%)`;
  const shadowX = useTransform(sx, [-1, 1], [24, -24]);

  const finePointer = useRef(false);
  useEffect(() => {
    finePointer.current = window.matchMedia('(pointer: fine)').matches;
  }, []);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || !finePointer.current || !stageRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width) * 2 - 1);
    py.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  const chipPositions = [
    'left-[0%] top-[12%] sm:left-[2%]',
    'right-[2%] bottom-[20%] sm:right-[6%]',
    'left-[10%] bottom-[2%] hidden sm:flex',
  ];

  return (
    <div
      ref={stageRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative mx-auto w-[92%] max-w-[44rem] [perspective:1400px]"
    >
      {/* Studio light pooling behind the product, follows the cursor. */}
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-[-18%] -z-10" style={{ backgroundImage: glow }} />

      {/* Thermal receipt, printed behind the device. Decorative. */}
      <motion.div
        aria-hidden="true"
        className="absolute right-[4%] top-[-8%] z-0 hidden w-[34%] sm:block min-w-[140px] max-w-[230px] origin-top rotate-[7deg] sm:right-[8%] sm:top-[-12%]"
        style={{ y: yReceipt }}
        initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)', opacity: 0.6 }}
        animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
        transition={{ delay: 1.05, duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
      >
        <div className="receipt relative bg-receipt px-4 pb-6 pt-5 font-mono text-[10px] leading-[1.55] text-ink-800 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] sm:text-[11px]">
          <p className="text-center font-medium tracking-[0.18em]">ALBA IT</p>
          <p className="text-center text-ink-600">ALBA IULIA · JUD. ALBA</p>
          <p className="my-2 overflow-hidden whitespace-nowrap text-ink-400">- - - - - - - - - - - - - - - - - - - -</p>
          <ul>
            {receipt.map((line, i) => (
              <motion.li
                key={line.label}
                className="flex justify-between gap-3"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 + i * 0.16, duration: 0.25 }}
              >
                <span>{line.label}</span>
                <span className="font-medium">{line.value}</span>
              </motion.li>
            ))}
          </ul>
          <p className="my-2 overflow-hidden whitespace-nowrap text-ink-400">- - - - - - - - - - - - - - - - - - - -</p>
          <motion.p
            className="flex justify-between text-[12px] font-medium sm:text-[13px]"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 + receipt.length * 0.16 + 0.1, duration: 0.3 }}
          >
            <span>TOTAL</span>
            <span>POTRIVIT</span>
          </motion.p>
        </div>
      </motion.div>

      {/* The device. */}
      <motion.div className="relative z-10" style={{ y: yDevice, opacity: fade }}>
        <motion.div
          className="relative [transform-style:preserve-3d]"
          style={{ rotateX, rotateY, x: shiftX, y: shiftY }}
        >
          <a href={productHref} className="hero-device-reveal block rounded-[2rem] focus-visible:outline-offset-8" aria-label={`Vezi ${productName}`}>
            <picture>
              <source type="image/avif" srcSet={image.avif} sizes={image.sizes} />
              <source type="image/webp" srcSet={image.webp} sizes={image.sizes} />
              <img
                src={image.fallback}
                alt={alt}
                width={image.width}
                height={image.height}
                sizes={image.sizes}
                fetchPriority="high"
                loading="eager"
                decoding="async"
                className="h-auto w-full select-none drop-shadow-[0_50px_60px_rgba(0,0,0,0.55)]"
                draggable={false}
              />
            </picture>
          </a>

          {/* One-off light sweep across the device, clipped to its silhouette. */}
          {!reduce && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                WebkitMaskImage: `url(${image.fallback})`,
                maskImage: `url(${image.fallback})`,
                WebkitMaskSize: '100% 100%',
                maskSize: '100% 100%',
              }}
            >
              <motion.div
                className="absolute inset-y-0 w-[45%] bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.22)_45%,rgba(140,203,255,0.18)_55%,transparent)] mix-blend-screen"
                initial={{ x: '-120%' }}
                animate={{ x: '320%' }}
                transition={{ delay: 1.2, duration: 1.8, ease: [0.65, 0, 0.35, 1] }}
              />
            </motion.div>
          )}
        </motion.div>

        {/* Floor shadow */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[14%] -bottom-[4%] h-[12%] rounded-[50%] bg-black/70 blur-2xl"
          style={{ x: shadowX }}
        />
      </motion.div>

      {/* Spec chips, drifting on their own layer. */}
      <motion.div className="pointer-events-none absolute inset-0 z-20" style={{ y: yChips }}>
      <motion.ul aria-label={`Caracteristici ${productName}`} className="absolute inset-0" style={{ x: chipX, y: chipY }}>
        {chips.map((chip, i) => (
          <motion.li
            key={chip}
            className={`absolute flex items-center gap-2 rounded-full border border-white/15 bg-ink-900/55 px-3 py-1.5 font-mono text-[11px] tracking-wide text-ink-100 shadow-lg backdrop-blur-md sm:px-3.5 sm:py-2 sm:text-xs ${chipPositions[i] ?? ''}`}
            initial={reduce ? false : { opacity: 0, y: 14, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 1.5 + i * 0.14, duration: 0.9, ease }}
          >
            <span className="size-1.5 rounded-full bg-brand-400" aria-hidden="true" />
            {chip}
          </motion.li>
        ))}
      </motion.ul>
      </motion.div>
    </div>
  );
}
