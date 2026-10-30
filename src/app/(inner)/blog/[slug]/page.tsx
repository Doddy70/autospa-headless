import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import ArticleBody from '@/components/content/ArticleBody';
import ArticleCard from '@/components/content/ArticleCard';
import ArticleHeader, {
  ArticleAuthorBox,
  ArticleTagShare,
} from '@/components/content/ArticleHeader';
import ArticleSidebar from '@/components/content/ArticleSidebar';
import CommentForm from '@/components/content/CommentForm';
import CommentList from '@/components/content/CommentList';
import {
  fetchArticleBySlug,
  fetchArticles,
  fetchCategories,
  fetchCommentsByPost,
  withArticleMeta,
  withCategoryNames,
} from '@/lib/wordpress/rest';

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

/** Rough reading time, the way the Agntix template estimates it. */
function estimateReadingTime(html: string): number {
  const words = html.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * A single article.
 *
 * The layout is the Agntix `blog-details` template: the breadcrumb banner of
 * `BlogStandardBreadCrumb`, the article column with the `postbox-details`
 * header, the cover image, the body, the tag and share row and the author
 * card - plus the sidebar with the search, the author, the categories, the
 * latest posts and the tags, and the comment block underneath.
 */
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

  const [withMeta] = await withArticleMeta([withNames]);
  const articleData = withMeta ?? withNames;

  // Related articles: newest posts from the first category of this article.
  const primaryCategoryId = articleData.categories[0];
  const relatedResult = await fetchArticles({
    perPage: 4,
    category: primaryCategoryId,
  });
  const related = (
    await withArticleMeta(await withCategoryNames(relatedResult.articles))
  ).filter((item) => item.id !== articleData.id);

  // The sidebar: every category, the latest posts and the comments.
  const [categories, latestResult, comments] = await Promise.all([
    fetchCategories(),
    fetchArticles({ perPage: 3 }),
    fetchCommentsByPost(articleData.id).catch(() => []),
  ]);
  const latest = await withArticleMeta(await withCategoryNames(latestResult.articles));

  // The category of this article, resolved to its slug for the breadcrumb.
  const primaryCategory = categories.find(
    (category) => category.id === primaryCategoryId,
  );

  const readingTime = estimateReadingTime(articleData.content);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: articleData.title,
    description: articleData.excerpt.slice(0, 300),
    datePublished: articleData.date,
    dateModified: articleData.modified,
    image: articleData.image?.url,
    author: { '@type': 'Organization', name: articleData.authorName },
    publisher: {
      '@type': 'Organization',
      name: 'AutoSPA Jakarta',
      url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3100',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/blog/${articleData.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* The breadcrumb banner of the Agntix `blog-details` template. */}
      <section className="relative overflow-hidden bg-background-8 pb-14 pt-32 md:pb-16 md:pt-40">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/15 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background-8 via-background-8/70 to-background-8/30" />

        <div className="relative mx-auto max-w-[1536px] px-6 md:px-10">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-white/50">
            <Link href="/" className="transition-colors hover:text-primary-500">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog" className="transition-colors hover:text-primary-500">
              Blog
            </Link>
            {primaryCategory ? (
              <>
                <span aria-hidden="true">/</span>
                <Link
                  href={`/blog?category=${primaryCategory.slug}`}
                  className="transition-colors hover:text-primary-500"
                >
                  {primaryCategory.name}
                </Link>
              </>
            ) : null}
          </nav>
        </div>
      </section>

      <section className="bg-background-8 pb-24 pt-12">
        <div className="mx-auto max-w-[1536px] px-6 md:px-10">
          <div className="grid gap-12 lg:grid-cols-12">
            {/* The article */}
            <div className="lg:col-span-8">
              <article>
                <ArticleHeader
                  article={articleData}
                  readingTime={readingTime}
                  commentCount={comments.length}
                />

                {/* The cover image */}
                {articleData.image ? (
                  <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-[20px] bg-white/[0.04]">
                    <Image
                      src={articleData.image.largeUrl}
                      alt={articleData.image.alt || articleData.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 820px"
                      priority
                      className="object-cover"
                    />
                  </div>
                ) : null}

                {/* The body - the reading measure is the article column itself */}
                <div className="mt-10">
                  <ArticleBody html={articleData.content} className="max-w-none" />
                </div>

                <ArticleTagShare tagNames={articleData.tagNames} slug={articleData.slug} />

                <ArticleAuthorBox article={articleData} />

                <Link
                  href="/blog"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary-500 hover:underline"
                >
                  &larr; Kembali ke semua artikel
                </Link>
              </article>

              {/* Related articles */}
              {related.length > 0 ? (
                <section className="mt-16 border-t border-white/10 pt-12">
                  <h2 className="text-2xl font-bold text-white md:text-3xl">
                    Artikel terkait
                  </h2>
                  <div className="mt-8 grid gap-10 md:grid-cols-2">
                    {related.slice(0, 2).map((item) => (
                      <ArticleCard key={item.id} article={item} />
                    ))}
                  </div>
                </section>
              ) : null}

              {/* The comments - the Agntix `postbox__comment` block */}
              <section className="mt-16 border-t border-white/10 pt-12">
                <h2 className="text-2xl font-bold text-white md:text-3xl">
                  Comments ({comments.length.toString().padStart(2, '0')})
                </h2>

                <div className="mt-8">
                  <CommentList comments={comments} />
                </div>

                <div className="mt-12">
                  <h3 className="text-xl font-bold text-white">Leave a Reply</h3>
                  <p className="mt-2 text-sm text-white/50">
                    Email Anda tidak akan dipublikasikan. Kolom yang wajib diisi ditandai *.
                  </p>
                  <div className="mt-6">
                    <CommentForm articleTitle={articleData.title} />
                  </div>
                </div>
              </section>
            </div>

            {/* The sidebar */}
            <div className="lg:col-span-4">
              <ArticleSidebar
                categories={categories}
                latest={latest}
                tagNames={articleData.tagNames}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
