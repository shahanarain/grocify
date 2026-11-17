'use client';

import { useState, type ReactNode } from 'react';

interface CatalogImageProps {
  src: string | null | undefined;
  alt: string;
  className: string;
  fallback: ReactNode;
}

/**
 * Catalog images come directly from retailer CDNs. A native img keeps those
 * requests in the visitor's browser and avoids Next Image's host allowlist for
 * catalog URLs that can vary by retailer or by Firestore data.
 */
export function CatalogImage({ src, alt, className, fallback }: CatalogImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) return <>{fallback}</>;

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} loading="lazy" decoding="async" onError={() => setFailed(true)} />;
}
