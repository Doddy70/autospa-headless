# PHASE 2C: QUERY ARCHITECTURE
## AutoSP AJakarta - Headless WordPress Project

**Project:** Headless WordPress → Next.js for SEO/GEO Rebuild
**Date:** 2026-08-18
**Status:** TECHNICAL SPECIFICATION (Not for Implementation)

---

## 1. ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         NEXT.JS 15 APPLICATION                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                    lib/wordpress/                              │   │
│   │   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │   │
│   │   │   client.ts  │ │   types/     │ │ repositories/│         │   │
│   │   └──────────────┘ └──────────────┘ └──────────────┘         │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                 components/                                      │   │
│   │   Uses repository methods, NOT raw GraphQL queries              │   │
│   │   Example: const service = await serviceRepo.getBySlug(slug)    │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              │ typed GraphQL queries
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      WORDPRESS + WPGraphQL                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                    │
│   │   ACF       │ │  WPGraphQL  │ │   WPGraphQL │                    │
│   │   Fields    │ │   Schema    │ │   Connections│                    │
│   └──────────────┘ └──────────────┘ └──────────────┘                    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. DIRECTORY STRUCTURE

```
src/
│
├── lib/
│   └── wordpress/
│       │
│       ├── client.ts              # GraphQL client setup
│       │
│       ├── queries/
│       │   ├── fragments.ts       # Shared fragments
│       │   ├── service.queries.ts
│       │   ├── location.queries.ts
│       │   ├── project.queries.ts
│       │   ├── faq.queries.ts
│       │   ├── testimonial.queries.ts
│       │   ├── post.queries.ts
│       │   └── site.queries.ts
│       │
│       ├── repositories/
│       │   ├── base.repository.ts     # Abstract base class
│       │   ├── service.repository.ts
│       │   ├── location.repository.ts
│       │   ├── project.repository.ts
│       │   ├── faq.repository.ts
│       │   ├── testimonial.repository.ts
│       │   ├── post.repository.ts
│       │   └── site.repository.ts
│       │
│       └── types/
│           ├── service.types.ts
│           ├── location.types.ts
│           ├── project.types.ts
│           ├── faq.types.ts
│           ├── testimonial.types.ts
│           ├── post.types.ts
│           └── site.types.ts
│
├── app/
│   │
│   ├── services/
│   │   └── [slug]/
│   │       └── page.tsx             # Uses serviceRepository
│   │
│   ├── locations/
│   │   └── [slug]/
│   │       └── page.tsx             # Uses locationRepository
│   │
│   ├── projects/
│   │   └── [slug]/
│   │       └── page.tsx             # Uses projectRepository
│   │
│   ├── blog/
│   │   └── [slug]/
│   │       └── page.tsx             # Uses postRepository
│   │
│   ├── api/
│   │   └── revalidate/
│   │       └── route.ts            # Webhook endpoint
│   │
│   └── layout.tsx                  # Uses siteRepository
│
└── components/
    ├── services/
    ├── locations/
    └── ...
```

---

## 3. CLIENT SETUP

### 3.1 GraphQL Client

```typescript
// lib/wordpress/client.ts

import { GraphQLClient } from 'graphql-request';

const WORDPRESS_GRAPHQL_URL = process.env.WORDPRESS_GRAPHQL_URL!;
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET!;

class WordPressClient {
  private client: GraphQLClient;

  constructor() {
    this.client = new GraphQLClient(WORDPRESS_GRAPHQL_URL, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async query<T>({
    query,
    variables,
    revalidate = false,
    tags,
  }: {
    query: string;
    variables?: Record<string, unknown>;
    revalidate?: number | false;
    tags?: string[];
  }): Promise<T> {
    // In production, this would use fetch with Next.js caching
    // In development, direct request
    const response = await this.client.request<T>(query, variables);
    return response;
  }
}

export const wpClient = new WordPressClient();

// Revalidation helper
export async function revalidatePath(path: string): Promise<void> {
  await fetch(`/api/revalidate?path=${path}&secret=${REVALIDATE_SECRET}`);
}
```

---

## 4. BASE REPOSITORY

### 4.1 Abstract Base

```typescript
// lib/wordpress/repositories/base.repository.ts

export abstract class BaseRepository<T> {
  protected abstract queryKey: string;
  protected abstract queryFragment: string;

  async getAll(options?: {
    first?: number;
    where?: Record<string, unknown>;
  }): Promise<T[]> {
    const query = `
      query GetAll($first: Int, $where: ${this.queryKey}WhereArgs) {
        ${this.queryKey}s(first: $first, where: $where) {
          nodes {
            ${this.queryFragment}
          }
        }
      }
    `;

    const result = await wpClient.query<{ [key: string]: { nodes: T[] } }>({
      query,
      variables: options,
    });

    return result[`${this.queryKey}s`].nodes;
  }

  async getBySlug(slug: string): Promise<T | null> {
    const query = `
      query GetBySlug($slug: String!) {
        ${this.queryKey}(id: $slug, idType: SLUG) {
          ${this.queryFragment}
        }
      }
    `;

    const result = await wpClient.query<{ [key: string]: T | null }>({
      query,
      variables: { slug },
    });

    return result[this.queryKey];
  }

  async getById(id: number): Promise<T | null> {
    const query = `
      query GetById($id: Int!) {
        ${this.queryKey}(id: $id, idType: DATABASE_ID) {
          ${this.queryFragment}
        }
      }
    `;

    const result = await wpClient.query<{ [key: string]: T | null }>({
      query,
      variables: { id },
    });

    return result[this.queryKey];
  }
}
```

---

## 5. SERVICE REPOSITORY

### 5.1 Query Definitions

```typescript
// lib/wordpress/queries/service.queries.ts

export const SERVICE_FRAGMENT = `
  id
  databaseId
  title
  slug
  content
  excerpt
  date
  modified
  status
  
  heroImage {
    sourceUrl
    altText
    mediaDetails {
      width
      height
    }
  }
  heroTitle
  heroDescription
  
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
    stepImage
  }
  
  technology
  
  packages {
    packageName
    packageTier
    packageDescription
    packageRecommended
    vehicleSizes {
      sizeLabel
      price
    }
    packageFeatures
    packageDurability
    packageMaintenance
    packageWorkmanship
  }
  
  relatedLocations(first: 10) {
    nodes {
      id
      title
      slug
      addressCity
    }
  }
  
  seoTitle
  seoDescription
  seoCanonical
  seoFocusKeyword
  
  featuredImage {
    sourceUrl
    altText
  }
`;

export const GET_ALL_SERVICES = `
  query GetAllServices($first: Int, $where: ServiceWhereArgs) {
    services(first: $first, where: $where) {
      nodes {
        ${SERVICE_FRAGMENT}
      }
    }
  }
`;

export const GET_SERVICE_BY_SLUG = `
  query GetServiceBySlug($slug: String!) {
    service(id: $slug, idType: SLUG) {
      ${SERVICE_FRAGMENT}
      
      relatedProjects(first: 6) {
        nodes {
          id
          title
          slug
          vehicleBrand
          vehicleModel
          afterImages(first: 1) {
            sourceUrl
          }
        }
      }
      
      relatedFaqs {
        id
        faqQuestion
        faqAnswer
      }
      
      relatedServices(first: 3) {
        nodes {
          id
          title
          slug
          heroImage {
            sourceUrl
          }
        }
      }
    }
  }
`;
```

### 5.2 Repository Implementation

```typescript
// lib/wordpress/repositories/service.repository.ts

import { BaseRepository } from './base.repository';
import { wpClient } from '../client';
import { GET_ALL_SERVICES, GET_SERVICE_BY_SLUG, SERVICE_FRAGMENT } from '../queries/service.queries';

export interface Service {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  content: string;
  heroImage: { sourceUrl: string; altText: string };
  heroTitle: string;
  shortDescription: string;
  packages: ServicePackage[];
  relatedLocations: { nodes: LocationSummary[] };
  // ... other fields from fragment
}

export interface ServicePackage {
  packageName: string;
  packageTier: string;
  vehicleSizes: { sizeLabel: string; price: number }[];
}

export interface LocationSummary {
  id: string;
  title: string;
  slug: string;
  addressCity: string;
}

export class ServiceRepository extends BaseRepository<Service> {
  protected queryKey = 'service';
  protected queryFragment = SERVICE_FRAGMENT;

  async getAll(options?: {
    first?: number;
    category?: string;
    hasLocation?: number;
  }): Promise<Service[]> {
    const where: Record<string, unknown> = {};
    if (options?.category) where.serviceCategory = options.category;
    if (options?.hasLocation) where.hasRelatedLocation = true;

    const result = await wpClient.query<{ services: { nodes: Service[] } }>({
      query: GET_ALL_SERVICES,
      variables: { first: options?.first, where },
      revalidate: 3600, // ISR: 1 hour
      tags: ['services'],
    });

    return result.services.nodes;
  }

  async getBySlug(slug: string): Promise<Service | null> {
    const result = await wpClient.query<{ service: Service | null }>({
      query: GET_SERVICE_BY_SLUG,
      variables: { slug },
      revalidate: 3600, // ISR: 1 hour
      tags: ['service', `service:${slug}`],
    });

    return result.service;
  }

  async getRelated(serviceId: string, limit = 3): Promise<Service[]> {
    // Implementation for related services
    const query = `
      query GetRelated($id: ID!) {
        service(id: $id) {
          relatedServices(first: ${limit}) {
            nodes {
              ${SERVICE_FRAGMENT}
            }
          }
        }
      }
    `;

    const result = await wpClient.query<{ service: { relatedServices: { nodes: Service[] } } }>({
      query,
      variables: { id: serviceId },
    });

    return result.service?.relatedServices.nodes || [];
  }
}

export const serviceRepository = new ServiceRepository();
```

---

## 6. LOCATION REPOSITORY

### 6.1 Query Definitions

```typescript
// lib/wordpress/queries/location.queries.ts

export const LOCATION_FRAGMENT = `
  id
  databaseId
  title
  slug
  content
  date
  modified
  
  locationStatus
  locationPhone
  locationWhatsapp
  
  addressStreet
  addressDistrict
  addressCity
  addressProvince
  addressPostalCode
  
  geoLatitude
  geoLongitude
  googleMapsUrl
  
  openingHours {
    dayName
    isClosed
    openTime
    closeTime
  }
  
  locationTagline
  locationDescription
  locationHighlights
  serviceAreas
  
  seo {
    title
    description
  }
`;

export const GET_ALL_LOCATIONS = `
  query GetAllLocations($first: Int, $where: LocationWhereArgs) {
    locations(first: $first, where: $where) {
      nodes {
        ${LOCATION_FRAGMENT}
      }
    }
  }
`;

export const GET_LOCATION_BY_SLUG = `
  query GetLocationBySlug($slug: String!) {
    location(id: $slug, idType: SLUG) {
      ${LOCATION_FRAGMENT}
      
      locationServices {
        nodes {
          id
          title
          slug
          heroImage {
            sourceUrl
          }
        }
      }
      
      locationProjects(first: 6) {
        nodes {
          id
          title
          slug
          vehicleBrand
          vehicleModel
          afterImages(first: 1) {
            sourceUrl
          }
        }
      }
      
      locationTestimonials(first: 3) {
        nodes {
          id
          customerName
          customerQuote
          testimonialSource
        }
      }
    }
  }
`;
```

### 6.2 Repository Implementation

```typescript
// lib/wordpress/repositories/location.repository.ts

import { BaseRepository } from './base.repository';
import { wpClient } from '../client';
import { GET_ALL_LOCATIONS, GET_LOCATION_BY_SLUG, LOCATION_FRAGMENT } from '../queries/location.queries';

export interface Location {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  locationStatus: 'draft' | 'verified' | 'active' | 'inactive';
  locationPhone: string;
  addressCity: string;
  geoLatitude: number;
  geoLongitude: number;
  openingHours: OpeningHour[];
  locationServices: { nodes: ServiceSummary[] };
  // ... other fields
}

export interface OpeningHour {
  dayName: string;
  isClosed: boolean;
  openTime: string;
  closeTime: string;
}

export interface ServiceSummary {
  id: string;
  title: string;
  slug: string;
  heroImage: { sourceUrl: string };
}

export class LocationRepository extends BaseRepository<Location> {
  protected queryKey = 'location';
  protected queryFragment = LOCATION_FRAGMENT;

  async getAll(options?: {
    first?: number;
    status?: string;
    hasService?: number;
  }): Promise<Location[]> {
    const where: Record<string, unknown> = {};
    if (options?.status) where.status = options.status;
    if (options?.hasService) where.hasServices = true;

    const result = await wpClient.query<{ locations: { nodes: Location[] } }>({
      query: GET_ALL_LOCATIONS,
      variables: { first: options?.first, where },
      revalidate: 3600,
      tags: ['locations'],
    });

    return result.locations.nodes;
  }

  async getActiveLocations(): Promise<Location[]> {
    return this.getAll({ status: 'active' });
  }

  async getBySlug(slug: string): Promise<Location | null> {
    const result = await wpClient.query<{ location: Location | null }>({
      query: GET_LOCATION_BY_SLUG,
      variables: { slug },
      revalidate: 3600,
      tags: ['location', `location:${slug}`],
    });

    return result.location;
  }
}

export const locationRepository = new LocationRepository();
```

---

## 7. PAGE USAGE EXAMPLES

### 7.1 Service Page

```typescript
// app/services/[slug]/page.tsx

import { notFound } from 'next/navigation';
import { serviceRepository } from '@/lib/wordpress/repositories/service.repository';
import { ServiceHero } from '@/components/services/ServiceHero';
import { ServicePackages } from '@/components/services/ServicePackages';
import { ServiceProcess } from '@/components/services/ServiceProcess';
import { ServiceFAQ } from '@/components/services/ServiceFAQ';
import { BookingCTA } from '@/components/common/BookingCTA';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = await serviceRepository.getBySlug(slug);
  
  if (!service) return { title: 'Service Not Found' };
  
  return {
    title: service.seoTitle || `${service.title} | AutoSPA Jakarta`,
    description: service.seoDescription || service.shortDescription,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = await serviceRepository.getBySlug(slug);
  
  if (!service) notFound();
  
  return (
    <main>
      <ServiceHero
        image={service.heroImage?.sourceUrl}
        title={service.heroTitle || service.title}
        description={service.heroDescription}
      />
      
      <ServicePackages packages={service.packages} />
      
      <ServiceProcess steps={service.process} />
      
      <ServiceFAQ faqs={service.relatedFaqs} />
      
      <BookingCTA
        phone={process.env.NEXT_PUBLIC_PHONE}
        whatsapp={process.env.NEXT_PUBLIC_WHATSAPP}
      />
    </main>
  );
}
```

### 7.2 Homepage

```typescript
// app/page.tsx

import { serviceRepository } from '@/lib/wordpress/repositories/service.repository';
import { locationRepository } from '@/lib/wordpress/repositories/location.repository';
import { projectRepository } from '@/lib/wordpress/repositories/project.repository';
import { siteRepository } from '@/lib/wordpress/repositories/site.repository';

export default async function HomePage() {
  // Parallel data fetching
  const [services, locations, featuredProjects, siteConfig] = await Promise.all([
    serviceRepository.getAll({ first: 6 }),
    locationRepository.getActiveLocations(),
    projectRepository.getFeatured({ first: 6 }),
    siteRepository.getConfig(),
  ]);
  
  return (
    <main>
      {/* Hero, Services Grid, Locations, Projects, etc. */}
    </main>
  );
}
```

---

## 8. REVALIDATION WEBHOOK

### 8.1 Route Handler

```typescript
// app/api/revalidate/route.ts

import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get('secret');
  const path = searchParams.get('path');
  const tag = searchParams.get('tag');
  
  if (secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }
  
  try {
    if (path) {
      revalidatePath(path);
    }
    
    if (tag) {
      revalidateTag(tag);
    }
    
    return NextResponse.json({ revalidated: true, path, tag });
  } catch (err) {
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
}
```

### 8.2 WordPress Webhook Trigger

```php
// WordPress: Add to theme or custom plugin
// Triggered on post_save, post_delete, etc.

add_action('acf/save_post', function($post_id) {
  $post_type = get_post_type($post_id);
  $slug = get_post_field('post_name', $post_id);
  
  $endpoint = 'https://autospajakarta.com/api/revalidate';
  $secret = getenv('REVALIDATE_SECRET');
  
  $paths = [];
  
  switch ($post_type) {
    case 'service':
      $paths[] = '/services/' . $slug;
      $paths[] = '/services';
      $tags = ['services', 'service:' . $slug];
      break;
      
    case 'location':
      $paths[] = '/locations/' . $slug;
      $paths[] = '/locations';
      $tags = ['locations', 'location:' . $slug];
      break;
      
    case 'project':
      $paths[] = '/projects/' . $slug;
      $paths[] = '/projects';
      $tags = ['projects', 'project:' . $slug];
      break;
      
    case 'post':
      $paths[] = '/blog/' . $slug;
      $paths[] = '/blog';
      $tags = ['posts', 'post:' . $slug];
      break;
      
    default:
      $paths[] = '/';
      $tags = ['homepage'];
  }
  
  foreach ($paths as $path) {
    wp_remote_post($endpoint . '?secret=' . $secret . '&path=' . urlencode($path));
  }
}, 100);
```

---

## 9. CACHING STRATEGY

### 9.1 ISR Configuration

| Page Type | Revalidation | Reason |
|-----------|-------------|--------|
| Homepage | 1800 (30 min) | High traffic, needs freshness |
| Service Listing | 3600 (1 hour) | Pricing can change |
| Service Detail | 3600 (1 hour) | Packages/pricing |
| Location Listing | 3600 (1 hour) | Hours/status |
| Location Detail | 3600 (1 hour) | Hours/status |
| Project Listing | 86400 (24 hours) | Generally static |
| Project Detail | 86400 (24 hours) | Generally static |
| Blog Listing | 3600 (1 hour) | New posts |
| Blog Post | 86400 (24 hours) | Content rarely changes |
| FAQ | 3600 (1 hour) | Content updates |
| Legal Pages | 604800 (1 week) | Rarely changes |

### 9.2 On-Demand Revalidation

```
TRIGGERS:
├── WordPress post save/update
├── WordPress post delete
├── ACF field update
└── WordPress theme/plugin update

WORDPRESS → WEBHOOK → NEXT.JS CACHE CLEAR
```

---

## 10. ERROR HANDLING

### 10.1 Repository Error Handling

```typescript
// lib/wordpress/client.ts

class WordPressClient {
  async query<T>(options: QueryOptions): Promise<T> {
    try {
      const result = await this.client.request<T>(
        options.query,
        options.variables
      );
      return result;
    } catch (error) {
      // Log error
      console.error('GraphQL Error:', {
        query: options.query,
        variables: options.variables,
        error,
      });
      
      // Return null for getBy queries
      if (options.query.includes('getBy')) {
        return null;
      }
      
      // Throw for list queries
      throw error;
    }
  }
}
```

### 10.2 Page Error Handling

```typescript
// app/services/[slug]/page.tsx

export default async function ServicePage({ params }: Props) {
  let service: Service | null = null;
  
  try {
    const { slug } = await params;
    service = await serviceRepository.getBySlug(slug);
  } catch (error) {
    // Log but don't crash page
    console.error('Failed to fetch service:', error);
  }
  
  if (!service) {
    return <ErrorPage message="Service not found" />;
  }
  
  return <ServiceContent service={service} />;
}
```

---

**Document Status:** TECHNICAL SPECIFICATION (For Review)
**Last Updated:** 2026-08-18
**Next:** Review → Schema Freeze → Phase 2D Implementation
