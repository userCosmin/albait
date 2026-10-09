import { getImage } from 'astro:assets';
import { products } from '@/data/products';
import type { FinderModel } from '@/components/react/ModelFinder';

// Manufacturer descriptions recommend these models for high daily receipt volume.
const HIGH_VOLUME = new Set(['daisy-compact-m', 'daisy-perfect-m']);

export async function finderModels(): Promise<FinderModel[]> {
  return Promise.all(
    products.map(async (p) => {
      const img = p.images[0];
      const opt = await getImage({ src: img.src, widths: [320, 480, 640], format: 'webp', quality: 78 });
      return {
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        capabilities: p.capabilities,
        volume: HIGH_VOLUME.has(p.slug),
        keyFigures: p.keyFigures,
        image: {
          src: opt.src,
          srcSet: opt.srcSet.attribute,
          width: img.src.width,
          height: img.src.height,
          alt: img.alt,
          kind: img.kind,
        },
      };
    }),
  );
}
