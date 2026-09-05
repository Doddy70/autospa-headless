/**
 * Service GraphQL documents.
 *
 * Every field path below was validated against staging on 2026-09-03. Notable
 * shapes that are easy to get wrong:
 *   - the SEO group is `serviceSEO` (uppercase acronym), not `serviceSeo`
 *   - `serviceCategory` lives in `serviceRelationships`, not `serviceContent`
 *   - `technology` is a repeater (`technologyName`), not a scalar
 *   - packages have no `packagePrice`; pricing is per `vehicleSizes` row
 *   - relationship connections expose `ContentNode`, so `title`/`slug` need an
 *     inline fragment on the concrete type
 *
 * `benefits` and `process` are requested even though their resolvers currently
 * throw. GraphQL returns the rest of the payload alongside a per-path error, so
 * asking for them costs nothing and the sections light up automatically once
 * the stored meta is repaired - no frontend change needed.
 */

const IMAGE_FIELDS = `
  node {
    sourceUrl
    altText
    mediaDetails { width height }
  }
`;

export const SERVICE_BY_SLUG = /* GraphQL */ `
  query ServiceBySlug($slug: String!) {
    serviceBy(slug: $slug) {
      databaseId
      slug
      uri
      title
      modified
      serviceHero {
        heroTitle
        heroDescription
        heroImage { ${IMAGE_FIELDS} }
      }
      serviceContent {
        shortDescription
        description
        benefits {
          benefitTitle
          benefitDescription
        }
        process {
          stepNumber
          stepTitle
          stepDescription
          stepImage { ${IMAGE_FIELDS} }
        }
        technology {
          technologyName
        }
      }
      servicePackages {
        packages {
          packageName
          packageTier
          packageDescription
          packageRecommended
          packageDurability
          packageMaintenance
          packageWorkmanship
          packageFeatures { feature }
          vehicleSizes { sizeLabel price }
        }
      }
      serviceGallery {
        gallery {
          galleryCaption
          galleryType
          galleryImage { ${IMAGE_FIELDS} }
        }
      }
      serviceRelationships {
        serviceCategory
        relatedServices {
          nodes { __typename databaseId uri ... on Service { slug title } }
        }
        relatedLocations {
          nodes { __typename databaseId uri ... on Location { slug title } }
        }
        relatedProjects {
          nodes { __typename databaseId uri ... on Project { slug title } }
        }
        relatedFaqs {
          nodes { __typename databaseId uri ... on FAQ { slug title } }
        }
      }
      serviceSEO {
        seoTitle
        seoDescription
        seoCanonical
        seoRobots
        seoFocusKeyword
        seoOgImage { ${IMAGE_FIELDS} }
      }
      featuredImage { ${IMAGE_FIELDS} }
    }
  }
`;

/**
 * List document for `generateStaticParams`, the services index and related-
 * service cards. Deliberately omits `benefits` / `process` - a card never
 * renders them, and leaving them out keeps the list response error-free.
 */
export const SERVICES_LIST = /* GraphQL */ `
  query ServicesList($first: Int = 100) {
    services(first: $first, where: { status: PUBLISH }) {
      nodes {
        databaseId
        slug
        uri
        title
        serviceContent { shortDescription }
        serviceRelationships { serviceCategory }
        servicePackages {
          packages {
            packageName
            packageTier
            packageDescription
            packageRecommended
            packageDurability
            packageMaintenance
            packageWorkmanship
            packageFeatures { feature }
            vehicleSizes { sizeLabel price }
          }
        }
        serviceHero { heroImage { ${IMAGE_FIELDS} } }
        featuredImage { ${IMAGE_FIELDS} }
      }
    }
  }
`;
