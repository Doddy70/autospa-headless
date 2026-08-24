# PHASE 2C: API CONTRACT
## AutoSP AJakarta - Headless WordPress Project

**Project:** Headless WordPress → Next.js for SEO/GEO Rebuild
**Date:** 2026-08-18
**Status:** TECHNICAL SPECIFICATION (Not for Implementation)

---

## 1. CONTRACT OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          API CONTRACT                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  WORDPRESS (Source of Truth)                                             │
│  ├── ACF Fields: Business data                                         │
│  ├── WPGraphQL: API Layer                                              │
│  └── Webhooks: Cache invalidation                                       │
│                                                                          │
│  NEXT.JS (Consumer)                                                     │
│  ├── Repository Pattern: Clean data access                               │
│  ├── Types: TypeScript interfaces                                       │
│  └── ISR: Intelligent caching                                          │
│                                                                          │
│  CONTRACT BOUNDARIES:                                                   │
│  ├── SEO: WordPress owns metadata                                      │
│  ├── Structured Data: Next.js generates from WordPress data              │
│  ├── Cache: Next.js ISR + Webhook invalidation                          │
│  └── Mutations: WordPress admin only (no public writes)                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. DATA BOUNDARIES

### 2.1 WordPress Owns

```
WordPress is the SOURCE OF TRUTH for:

1. SEO METADATA
   - Meta title
   - Meta description
   - Canonical URL
   - Robots settings
   - Focus keywords
   - OG image

2. CONTENT
   - Page/post body content
   - Excerpts
   - Featured images
   - Media library

3. BUSINESS DATA
   - Service packages and pricing
   - Location details
   - Opening hours
   - Contact information

4. RELATIONSHIPS
   - Service ↔ Location
   - Project ↔ Service
   - FAQ ↔ Service/Location

5. TAXONOMY
   - Categories
   - Tags
   - Custom taxonomies
```

### 2.2 Next.js Owns

```
Next.js handles:

1. RENDERING
   - Server-side rendering
   - Static generation
   - ISR cache management

2. STRUCTURED DATA (JSON-LD)
   - Organization schema
   - LocalBusiness schema
   - Service schema
   - Article schema
   - FAQPage schema
   - BreadcrumbList schema

3. NAVIGATION/ROUTING
   - generateStaticParams()
   - generateMetadata()
   - route handlers

4. STATIC ASSETS
   - Fonts
   - CSS
   - JavaScript bundles
```

### 2.3 Example: SEO Boundary

```
❌ WRONG:
Next.js generates different title than WordPress.

WordPress: "Ceramic Coating Jakarta | AutoSPA"
Next.js:   "Jasa Ceramic Coating Mobil Jakarta Termurah"

❌ WRONG:
Next.js ignores WordPress SEO fields.

WordPress: seo_title = "Custom SEO Title"
Next.js:  Generates from content

✅ CORRECT:
Next.js reads WordPress SEO fields.

WordPress: seo_title = "Ceramic Coating | AutoSPA Jakarta"
Next.js:  Uses value for <title> and OG tags

✅ CORRECT:
Next.js generates JSON-LD from WordPress data.

WordPress: location data (address, phone, hours)
Next.js:  LocalBusiness schema
```

---

## 3. ENDPOINT SPECIFICATIONS

### 3.1 GraphQL Endpoint

```
PRODUCTION:
https://autospajakarta.com/graphql

DEVELOPMENT:
http://localhost:3000/api/graphql (or proxy to WP)

METHOD: POST
CONTENT-TYPE: application/json
AUTHENTICATION: None (public read-only)
```

### 3.2 Revalidation Endpoint

```
PRODUCTION:
https://autospajakarta.com/api/revalidate

METHOD: GET or POST
AUTHENTICATION: ?secret=XXX

PARAMETERS:
- secret (required): Revalidation secret
- path (optional): Path to revalidate
- tag (optional): Next.js cache tag

RESPONSE:
{
  "revalidated": true,
  "path": "/services/nano-ceramic-coating",
  "tag": "service:nano-ceramic-coating"
}
```

---

## 4. RESPONSE CONTRACTS

### 4.1 Service Response

```typescript
// Service API Response Contract

interface ServiceAPIResponse {
  data: {
    service: Service | null;
  };
  errors?: GraphQLError[];
}

interface Service {
  // WordPress Core
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  
  // ACF: Hero
  heroImage: MediaItem | null;
  heroTitle: string;
  heroDescription: string;
  
  // ACF: Content
  shortDescription: string;
  description: string;
  benefits: ServiceBenefit[];
  process: ProcessStep[];
  technology: string[];
  
  // ACF: Packages
  packages: ServicePackage[];
  
  // ACF: Relationships
  relatedLocations: Connection<LocationSummary>;
  relatedProjects: Connection<ProjectSummary>;
  relatedFaqs: FAQSummary[];
  relatedServices: Connection<ServiceSummary>;
  
  // ACF: SEO
  seoTitle: string | null;
  seoDescription: string | null;
  seoCanonical: string | null;
  seoFocusKeyword: string | null;
  
  // Media
  featuredImage: MediaItem | null;
}
```

### 4.2 Location Response

```typescript
// Location API Response Contract

interface LocationAPIResponse {
  data: {
    location: Location | null;
  };
  errors?: GraphQLError[];
}

interface Location {
  // WordPress Core
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  content: string;
  date: string;
  modified: string;
  
  // ACF: Identity
  locationStatus: 'draft' | 'verified' | 'active' | 'inactive';
  locationPhone: string;
  locationWhatsapp: string;
  locationEmail: string;
  
  // ACF: Address
  addressStreet: string;
  addressDistrict: string;
  addressCity: string;
  addressProvince: string;
  addressPostalCode: string;
  addressCountry: string;
  
  // ACF: Geo
  geoLatitude: number;
  geoLongitude: number;
  googleMapsUrl: string;
  
  // ACF: Business
  openingHours: OpeningHour[];
  
  // ACF: Content
  locationTagline: string;
  locationDescription: string;
  locationHighlights: string[];
  serviceAreas: string[];
  
  // ACF: Relationships
  locationServices: Connection<ServiceSummary>;
  locationProjects: Connection<ProjectSummary>;
  locationTestimonials: Connection<TestimonialSummary>;
  
  // SEO
  seo: SEOData;
  
  // Computed
  fullAddress: string;
  isOpen: boolean;
}
```

### 4.3 Site Config Response

```typescript
// Site Config API Response Contract

interface SiteConfigResponse {
  data: {
    siteConfig: {
      organization: {
        name: string;
        legalName: string;
        description: string;
        url: string;
        logo: MediaItem;
        primaryPhone: string;
        whatsapp: string;
        email: string;
      };
      
      social: {
        instagram: string;
        facebook: string;
        youtube: string;
        tiktok: string;
      };
      
      seo: {
        title: string;
        description: string;
        ogImage: MediaItem;
        robots: { index: boolean; follow: boolean };
      };
    };
  };
}
```

---

## 5. ERROR CONTRACT

### 5.1 GraphQL Errors

```typescript
interface GraphQLError {
  message: string;
  locations?: { line: number; column: number }[];
  path?: string[];
  extensions?: {
    code: string;
    field?: string;
    suggestion?: string;
  };
}

// Error Codes
const ErrorCodes = {
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
};
```

### 5.2 Error Responses

```typescript
// 404 Response
{
  "errors": [{
    "message": "No Service found with slug: non-existent-slug",
    "locations": [{"line": 2, "column": 3}],
    "path": ["service"],
    "extensions": {
      "code": "NOT_FOUND"
    }
  }],
  "data": { "service": null }
}

// Validation Error
{
  "errors": [{
    "message": "Variable 'slug' is required",
    "extensions": {
      "code": "VALIDATION_ERROR",
      "field": "slug"
    }
  }]
}

// Rate Limited
{
  "errors": [{
    "message": "Rate limit exceeded",
    "extensions": {
      "code": "RATE_LIMITED"
    }
  }]
}
```

---

## 6. SECURITY CONTRACT

### 6.1 Allowed Operations

```
GRAPHQL ENDPOINT (Public):
✓ READ operations only
✓ Query services, locations, projects, posts
✓ Query site configuration
✗ NO write operations
✗ NO authentication required for reads

REVALIDATION ENDPOINT (Protected):
✓ Requires secret token
✓ Requires valid path or tag
✗ No admin operations
```

### 6.2 Security Headers

```
GraphQL Response Headers:
  Content-Type: application/json
  Cache-Control: no-cache, no-store, must-revalidate
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN

Next.js Response Headers:
  X-DNS-Prefetch-Control: on
  Strict-Transport-Security: max-age=63072000
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

### 6.3 Rate Limiting

```
GraphQL Endpoint:
- 100 requests per minute per IP (development)
- To be determined based on production traffic

Revalidation Endpoint:
- 10 requests per minute per secret token
```

---

## 7. VERSIONING CONTRACT

### 7.1 Breaking Changes Policy

```
When breaking changes are required:

1. Announce 30 days in advance
2. Maintain backward compatibility when possible
3. Version the API if breaking changes unavoidable
4. Document migration path

Current Version: v1 (implicit)
Next.js uses: /graphql (always latest stable)
```

### 7.2 Deprecation Policy

```
Fields/queries marked for removal:

1. Will return deprecation warning in response
2. Will be documented in migration guide
3. Will have 90-day sunset period
```

---

## 8. MONITORING CONTRACT

### 8.1 Metrics to Track

```typescript
interface APIMetrics {
  // Request Metrics
  requestCount: number;           // Total requests
  requestDuration: number;        // ms average
  errorRate: number;             // percentage
  
  // Error Metrics
  errorTypes: {
    notFound: number;
    validationError: number;
    serverError: number;
  };
  
  // Cache Metrics
  cacheHitRate: number;           // percentage
  revalidationCount: number;     // webhook triggers
  
  // Query Performance
  slowQueries: {                 // > 1000ms
    query: string;
    duration: number;
    timestamp: string;
  }[];
}
```

### 8.2 Alert Thresholds

```
CRITICAL:
- Error rate > 5%
- Response time > 5000ms
- Unavailable > 1 minute

WARNING:
- Error rate > 1%
- Response time > 1000ms
- Cache hit rate < 80%
```

---

## 9. SAMPLE INTEGRATIONS

### 9.1 Fetching Services

```typescript
// Example: Fetch all active services

import { serviceRepository } from '@/lib/wordpress/repositories/service.repository';

async function getServicesForNavigation() {
  const services = await serviceRepository.getAll({
    first: 10,
  });
  
  return services.map(service => ({
    label: service.title,
    href: `/services/${service.slug}`,
  }));
}
```

### 9.2 Fetching Location with Services

```typescript
// Example: Fetch location with available services

import { locationRepository } from '@/lib/wordpress/repositories/location.repository';

async function getLocationServices(locationSlug: string) {
  const location = await locationRepository.getBySlug(locationSlug);
  
  if (!location) return null;
  
  return {
    location: {
      name: location.title,
      address: location.fullAddress,
      phone: location.locationPhone,
      services: location.locationServices.nodes,
    },
  };
}
```

### 9.3 Revalidating on Update

```typescript
// Example: WordPress hook triggers revalidation

// In WordPress theme/plugin:
add_action('acf/save_post', function($post_id) {
  $slug = get_post_field('post_name', $post_id);
  $post_type = get_post_type($post_id);
  
  $endpoint = 'https://autospajakarta.com/api/revalidate';
  $secret = 'YOUR_REVALIDATE_SECRET';
  
  // Revalidate listing page and specific item
  $paths = [
    "/api/revalidate?secret={$secret}&path=/{$post_type}s",
    "/api/revalidate?secret={$secret}&path=/{$post_type}s/{$slug}",
  ];
  
  foreach ($paths as $path) {
    wp_remote_get($endpoint . $path);
  }
}, 100);
```

---

## 10. CONTRACT SUMMARY

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CONTRACT SUMMARY                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ENDPOINTS:                                                            │
│  ├── /graphql (POST) - Public read-only GraphQL                         │
│  └── /api/revalidate (GET/POST) - Protected cache invalidation           │
│                                                                          │
│  DATA OWNERSHIP:                                                       │
│  ├── WordPress owns: Content, SEO, Business Data, Relationships          │
│  └── Next.js owns: Rendering, JSON-LD, Caching                          │
│                                                                          │
│  AUTHENTICATION:                                                       │
│  ├── GraphQL: None (public read)                                        │
│  └── Revalidation: Secret token required                                │
│                                                                          │
│  CACHING:                                                              │
│  ├── Strategy: ISR with webhook invalidation                              │
│  ├── Default: 1 hour for dynamic content                               │
│  └── On-demand: Revalidate on WordPress update                           │
│                                                                          │
│  ERROR HANDLING:                                                       │
│  ├── GraphQL errors return null for not found                           │
│  ├── Validation errors return clear messages                             │
│  └── Server errors return 500 with logging                             │
│                                                                          │
│  SECURITY:                                                             │
│  ├── No public write operations                                          │
│  ├── Rate limiting on endpoints                                        │
│  └── Input validation on all parameters                                 │
│                                                                          │
│  MONITORING:                                                           │
│  ├── Track: Error rate, response time, cache hit rate                   │
│  └── Alert on: Error > 5%, Response > 5s                              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

**Document Status:** TECHNICAL SPECIFICATION (For Review)
**Last Updated:** 2026-08-18
**Next:** Review → Schema Freeze → Phase 2D Implementation
