import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

import PackageRows from '@/components/showcase/PackageRows';
import ServiceVideoSection from '@/components/showcase/ServiceVideoSection';
import { BookingTrigger } from '@/components/booking/ReservationModal';
import { CtaBand } from '@/components/ui/CtaBand';
import { getServiceDetail, listServiceSlugs } from '@/lib/services/catalog';

export const revalidate = 300;

/* A service that only exists in WordPress still renders - it is generated on
   demand and cached from then on. */
export const dynamicParams = true;

export async function generateStaticParams() {
	const slugs = await listServiceSlugs();
	return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const service = await getServiceDetail(slug);

	if (!service) {
		return { title: 'Layanan tidak ditemukan' };
	}

	const canonical = service.card.href;
	const title = service.seo.title ?? `${service.card.title} | AutoSPA Jakarta`;
	const description = service.seo.description ?? service.tagline;

	return {
		title,
		description,
		alternates: { canonical },
		openGraph: {
			title,
			description,
			url: canonical,
			type: 'website',
			images: [{ url: service.card.image }],
		},
	};
}

/**
 * A service page.
 *
 * The layout is the Agntix portfolio detail video template
 * (`portfolios/portfolio-details-video`): a wide video frame that stays
 * pinned while the page scrolls, the facts of the service, the numbered
 * title with the description, and the navigation to the neighbouring
 * services.
 *
 * The content comes from the service catalogue, which reads WordPress and
 * falls back to the published mirror.
 */
export default async function ServicePage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const service = await getServiceDetail(slug);

	if (!service) {
		notFound();
	}

	const { card, related, prev, next } = service;

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: card.title,
		description: service.description,
		image: card.image,
		serviceType: card.title,
		provider: {
			'@type': 'AutoRepairShop',
			name: 'AutoSPA Jakarta',
			url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3200',
			telephone: '+62-819-3777-3888',
		},
		areaServed: 'Jakarta, Indonesia',
	};

	/* The facts of the service, the way the template lists them. */
	const facts = [
		{ label: 'Kategori', value: card.subtitle || 'Perawatan Kendaraan' },
		{
			label: 'Paket',
			value: service.packages.length > 0 ? `${service.packages.length} paket` : 'Sesuai kebutuhan',
		},
		{ label: 'Lokasi', value: 'Jakarta, Indonesia' },
		{ label: 'Ketersediaan', value: 'Setiap hari · 08.00 - 18.00' },
	];

	return (
		<div className="min-h-screen bg-background-8">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>

			{/* Header - the Agntix portfolio detail video layout. */}
			<ServiceVideoSection
				video={service.video}
				poster={card.image}
				title={card.title}
				tagline={service.tagline}
				description={service.description}
				number={card.number}
				category={card.subtitle || 'Perawatan Kendaraan'}
				facts={facts}
				prev={prev ? { title: prev.title, href: prev.href } : null}
				next={next ? { title: next.title, href: next.href } : null}
			/>

			<div className="mx-auto max-w-[1536px] px-6 md:px-10">
				{/* Call to action - the booking wizard opens with this service
				    already chosen. */}
				<div className="flex flex-col gap-3 border-b border-white/10 py-10 sm:flex-row">
					<BookingTrigger
						serviceSlug={card.slug}
						className="btn btn-lg btn-primary group"
					>
						Book Sekarang
						<ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
					</BookingTrigger>
				</div>

				{/* Benefits and highlights */}
				{(service.benefits.length > 0 || service.highlights.length > 0) && (
					<section className="grid gap-y-10 py-16 lg:grid-cols-12 lg:gap-x-[60px]">
						<div className="lg:col-span-5">
							<h2 className="text-2xl font-bold text-white md:text-3xl">
								Yang Anda dapatkan
							</h2>
						</div>

						<div className="lg:col-span-7">
							{service.benefits.length > 0 ? (
								<ul className="space-y-4">
									{service.benefits.map((benefit) => (
										<li
											key={benefit.title}
											className="flex items-start gap-3 rounded-[16px] border border-white/10 bg-background-7 p-5"
										>
											<span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-500/15">
												<Check className="size-3.5 text-primary-500" strokeWidth={3} />
											</span>
											<span>
												<span className="block text-sm font-semibold text-white">
													{benefit.title}
												</span>
												{benefit.description ? (
													<span className="mt-1 block text-sm leading-relaxed text-accent/65">
														{benefit.description}
													</span>
												) : null}
											</span>
										</li>
									))}
								</ul>
							) : null}

							{service.highlights.length > 0 ? (
								<ul className="mt-8 grid gap-4 md:grid-cols-3">
									{service.highlights.map((highlight) => (
										<li
											key={highlight}
											className="flex items-start gap-3 rounded-[16px] border border-white/10 bg-background-7 p-5 text-sm leading-relaxed text-accent/70"
										>
											<span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-500/15">
												<Check className="size-3.5 text-primary-500" strokeWidth={3} />
											</span>
											{highlight}
										</li>
									))}
								</ul>
							) : null}
						</div>
					</section>
				)}

				{/* Packages */}
				{service.packages.length > 0 ? (
					<section className="py-16">
						<h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">Paket layanan</h2>
						<p className="mb-10 max-w-2xl text-sm text-accent/60">
							Harga dan ketersediaan paket mengikuti kondisi kendaraan - hubungi tim kami untuk
							ketentuan terbaru.
						</p>

						<PackageRows
							packages={service.packages}
							image={card.image}
							alt={card.alt}
						/>
					</section>
				) : null}

				{/* Gallery */}
				{service.gallery.length > 0 ? (
					<section className="border-t border-white/10 py-16">
						<h2 className="mb-8 text-2xl font-bold text-white md:text-3xl">Gallery</h2>
						<div className="grid gap-4 sm:grid-cols-3">
							{service.gallery.map((image) => (
								<div
									key={image.url}
									className="overflow-hidden rounded-[16px] border border-white/10"
								>
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={image.url}
										alt={image.alt}
										loading="lazy"
										className="aspect-[4/3] size-full object-cover transition-transform duration-500 hover:scale-105"
									/>
								</div>
							))}
						</div>
					</section>
				) : null}

				{/* FAQ */}
				{service.faqs.length > 0 ? (
					<section className="border-t border-white/10 py-16">
						<h2 className="mb-8 text-2xl font-bold text-white md:text-3xl">
							{card.title} FAQs
						</h2>

						<div className="mx-auto max-w-3xl space-y-3">
							{service.faqs.map((faq) => (
								<details
									key={faq.question}
									className="group rounded-[16px] border border-white/10 bg-background-7 p-5 open:border-primary-500/40"
								>
									<summary className="cursor-pointer list-none text-sm font-semibold text-white marker:hidden">
										<span className="flex items-start justify-between gap-4">
											{faq.question}
											<span className="mt-0.5 text-primary-500 transition-transform group-open:rotate-45">
												+
											</span>
										</span>
									</summary>
									<p className="mt-4 text-sm leading-relaxed text-accent/65">{faq.answer}</p>
								</details>
							))}
						</div>
					</section>
				) : null}

				{/* Related services */}
				{related.length > 0 ? (
					<section className="border-t border-white/10 py-16">
						<div className="mb-8 flex items-center justify-between">
							<h2 className="text-2xl font-bold text-white md:text-3xl">Layanan lainnya</h2>
							<Link
								href="/services"
								className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 hover:underline"
							>
								Semua layanan
								<ArrowRight className="size-4" />
							</Link>
						</div>

						<div className="grid gap-6 md:grid-cols-3">
							{related.map((item) => (
								<Link
									key={item.slug}
									href={item.href}
									className="group overflow-hidden rounded-[20px] border border-white/10 bg-background-7 transition-all duration-300 hover:border-primary-500/50"
								>
									<div className="aspect-[16/10] overflow-hidden">
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img
											src={item.image}
											alt={item.alt}
											loading="lazy"
											className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
										/>
									</div>
									<div className="p-5">
										<h3 className="font-bold text-white group-hover:text-primary-500">
											{item.title}
										</h3>
										{item.subtitle ? (
											<p className="mt-2 line-clamp-2 text-sm text-accent/60">{item.subtitle}</p>
										) : null}
									</div>
								</Link>
							))}
						</div>
					</section>
				) : null}

				{/* Footer nav */}
				<div className="border-t border-white/10 py-10">
					<Link
						href="/services"
						className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 hover:underline"
					>
						<ArrowLeft className="size-4" />
						Kembali ke semua layanan
					</Link>
				</div>
			</div>

			<CtaBand />
		</div>
	);
}
