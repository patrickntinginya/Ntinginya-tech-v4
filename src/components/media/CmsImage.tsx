import Image from "next/image";
import { cn } from "@/lib/cn";

/** True only for files in this project's Supabase public storage (the host allowed in next.config.mjs). */
function isOptimizable(src: string): boolean {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return false;
  try {
    const url = new URL(src);
    return url.host === new URL(base).host && url.pathname.startsWith("/storage/v1/object/public/");
  } catch {
    return false;
  }
}

/**
 * Image for CMS content. Supabase-hosted images go through next/image (AVIF/WebP, responsive sizes,
 * lazy loading). Any other https image an editor pasted still renders, as a plain lazy <img>,
 * because next/image would reject hosts that are not allow-listed.
 * Width and height reserve space so the page does not jump while the image loads.
 */
export function CmsImage({
  src,
  alt,
  width = 1200,
  height = 750,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  if (isOptimizable(src)) {
    return (
      <Image src={src} alt={alt} width={width} height={height} sizes={sizes} priority={priority} className={cn(className)} />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={cn(className)}
    />
  );
}
