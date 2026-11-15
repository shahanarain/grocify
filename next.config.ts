import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product images are served directly from many third-party brand servers.
    // We intentionally do NOT route them through Next's image optimizer:
    // a wildcard remotePattern would turn the optimizer into an abusable
    // server-side fetch proxy / bandwidth-DoS vector. The browser loads each
    // approved retailer image directly. Next Image still validates remote
    // hosts in development, so list the sources used by verified catalog data.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'alfatah.pk',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.openfoodfacts.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'imtiaz-i.s3.ap-southeast-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
