import type { Metadata } from 'next';
import Image from 'next/image';

import { AboutHero } from '@/components/about/AboutHero';
import { AboutMarquee } from '@/components/about/AboutMarquee';
import { AboutPartners } from '@/components/about/AboutPartners';
import { AboutTeam } from '@/components/about/AboutTeam';
import { CtaBand } from '@/components/ui/CtaBand';
import { StatCounter } from '@/components/ui/StatCounter';
import { BANNER, CLIENTS_LABEL, CLIENTS_SERVED, PARTNERS, TEAM } from '@/data/about';

export const metadata: Metadata = {
	title: 'About | AutoSPA Jakarta',
	description:
		'Passion for detail, perfected since 2014. Meet the people behind AutoSPA Jakarta - the partners, the certified technicians and the team of our multi-branch network.',
	alternates: { canonical: '/about' },
};

/**
 * The About page.
 *
 * The architecture comes from the Agntix template
 * (`src/pages/about/about-us/AboutUsLightMain.tsx`): a hero, a running
 * headline, a wide photo, the story, the partners, the counter, the team and
 * the closing call to action.
 *
 * The copy and the branding are the ones of AutoSPA Jakarta - the wording
 * is the wording the production page publishes, and the photos carry the
 * properties of the WordPress media library.
 */

/* The rows of the partner section - the numbers follow the Agntix rows. */
const PARTNER_ROWS = PARTNERS.map((partner, index) => ({
	number: String(index + 1).padStart(2, '0'),
	name: partner.name,
	origin: partner.origin,
	description: partner.description,
	href: '/services',
}));

export default function AboutPage() {
	return (
		<>
			{/* The hero of the Agntix template. */}
			<AboutHero
				title="Passion for detail, perfected since 2014"
				eyebrow="About Us"
				description="Autospa Jakarta was established in 2014 in Jakarta. Born from a simple yet ambitious vision - to set the gold standard of the automotive detailing and paint protection industry in Indonesia."
				ctaLabel="Lihat Layanan"
				ctaHref="/services"
			/>

			{/* The running headline behind the fold. */}
			<div className="bg-background-8 pt-10">
				<AboutMarquee text="About Us" repeats={6} />
			</div>

			{/* The wide photo of the Agntix banner. */}
			<section className="bg-background-8 px-6 pb-16 md:pb-24">
				<div className="mx-auto max-w-6xl">
					<div className="relative overflow-hidden rounded-[24px]">
						<Image
							src={BANNER.src}
							alt={BANNER.alt}
							width={BANNER.width}
							height={BANNER.height}
							sizes="(max-width: 1200px) 100vw, 1152px"
							className="h-auto w-full object-cover"
						/>
					</div>
				</div>
			</section>

			{/* The story of the company. */}
			<section className="bg-background-8 px-6 pb-20 md:pb-28">
				<div className="mx-auto max-w-6xl">
					<div className="grid gap-10 lg:grid-cols-12 lg:gap-x-16">
						<div className="lg:col-span-4">
							<span className="text-sm font-semibold tracking-[0.2em] text-primary-500 uppercase">
								Who we are
							</span>
						</div>

						<div className="lg:col-span-8">
							<h2 className="text-3xl font-bold leading-tight text-white md:text-4xl">
								Established in 2014, AutoSpa was born from a simple yet ambitious
								vision: to set the gold standard in the automotive detailing and paint
								protection industry in Indonesia.
							</h2>

							<p className="mt-8 text-base leading-relaxed text-white/70 md:text-lg">
								Driven by an uncompromising dedication to quality, we have grown into a
								highly credible, multi-branch network trusted by thousands of loyal
								customers.
							</p>

							<p className="mt-5 text-base leading-relaxed text-white/70 md:text-lg">
								To us, a vehicle is more than just a mode of transportation; it is a
								masterpiece and a valuable investment that demands flawless preservation.
								The extraordinary trust we have earned over the years was not built
								overnight, but through our relentless consistency in delivering absolute
								perfection - with zero tolerance for even the slightest imperfections.
							</p>

							<p className="mt-5 text-base leading-relaxed text-white/70 md:text-lg">
								More than just an auto spa, we are the ultimate destination where
								automotive aesthetics, cutting-edge technology, and high-level
								craftsmanship converge. Entrust your prized investment to us, and
								experience the unparalleled pride of driving a pristine, showroom-quality
								vehicle every single day.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* The partners whose products AutoSPA works with. */}
			<AboutPartners rows={PARTNER_ROWS} />

			{/* The counter of the Agntix about section. */}
			<section className="bg-background-8 px-6 pb-20 md:pb-28">
				<div className="mx-auto max-w-6xl">
					<div className="grid items-center gap-10 rounded-[24px] border border-white/10 bg-background-7 p-8 md:grid-cols-12 md:p-12">
						<div className="md:col-span-4">
							<StatCounter
								value={CLIENTS_SERVED}
								suffix="k+"
								label={CLIENTS_LABEL}
							/>
						</div>

						<div className="md:col-span-8">
							<h2 className="text-2xl font-bold text-white md:text-3xl">
								Let&apos;s see how we did it.
							</h2>

							<p className="mt-4 text-base leading-relaxed text-white/70">
								Handled by certified experts. The world&apos;s finest materials mean nothing
								without the masterful touch of the artists who apply them. At AutoSpa, your
								vehicle is entrusted solely to our certified team of professional detailers
								and technicians. Having undergone rigorous international-standard training
								and possessing extensive hands-on experience, they ensure that every curve
								of the bodywork, the interior, and the engine bay receives meticulous
								attention. This is the embodiment of our core philosophy: Passion for
								Detail.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* The team. */}
			<AboutTeam
				members={TEAM.map((member) => ({
					name: member.name,
					role: member.role,
					image: {
						src: member.src,
						alt: member.alt,
						width: member.width,
						height: member.height,
					},
				}))}
			/>

			<CtaBand
				eyebrow="Let's Talk"
				title="Still have a question?"
				description="Our Service Advisor will recommend the right package for your vehicle."
				primaryLabel="Get in Touch"
			/>
		</>
	);
}
