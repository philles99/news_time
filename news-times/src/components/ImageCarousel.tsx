"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { normalizeImageSrc } from "@/lib/images";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface ImageCarouselProps {
  images: (string | null | undefined)[];
  alt: string;
  className?: string;
  aspectRatio?: "square" | "video" | "wide" | "tall";
  showDots?: boolean;
  showArrows?: boolean;
  autoHeight?: boolean;
  priority?: boolean;
}

export default function ImageCarousel({
  images,
  alt,
  className = "",
  aspectRatio = "video",
  showDots = true,
  showArrows = true,
  autoHeight = false,
  priority = false,
}: ImageCarouselProps) {
  // Filter out null/undefined images immediately
  const initialImages = images.filter((img): img is string => Boolean(img));
  
  // State to track which images have failed to load
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Ensure hydration safety
  useEffect(() => {
    setIsClient(true);
  }, []);

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video", 
    wide: "aspect-[16/9]",
    tall: "aspect-[3/4]",
  };

  // Calculate valid images based on failed images
  const validImages = initialImages.filter(img => !failedImages.has(img));
  
  // If no valid images remain, don't render anything
  if (validImages.length === 0) {
    return null;
  }

  // Show placeholder during hydration
  if (!isClient) {
    return (
      <div className={`relative overflow-hidden rounded-lg bg-gray-100 ${aspectClasses[aspectRatio]} ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  // Handler for image loading errors - immediate removal
  const handleImageError = (imageSrc: string) => {
    console.log('Image failed to load immediately:', imageSrc);
    setFailedImages(prev => {
      const newFailedImages = new Set([...prev, imageSrc]);
      return newFailedImages;
    });
    
    // If the current image failed and we have other images, move to next
    const remainingImages = initialImages.filter(img => !failedImages.has(img) && img !== imageSrc);
    if (remainingImages.length > 0) {
      setCurrentIndex(0);
    }
  };

  // If only one image, render optimized Image component
  if (validImages.length === 1) {
    const imageSrc = normalizeImageSrc(validImages[0]) || "/placeholder.svg";
    
    return (
      <div className={`relative overflow-hidden rounded-lg bg-gray-100 ${aspectClasses[aspectRatio]} ${className}`}>
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority={priority}
          onError={() => handleImageError(validImages[0])}
        />
      </div>
    );
  }

  // Multiple images - carousel
  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  // Make sure currentIndex is within bounds
  const safeCurrentIndex = Math.min(currentIndex, validImages.length - 1);
  const currentImageSrc = normalizeImageSrc(validImages[safeCurrentIndex]) || "/placeholder.svg";

  return (
    <div className={`relative group ${className}`}>
      {/* Main Image Container */}
      <div className={`relative overflow-hidden rounded-lg bg-gray-100 ${!autoHeight ? aspectClasses[aspectRatio || "video"] : ""}`}>
        <Image
          key={validImages[safeCurrentIndex]} // Force re-render when image changes
          src={currentImageSrc}
          alt={`${alt} (${safeCurrentIndex + 1}/${validImages.length})`}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-opacity duration-300"
          priority={priority && safeCurrentIndex === 0}
          onError={() => handleImageError(validImages[safeCurrentIndex])}
        />

        {/* Navigation Arrows */}
        {showArrows && validImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 sm:p-2 opacity-80 hover:opacity-100 transition-opacity duration-200 z-10"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 sm:p-2 opacity-80 hover:opacity-100 transition-opacity duration-200 z-10"
              aria-label="Next image"
            >
              <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {validImages.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {safeCurrentIndex + 1}/{validImages.length}
          </div>
        )}
      </div>

      {/* Navigation Dots */}
      {showDots && validImages.length > 1 && (
        <div className="flex justify-center space-x-2 mt-3">
          {validImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === safeCurrentIndex
                  ? "bg-blue-600"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}