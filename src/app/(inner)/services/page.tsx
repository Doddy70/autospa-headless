import type { Metadata } from 'next';
import Image from 'next/image';

import ShowcaseHeadline from '@/components/showcase/ShowcaseHeadline';
import ShowcaseRows from '@/components/showcase/ShowcaseRows';
import { BookingTrigger } from '@/components/booking/ReservationModal';
import { CtaBand } from '@/components/ui/CtaBand';
import { SectionTitle, PageHero } from '@/components/ui/SectionTitle';
import { PACKAGES } from '@/data/packages';
import { toAssetUrl } from '@/lib/services/assets';
import { listServiceCards } from '@/lib/services/catalog';

export const metadata: Metadata = {
	title: 'Layanan | AutoSPA Jakarta',
	description:
		'Premium Wash, Premium Detailing, Premium Coating, Premium 360° PPF, Engine & Glass dan Rust Protection - AutoSPA Jakarta.',
	alternates: { canonical: '/services' },
};

/* The catalogue is re-read every five minutes, so the page follows the CMS
   as soon as it answers - and picks up the mirror again when it does not. */
export const revalidate = 300;

/**
 * The service catalogue.
 *
 * The Agntix `portfolio-metro` page, re-purposed: the rows of the template
 * were projects, here they are the services of AutoSPA. The rows are read
 * from the service catalogue, so the page follows the CMS whenever the
 * GraphQL endpoint answers and falls back to the published mirror when it
 * does not.
 */
export default async function ServicesPage() {
	const services = await listServiceCards();

	return (
		<>
			<PageHero
				title="Layanan"
				subtitle="Kami selalu memakai produk terbaik untuk cuaca Indonesia, sehingga perlindungan yang kami terapkan bertahan lama dan mengangkat tampilan serta nilai kendaraan Anda."
				crumbs={[{ label: 'Layanan' }]}
			/>

			{/* The catalogue rows */}
			<section className="design-project-area title-box relative overflow-hidden bg-background-8 pt-[70px] lg:pt-[120px]">
				<div className="mx-auto w-full max-w-[1536px] px-6 md:px-10">
					<ShowcaseHeadline
						first="Layanan"
						second="Kami"
						label="Layanan AutoSPA"
						description="Enam layanan yang kami kerjakan setiap hari - dari wash rutin sampai pelapis anti karat untuk underbody."
					/>

					<ShowcaseRows items={services} label="Daftar layanan AutoSPA" />
				</div>
			</section>

			{/* The packages - the other axis of the catalogue: a service can
			    be delivered through more than one package. */}
			<section className="bg-background-8 px-6 py-16 md:py-24">
				<div className="mx-auto max-w-[1536px]">
					<SectionTitle
						eyebrow="Paket"
						title="Paket yang bisa dipilih"
						description="Dua belas paket yang kami kerjakan, dari coating tier ringan sampai pelapis 360° penuh. Harga mengikuti ukuran kendaraan."
					/>

					<div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{PACKAGES.map((servicePackage) => (
							<article
								key={servicePackage.slug}
								className="flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-background-7"
							>
								<div className="relative aspect-[16/10] overflow-hidden">
									<Image
										src={toAssetUrl(servicePackage.image)}
										alt={servicePackage.name}
										width={800}
										height={500}
										className="size-full object-cover"
									/>
								</div>

								<div className="flex flex-1 flex-col p-6">
									<span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500/80">
										{servicePackage.category}
									</span>

									<h3 className="mt-3 text-lg font-bold text-white">{servicePackage.name}</h3>

									<p className="mt-2 text-sm leading-relaxed text-accent/60">
										{servicePackage.description}
									</p>

									{servicePackage.includes.length > 0 ? (
										<ul className="mt-5 flex-1 space-y-2">
											{servicePackage.includes.map((item) => (
												<li key={item} className="text-sm leading-relaxed text-accent/70">
													{item}
												</li>
											))}
										</ul>
									) : null}

									{servicePackage.priceFrom ? (
										<p className="mt-5 text-sm font-semibold text-primary-300">
											Mulai dari {servicePackage.priceFrom}
										</p>
									) : null}

									<BookingTrigger
										label="Cek harga"
										className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-500 hover:underline"
									/>
								</div>
							</article>
						))}
					</div>
				</div>
			</section>

			<CtaBand />
		</>
	);
}
