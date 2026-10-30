import Link from 'next/link';

/**
 * The pagination of the blog listing.
 *
 * Ported from the Agntix `BlogListPagination`: a row of square buttons where
 * the current page is filled and the previous/next page are chevrons. The
 * Agntix markup is Bootstrap, so the buttons are rebuilt with Tailwind and
 * the AutoSPA tokens.
 */
export default function BlogPagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  /** Builds the link of a page number. */
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  // A window of five pages around the current one, clamped to the range.
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  const numbers: number[] = [];
  for (let index = start; index <= end; index += 1) numbers.push(index);

  return (
    <nav aria-label="Pagination" className="mt-16 flex items-center justify-center gap-2">
      {page > 1 ? (
        <Link
          href={buildHref(page - 1)}
          aria-label="Halaman sebelumnya"
          className="grid size-12 place-items-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-primary-500/60 hover:text-primary-500"
        >
          <Chevron direction="left" />
        </Link>
      ) : (
        <span
          aria-hidden="true"
          className="grid size-12 place-items-center rounded-full border border-white/5 text-white/20"
        >
          <Chevron direction="left" />
        </span>
      )}

      {numbers.map((number) =>
        number === page ? (
          <span
            key={number}
            aria-current="page"
            className="grid size-12 place-items-center rounded-full bg-primary-500 text-sm font-semibold text-white"
          >
            {number}
          </span>
        ) : (
          <Link
            key={number}
            href={buildHref(number)}
            className="grid size-12 place-items-center rounded-full border border-white/10 text-sm font-semibold text-white/70 transition-colors hover:border-primary-500/60 hover:text-primary-500"
          >
            {number}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link
          href={buildHref(page + 1)}
          aria-label="Halaman berikutnya"
          className="grid size-12 place-items-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-primary-500/60 hover:text-primary-500"
        >
          <Chevron direction="right" />
        </Link>
      ) : (
        <span
          aria-hidden="true"
          className="grid size-12 place-items-center rounded-full border border-white/5 text-white/20"
        >
          <Chevron direction="right" />
        </span>
      )}
    </nav>
  );
}

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={direction === 'left' ? { transform: 'rotate(180deg)' } : undefined}
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}
