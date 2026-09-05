import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // WordPress media lives on the staging host. Only that host is allowed so a
  // compromised CMS field cannot turn next/image into an open proxy.
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'backend.autospajakarta.com',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },

  // Phase 1C section 4.4: one canonical URL per entity - `/services/<slug>/`.
  // The singular form is kept as a permanent redirect so inbound links to
  // /service/<slug> do not 404 and do not split ranking signals.
  async redirects() {
    return [
      { source: '/service/:slug', destination: '/services/:slug', permanent: true },
      { source: '/service', destination: '/services', permanent: true },
    ];
  },

  // Experimental features for performance
  experimental: {
    // Optimize package imports for smaller bundles
    optimizePackageImports: ['lucide-react', 'framer-motion', 'motion'],
  },

  // Headers for caching and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/assets/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Cache media files
        source: '/videos/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
    ];
  },
};

export default nextConfig;
