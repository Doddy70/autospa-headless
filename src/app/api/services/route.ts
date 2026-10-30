import { SERVICES } from '@/data/services';
import { cardFromStatic } from '@/lib/services/adapters';
import { listServiceCards } from '@/lib/services/catalog';
import type { ServiceCard } from '@/lib/services/types';

/**
 * The service catalogue as JSON.
 *
 * The reservation dialog is mounted once in the root layout, on every page of
 * the site. It reads the services through this route when it is opened, so
 * the page itself does not have to wait for the catalogue.
 */

/** The catalogue of the published pages - the fallback of the fallback. */
function mirrorCards(): ServiceCard[] {
	return SERVICES.map((service, index) => cardFromStatic(service, index));
}

export async function GET() {
	const headers = {
		'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
	};

	try {
		const services = await listServiceCards();

		return Response.json({ services: services.length ? services : mirrorCards() }, { headers });
	} catch (error) {
		/*
		 * The route must never fail: an empty catalogue leaves the customer
		 * in front of a step with no options and no way out. The published
		 * pages are the mirror of the CMS, so they are always there.
		 */
		console.error(
			'[api/services] the catalogue could not be read, serving the mirror:',
			error instanceof Error ? error.message : error,
		);

		return Response.json({ services: mirrorCards() }, { headers });
	}
}
