import type { MetadataRoute } from 'next';

import { NATIVE_SLUGS, pages } from '@/lib/wordpress/pages';
import { fetchArticles, fetchCategories } from '@/lib/wordpress/rest';
import { listServiceCards } from '@/lib/services/catalog';

export const revalidate = 3600;

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3100').replace(/\/$/, '');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/locations`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/reservasi`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/team`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/terms-conditions`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/cookie-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ];

  // Service pages - read from the catalogue, so a service that only exists
  // in WordPress is listed as well.
  for (const service of await listServiceCards()) {
    entries.push({
      url: `${baseUrl}${service.href}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  // Static page snapshots mirrored from the production WordPress site.
  for (const page of pages) {
    if (NATIVE_SLUGS.has(page.slug)) continue;
    entries.push({
      url: `${baseUrl}/${page.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  // Article categories and articles.
  try {
    const categories = await fetchCategories();
    for (const category of categories) {
      entries.push({
        url: `${baseUrl}/blog/category/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.5,
      });
    }

    for (let page = 1; page <= 3; page += 1) {
      const result = await fetchArticles({ page, perPage: 100 });
      for (const article of result.articles) {
        entries.push({
          url: `${baseUrl}/blog/${article.slug}`,
          lastModified: new Date(article.modified),
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
      if (page >= result.totalPages) break;
    }
  } catch (error) {
    // The article API is upstream-dependent; a sitemap without articles is
    // still valid, so this must not take the whole route down.
    console.error('[sitemap] article fetch failed:', error);
  }

  return entries;
}
