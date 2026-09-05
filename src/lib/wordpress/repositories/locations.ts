/**
 * Location repository - currently scoped to contact details for CTAs.
 *
 * Deliberate behaviour: the only locations in staging carrying a phone number
 * are the Phase 2D test records (`test-autosp-pluit`, `test-autosp-pik2`). The
 * real record (6857 `autosp-pluit`) is still `draft` with every contact field
 * null. Test contact data must never surface as the business's real number, so
 * test slugs are filtered out and this returns null instead. Callers render no
 * contact link at all rather than an invented one.
 */

import { wpQuery } from '../client';
import { LOCATIONS_CONTACT } from '../queries/locations';
import { asArray, asChoice, asText } from '../normalize';
import type { LocationContact, RawLocationNode } from '../types/location';

const TEST_SLUG_PREFIX = 'test-';
const CONTACTABLE_STATUS = ['active', 'verified'];

function digitsOnly(value: string | null): string | null {
  if (!value) return null;
  const digits = value.replace(/\D/g, '');
  return digits.length >= 8 ? digits : null;
}

function toContact(node: RawLocationNode): LocationContact | null {
  const slug = asText(node.slug);
  if (!slug) return null;

  const identity = node.locationIdentity;
  const address = node.locationAddress;
  const geo = node.locationGeo;

  const addressLine = [
    asText(address?.addressStreet),
    asText(address?.addressDistrict),
    asText(address?.addressCity),
    asText(address?.addressProvince),
    asText(address?.addressPostalCode),
  ]
    .filter((part): part is string => part !== null)
    .join(', ');

  const lat = geo?.geoLatitude;
  const lng = geo?.geoLongitude;
  const mapsUrl =
    asText(geo?.googleMapsUrl) ??
    (typeof lat === 'number' && typeof lng === 'number'
      ? `https://maps.google.com/?q=${lat},${lng}`
      : null);

  return {
    databaseId: node.databaseId,
    slug,
    title: asText(node.title) ?? slug,
    status: asChoice(identity?.locationStatus),
    tagline: asText(node.locationContent?.locationTagline),
    phone: asText(identity?.locationPhone),
    whatsapp: digitsOnly(asText(identity?.locationWhatsapp)),
    email: asText(identity?.locationEmail),
    addressLine: addressLine.length > 0 ? addressLine : null,
    city: asText(address?.addressCity),
    mapsUrl,
  };
}

async function fetchLocations(): Promise<LocationContact[]> {
  const { data } = await wpQuery<{
    locations: { nodes: RawLocationNode[] | null } | null;
  }>(LOCATIONS_CONTACT, { variables: { first: 50 }, tags: ['locations'] });

  return asArray(data?.locations?.nodes)
    .filter((node) => !(asText(node.slug) ?? '').startsWith(TEST_SLUG_PREFIX))
    .map(toContact)
    .filter((location): location is LocationContact => location !== null);
}

/**
 * The location whose contact details may be published: not test data, marked
 * active or verified, and carrying at least one reachable channel. Returns null
 * when no such record exists - which is the current state of staging.
 */
export async function getPrimaryContact(): Promise<LocationContact | null> {
  const locations = await fetchLocations();

  return (
    locations.find(
      (location) =>
        location.status !== null &&
        CONTACTABLE_STATUS.includes(location.status) &&
        (location.whatsapp !== null || location.phone !== null),
    ) ?? null
  );
}

export async function getLocations(): Promise<LocationContact[]> {
  return fetchLocations();
}
