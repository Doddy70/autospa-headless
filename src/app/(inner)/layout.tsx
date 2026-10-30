/**
 * Shared layout for every inner (non-home) page.
 *
 * The route group `(inner)` does not appear in the URL, so the public paths
 * stay exactly the same as before - `/about`, `/services`, `/blog`, ... - while
 * the pages now share one navigation bar instead of each page importing the
 * homepage navbar on its own.
 *
 * The navigation itself lives in the root layout (a fixed bar that floats
 * over the homepage hero), so the pages only have to reserve the space it
 * takes.
 */
export default function InnerLayout({ children }: { children: React.ReactNode }) {
	return <div className="pt-header">{children}</div>;
}
