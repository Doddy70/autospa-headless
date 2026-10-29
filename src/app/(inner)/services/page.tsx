import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Car, Droplets, Lock, Shield, Sparkles, Wrench } from 'lucide-react';

import { SERVICES, type ServiceIcon } from '@/data/services';

export const metadata: Metadata = {
	title: 'Our Services | AutoSPA Jakarta',
	description:
		'Premium Wash, Premium Detailing, Premium Coating, Premium 360° PPF, Engine & Glass, dan Rust Protection - AutoSPA Jakarta.',
	alternates: { canonical: '/services' },
};

const ICONS: Record<ServiceIcon, typeof Shield> = {
	shield: Shield,
	sparkles: Sparkles,
	car: Car,
	lock: Lock,
	droplet: Droplets,
	wrench: Wrench,
};

/**
 * The static services page.
 *
 * The six services and every line of copy come from the production site -
 * see `src/data/services.ts` for the per-service sources.
 */
export default function ServicesPage() {
	return (
		<div className="min-h-screen bg-background-8 pt-24">
			{/* Hero */}
			<section className="relative px-6 py-20">
				<div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-transparent" />
				<div className="relative mx-auto max-w-6xl text-center">
					<span className="text-sm font-semibold uppercase tracking-wider text-primary-500">
						Our Services
					</span>
					<h1 className="mt-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
						What We Offer
					</h1>
					<p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
						We always keep up with the times and use the best products for Indonesia
						weather, providing a long-lasting protection that enhances the appearance and
						value of the car.
					</p>
				</div>
			</section>

			{/* Service cards */}
			<section className="px-6 pb-20">
				<div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
					{SERVICES.map((service) => {
						const Icon = ICONS[service.icon];

						return (
							<article
								key={service.slug}
								className="group flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-background-7 transition-all duration-300 hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10"
							>
								<div className="relative aspect-[4/3] overflow-hidden">
									<img
										src={service.image}
										alt={service.title}
										loading="lazy"
										className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-background-7 via-background-7/30 to-transparent" />
									<span className="absolute left-5 top-5 rounded-full bg-primary-500 px-3 py-1 text-xs font-bold tracking-wider text-white">
										{service.number}
									</span>
								</div>

								<div className="flex flex-1 flex-col p-6">
									<div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary-500/10">
										<Icon className="size-6 text-primary-500" strokeWidth={1.5} />
									</div>

									<h2 className="text-xl font-bold text-white">{service.title}</h2>
									<p className="mt-3 flex-1 text-sm leading-relaxed text-accent/60">
										{service.tagline}
									</p>

									<Link
										href={`/services/${service.slug}`}
										className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-500 transition-colors hover:gap-3"
									>
										Lihat detail
										<ArrowRight className="size-4" />
									</Link>
								</div>
							</article>
						);
					})}
				</div>
			</section>

			{/* CTA */}
			<section className="relative overflow-hidden border-t border-white/5 px-6 py-20">
				<div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-primary-500/10" />
				<div className="relative mx-auto max-w-3xl text-center">
					<h2 className="text-3xl font-bold text-white md:text-4xl">
						Still have a question? Just ask us anything
					</h2>
					<p className="mt-4 text-white/70">
						Our Service Advisor will recommend the right package for your vehicle.
					</p>
					<Link
						href="/contact"
						className="btn btn-lg btn-primary group mt-8 inline-flex"
					>
						Book Sekarang
						<ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
					</Link>
				</div>
			</section>
		</div>
	);
}
