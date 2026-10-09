import { getImage } from 'astro:assets';
import { products } from '@/data/products';
import type { FinderModel } from '@/components/react/ModelFinder';


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
