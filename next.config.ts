import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The output directory. It can be moved aside with NEXT_DIST_DIR so a
  // build does not collide with a dev server that is running at the same time
  // (two Next.js processes in one checkout corrupt each other's .next).
  distDir: process.env.NEXT_DIST_DIR || '.next',
  reactStrictMode: true,

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // WordPress media lives on the staging host. Only that host is allowed so a
  // compromised CMS field cannot turn next/image into an open proxy - and so
  // nothing in this app reads from the production site.
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // The qualities the components ask for. Without this list Next.js logs a
    // warning for every image and the setting becomes mandatory in Next 16.
    qualities: [75, 80, 85],
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
  //
  // The service catalogue now follows the production naming (premium-coating,
  // premium-360-ppf), so the two demo slugs are redirected to their new
  // canonical URL instead of 404ing.
  //
  // Phase 2F: the two production blog listings collapse into the native
  // `/blog` route. `/news-insight` is the target of the production menu and
  // shows the real articles; `/blog-standard` still carries the theme demo
  // copy ("We are a digital agency ...", "No posts found!"), so it has no
  // content of its own to keep. Both redirect permanently so inbound links
  // and ranking signals survive the move to the headless frontend.
  async redirects() {
    return [
      { source: '/service/:slug', destination: '/services/:slug', permanent: true },
      { source: '/service', destination: '/services', permanent: true },
      {
        source: '/services/nano-ceramic-coating',
        destination: '/services/premium-coating',
        permanent: true,
      },
      {
        source: '/services/ppf-paint-protection-film',
        destination: '/services/premium-360-ppf',
        permanent: true,
      },
      { source: '/news-insight', destination: '/blog', permanent: true },
      { source: '/blog-standard', destination: '/blog', permanent: true },
      // Production redirects its `/home` page to the front page.
      { source: '/home', destination: '/', permanent: true },

      // The production service landing pages repeat the catalogue entries.
      // `/services/<slug>` is the canonical route of this frontend, so the
      // old landing URLs redirect there instead of shipping a second copy.
      {
        source: '/premium-wash',
        destination: '/services/premium-wash',
        permanent: true,
      },
      {
        source: '/premium-detailing',
        destination: '/services/premium-detailing',
        permanent: true,
      },
      {
        source: '/premium-nano-ceramic-coating',
        destination: '/services/premium-coating',
        permanent: true,
      },
      {
        source: '/nano-ceramic-coating',
        destination: '/services/premium-coating',
        permanent: true,
      },
      {
        source: '/360-paint-protection-film-package',
        destination: '/services/premium-360-ppf',
        permanent: true,
      },
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
        // The hero video. It is served with range support, but the browser
        // has to be able to revalidate it - a cached response that cannot be
        // revalidated makes Chrome fail the range request of the media
        // element ("ERR_CACHE_OPERATION_NOT_SUPPORTED").
        source: '/videos/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, must-revalidate' },
        ],
      },
    ];
  },
};

export default nextConfig;
