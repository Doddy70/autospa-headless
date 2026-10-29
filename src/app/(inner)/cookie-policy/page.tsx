import type { Metadata } from 'next';

import { PageHero } from '@/components/ui/SectionTitle';
import { RichText } from '@/components/ui/RichText';
import cookieContent from '@/content/structured/cookie-policy.json';
import { blocksOfType, type StructuredPage } from '@/content/structured/types';

const page = cookieContent as StructuredPage;
const body = blocksOfType(page.blocks, 'richText')[0]?.items ?? [];

export const metadata: Metadata = {
	title: 'Cookie Policy | AutoSPA Jakarta',
	description:
		'What cookies are, the types of cookies AutoSPA Jakarta uses and how to manage your cookie preferences.',
	alternates: { canonical: '/cookie-policy' },
};

export default function CookiePolicyPage() {
	return (
		<>
			<PageHero
				title="Cookie Policy"
				subtitle="Effective Date: 15-May-2024"
				crumbs={[{ label: 'Cookie Policy' }]}
			/>

			<section className="bg-background-8 px-6 py-16 md:py-20">
				<div className="mx-auto max-w-3xl">
					<RichText items={body} />
				</div>
			</section>
		</>
	);
}
