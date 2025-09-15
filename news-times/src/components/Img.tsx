import Image from "next/image";
import { normalizeImageSrc } from "@/lib/images";

type ImgProps = {
  src: string | null | undefined;
  alt?: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
};

export default function Img({ src, alt = "", width, height, className, priority }: ImgProps) {
  const normalized = normalizeImageSrc(src, width, height);
  if (!normalized) {
    return (
      <div className={`relative w-full overflow-hidden rounded bg-[rgba(0,0,0,0.04)] dark:bg-[rgba(255,255,255,0.06)] ${className || ""}`}>
        <div style={{ paddingTop: `${(height / width) * 100}%` }} />
        <div className="absolute inset-0 flex items-center justify-center text-[11px] text-black/60 dark:text-white/60">Image placeholder</div>
      </div>
    );
  }
  return (
    <div className={`relative w-full overflow-hidden rounded ${className || ""}`}>
      <Image
        src={normalized}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        style={{ objectFit: "cover" }}
        priority={priority}
      />
      <div style={{ paddingTop: `${(height / width) * 100}%` }} />
    </div>
  );
}


