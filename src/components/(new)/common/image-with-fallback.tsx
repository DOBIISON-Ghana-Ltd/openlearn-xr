'use client';

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { LogoSmall } from '@/components/(new)/svgs';
import { cn } from '@/lib/utils/cn';

export interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
  src?: string | null;
  fallbackClassName?: string;
  fallbackIconClassName?: string;
}

export const ImageWithFallback = ({
  src,
  alt,
  className,
  fallbackClassName,
  fallbackIconClassName,
  onLoad,
  onError,
  ...rest
}: ImageWithFallbackProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const showFallback = !src || hasError || isLoading;

  return (
    <>
      {showFallback && (
        <div
          className={cn(
            "size-full flex-center",
            { "absolute inset-0 z-0": src && !hasError, relative: !src || hasError },
            fallbackClassName
          )}
        >
          <LogoSmall
            className={cn(
              "size-18 text-primary-cta/25 shrink-0 select-none",
              fallbackIconClassName
            )}
          />
        </div>
      )}
      {src && !hasError && (
        <Image
          {...rest}
          src={src}
          alt={alt}
          className={cn(className, "transition-opacity duration-300 relative z-1", {
            "opacity-0": isLoading,
            "opacity-100": !isLoading,
          })}
          onLoad={(e) => {
            setIsLoading(false);
            onLoad?.(e);
          }}
          onError={(e) => {
            setIsLoading(false);
            setHasError(true);
            onError?.(e);
          }}
        />
      )}
    </>
  );
};

export default ImageWithFallback;
