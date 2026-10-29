import type { Metadata } from 'next';

import { Accordion } from '@/components/ui/Accordion';
import { CtaBand } from '@/components/ui/CtaBand';
import { PageHero, SectionTitle } from '@/components/ui/SectionTitle';
import faqContent from '@/content/structured/faq.json';
import { blocksOfType, type StructuredPage } from '@/content/structured/types';

const page = faqContent as StructuredPage;

export const metadata: Metadata = {
	title: 'FAQ | AutoSPA Jakarta',
	description:
		'Pertanyaan yang sering diajukan tentang auto detailing, paint protection film, nano ceramic coating dan layanan AutoSPA Jakarta.',
	alternates: { canonical: '/faq' },
};

export default function FaqPage() {
	const accordion = blocksOfType(page.blocks, 'accordion')[0];

	return (
		<>
			<PageHero
				title="FAQ"
				subtitle="Providing clarity on frequently asked questions"
				crumbs={[{ label: 'FAQ' }]}
			/>

			<section className="bg-background-8 px-6 py-16 md:py-20">
				<div className="mx-auto max-w-6xl">
					<SectionTitle
						eyebrow="Questions & Answers"
						title="Providing clarity on frequently asked questions"
					/>

					{accordion ? (
						<Accordion items={accordion.items} className="mt-12" />
					) : null}
				</div>
			</section>

			<CtaBand
				eyebrow="Free Consultation"
				title="Still Have Questions?"
				description="Our Service Advisor will recommend the right package for your vehicle."
			/>
		</>
	);
}
