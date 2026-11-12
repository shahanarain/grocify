import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product images are served directly from many third-party brand servers.
    // We intentionally do NOT route them through Next's image optimizer:
    // a wildcard remotePattern would turn the optimizer into an abusable
    // server-side fetch proxy / bandwidth-DoS vector. With `unoptimized`, the
    // browser loads each brand image directly and the optimizer is never
    // invoked for remote URLs, so no host whitelist is required.
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
    ],
  },
};

export default nextConfig;
