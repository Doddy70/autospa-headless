import type { Metadata } from 'next';
import { Clock, MapPin, MessageCircle, Phone } from 'lucide-react';
import Link from 'next/link';

import { BookingTrigger } from '@/components/booking/ReservationModal';
import { whatsappLink } from '@/data/contact';
import { listLocationCards } from '@/lib/locations/catalog';

export const revalidate = 300;

export const metadata: Metadata = {
	title: 'Our Locations | AutoSPA Jakarta',
	description:
		'Lokasi workshop AutoSPA Jakarta - Pluit, Depok 2, Express Depok, PIK 2, Ciledug, Bekasi, Kranji, Bogor, Serpong dan Cikupa. Hubungi kami untuk booking detailing dan paint protection.',
	alternates: { canonical: '/locations' },
};

export default async function LocationsPage() {
	const locations = await listLocationCards();

	return (
		<div className="min-h-screen bg-background-8 pt-24">
			{/* Hero */}
			<section className="relative px-6 py-20">
				<div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-transparent" />
				<div className="relative mx-auto max-w-6xl text-center">
					<h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
						Our Locations
					</h1>
					<p className="mt-4 text-xl text-white/70">
						Visit us at one of our premium detailing centers in Jakarta
					</p>
				</div>
			</section>

			{/* Locations Grid */}
			<section className="px-6 py-16">
				<div className="mx-auto max-w-6xl">
					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
						{locations.map((location) => (
							<article
								key={location.slug}
								data-testid="location-card"
								data-branch={location.slug}
								className="flex flex-col rounded-2xl border border-white/10 bg-background-7 p-8 transition-all hover:border-primary-500/50"
							>
								<h2 className="text-xl font-bold text-white">{location.name}</h2>

								<div className="mt-6 space-y-4">
									{location.address && (
										<div className="flex items-start gap-3">
											<MapPin className="mt-0.5 size-5 shrink-0 text-primary-500" />
											<a
												href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`}
												target="_blank"
												rel="noopener noreferrer"
												className="text-white/70 transition-colors hover:text-primary-500"
											>
												{location.address}
											</a>
										</div>
									)}

									{location.phones.length > 0 && (
										<div className="flex items-center gap-3">
											<Phone className="size-5 shrink-0 text-primary-500" />
											<a
												href={`tel:${(location.phones[0] ?? '').replace(/[^+\d]/g, '')}`}
												className="text-white/70 hover:text-primary-500"
											>
												{location.phones.join(' / ')}
											</a>
										</div>
									)}

									{location.hours && (
										<div className="flex items-center gap-3">
											<Clock className="size-5 shrink-0 text-primary-500" />
											<span className="text-white/70">{location.hours}</span>
										</div>
									)}
								</div>

								{location.whatsapp && (
									<a
										href={whatsappLink(
											`Halo AutoSPA Jakarta, saya ingin bertanya soal layanan di ${location.name}.`,
											location.whatsapp,
										)}
										target="_blank"
										rel="noopener noreferrer"
										data-testid="location-whatsapp"
										className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#00B14F] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#00a044]"
									>
										<MessageCircle className="size-4" />
										WhatsApp {location.name}
									</a>
								)}

								<BookingTrigger
									label="Book Appointment"
									className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-primary-500 py-3 text-center text-sm font-semibold text-primary-500 transition-colors hover:bg-primary-500 hover:text-white"
								/>
							</article>
						))}
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="px-6 py-16">
				<div className="mx-auto max-w-4xl text-center">
					<h2 className="text-2xl font-bold text-white">
						Need Help Choosing a Location?
					</h2>
					<p className="mt-4 text-white/70">
						Our team is ready to help you find the perfect detailing solution for your vehicle.
					</p>
					<Link
						href="/contact"
						className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-500 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-primary-600"
					>
						Contact Us
					</Link>
				</div>
			</section>
		</div>
	);
}
