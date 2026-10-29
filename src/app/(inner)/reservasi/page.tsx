import type { Metadata } from 'next';
import Image from 'next/image';

import { BookingForm } from '@/components/ui/BookingForm';
import { PageHero, SectionTitle } from '@/components/ui/SectionTitle';
import { CONTACT } from '@/data/contact';

export const metadata: Metadata = {
	title: 'Reservasi | AutoSPA Jakarta',
	description:
		'Reservasi layanan detailing, coating dan paint protection di salah satu workshop AutoSPA Jakarta.',
	alternates: { canonical: '/reservasi' },
};

export default function ReservasiPage() {
	return (
		<>
			<PageHero
				title="Form Reservasi"
				subtitle="Isi form di bawah, lalu kirim lewat WhatsApp. Tim kami akan membalas untuk memastikan jadwal dan harga akhir."
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

						<div className="mt-10">
							<BookingForm />
						</div>
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
