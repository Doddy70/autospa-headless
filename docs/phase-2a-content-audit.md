# PHASE 2A: EXISTING WORDPRESS CONTENT AUDIT
## AutoSP AJakarta - Headless WordPress Project

**Project:** Headless WordPress → Next.js for SEO/GEO Rebuild
**Date:** 2026-08-18
**Status:** IN PROGRESS

---

## EXECUTIVE SUMMARY

### Current State

| Metric | Value |
|--------|-------|
| Blog Posts | 174 published |
| Service Pages | 6 standalone pages |
| Portfolio/Projects | 12 items |
| Static Pages | 13 pages |
| Media Library | 815 items (809 images, 5 videos) |
| Categories | 17 categories |
| Tags | 70+ tags |

### Key Findings

1. **Content Inventory**: 174 blog posts dengan SEO metadata dari Rank Math
2. **Service Structure**: 6 service pages + 12 portfolio items (keduanya perlu di-restructure)
3. **No Structured Data**: Tidak ada custom fields untuk Locations, Testimonials, atau structured content
4. **SEO Foundation**: Rank Math sudah terinstall dengan focus keywords dan meta descriptions
5. **Theme Dependent**: Content sangat terikat dengan Elementor dan themescamp-core

---

## 1. EXISTING CONTENT INVENTORY

### 1.1 Blog Posts (174 articles)

**Distribution by Category:**

| Category | Count | % |
|----------|-------|---|
| Tips & Insight | 37 | 21% |
| Autospa Pluit | 25 | 14% |
| Bengkel Detailing | 23 | 13% |
| Salon Mobil Jakarta | 19 | 11% |
| Coating Mobil | 18 | 10% |
| Paint Protection Film | 16 | 9% |
| Rust Protection | 15 | 9% |
| Mudik Lebaran | 9 | 5% |
| Auto Detailing | 9 | 5% |
| Engine Detailing | 9 | 5% |
| Eksterior Detailing | 3 | 2% |
| Interior Detailing | 2 | 1% |
| Car Wash | 2 | 1% |
| Glass Cleaning | 2 | 1% |
| Nano Ceramic Coating | 4 | 2% |
| Uncategorized | 7 | 4% |

**Content Quality Indicators:**

| Metric | Average |
|--------|---------|
| Word Count | ~450-650 words |
| SEO Score | 10-68 (mixed) |
| Focus Keyword | Set per article |
| Meta Description | Set per article |

### 1.2 Service Pages (6 pages)

| Page | Slug | Type |
|------|------|------|
| Premium Nano Ceramic Coating | premium-nano-ceramic-coating | Service Page |
| 360° Paint Protection Film Package | 360-paint-protection-film-package | Service Page |
| Nano Ceramic Coating | nano-ceramic-coating | Service Page |
| Premium Detailing | premium-detailing | Service Page |
| Premium Wash | premium-wash | Service Page |
| Premium Coating LP | premium-coating-lp | Landing Page |

### 1.3 Portfolio/Projects (12 items)

| Project | Category | Service Type |
|---------|----------|--------------|
| Premium 360° PPF Package | Premium | PPF |
| Premium Nano Ceramic Coating | Premium | Ceramic |
| Premium Full Detailing | Premium | Detailing |
| Premium PPF Package | Premium | PPF |
| Premium Wash | Premium | Wash |
| Daily PPF Package | Standard | PPF |
| Platinum Package | Premium | Multi |
| Diamond Package | Premium | Multi |
| Gold Package | Standard | Multi |
| Silver Package | Standard | Multi |
| Bronze Packages | Basic | Multi |
| Light Package | Basic | Multi |

### 1.4 Static Pages (13 pages)

| Page | Purpose | SEO Priority |
|------|---------|--------------|
| Home | Homepage | Critical |
| About | Company Info | Medium |
| Our Services | Service Listing | Medium |
| Pricing | Pricing Info | Medium |
| FAQ | FAQ | Low |
| Contact | Contact | Low |
| Team | Team | Low |
| Blog Standard | Blog Listing | Redirect |
| News & Insight | Blog Archive | Redirect |
| Reservasi | Booking | Low |
| Privacy Policy | Legal | None |
| Cookie Policy | Legal | None |
| Terms & Conditions | Legal | None |

---

## 2. GAP ANALYSIS

### 2.1 Service Entity Gap

**Current State:**
- Service pages exist as standalone pages
- No structured service data (pricing, duration, packages, etc.)
- Services not linked to Locations
- Services not linked to Projects (evidence)
- Services not linked to FAQ

**Required New Model:**

```
SERVICE ENTITY
├── Title, slug, description
├── Service category
├── Pricing (with packages)
├── Duration
├── Process steps
├── Benefits
├── Technology/materials used
├── Available locations
├── Related projects
├── Related FAQ
├── Before/after examples
└── SEO metadata
```

**Gap Score: HIGH**

### 2.2 Location Entity Gap

**Current State:**
- No structured location data
- "Autospa Pluit" mentioned in blog categories but no dedicated entity
- No address, hours, phone per location
- No service-area mapping

**Required New Model:**

```
LOCATION ENTITY
├── Branch name
├── Address (street, city, postal code)
├── Geo coordinates
├── Phone numbers
├── WhatsApp
├── Operating hours
├── Services available
├── Photos/facility
├── Projects done here
├── Reviews from this location
├── Service areas (for GEO)
└── Booking link
```

**Gap Score: CRITICAL** (no existing data)

### 2.3 Project Entity Gap

**Current State:**
- 12 portfolio items exist
- Basic structure: title, featured image
- No vehicle data
- No before/after images (except secondary image)
- No service linkage
- No location linkage

**Required New Model:**

```
PROJECT ENTITY
├── Title (vehicle + service)
├── Vehicle (make, model, year)
├── Service performed
├── Initial condition (before)
├── Process description
├── Final result (after)
├── Before/after gallery
├── Location where done
├── Customer need
├── Date completed
├── Gallery images
└── Related service link
```

**Gap Score: MEDIUM** (basic structure exists)

### 2.4 FAQ Entity Gap

**Current State:**
- FAQ page exists but content is static
- No structured FAQ data
- No service/location linkage
- No FAQ schema markup (structured)

**Required New Model:**

```
FAQ ENTITY
├── Question
├── Answer
├── Category (general, service, pricing, etc.)
├── Related service
├── Related location
└── Display order
```

**Gap Score: HIGH** (no structured data)

### 2.5 Testimonial Entity Gap

**Current State:**
- No testimonial structure
- Reviews might exist in TrustIndex plugin
- No customer attribution (vehicle, service)

**Required New Model:**

```
TESTIMONIAL ENTITY
├── Quote text
├── Customer name
├── Customer avatar
├── Vehicle serviced
├── Service performed
├── Rating (if from Google)
├── Source (Google, website)
├── Location
└── Date
```

**Gap Score: CRITICAL** (no existing data)

### 2.6 Team Entity Gap

**Current State:**
- Team page exists with static content
- No structured team member data

**Required New Model:**

```
TEAM MEMBER ENTITY
├── Name
├── Role/position
├── Photo
├── Bio
├── Specializations
├── Location assigned
└── Social links
```

**Gap Score: MEDIUM** (basic page exists)

---

## 3. CONTENT AUDIT MATRIX

### 3.1 Blog Posts - Initial Classification

Based on content analysis, posts can be classified as:

```
174 POSTS
    │
    ├── CONTENT HUB (High Value)
    │   ├── Educational content (how-to, guides)
    │   ├── Service explanations
    │   └── Product comparisons
    │   Est: ~60-70 posts
    │
    ├── GEO/LOCATION PAGES
    │   ├── "Mobil di Jakarta"
    │   ├── "Salon Mobil [Area]"
    │   └── "Auto Detailing [City]"
    │   Est: ~50-60 posts
    │
    ├── PROMOTIONAL
    │   ├── "Autospa Pluit" branded
    │   ├── Location-specific promos
    │   └── Service promos
    │   Est: ~30-40 posts
    │
    └── LOW VALUE / DUPLICATE
        ├── Very short content
        ├── Duplicate topics
        └── Overlapping keywords
        Est: ~10-20 posts
```

### 3.2 Service Pages - Migration Actions

| Existing URL | Current Content | Action | New Entity | Notes |
|--------------|----------------|--------|------------|-------|
| /premium-nano-ceramic-coating/ | Full service page | **RESTRUCTURE** | Service | Extract content, add structured fields |
| /360-paint-protection-film-package/ | Full service page | **RESTRUCTURE** | Service | Extract content, add structured fields |
| /nano-ceramic-coating/ | Basic service page | **RESTRUCTURE** | Service | Merge with premium version |
| /premium-detailing/ | Full service page | **RESTRUCTURE** | Service | Extract content, add structured fields |
| /premium-wash/ | Full service page | **RESTRUCTURE** | Service | Extract content, add structured fields |
| /premium-coating-lp/ | Landing page | **ARCHIVE** | - | Duplicate content |
| /our-services/ | Services listing | **REDIRECT** | Service Listing | Redirect to /services/ |

### 3.3 Portfolio - Migration Actions

| Existing Project | Action | New Entity | Notes |
|-----------------|--------|------------|-------|
| Premium 360° PPF Package | **KEEP + ENRICH** | Project | Add vehicle, before/after, location |
| Premium Nano Ceramic Coating | **KEEP + ENRICH** | Project | Add vehicle, before/after, location |
| Premium Full Detailing | **KEEP + ENRICH** | Project | Add vehicle, before/after, location |
| Premium PPF Package | **KEEP + ENRICH** | Project | Add vehicle, before/after, location |
| Premium Wash | **KEEP + ENRICH** | Project | Add vehicle, before/after, location |
| Daily PPF Package | **KEEP + ENRICH** | Project | Add vehicle, before/after, location |
| Platinum Package | **KEEP + ENRICH** | Project | Add vehicle, before/after, location |
| Diamond Package | **KEEP + ENRICH** | Project | Add vehicle, before/after, location |
| Gold Package | **KEEP + ENRICH** | Project | Add vehicle, before/after, location |
| Silver Package | **KEEP + ENRICH** | Project | Add vehicle, before/after, location |
| Bronze Packages | **KEEP + ENRICH** | Project | Add vehicle, before/after, location |
| Light Package | **KEEP + ENRICH** | Project | Add vehicle, before/after, location |

### 3.4 Static Pages - Migration Actions

| Page | Action | New URL | Notes |
|------|--------|---------|-------|
| Home | **REPLACE** | / | New homepage template |
| About | **MIGRATE** | /about/ | Keep content, improve structure |
| Pricing | **RESTRUCTURE** | Per-service | Move pricing to service pages |
| FAQ | **REPLACE** | /faq/ | Structured FAQ with categories |
| Contact | **KEEP** | /contact/ | Basic contact info |
| Team | **RESTRUCTURE** | /about/#team | Move to About page |
| Blog Standard | **NOINDEX** | - | Redirect to /blog/ |
| News & Insight | **NOINDEX** | - | Redirect to /blog/ |
| Reservasi | **KEEP** | /reservasi/ | Keep booking flow |
| Privacy Policy | **KEEP** | /privacy-policy/ | Legal page |
| Cookie Policy | **KEEP** | /cookie-policy/ | Legal page |
| Terms & Conditions | **KEEP** | /terms-conditions/ | Legal page |

---

## 4. SEO ASSET PRESERVATION

### 4.1 Existing SEO Value

| Asset | Status | Action |
|-------|--------|--------|
| URL Structure | Partial | Review and map per Phase 1A |
| Page Titles | Good | Preserve via Rank Math export |
| Meta Descriptions | Good | Preserve via Rank Math export |
| Focus Keywords | Good | Preserve via Rank Math export |
| Internal Links | Varies | Review and recreate in new structure |
| Categories | Good | Map to new taxonomy |
| Tags | Medium | Consider consolidation |
| Featured Images | Good | Preserve in media library |
| Content Quality | Mixed | Audit and improve |

### 4.2 Rank Math Data to Preserve

```
EXPORT REQUIRED:
├── post_id
├── post_name
├── post_title
├── seo_title
├── meta_description
├── focus_keyword
├── primary_category
├── seo_score
└── robots (noindex, etc.)
```

### 4.3 Redirect Map (Preliminary)

| Old URL | New URL | Type |
|---------|---------|------|
| /our-services/ | /services/ | 301 |
| /blog-standard/ | /blog/ | 301 |
| /news-insight/ | /blog/ | 301 |
| /service/* | /services/* | 301 |
| /premium-nano-ceramic-coating/ | /services/nano-ceramic-coating/ | 301 |

*Full redirect map in Phase 1A document*

---

## 5. CONTENT AUDIT CHECKLIST

### 5.1 Blog Posts - Detailed Audit Required

For each of 174 posts, we need to determine:

- [ ] **URL** - Current slug
- [ ] **Title** - Current title
- [ ] **Category** - Current category assignment
- [ ] **Date Published** - For recency signal
- [ ] **Date Modified** - For freshness signal
- [ ] **Word Count** - Content length
- [ ] **Focus Keyword** - Rank Math data
- [ ] **SEO Score** - Rank Math data
- [ ] **Traffic Data** - Google Analytics (if available)
- [ ] **Internal Links** - Current linking structure
- [ ] **Related Service** - Which service this supports
- [ ] **Related Location** - Pluit or other
- [ ] **Recommendation** - KEEP / UPDATE / MERGE / REDIRECT / NOINDEX

### 5.2 Service Pages - Detailed Audit Required

For each of 6 service pages:

- [ ] **URL** - Current slug
- [ ] **Title** - Current title
- [ ] **Content Summary** - What topics covered
- [ ] **Pricing Info** - Any pricing mentioned
- [ ] **Process Info** - Steps mentioned
- [ ] **Technology/Materials** - Products used
- [ ] **Before/After** - Any examples
- [ ] **Related Projects** - Portfolio links
- [ ] **Related FAQ** - Any questions answered
- [ ] **Location Mentioned** - Where available
- [ ] **SEO Performance** - Traffic, rankings
- [ ] **Recommendation** - RESTRUCTURE / ARCHIVE / DELETE

---

## 6. NEXT STEPS

### Immediate Actions (This Week)

1. **Export Rank Math Data**
   - All post SEO metadata
   - All page SEO metadata
   - Primary category mappings

2. **Content Audit - Services First**
   - Review all 6 service pages
   - Extract structured data
   - Map to new Service entity model

3. **Content Audit - Blog Sample**
   - Audit top 30 posts by date
   - Determine classification criteria
   - Create audit template

### Phase 2A Deliverables

| Deliverable | Status |
|-------------|--------|
| Content Inventory | ✅ Complete |
| Gap Analysis | ✅ Complete |
| Blog Audit Matrix | 🔄 In Progress |
| Service Audit Matrix | 🔄 In Progress |
| Redirect Map | 🔄 Pending |
| Migration Priority List | 🔄 Pending |

---

## 7. OPEN QUESTIONS

1. **Location Data**: Where is the physical location data stored? Need to verify if AutoSPA has other branches besides Pluit.

2. **Google Reviews**: Is TrustIndex plugin connected? Can we export existing reviews?

3. **Team Photos**: Are team member photos in media library?

4. **Before/After Images**: Are there before/after image sets in the portfolio?

5. **Service Pricing**: Is current pricing on site still accurate?

6. **Blog Writing Style**: Continue in Indonesian or switch to English?

---

## APPENDIX A: BLOG POSTS LIST (174 POSTS)

| # | Slug | Title | Date | Category | Word Count |
|---|------|-------|------|----------|------------|
| 1 | cara-menghilangkan-jamur-kaca-mobil-jakarta | Cara Mengatasi Jamur Kaca Mobil Akibat Hujan dan Polusi Jakarta | 2026-05-26 | Tips & Insight | 604 |
| 2 | kenapa-mobil-hitam-cepat-kusam-di-jakarta | Kenapa Mobil Hitam Lebih Cepat Kusam? Ini Solusi Detailing yang Tepat | 2026-05-01 | Tips & Insight | 549 |
| 3 | solusi-cat-mobil-kusam-di-jakarta | Cat Mobil Tergores? Ini Sololusinya di! | 2026-04-29 | Mudik Lebaran, Paint Protection Film, Tips & Insight | 699 |
| 4 | cara-mengatasi-jamur-kaca-mobil-jakarta | Jamur Kaca Bandel di Mobil? Ini Solusinya! | 2026-04-27 | Tips & Insight | 575 |
| 5 | cara-menghilangkan-noda-tar-mobil | Cara Ampuh Hilangkan Tar dan Oksidasi Mobil di Jakarta | 2026-04-26 | Tips & Insight | 631 |
| 6 | cara-mengatasi-emblem-mobil-kusam-di-jakarta | Emblem Mobil Kusam? Ini Cara Detailing yang Tepat! | 2026-04-22 | Tips & Insight | 647 |
| 7 | apakah-mobil-baru-butuh-coating-di-jakarta | Mobil Baru Anda Tergores? Ini Solusi Nano Ceramic Coating! | 2026-04-21 | Auto Detailing | 531 |
| 8 | kenapa-velg-mobil-cepat-kotor | Velg Mobil Cepat Kotor? Ini Solusinya! | 2026-04-21 | Tips & Insight | 528 |
| 9 | masalah-chrome-mobil-kusam | Chrome Mobil Kusam? Ini Solusinya untuk Kilap Kembali! | 2026-04-20 | Tips & Insight | 648 |
| 10 | cara-menghilangkan-swirl-mark-cat-mobil-jakarta | Cat Mobil Banyak Baret Halus di Jakarta? Ini Solusinya! | 2026-04-19 | Auto Detailing | 599 |
| ... | ... | ... | ... | ... | ... |

*[Full list of 174 posts available in database export]*

---

## APPENDIX B: CATEGORIES MAPPING

| Current Category | New Taxonomy | Action |
|-----------------|--------------|--------|
| Tips & Insight | Blog Category | KEEP |
| Autospa Pluit | Location + Blog Category | SPLIT - Create Location, reduce blog category |
| Bengkel Detailing | Blog Category | RENAME to "Detailing" |
| Salon Mobil Jakarta | Blog Category | RENAME to "Salon Mobil" |
| Coating Mobil | Blog Category | MERGE with Nano Ceramic Coating |
| Paint Protection Film | Blog Category | KEEP |
| Rust Protection | Blog Category + Service | DUAL - Blog category + link to Service |
| Mudik Lebaran | Blog Category | KEEP (seasonal) |
| Auto Detailing | Blog Category | MERGE with Bengkel Detailing |
| Engine Detailing | Blog Category + Service | DUAL |
| Eksterior Detailing | Blog Category | KEEP |
| Interior Detailing | Blog Category + Service | DUAL |
| Car Wash | Blog Category | MERGE with "Premium Wash" service |
| Glass Cleaning | Blog Category | MERGE with "Detailing" |
| Nano Ceramic Coating | Blog Category + Service | DUAL |
| Uncategorized | - | NOINDEX all |

---

## APPENDIX C: PLUGIN INVENTORY

| Plugin | Purpose | Keep for Migration? |
|--------|---------|---------------------|
| Elementor | Page Builder | NO - Headless |
| Elementor Pro | Pro Features | NO - Headless |
| WPGraphQL | GraphQL API | **YES - Critical** |
| Rank Math | SEO | **YES - Export data only** |
| Rank Math Pro | SEO Pro | NO - Migrate to Next.js SEO |
| Classic Editor | Editor | Optional |
| Classic Widgets | Widgets | NO |
| Contact Form Entries | Form Data | Optional |
| Duplicator Pro | Backup | YES - Migration tool |
| Events Tracker for Elementor | Tracking | NO |
| Extensions for Elementor Form | Forms | NO |
| Google Site Kit | Analytics | **YES** |
| GPT3 AI Content Generator | AI Writing | NO |
| Metform | Forms | Optional |
| Official Facebook Pixel | Tracking | **YES - Migrate to GTM** |
| SEO by Rank Math | SEO | NO - Use Rank Math free |
| SEO by Rank Math Pro | SEO Pro | NO |
| SVG Support | Media | **YES** |
| ThemesCamp Core | Theme Functions | NO - Headless |
| Tracking Code Manager | Tracking | **YES** |
| WhatsApp Support | Chat | **YES - Migrate** |
| WP Reviews Plugin for Google | Reviews | NO - Use TrustIndex or native |
| WPMU Dev Updates | Updates | NO |
| WP Smush Pro | Image Optimization | **YES - For original images** |

---

**Document Status:** DRAFT - Pending detailed blog post audit
**Last Updated:** 2026-08-18
**Next Action:** Complete blog post audit matrix (174 posts)
