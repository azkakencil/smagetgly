'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface SmoothImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string;
  containerClassName?: string;
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop';

export function SmoothImage({
  src,
  alt,
  className = '',
  fallbackSrc = DEFAULT_FALLBACK,
  fill,
  sizes,
  priority,
  ...props
}: SmoothImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const finalSrc = hasError || !src ? fallbackSrc : src;

  return (
    <Image
      src={finalSrc}
      alt={alt || ''}
      fill={fill}
      sizes={sizes || '(max-width: 768px) 100vw, 300px'}
      priority={priority}
      referrerPolicy="no-referrer"
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      unoptimized
      onLoad={() => setIsLoaded(true)}
      onError={() => setHasError(true)}
      className={`transition-opacity duration-300 ease-out will-change-[opacity] ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      {...props}
    />
  );
}
