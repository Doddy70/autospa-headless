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
      }
    }
  }
`;
