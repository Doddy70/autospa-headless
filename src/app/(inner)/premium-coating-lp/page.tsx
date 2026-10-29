import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

import { SectionTitle } from '@/components/ui/SectionTitle';
import { TestimonialSlider } from '@/components/ui/TestimonialSlider';
import { whatsappLink } from '@/data/contact';
import lpContent from '@/content/structured/premium-coating-lp.json';
import { blocksOfType, type StructuredPage } from '@/content/structured/types';

const page = lpContent as StructuredPage;

export const metadata: Metadata = {
	title: 'Premium Coating | AutoSPA Jakarta',
	description:
		'Lets make your car stunning - passion for detail, premium autodetailing specialist di AutoSPA Jakarta.',
	alternates: { canonical: '/premium-coating-lp' },
};

const HERO = '/wp-content/uploads/2025/11/oardefault.avif';
const SHOWCASE = [
	'/wp-content/uploads/2025/11/Auto-Detailing-1.jpg',
	'/wp-content/uploads/2025/11/Auto-Detailing-2.jpg',
	'/wp-content/uploads/2025/11/Auto-Detailing-3.jpg',
];
const PROMO_IMAGE = '/wp-content/uploads/2025/10/Foto-aktifitas-PIK2-18-10-2025-3-scaled.jpg';
const PATTERN = '/wp-content/uploads/2025/07/pat1.png';

export default function PremiumCoatingLpPage() {
	const testimonials = blocksOfType(page.blocks, 'testimonials')[0]?.items ?? [];

	return (
		<div className="min-h-screen bg-background-8">
			{/* Hero */}
			<section className="relative overflow-hidden px-6 pb-20 pt-32 md:pt-40">
				<div className="absolute inset-0 bg-gradient-to-br from-primary-500/15 via-transparent to-transparent" />

				<div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
					<div>
						<span className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
							Premium Autodetailing Specialist
						</span>

						<h1 className="mt-6 text-4xl font-bold leading-[1.05] text-white md:text-6xl">
							Lets make your car stunning!
						</h1>

						<p className="mt-5 text-lg text-white/70">Passion For Detail</p>

						<div className="mt-9 flex flex-col gap-3 sm:flex-row">
							<Link href="/reservasi" className="btn btn-lg btn-primary group">
								Book Now
								<ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
							</Link>
							<a
								href={whatsappLink(
									'Halo Admin, saya mau booking untuk Premium Coating.',
								)}
								target="_blank"
								rel="noopener noreferrer"
								className="btn btn-lg border border-stroke-6 bg-transparent text-white hover:bg-white/10"
							>
								Booking via WhatsApp
							</a>
						</div>
					</div>

					<div className="relative mx-auto w-full max-w-md">
						<div className="absolute -inset-4 rounded-[32px] bg-primary-500/10 blur-2xl" />
						<div className="relative overflow-hidden rounded-[28px] border border-white/10">
							<Image
								src={HERO}
								alt="AutoSPA Jakarta premium detailing"
								width={405}
								height={720}
								priority
								className="h-auto w-full object-cover"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Showcase */}
			<section className="px-6 py-16 md:py-20">
				<div className="mx-auto max-w-6xl">
					<div className="grid gap-4 sm:grid-cols-3">
						{SHOWCASE.map((src) => (
							<div
								key={src}
								className="overflow-hidden rounded-[20px] border border-white/10"
							>
								<Image
									src={src}
									alt="AutoSPA Jakarta detailing result"
									width={1080}
									height={1080}
									className="aspect-square size-full object-cover transition-transform duration-500 hover:scale-105"
								/>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Testimonials */}
			{testimonials.length ? (
				<section className="px-6 py-16 md:py-20">
					<div className="mx-auto max-w-4xl">
						<SectionTitle
							eyebrow="Testimonials"
							title="What our customers say"
							centered
						/>

						<TestimonialSlider items={testimonials} className="mt-12" />
					</div>
				</section>
			) : null}

			{/* Promo */}
			<section className="relative overflow-hidden px-6 py-16 md:py-24">
				<div className="absolute inset-0 bg-gradient-to-br from-primary-500/15 via-transparent to-transparent" />

				<div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
					<div className="relative overflow-hidden rounded-[24px] border border-white/10">
						<Image
							src={PROMO_IMAGE}
							alt="Promo AutoSPA Jakarta"
							width={1080}
							height={720}
							className="h-auto w-full object-cover"
						/>
					</div>

					<div>
						<span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary-500">
							<Sparkles className="size-4" />
							Special Promo - Limited Time Only!
						</span>

						<h2 className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl">
							Get Free Glass Coating!
						</h2>

						<p className="mt-4 text-white/60">
							*available 10 slots for this month
						</p>

						<Image
							src={PATTERN}
							alt=""
							width={405}
							height={720}
							className="mt-8 h-16 w-auto opacity-40"
						/>

						<h3 className="mt-6 text-2xl font-bold text-white">
							SO WHAT ARE YOU WAITING FOR?
						</h3>
						<p className="mt-2 text-lg text-primary-500">BOOK NOW AND GET THE PROMO!</p>

						<Link href="/reservasi" className="btn btn-lg btn-primary group mt-8">
							Book Now
							<ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
						</Link>
					</div>
				</div>
			</section>

			{/* Footer note */}
			<section className="px-6 pb-16">
				<div className="mx-auto max-w-6xl border-t border-white/10 pt-8 text-center">
					<Image
						src="/wp-content/uploads/2025/09/AUTO-LOGO-PNG-1.png"
						alt="AutoSPA Jakarta"
						width={260}
						height={80}
						className="mx-auto h-10 w-auto object-contain opacity-70"
					/>
					<p className="mt-4 text-sm text-white/40">
						© 2025 All Right Reserved Autospa Jakarta
					</p>
				</div>
			</section>
		</div>
	);
}
