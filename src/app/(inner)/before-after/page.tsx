import type { Metadata } from 'next';

import { BeforeAfterCarousel } from '@/components/ui/BeforeAfterCarousel';
import { CtaBand } from '@/components/ui/CtaBand';
import { PageHero, SectionTitle } from '@/components/ui/SectionTitle';
import { BEFORE_AFTER } from '@/data/before-after';

/**
 * The before/after gallery.
 *
 * The gallery shows the same detail of a vehicle before the work and after
 * it. The visitor drags the divider of the photo and compares the two.
 */
export const metadata: Metadata = {
	title: 'Before & After | AutoSPA Jakarta',
	description:
		'The gallery of our work at AutoSPA Jakarta. Drag the divider to compare the car before and after the detailing, the coating, and the paint protection.',
	alternates: { canonical: '/before-after' },
};

export default function BeforeAfterPage() {
	return (
		<>
			<PageHero
				title="Before & After"
				subtitle="Real results from our detailing studio - drag the divider to see the difference."
				crumbs={[{ label: 'Before & After' }]}
			/>

			<section className="bg-background-8 px-6 py-16 md:py-20">
				<div className="mx-auto max-w-6xl">
					<SectionTitle
						eyebrow="Our Work"
						title="Drag to compare"
						description="Every pair of photos shows the same detail before and after the work in our studio."
						centered
					/>

					<div className="mt-14">
						<BeforeAfterCarousel items={BEFORE_AFTER} />
					</div>
				</div>
			</section>

			<CtaBand
				eyebrow="Free Consultation"
				title="Want the same result for your car?"
				description="Our Service Advisor will recommend the right package for your vehicle."
			/>
		</>
	);
}
