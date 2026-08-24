# PHASE 2B: TAXONOMY STRUCTURE
## AutoSP AJakarta - Headless WordPress Project

**Project:** Headless WordPress → Next.js for SEO/GEO Rebuild
**Date:** 2026-08-18
**Status:** FINAL - Taxonomy Locked

---

## 1. TAXONOMY OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            TAXONOMY STRUCTURE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  WORDPRESS NATIVE TAXONOMIES                                               │
│  ├── Category ─────────────────────────────────────────────────► Blog        │
│  └── Post Tag ───────────────────────────────────────────────► Blog        │
│                                                                             │
│  CUSTOM SEMANTIC TAXONOMIES                                               │
│  ├── Topic ─────────────────────────────────────────────────► Blog        │
│  └── Service Relationship ─────────────────────────────────► Blog        │
│                                                                             │
│  ENTITY RELATIONSHIPS (not taxonomy)                                       │
│  └── Location ─────────────────────────────────────────────► Blog (opt)   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. WORDPRESS NATIVE TAXONOMIES

### 2.1 Category (hierarchical)

**Current State:** 17 categories with overlapping purposes

**Proposed State:** Simplified editorial classification

```yaml
CATEGORY: Tips & Insight
├── Description: General automotive care tips
├── Scope: "Tips merawat mobil", "Cara menjaga cat"
├── Content: Educational articles
└── Count: ~37 posts (will reduce after merge)

CATEGORY: Auto Detailing
├── Description: Auto detailing topics
├── Scope: "Apa itu detailing", "Manfaat detailing"
├── Content: Service explanation articles
└── Count: ~9 posts
```

**Final Category List:**

| Category | Slug | Description | Merge From |
|----------|------|-------------|-----------|
| Tips & Insight | tips-insight | General automotive care tips | - |
| Auto Detailing | auto-detailing | Detailing service topics | Bengkel Detailing |
| Coating | coating | Ceramic coating topics | Coating Mobil, Nano Ceramic Coating |
| Paint Protection Film | ppf | PPF topics | Paint Protection Film |
| Rust Protection | rust-protection | Anti karat topics | - |
| Engine Detailing | engine-detailing | Engine care topics | Engine Detailing, Interior Detailing, Eksterior Detailing |
| Car Wash | car-wash | Wash topics | Car Wash, Glass Cleaning |
| Salon Mobil | salon-mobil | Salon/location topics | Salon Mobil Jakarta |
| Mudik & Seasonal | mudik-seasonal | Seasonal content | Mudik Lebaran |
| Uncategorized | - | NO USE - all posts must have category | - |

**Migration Actions:**
| Old Category | New Category | Action |
|-------------|--------------|--------|
| Tips & Insight | Tips & Insight | KEEP |
| Bengkel Detailing | Auto Detailing | MERGE |
| Salon Mobil Jakarta | Salon Mobil | RENAME |
| Coating Mobil | Coating | MERGE |
| Nano Ceramic Coating | Coating | MERGE |
| Paint Protection Film | Paint Protection Film | KEEP |
| Rust Protection | Rust Protection | KEEP |
| Engine Detailing | Engine Detailing | KEEP |
| Interior Detailing | Engine Detailing | MERGE |
| Eksterior Detailing | Engine Detailing | MERGE |
| Car Wash | Car Wash | KEEP |
| Glass Cleaning | Car Wash | MERGE |
| Mudik Lebaran | Mudik & Seasonal | RENAME |
| Uncategorized | - | NOINDEX all remaining |
| Experience | Tips & Insight | MERGE |
| Autospa Pluit | Location tag | REMOVE from category |

---

### 2.2 Post Tag (flat)

**Current State:** 70+ tags with variations

**Proposed State:** Controlled vocabulary

**Retained Tags:**
- Generic service terms: `detailing`, `coating`, `ppf`, `ceramic`
- Common intent: `tips`, `harga`, `review`
- Geographic: `jakarta`, `jabodetabek`

**Removed Tags:**
- Duplicate location terms (handled by relationship)
- Long-tail keywords (handled by content)
- Variations of same term

**Tag Limit:** Maximum 5 tags per post

---

## 3. CUSTOM SEMANTIC TAXONOMIES

### 3.1 Topic

**Purpose:** Semantic classification independent of editorial categories

```yaml
Topic: Ceramic Coating
├── Description: Nano ceramic coating technology and application
├── Articles: "Apa itu Ceramic Coating", "Benefits of Ceramic"
└── Distinct from: PPF, Detailing

Topic: Paint Protection Film
├── Description: PPF technology and application
├── Articles: "Apa itu PPF", "PPF vs Ceramic"
└── Distinct from: Ceramic Coating

Topic: Car Detailing
├── Description: Professional car cleaning and restoration
├── Articles: "Apa itu Detailing", "Interior vs Exterior"
└── Distinct from: Car Wash

Topic: Car Wash
├── Description: Basic to premium washing
├── Articles: "Premium Wash vs Cuci Biasa"
└── Distinct from: Detailing
```

**Final Topic List:**

| Topic | Description | Service Link |
|-------|-------------|--------------|
| Ceramic Coating | Nano ceramic technology | Nano Ceramic Coating |
| Paint Protection Film | PPF technology | PPF |
| Car Detailing | Professional cleaning/restoration | Premium Detailing |
| Car Wash | Washing services | Premium Wash |
| Rust Protection | Anti corrosion | Rust Protection |
| Engine Care | Engine cleaning/maintenance | - |
| Interior Care | Interior cleaning | - |
| Exterior Care | Exterior cleaning | - |
| Car Maintenance | General maintenance | - |

**Why Topic ≠ Category:**
- Topic can grow without cluttering categories
- One post can conceptually relate to multiple topics
- Category is editorial; Topic is semantic

---

## 4. RELATIONSHIP FIELDS

### 4.1 Blog Post Relationships

```yaml
relationships:
  topic: "Ceramic Coating"     # Single topic assignment
  
  service: ServiceReference    # Primary service relationship
  # "Apa itu Ceramic Coating" → Service: Ceramic Coating
  
  location: LocationReference  # Primary location relationship (optional)
  # "Auto Detailing Pluit" → Location: Pluit
  # "Tips Umum" → No location
```

**Rules:**
1. One `topic` per post (semantic classification)
2. One `service` relationship per post (optional but recommended)
3. One `location` relationship per post (optional)

---

### 4.2 Relationship Decision Tree

```
POST CONTENT ANALYSIS
│
├── Does article explain a specific service?
│   └── YES → Link to Service
│   └── NO ↓
│
├── Does article focus on a specific location?
│   └── YES → Link to Location
│   └── NO ↓
│
└── General educational content
    └── No forced relationship
```

**Examples:**

| Post Title | Topic | Service | Location | Notes |
|------------|-------|---------|----------|-------|
| "Apa itu Ceramic Coating" | Ceramic Coating | ✅ Ceramic | ❌ | Explains service |
| "Tips Menjaga Cat Mobil" | Ceramic Coating | ⚠️ Optional | ❌ | General tips |
| "Auto Detailing Pluit" | Car Detailing | ✅ Detailing | ✅ Pluit | Location focus |
| "Cara Cuci Mobil" | Car Wash | ⚠️ Optional | ❌ | General how-to |

---

## 5. GEO TAXONOMY

### 5.1 Location as GEO Classifier

Locations are NOT taxonomy - they are entities with relationships.

```
Location Entity
    │
    ├── name: "AutoSPA Pluit"
    ├── serviceAreas[]: ["Pluit", "Penjaringan", "PIK", "Jakarta Utara"]
    │
    └── blogPosts[]: [Posts mentioning Pluit area]

NOT:
Location Taxonomy
    ├── Jakarta
    ├── Jakarta Utara
    ├── Pluit
    └── Penjaringan
```

**Why this distinction matters:**
- Avoids hierarchical location taxonomy that becomes unwieldy
- Service areas are operational data, not SEO fodder
- GEO targeting uses Location entity + schema

---

### 5.2 Location Entity List

| Location | Slug | Status | Primary Service Areas |
|----------|------|--------|---------------------|
| AutoSPA Pluit | pluit | ✅ Verified | Pluit, Penjaringan, PIK, Jakarta Utara |
| AutoSPA PIK 2 | pik-2 | ⚠️ Verify | PIK, Kamal, Pantai Indah Kapuk |
| AutoSPA Depok 2 | depok | ⚠️ Verify | Depok |
| AutoSPA Express Depok | express-depok | ⚠️ Verify | Depok (Express concept) |
| AutoSPA Bekasi | bekasi | ⚠️ Verify | Bekasi |
| AutoSPA Kranji | kranji | ⚠️ Verify | Kranji, Bekasi |
| AutoSPA Tangerang | tangerang | ⚠️ Verify | Tangerang |
| AutoSPA Bogor | bogor | ⚠️ Verify | Bogor |
| AutoSPA Serpong | serpong | ❌ Unverified | - |
| AutoSPA Cikupa | cikupa | ❌ Unverified | - |

---

## 6. SERVICE TAXONOMY

### 6.1 Service List

Based on Phase 2A-B extraction:

| Service | Slug | Category | Packages | Status |
|---------|------|----------|----------|--------|
| Nano Ceramic Coating | nano-ceramic-coating | coating | 6 tiers | ✅ Ready |
| 360° PPF | paint-protection-film | protection | 3 tiers | ✅ Ready |
| Premium Detailing | premium-detailing | detailing | 3 variants | ⚠️ Enrich |
| Premium Wash | premium-wash | wash | 3 variants | ⚠️ Enrich |
| Rust Protection | rust-protection | protection | TBD | ❌ Needs content |
| Engine Detailing | engine-detailing | detailing | TBD | ❌ Needs content |

**Future Services:**
- Interior Detailing (merge into Detailing)
- Glass Treatment (merge into Detailing)

---

## 7. CATEGORY MAPPING REFERENCE

### 7.1 Current → Proposed

| Current Category | Proposed Category | Action | Posts |
|-----------------|------------------|--------|-------|
| Tips & Insight | Tips & Insight | KEEP | ~37 |
| Bengkel Detailing | Auto Detailing | MERGE | ~23 |
| Salon Mobil Jakarta | Salon Mobil | RENAME | ~19 |
| Coating Mobil | Coating | MERGE | ~18 |
| Paint Protection Film | Paint Protection Film | KEEP | ~16 |
| Rust Protection | Rust Protection | KEEP | ~15 |
| Engine Detailing | Engine Detailing | KEEP | ~9 |
| Auto Detailing | Auto Detailing | MERGE | ~9 |
| Mudik Lebaran | Mudik & Seasonal | RENAME | ~9 |
| Interior Detailing | Engine Detailing | MERGE | ~2 |
| Eksterior Detailing | Engine Detailing | MERGE | ~3 |
| Car Wash | Car Wash | KEEP | ~2 |
| Glass Cleanning | Car Wash | MERGE | ~2 |
| Nano Ceramic Coating | Coating | MERGE | ~4 |
| Uncategorized | - | NOINDEX | ~7 |
| Experience | Tips & Insight | MERGE | ~3 |
| Autospa Pluit | REMOVE | REMOVE | ~25 |

---

## 8. URL PRESERVATION CONSTRAINTS

Per Phase 1A URL Mapping:

| Old URL | New URL | Status |
|---------|---------|--------|
| `/our-services/` | `/services/` | 301 redirect |
| `/blog-standard/` | `/blog/` | 301 redirect |
| `/news-insight/` | `/blog/` | 301 redirect |

**Blog post URLs:** PRESERVE all existing URLs
- 301 redirects only for MERGE destinations
- Never change URL just because content model changed

---

## 9. TAXONOMY QUICK REFERENCE

### WordPress Native

| Taxonomy | Type | Usage |
|----------|------|-------|
| Category | Hierarchical | Editorial classification (9 categories) |
| Tag | Flat | Generic keywords (max 5 per post) |

### Custom Fields

| Field | Type | Usage |
|-------|------|-------|
| topic | String | Semantic classification |
| service | Entity Reference | Primary service link |
| location | Entity Reference | Primary location link |

### Entity Relationships

| Entity | Can Relate To |
|--------|---------------|
| Blog Post | Category, Tag, Topic, Service, Location |

---

**Document Status:** FINAL - Taxonomy Locked
**Last Updated:** 2026-08-18
**Next:** Phase 2C - ACF + WPGraphQL Specification
