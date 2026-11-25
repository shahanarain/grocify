'use client';

import { useState, useEffect, type ReactNode } from 'react';

interface CatalogImageProps {
  src: string | null | undefined;
  alt: string;
  className: string;
  fallback: ReactNode;
  backupSrc?: string;
}

/**
 * Catalog images come directly from retailer CDNs or curated image sources.
 * A native img keeps those requests in the visitor's browser and avoids Next Image's
 * host allowlist for catalog URLs that vary by retailer or Firestore data.
 */
export function CatalogImage({ src, alt, className, fallback, backupSrc }: CatalogImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src || backupSrc);
  const [hasTriedBackup, setHasTriedBackup] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(src || backupSrc);
    setHasTriedBackup(false);
    setFailed(false);
  }, [src, backupSrc]);

  if (!currentSrc || failed) return <>{fallback}</>;

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (!hasTriedBackup && backupSrc && backupSrc !== currentSrc) {
          setHasTriedBackup(true);
          setCurrentSrc(backupSrc);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}
