import { PenLine } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import type { RestArticle } from '@/lib/wordpress/rest';
import { formatArticleDate } from './ArticleCard';

/**
 * The header of a single article - the `postbox-details-item` of the Agntix
 * `blog-details` template.
 *
 * The template draws it as a rounded box with a hairline border (padding
 * 43/45, radius 20), the category and the reading time as two tags
 * separated by a dot, and the meta row - author, date, comments - with a
 * hairline divider between the columns.
 */
export default function ArticleHeader({
  article,
  readingTime,
  commentCount,
}: {
  article: RestArticle;
  /** Estimated reading time in minutes. */
  readingTime: number;
  commentCount: number;
}) {
  const category = article.categoryNames[0];

  return (
    <header className="rounded-[20px] border border-white/[0.08] p-8 md:p-11">
      <div className="mb-2 flex flex-wrap items-center gap-x-3 text-[15px] font-medium text-white/60 md:text-[16px] md:font-semibold">
        {category ? (
          <span className="inline-flex items-center">
            <PenLine className="mr-[5px] size-[15px]" />
            {category}
          </span>
        ) : null}
        {category ? (
          // The dot between the two tags of the template.
          <span aria-hidden="true" className="relative inline-block pl-[9px]">
            <span className="absolute left-0 top-1.5 size-1 rounded-full bg-white/60" />
          </span>
        ) : null}
        <span>{readingTime} min read</span>
      </div>

      <h1 className="mt-3 text-3xl font-bold leading-[1.15] tracking-[-1px] text-white md:text-4xl lg:text-[46px]">
        {article.title}
      </h1>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
            <Image
              src="/assets/auto-logo.png"
              alt={article.authorName}
              fill
              sizes="44px"
              className="object-contain p-2"
            />
          </div>
          <h4 className="text-sm font-bold text-white/60">{article.authorName}</h4>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 border-l border-white/10 pl-4 text-sm text-white/60">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
          <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
        </div>

        {/* Comments */}
        <div className="flex items-center gap-2 border-l border-white/10 pl-4 text-sm text-white/60">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>
            {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
          </span>
        </div>
      </div>
    </header>
  );
}

/**
 * The "about the author" block under the article.
 *
 * Ported from the Agntix `postbox-details-author`: the author portrait, a
 * short bio and the social links.
 */
export function ArticleAuthorBox({ article }: { article: RestArticle }) {
  return (
    <section className="mt-12 rounded-[20px] border border-white/[0.08] bg-background-7 p-7 md:p-9">
      <div className="flex items-start gap-6">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
          <Image
            src="/assets/auto-logo.png"
            alt={article.authorName}
            fill
            sizes="80px"
            className="object-contain p-3"
          />
        </div>

        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-500">
            About Author
          </span>
          <h3 className="mt-2 text-xl font-bold text-white">{article.authorName}</h3>
          <p className="mt-3 text-[15px] font-medium leading-[1.6] text-white/60">
            Tim AutoSPA Jakarta menulis tentang detailing, coating, dan perawatan
            kendaraan - berdasarkan pengalaman harian di workshop kami.
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * The tag cloud and the share links under the article.
 *
 * Ported from the Agntix `postbox-details-tag-wrap`.
 */
export function ArticleTagShare({
  tagNames,
  slug,
}: {
  tagNames: string[];
  slug: string;
}) {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/blog/${slug}`;
  const encoded = encodeURIComponent(url);

  return (
    <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-white/[0.08] pt-8">
      {tagNames.length > 0 ? (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-white/50">Tagged with:</span>
          <div className="flex flex-wrap gap-2">
            {tagNames.map((tag) => (
              <Link
                key={tag}
                href={`/blog?search=${encodeURIComponent(tag)}`}
                className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-primary-500/60 hover:text-primary-500"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <span />
      )}

      <div className="flex items-center gap-2">
        <SocialLink
          href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
          label="Bagikan ke Facebook"
          path="M14 8h3V5h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z"
        />
        <SocialLink
          href={`https://twitter.com/intent/tweet?url=${encoded}`}
          label="Bagikan ke X"
          path="M4 4l7.5 9.5L4.5 20h2.2l5.7-6 4.3 6H20l-7.8-9.9L18.6 4h-2.2l-5.2 5.5L7.4 4z"
        />
        <SocialLink
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
          label="Bagikan ke LinkedIn"
          path="M6.5 8.5H3.4V21h3.1zM5 7.4a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8zM21 13.9c0-3.6-1.9-5.4-4.5-5.4-2.1 0-3 1.1-3.5 1.9V8.5H9.9V21H13v-6.9c0-1.4.8-2.6 2.3-2.6s2.3 1.1 2.3 2.6V21h3.1z"
        />
      </div>
    </div>
  );
}

function SocialLink({
  href,
  label,
  path,
}: {
  href: string;
  label: string;
  path: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid size-10 place-items-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-primary-500/60 hover:text-primary-500"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d={path} />
      </svg>
    </a>
  );
}
