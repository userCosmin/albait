// Prepares product imagery from the manufacturer photos in assets-src/.
//
// - Cutouts: removes the white studio background of dark devices so they can sit
//   on any surface. Background pixels connected to the border become translucent
//   black (soft shadows survive), and a thin band around the background is
//   "unmultiplied" against white so anti-aliased edges don't leave a light fringe.
// - Photos: re-encoded only; Astro converts them to AVIF/WebP at build.
// - Brand: extracts the official triangle mark from the official logo.
//
// Run with `npm run images`. Output goes to src/assets/ and public/ and is committed.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const SRC = 'assets-src';
const OUT = 'src/assets';

const cutouts = [
  { src: 'products/compact-s-render.jpg', out: 'products/compact-s-cutout.png' },
  { src: 'products/compact-s-angle.jpg', out: 'products/compact-s-angle-cutout.png' },
  { src: 'products/compact-m.jpg', out: 'products/compact-m-cutout.png' },
  { src: 'products/perfect-m.jpg', out: 'products/perfect-m-cutout.png' },
  { src: 'products/perfect-m-top.jpg', out: 'products/perfect-m-top-cutout.png' },
];

const photos = [
  'compact-s-car-mounted.jpg',
  'compact-s-car-hand.jpg',
  'expert-sx.jpg',
  'expert-sx-front.jpg',
  'expert-sx-top.jpg',
  'compact-m-back.jpg',
];

const FLOOD_MIN = 205; // min(r,g,b) a pixel needs to be considered background
const BAND = 3; // px of edge band to unmultiply

async function cutout({ src, out }) {
  const { data, info } = await sharp(`${SRC}/${src}`)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const n = w * h;
  const minc = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    minc[i] = Math.min(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]);
  }

  // Flood fill background from every border pixel.
  const bg = new Uint8Array(n);
  const stack = [];
  const push = (i) => {
    if (!bg[i] && minc[i] >= FLOOD_MIN) {
      bg[i] = 1;
      stack.push(i);
    }
  };
  for (let x = 0; x < w; x++) {
    push(x);
    push((h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    push(y * w);
    push(y * w + w - 1);
  }
  while (stack.length) {
    const i = stack.pop();
    const x = i % w;
    if (x > 0) push(i - 1);
    if (x < w - 1) push(i + 1);
    if (i >= w) push(i - w);
    if (i < n - w) push(i + w);
  }

  // Chebyshev distance from the background, capped at BAND.
  const dist = new Uint8Array(n).fill(255);
  for (let i = 0; i < n; i++) if (bg[i]) dist[i] = 0;
  for (let pass = 1; pass <= BAND; pass++) {
    for (let i = 0; i < n; i++) {
      if (dist[i] !== 255) continue;
      const x = i % w;
      const y = (i / w) | 0;
      let near = false;
      for (let dy = -1; dy <= 1 && !near; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx;
          const yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
          if (dist[yy * w + xx] === pass - 1) {
            near = true;
            break;
          }
        }
      }
      if (near) dist[i] = pass;
    }
  }

  const rgba = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    const r = data[i * 3];
    const g = data[i * 3 + 1];
    const b = data[i * 3 + 2];
    const d = dist[i];
    if (d === 0) {
      // Background: keep only the darkness, as a translucent black shadow.
      const a = Math.max(0, 250 - minc[i]) / 250;
      const shaped = Math.min(1, Math.pow(a, 1.15) * 1.35);
      rgba.set([0, 0, 0, Math.round(shaped * 255)], i * 4);
    } else if (d <= BAND) {
      // Edge band: unmultiply grey anti-aliasing against white, fading back
      // to the original pixel deeper inside the object.
      const max = Math.max(r, g, b);
      const sat = max === 0 ? 0 : (max - minc[i]) / max;
      if (sat < 0.18) {
        const a = 1 - minc[i] / 255;
        const keep = d / (BAND + 1);
        const alpha = a + (1 - a) * keep;
        rgba.set(
          [Math.round(r * keep), Math.round(g * keep), Math.round(b * keep), Math.round(alpha * 255)],
          i * 4,
        );
      } else {
        rgba.set([r, g, b, 255], i * 4);
      }
    } else {
      rgba.set([r, g, b, 255], i * 4);
    }
  }

  await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
    .trim({ threshold: 1 })
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}/${out}`);
  console.log('cutout', out);
}

async function brand() {
  // The official logo is a 512×512 PNG: triangle mark on top, wordmark below.
  // Crop the mark only; the wordmark is set in HTML next to it.
  const markArea = await sharp(`${SRC}/brand/alba-it-logo-official.png`)
    .extract({ left: 0, top: 0, width: 512, height: 418 })
    .toBuffer();
  await sharp(markArea)
    .trim({ threshold: 10 })
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}/brand/alba-it-mark.png`);
  await sharp(`${SRC}/brand/alba-it-logo-official.png`)
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}/brand/alba-it-logo-official.png`);

  const markBuf = await sharp(`${OUT}/brand/alba-it-mark.png`).toBuffer();
  for (const [size, file] of [
    [180, 'public/apple-touch-icon.png'],
    [192, 'public/icon-192.png'],
    [512, 'public/icon-512.png'],
  ]) {
    const inner = Math.round(size * 0.74);
    const icon = await sharp(markBuf)
      .resize(inner, inner, { fit: 'contain', background: '#ffffff' })
      .toBuffer();
    await sharp({ create: { width: size, height: size, channels: 4, background: '#ffffff' } })
      .composite([{ input: icon, gravity: 'center' }])
      .png()
      .toFile(file);
  }
  await sharp(markBuf)
    .resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('public/favicon-48.png');
  console.log('brand mark + icons');
}

async function ogImage() {
  // 1200×630 social card: studio-dark background, product, wordmark.
  const W = 1200;
  const H = 630;
  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <radialGradient id="g" cx="72%" cy="52%" r="48%">
        <stop offset="0" stop-color="#1e8fe1" stop-opacity="0.35"/>
        <stop offset="0.5" stop-color="#1e8fe1" stop-opacity="0.08"/>
        <stop offset="1" stop-color="#07090d" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="#07090d"/>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="72" y="250" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="66" font-weight="700" fill="#e9edf2" letter-spacing="-2">Case de marcat</text>
    <text x="72" y="326" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="66" font-weight="700" fill="#e9edf2" letter-spacing="-2">Daisy &amp; service</text>
    <text x="72" y="402" font-family="Georgia, serif" font-style="italic" font-size="62" fill="#8ccbff">în Alba Iulia.</text>
    <text x="72" y="540" font-family="Menlo, monospace" font-size="22" fill="#9aa4b2" letter-spacing="3">ALBA IT · 0758 343 653 · ALBAIT.RO</text>
  </svg>`);
  const device = await sharp(`${OUT}/products/compact-s-cutout.png`).resize({ width: 560 }).toBuffer();
  const mark = await sharp(`${OUT}/brand/alba-it-mark.png`).resize({ height: 54 }).toBuffer();
  await sharp(bg)
    .composite([
      { input: device, left: 600, top: 120 },
      { input: mark, left: 72, top: 84 },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(`${OUT}/brand/og-default.jpg`);
  console.log('og image');
}

await mkdir(`${OUT}/products`, { recursive: true });
await mkdir(`${OUT}/brand`, { recursive: true });
await Promise.all(cutouts.map(cutout));
await Promise.all(
  photos.map((p) =>
    sharp(`${SRC}/products/${p}`).jpeg({ quality: 92, mozjpeg: true }).toFile(`${OUT}/products/${p}`),
  ),
);
await brand();
await ogImage();
