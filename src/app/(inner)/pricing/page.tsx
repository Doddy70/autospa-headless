import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { CtaBand } from '@/components/ui/CtaBand';
import { PackageCard } from '@/components/ui/PackageCard';
import { PageHero, SectionTitle } from '@/components/ui/SectionTitle';
import { SERVICES } from '@/data/services';

export const metadata: Metadata = {
	title: 'Pricing | AutoSPA Jakarta',
	description:
		'Packages for Premium Wash, Premium Detailing, Nano Ceramic Coating and 360° Paint Protection Film at AutoSPA Jakarta.',
	alternates: { canonical: '/pricing' },
};

/**
 * The pricing page.
 *
 * The production `/pricing` page still carries the theme demo content
 * ("Basic pack $9.99 / Per Month", "Bradley Gordon, CEO & Founder, Archin
 * Studio") and links to the theme demo site, so none of it is AutoSPA.
 *
 * The packages below are the ones the production service pages actually
 * publish. AutoSPA does not publish fixed prices - the price depends on the
 * vehicle and its condition - so no price is invented here; every card asks
 * for a quote instead.
 */
const PACKAGES = SERVICES.flatMap((service) =>
	service.packages.map((pkg) => ({
		...pkg,
		service: service.title,
		serviceSlug: service.slug,
	})),
);

export default function PricingPage() {
	return (
		<>
			<PageHero
				title="Pricing"
				subtitle="Every AutoSPA package, with everything it includes. Prices depend on your vehicle and its condition - our Service Advisor confirms the quote before the work starts."
				crumbs={[{ label: 'Pricing' }]}
			/>

			<section className="bg-background-8 px-6 py-16 md:py-20">
				<div className="mx-auto max-w-6xl">
					<SectionTitle
						eyebrow="Packages"
						title="Choose the package that fits your vehicle"
						description="We always keep up with the times and use the best products for Indonesia weather, providing a long-lasting protection that enhances the appearance and value of the car."
					/>

					<div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{PACKAGES.map((pkg) => (
							<PackageCard
								key={`${pkg.serviceSlug}-${pkg.name}`}
								name={pkg.name}
								summary={pkg.summary || pkg.service}
								includes={pkg.includes}
								ctaLabel="View Pricing"
								ctaHref={`/services/${pkg.serviceSlug}`}
							/>
						))}
					</div>

					<p className="mt-12 text-center text-sm text-white/50">
						Looking for something else?{' '}
						<Link
							href="/services"
							className="inline-flex items-center gap-1 font-semibold text-primary-500 transition-colors hover:text-primary-400"
						>
							See all services
							<ArrowRight className="size-3.5" />
						</Link>
					</p>
				</div>
			</section>

			<CtaBand
				eyebrow="Free Consultation"
				title="Still have a question? Just ask us anything"
				description="Tell us about your vehicle and our Service Advisor will recommend the right package."
			/>
		</>
	);
}
