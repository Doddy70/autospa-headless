import { permanentRedirect } from 'next/navigation';

/**
 * The production "Our Services" page.
 *
 * The service catalogue now lives at `/services` - it is the same content,
 * built with the Agntix portfolio metro rows. This route keeps the
 * published URL working by redirecting it to the canonical catalogue.
 */
export default function OurServicesRedirect() {
	permanentRedirect('/services');
}
