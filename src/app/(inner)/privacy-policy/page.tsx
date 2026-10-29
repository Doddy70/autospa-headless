import type { Metadata } from 'next';

import { PageHero } from '@/components/ui/SectionTitle';
import { RichText } from '@/components/ui/RichText';
import privacyContent from '@/content/structured/privacy-policy.json';
import { blocksOfType, type StructuredPage } from '@/content/structured/types';

const page = privacyContent as StructuredPage;
const body = blocksOfType(page.blocks, 'richText')[0]?.items ?? [];

export const metadata: Metadata = {
	title: 'Privacy Policy | AutoSPA Jakarta',
	description:
		'How AutoSPA Jakarta collects, uses, discloses and safeguards your personal information.',
	alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicyPage() {
	return (
		<>
			<PageHero
				title="Privacy Policy"
				subtitle="Effective Date: June, 10 2025"
				crumbs={[{ label: 'Privacy Policy' }]}
			/>

			<section className="bg-background-8 px-6 py-16 md:py-20">
				<div className="mx-auto max-w-3xl">
					<RichText items={body} />
				</div>
			</section>
		</>
	);
}
