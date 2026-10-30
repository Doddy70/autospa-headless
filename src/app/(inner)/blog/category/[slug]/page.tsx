import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ArticleCard from '@/components/content/ArticleCard';
import BlogHero from '@/components/content/BlogHero';
import {
  fetchArticles,
  fetchCategories,
  withArticleMeta,
  withCategoryNames,
} from '@/lib/wordpress/rest';

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

/**
 * The articles of one category.
 *
 * Same layout as the article listing - the Agntix `blog-grid-2-col`
 * template - with the banner of the category on top.
 */
export default async function BlogCategoryPage({ params }: Params) {
  const { slug } = await params;
  const categories = await fetchCategories();
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const result = await fetchArticles({ perPage: 24, category: category.id });
  const articles = await withArticleMeta(await withCategoryNames(result.articles));

  return (
    <>
      <BlogHero
        eyebrow="Kategori"
        title={category.name}
        description={`${category.count} artikel dalam kategori ini.`}
      />

      <section className="bg-background-8 pb-24 pt-8">
        <div className="mx-auto max-w-[1536px] px-6 md:px-10">
          {articles.length === 0 ? (
            <p className="py-20 text-center text-white/60">
              Belum ada artikel yang cocok.
            </p>
          ) : (
            <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
