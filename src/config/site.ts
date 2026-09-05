/**
 * Site-wide constants.
 *
 * Phase 1C section 10.3: CTA language is Indonesian and action-oriented -
 * "Book Sekarang", "Reservasi Sekarang", "Hubungi via WhatsApp". Never
 * "Learn More" / "Get Started".
 */

export const SITE = {
  name: 'AutoSPA Jakarta',
  shortName: 'AutoSPA',
  tagline: 'Premium Car Detailing & Paint Protection Jakarta',
  locale: 'id_ID',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
} as const;

export const CTA = {
  book: 'Book Sekarang',
  reserve: 'Reservasi Sekarang',
  whatsapp: 'Hubungi via WhatsApp',
  consult: 'Konsultasi Gratis',
} as const;

/**
 * Canonical route builders. The CMS reports `uri` as `/services/<slug>/`, so
 * the plural form is canonical; `next.config.ts` permanently redirects the
 * singular `/service/<slug>`.
 */
export const routes = {
  home: () => '/',
  services: () => '/services',
  service: (slug: string) => `/services/${slug}`,
} as const;

export function absoluteUrl(path: string): string {
  const base = SITE.url.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
