import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import ArticleBody from '@/components/content/ArticleBody';
import ArticleCard, { formatArticleDate } from '@/components/content/ArticleCard';
import { fetchArticleBySlug, fetchArticles, withCategoryNames } from '@/lib/wordpress/rest';

export const revalidate = 300;

type Params = { params: Promise<{ slug: string }> };

/**
 * Every published article is prerendered at build time, so the blog of the
 * staging site is fully static. If the origin cannot be reached during the
 * build, the pages are rendered on demand instead - the route stays usable.
 */
export async function generateStaticParams() {
  try {
    const slugs: string[] = [];

    for (let page = 1; page <= 10; page += 1) {
      const result = await fetchArticles({ page, perPage: 100 });
      slugs.push(...result.articles.map((article) => article.slug));
      if (page >= result.totalPages) break;
    }

    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.error('[blog] could not prerender articles:', error);
    return [];
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);

  if (!article) {
    return { title: 'Artikel tidak ditemukan' };
  }

  const canonical = `/blog/${article.slug}`;

  return {
    title: article.title,
    description: article.excerpt.slice(0, 200),
    alternates: { canonical },
    openGraph: {
      title: article.title,
      description: article.excerpt.slice(0, 200),
      url: canonical,
      type: 'article',
      publishedTime: article.date,
      modifiedTime: article.modified,
    },
  };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const [withNames] = await withCategoryNames([article]);

  if (!withNames) {
    notFound();
  }

  // Related articles: newest posts from the first category of this article.
  const primaryCategory = withNames.categories[0];
  const relatedResult = await fetchArticles({
    perPage: 4,
    category: primaryCategory,
  });
  const related = (
    await withCategoryNames(relatedResult.articles)
  ).filter((item) => item.id !== withNames.id);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: withNames.title,
    description: withNames.excerpt.slice(0, 300),
    datePublished: withNames.date,
    dateModified: withNames.modified,
    author: { '@type': 'Organization', name: 'AutoSPA Jakarta' },
    publisher: {
      '@type': 'Organization',
      name: 'AutoSPA Jakarta',
      url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3100',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/blog/${withNames.slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-background-8 pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="px-6 pb-20">
        <header className="mx-auto max-w-3xl py-14 text-center">
          {withNames.categoryNames.length > 0 ? (
            <div className="mb-5 flex flex-wrap justify-center gap-2">
              {withNames.categoryNames.map((name) => (
                <span
                  key={name}
                  className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-500"
                >
                  {name}
                </span>
              ))}
            </div>
          ) : null}

          <h1 className="text-3xl font-bold leading-tight text-white md:text-4xl">
            {withNames.title}
          </h1>

          <time
            dateTime={withNames.date}
            className="mt-5 block text-sm text-accent/50"
          >
            {formatArticleDate(withNames.date)}
          </time>
        </header>

        <ArticleBody html={withNames.content} />

        <footer className="mx-auto mt-16 max-w-3xl border-t border-white/10 pt-8">
          <Link
            href="/blog"
            className="text-sm font-semibold text-primary-500 hover:underline"
          >
            &larr; Kembali ke semua artikel
          </Link>
        </footer>
      </article>

      {related.length > 0 ? (
        <section className="border-t border-white/10 px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 text-2xl font-bold text-white">Artikel terkait</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.slice(0, 3).map((item) => (
                <ArticleCard key={item.id} article={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
