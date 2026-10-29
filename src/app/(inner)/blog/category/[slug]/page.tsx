import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ArticleCard from '@/components/content/ArticleCard';
import { fetchArticles, fetchCategories, withCategoryNames } from '@/lib/wordpress/rest';

export const revalidate = 300;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const categories = await fetchCategories();
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    return { title: 'Kategori tidak ditemukan' };
  }

  return {
    title: `${category.name} | AutoSPA Jakarta`,
    description: `Artikel categorized under ${category.name} on the AutoSPA Jakarta blog.`,
    alternates: { canonical: `/blog/category/${category.slug}` },
  };
}

export default async function BlogCategoryPage({ params }: Params) {
  const { slug } = await params;
  const categories = await fetchCategories();
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const result = await fetchArticles({ perPage: 24, category: category.id });
  const articles = await withCategoryNames(result.articles);

  return (
    <div className="min-h-screen bg-background-8 pt-24">
      <section className="relative px-6 py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary-500">
            Kategori
          </span>
          <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">
            {category.name}
          </h1>
          <p className="mt-4 text-white/70">{category.count} artikel</p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
