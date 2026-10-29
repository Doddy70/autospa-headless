import Navbar from '@/components/home/hero/Navbar';

/**
 * Shared layout for every inner (non-home) page.
 *
 * The route group `(inner)` does not appear in the URL, so the public paths
 * stay exactly the same as before - `/about`, `/services`, `/blog`, ... - while
 * the pages now share one navigation bar instead of each page importing the
 * homepage navbar on its own.
 */
export default function InnerLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background-8/85 backdrop-blur-md">
				<Navbar />
			</header>
			{children}
		</>
	);
}
