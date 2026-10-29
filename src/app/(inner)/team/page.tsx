import type { Metadata } from 'next';
import Image from 'next/image';

import { CtaBand } from '@/components/ui/CtaBand';
import { PageHero, SectionTitle } from '@/components/ui/SectionTitle';
import aboutContent from '@/content/structured/about.json';
import type { StructuredPage } from '@/content/structured/types';

const page = aboutContent as StructuredPage;

/**
 * The team members of AutoSPA Jakarta.
 *
 * The production `/team` page still carries the theme demo content
 * ("Thomas Tatum, Web Developer"), so the real roster is taken from the
 * `/about` page, which publishes the actual people and their roles.
 */
const TEAM = page.team;

export const metadata: Metadata = {
	title: 'Our Team | AutoSPA Jakarta',
	description:
		'Meet the team behind AutoSPA Jakarta - area managers, supervisors and senior technicians across our Jakarta workshops.',
	alternates: { canonical: '/team' },
};

export default function TeamPage() {
	return (
		<>
			<PageHero
				title="Our Team"
				subtitle="The people behind every detail - from our area managers to our senior technicians."
				crumbs={[{ label: 'Our Team' }]}
			/>

			<section className="bg-background-8 px-6 py-16 md:py-20">
				<div className="mx-auto max-w-6xl">
					<SectionTitle
						eyebrow="Team Members"
						title="Handled by certified experts"
						description="The world's finest materials mean nothing without the masterful touch of the people who apply them."
					/>

					<div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{TEAM.map((member) => (
							<article
								key={member.name}
								className="group overflow-hidden rounded-[20px] border border-white/10 bg-background-7 transition-all duration-300 hover:border-primary-500/50"
							>
								<div className="relative aspect-[4/5] overflow-hidden bg-white/5">
									<Image
										src={member.image.src}
										alt={member.name}
										fill
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
										className="object-cover transition-transform duration-500 group-hover:scale-105"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-background-7 via-transparent to-transparent" />
								</div>

								<div className="p-6">
									<h3 className="text-lg font-bold text-white">{member.name}</h3>
									<p className="mt-1 text-sm text-primary-500">{member.role}</p>
								</div>
							</article>
						))}
					</div>
				</div>
			</section>

			<CtaBand
				eyebrow="Let's Talk"
				title="Still have a question?"
				description="Our Service Advisor will recommend the right package for your vehicle."
				primaryLabel="Get in Touch"
			/>
		</>
	);
}
