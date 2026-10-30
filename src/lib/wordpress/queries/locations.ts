/**
 * Location GraphQL documents.
 *
 * The `location` CPT exposes its fields in the nested ACF groups:
 *
 *   locationIdentity  - status, phone, whatsapp, email
 *   locationAddress   - street, district, city, province, postal code
 *   locationGeo       - google maps url, latitude, longitude
 *   businessHours     - the `opening_hours` repeater, one row per weekday
 *   locationContent   - tagline, description, highlights
 *
 * The relationship connections expose `ContentNode`, so `title`/`slug` need
 * an inline fragment on the concrete type.
 */

export const LOCATIONS_CONTACT = /* GraphQL */ `
  query LocationsContact($first: Int = 50) {
    locations(first: $first, where: { status: PUBLISH }) {
      nodes {
        databaseId
        slug
        uri
        title
        locationIdentity {
          locationStatus
          locationPhone
          locationWhatsapp
          locationEmail
        }
        locationAddress {
          addressStreet
          addressDistrict
          addressCity
          addressProvince
          addressPostalCode
        }
        locationGeo {
          googleMapsUrl
          geoLatitude
          geoLongitude
        }
        locationContent {
          locationTagline
        }
        businessHours {
          openingHours {
            dayName
            isClosed
            openTime
            closeTime
          }
        }
      }
    }
  }
`;
