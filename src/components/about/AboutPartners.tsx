import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

/**
 * The partner rows of the About page.
 *
 * The Agntix template (`src/components/service/AboutUsService.tsx`) lists
 * the services as rows: a number on the left, the title and its categories
 * next to it, an arrow on the right. Here the rows are the partners whose
 * products AutoSPA works with - the section the production page calls "A
 * World-Class Arsenal".
 *
 * The rows are links to the services that use those products, so the section
 * is a way into the catalogue rather than a dead end.
 */

interface AboutPartnerRow {
	/** The number of the row, e.g. "01". */
	number: string;
	/** The name of the partner. */
	name: string;
	/** Where the partner comes from. */
	origin: string;
	/** What the partner's products do. */
	description: string;
	/** Where the row leads to. */
	href: string;
}

interface AboutPartnersProps {
	rows: AboutPartnerRow[];
	/** The label above the headline. */
	eyebrow?: string;
	/** The headline. */
	title?: string;
	/** The line under the headline. */
	description?: string;
	/** The label of the call to action. */
	ctaLabel?: string;
	/** The target of the call to action. */
	ctaHref?: string;
	className?: string;
}

export function AboutPartners({
	rows,
	eyebrow = 'Our Partners',
	title = 'A world-class arsenal',
	description =
		'We understand that premium vehicles require global-standard care. Therefore, AutoSpa exclusively collaborates with and utilizes flagship products from the pioneers of the global automotive care industry.',
	ctaLabel = 'Lihat Layanan',
	ctaHref = '/services',
	className = '',
}: AboutPartnersProps) {
	return (
		<section className={`bg-background-8 px-6 py-20 md:py-28 ${className}`}>
			<div className="mx-auto max-w-6xl">
				<div className="grid gap-8 lg:grid-cols-12 lg:items-end">
					<div className="lg:col-span-3">
						<span className="text-sm font-semibold tracking-[0.2em] text-primary-500 uppercase">
							{eyebrow}
						</span>
					</div>

					<div className="lg:col-span-6">
						<h2 className="text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
							{title}
						</h2>
					</div>

					<div className="lg:col-span-3">
						<p className="text-base leading-relaxed text-white/60">{description}</p>

						<Link
							href={ctaHref}
							className="btn btn-lg btn-primary mt-6 group inline-flex"
						>
							{ctaLabel}
							<ArrowUpRight className="ml-2 size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
						</Link>
					</div>
				</div>

				<div className="mt-14 border-t border-white/10">
					{rows.map((row) => (
						<Link
							key={row.number}
							href={row.href}
							className="group grid gap-4 border-b border-white/10 py-8 transition-colors hover:bg-white/[0.03] md:grid-cols-12 md:items-start md:gap-8"
						>
							<span className="text-sm font-semibold tracking-[0.2em] text-primary-500 md:col-span-1">
								{row.number}
							</span>

							<div className="md:col-span-4">
								<h3 className="text-xl font-bold text-white transition-colors group-hover:text-primary-500 md:text-2xl">
									{row.name}
								</h3>
								<p className="mt-1 text-sm text-white/45">{row.origin}</p>
							</div>

							<p className="text-base leading-relaxed text-white/60 md:col-span-6">
								{row.description}
							</p>

							<span className="justify-self-start md:col-span-1 md:justify-self-end">
								<ArrowUpRight className="size-6 text-white/40 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary-500" />
							</span>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}

export default AboutPartners;
