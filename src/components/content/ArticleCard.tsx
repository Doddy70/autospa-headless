import Link from 'next/link';

import type { RestArticle } from '@/lib/wordpress/rest';

export function formatArticleDate(value: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'long',
    timeZone: 'Asia/Jakarta',
  }).format(new Date(value));
}

export default function ArticleCard({ article }: { article: RestArticle }) {
  const category = article.categoryNames[0];

  return (
    <article className="group flex h-full flex-col rounded-[20px] border border-white/10 bg-background-7 p-6 transition-all duration-300 hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10">
      {category ? (
        <span className="mb-3 inline-flex w-fit rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-500">
          {category}
        </span>
      ) : null}

      <h2 className="text-lg font-bold leading-snug text-white transition-colors group-hover:text-primary-500">
        <Link href={`/blog/${article.slug}`}>{article.title}</Link>
      </h2>

      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-accent/60">
        {article.excerpt}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-accent/50">
        <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
        <Link
          href={`/blog/${article.slug}`}
          className="font-semibold text-primary-500 hover:underline"
        >
          Baca selengkapnya
        </Link>
      </div>
    </article>
  );
}
