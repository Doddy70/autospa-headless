# PHASE 2C: WPGraphQL SCHEMA SPECIFICATION
## AutoSP AJakarta - Headless WordPress Project

**Project:** Headless WordPress → Next.js for SEO/GEO Rebuild
**Date:** 2026-08-18
**Status:** TECHNICAL SPECIFICATION (Not for Implementation)

---

## 1. SCHEMA PRINCIPLES

### 1.1 GraphQL Design Goals

```
OBJECTIVES:
1. Easy to consume by Next.js
2. Reflects ACF structure
3. Exposes public fields only
4. Supports relationship queries
5. Performance-optimized queries
```

### 1.2 WPGraphQL Plugins Required

```
PLUGINS:
├── wp-graphql (core)
├── wp-graphql-acf (ACF integration)
└── wpgraphql-ide (development only)
```

---

## 2. TYPE DEFINITIONS

### 2.1 Service Type

```graphql
"""
AutoSP AJakarta Service
Represents a service offering (Ceramic Coating, PPF, Detailing, etc.)
"""
type Service implements Node & ContentNode {
  # WordPress Core Fields
  id: ID!
  databaseId: Int!
  title: String
  slug: String!
  content: String
  excerpt: String
  date: String
  modified: String
  status: String

  # ACF Fields: Hero
  heroImage: MediaItem
  heroTitle: String
  heroDescription: String

  # ACF Fields: Content
  shortDescription: String
  description: String
  benefits: [ServiceBenefit]
  process: [ServiceProcessStep]
  technology: [String]

  # ACF Fields: Packages
  packages: [ServicePackage]

  # ACF Fields: Media
  gallery: [ServiceGalleryItem]

  # ACF Fields: Relationships
  relatedLocations: ServiceToLocationConnection
  relatedProjects: ServiceToProjectConnection
  relatedFaqs: ServiceToFaqConnection
  relatedServices: ServiceToServiceConnection

  # ACF Fields: SEO
  seoTitle: String
  seoDescription: String
  seoCanonical: String
  seoFocusKeyword: String

  # SEO
  seo: SEOData
  seoScores: SEOScores

  # Connections
  featuredImage: MediaItem
  uri: String!
  link: String!
}

# Supporting Types
type ServiceBenefit {
  benefitTitle: String
  benefitDescription: String
}

type ServiceProcessStep {
  stepNumber: Int
  stepTitle: String
  stepDescription: String
  stepImage: String
}

type ServicePackage {
  packageName: String
  packageTier: String
  packageDescription: String
  packageRecommended: Boolean
  vehicleSizes: [PackageVehicleSize]
  packageFeatures: [String]
  packageDurability: String
  packageMaintenance: String
  packageWorkmanship: String
}

type PackageVehicleSize {
  sizeLabel: String
  price: Int
}

type ServiceGalleryItem {
  galleryImage: MediaItem
  galleryCaption: String
  galleryType: String
}
```

### 2.2 Location Type

```graphql
"""
AutoSP AJakarta Location
Represents a physical branch location
"""
type Location implements Node & ContentNode {
  # WordPress Core Fields
  id: ID!
  databaseId: Int!
  title: String
  slug: String!
  content: String
  date: String
  modified: String

  # ACF Fields: Identity
  locationStatus: String
  locationPhone: String
  locationWhatsapp: String
  locationEmail: String

  # ACF Fields: Address
  addressStreet: String
  addressDistrict: String
  addressCity: String
  addressProvince: String
  addressPostalCode: String
  addressCountry: String

  # ACF Fields: Geo
  geoLatitude: Float
  geoLongitude: Float
  googleMapsUrl: String
  googlePlaceId: String

  # ACF Fields: Business
  openingHours: [LocationOpeningHour]
  googleBusinessUrl: String

  # ACF Fields: Content
  locationTagline: String
  locationDescription: String
  locationHighlights: [String]
  locationFacilities: [String]
  serviceAreas: [String]

  # ACF Fields: Media
  locationGallery: [LocationGalleryItem]

  # Relationships
  locationServices: LocationToServiceConnection
  locationProjects: LocationToProjectConnection
  locationTestimonials: LocationToTestimonialConnection
  locationFaqs: LocationToFaqConnection

  # SEO
  seo: SEOData

  # Computed Fields
  fullAddress: String
  coordinates: GeoCoordinates
  isOpen: Boolean
  currentOpeningHours: LocationOpeningHour

  # WordPress
  featuredImage: MediaItem
  uri: String!
  link: String!
}

type LocationOpeningHour {
  dayName: String
  isClosed: Boolean
  openTime: String
  closeTime: String
}

type GeoCoordinates {
  latitude: Float!
  longitude: Float!
}

type LocationGalleryItem {
  locationGalleryImage: MediaItem
  locationGalleryCaption: String
  locationGalleryType: String
}
```

### 2.3 Project Type

```graphql
"""
AutoSP AJakarta Project
Represents a completed work/case study
"""
type Project implements Node & ContentNode {
  # WordPress Core Fields
  id: ID!
  databaseId: Int!
  title: String
  slug: String!
  content: String
  excerpt: String
  date: String
  modified: String

  # ACF Fields: Vehicle
  vehicleBrand: String
  vehicleModel: String
  vehicleYear: String
  vehicleColor: String

  # ACF Fields: Content
  projectChallenge: String
  projectSolution: String
  projectResult: String

  # ACF Fields: Media
  beforeImages: [MediaItem]
  processImages: [MediaItem]
  afterImages: [MediaItem]
  projectGallery: [MediaItem]

  # Relationships
  projectService: Service
  projectLocation: Location
  completedAt: String

  # SEO
  seo: SEOData

  # Computed
  vehicleDisplay: String

  # WordPress
  featuredImage: MediaItem
  uri: String!
  link: String!
}
```

### 2.4 FAQ Type

```graphql
"""
AutoSP AJakarta FAQ
Question and answer content unit
"""
type FAQ implements Node {
  id: ID!
  databaseId: Int!

  # ACF Fields: Content
  faqQuestion: String!
  faqAnswer: String
  faqOrder: Int
  faqFeatured: Boolean
  faqCategory: String

  # Relationships
  faqService: Service
  faqLocation: Location
}
```

### 2.5 Testimonial Type

```graphql
"""
AutoSP AJakarta Testimonial
Customer endorsement/quote
"""
type Testimonial implements Node {
  id: ID!
  databaseId: Int!

  # WordPress Core Fields
  title: String
  date: String

  # ACF Fields: Content
  customerName: String
  customerRole: String
  customerCompany: String
  customerQuote: String
  customerVehicle: String

  # ACF Fields: Media
  customerPhoto: MediaItem
  videoUrl: String

  # Relationships
  testimonialService: Service
  testimonialLocation: Location

  # ACF Fields: Context
  testimonialSource: String
  testimonialSourceUrl: String
  testimonialFeatured: Boolean
}
```

### 2.6 SEO Type

```graphql
type SEOData {
  title: String
  description: String
  focusKeyword: String
  canonicalUrl: String
  robots: SEORobots
  ogImage: MediaItem
}

type SEORobots {
  index: Boolean
  follow: Boolean
}

type SEOScores {
  overall: Int
  readability: Int
  keywords: Int
  links: Int
}
```

### 2.7 Support Types

```graphql
type MediaItem implements Node {
  id: ID!
  databaseId: Int!
  title: String
  altText: String
  caption: String
  sourceUrl: String
  srcSet: String
  sizes: String
  width: Int
  height: Int
  mimeType: String
  modified: String

  # Responsive URLs
  medium: MediaDetails
  large: MediaDetails
  thumbnail: MediaDetails
}

type MediaDetails {
  sourceUrl: String
  width: Int
  height: Int
}

type SiteConfig {
  organization: OrganizationInfo
  social: SocialProfiles
  seo: DefaultSEO
}

type OrganizationInfo {
  name: String
  legalName: String
  description: String
  url: String
  logo: MediaItem
  favicon: MediaItem
  primaryPhone: String
  whatsapp: String
  email: String
}

type SocialProfiles {
  instagram: String
  facebook: String
  youtube: String
  tiktok: String
  linkedin: String
}

type DefaultSEO {
  title: String
  description: String
  ogImage: MediaItem
  robots: SEORobots
  analyticsId: String
  tagManagerId: String
}
```

---

## 3. CONNECTIONS

### 3.1 Service Connections

```graphql
type ServiceToLocationConnection {
  edges: [ServiceToLocationConnectionEdge]
  nodes: [Location]
  pageInfo: PageInfo
}

type ServiceToLocationConnectionEdge {
  node: Location
  cursor: String
}

type ServiceToProjectConnection {
  edges: [ServiceToProjectConnectionEdge]
  nodes: [Project]
  pageInfo: PageInfo
}

type ServiceToProjectConnectionEdge {
  node: Project
  cursor: String
}

type ServiceToFaqConnection {
  edges: [ServiceToFaqConnectionEdge]
  nodes: [FAQ]
  pageInfo: PageInfo
}

type ServiceToServiceConnection {
  edges: [ServiceToServiceConnectionEdge]
  nodes: [Service]
  pageInfo: PageInfo
}
```

### 3.2 Location Connections

```graphql
type LocationToServiceConnection {
  edges: [LocationToServiceConnectionEdge]
  nodes: [Service]
  pageInfo: PageInfo
}

type LocationToProjectConnection {
  edges: [LocationToProjectConnectionEdge]
  nodes: [Project]
  pageInfo: PageInfo
}

type LocationToTestimonialConnection {
  edges: [LocationToTestimonialConnectionEdge]
  nodes: [Testimonial]
  pageInfo: PageInfo
}
```

### 3.3 Post Connections

```graphql
type RootQuery {
  # Post Connections
  posts: PostToPostConnection
  post: Post
  categories: CategoryToCategoryConnection
  tags: TagToTagConnection

  # CPT Connections
  services: ServiceToServiceConnection
  service: Service
  locations: LocationToLocationConnection
  location: Location
  projects: ProjectToProjectConnection
  project: Project
  faqs: FAQToFAQConnection
  faq: FAQ
  testimonials: TestimonialToTestimonialConnection
  testimonial: Testimonial

  # Site Config
  siteConfig: SiteConfig
}
```

---

## 4. QUERY DEFINITIONS

### 4.1 Service Queries

```graphql
type RootQuery {
  """
  Query services with filters
  """
  services(
    where: ServiceWhereArgs
    first: Int
    last: Int
    after: String
    before: String
  ): ServiceToServiceConnection

  """
  Query single service by ID or slug
  """
  service(
    id: ID!
    idType: ServiceIdType
  ): Service
}

enum ServiceIdType {
  ID
  DATABASE_ID
  SLUG
}

input ServiceWhereArgs {
  status: String
  serviceCategory: String
  hasRelatedLocation: Boolean
  locationId: Int
  search: String
  orderby: ServiceOrderBy
  order: Order
}

enum ServiceOrderBy {
  DATE
  TITLE
  MENU_ORDER
  MODIFIED
}
```

### 4.2 Location Queries

```graphql
type RootQuery {
  """
  Query locations with filters
  """
  locations(
    where: LocationWhereArgs
    first: Int
    last: Int
    after: String
    before: String
  ): LocationToLocationConnection

  """
  Query single location by ID or slug
  """
  location(
    id: ID!
    idType: LocationIdType
  ): Location
}

enum LocationIdType {
  ID
  DATABASE_ID
  SLUG
}

input LocationWhereArgs {
  status: String
  hasServices: Boolean
  serviceId: Int
  search: String
  orderby: LocationOrderBy
  order: Order
}

enum LocationOrderBy {
  DATE
  TITLE
  MENU_ORDER
  MODIFIED
}
```

### 4.3 Project Queries

```graphql
type RootQuery {
  """
  Query projects with filters
  """
  projects(
    where: ProjectWhereArgs
    first: Int
    last: Int
    after: String
    before: String
  ): ProjectToProjectConnection

  """
  Query single project by ID or slug
  """
  project(
    id: ID!
    idType: ProjectIdType
  ): Project
}

enum ProjectIdType {
  ID
  DATABASE_ID
  SLUG
}

input ProjectWhereArgs {
  status: String
  serviceId: Int
  locationId: Int
  vehicleBrand: String
  search: String
  orderby: ProjectOrderBy
  order: Order
}

enum ProjectOrderBy {
  DATE
  TITLE
  MODIFIED
  COMPLETED_AT
}
```

### 4.4 FAQ Queries

```graphql
type RootQuery {
  """
  Query FAQs with filters
  """
  faqs(
    where: FaqWhereArgs
    first: Int
    last: Int
    after: String
    before: String
  ): FAQToFAQConnection

  """
  Query single FAQ by ID
  """
  faq(
    id: ID!
    idType: FaqIdType
  ): FAQ
}

enum FaqIdType {
  ID
  DATABASE_ID
}

input FaqWhereArgs {
  serviceId: Int
  locationId: Int
  category: String
  featured: Boolean
  orderby: FaqOrderBy
  order: Order
}

enum FaqOrderBy {
  MENU_ORDER
  DATE
  TITLE
}
```

---

## 5. MUTATIONS

### 5.1 No Public Mutations

```
DECISION: No GraphQL mutations exposed publicly

REASON:
- WordPress admin handles all content editing
- Headless CMS pattern: WordPress = Write, Next.js = Read
- Authentication complexity not needed for public API

IMPLEMENTATION:
- Content changes via WordPress admin
- Cache invalidation via webhook (see Query Architecture)
```

---

## 6. INTERNAL vs PUBLIC FIELDS

### 6.1 Exposed to GraphQL (Public)

```graphql
# All content fields
- title, slug, content, excerpt
- all ACF content fields
- relationships (locations, projects, etc.)
- SEO metadata (title, description, robots)

# Media
- featuredImage
- gallery images

# Dates
- date, modified, completedAt
```

### 6.2 NOT Exposed to GraphQL (CMS-only)

```graphql
# Migration tracking
- migration_status
- migration_notes
- migration_date

# Internal content
- internal_notes
- content_editor_notes
- verification_notes

# WordPress internal
- _edit_last
- _edit_lock
- _wp_old_slug
- any field prefixed with _
```

### 6.3 WPGraphQL Settings

```php
// Add to theme/plugin
add_filter('graphql_data_should_persist_meta', function($should, $key) {
  // Never expose internal/meta fields
  if (strpos($key, 'migration_') === 0) return false;
  if (strpos($key, '_') === 0) return false;
  if ($key === 'internal_notes') return false;
  return $should;
}, 10, 2);
```

---

## 7. SCHEMA SECURITY

### 7.1 Query Depth Limiting

```php
// wp-graphql-ide or custom
add_filter('graphql_query_cost', function($cost, $variants, $variables, $operation) {
  // Limit maximum depth
  if ($cost['depth'] > 10) {
    return new WP_Error('Query too deep');
  }
  return $cost;
}, 10, 4);
```

### 7.2 Rate Limiting

```php
// Via Nginx or WPGraphQL Pro
// Consider: request limiting per IP/client
```

### 7.3 Introspection

```php
// Consider disabling in production
add_filter('graphql_is_graphql_debug', function($enabled) {
  return !defined('WP_ENV') || WP_ENV !== 'production';
});
```

---

## 8. CACHING HEADERS

### 8.1 GraphQL Response Headers

```
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

### 8.2 CDN Caching Strategy

```
Next.js ISR handles caching:
- Service pages: revalidate: 3600 (1 hour)
- Location pages: revalidate: 3600
- Blog posts: revalidate: 86400 (24 hours)
- Homepage: revalidate: 1800 (30 min)

On-demand revalidation via webhook:
POST /api/revalidate?secret=XXX&path=/services/nano-ceramic-coating
```

---

**Document Status:** TECHNICAL SPECIFICATION (For Review)
**Last Updated:** 2026-08-18
**Next:** Review → Schema Freeze → Phase 2D Implementation
