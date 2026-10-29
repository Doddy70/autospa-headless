import type { Metadata } from 'next';
import { Clock, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import BranchCard from '@/components/contact/BranchCard';
import { BRANCHES, CONTACT, SOCIALS } from '@/data/contact';

export const metadata: Metadata = {
	title: 'Contact | AutoSPA Jakarta',
	description:
		'Lokasi workshop AutoSPA Jakarta - Pluit, Depok 2, Express Depok, PIK 2, Ciledug, Bekasi, Kranji, Bogor, Serpong dan Cikupa. Hubungi kami untuk booking detailing dan paint protection.',
	alternates: { canonical: '/contact' },
};

export default function ContactPage() {
	return (
		<div className="min-h-screen bg-background-8">
			{/* Hero */}
			<section className="relative px-6 py-16 md:py-20">
				<div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-transparent" />
				<div className="relative mx-auto max-w-6xl text-center">
					<h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
						Contact Us
					</h1>
					<p className="mt-4 text-lg text-white/70 md:text-xl">
						Kunjungi workshop kami atau hubungi kami untuk booking
					</p>
				</div>
			</section>

			{/* Site-wide contact details - mirrored from the production header */}
			<section className="px-6 pb-16">
				<div className="mx-auto max-w-6xl">
					<div className="grid gap-6 rounded-2xl border border-white/10 bg-background-7 p-6 sm:grid-cols-2 lg:grid-cols-4 lg:p-8">
						<div className="flex items-start gap-4">
							<Clock className="mt-1 size-5 shrink-0 text-primary-500" />
							<div>
								<h2 className="text-sm font-semibold text-white">Open Hours</h2>
								<p className="mt-1 text-sm text-white/70">{CONTACT.hours}</p>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<Mail className="mt-1 size-5 shrink-0 text-primary-500" />
							<div>
								<h2 className="text-sm font-semibold text-white">Email</h2>
								<a
									href={`mailto:${CONTACT.email}`}
									className="mt-1 block text-sm text-white/70 transition-colors hover:text-primary-500"
								>
									{CONTACT.email}
								</a>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<Phone className="mt-1 size-5 shrink-0 text-primary-500" />
							<div>
								<h2 className="text-sm font-semibold text-white">Phone</h2>
								<a
									href={`tel:${CONTACT.phone.replace(/[^+\d]/g, '')}`}
									className="mt-1 block text-sm text-white/70 transition-colors hover:text-primary-500"
								>
									{CONTACT.phone}
								</a>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<div>
								<h2 className="text-sm font-semibold text-white">Social Media</h2>
								<div className="mt-2 flex flex-wrap gap-2">
									{SOCIALS.map((social) => (
										<a
											key={social.label}
											href={social.href}
											target="_blank"
											rel="noopener noreferrer"
											className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70 transition-colors hover:border-primary-500 hover:text-primary-500"
										>
											{social.label}
										</a>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Branches */}
			<section className="px-6 py-16">
				<div className="mx-auto max-w-6xl">
					<h2 className="mb-10 text-3xl font-bold text-white md:text-4xl">Our Location</h2>

					<div className="space-y-8">
						{BRANCHES.map((branch) => (
							<BranchCard key={branch.slug} branch={branch} />
						))}
					</div>

					<div className="mt-12 text-center">
						<Link
							href="/locations"
							className="inline-flex items-center gap-2 rounded-full border border-primary-500 px-8 py-4 text-sm font-semibold text-primary-500 transition-colors hover:bg-primary-500 hover:text-white"
						>
							Lihat Semua Lokasi
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
