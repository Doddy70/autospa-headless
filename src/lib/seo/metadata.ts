import type { Metadata } from 'next';

import { SITE, absoluteUrl } from '@/config/site';
import { isPresent } from '@/lib/wordpress/normalize';
import type { Service } from '@/lib/wordpress/types/service';

/**
 * Metadata is built from the ACF SEO group when the editor filled it in, and
 * falls back to real post content otherwise. Nothing is invented: if neither a
 * description nor a short description exists, the tag is simply omitted.
 */
export function buildServiceMetadata(service: Service): Metadata {
  const canonical = service.seo.canonical ?? absoluteUrl(service.path);

  const title = service.seo.title ?? `${service.title} | ${SITE.shortName}`;
  const description =
    service.seo.description ??
    (isPresent(service.shortDescription) ? service.shortDescription.value : undefined);

  const image = service.seo.ogImage ?? (isPresent(service.hero.image) ? service.hero.image.value : null);

  /*
   * `seo_robots` is an ACF checkbox with `index` / `follow`. An empty value
   * means the editor never touched it, which must not be read as noindex - the
   * WordPress default (index, follow) applies.
   */
  const robots = service.seo.robots.length
    ? {
        index: service.seo.robots.includes('index'),
        follow: service.seo.robots.includes('follow'),
      }
    : undefined;

  return {
    title,
    ...(description ? { description } : {}),
    alternates: { canonical },
    ...(robots ? { robots } : {}),
    ...(service.seo.keywords.length ? { keywords: service.seo.keywords } : {}),
    openGraph: {
      type: 'website',
      siteName: SITE.name,
      locale: SITE.locale,
      url: canonical,
      title,
      ...(description ? { description } : {}),
      ...(image
        ? {
            images: [
              {
                url: image.url,
                ...(image.width ? { width: image.width } : {}),
                ...(image.height ? { height: image.height } : {}),
                alt: image.alt || service.title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      ...(description ? { description } : {}),
      ...(image ? { images: [image.url] } : {}),
    },
  };
}
