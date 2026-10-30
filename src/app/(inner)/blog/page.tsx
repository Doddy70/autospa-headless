import type { Metadata } from 'next';
import Link from 'next/link';

import ArticleCard from '@/components/content/ArticleCard';
import BlogHero from '@/components/content/BlogHero';
import BlogPagination from '@/components/content/BlogPagination';
import {
  fetchArticles,
  fetchCategories,
  withArticleMeta,
  withCategoryNames,
} from '@/lib/wordpress/rest';

export const metadata: Metadata = {
  title: 'Blog & Artikel | AutoSPA Jakarta',
  description:
    'Tips, panduan, dan insight detailing, ceramic coating, dan paint protection dari AutoSPA Jakarta.',
  alternates: { canonical: '/blog' },
};

export const revalidate = 300;

const PER_PAGE = 12;

/**
 * The article listing.
 *
 * The layout is the Agntix `blog-grid-2-col` template: the breadcrumb banner
 * of `BlogListBreadCrumb`, a two column grid of `BlogGridTwoItem` cards and
 * the `BlogListPagination` under it. The content comes from the WordPress
 * REST API of the origin, read-only.
 */
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

  const articles = await withArticleMeta(await withCategoryNames(result.articles));

  const buildHref = (target: number) => {
    const query = new URLSearchParams();
    if (target > 1) query.set('page', String(target));
    if (activeCategory) query.set('category', activeCategory.slug);
    if (search) query.set('search', search);
    const suffix = query.toString();
    return suffix ? `/blog?${suffix}` : '/blog';
  };

  return (
    <>
      <BlogHero
        eyebrow="News & Insight"
        title="Cerita, panduan, dan insights"
        description="Panduan praktis seputar detailing, coating, dan perawatan kendaraan dari tim AutoSPA Jakarta."
      />

      <section id="down" className="bg-background-8 pb-24 pt-8">
        <div className="mx-auto max-w-[1536px] px-6 md:px-10">
          {/* Category filter */}
          <nav className="mb-12 flex flex-wrap items-center gap-2">
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
            /* The two column grid of the Agntix `blog-grid-2-col` template. */
            <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}

          <BlogPagination
            page={page}
            totalPages={result.totalPages}
            buildHref={buildHref}
          />
        </div>
      </section>
    </>
  );
}
