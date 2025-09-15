export function normalizeImageSrc(
  src: string | null | undefined,
  width?: number,
  height?: number
): string | null {
  if (!src) return null;
  
  // External URL - convert HTTP to HTTPS for security
  if (/^https?:\/\//i.test(src)) {
    return src.replace(/^http:\/\//i, 'https://');
  }
  
  // Assume path inside Supabase Storage bucket "images"
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  const w = width ? `&width=${width}` : "";
  const h = height ? `&height=${height}` : "";
  const params = `${w}${h}&fit=cover&format=webp`;
  return `${base}/storage/v1/render/image/public/images/${src}?${params.replace(/^&/, "")}`;
}


