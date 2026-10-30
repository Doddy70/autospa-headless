import { PenLine } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import type { RestArticle } from '@/lib/wordpress/rest';

export function formatArticleDate(value: string): string {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'long',
    timeZone: 'Asia/Jakarta',
  }).format(date);
}

/**
 * The article card of the blog listing.
 *
 * Ported from the Agntix `BlogGridTwoItem`: a bordered box (radius 20, a
 * hairline white border) with a byline row - author thumb and name on the
 * left, the date on the right - above the thumbnail, the category as an
 * editable tag, the headline and the double arrow "Read More" link.
 *
 * The Agntix markup is Bootstrap + SCSS (`tp-blog-masonry-item`), which does
 * not exist here, so the structure is rebuilt with Tailwind and the AutoSPA
 * tokens. The measurements of the template are kept: 15/30 padding, a 14px
 * thumb radius, a 26px headline and a 16px read-more label.
 */
export default function ArticleCard({ article }: { article: RestArticle }) {
  const category = article.categoryNames[0];

  return (
    <article className="group flex h-full flex-col rounded-[20px] border border-white/[0.08] p-[30px_15px] transition-[transform,border-color] duration-700 hover:border-primary-500/40">
      {/* Byline: author on the left, publication date on the right */}
      <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] px-[15px] pb-[30px]">
        <div className="flex items-center">
          <div className="relative mr-3 size-10 shrink-0 overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
            <Image
              src="/assets/auto-logo.png"
              alt={article.authorName}
              fill
              sizes="40px"
              className="object-contain p-2"
            />
          </div>
          <div className="leading-none">
            <span className="mb-2 inline-block text-[16px] font-bold tracking-[-0.16px] text-white/90">
              {article.authorName}
            </span>
            <p className="m-0 text-[13px] font-medium leading-none text-white/60">
              Administrator
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <span className="inline-flex items-center text-[13px] font-medium text-white/60 lg:text-[15px]">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="mr-[5px]"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
          </span>
        </div>
      </div>

      {/* Thumbnail - the template zooms it 1.1 on hover */}
      <Link
        href={`/blog/${article.slug}`}
        className="relative mt-[30px] block aspect-[16/10] w-full overflow-hidden rounded-[14px] bg-white/[0.04]"
      >
        {article.image ? (
          <Image
            src={article.image.url}
            alt={article.image.alt || article.title}
            fill
            sizes="(max-width: 1024px) 100vw, 620px"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <span className="grid size-full place-items-center text-sm text-white/30">
            AutoSPA Jakarta
          </span>
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-background-8/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </Link>

      {/* Category, headline and the read more link */}
      <div className="flex flex-1 flex-col px-[15px] pt-[30px]">
        {category ? (
          <span className="mb-[15px] inline-flex items-center text-[15px] font-medium text-white/60">
            <PenLine className="mr-[5px] size-[15px]" />
            {category}
          </span>
        ) : null}

        <h2 className="mb-7 text-[22px] font-semibold leading-[1.3] tracking-[-0.52px] text-white lg:text-[26px]">
          <Link
            href={`/blog/${article.slug}`}
            className="underline-offset-[6px] decoration-1 transition-colors duration-300 hover:text-primary-500 hover:underline"
          >
            {article.title}
          </Link>
        </h2>

        {article.excerpt ? (
          <p className="mb-6 line-clamp-3 flex-1 text-[15px] font-medium leading-relaxed text-white/60">
            {article.excerpt}
          </p>
        ) : null}

        {/* The read more link: the two arrows slide diagonally on hover, the
            way the template animates them. */}
        <Link
          href={`/blog/${article.slug}`}
          className="group/read inline-flex w-fit items-center pr-[5px] text-[16px] font-semibold leading-[1.1] text-primary-500 transition-colors hover:text-primary-400"
        >
          Baca selengkapnya
          <span className="relative ml-[5px] inline-flex overflow-hidden">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="translate-y-[-2px] transition-transform duration-200 ease-out group-hover/read:translate-x-5 group-hover/read:-translate-y-5 group-hover/read:opacity-0"
            >
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="absolute -translate-x-[22px] translate-y-[-22px] transition-transform duration-200 ease-out group-hover/read:translate-x-[23px] group-hover/read:-translate-y-[23px]"
            >
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </span>
        </Link>
      </div>
    </article>
  );
}
