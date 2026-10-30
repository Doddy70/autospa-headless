import Image from 'next/image';
import Link from 'next/link';

import type { RestArticle, RestCategory } from '@/lib/wordpress/rest';
import { formatArticleDate } from './ArticleCard';

/**
 * The sidebar of the article page.
 *
 * Ported from the Agntix `blog-details` sidebar: a search field (60px tall,
 * radius 14), the author card, the category list, the latest posts and the
 * tag cloud. The Agntix markup is Bootstrap + SCSS (`sidebar-widget`), so the
 * widgets are rebuilt with Tailwind and the AutoSPA tokens - the green of
 * the template becomes the AutoSPA brand blue.
 */
export default function ArticleSidebar({
  categories,
  latest,
  tagNames,
}: {
  categories: RestCategory[];
  latest: RestArticle[];
  tagNames: string[];
}) {
  return (
    <aside className="space-y-8">
      {/* Search */}
      <div className="rounded-[14px]">
        <form action="/blog" method="get" role="search">
          <label htmlFor="blog-search" className="sr-only">
            Cari artikel
          </label>
          <div className="relative">
            <input
              id="blog-search"
              name="search"
              type="search"
              placeholder="Cari artikel..."
              className="h-[60px] w-full rounded-[14px] border border-transparent bg-[#1a1b1e] px-6 pr-[50px] text-[18px] font-medium text-white outline-none transition-colors placeholder:text-white/30 focus:border-primary-500 focus:bg-[#0E0F11]"
            />
            <button
              type="submit"
              aria-label="Cari"
              className="absolute right-6 top-0 flex h-full items-center text-white transition-colors hover:text-primary-500"
            >
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
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Author card */}
      <div className="rounded-[14px] border border-white/[0.06] p-8 text-center md:p-10">
        <div className="relative mx-auto size-[120px] overflow-hidden rounded-full bg-white/5">
          <Image
            src="/assets/auto-logo.png"
            alt="AutoSPA Jakarta"
            fill
            sizes="120px"
            className="object-contain p-5"
          />
        </div>

        <h3 className="mt-8 text-[22px] font-semibold leading-none tracking-[-0.02em] text-white">
          AutoSPA Jakarta
        </h3>
        <span className="mt-2 mb-5 inline-block text-[14px] font-medium leading-none text-white/40">
          Detail &amp; Coating Specialist
        </span>
        <p className="mb-5 text-[17px] font-medium leading-[1.5] text-white/70">
          Premium automotive detailing di Jakarta - wash, detailing, ceramic
          coating, dan paint protection.
        </p>

        <Link
          href="/contact"
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-primary-500 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
        >
          Hubungi Kami
        </Link>
      </div>

      {/* Categories */}
      {categories.length > 0 ? (
        <div>
          <h3 className="mb-7 text-[24px] font-semibold leading-none tracking-[-0.02em] text-white">
            Category
          </h3>
          <ul>
            {categories.map((category) => (
              <li key={category.id} className="mb-1.5 last:mb-0">
                <Link
                  href={`/blog?category=${category.slug}`}
                  className="inline-flex items-center gap-3 rounded-[14px] bg-[#1a1b1e] px-5 py-3 text-[16px] font-medium leading-none tracking-[-0.01em] text-white/80 transition-colors hover:text-primary-500"
                >
                  <span>{category.name}</span>
                  <span className="text-white/40 transition-colors group-hover:text-primary-500">
                    ({category.count})
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Latest posts */}
      {latest.length > 0 ? (
        <div>
          <h3 className="mb-7 text-[24px] font-semibold leading-none tracking-[-0.02em] text-white">
            Latest Posts
          </h3>
          <ul className="space-y-5">
            {latest.map((post) => (
              <li key={post.id} className="flex items-center gap-4">
                <Link
                  href={`/blog/${post.slug}`}
                  className="relative size-16 shrink-0 overflow-hidden rounded-[14px] bg-white/5"
                >
                  {post.image ? (
                    <Image
                      src={post.image.squareUrl}
                      alt={post.image.alt || post.title}
                      fill
                      sizes="64px"
                      className="object-cover transition-transform duration-500 hover:scale-110"
                    />
                  ) : null}
                </Link>
                <div className="min-w-0">
                  {post.categoryNames[0] ? (
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-500">
                      {post.categoryNames[0]}
                    </span>
                  ) : null}
                  <h4 className="mt-1 text-sm font-semibold leading-snug text-white">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="line-clamp-2 transition-colors hover:text-primary-500"
                    >
                      {post.title}
                    </Link>
                  </h4>
                  <time dateTime={post.date} className="mt-1.5 block text-xs text-white/40">
                    {formatArticleDate(post.date)}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Tags */}
      {tagNames.length > 0 ? (
        <div>
          <h3 className="mb-7 text-[24px] font-semibold leading-none tracking-[-0.02em] text-white">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {tagNames.map((tag) => (
              <Link
                key={tag}
                href={`/blog?search=${encodeURIComponent(tag)}`}
                className="inline-block rounded-[14px] bg-[#1a1b1e] px-4 py-2.5 text-[16px] font-medium leading-none capitalize text-white/80 transition-colors hover:bg-primary-500 hover:text-white"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  );
}
