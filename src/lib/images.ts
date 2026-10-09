// Build-time responsive image sets for React islands, which can't use
// astro:assets components directly. Astro's <Image>/<Picture> are used
// everywhere else.
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

export interface ResponsiveImage {
  avif: string;
  webp: string;
  fallback: string;
  sizes: string;
  width: number;
  height: number;
}

export async function responsiveImage(
  src: ImageMetadata,
  { widths, sizes }: { widths: number[]; sizes: string },
): Promise<ResponsiveImage> {
  const usable = widths.filter((w) => w <= src.width);
  const ws = usable.length ? usable : [src.width];
  const [avif, webp] = await Promise.all(
    (['avif', 'webp'] as const).map((format) => getImage({ src, widths: ws, sizes, format, quality: 78 })),
  );
  const largest = Math.max(...ws);
  // WebP keeps transparency and is supported everywhere we target; it is also
  // reused as the CSS mask for the hero light sweep, so keep it small.
  const fallback = await getImage({ src, width: largest, format: 'webp', quality: 78 });
  return {
    avif: avif.srcSet.attribute,
    webp: webp.srcSet.attribute,
    fallback: fallback.src,
    sizes,
    width: src.width,
    height: src.height,
  };
}
