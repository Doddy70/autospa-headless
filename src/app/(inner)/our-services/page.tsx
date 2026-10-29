import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { CtaBand } from '@/components/ui/CtaBand';
import { PackageCard } from '@/components/ui/PackageCard';
import { PageHero, SectionTitle } from '@/components/ui/SectionTitle';
import { BRANCHES } from '@/data/contact';
import { SERVICES } from '@/data/services';

export const metadata: Metadata = {
	title: 'Our Services | AutoSPA Jakarta',
	description:
		'Premium Wash, Premium Detailing, Premium Coating, Premium 360° PPF, Engine & Glass dan Rust Protection - AutoSPA Jakarta.',
	alternates: { canonical: '/our-services' },
};

/**
 * The service catalogue page.
 *
 * The copy and the imagery come from the production "Our Services" page
 * (`/our-services/`) and the single service pages; the packages themselves
 * are the ones the production site publishes for each service.
 */
export default function OurServicesPage() {
	const featured = SERVICES.filter((service) => service.packages.length > 0);

	return (
		<>
			<PageHero
				title="Our Services"
				subtitle="We always keep up with the times and use the best products for Indonesia weather, providing a long-lasting protection that enhances the appearance and value of the car."
				crumbs={[{ label: 'Our Services' }]}
			/>

			{/* The catalogue */}
			<section className="bg-background-8 px-6 py-16 md:py-20">
				<div className="mx-auto max-w-6xl">
					<SectionTitle eyebrow="What We Offer" title="Premium care for every part of your vehicle" />

					<div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{SERVICES.map((service) => (
							<article
								key={service.slug}
								className="group flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-background-7 transition-all duration-300 hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10"
							>
								<div className="relative aspect-[4/3] overflow-hidden">
									<Image
										src={service.image}
										alt={service.title}
										fill
										sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
										className="object-cover transition-transform duration-500 group-hover:scale-105"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-background-7 via-background-7/30 to-transparent" />
									<span className="absolute left-5 top-5 rounded-full bg-primary-500 px-3 py-1 text-xs font-bold tracking-wider text-white">
										{service.number}
									</span>
								</div>

								<div className="flex flex-1 flex-col p-6">
									<h3 className="text-xl font-bold text-white">{service.title}</h3>
									<p className="mt-3 flex-1 text-sm leading-relaxed text-white/60">
										{service.description}
									</p>

									<Link
										href={`/services/${service.slug}`}
										className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-500 transition-colors hover:gap-3"
									>
										View Services
										<ArrowRight className="size-4" />
									</Link>
								</div>
							</article>
						))}
					</div>
				</div>
			</section>

			{/* The packages */}
			<section className="bg-background-8 px-6 py-16 md:py-20">
				<div className="mx-auto max-w-6xl">
					<SectionTitle
						eyebrow="Packages"
						title="Choose the package that fits your vehicle"
						description="Every package below is published on autospajakarta.com. Prices depend on the vehicle, so our Service Advisor confirms the quote before the work starts."
					/>

					<div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{featured.map((service) =>
							service.packages.map((pkg, index) => (
								<PackageCard
									key={`${service.slug}-${pkg.name}`}
									name={pkg.name}
									summary={pkg.summary || service.title}
									includes={pkg.includes}
									featured={index === 0 && service.slug === 'premium-wash'}
									ctaHref={`/services/${service.slug}`}
								/>
							)),
						)}
					</div>
				</div>
			</section>

			{/* The locations */}
			<section className="bg-background-8 px-6 pb-16 md:pb-20">
				<div className="mx-auto max-w-6xl">
					<SectionTitle
						eyebrow="Our Locations"
						title="Ten workshops across Greater Jakarta"
						description="We provide premium materials designed to meet the highest standards of quality and durability - at every AutoSPA workshop."
					/>

					<ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{BRANCHES.map((branch) => (
							<li
								key={branch.slug}
								className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-background-7 px-5 py-4"
							>
								<span className="text-sm font-medium text-white">{branch.name}</span>
								<Link
									href="/contact"
									className="shrink-0 text-xs font-semibold uppercase tracking-wider text-primary-500 transition-colors hover:text-primary-400"
								>
									Detail
								</Link>
							</li>
						))}
					</ul>
				</div>
			</section>

			<CtaBand
				eyebrow="Free Consultation"
				title="Still have a question? Just ask us anything"
				description="Our Service Advisor will recommend the right package for your vehicle."
			/>
		</>
	);
}
