import type { Metadata } from 'next';

import { PageHero } from '@/components/ui/SectionTitle';
import { RichText } from '@/components/ui/RichText';
import termsContent from '@/content/structured/terms-conditions.json';
import { blocksOfType, type StructuredPage } from '@/content/structured/types';

const page = termsContent as StructuredPage;
const body = blocksOfType(page.blocks, 'richText')[0]?.items ?? [];

export const metadata: Metadata = {
	title: 'Terms & Conditions | AutoSPA Jakarta',
	description:
	'Terms and conditions that govern the use of the AutoSPA Jakarta website and our auto detailing services.',
	alternates: { canonical: '/terms-conditions' },
};

export default function TermsConditionsPage() {
	return (
		<>
			<PageHero
				title="Terms & Conditions"
				subtitle="Effective Date: June, 10 2025"
				crumbs={[{ label: 'Terms & Conditions' }]}
			/>

			<section className="bg-background-8 px-6 py-16 md:py-20">
				<div className="mx-auto max-w-3xl">
					<RichText items={body} />
				</div>
			</section>
		</>
	);
}
