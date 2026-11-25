'use client';

import { useState, useEffect, type ReactNode } from 'react';

interface CatalogImageProps {
  src: string | null | undefined;
  alt: string;
  className: string;
  fallback: ReactNode;
}

/**
 * Catalog images come directly from retailer CDNs or curated image sources.
 * A native img keeps those requests in the visitor's browser and avoids Next Image's
 * host allowlist for catalog URLs that vary by retailer or Firestore data.
 */
export function CatalogImage({ src, alt, className, fallback }: CatalogImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) return <>{fallback}</>;

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
