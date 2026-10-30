import type { Metadata } from 'next';
import Image from 'next/image';
import { CalendarCheck, Check } from 'lucide-react';

import { ReservationModal } from '@/components/booking/ReservationModal';
import { PageHero, SectionTitle } from '@/components/ui/SectionTitle';
import { CONTACT } from '@/data/contact';
import { listServiceCards } from '@/lib/services/catalog';

export const metadata: Metadata = {
	title: 'Reservasi | AutoSPA Jakarta',
	description:
		'Reservasi layanan detailing, coating dan paint protection di salah satu workshop AutoSPA Jakarta.',
	alternates: { canonical: '/reservasi' },
};

const STEPS = [
	{
		title: 'Pilih layanan',
		description:
			'Premium Wash, Premium Detailing, Premium Coating, Premium 360° PPF, Engine & Glass, atau Rust Protection.',
	},
	{
		title: 'Pilih cabang',
		description:
			'Sepuluh cabang AutoSPA di Jabodetabek. Ringkasan booking dikirim ke nomor WhatsApp cabang yang Anda pilih.',
	},
	{
		title: 'Pilih ukuran kendaraan',
		description:
			'Ukuran kendaraan menentukan lama pengerjaan - dari 30-60 menit untuk wash sampai 4-7 jam untuk full detailing.',
	},
	{
		title: 'Data kendaraan dan jadwal',
		description:
			'Untuk coating dan PPF kami butuh model kendaraannya; untuk semuanya kami butuh tanggal dan jam kedatangan.',
	},
	{
		title: 'Kirim lewat WhatsApp',
		description:
			'Tim kami membalas untuk memastikan jadwal, paket, dan harga akhir. Booking baru terkonfirmasi setelah dibalas.',
	},
];

export default async function ReservasiPage() {
	/*
	 * The service rows of the wizard come from the catalogue, the same
	 * source the homepage and the service pages use: WordPress first, the
	 * static mirror as the fallback.
	 */
	const services = await listServiceCards();

	return (
		<>
			<PageHero
				title="Booking Layanan"
				subtitle="Isi langkah demi langkah, lalu kirim ringkasannya lewat WhatsApp. Tim kami akan membalas untuk memastikan jadwal, paket, dan harga akhir."
				crumbs={[{ label: 'Reservasi' }]}
			/>

			<section className="bg-background-8 px-6 py-16 md:py-20">
				<div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.2fr_0.8fr]">
					<div>
						<SectionTitle
							eyebrow="Book Now"
							title="Let's make your car stunning!"
							description="Passion For Detail - premium autodetailing specialist."
						/>

						<div className="mt-8">
							<ReservationModal services={services} />
						</div>

						<ol className="mt-12 space-y-5">
							{STEPS.map((step, index) => (
								<li key={step.title} className="flex gap-4">
									<span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary-500/40 bg-primary-500/10 text-sm font-bold text-primary-400">
										{index + 1}
									</span>
									<div>
										<h3 className="text-base font-bold text-white">{step.title}</h3>
										<p className="mt-1 text-sm leading-relaxed text-white/55">
											{step.description}
										</p>
									</div>
								</li>
							))}
						</ol>

						<ul className="mt-10 space-y-3 rounded-[20px] border border-white/10 bg-background-7 p-6">
							<li className="flex items-start gap-3 text-sm text-white/60">
								<Check className="mt-0.5 size-4 shrink-0 text-primary-500" aria-hidden="true" />
								Booking dikirim ke nomor WhatsApp cabang yang Anda pilih, bukan ke nomor
								central.
							</li>
							<li className="flex items-start gap-3 text-sm text-white/60">
								<Check className="mt-0.5 size-4 shrink-0 text-primary-500" aria-hidden="true" />
								Jam yang ditawarkan mengikuti jam buka cabang tersebut.
							</li>
							<li className="flex items-start gap-3 text-sm text-white/60">
								<CalendarCheck
									className="mt-0.5 size-4 shrink-0 text-primary-500"
									aria-hidden="true"
								/>
								Belum ada konfirmasi otomatis - jadwal baru pasti setelah tim kami
								membalas.
							</li>
						</ul>
					</div>

					<aside className="lg:pt-4">
						<div className="overflow-hidden rounded-[20px] border border-white/10 bg-background-7">
							<div className="relative aspect-[16/10]">
								<Image
									src="/wp-content/uploads/2025/05/AUTO-SPA_FINAL-1.webp"
									alt="AutoSPA Jakarta"
									fill
									sizes="(max-width: 1024px) 100vw, 40vw"
									className="object-contain p-8"
								/>
							</div>

							<div className="border-t border-white/10 p-6">
								<h2 className="text-lg font-bold text-white">Butuh bantuan?</h2>
								<p className="mt-2 text-sm leading-relaxed text-white/60">
									Hubungi kami langsung - tim kami siap membantu memilih paket yang
									sesuai dengan kendaraan Anda.
								</p>

								<dl className="mt-5 space-y-3 text-sm">
									<div className="flex items-start gap-3">
										<dt className="sr-only">Telepon</dt>
										<dd className="text-white/70">
											<a
												href={`tel:+${CONTACT.whatsapp}`}
												className="transition-colors hover:text-primary-500"
											>
												{CONTACT.phone}
											</a>
										</dd>
									</div>
									<div className="flex items-start gap-3">
										<dt className="sr-only">Email</dt>
										<dd className="text-white/70">
											<a
												href={`mailto:${CONTACT.email}`}
												className="transition-colors hover:text-primary-500"
											>
												{CONTACT.email}
											</a>
										</dd>
									</div>
									<div className="flex items-start gap-3">
										<dt className="sr-only">Jam buka</dt>
										<dd className="text-white/70">{CONTACT.hours}</dd>
									</div>
								</dl>
							</div>
						</div>
					</aside>
				</div>
			</section>
		</>
	);
}
