import { SITE, absoluteUrl, routes } from '@/config/site';
import { isPresent } from '@/lib/wordpress/normalize';
import type { Service } from '@/lib/wordpress/types/service';

/**
 * JSON-LD builders.
 *
 * Every property is derived from data that actually resolved. A field in
 * `unavailable` or `empty` state contributes nothing - emitting a guessed
 * `offers` block or an invented `provider` address would be structured-data
 * spam and could earn a manual action.
 */

type Json = Record<string, unknown>;

export function serviceSchema(service: Service): Json {
  const url = absoluteUrl(service.path);
  const description = isPresent(service.shortDescription)
    ? service.shortDescription.value
    : service.seo.description;

  const schema: Json = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: service.title,
    url,
    provider: {
      '@type': 'AutoWash',
      '@id': `${absoluteUrl('/')}#business`,
      name: SITE.name,
    },
  };

  if (description) schema.description = description;
  if (service.categoryLabel) schema.serviceType = service.categoryLabel;
  if (isPresent(service.hero.image)) schema.image = service.hero.image.value.url;

  /*
   * Pricing is only advertised when real vehicle-size rows exist. `offers` is
   * built from the cheapest and dearest resolved price, so the range is a fact
   * about stored data rather than a marketing estimate.
   */
  if (isPresent(service.packages)) {
    const prices = service.packages.value
      .flatMap((pkg) => pkg.prices)
      .map((row) => row.price);

    if (prices.length > 0) {
      schema.offers = {
        '@type': 'AggregateOffer',
        priceCurrency: 'IDR',
        lowPrice: Math.min(...prices),
        highPrice: Math.max(...prices),
        offerCount: prices.length,
      };
    }
  }

  return schema;
}

export function breadcrumbSchema(
  trail: { name: string; path: string }[],
): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function serviceBreadcrumb(service: Service): Json {
  return breadcrumbSchema([
    { name: 'Home', path: routes.home() },
    { name: 'Layanan', path: routes.services() },
    { name: service.title, path: service.path },
  ]);
}
