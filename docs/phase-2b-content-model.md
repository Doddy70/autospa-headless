# PHASE 2B: FINAL CONTENT MODEL
## AutoSP AJakarta - Headless WordPress Project

**Project:** Headless WordPress → Next.js for SEO/GEO Rebuild
**Date:** 2026-08-18
**Status:** FINAL - Locked

---

## 1. ARCHITECTURE OVERVIEW

```
                         ┌──────────────────┐
                         │   ORGANIZATION   │
                         │     AutoSPA      │
                         └────────┬─────────┘
                                  │
                   ┌──────────────┴──────────────┐
                   ▼                             ▼
             ┌──────────┐                 ┌──────────┐
             │ LOCATION │                 │ SERVICE  │
             └────┬─────┘                 └────┬─────┘
                  │                            │
          ┌───────┼────────┐            ┌──────┼───────┐
          ▼       ▼        ▼            ▼      ▼       ▼
       Projects  FAQs   Services     Packages  FAQs   Projects
          │                 │
          └────────┬────────┘
                   ▼
               TESTIMONIAL
                   
                   BLOG
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
       SERVICE             LOCATION
       TOPIC                TOPIC
```

---

## 2. ENTITY DEFINITIONS

### 2.1 Organization

**Purpose:** Global brand entity for Organization + WebSite schema

```typescript
interface Organization {
  // Identity
  name: string;                    // "AutoSP AJakarta"
  legalName?: string;              // Legal entity name
  alternateName?: string;          // "AutoSPA"
  description: string;             // Brand description
  
  // Media
  logo: Media;                    // Logo image
  favicon?: Media;
  
  // Digital
  url: string;                    // "https://autospajakarta.com"
  
  // Contact
  telephone?: string;             // Primary phone
  email?: string;                 // Contact email
  
  // Social (for sameAs)
  social: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    tiktok?: string;
  };
  
  // Relationships
  locations: LocationReference[];   // All physical locations
  
  // Metadata
  founded?: string;               // "2014"
  areaServed?: string[];           // ["Jakarta", "Depok", "Tangerang", "Bekasi", "Bogor"]
}
```

**Schema Type:** Organization + WebSite (NOT LocalBusiness)

**Scope:** Global - single instance

---

### 2.2 Location

**Purpose:** Physical branch entity for LocalBusiness schema + GEO targeting

```typescript
interface Location {
  // Identity
  id: string;
  name: string;                   // "AutoSPA Pluit"
  slug: string;                   // "pluit"
  status: 'draft' | 'verified' | 'active' | 'inactive';
  
  // Address
  address: {
    street: string;               // "Jl. Pluit Karang Ayu Barat No.16"
    district?: string;             // "Pluit"
    city: string;                  // "Jakarta Utara"
    province: string;              // "DKI Jakarta"
    postalCode?: string;           // "14440"
    country: string;               // "Indonesia"
  };
  
  // Geographic
  coordinates: {
    latitude: number;
    longitude: number;
  };
  
  // Contact
  contact: {
    phone: string;                 // Primary phone
    whatsapp?: string;            // WhatsApp number
    email?: string;
  };
  
  // Operations
  openingHours: OperatingHours[];
  googleMapsUrl?: string;
  googleBusinessUrl?: string;
  googlePlaceId?: string;
  
  // Content
  content: {
    tagline?: string;              // Short description
    description: string;          // Full description (100+ words)
    highlights: string[];          // "Spesialis Ceramic Coating", "Buka sejak 2014"
    facilities: string[];          // "Lift 2 mobil", "AC waiting area"
  };
  
  // Media
  gallery: Media[];              // Photos of location
  
  // Relationships
  services: ServiceReference[];    // Available services at this location
  projects?: ProjectReference[];    // Projects done here
  testimonials?: TestimonialReference[];
  faqs?: FAQReference[];
  
  // GEO - Areas served from this location
  serviceAreas: string[];         // ["Pluit", "Penjaringan", "PIK", "Jakarta Utara"]
  
  // SEO
  seo: SEOMetadata;
}

interface OperatingHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  open: string;                   // "08:00"
  close: string;                  // "18:00"
  closed?: boolean;               // For days off
}
```

**Schema Type:** LocalBusiness (per physical location)

**Scope:** One per physical branch

---

### 2.3 Service

**Purpose:** Commercial core entity - main revenue driver

```typescript
interface Service {
  // Identity
  id: string;
  title: string;                  // "Nano Ceramic Coating"
  slug: string;                   // "nano-ceramic-coating"
  shortName?: string;             // "Ceramic" for UI labels
  
  // Content
  excerpt: string;                // Short summary (50-100 words)
  description: string;            // Full description (150+ words)
  
  // Category
  category: 'coating' | 'protection' | 'detailing' | 'wash' | 'other';
  
  // Media
  heroImage: Media;
  gallery: Media[];
  
  // Structured Content
  benefits: string[];              // Customer value propositions
  process: ProcessStep[];         // Service procedure
  technology: string[];            // Products/technology used
  
  // Pricing - Packages embedded in Service
  packages: ServicePackage[];
  
  // Relationships
  locations: LocationReference[];  // Where this service is available
  projects?: ProjectReference[];     // Proof/work examples
  faqs?: FAQReference[];          // Service-specific FAQ
  relatedServices?: ServiceReference[]; // Cross-sell
  
  // SEO
  seo: SEOMetadata;
}

interface ProcessStep {
  order: number;
  title: string;                  // "Inspection"
  description: string;
  duration?: string;               // "30 minutes"
  image?: Media;
}

interface ServicePackage {
  id: string;
  name: string;                  // "Light Package"
  tier: 'basic' | 'standard' | 'premium' | 'ultimate';
  description?: string;
  
  // Pricing by vehicle size
  pricing: VehicleSizePricing;
  
  // Technical specs
  layers?: number;                // For ceramic: 2, 5, 7, 10 layers
  hardness?: string;               // For ceramic: "9H", "10H+"
  thickness?: string;              // For PPF: "170 micron", "200 micron"
  tpuGrade?: string;             // For PPF: "TPU Made in USA"
  
  // Value props
  durability: string;              // "1-2 years"
  maintenance: string;               // "1 year member"
  workmanship?: string;             // "3-4 days"
  
  // Inclusions
  includes: string[];
  excludes?: string[];
  
  // Display
  badge?: string;                // "Most Popular", "Best Value"
  recommended?: boolean;
  
  // CTA
  ctaText?: string;              // "View Pricing"
  ctaUrl?: string;
}

interface VehicleSizePricing {
  small: number;                  // City car: IDR 3,000,000
  medium: number;                  // Sedan/SUV: IDR 4,000,000
  large: number;                  // Large SUV: IDR 5,000,000
  xlarge: number;                 // MPV/Large: IDR 6,000,000
  super: number;                  // Luxury: IDR 8,000,000
}
```

**Schema Type:** Service

**Scope:** One per service type (not per package)

---

### 2.4 Project

**Purpose:** Proof-of-work entity - evidence for Service + Location

```typescript
interface Project {
  // Identity
  id: string;
  title: string;                  // "Toyota Alphard - Ceramic Coating"
  slug: string;                   // "toyota-alphard-ceramic-coating-pluit"
  
  // Content
  excerpt: string;                 // Short summary
  description: string;             // Full story
  
  // Vehicle
  vehicle: {
    brand: string;                // "Toyota"
    model: string;               // "Alphard"
    year?: string;               // "2023"
    color?: string;               // "Black"
  };
  
  // Relationships
  service: ServiceReference;       // Primary service performed
  location?: LocationReference;     // Where it was done
  
  // Media
  beforeImages: Media[];
  processImages?: Media[];        // Work in progress
  afterImages: Media[];
  gallery?: Media[];
  
  // Story
  challenge?: string;             // Customer's problem
  solution?: string;              // What was done
  result?: string;                // Outcome
  
  // Metadata
  completedAt?: string;           // "2025-03-15"
  
  // SEO
  seo: SEOMetadata;
}
```

**Schema Type:** ItemList (portfolio) or Service

**Scope:** One per completed work

---

### 2.5 FAQ

**Purpose:** Question-answer content unit with contextual relationships

```typescript
interface FAQ {
  // Content
  question: string;
  answer: string;                  // HTML/Markdown supported
  
  // Organization
  order: number;                  // Display order
  
  // Context - determines where FAQ appears
  context: {
    type: 'global' | 'service' | 'location';
    service?: ServiceReference;     // If context.type = 'service'
    location?: LocationReference;  // If context.type = 'location'
  };
  
  // Metadata
  category?: string;              // "Pricing", "Process", "Technical"
  featured?: boolean;              // Show on FAQ page
}
```

**Schema Type:** FAQPage

**Usage:**
- Global FAQ: Shows on /faq/ page
- Service FAQ: Shows on service pages + /faq/
- Location FAQ: Shows on location pages

---

### 2.6 Testimonial

**Purpose:** Customer endorsement with source tracking

```typescript
interface Testimonial {
  // Content
  name: string;                   // "Bpk. John Doe"
  role?: string;                  // "Pengusaha"
  company?: string;                // Company if applicable
  quote: string;                  // The testimonial text
  
  // Media
  photo?: Media;                  // Customer photo (if available)
  
  // Attribution
  vehicle?: string;               // "Toyota Alphard 2023"
  
  // Relationships (optional context)
  service?: ServiceReference;
  location?: LocationReference;
  
  // Source tracking
  source: 'website' | 'google' | 'instagram' | 'other';
  sourceUrl?: string;              // Link to original review
  
  // Display
  featured: boolean;               // Show prominently
  displayOrder?: number;
  
  // Metadata
  publishedAt: string;
}
```

**IMPORTANT:** Testimonial ≠ Review Schema
- Testimonials are customer endorsements
- Google Reviews use Review schema (separate implementation)
- Celebrity testimonials are content assets, not Review schema candidates

---

### 2.7 Blog (Post)

**Purpose:** Educational content hub using native WordPress

```typescript
interface BlogPost {
  // WordPress native fields
  id: string;
  title: string;
  slug: string;
  content: string;                // Full HTML content
  excerpt?: string;
  
  // Dates
  date: string;                   // Published date
  modified: string;               // Last modified
  
  // Taxonomy (WordPress native)
  categories: CategoryReference[];
  tags?: TagReference[];
  
  // Semantic relationships (custom fields)
  relationships: {
    topic?: string;              // Semantic subject (not category)
    service?: ServiceReference;   // Primary related service
    location?: LocationReference; // Primary related location
  };
  
  // Media
  featuredImage?: Media;
  
  // SEO (preserve from Rank Math)
  seo: SEOMetadata;
}
```

**Note:** Blog uses native WordPress post type, NOT custom CPT

---

## 3. MEDIA MODEL

```typescript
interface Media {
  id: string;
  title?: string;
  alt: string;                    // Required for accessibility
  caption?: string;
  
  // URLs
  url: string;                   // Original/full size
  thumbnailUrl?: string;          // For listings
  mediumUrl?: string;             // For galleries
  
  // Dimensions
  width?: number;
  height?: number;
  
  // For next/image
  blurDataUrl?: string;           // For placeholder
  blurHash?: string;
  
  // Metadata
  source?: string;                // "AutoSPA" or "Customer"
  credit?: string;
}
```

---

## 4. SEO MODEL

```typescript
interface SEOMetadata {
  title: string;                  // Meta title (max 60 chars)
  description: string;             // Meta description (max 160 chars)
  
  focusKeyword?: string;           // Primary keyword
  focusKeywords?: string[];       // Additional keywords
  
  canonicalUrl: string;          // Final URL
  
  // Robots
  robots: {
    index: boolean;               // default: true
    follow: boolean;              // default: true
  };
  
  // OG
  ogImage?: Media;
  
  // Schema (internal - not exposed in CMS)
  schemaType?: string;            // For reference
}
```

---

## 5. RELATIONSHIP SUMMARY

| From | To | Type | Notes |
|------|-----|------|-------|
| Organization | Location | 1:N | All physical locations |
| Location | Service | M:N | Not all locations have all services |
| Service | Location | M:N | Service availability varies |
| Service | Package | 1:N | Embedded in Service |
| Service | Project | 1:N | Proof of work |
| Service | FAQ | 1:N | Service-specific questions |
| Service | Testimonial | 1:N | Service reviews |
| Location | Project | 1:N | Projects done at location |
| Location | FAQ | 1:N | Location-specific questions |
| Location | Testimonial | 1:N | Location reviews |
| Blog | Service | N:1 | Optional relationship |
| Blog | Location | N:1 | Optional relationship |
| Blog | Topic | N:1 | Semantic classification |
| Blog | Category | N:M | WordPress native |

---

## 6. FIELD EXPOSURE MATRIX

### 6.1 CMS vs Public API

| Field | CMS | Public API | Notes |
|-------|-----|------------|-------|
| title | ✅ | ✅ | |
| slug | ✅ | ✅ | |
| description | ✅ | ✅ | |
| seo.title | ✅ | ✅ | |
| seo.metaDescription | ✅ | ✅ | |
| location.address | ✅ | ✅ | For LocalBusiness schema |
| location.phone | ✅ | ✅ | |
| location.whatsapp | ✅ | ✅ | |
| testimonial.name | ✅ | ✅ | |
| testimonial.quote | ✅ | ✅ | |
| internal.migrationStatus | ✅ | ❌ | CMS-only |
| internal.notes | ✅ | ❌ | CMS-only |
| internal.lastReviewedBy | ✅ | ❌ | CMS-only |

**Rule:** Fields prefixed with `internal.` are WordPress-only, never exposed to GraphQL public API.

---

## 7. CONTENT MODEL CONSTRAINTS

### 7.1 URL Preservation

- All existing URLs from Phase 1A are CONSTRAINTS
- New entity slugs must respect Phase 1A URL Mapping
- URL changes require migration mapping (301 redirects)

### 7.2 Service Area as Data

- Service areas are stored as `Location.serviceAreas[]`
- NOT a separate CPT or page
- Used for GEO schema (areaServed) and internal routing

### 7.3 Package as Embedded Data

- Packages are `Service.packages[]`
- NOT a separate CPT (unless proven necessary later)
- Pricing by vehicle size in structured format

### 7.4 Blog = WordPress Native

- Use `post` post type, NOT custom CPT
- Categories and tags as-is
- Add semantic `relationships.service` and `relationships.location` fields

---

## 8. MINIMUM VIABLE CONTENT

### Per Entity

**Service:**
- title, slug
- excerpt
- description (100+ words)
- heroImage
- 1+ package with pricing
- 3+ benefits
- 4+ process steps
- 1+ FAQ

**Location:**
- name, slug
- complete address
- phone
- WhatsApp
- opening hours
- Google Maps embed
- description (100+ words)
- 3+ services available
- 1+ photo

**Project:**
- title
- vehicle (brand + model)
- service relationship
- before image
- after image

**FAQ:**
- question
- answer
- context (global/service/location)

---

## 9. PHASE 2B DEFINITION OF DONE ✓

| Item | Status |
|------|--------|
| Organization model | ✅ Locked |
| Location model | ✅ Locked |
| Service model | ✅ Locked |
| Project model | ✅ Locked |
| FAQ model | ✅ Locked |
| Testimonial model | ✅ Locked |
| Blog model | ✅ Locked |
| Taxonomy | 🔄 See taxonomy document |
| Relationships | 🔄 See relationship document |
| ACF field names | ⏳ Phase 2C |
| GraphQL exposure | ⏳ Phase 2C |

---

**Document Status:** FINAL - Content Model Locked
**Last Updated:** 2026-08-18
**Next:** Phase 2C - ACF + WPGraphQL Specification
