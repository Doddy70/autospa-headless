import type { Metadata } from 'next';
import Link from 'next/link';

import ArticleCard from '@/components/content/ArticleCard';
import { fetchArticles, fetchCategories, withCategoryNames } from '@/lib/wordpress/rest';

export const metadata: Metadata = {
  title: 'Blog & Artikel | AutoSPA Jakarta',
  description:
    'Tips, panduan, dan insight detailing, ceramic coating, dan paint protection dari AutoSPA Jakarta.',
  alternates: { canonical: '/blog' },
};

export const revalidate = 300;

const PER_PAGE = 12;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? '1') || 1);
  const search = params.search?.trim();

  const categories = await fetchCategories();
  const activeCategory = params.category
    ? categories.find((category) => category.slug === params.category)
    : undefined;

  const result = await fetchArticles({
    page,
    perPage: PER_PAGE,
    category: activeCategory?.id,
    search,
  });

  const articles = await withCategoryNames(result.articles);

  const buildHref = (target: number) => {
    const query = new URLSearchParams();
    if (target > 1) query.set('page', String(target));
    if (activeCategory) query.set('category', activeCategory.slug);
    if (search) query.set('search', search);
    const suffix = query.toString();
    return suffix ? `/blog?${suffix}` : '/blog';
  };

  return (
    <div className="min-h-screen bg-background-8 pt-24">
      <section className="relative px-6 py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary-500">
            Blog
          </span>
          <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">
            Artikel & Insights
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            Panduan praktis seputar detailing, coating, dan perawatan kendaraan dari tim AutoSPA.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          {/* Category filter */}
          <nav className="mb-10 flex flex-wrap gap-2">
            <Link
              href="/blog"
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                activeCategory
                  ? 'border-white/15 text-white/70 hover:border-primary-500/50'
                  : 'border-primary-500 bg-primary-500/15 text-primary-500'
              }`}
            >
              Semua
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog?category=${category.slug}`}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  activeCategory?.slug === category.slug
                    ? 'border-primary-500 bg-primary-500/15 text-primary-500'
                    : 'border-white/15 text-white/70 hover:border-primary-500/50'
                }`}
              >
                {category.name} ({category.count})
              </Link>
            ))}
          </nav>

          {articles.length === 0 ? (
            <p className="py-20 text-center text-white/60">
              Belum ada artikel yang cocok.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {result.totalPages > 1 ? (
            <nav className="mt-12 flex items-center justify-center gap-3">
              {page > 1 ? (
                <Link
                  href={buildHref(page - 1)}
                  className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/80 transition-colors hover:border-primary-500/60"
                >
                  Sebelumnya
                </Link>
              ) : null}
              <span className="text-sm text-white/60">
                Halaman {page} dari {result.totalPages} ({result.total} artikel)
              </span>
              {page < result.totalPages ? (
                <Link
                  href={buildHref(page + 1)}
                  className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/80 transition-colors hover:border-primary-500/60"
                >
                  Berikutnya
                </Link>
              ) : null}
            </nav>
          ) : null}
        </div>
      </section>
    </div>
  );
}
