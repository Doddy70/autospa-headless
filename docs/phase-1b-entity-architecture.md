# PHASE 1B: ENTITY ARCHITECTURE (REVISED)
## AutoSP AJakarta Headless WordPress Migration

**Project:** Headless WordPress → Next.js for SEO/GEO Rebuild
**Date:** 2026-08-18
**Revised:** 2026-08-18
**Prepared by:** Claude
**Status:** ✅ Approved (with corrections applied)

---

## 🔄 REVISION NOTES

Based on user feedback, the following changes were made:

1. ✅ **Blog routing fixed** — `/blog/category/[slug]/` vs `/blog/[slug]/`
2. ✅ **Service redirects explicit** — No generic `/service/:slug`
3. ✅ **Fragment removed** — Redirects go to clean canonical URLs
4. ✅ **Schema separation** — Organization (global) vs LocalBusiness (per location)
5. ✅ **Location verification needed** — Physical vs service area distinction
6. ✅ **GBP not a blocker** — CMS stores Place ID, API integration optional
7. ✅ **Schema determined by application** — Not by editor field

---

## 🎯 ENTITY ARCHITECTURE OVERVIEW

```
                          ┌─────────────────────────────────────────────────────────┐
                          │                         AUTOSPA                          │
                          │                       (Organization)                      │
                          │                   [WebSite Schema]                      │
                          └─────────────────────────────────────────────────────────┘
                                            │
                    ┌───────────────────────┼───────────────────────┐
                    │                       │                       │
                    ▼                       ▼                       ▼
          ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
          │    SERVICES     │    │   LOCATIONS     │    │     CONTENT     │
          │  [Service Schema]│   │  [Physical Only] │   │                 │
          └─────────────────┘    └─────────────────┘    └─────────────────┘
                    │                       │                       │
          ┌─────────┼─────────┐     ┌───────┴────────┐          ┌────────┴────────┐
          │         │         │     │                │          │                 │
          ▼         ▼         ▼     ▼                ▼          ▼                 ▼
     ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐  ┌────────┐ ┌────────┐      ┌────────┐
     │Detailing│ │Coating │ │  PPF   │ │ Pluit  │  │Service │ │ Blog   │      │FAQ     │
     └────────┘ └────────┘ └────────┘ └────────┘  │ Areas  │ └────────┘      └────────┘
                                                    └────────┘
          ┌─────────────────────────────────────────────────────────────────────────────┐
          │                        CONTENT RELATIONSHIPS                                │
          │                                                                             │
          │  Service ◄──────────► Blog Posts (content hub)                            │
          │     │                         │                                            │
          │     │                         │                                            │
          │     ▼                         ▼                                            │
          │  FAQ ◄──────────────────► Testimonials                                    │
          │     │                         │                                            │
          │     │                         │                                            │
          │     ▼                         ▼                                            │
          │  Projects ◄──────────────── Locations ◄──────────► Team                     │
          │                                                                             │
          └─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. AUTOSPA ROOT ENTITY

### Schema: Organization + WebSite (GLOBAL - No LocalBusiness)

```typescript
// Entity: AUTOSPA (Global)
const autospaGlobal = {
  name: "AutoSP AJakarta",
  type: "Organization",
  alternateName: "AutoSPA",
  description: "Premium automotive detailing dan coating service di Jakarta dan sekitarnya",
  
  // Brand identifiers
  brand: {
    name: "AutoSP AJakarta",
    logo: "/images/logo.png",
    slogan: "Premium Car Care Solution"
  },
  
  // Website schema
  url: "https://autospajakarta.com",
  
  // Social profiles
  sameAs: [
    "https://www.instagram.com/autospajakarta",
    "https://www.facebook.com/autospajakarta",
    "https://www.youtube.com/autospajakarta",
    "https://www.tiktok.com/@autospajakarta"
  ]
};
```

**Note:** LocalBusiness schema akan diterapkan per-LOCATION, bukan di root entity.

---

## 2. SERVICES ENTITY

### 2.1 Service Taxonomy

```
SERVICES
├── Detailing Services
│   └── Premium Full Detailing
│       ├── Interior Detailing
│       ├── Exterior Detailing
│       └── Engine Bay Detailing
│
├── Coating Services
│   └── Nano Ceramic Coating
│       ├── 9H Ceramic Coating
│       └── Graphene Coating
│
├── Paint Protection Film (PPF)
│   ├── PPF 360° Package
│   ├── PPF Full Body
│   └── PPF Daily Package
│
├── Premium Wash
│   └── Premium Wash + Undercarriage
│
└── Rust Protection
    └── Anti-Rust Coating
```

### 2.2 Service Detail Mapping

| Old Portfolio Slug | New Service | Redirect Type |
|--------------------|------------|---------------|
| premium-full-detailing | /services/detailing/ | **EXPLICIT 301** |
| premium-nano-ceramic-coating | /services/nano-ceramic-coating/ | **EXPLICIT 301** |
| premium-360-ppf-package | /services/ppf-360/ | **EXPLICIT 301** |
| premium-ppf-package | /services/ppf/ | **EXPLICIT 301** |
| daily-ppf-package | /services/ppf-daily/ | **EXPLICIT 301** |
| premium-wash | /services/premium-wash/ | **EXPLICIT 301** |
| light-package | /services/detailing/ | **MERGE 301** |
| bronze-packages | /services/detailing/ | **MERGE 301** |
| silver-package | /services/detailing/ | **MERGE 301** |
| gold-package | /services/detailing/ | **MERGE 301** |
| diamond-package | /services/detailing/ | **MERGE 301** |
| platinum-package | /services/detailing/ | **MERGE 301** |

**Note:** NO generic `/service/:slug` redirect. Semua explicit.

### 2.3 Service Schema Structure

```typescript
// WordPress CPT: service
// Schema type determined by Next.js application, NOT editor

interface Service {
  id: string;
  slug: string;
  
  // Basic Info
  name: string;
  tagline: string;
  description: string;
  shortDescription: string;
  
  // Content Blocks (Search → Education → Trust → Proof → CTA)
  sections: {
    whatIsIt: string;
    benefits: Benefit[];
    comparison: Comparison[];
    products: string[];
    process: ProcessStep[];
    beforeAfter: ImagePair[];
    testimonials: Testimonial[];
    faq: FAQ[];
    pricing: PricingTier[];
  };
  
  // Relationships (ACF)
  relatedServices: Service[];
  relatedBlogPosts: BlogPost[];
  relatedProjects: Project[];
  
  // SEO (Rank Math fields)
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  
  // CMS Fields (NOT schema field)
  contentType: "service"; // Fixed value
}
```

---

## 3. LOCATIONS ENTITY

### 3.1 IMPORTANT: Physical vs Service Area Distinction

```
LOCATIONS
│
├── PHYSICAL LOCATIONS (LocalBusiness Schema)
│   ├── Pluit (Flagship)
│   ├── [VERIFY: Depok]
│   ├── [VERIFY: Bekasi]
│   ├── [VERIFY: Tangerang]
│   └── [VERIFY: PIK 2]
│
└── SERVICE AREAS (areaServed - NO LocalBusiness page)
    ├── Jakarta Utara
    ├── Jakarta Barat
    ├── Jakarta Selatan
    ├── Jakarta Timur
    ├── Jakarta Pusat
    ├── Depok
    ├── Bekasi
    ├── Tangerang
    └── Bogor
```

### 3.2 Location Decision Required

⚠️ **VERIFICATION NEEDED:**

| Location | Physical Branch? | Create LocalBusiness Page? |
|----------|-----------------|---------------------------|
| Pluit | ✅ Yes | ✅ YES |
| Jakarta | ❓ HQ? | ⚠️ Only if physical |
| Depok | ❓ | ⚠️ Verify first |
| Bekasi | ❓ | ⚠️ Verify first |
| Tangerang | ❓ | ⚠️ Verify first |
| PIK 2 | ❓ | ⚠️ Verify first |
| Bogor | ❌ Probably not | ❌ NO - Service area only |

### 3.3 If Physical Location Exists

```typescript
// Entity: Physical Location
interface Location {
  id: string;
  slug: string;
  
  // Basic Info
  name: string;
  type: "flagship" | "regular";
  isPhysicalBranch: true; // Required for LocalBusiness schema
  
  // Address
  address: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: "ID";
  };
  
  // Geo
  coordinates: {
    latitude: number;
    longitude: number;
  };
  
  // Contact
  phone: string;
  whatsapp: string;
  email: string;
  
  // Operating Hours
  openingHours: OpeningHours[];
  
  // Services Available at this location
  services: Service[];
  
  // GBP Data (stored, not synced)
  googlePlaceId: string;
  googleMapsUrl: string;
  googleBusinessProfileUrl: string;
  
  // Schema: LocalBusiness (per location)
  schema: "LocalBusiness";
}
```

### 3.4 If Service Area Only (NO LocalBusiness)

```typescript
// Entity: Service Area (NO dedicated page)
interface ServiceArea {
  name: string; // "Jakarta Utara", "Depok", dll
  
  // For use in:
  // - areaServed in LocalBusiness schema
  // - Internal linking context
  // - Content mentions
  
  // NO separate page at /locations/[area]/
}
```

### 3.5 Location URLs

| Location | URL | Schema | Status |
|----------|-----|--------|--------|
| All Locations | /locations/ | Collection page | ✅ |
| Pluit | /locations/pluit/ | LocalBusiness | ✅ |
| Jakarta | /locations/jakarta/ | LocalBusiness | ⚠️ Verify |
| [Other] | /locations/[slug]/ | LocalBusiness | ⚠️ Verify |

---

## 4. BLOG ENTITY (Content Hub)

### 4.1 Routing Fix: Category vs Post Conflict

**Problem:**
```
/blog/[category]/
/blog/[slug]/
```
Cannot coexist - same dynamic segment.

**Solution:**
```
/blog/
  ├── category/
  │   ├── [category-slug]/
  │   │   └── page.tsx
  │   └── [post-slug]/
  │       └── page.tsx
  └── [post-slug]/
      └── page.tsx
```

**Final URL Structure:**
```
/blog/                               → Blog archive
/blog/category/detailing/            → Category archive
/blog/category/ceramic-coating/      → Category archive
/blog/category/ppf/                  → Category archive
/blog/[post-slug]/                   → Individual post
```

### 4.2 Category Mapping

| Old Category | New Slug | URL | Status |
|-------------|----------|-----|--------|
| Tips & Insight | tips-insight | /blog/category/tips-insight/ | ✅ KEEP |
| Auto Detailing | detailing | /blog/category/detailing/ | ✅ KEEP |
| Coating Mobil | ceramic-coating | /blog/category/ceramic-coating/ | ✅ KEEP |
| Paint Protection Film | ppf | /blog/category/ppf/ | ✅ KEEP |
| Rust Protection | rust-protection | /blog/category/rust-protection/ | ✅ KEEP |
| Engine Detailing | engine-detailing | /blog/category/engine-detailing/ | ✅ KEEP |
| Interior Detailing | interior-detailing | /blog/category/interior-detailing/ | ✅ KEEP |
| Eksterior Detailing | eksterior-detailing | /blog/category/eksterior-detailing/ | ✅ KEEP |
| Glass Cleaning | glass-cleaning | /blog/category/glass-cleaning/ | ✅ KEEP |
| Car Wash | car-wash | /blog/category/car-wash/ | ✅ KEEP |
| AutoSP Pluit | - | Embed in /locations/pluit/ | 🔄 REDESIGN |
| Mudik Lebaran | mudik-lebaran | /blog/category/mudik-lebaran/ | ⚠️ AUDIT |
| Experience | experience | /blog/category/experience/ | ⚠️ AUDIT |
| Nano Ceramic Coating | ceramic-coating | /blog/category/ceramic-coating/ | ✅ MERGE |
| Bengkel Detailing | detailing | /blog/category/detailing/ | ✅ MERGE |
| Salon Mobil Jakarta | jakarta | /blog/category/jakarta/ | ⚠️ MERGE/DELETE |
| Uncategorized | - | **NOINDEX** | ❌ DELETE |

### 4.3 Category Archive Thinning Rule

⚠️ **IMPORTANT:**

> Category archive page only created if:
> 1. Minimum 5 published posts in category
> 2. Clear search intent for that category
> 3. Content is NOT seasonal (e.g., Mudik Lebaran = seasonal)

| Category | Post Count | Create Archive? |
|----------|-----------|-----------------|
| Tips & Insight | 37 | ✅ YES |
| AutoSP Pluit | 25 | 🔄 Embed in location |
| Bengkel Detailing | 23 | ✅ MERGE → detailing |
| Salon Mobil Jakarta | 19 | ❌ DELETE |
| Coating Mobil | 18 | ✅ YES |
| Paint Protection Film | 16 | ✅ YES |
| Rust Protection | 15 | ✅ YES |
| Auto Detailing | 9 | ✅ YES |
| Engine Detailing | 9 | ✅ YES |
| Mudik Lebaran | 9 | ⚠️ Seasonal - AUDIT |
| Uncategorized | 7 | ❌ NOINDEX |
| Nano Ceramic Coating | 4 | ✅ MERGE |
| Eksterior Detailing | 3 | ✅ MERGE |
| Experience | 3 | ⚠️ AUDIT |
| Interior Detailing | 2 | ✅ MERGE |
| Glass Cleaning | 2 | ✅ MERGE |
| Car Wash | 2 | ✅ MERGE |

---

## 5. PROJECTS ENTITY

### 5.1 Project Schema (APPROVED)

```typescript
// Entity: Project
interface Project {
  id: string;
  slug: string;
  
  // Vehicle
  vehicle: {
    brand: string;
    model: string;
    year: string;
  };
  
  // Service
  service: Service;
  package: string;
  
  // Location
  location: Location;
  
  // Content
  problem: string;
  solution: string;
  process: string;
  
  // Media
  beforeImages: Image[];
  afterImages: Image[];
  videoUrl?: string;
  
  // Metadata
  completedDate: Date;
  duration: string;
  
  // SEO
  metaTitle: string;
  metaDescription: string;
}
```

### 5.2 Project URLs

| URL | Description |
|-----|-------------|
| /projects/ | Project gallery (filterable) |
| /projects/[slug]/ | Single project detail |

---

## 6. FAQ ENTITY

### 6.1 FAQ Structure

```typescript
// Entity: FAQ
interface FAQ {
  id: string;
  question: string;
  answer: string;
  
  // Relationships
  services: Service[];
  categories: Category[];
  
  // SEO
  targetKeyword: string;
}
```

### 6.2 FAQ Usage

> FAQ primarily for:
> - User experience
> - Semantic coverage
> - GEO relevance
> - Long-tail query targeting
>
> NOT primarily for FAQ rich results.

---

## 7. TESTIMONIALS ENTITY

### 7.1 Testimonial Schema

```typescript
// Entity: Testimonial
interface Testimonial {
  id: string;
  
  // Customer
  customerName: string;
  customerAvatar?: string;
  vehicle?: string;
  
  // Content
  content: string;
  
  // Source (determines if schema is used)
  source: "google" | "internal" | "social";
  
  // Only Google reviews get schema
  googleReviewUrl?: string;
  
  // Relationships
  services: Service[];
  locations: Location[];
  
  // Status
  verified: boolean;
  publishedDate: Date;
}
```

### 7.2 Testimonial Display Rules

| Source | Show Rating | Schema? | Notes |
|--------|-------------|---------|-------|
| Google Reviews | ✅ Real rating | ✅ YES | Pull from GBP |
| Internal (collected) | ❌ No | ❌ NO | Don't fake ratings |
| Social media | Contextual | ❌ NO | No fake schemas |

---

## 8. TEAM ENTITY

```typescript
// Entity: TeamMember
interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  bio?: string;
  expertise: string[];
  
  // Location
  primaryLocation: Location;
  
  // Social
  linkedin?: string;
  instagram?: string;
}
```

---

## 9. RELATIONSHIP MATRIX

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          INTERNAL LINKING STRATEGY                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  BLOG POST                                                                      │
│     │                                                                          │
│     ├── links to → SERVICE (sidebar, inline)                                     │
│     ├── links to → LOCATION (sidebar, inline)                                  │
│     ├── links to → RELATED POSTS (end of article)                               │
│     └── links to → BOOKING CTA                                                  │
│                                                                                 │
│  SERVICE PAGE                                                                   │
│     │                                                                          │
│     ├── links to → BLOG POSTS (content hub)                                     │
│     ├── links to → PROJECTS (before/after)                                      │
│     ├── links to → FAQ                                                         │
│     ├── links to → LOCATIONS (where available)                                  │
│     └── links to → BOOKING CTA                                                  │
│                                                                                 │
│  LOCATION PAGE                                                                  │
│     │                                                                          │
│     ├── links to → SERVICES (available here)                                    │
│     ├── links to → BLOG POSTS (embedded)                                        │
│     ├── links to → GOOGLE MAPS                                                 │
│     └── links to → BOOKING                                                      │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. PAGE ARCHITECTURE (FINAL URL STRUCTURE)

### 10.1 Final URLs

```
/
│
├── services/
│   ├── page.tsx                           (Services archive)
│   ├── nano-ceramic-coating/
│   ├── ppf/
│   │   ├── page.tsx                       (PPF overview)
│   │   ├── ppf-360/
│   │   └── ppf-daily/
│   ├── detailing/
│   ├── premium-wash/
│   └── rust-protection/
│
├── locations/
│   ├── page.tsx                           (Locations archive)
│   ├── pluit/
│   └── [slug]/                            (If physical location exists)
│
├── projects/
│   ├── page.tsx                           (Projects archive)
│   └── [slug]/                            (Project detail)
│
├── blog/
│   ├── page.tsx                           (Blog archive)
│   ├── category/
│   │   ├── [category-slug]/
│   │   │   └── page.tsx                   (Category archive)
│   │   └── [post-slug]/
│   │       └── page.tsx                   (Post in category context)
│   └── [post-slug]/
│       └── page.tsx                       (Individual post)
│
├── about/
│   └── page.tsx
│
├── faq/
│   └── page.tsx
│
├── booking/
│   └── page.tsx
│
└── [legal]/
    ├── terms-conditions/
    └── privacy-policy/
```

### 10.2 Redirect Summary

```typescript
// next.config.ts - ALL EXPLICIT REDIRECTS

const redirects = [
  // ====================
  // PAGES
  // ====================
  { source: '/our-services', destination: '/services', permanent: true },
  { source: '/news-insight', destination: '/blog', permanent: true },
  { source: '/blog-standard', destination: '/blog', permanent: true },
  { source: '/reservasi', destination: '/booking', permanent: true },
  { source: '/team', destination: '/about', permanent: true },
  { source: '/pricing', destination: '/services', permanent: true },
  
  // Service pages (root level)
  { source: '/premium-nano-ceramic-coating', destination: '/services/nano-ceramic-coating', permanent: true },
  { source: '/premium-detailing', destination: '/services/detailing', permanent: true },
  { source: '/premium-wash', destination: '/services/premium-wash', permanent: true },
  { source: '/360-paint-protection-film-package', destination: '/services/ppf-360', permanent: true },
  { source: '/nano-ceramic-coating', destination: '/services/nano-ceramic-coating', permanent: true },
  { source: '/premium-coating-lp', destination: '/', permanent: true },
  
  // ====================
  // SERVICE PACKAGES (MERGED)
  // ====================
  { source: '/service/light-package', destination: '/services/detailing', permanent: true },
  { source: '/service/bronze-packages', destination: '/services/detailing', permanent: true },
  { source: '/service/silver-package', destination: '/services/detailing', permanent: true },
  { source: '/service/gold-package', destination: '/services/detailing', permanent: true },
  { source: '/service/diamond-package', destination: '/services/detailing', permanent: true },
  { source: '/service/platinum-package', destination: '/services/detailing', permanent: true },
  
  // ====================
  // SERVICE KEEP (EXPLICIT)
  // ====================
  { source: '/service/premium-wash', destination: '/services/premium-wash', permanent: true },
  { source: '/service/premium-full-detailing', destination: '/services/detailing', permanent: true },
  { source: '/service/premium-nano-ceramic-coating', destination: '/services/nano-ceramic-coating', permanent: true },
  { source: '/service/premium-360-ppf-package', destination: '/services/ppf-360', permanent: true },
  { source: '/service/premium-ppf-package', destination: '/services/ppf', permanent: true },
  { source: '/service/daily-ppf-package', destination: '/services/ppf-daily', permanent: true },
  
  // ====================
  // BLOG CATEGORIES
  // ====================
  { source: '/category/tips-and-insight', destination: '/blog/category/tips-insight', permanent: true },
  { source: '/category/auto-detailing', destination: '/blog/category/detailing', permanent: true },
  { source: '/category/coating-mobil', destination: '/blog/category/ceramic-coating', permanent: true },
  { source: '/category/paint-protection-film', destination: '/blog/category/ppf', permanent: true },
  { source: '/category/rust-protection', destination: '/blog/category/rust-protection', permanent: true },
  { source: '/category/engine-detailing', destination: '/blog/category/engine-detailing', permanent: true },
  { source: '/category/interior-detailing', destination: '/blog/category/interior-detailing', permanent: true },
  { source: '/category/eksterior-detailing', destination: '/blog/category/eksterior-detailing', permanent: true },
  { source: '/category/glass-cleanning', destination: '/blog/category/glass-cleaning', permanent: true },
  { source: '/category/car-wash', destination: '/blog/category/car-wash', permanent: true },
  
  // Categories to MERGE (redirect to main category)
  { source: '/category/nano-ceramic-coating', destination: '/blog/category/ceramic-coating', permanent: true },
  { source: '/category/bengkel-detailing', destination: '/blog/category/detailing', permanent: true },
  
  // Categories to DELETE (noindex, no redirect needed for crawlers)
  { source: '/category/salon-mobil-jakarta', destination: '/blog', permanent: true },
  { source: '/category/uncategorized', destination: '/blog', permanent: true },
  { source: '/category/autospa-pluit', destination: '/locations/pluit', permanent: true },
  
  // ====================
  // BLOG POSTS (KEEP ORIGINAL SLUGS)
  // ====================
  // All 170+ posts keep their URLs - NO CHANGES
];
```

---

## 11. NEXT.JS FOLDER STRUCTURE

```typescript
// Final project structure
src/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   │
│   ├── services/
│   │   ├── page.tsx
│   │   ├── nano-ceramic-coating/
│   │   │   └── page.tsx
│   │   ├── ppf/
│   │   │   ├── page.tsx
│   │   │   ├── ppf-360/
│   │   │   │   └── page.tsx
│   │   │   └── ppf-daily/
│   │   │       └── page.tsx
│   │   ├── detailing/
│   │   │   └── page.tsx
│   │   ├── premium-wash/
│   │   │   └── page.tsx
│   │   └── rust-protection/
│   │       └── page.tsx
│   │
│   ├── locations/
│   │   ├── page.tsx
│   │   ├── pluit/
│   │   │   └── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   ├── projects/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   ├── blog/
│   │   ├── page.tsx
│   │   ├── category/
│   │   │   ├── page.tsx
│   │   │   └── [category-slug]/
│   │   │       └── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   ├── about/
│   │   └── page.tsx
│   │
│   ├── faq/
│   │   └── page.tsx
│   │
│   ├── booking/
│   │   └── page.tsx
│   │
│   └── [...slug]/
│       └── page.tsx
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   │
│   ├── ui/
│   │   ├── ServiceCard.tsx
│   │   ├── LocationCard.tsx
│   │   ├── BlogCard.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── TestimonialCard.tsx
│   │   └── CTABanner.tsx
│   │
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── ServiceOverview.tsx
│   │   ├── BeforeAfter.tsx
│   │   ├── FAQSection.tsx
│   │   └── BookingCTA.tsx
│   │
│   └── seo/
│       ├── JsonLd.tsx
│       └── Breadcrumbs.tsx
│
└── lib/
    └── wordpress/
        ├── client.ts
        ├── queries/
        │   ├── services.ts
        │   ├── locations.ts
        │   ├── projects.ts
        │   ├── posts.ts
        │   └── testimonials.ts
        └── types/
            └── index.ts
```

---

## 12. VERIFICATION CHECKLIST

### Physical Locations Required

⚠️ **ACTION REQUIRED:**

Before Phase 2, verify actual AutoSPA locations:

| Location | Is Physical Branch? | Create /locations/[slug]/ | LocalBusiness Schema? |
|----------|---------------------|---------------------------|----------------------|
| Pluit | [ ] | [ ] | [ ] |
| Jakarta | [ ] | [ ] | [ ] |
| Depok | [ ] | [ ] | [ ] |
| Bekasi | [ ] | [ ] | [ ] |
| Tangerang | [ ] | [ ] | [ ] |
| PIK 2 | [ ] | [ ] | [ ] |

---

## 13. PHASE 2 PREVIEW

### 2A — WordPress Content Model (CPT)

```
├── Service (CPT)
├── Location (CPT) - Physical branches only
├── Project (CPT) - Portfolio
├── FAQ (CPT)
├── Testimonial (CPT)
└── Team (CPT)
```

### 2B — ACF Fields

Per CPT sesuai entity model di atas.

### 2C — Relationships

ACF Relationship fields untuk linking entities.

### 2D — WPGraphQL Exposure

Register CPTs dengan WPGraphQL, expose custom fields.

### 2E — SEO/Rank Math Mapping

Map Rank Math fields ke entity SEO requirements.

### 2F — Content Migration Rules

Implement URL mapping, redirect rules.

---

## Document Status

- [x] Phase 1A URL Mapping - ✅ APPROVED (corrections applied)
- [x] Phase 1B Entity Architecture - ✅ APPROVED CONCEPTUALLY (corrections applied)
- [ ] Physical Location Verification - ⏳ PENDING
- [ ] Phase 2: WordPress Content Model - ⏳ NEXT

---

**Next Action:** Phase 2A — WordPress Content Model Setup
