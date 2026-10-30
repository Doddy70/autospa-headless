/**
 * Service repository - the ONLY module allowed to turn GraphQL into a Service.
 *
 * Phase 1C section 5.2: `ServicePage.tsx -> servicesRepository.getBySlug(slug)
 * -> GraphQL query (in repository)`. Components receive the domain model and
 * never see a raw payload, an error array, or a null-vs-failed distinction.
 *
 * All resilience decisions are made here, once:
 *   - a resolver that throws  -> FieldState 'unavailable'
 *   - a field that is null/[] -> FieldState 'empty'
 * The UI hides the section in both cases, so a backend defect degrades the
 * page instead of breaking it.
 */

import { wpQuery } from '../client';
import { toPlainText } from '../html';
import {
  PACKAGE_TIER_LABELS,
  SERVICE_CATEGORY_LABELS,
  VEHICLE_SIZE_LABELS,
  VEHICLE_SIZE_ORDER,
} from '../choices';
import {
  asArray,
  asChoice,
  asNumber,
  asText,
  choiceLabel,
  formatIDR,
  splitKeywords,
  toField,
} from '../normalize';
import { SERVICES_LIST, SERVICE_BY_SLUG } from '../queries/services';
import type {
  RawConnection,
  RawImage,
  RawPackage,
  RawServiceNode,
  RelatedEntity,
  Service,
  ServiceBenefit,
  ServiceFaq,
  ServiceGalleryItem,
  ServiceImage,
  ServiceProcessStep,
  ServicePackage,
  ServiceSeo,
  ServiceSummary,
  VehiclePrice,
} from '../types/service';
import { routes } from '@/config/site';

/**
 * Slugs from the Phase 2D test dataset (6994-6996). They stay in WordPress as
 * migration evidence, so they are filtered out of public listings rather than
 * touched. Direct URLs still resolve, which keeps them inspectable.
 */
const TEST_SLUG_PREFIX = 'test-';

const CACHE_TAG = 'services';

/* -------------------------------------------------------------- mappers ---- */

function toImage(raw: RawImage | null | undefined): ServiceImage | null {
  const node = raw?.node;
  const url = asText(node?.sourceUrl);
  if (!url) return null;
  return {
    url,
    alt: asText(node?.altText) ?? '',
    width: asNumber(node?.mediaDetails?.width),
    height: asNumber(node?.mediaDetails?.height),
  };
}

function toVehiclePrices(rows: RawPackage['vehicleSizes']): VehiclePrice[] {
  const mapped: VehiclePrice[] = [];

  for (const row of asArray(rows)) {
    const sizeKey = asChoice(row.sizeLabel);
    const price = asNumber(row.price);
    if (!sizeKey || price === null) continue;

    mapped.push({
      sizeKey,
      sizeLabel: choiceLabel(VEHICLE_SIZE_LABELS, sizeKey) ?? sizeKey,
      price,
      priceFormatted: formatIDR(price) ?? String(price),
    });
  }

  const rank = (key: string) => {
    const index = VEHICLE_SIZE_ORDER.indexOf(key as (typeof VEHICLE_SIZE_ORDER)[number]);
    return index === -1 ? VEHICLE_SIZE_ORDER.length : index;
  };

  return mapped.sort((a, b) => rank(a.sizeKey) - rank(b.sizeKey));
}

function toPackage(raw: RawPackage): ServicePackage | null {
  const name = asText(raw.packageName);
  if (!name) return null;

  const tierKey = asChoice(raw.packageTier);
  const prices = toVehiclePrices(raw.vehicleSizes);

  /*
   * `feature` sub-fields currently resolve to null on every row (same stored-
   * meta defect as `benefits`). Dropping the nulls leaves an empty list, and
   * an empty list renders nothing - no placeholder, no invented copy.
   */
  const features = asArray(raw.packageFeatures)
    .map((row) => asText(row.feature))
    .filter((value): value is string => value !== null);

  return {
    name,
    tierKey,
    tierLabel: choiceLabel(PACKAGE_TIER_LABELS, tierKey),
    description: asText(raw.packageDescription),
    recommended: raw.packageRecommended === true,
    durability: asText(raw.packageDurability),
    maintenance: asText(raw.packageMaintenance),
    workmanship: asText(raw.packageWorkmanship),
    features,
    prices,
    startingFrom:
      prices.reduce<VehiclePrice | null>(
        (min, current) => (min === null || current.price < min.price ? current : min),
        null,
      ) ?? null,
  };
}

function toBenefits(
  rows: NonNullable<NonNullable<RawServiceNode['serviceContent']>['benefits']>,
): ServiceBenefit[] {
  return asArray(rows)
    .map((row) => {
      const title = asText(row.benefitTitle);
      return title ? { title, description: asText(row.benefitDescription) } : null;
    })
    .filter((row): row is ServiceBenefit => row !== null);
}

function toProcess(
  rows: NonNullable<NonNullable<RawServiceNode['serviceContent']>['process']>,
): ServiceProcessStep[] {
  const steps = asArray(rows)
    .map((row) => {
      const title = asText(row.stepTitle);
      if (!title) return null;
      return {
        number: asNumber(row.stepNumber),
        title,
        description: asText(row.stepDescription),
        image: toImage(row.stepImage),
      };
    })
    .filter((row): row is ServiceProcessStep => row !== null);

  const allNumbered = steps.every((step) => step.number !== null);
  return allNumbered
    ? steps.sort((a, b) => (a.number ?? 0) - (b.number ?? 0))
    : steps;
}

function toGallery(
  rows: NonNullable<NonNullable<RawServiceNode['serviceGallery']>['gallery']>,
): ServiceGalleryItem[] {
  return asArray(rows)
    .map((row) => {
      const image = toImage(row.galleryImage);
      if (!image) return null;
      return {
        image,
        caption: asText(row.galleryCaption),
        type: asChoice(row.galleryType),
      };
    })
    .filter((row): row is ServiceGalleryItem => row !== null);
}

function toRelated(connection: RawConnection | null | undefined): RelatedEntity[] {
  return asArray(connection?.nodes).map((node) => ({
    databaseId: node.databaseId,
    typeName: node.__typename,
    slug: asText(node.slug),
    title: asText(node.title),
    uri: asText(node.uri),
  }));
}

/**
 * The FAQs of a service, with their body.
 *
 * The CMS stores the answer as HTML (a `wysiwyg` field); the presentation
 * layer prints plain text, so the markup is stripped here. The question of
 * the post is the fallback, for a relation that carries no content.
 */
function toFaqs(connection: RawConnection | null | undefined): ServiceFaq[] {
  return asArray(connection?.nodes)
    .map((node) => ({
      databaseId: node.databaseId,
      slug: asText(node.slug),
      question: asText(node.fAQContent?.faqQuestion) ?? asText(node.title) ?? '',
      answer: toPlainText(asText(node.fAQContent?.faqAnswer) ?? ''),
    }))
    .filter((faq) => faq.question.length > 0);
}

function toSeo(raw: RawServiceNode['serviceSEO']): ServiceSeo {
  return {
    title: asText(raw?.seoTitle),
    description: asText(raw?.seoDescription),
    canonical: asText(raw?.seoCanonical),
    robots: asArray(raw?.seoRobots),
    keywords: splitKeywords(raw?.seoFocusKeyword),
    ogImage: toImage(raw?.seoOgImage),
  };
}

/* ------------------------------------------------------- service assembly -- */

/**
 * @param base dotted GraphQL path of the node, used to match error paths -
 *             `serviceBy` for the detail query.
 */
function mapService(
  node: RawServiceNode,
  unavailable: Set<string>,
  base: string,
): Service {
  const at = (suffix: string) => `${base}.${suffix}`;
  const hero = node.serviceHero;
  const content = node.serviceContent;
  const relationships = node.serviceRelationships;

  const slug = asText(node.slug) ?? String(node.databaseId);
  const categoryKey = asChoice(relationships?.serviceCategory);

  // The hero falls back to the WordPress featured image before giving up.
  let heroImage = toField(hero?.heroImage, at('serviceHero.heroImage'), unavailable, toImage);
  if (heroImage.status !== 'ok') {
    heroImage = toField(node.featuredImage, at('featuredImage'), unavailable, toImage);
  }

  return {
    databaseId: node.databaseId,
    slug,
    path: routes.service(slug),
    title: asText(node.title) ?? slug,
    modified: asText(node.modified),
    categoryKey,
    categoryLabel: choiceLabel(SERVICE_CATEGORY_LABELS, categoryKey),

    hero: {
      title: asText(hero?.heroTitle) ?? asText(node.title) ?? slug,
      description: toField(
        hero?.heroDescription,
        at('serviceHero.heroDescription'),
        unavailable,
      ),
      image: heroImage,
    },

    shortDescription: toField(
      content?.shortDescription,
      at('serviceContent.shortDescription'),
      unavailable,
    ),
    description: toField(
      content?.description,
      at('serviceContent.description'),
      unavailable,
    ),
    benefits: toField(
      content?.benefits,
      at('serviceContent.benefits'),
      unavailable,
      toBenefits,
    ),
    process: toField(
      content?.process,
      at('serviceContent.process'),
      unavailable,
      toProcess,
    ),
    technology: toField(
      content?.technology,
      at('serviceContent.technology'),
      unavailable,
      (rows) =>
        asArray(rows)
          .map((row) => asText(row.technologyName))
          .filter((value): value is string => value !== null),
    ),
    packages: toField(
      node.servicePackages?.packages,
      at('servicePackages.packages'),
      unavailable,
      (rows) =>
        asArray(rows)
          .map(toPackage)
          .filter((row): row is ServicePackage => row !== null),
    ),
    gallery: toField(
      node.serviceGallery?.gallery,
      at('serviceGallery.gallery'),
      unavailable,
      toGallery,
    ),

    related: {
      services: toField(
        relationships?.relatedServices,
        at('serviceRelationships.relatedServices'),
        unavailable,
        toRelated,
      ),
      locations: toField(
        relationships?.relatedLocations,
        at('serviceRelationships.relatedLocations'),
        unavailable,
        toRelated,
      ),
      projects: toField(
        relationships?.relatedProjects,
        at('serviceRelationships.relatedProjects'),
        unavailable,
        toRelated,
      ),
      faqs: toField(
        relationships?.relatedFaqs,
        at('serviceRelationships.relatedFaqs'),
        unavailable,
        toFaqs,
      ),
    },

    seo: toSeo(node.serviceSEO),
  };
}

function toSummary(node: RawServiceNode): ServiceSummary {
  const slug = asText(node.slug) ?? String(node.databaseId);
  const categoryKey = asChoice(node.serviceRelationships?.serviceCategory);
  const packages = asArray(node.servicePackages?.packages)
    .map(toPackage)
    .filter((row): row is ServicePackage => row !== null);

  const startingFrom = packages.reduce<VehiclePrice | null>((min, pkg) => {
    const candidate = pkg.startingFrom;
    if (!candidate) return min;
    return min === null || candidate.price < min.price ? candidate : min;
  }, null);

  return {
    databaseId: node.databaseId,
    slug,
    path: routes.service(slug),
    title: asText(node.title) ?? slug,
    shortDescription: asText(node.serviceContent?.shortDescription),
    categoryKey,
    categoryLabel: choiceLabel(SERVICE_CATEGORY_LABELS, categoryKey),
    image: toImage(node.serviceHero?.heroImage) ?? toImage(node.featuredImage),
    startingFrom,
  };
}

/* ---------------------------------------------------------- public API ----- */

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const { data, unavailable } = await wpQuery<{ serviceBy: RawServiceNode | null }>(
    SERVICE_BY_SLUG,
    { variables: { slug }, tags: [CACHE_TAG, `service:${slug}`] },
  );

  const node = data?.serviceBy;
  return node ? mapService(node, unavailable, 'serviceBy') : null;
}

/** Published services, test-dataset entries excluded. */
export async function getServices(): Promise<ServiceSummary[]> {
  const { data } = await wpQuery<{ services: { nodes: RawServiceNode[] | null } | null }>(
    SERVICES_LIST,
    { variables: { first: 100 }, tags: [CACHE_TAG] },
  );

  return asArray(data?.services?.nodes)
    .filter((node) => !(asText(node.slug) ?? '').startsWith(TEST_SLUG_PREFIX))
    .map(toSummary)
    .sort((a, b) => a.title.localeCompare(b.title, 'id-ID'));
}

/** Slugs to prerender. Test-dataset slugs are excluded but still render on demand. */
export async function getServiceSlugs(): Promise<string[]> {
  const services = await getServices();
  return services.map((service) => service.slug);
}

