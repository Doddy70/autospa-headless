import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Phone } from 'lucide-react';

import { whatsappLink } from '@/data/contact';
import { SERVICES, getRelatedServices, getService } from '@/data/services';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
	return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const service = getService(slug);

	if (!service) {
		return { title: 'Layanan tidak ditemukan' };
	}

	const canonical = `/services/${service.slug}`;

	return {
		title: `${service.title} | AutoSPA Jakarta`,
		description: service.tagline,
		alternates: { canonical },
		openGraph: {
			title: `${service.title} | AutoSPA Jakarta`,
			description: service.tagline,
			url: canonical,
			type: 'website',
			images: [{ url: service.heroImage }],
		},
	};
}

export default async function ServicePage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const service = getService(slug);

	if (!service) {
		notFound();
	}

	const related = getRelatedServices(service.slug);

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: service.title,
		description: service.description,
		image: service.heroImage,
		serviceType: service.title,
		provider: {
			'@type': 'AutoRepairShop',
			name: 'AutoSPA Jakarta',
			url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3100',
			telephone: '+62-819-3777-3888',
		},
		areaServed: 'Jakarta, Indonesia',
	};

	return (
		<div className="min-h-screen bg-background-8 pt-24">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>

			<div className="mx-auto max-w-6xl px-6">
				{/* Breadcrumb */}
				<nav aria-label="Breadcrumb" className="py-6 text-sm text-accent/50">
					<Link href="/" className="hover:text-primary-500">
						Home
					</Link>
					<span className="mx-2">/</span>
					<Link href="/services" className="hover:text-primary-500">
						Services
					</Link>
					<span className="mx-2">/</span>
					<span className="text-white/80">{service.title}</span>
				</nav>

				{/* Hero */}
				<section className="grid items-center gap-10 pb-16 lg:grid-cols-2">
					<div className="relative overflow-hidden rounded-[24px] border border-white/10">
						<img
							src={service.heroImage}
							alt={service.title}
							className="aspect-[4/3] size-full object-cover"
						/>
					</div>

					<div>
						<span className="inline-flex rounded-full bg-primary-500/10 px-4 py-1.5 text-sm font-bold tracking-wider text-primary-500">
							{service.number}
						</span>

						<h1 className="mt-5 text-4xl font-bold leading-tight text-white md:text-5xl">
							{service.title}
						</h1>

						<p className="mt-4 text-lg leading-relaxed text-white/75">
							{service.tagline}
						</p>

						<p className="mt-4 text-sm leading-relaxed text-accent/60">
							{service.description}
						</p>

						<div className="mt-8 flex flex-col gap-3 sm:flex-row">
							<Link href="/contact" className="btn btn-lg btn-primary group">
								Book Sekarang
								<ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
							</Link>
							<a
								href={whatsappLink(
									`Halo AutoSPA Jakarta, saya ingin bertanya tentang layanan ${service.title}.`,
								)}
								target="_blank"
								rel="noopener noreferrer"
								className="btn btn-lg border border-stroke-6 bg-transparent text-white hover:bg-white/10"
							>
								<Phone className="mr-2 size-5" />
								Hubungi via WhatsApp
							</a>
						</div>
					</div>
				</section>

				{/* Highlights */}
				{service.highlights.length > 0 ? (
					<section className="border-t border-white/10 py-16">
						<h2 className="mb-8 text-2xl font-bold text-white">What you get</h2>
						<ul className="grid gap-4 md:grid-cols-3">
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
					</section>
				) : null}

				{/* Packages */}
				{service.packages.length > 0 ? (
					<section className="border-t border-white/10 py-16">
						<h2 className="text-2xl font-bold text-white">Paket layanan</h2>
						<p className="mt-2 text-sm text-accent/60">
							Harga dan ketersediaan paket mengikuti kondisi kendaraan - hubungi tim kami
							untuk ketentuan terbaru.
						</p>

						<div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{service.packages.map((servicePackage, index) => (
								<article
									key={servicePackage.name}
									className="flex flex-col rounded-[20px] border border-white/10 bg-background-7 p-6"
								>
									<span className="text-xs font-semibold uppercase tracking-wider text-primary-500/80">
										{String(index + 1).padStart(2, '0')}
									</span>

									<h3 className="mt-3 text-lg font-bold text-white">
										{servicePackage.name}
									</h3>

									{servicePackage.summary ? (
										<p className="mt-1 text-sm text-accent/60">{servicePackage.summary}</p>
									) : null}

									{servicePackage.includes.length > 0 ? (
										<ul className="mt-5 flex-1 space-y-2.5">
											{servicePackage.includes.map((item) => (
												<li key={item} className="flex items-start gap-2.5 text-sm text-accent/70">
													<Check
														className="mt-1 size-3.5 shrink-0 text-primary-500"
														strokeWidth={3}
													/>
													{item}
												</li>
											))}
										</ul>
									) : (
										<p className="mt-5 flex-1 text-sm text-accent/50">
											Detail paket dan harga tersedia melalui tim AutoSPA.
										</p>
									)}

									<Link
										href="/contact"
										className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-500 hover:underline"
									>
										Cek harga
										<ArrowRight className="size-4" />
									</Link>
								</article>
							))}
						</div>
					</section>
				) : null}

				{/* Gallery */}
				{service.gallery.length > 0 ? (
					<section className="border-t border-white/10 py-16">
						<h2 className="mb-8 text-2xl font-bold text-white">Gallery</h2>
						<div className="grid gap-4 sm:grid-cols-3">
							{service.gallery.map((image) => (
								<div
									key={image}
									className="overflow-hidden rounded-[16px] border border-white/10"
								>
									<img
										src={image}
										alt={`${service.title} - AutoSPA Jakarta`}
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
						<h2 className="mb-8 text-2xl font-bold text-white">
							{service.title} FAQs
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

				{/* Related */}
				{related.length > 0 ? (
					<section className="border-t border-white/10 py-16">
						<div className="mb-8 flex items-center justify-between">
							<h2 className="text-2xl font-bold text-white">Layanan lainnya</h2>
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
									href={`/services/${item.slug}`}
									className="group overflow-hidden rounded-[20px] border border-white/10 bg-background-7 transition-all duration-300 hover:border-primary-500/50"
								>
									<div className="aspect-[16/10] overflow-hidden">
										<img
											src={item.image}
											alt={item.title}
											loading="lazy"
											className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
										/>
									</div>
									<div className="p-5">
										<h3 className="font-bold text-white group-hover:text-primary-500">
											{item.title}
										</h3>
										<p className="mt-2 line-clamp-2 text-sm text-accent/60">{item.tagline}</p>
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
		</div>
	);
}
