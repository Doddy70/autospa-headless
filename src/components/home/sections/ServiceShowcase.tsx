'use client';

import Link from 'next/link';

import ShowcaseHeadline from '@/components/showcase/ShowcaseHeadline';
import ShowcaseRows from '@/components/showcase/ShowcaseRows';
import type { ServiceCard } from '@/lib/services/types';

/**
 * "Layanan Kami" - the service catalogue of the homepage.
 *
 * This is the Agntix "Recent Work" block (`portfolio-metro`) re-purposed:
 * the rows of the template were projects, here they are the services of
 * AutoSPA. The block, the motion and the layout are the template's; the
 * content is the service catalogue.
 */
export default function ServiceShowcase({ items }: { items: ServiceCard[] }) {
	return (
		<section
			className="design-project-area title-box relative overflow-hidden bg-background-8 pt-[70px] lg:pt-[120px]"
			id="layanan"
			aria-label="Our Service"
		>
			<div className="mx-auto w-full max-w-[1536px] px-6 md:px-10">
				<ShowcaseHeadline
					first="Our"
					second="Service"
					label="Our Service"
					description="we provide premium materials designed to meet the highest standards of quality and durability."
					aside={
						<div className="flex flex-wrap gap-3 lg:justify-end lg:pb-[50px]">
							<Link
								href="/reservasi"
								className="inline-block rounded-full border-[1.5px] border-primary-500/60 px-8 py-3.5 text-sm font-semibold leading-none tracking-[-0.02em] text-primary-300 transition-colors duration-300 hover:bg-primary-500 hover:text-white"
							>
								Book Now
							</Link>
						</div>
					}
				/>

				<ShowcaseRows items={items} label="Service List" />
			</div>
		</section>
	);
}
