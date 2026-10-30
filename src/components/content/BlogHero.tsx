import Link from 'next/link';

/**
 * The hero of the blog listing.
 *
 * Ported from the Agntix `BlogListBreadCrumb`: a full-bleed banner with a
 * small eyebrow ("Blog Post" plus an arrow), an oversized headline and a
 * round scroll-down button that jumps to the grid. The Agntix markup is
 * Bootstrap + SCSS (`tp-breadcrumb-area`), so the structure is rebuilt here
 * with Tailwind and the AutoSPA tokens.
 */
export default function BlogHero({
  eyebrow = 'News & Insight',
  title = 'Cerita, panduan, dan insights',
  description = 'Panduan praktis seputar detailing, coating, dan perawatan kendaraan dari tim AutoSPA Jakarta.',
  image,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Background image of the banner. */
  image?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-background-8 pb-16 pt-32 md:pb-20 md:pt-40">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          className="absolute inset-0 size-full object-cover opacity-25"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/15 via-transparent to-transparent" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background-8 via-background-8/70 to-background-8/30" />

      <div className="relative mx-auto max-w-[1536px] px-6 md:px-10">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/50">
          <Link href="/" className="transition-colors hover:text-primary-500">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-white/80">Blog</span>
        </nav>

        <span className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary-500">
          <span className="h-2 w-2 rounded-full bg-primary-500" />
          {eyebrow}
        </span>

        <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-[1.08] text-white md:text-5xl lg:text-[64px]">
          {title}
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg">
          {description}
        </p>

        {/* The scroll-down button of the Agntix banner. */}
        <a
          href="#down"
          aria-label="Gulir ke daftar artikel"
          className="mt-10 inline-grid size-14 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-primary-500 hover:text-primary-500"
        >
          <svg
            width="16"
            height="9"
            viewBox="0 0 16 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M1 1L8 8L15 1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
