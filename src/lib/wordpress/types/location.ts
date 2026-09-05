/** Minimal Location model - only what CTAs, header and footer need. */

export interface LocationContact {
  databaseId: number;
  slug: string;
  title: string;
  /** `active` / `verified` / `draft` / `inactive`, from ACF. */
  status: string | null;
  tagline: string | null;
  phone: string | null;
  /** Digits only, ready for a wa.me URL. */
  whatsapp: string | null;
  email: string | null;
  addressLine: string | null;
  city: string | null;
  mapsUrl: string | null;
}

export interface RawLocationNode {
  databaseId: number;
  slug: string | null;
  uri: string | null;
  title: string | null;
  locationIdentity?: {
    locationStatus: string[] | null;
    locationPhone: string | null;
    locationWhatsapp: string | null;
    locationEmail: string | null;
  } | null;
  locationAddress?: {
    addressStreet: string | null;
    addressDistrict: string | null;
    addressCity: string | null;
    addressProvince: string | null;
    addressPostalCode: string | null;
  } | null;
  locationGeo?: {
    googleMapsUrl: string | null;
    geoLatitude: number | null;
    geoLongitude: number | null;
  } | null;
  locationContent?: {
    locationTagline: string | null;
  } | null;
}
