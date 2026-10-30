/**
 * Location repository - the ONLY module allowed to turn GraphQL into a
 * Location.
 *
 * It maps the `location` CPT into the `LocationContact` model: the contact
 * details of a branch, the address, the map and the opening hours.
 *
 * The `test-` slugs are filtered out. Test contact data must never surface
 * as the business's real number.
 *
 * The real branches live in WordPress since the Location CPT was seeded
 * (`acf-json/seed-locations.php`); the static branch directory in
 * `data/contact.ts` is the fallback while the CMS cannot answer.
 */

import { wpQuery } from '../client';
import { LOCATIONS_CONTACT } from '../queries/locations';
import { asArray, asChoice, asText } from '../normalize';
import type {
  LocationContact,
  RawLocationNode,
  RawOpeningHour,
} from '../types/location';

const TEST_SLUG_PREFIX = 'test-';
const CONTACTABLE_STATUS = ['active', 'verified'];

/** The weekday keys of the `opening_hours` repeater, in order. */
const WEEKDAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

/** The Indonesian name of a weekday. */
const WEEKDAY_LABELS: Record<string, string> = {
  monday: 'Senin',
  tuesday: 'Selasa',
  wednesday: 'Rabu',
  thursday: 'Kamis',
  friday: 'Jumat',
  saturday: 'Sabtu',
  sunday: 'Minggu',
};

function digitsOnly(value: string | null): string | null {
  if (!value) return null;
  const digits = value.replace(/\D/g, '');
  return digits.length >= 8 ? digits : null;
}

/**
 * The international form of a WhatsApp number.
 *
 * A branch publishes its line in the local format ("0877 1777 3888"); a wa.me
 * link needs the international one ("6287717773888"). The same normalisation
 * is in `branchWhatsapp()` of `data/contact.ts`.
 */
function toWhatsapp(value: string | null): string | null {
  const digits = digitsOnly(value);
  if (!digits) return null;
  if (digits.startsWith('62')) return digits;
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  return `62${digits}`;
}

/** "08:30" -> "08.30", the way the branch directory writes it. */
function toDotted(time: string | null): string | null {
  if (!time) return null;
  return time.slice(0, 5).replace(':', '.');
}

/**
 * The opening hours of a branch, as one line.
 *
 * Every branch publishes the same hours on every day, so the common case is
 * one line ("Setiap hari 08.30 - 18.00"). A branch that opens on different
 * times is listed day by day.
 */
function formatHours(rows: RawOpeningHour[]): {
  hours: string | null;
  openTime: string | null;
  closeTime: string | null;
} {
  const open = rows.find((row) => !row.isClosed)?.openTime ?? null;
  const close = rows.find((row) => !row.isClosed)?.closeTime ?? null;

  if (!open || !close) return { hours: null, openTime: null, closeTime: null };

  const sameEveryDay = rows.every(
    (row) =>
      row.isClosed === false &&
      row.openTime === open &&
      row.closeTime === close,
  );

  if (sameEveryDay) {
    return {
      hours: `Setiap hari ${toDotted(open)} - ${toDotted(close)}`,
      openTime: open,
      closeTime: close,
    };
  }

  const orderOf = (row: RawOpeningHour) => {
    const index = WEEKDAYS.indexOf(
      (row.dayName?.[0] ?? '') as (typeof WEEKDAYS)[number],
    );
    return index === -1 ? WEEKDAYS.length : index;
  };

  const sorted = [...rows].sort((a, b) => orderOf(a) - orderOf(b));

  const hours = sorted
    .map((row) => {
      const day = WEEKDAY_LABELS[row.dayName?.[0] ?? ''] ?? row.dayName?.[0] ?? '';
      if (row.isClosed) return `${day}: tutup`;
      return `${day} ${toDotted(row.openTime)} - ${toDotted(row.closeTime)}`;
    })
    .join(', ');

  return { hours, openTime: open, closeTime: close };
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

  const hours = formatHours(asArray(node.businessHours?.openingHours));

  return {
    databaseId: node.databaseId,
    slug,
    title: asText(node.title) ?? slug,
    status: asChoice(identity?.locationStatus),
    tagline: asText(node.locationContent?.locationTagline),
    phone: asText(identity?.locationPhone),
    whatsapp: toWhatsapp(asText(identity?.locationWhatsapp)),
    email: asText(identity?.locationEmail),
    addressLine: addressLine.length > 0 ? addressLine : null,
    city: asText(address?.addressCity),
    mapsUrl,
    hours: hours.hours,
    openTime: hours.openTime,
    closeTime: hours.closeTime,
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
 * active or verified, and carrying at least one reachable channel. Returns
 * null when no such record exists.
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

/**
 * Every branch of the CMS.
 *
 * The order is the order the CMS returns: newest first. The published
 * directory (`data/contact.ts`) is the fallback, and it keeps the published
 * order of the branches.
 */
export async function getLocations(): Promise<LocationContact[]> {
  return fetchLocations();
}
