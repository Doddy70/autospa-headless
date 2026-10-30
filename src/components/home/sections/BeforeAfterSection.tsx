'use client';

/**
 * The before/after section of the homepage.
 *
 * The gallery itself is the comparison slider of the last service - the
 * visitor drags the divider and sees the same detail before and after the
 * work. The section links to the full gallery.
 */

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { BeforeAfterCarousel } from '@/components/ui/BeforeAfterCarousel';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { BEFORE_AFTER } from '@/data/before-after';

export function BeforeAfterSection() {
	return (
		<section className="relative overflow-hidden bg-background-8 px-6 py-20 md:py-28">
			<div className="absolute inset-0 bg-gradient-to-b from-primary-500/10 via-transparent to-transparent" />

			<div className="relative mx-auto max-w-6xl">
				<SectionTitle
					eyebrow="Our Work"
					title="Before & After"
					description="Drag the divider to see what we have done - a clean, tidy detail, worked on with precision."
					centered
				/>

				<div className="mt-14">
					<BeforeAfterCarousel items={BEFORE_AFTER} />
				</div>

				<div className="mt-12 flex justify-center">
					<Link
						href="/before-after"
						className="btn btn-lg group inline-flex items-center gap-2 border border-stroke-6 bg-transparent text-white hover:bg-white/10"
					>
						<span>See all of our work</span>
						<ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
					</Link>
				</div>
			</div>
		</section>
	);
}

export default BeforeAfterSection;
