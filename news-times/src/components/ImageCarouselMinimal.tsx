"use client";

interface ImageCarouselMinimalProps {
  images: (string | null | undefined)[];
  alt: string;
  className?: string;
}

export default function ImageCarouselMinimal({
  images,
  alt,
  className = "",
}: ImageCarouselMinimalProps) {
  // Filter out null/undefined images
  const validImages = images.filter((img): img is string => Boolean(img));
  
  // If no images, don't render anything
  if (validImages.length === 0) {
    return null;
  }

  // Just render the first image with no state or effects
  const firstImage = validImages[0];
  
  return (
    <div className={`relative overflow-hidden rounded-lg bg-gray-100 ${className}`}>
      <img
        src={firstImage}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}
