# PHASE 1C: AUTOSPA FRONTEND ARCHITECTURE & DESIGN SYSTEM
## AutoSP AJakarta - Headless WordPress Project

**Project:** AutoSP AJakarta Headless WordPress
**Architecture:** Headless WordPress + Next.js
**Primary Objective:** SEO + GEO + Conversion + Performance
**Date:** 2026-08-18
**Status:** APPROVED - Architecture Contract

---

## DOCUMENT PURPOSE

Dokumen ini adalah **kontrak arsitektur** antara:
- SEO Specialist
- Content Team
- WordPress Developer
- Frontend Developer
- Designer

Semua keputusan teknis dan visual harus merujuk ke dokumen ini.

---

## GLOBAL PRINCIPLES

### Design Philosophy
```
Less decoration, more evidence.

Foto mobil + hasil pekerjaan + craftsmanship = hero visual.
```

### Architecture Philosophy
```
WordPress → Headless CMS (content storage)
Next.js → SEO Engine + Rendering + Performance
WPGraphQL → Data API
```

### Content Philosophy
```
SEO bukan tentang keyword stuffing.
SEO tentang entity, evidence, dan relationships.
```

---

## 1. VISUAL DIRECTION

### 1.1 Brand Positioning

**Target Perception:** Premium Automotive Care yang Professional, Trusted & Accessible

| Character | Terlihat | Bukan |
|-----------|----------|--------|
| **PROFESSIONAL** | competent, precise, clean, modern, technical | sloppy, amateur |
| **PREMIUM** | sophisticated, detail-oriented, high quality | cheap, generic |
| **TRUSTED** | transparent, factual, genuine, human, evidence-based | fake, inflated claims |

### 1.2 Design Principles

**DO:**
- High-quality photography (real cars, real results)
- Clean whitespace
- Evidence-based visuals (before/after, process)
- Professional typography
- Clear information hierarchy

**DON'T:**
- Excessive gradients
- Floating abstract shapes
- Glassmorphism for no reason
- Abstract blobs
- Excessive animation
- Decorative elements that don't support content

### 1.3 Photography Priority

```
1. REAL CUSTOMER CARS
2. BEFORE / AFTER RESULTS
3. TECHNICIAN CRAFTSMANSHIP
4. PROCESS
5. FACILITY
6. DETAIL SHOTS
```

**Content Flow:**
```
CAR
  ↓
PROBLEM
  ↓
PROCESS
  ↓
RESULT
```

**Example:**
BMW X5 → paint correction → ceramic coating → finished result

### 1.4 Color System (Semantic Tokens)

```css
/* Semantic Tokens - Wajib gunakan ini, bukan hex langsung */
:root {
  /* Surfaces */
  --background: ;
  --foreground: ;
  --surface: ;
  --surface-elevated: ;

  /* Primary (Brand) */
  --primary: ;
  --primary-foreground: ;

  /* Secondary */
  --secondary: ;
  --secondary-foreground: ;

  /* Muted */
  --muted: ;
  --muted-foreground: ;

  /* Accent */
  --accent: ;
  --accent-foreground: ;

  /* Borders */
  --border: ;
  --input: ;
  --ring: ;

  /* Semantic */
  --destructive: ;
  --success: ;
  --warning: ;
}
```

**Catatan:** Nilai hex akan ditentukan setelah brand identity AutoSPA diverifikasi.

### 1.5 Design System Source

#### Reference Hierarchy

```
                    AUTOSPA
                       │
             ┌─────────┴─────────┐
             │                   │
        UX REFERENCE         BRAND/CONTENT
             │                   │
     Claude Directory       AutoSPA identity
             │                   │
             └─────────┬─────────┘
                       ▼
              AUTOSPA DESIGN SYSTEM
                       │
                       ▼
                 NEXT.JS UI
```

#### Primary UI/UX Reference

**Claude Directory** — Pulkitxm
- Repository: https://github.com/pulkitxm/claude-directory
- Demo: https://www.pulkit.page/claude-directory

#### Secondary Reference

**Exsit** — ThemeForest
- Location: `archived/exsit-template/`
- Usage: Component patterns, animation examples

#### Implementation Approach

```
WordPress/CMS → Fully separate from visual decisions
Next.js UI → Based on AutoSPA Design System
```

### 1.6 Typography Hierarchy

```
Display
  ↓
H1
  ↓
H2
  ↓
H3
  ↓
Body
  ↓
Caption
```

**Character Guidelines:**

| Element | Character | Example |
|---------|-----------|---------|
| Headline | confident + premium | "Perawatan Premium untuk Mobil yang Anda Percayakan kepada Kami" |
| Body | highly readable + conversational | Plain language, not startup-speak |

**DON'T:**
```
❌ "Revolutionizing Your Automotive Experience"
❌ "Next-Level Car Care Solutions"
❌ "Unlock Your Vehicle's True Potential"
```

### 1.6 Image Treatment

All images must use Next.js Image component with:
- Proper dimensions
- Modern formats (WebP/AVIF)
- Responsive sizes
- Lazy loading (except hero/LCP)

---

## 2. COMPONENT ARCHITECTURE

### 2.1 Component Categories

```
COMPONENTS
│
├── layout/          → Structural
├── ui/             → Primitive
├── automotive/     → Domain-specific
├── content/        → Content display
├── trust/          → Trust signals
└── seo/            → SEO/Tech
```

### 2.2 Layout Components

| Component | Purpose | File |
|-----------|---------|------|
| AppShell | Root layout wrapper | `layout/AppShell.tsx` |
| Header | Site header | `layout/Header.tsx` |
| DesktopNav | Desktop navigation | `layout/DesktopNav.tsx` |
| MobileNav | Mobile navigation | `layout/MobileNav.tsx` |
| Footer | Site footer | `layout/Footer.tsx` |
| Container | Content container | `layout/Container.tsx` |
| Section | Page section wrapper | `layout/Section.tsx` |
| Breadcrumb | Breadcrumb navigation | `layout/Breadcrumb.tsx` |

### 2.3 Primitive UI Components

| Component | Purpose |
|-----------|---------|
| Button | Interactive action |
| Link | Navigation |
| Badge | Label/tag |
| Card | Container |
| Icon | SVG icons |
| Input | Form input |
| Textarea | Multi-line input |
| Select | Dropdown |
| Dialog | Modal |
| Accordion | Expandable content |
| Tabs | Tabbed content |
| Skeleton | Loading state |
| Separator | Divider |

### 2.4 Automotive Domain Components

**Ini yang membedakan AutoSPA dari template SaaS generic:**

| Component | Purpose |
|-----------|---------|
| ServiceCard | Service listing card |
| ServiceCategoryCard | Service category card |
| LocationCard | Location listing card |
| ProjectCard | Portfolio project card |
| VehicleBadge | Vehicle brand/model badge |
| BeforeAfter | Before/After comparison |
| ProcessStep | Service process step |
| ServiceFeature | Service benefit/feature |
| PricingCard | Pricing tier card |
| TestimonialCard | Customer testimonial |
| TeamCard | Team member card |
| Gallery | Image gallery |
| BookingCTA | Booking call-to-action |
| ServiceSummary | Service overview block |

### 2.5 Content Components

| Component | Purpose |
|-----------|---------|
| ArticleCard | Blog post card |
| ArticleHeader | Article hero section |
| ArticleContent | Article body |
| RelatedArticles | Related posts widget |
| CategoryNav | Category navigation |
| AuthorCard | Author bio |
| FAQ | Single FAQ item |
| FAQGroup | FAQ accordion group |
| RelatedServices | Related services widget |
| RelatedProjects | Related projects widget |
| RelatedLocations | Related locations widget |

### 2.6 Trust Components

**Reusable trust signal system:**

| Component | Purpose |
|-----------|---------|
| TrustBar | Horizontal trust metrics bar |
| TrustMetric | Single metric (e.g., "30+ Years") |
| ReviewSummary | Aggregate review display |
| TestimonialCarousel | Testimonial slider |
| CertificationBadge | Certification/award badge |
| TechnologyBadge | Technology/brand badge |
| CustomerProof | Customer evidence block |

**Example TrustBar:**
```
┌─────────────────────────────────────────────────────────┐
│   30+ YEARS    │   REAL PROJECTS   │   MULTI-LOCATION   │
│   EXPERIENCE   │    PROFESSIONAL    │                   │
└─────────────────────────────────────────────────────────┘
```

### 2.7 SEO Components

**IMPORTANT:** Schema components do NOT determine data themselves.

```
Data Flow:
Entity → Schema Generator → JSON-LD Component
```

| Component | Schema Type |
|-----------|-------------|
| OrganizationJsonLd | Organization |
| LocalBusinessJsonLd | LocalBusiness |
| ServiceJsonLd | Service |
| ArticleJsonLd | Article |
| FAQJsonLd | FAQPage |
| WebSiteJsonLd | WebSite |
| BreadcrumbJsonLd | BreadcrumbList |

### 2.8 Component Rules

```
RULE 1: Tidak boleh membuat component baru kalau existing bisa digunakan
RULE 2: Tidak boleh hardcode warna - gunakan semantic tokens
RULE 3: Tidak boleh hardcode spacing sembarangan
RULE 4: Page content berasal dari WordPress
RULE 5: SEO logic di lib/seo
RULE 6: Schema logic di lib/schema
RULE 7: GraphQL tidak boleh dipanggil langsung dari UI component
```

---

## 3. PAGE TEMPLATE ARCHITECTURE

### 3.1 Template Philosophy

```
Kita membangun REUSABLE PAGE TEMPLATES, bukan 14 halaman hardcoded.

Template = Structure + Data + SEO Rules
```

### 3.2 Homepage: /

```
SECTION SEQUENCE (Order matters):

1. Hero
   - Headline
   - Subheadline
   - Primary CTA
   - Background: High-quality automotive image

2. Trust Signals
   - Years of experience
   - Projects completed
   - Locations
   - Rating

3. Core Services
   - 4-6 main services
   - Each with image + name + brief description

4. Why AutoSPA
   - Differentiators
   - Evidence

5. Featured Projects
   - 3-6 before/after showcase
   - Mix of services

6. Process
   - How it works
   - Simple 4-step

7. Testimonials
   - Real customer reviews
   - From Google/local sources

8. Locations
   - Map/listing
   - Quick access

9. FAQ
   - Top 5 common questions
   - Link to full FAQ

10. Latest Insights
    - 3 recent blog posts
    - Relevant to service area

11. Booking CTA
    - Clear primary CTA
    - Secondary: WhatsApp
```

### 3.3 Services Listing: /services/

```
1. Hero (brief)
2. Service Categories
   - Category cards with counts
3. Featured Services
   - Highlight 3-4 main services
4. All Services
   - Grid of all services
5. Why AutoSPA
   - Differentiators
6. FAQ
7. CTA
```

### 3.4 Service Detail: /services/[slug]/

**CRITICAL TEMPLATE - Commercial SEO priority**

```
SECTION SEQUENCE:

1. Service Hero
   - Service name
   - Tagline
   - Primary CTA
   - Background image

2. Service Summary
   - What is this service
   - Who it's for

3. Problem / Need
   - Why customer needs this
   - Pain points addressed

4. Benefits
   - What customer gets
   - Value proposition

5. Process
   - Step-by-step procedure
   - Duration
   - What's included

6. Technology / Materials
   - Products used
   - Why these products

7. Packages / Options
   - Pricing tiers
   - Comparison

8. Before / After
   - Real examples
   - Vehicle + service context

9. Related Projects
   - Portfolio showcase
   - Filter by service

10. Testimonials
    - Reviews for this service

11. FAQ
    - Service-specific questions

12. Available Locations
    - Where to get this service

13. Related Articles
    - Educational content

14. Booking CTA
    - Primary: Book now
    - Secondary: WhatsApp
```

### 3.5 Locations Listing: /locations/

```
1. Hero (brief)
2. Locations Grid
   - Physical locations only
   - Address, hours, services
3. Service Areas
   - Non-physical areas served
   - For SEO relevance
4. CTA
```

### 3.6 Location Detail: /locations/[slug]/

**For PHYSICAL locations only**

```
1. Location Hero
   - Branch name
   - Hero image

2. Quick Info
   - Address
   - Map embed
   - Phone
   - WhatsApp
   - Hours

3. Services Available
   - What can be done here

4. Facility
   - Photos
   - Equipment

5. Projects
   - Projects done at this location

6. Reviews
   - From Google Maps

7. FAQ
   - Location-specific questions

8. Service Area
   - Areas served from here
   - For GEO

9. Booking
   - Book at this location
```

### 3.7 Projects Listing: /projects/

```
FILTERS:
- Service type
- Vehicle brand
- Vehicle type
- Location

GRID:
- Project cards with before/after preview
- Vehicle + service label
```

### 3.8 Project Detail: /projects/[slug]/

**Proof-of-work engine**

```
1. Project Hero
   - Vehicle
   - Service performed

2. Customer Need
   - What customer wanted

3. Initial Condition
   - Before images
   - Problems identified

4. Process
   - Steps taken
   - Products used

5. Before / After
   - Side-by-side comparison
   - Multiple angles

6. Final Result
   - After images
   - Customer satisfaction

7. Related Service
   - Link to service page

8. Location
   - Where this was done

9. CTA
   - Book similar service
```

### 3.9 Blog Listing: /blog/

```
1. Hero
2. Featured Post
3. Category Filter
4. Post Grid
5. Pagination
```

### 3.10 Category Archive: /blog/category/[slug]/

```
1. Category Hero
   - Category name
   - Description

2. Post Grid
   - Posts in category

3. Related Categories
4. Related Services
```

### 3.11 Article Detail: /blog/[slug]/

```
1. Article Header
   - Title
   - Category
   - Author
   - Date
   - Reading time
   - Featured image

2. Article Content
   - Educational content
   - Inline relevant links

3. Sidebar (Desktop)
   - Related Service
   - Related Location
   - Related Articles

4. Related Articles
   - 3-4 related posts

5. Author Card
6. CTA
```

### 3.12 About: /about/

```
1. About Hero
2. History / Story
3. Philosophy
4. Team
5. Facilities
6. Technology
7. CTA
```

### 3.13 FAQ: /faq/

```
CATEGORIES:
- General
- Services
- Ceramic
- PPF
- Pricing
- Booking
- Locations

FEATURES:
- Category filter
- Search
- Accordion display
```

### 3.14 Contact: /contact/

```
1. Contact Info
2. Contact Form
3. Map
```

### 3.15 Booking: /reservasi/

**Conversion-first, NOT SEO-heavy**

```
1. Booking Form
2. Service Selection
3. Location Selection
4. Date/Time
5. Contact Info
6. Confirmation
```

### 3.16 Legal Pages

```
/privacy-policy/
/cookie-policy/
/terms-conditions/

Minimalistic - no SEO optimization needed.
```

---

## 4. SEO/GEO ARCHITECTURE

### 4.1 Entity Schema Hierarchy

```
AUTOSPA (Root)
│
├── Organization (Global)
├── WebSite (Global)
└── Brand (Global)
    │
    ├── Location: Pluit
    │   └── LocalBusiness
    │       ├── PostalAddress
    │       ├── GeoCoordinates
    │       ├── OpeningHours
    │       ├── Telephone
    │       └── areaServed
    │
    ├── Location: [Other physical branches]
    │   └── LocalBusiness
    │
    ├── Service: Detailing
    │   └── Service
    │
    ├── Service: Ceramic Coating
    │   └── Service
    │
    ├── Service: PPF
    │   └── Service
    │
    ├── Service: Premium Wash
    │   └── Service
    │
    ├── Service: Rust Protection
    │   └── Service
    │
    └── Content: Articles
        └── Article
```

### 4.2 Schema Types per Entity

| Entity | Schema Type | Scope |
|--------|-------------|-------|
| AutoSPA | Organization + WebSite | Global |
| Location | LocalBusiness | Per location |
| Service | Service | Per service |
| Blog Post | Article | Per post |
| FAQ | FAQPage | Global/Page |
| Breadcrumb | BreadcrumbList | Per page |

### 4.3 Metadata Generator

**Principle:** Generate metadata programmatically from entity data.

```
Entity Data
    ↓
Metadata Generator
    ↓
┌─────────────────────────────────────┐
│ - title                            │
│ - description                       │
│ - canonical                        │
│ - og:title                         │
│ - og:description                   │
│ - og:image                         │
│ - og:type                          │
│ - twitter:card                      │
│ - robots                           │
└─────────────────────────────────────┘
```

### 4.4 Canonical Strategy

**RULES:**
```
1. Canonical = final normalized URL only
2. NEVER mix: http/https
3. NEVER mix: www/non-www
4. NEVER mix: trailing/non-trailing slash
5. ONE canonical per entity
```

**Convention:**
```
https://autospajakarta.com/services/detailing/
```

### 4.5 Internal Linking Engine

**Purpose:** Build semantic graph, not isolated pages.

```
SERVICE PAGE connects to:
├── Locations (where available)
├── Projects (proof)
├── Related Services (cross-sell)
├── Articles (education hub)
├── FAQ (common questions)
└── Booking CTA

ARTICLE connects to:
├── Category
├── Related Service (inline)
├── Related Articles
└── Booking CTA

LOCATION connects to:
├── Services (available here)
├── Projects (done here)
├── Articles (location tips)
└── Google Maps
```

---

## 5. WORDPRESS DATA LAYER

### 5.1 Architecture

```
WORDPRESS
    │
    WPGraphQL
    │
    │
    ▼
GraphQL Client
    │
    ▼
Repository Layer
    │
    ▼
Domain Types
    │
    ▼
Page Templates
```

### 5.2 Repository Pattern

**DON'T:**
```
ServicePage.tsx
    ↓
useSWR() / fetch()
    ↓
GraphQL query
```

**DO:**
```
ServicePage.tsx
    ↓
servicesRepository.getBySlug(slug)
    ↓
GraphQL query (in repository)
```

### 5.3 Repository Structure

```
lib/wordpress/
│
├── client.ts              # GraphQL client setup
│
├── queries/
│   ├── services.ts        # Service queries
│   ├── locations.ts       # Location queries
│   ├── projects.ts       # Project queries
│   ├── posts.ts          # Blog post queries
│   ├── faq.ts           # FAQ queries
│   └── testimonials.ts  # Testimonial queries
│
├── repositories/
│   ├── services.ts       # ServiceRepository
│   ├── locations.ts      # LocationRepository
│   ├── projects.ts      # ProjectRepository
│   ├── posts.ts         # PostRepository
│   └── faq.ts           # FAQRepository
│
└── types/
    ├── service.ts
    ├── location.ts
    ├── project.ts
    ├── post.ts
    └── faq.ts
```

### 5.4 Data Flow

```
WordPress Editor Update
    ↓
Publish/Update
    ↓
Webhook Trigger
    ↓
Next.js Revalidation
    ↓
ISR Regeneration
    ↓
CDN Cache Update
    ↓
User/Google/AI Crawler gets fresh content
```

---

## 6. NEXT.JS ROUTE MAP

### 6.1 Directory Structure

```
src/
│
├── app/
│   │
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Homepage
│   ├── robots.ts                  # Robots.txt
│   ├── sitemap.ts                 # Sitemap
│   │
│   ├── services/
│   │   ├── page.tsx              # Services listing
│   │   └── [slug]/
│   │       └── page.tsx          # Service detail
│   │
│   ├── locations/
│   │   ├── page.tsx              # Locations listing
│   │   └── [slug]/
│   │       └── page.tsx          # Location detail
│   │
│   ├── projects/
│   │   ├── page.tsx              # Projects listing
│   │   └── [slug]/
│   │       └── page.tsx          # Project detail
│   │
│   ├── blog/
│   │   ├── page.tsx              # Blog listing
│   │   ├── category/
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Category archive
│   │   └── [slug]/
│   │       └── page.tsx          # Article detail
│   │
│   ├── about/
│   │   └── page.tsx
│   │
│   ├── faq/
│   │   └── page.tsx
│   │
│   ├── contact/
│   │   └── page.tsx
│   │
│   ├── reservasi/
│   │   └── page.tsx
│   │
│   └── legal/
│       ├── privacy-policy/
│       │   └── page.tsx
│       ├── cookie-policy/
│       │   └── page.tsx
│       └── terms-conditions/
│           └── page.tsx
│
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Header.tsx
│   │   ├── DesktopNav.tsx
│   │   ├── MobileNav.tsx
│   │   ├── Footer.tsx
│   │   ├── Container.tsx
│   │   ├── Section.tsx
│   │   └── Breadcrumb.tsx
│   │
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Link.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Icon.tsx
│   │   ├── Input.tsx
│   │   ├── Accordion.tsx
│   │   └── ...
│   │
│   ├── automotive/
│   │   ├── ServiceCard.tsx
│   │   ├── ServiceCategoryCard.tsx
│   │   ├── LocationCard.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── BeforeAfter.tsx
│   │   ├── ProcessStep.tsx
│   │   ├── PricingCard.tsx
│   │   ├── TestimonialCard.tsx
│   │   ├── TeamCard.tsx
│   │   ├── Gallery.tsx
│   │   └── BookingCTA.tsx
│   │
│   ├── content/
│   │   ├── ArticleCard.tsx
│   │   ├── ArticleHeader.tsx
│   │   ├── ArticleContent.tsx
│   │   ├── RelatedArticles.tsx
│   │   ├── FAQGroup.tsx
│   │   └── ...
│   │
│   ├── trust/
│   │   ├── TrustBar.tsx
│   │   ├── TrustMetric.tsx
│   │   ├── ReviewSummary.tsx
│   │   ├── TestimonialCarousel.tsx
│   │   └── ...
│   │
│   └── seo/
│       ├── JsonLd.tsx
│       ├── OrganizationJsonLd.tsx
│       ├── LocalBusinessJsonLd.tsx
│       ├── ServiceJsonLd.tsx
│       ├── ArticleJsonLd.tsx
│       ├── FAQJsonLd.tsx
│       └── BreadcrumbJsonLd.tsx
│
├── lib/
│   ├── wordpress/
│   │   ├── client.ts
│   │   ├── queries/
│   │   ├── repositories/
│   │   └── types/
│   │
│   ├── seo/
│   │   ├── metadata.ts           # Metadata generator
│   │   └── utils.ts
│   │
│   └── schema/
│       ├── builder.ts             # Schema builder
│       └── types.ts
│
├── config/
│   ├── site.ts                   # Site configuration
│   └── redirects.ts              # Redirect rules
│
├── types/
│   └── index.ts                  # Global types
│
└── styles/
    └── globals.css               # Global styles + tokens
```

---

## 7. RENDERING STRATEGY

### 7.1 Rendering Types

| Page Type | Strategy | Revalidation |
|-----------|----------|---------------|
| Homepage | ISR | On-demand |
| Service Listing | ISR | On-demand |
| Service Detail | ISR | On-demand |
| Location Listing | ISR | On-demand |
| Location Detail | ISR | On-demand |
| Projects | ISR | On-demand |
| Project Detail | ISR | On-demand |
| Blog Listing | ISR | On-demand |
| Blog Category | ISR | On-demand |
| Article | ISR | On-demand |
| About | ISR | On-demand |
| FAQ | ISR | On-demand |
| Contact | Static | Manual |
| Booking | Static | Manual |
| Legal | Static | Manual |

### 7.2 On-Demand Revalidation

```typescript
// Trigger: WordPress webhook on publish/update
// Endpoint: /api/revalidate
// Secret: WP_REVALIDATION_SECRET
```

---

## 8. PERFORMANCE PRINCIPLES

### 8.1 Component Strategy

```
Server Components by default.
Client Components only when needed.
```

### 8.2 Images

```
Always use next/image with:
- Proper dimensions (no layout shift)
- Modern formats (WebP/AVIF)
- Responsive sizes
- Lazy loading (except hero/LCP)
- Blur placeholder
```

### 8.3 Fonts

```
- Self-host or use next/font
- Subset fonts
- Preload critical fonts
```

### 8.4 JavaScript

```
Don't add JS for simple visual animations.
Use CSS where possible.
```

### 8.5 Third-Party Scripts

```
- Analytics: Isolated, strategic loading
- Chat: Load on intent
- Marketing: Defer
```

---

## 9. GEO STRATEGY

### 9.1 GEO Built as Entity + Evidence + Relationships

```
AUTOSPA
│
├── WHO
│   └── Organization (transparency)
│
├── WHERE
│   └── Locations (physical + service areas)
│
├── WHAT
│   └── Services (what we do)
│
├── HOW
│   └── Process (how we do it)
│
├── PROOF
│   └── Projects (evidence of work)
│
├── TRUST
│   └── Reviews (social proof)
│
└── KNOWLEDGE
    └── Blog (expertise content)
```

### 9.2 Location Strategy

**CRITICAL DISTINCTION:**

| Type | LocalBusiness Schema | Page |
|------|---------------------|------|
| Physical Branch | YES | YES |
| Service Area | NO (areaServed only) | NO |

### 9.3 GEO Components

```
1. LocalBusiness schema per physical location
2. areaServed for service coverage
3. NAP consistency (Name, Address, Phone)
4. Google Business Profile integration (optional)
5. Maps embed
6. Location-specific content
```

---

## 10. CONVERSION ARCHITECTURE

### 10.1 CTA Hierarchy

```
PRIMARY
Book / Reservasi

SECONDARY
WhatsApp

TERTIARY
Call / Directions
```

### 10.2 CTA Rules

```
1. ONE primary CTA per section
2. Don't compete CTAs
3. Clear action language
4. Above-fold on commercial pages
```

### 10.3 CTA Examples

```
DON'T:
❌ "Learn More"
❌ "Get Started"
❌ "Discover"
❌ "Explore"
❌ "Shop Now"
❌ 7 different CTAs competing

DO:
✅ "Book Sekarang"
✅ "Reservasi Sekarang"
✅ "Hubungi via WhatsApp"
```

### 10.4 Conversion Flow

```
Search
  ↓
Education (Blog/Articles)
  ↓
Trust (Reviews/Projects)
  ↓
Proof (Before/After)
  ↓
CTA (Booking)
```

---

## 11. STACK SPECIFICATION

### 11.1 Final Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | Next.js | Latest stable |
| UI | React | Latest stable |
| Language | TypeScript | Latest stable |
| Styling | Tailwind CSS | Latest stable |
| CMS | WordPress | Existing |
| API | WPGraphQL | Existing |
| Hosting | Vercel | - |
| CDN | Cloudflare | - |

**Note:** Specific minor versions determined at implementation time based on compatibility.

### 11.2 Core Dependencies

```json
{
  "next": "latest",
  "react": "latest",
  "react-dom": "latest",
  "typescript": "latest",
  "tailwindcss": "latest",
  "@tailwindcss/postcss": "latest"
}
```

---

## 12. ITEMS NOT LOCKED YET

The following will be determined during Phase 2 (WordPress Content Model):

```
UNCERTAIN / PENDING:
├── Exact color palette
├── Exact font choices
├── Photography treatment guidelines
├── Final physical locations list
├── Final WordPress CPT field names
├── Final WordPress CPT relationships
└── Final URL mapping for individual blog posts
```

These require Phase 2 WordPress audit and content model definition.

---

## 13. PHASE 1C.1 — UI REFERENCE BOARD

### Purpose

Analyze Claude Directory UI patterns for AutoSPA requirements.
Select, modify, or reject each pattern based on automotive context.

### Decision Legend

```
✅ KEEP     — Use directly, minimal changes
🔄 MODIFY  — Adapt for automotive/auto detailing context
❌ REJECT   — Not suitable for AutoSPA
```

---

### 13.1 Navigation / Header

| Pattern | Source | Decision | Notes |
|---------|--------|----------|-------|
| Sticky Header | Claude Directory | 🔄 MODIFY | Good for service pages, adapt for automotive |
| Logo + Nav + CTA | Claude Directory | ✅ KEEP | Standard pattern, works well |
| Mega Menu | Claude Directory | 🔄 MODIFY | For services + locations |
| Mobile Hamburger | Claude Directory | 🔄 MODIFY | Full-screen takeover preferred |
| Nav Dropdown | Claude Directory | 🔄 MODIFY | For services categories |

**AutoSPA Nav Structure:**
```
Services     Locations     Projects     Blog     About     [Booking CTA]
   │             │            │          │         │
   ▼             ▼            ▼          ▼         ▼
[Dropdown]   [Dropdown]   [Grid]    [Archive]  [Page]
```

---

### 13.2 Hero Section

| Pattern | Source | Decision | Notes |
|---------|--------|----------|-------|
| Full-width Image Hero | Claude Directory | ✅ KEEP | Perfect for automotive showcase |
| Overlay + Text | Claude Directory | ✅ KEEP | Contrast for readability |
| Split Hero (Image + Content) | Claude Directory | 🔄 MODIFY | For service detail pages |
| Video Background | Claude Directory | ❌ REJECT | Too heavy, not professional |
| Parallax Hero | Claude Directory | ❌ REJECT | Performance + accessibility concerns |

**AutoSPA Hero Principles:**
```
- High-quality automotive photography as background
- Clear headline + subheadline
- ONE primary CTA
- Trust signal badge (optional)
```

---

### 13.3 Trust / Stats

| Pattern | Source | Decision | Notes |
|---------|--------|----------|-------|
| Counter Animation | Claude Directory | 🔄 MODIFY | On scroll, not on load |
| Icon + Number + Label | Claude Directory | ✅ KEEP | Clean, professional |
| Trust Bar | Claude Directory | ✅ KEEP | Perfect for AutoSPA metrics |
| Before/After Stats | Claude Directory | ✅ KEEP | Very relevant for AutoSPA |

**AutoSPA Trust Metrics:**
```
┌─────────────────────────────────────────────────────────┐
│  30+ YEARS   │  1000+ PROJECTS  │  4 LOCATIONS  │  4.8★  │
│  EXPERIENCE  │   COMPLETED       │   JABODETABEK  │  RATING │
└─────────────────────────────────────────────────────────┘
```

---

### 13.4 Services Section

| Pattern | Source | Decision | Notes |
|---------|--------|----------|-------|
| Card Grid | Claude Directory | ✅ KEEP | Standard service display |
| Image + Title + Desc | Claude Directory | ✅ KEEP | Clean service card |
| Hover Effect | Claude Directory | 🔄 MODIFY | Subtle, not flashy |
| Service Icon | Claude Directory | 🔄 MODIFY | Use real images, not icons |
| Category Filter | Claude Directory | ✅ KEEP | For services listing |

**AutoSPA Service Card:**
```
┌─────────────────────────────────┐
│     [HIGH-QUALITY IMAGE]       │
│                                 │
│   NANO CERAMIC COATING        │
│   Lindungi cat mobil dengan    │
│   teknologi coating terbaru    │
│                                 │
│   Mulai dari Rp XXX.xxx       │
│                                 │
│   [Selengkapnya →]            │
└─────────────────────────────────┘
```

---

### 13.5 Service Detail

| Pattern | Source | Decision | Notes |
|---------|--------|----------|-------|
| Sticky Sidebar TOC | Claude Directory | 🔄 MODIFY | For long service pages |
| Process Steps | Claude Directory | ✅ KEEP | Very relevant for AutoSPA |
| Comparison Table | Claude Directory | ✅ KEEP | Package comparison |
| FAQ Accordion | Claude Directory | ✅ KEEP | Standard pattern |
| Pricing Cards | Claude Directory | 🔄 MODIFY | Adapt for packages |

**AutoSPA Service Detail Structure:**
```
1. Hero Image
2. Summary
3. Problem / Need
4. Benefits
5. Process (numbered steps)
6. Technology / Materials
7. Packages / Pricing
8. Before / After Gallery
9. Related Projects
10. FAQ
11. CTA
```

---

### 13.6 Before & After

| Pattern | Source | Decision | Notes |
|---------|--------|----------|-------|
| Slider Comparison | Claude Directory | ✅ KEEP | Excellent for automotive |
| Side-by-Side | Claude Directory | ✅ KEEP | Clear comparison |
| Image Swap on Hover | Claude Directory | 🔄 MODIFY | Mobile-friendly version |
| Before/After Gallery | Claude Directory | ✅ KEEP | Grid of examples |

**AutoSPA Before/After Patterns:**
```
┌─────────────────────────────────────────────────────────┐
│                    SLIDER COMPARISON                     │
│  ┌─────────────────────────────────────────────────┐   │
│  │ BEFORE          │╎╎╎╎╎╎│          AFTER │      │   │
│  │                 │╎╎╎╎╎╎│                 │      │   │
│  └─────────────────────────────────────────────────┘   │
│              BMW X5 • Ceramic Coating                   │
└─────────────────────────────────────────────────────────┘
```

---

### 13.7 Portfolio / Projects

| Pattern | Source | Decision | Notes |
|---------|--------|----------|-------|
| Masonry Grid | Claude Directory | 🔄 MODIFY | Heavy, use CSS Grid |
| Filter + Grid | Claude Directory | ✅ KEEP | Service + vehicle filters |
| Project Card | Claude Directory | 🔄 MODIFY | Add vehicle + service tags |
| Lightbox Gallery | Claude Directory | ✅ KEEP | For project images |
| Category Tabs | Claude Directory | ✅ KEEP | For project listing |

**AutoSPA Project Card:**
```
┌─────────────────────────────────┐
│     [BEFORE / AFTER GRID]      │
│                                 │
│  Toyota Fortuner                │
│  Ceramic Coating • Pluit        │
│                                 │
│  [View Project →]              │
└─────────────────────────────────┘
```

---

### 13.8 Process Section

| Pattern | Source | Decision | Notes |
|---------|--------|----------|-------|
| Numbered Steps | Claude Directory | ✅ KEEP | Clear process flow |
| Timeline | Claude Directory | 🔄 MODIFY | Vertical on mobile |
| Icon + Step | Claude Directory | ✅ KEEP | Professional look |
| Process Image | Claude Directory | ✅ KEEP | Show real work |

**AutoSPA Process:**
```
STEP 1          STEP 2          STEP 3          STEP 4
   │               │               │               │
   ▼               ▼               ▼               ▼
[Icon]          [Icon]          [Icon]          [Icon]

Inspection    Paint Correction   Coating        Quality Check
   │               │               │               │
Description   Description     Description     Description
```

---

### 13.9 Testimonials

| Pattern | Source | Decision | Notes |
|---------|--------|----------|-------|
| Carousel | Claude Directory | 🔄 MODIFY | Manual navigation, not auto-play |
| Quote + Avatar + Name | Claude Directory | ✅ KEEP | Clean testimonial card |
| Star Rating | Claude Directory | ✅ KEEP | Only if from Google |
| Video Testimonial | Claude Directory | 🔄 MODIFY | Optional, not required |
| Google Reviews Badge | Claude Directory | ✅ KEEP | Trust signal |

**AutoSPA Testimonial Card:**
```
┌─────────────────────────────────────────┐
│  "Hasil ceramic coating di AutoSPA     │
│   sangat memuaskan. Mobil kinclong      │
│   seperti baru lagi!"                   │
│                                          │
│  ─────────────────────────────────────  │
│  [Avatar]  Bpk. Rendy                    │
│            Toyota Alphard               │
│            ★★★★★                         │
│            Google Review                 │
└─────────────────────────────────────────┘
```

---

### 13.10 Locations / Maps

| Pattern | Source | Decision | Notes |
|---------|--------|----------|-------|
| Map Embed | Claude Directory | ✅ KEEP | Google Maps iframe |
| Location Cards | Claude Directory | ✅ KEEP | Address + hours + phone |
| Branch Selector | Claude Directory | ✅ KEEP | For multiple locations |
| Service Area | Claude Directory | 🔄 MODIFY | For GEO targeting |

**AutoSPA Location Card:**
```
┌─────────────────────────────────────────┐
│  [Map Preview]                         │
│                                          │
│  AUTOSPA PLUIT                          │
│  📍 Jl. Pluit Timur Raya No. XX        │
│  📞 (021) XXX XXXX                      │
│  🕐 Senin-Sabtu: 08:00 - 18:00         │
│                                          │
│  [Lihat di Maps] [Booking]              │
└─────────────────────────────────────────┘
```

---

### 13.11 Blog / Articles

| Pattern | Source | Decision | Notes |
|---------|--------|----------|-------|
| Article Card | Claude Directory | ✅ KEEP | Image + title + excerpt + date |
| Featured Article | Claude Directory | ✅ KEEP | Large hero card for latest |
| Category Pills | Claude Directory | ✅ KEEP | Filter by category |
| Author + Date + Read Time | Claude Directory | ✅ KEEP | Standard meta |
| Related Articles | Claude Directory | ✅ KEEP | 3-4 related posts |

**AutoSPA Article Card:**
```
┌─────────────────────────────────┐
│     [FEATURED IMAGE]           │
│                                 │
│  CERAMIC COATING               │
│  Cara Merawat Mobil Setelah    │
│  Coating Agar Tetap Kinclong    │
│                                 │
│  📅 15 Aug 2024  •  5 min read │
└─────────────────────────────────┘
```

---

### 13.12 FAQ

| Pattern | Source | Decision | Notes |
|---------|--------|----------|-------|
| Accordion | Claude Directory | ✅ KEEP | Standard pattern |
| Category Filter | Claude Directory | ✅ KEEP | General, Service, Pricing |
| Search | Claude Directory | ✅ KEEP | For large FAQ lists |
| FAQ Schema | Claude Directory | ✅ KEEP | Important for SEO |

**AutoSPA FAQ Structure:**
```
┌─────────────────────────────────────────┐
│  FAQ                                    │
│  [Search...                    ] 🔍      │
│                                          │
│  [All] [Services] [Ceramic] [PPF] [Pricing]
│                                          │
│  ┌─ Apa itu ceramic coating? ──────────┐  │
│  │ Ceramic coating adalah...           │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌─ Berapa lama proses ceramic? ──────┐  │
│  │ Biasanya membutuhkan waktu...        │  │
│  └────────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

### 13.13 Booking CTA

| Pattern | Source | Decision | Notes |
|---------|--------|----------|-------|
| Full-width CTA Banner | Claude Directory | ✅ KEEP | Conversion focus |
| Primary + Secondary CTA | Claude Directory | ✅ KEEP | Book + WhatsApp |
| WhatsApp Button | Claude Directory | ✅ KEEP | High conversion in Indonesia |
| Form Modal | Claude Directory | 🔄 MODIFY | Consider dedicated page |
| Sticky Mobile CTA | Claude Directory | ✅ KEEP | Fixed bottom bar on mobile |

**AutoSPA Booking CTA:**
```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│  Siap Merawat Mobil Anda?                               │
│                                                          │
│  ┌──────────────────┐    ┌──────────────────┐           │
│  │  📅 Book Sekarang │    │  💬 WhatsApp     │           │
│  └──────────────────┘    └──────────────────┘           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

### 13.14 Footer

| Pattern | Source | Decision | Notes |
|---------|--------|----------|-------|
| Multi-column | Claude Directory | ✅ KEEP | Standard footer |
| Logo + Description | Claude Directory | ✅ KEEP | Brand statement |
| Nav Links | Claude Directory | ✅ KEEP | Organized by category |
| Social Icons | Claude Directory | ✅ KEEP | Instagram, FB, YouTube |
| WhatsApp CTA | Claude Directory | ✅ KEEP | Prominent |
| Copyright | Claude Directory | ✅ KEEP | Standard |

**AutoSPA Footer Structure:**
```
┌─────────────────────────────────────────────────────────┐
│  [Logo]                                                │
│  Premium automotive care solution di Jakarta             │
│                                                          │
│  Services      Locations      Company       Connect      │
│  ├ Ceramic     ├ Pluit       ├ About       ├ Instagram │
│  ├ PPF         ├ Jakarta      ├ Contact     ├ Facebook  │
│  ├ Detailing   ├ Depok       ├ FAQ         ├ YouTube   │
│  └ ...         └ ...          └ ...         └ WhatsApp │
│                                                          │
│  ┌──────────────────┐                                  │
│  │  📅 Book Sekarang │   © 2024 AutoSPA Jakarta         │
│  └──────────────────┘                                  │
└─────────────────────────────────────────────────────────┘
```

---

### 13.15 Mobile UX

| Pattern | Source | Decision | Notes |
|---------|--------|----------|-------|
| Mobile Nav (Full-screen) | Claude Directory | ✅ KEEP | Better than hamburger drawer |
| Sticky Bottom Bar | Claude Directory | ✅ KEEP | CTA always visible |
| Swipe Carousel | Claude Directory | ✅ KEEP | For testimonials/projects |
| Collapsible Sections | Claude Directory | ✅ KEEP | FAQ, accordions |
| Mobile-optimized Images | Claude Directory | ✅ KEEP | next/image responsive |

**AutoSPA Mobile Bottom Bar:**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  [Long content scroll...]                               │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  [📞 Call]        [💬 WhatsApp]        [📅 Booking]   │
└─────────────────────────────────────────────────────────┘
```

---

### 13.16 Animation / Micro-interactions

| Pattern | Source | Decision | Notes |
|---------|--------|----------|-------|
| Scroll Reveal | Claude Directory | 🔄 MODIFY | Subtle, 200ms, CSS preferred |
| Hover States | Claude Directory | ✅ KEEP | Cards, buttons, links |
| Loading Skeleton | Claude Directory | ✅ KEEP | Better than spinner |
| Image Lazy Load | Claude Directory | ✅ KEEP | next/image default |
| Smooth Scroll | Claude Directory | 🔄 MODIFY | Only for anchor links |

**Animation Principles:**
```
DO:
- Scroll-triggered reveals (subtle)
- Hover feedback
- Loading states

DON'T:
- Auto-playing carousels
- Excessive parallax
- Heavy JS animations
- Motion that distracts from content
```

---

### 13.17 Summary: Keep / Modify / Reject

| Category | Keep | Modify | Reject |
|----------|------|--------|--------|
| Navigation | 1 | 3 | 0 |
| Hero | 2 | 1 | 2 |
| Trust/Stats | 3 | 1 | 0 |
| Services | 3 | 2 | 0 |
| Service Detail | 3 | 2 | 0 |
| Before/After | 3 | 1 | 0 |
| Portfolio | 2 | 2 | 1 |
| Process | 3 | 1 | 0 |
| Testimonials | 2 | 2 | 0 |
| Locations | 3 | 1 | 0 |
| Blog | 5 | 0 | 0 |
| FAQ | 4 | 0 | 0 |
| Booking CTA | 3 | 1 | 0 |
| Footer | 5 | 0 | 0 |
| Mobile | 3 | 1 | 0 |
| Animation | 2 | 3 | 0 |

**Overall: ~80% patterns are KEEP or MODIFY — Claude Directory is excellent reference.**

---

## 14. PHASE ROADMAP

```
PHASE 1 (COMPLETED)
├── 1A: URL Mapping           ✅
├── 1B: Entity Architecture   ✅
├── 1C: Frontend Arch        ✅
└── 1C.1: UI Reference Board ✅

PHASE 2 (NEXT)
├── 2A: WordPress Content Model
├── 2B: WPGraphQL Specification
├── 2C: ACF Fields
└── 2D: Content Migration

PHASE 3 (AFTER PHASE 2)
└── Next.js Implementation
```

---

## DOCUMENT CONTROL

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-08-18 | Initial approved version |
| 1.1 | 2026-08-18 | Added 1C.1 UI Reference Board |

---

**This document is the architecture contract. All implementation must follow this document.**

---

**Next Action:** Phase 2A - WordPress Content Model & WPGraphQL Specification
