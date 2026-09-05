/**
 * Service domain model.
 *
 * Two layers live here:
 *   Raw*   - the exact shape WPGraphQL returns, including its quirks (ACF
 *            `select` arriving as an array, repeaters that may be null).
 *   Domain - the safe model the UI consumes. Optional content is wrapped in
 *            FieldState so a component can never accidentally render a
 *            resolver failure as an empty section.
 *
 * Verified against staging on 2026-09-03 for services 6856 / 7140 / 7141 / 7142.
 */

import type { FieldState } from '../normalize';

/* ------------------------------------------------------------------ raw ---- */

export interface RawImage {
  node: {
    sourceUrl: string | null;
    altText: string | null;
    mediaDetails: { width: number | null; height: number | null } | null;
  } | null;
}

export interface RawServiceNode {
  databaseId: number;
  slug: string | null;
  uri: string | null;
  title: string | null;
  modified?: string | null;
  serviceHero?: {
    heroTitle: string | null;
    heroDescription: string | null;
    heroImage: RawImage | null;
  } | null;
  serviceContent?: {
    shortDescription: string | null;
    description: string | null;
    benefits: { benefitTitle: string | null; benefitDescription: string | null }[] | null;
    process:
      | {
          stepNumber: number | string | null;
          stepTitle: string | null;
          stepDescription: string | null;
          stepImage: RawImage | null;
        }[]
      | null;
    technology: { technologyName: string | null }[] | null;
  } | null;
  servicePackages?: {
    packages: RawPackage[] | null;
  } | null;
  serviceGallery?: {
    gallery:
      | {
          galleryImage: RawImage | null;
          galleryCaption: string | null;
          galleryType: string[] | null;
        }[]
      | null;
  } | null;
  serviceRelationships?: {
    serviceCategory: string[] | null;
    relatedLocations: RawConnection | null;
    relatedProjects: RawConnection | null;
    relatedFaqs: RawConnection | null;
    relatedServices: RawConnection | null;
  } | null;
  serviceSEO?: {
    seoTitle: string | null;
    seoDescription: string | null;
    seoCanonical: string | null;
    seoRobots: string[] | null;
    seoFocusKeyword: string | null;
    seoOgImage: RawImage | null;
  } | null;
  featuredImage?: RawImage | null;
}

export interface RawPackage {
  packageName: string | null;
  packageTier: string[] | null;
  packageDescription: string | null;
  packageRecommended: boolean | null;
  packageDurability: string | null;
  packageMaintenance: string | null;
  packageWorkmanship: string | null;
  packageFeatures: { feature: string | null }[] | null;
  vehicleSizes: { sizeLabel: string[] | null; price: number | string | null }[] | null;
}

export interface RawConnection {
  nodes:
    | {
        __typename: string;
        databaseId: number;
        uri: string | null;
        slug?: string | null;
        title?: string | null;
      }[]
    | null;
}

/* --------------------------------------------------------------- domain ---- */

export interface ServiceImage {
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
}

export interface VehiclePrice {
  sizeKey: string;
  sizeLabel: string;
  price: number;
  priceFormatted: string;
}

export interface ServicePackage {
  name: string;
  tierKey: string | null;
  tierLabel: string | null;
  description: string | null;
  recommended: boolean;
  durability: string | null;
  maintenance: string | null;
  workmanship: string | null;
  /** Empty when `feature` sub-fields do not resolve - render nothing. */
  features: string[];
  prices: VehiclePrice[];
  startingFrom: VehiclePrice | null;
}

export interface ServiceBenefit {
  title: string;
  description: string | null;
}

export interface ServiceProcessStep {
  number: number | null;
  title: string;
  description: string | null;
  image: ServiceImage | null;
}

export interface ServiceGalleryItem {
  image: ServiceImage;
  caption: string | null;
  type: string | null;
}

export interface RelatedEntity {
  databaseId: number;
  typeName: string;
  slug: string | null;
  title: string | null;
  uri: string | null;
}

export interface ServiceSeo {
  title: string | null;
  description: string | null;
  canonical: string | null;
  robots: string[];
  keywords: string[];
  ogImage: ServiceImage | null;
}

export interface Service {
  databaseId: number;
  slug: string;
  /** Canonical path, always `/services/<slug>`. */
  path: string;
  title: string;
  modified: string | null;
  categoryKey: string | null;
  categoryLabel: string | null;

  hero: {
    title: string;
    description: FieldState<string>;
    image: FieldState<ServiceImage>;
  };

  shortDescription: FieldState<string>;
  /** WYSIWYG HTML from WordPress. */
  description: FieldState<string>;
  benefits: FieldState<ServiceBenefit[]>;
  process: FieldState<ServiceProcessStep[]>;
  technology: FieldState<string[]>;
  packages: FieldState<ServicePackage[]>;
  gallery: FieldState<ServiceGalleryItem[]>;

  related: {
    services: FieldState<RelatedEntity[]>;
    locations: FieldState<RelatedEntity[]>;
    projects: FieldState<RelatedEntity[]>;
    faqs: FieldState<RelatedEntity[]>;
  };

  seo: ServiceSeo;
}

export interface ServiceSummary {
  databaseId: number;
  slug: string;
  path: string;
  title: string;
  shortDescription: string | null;
  categoryKey: string | null;
  categoryLabel: string | null;
  image: ServiceImage | null;
  startingFrom: VehiclePrice | null;
}
