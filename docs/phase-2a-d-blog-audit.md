# PHASE 2A-D: BLOG AUDIT - 174 POSTS
## AutoSP AJakarta - Headless WordPress Project

**Project:** Headless WordPress → Next.js for SEO/GEO Rebuild
**Date:** 2026-08-18
**Status:** IN PROGRESS - Awaiting CSV completion

---

## 1. AUDIT OVERVIEW

### 1.1 Scope

| Metric | Value |
|--------|-------|
| Total Posts | 174 |
| Date Range | 2024-08-31 to 2026-05-26 |
| Categories | 17 |
| Batch 1 (Deep Audit) | 50 posts |
| Batch 2-4 (Classification) | 124 posts |

### 1.2 Audit Fields

Each post is audited across these dimensions:

| Field | Purpose |
|-------|---------|
| Existing URL | URL preservation |
| Title | Content inventory |
| Category | Taxonomy mapping |
| Published Date | Freshness signal |
| Modified Date | Content recency |
| Word Count | Quality indicator |
| SEO Title | Title tag preservation |
| Meta Description | Meta desc preservation |
| Focus Keyword | Existing SEO intent |
| Primary Topic | Semantic classification |
| Related Service | Entity relationship |
| Related Location | GEO relationship |
| Search Intent | Content strategy |
| Content Quality | Quality assessment |
| Internal Link Potential | Architecture opportunity |
| Action | Migration decision |
| Priority | Implementation priority |

---

## 2. CLASSIFICATION METHODOLOGY

### 2.1 Action Categories

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ACTION CLASSIFICATION                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  🟢 KEEP                                                           │
│  ├── Content still relevant and valuable                            │
│  ├── Good quality (word count > 800, SEO score > 40)              │
│  └── Requires: Update SEO metadata, add internal links               │
│                                                                     │
│  🟡 UPDATE                                                         │
│  ├── Good topic but needs improvement                              │
│  ├── Requires: Factual updates, better structure                   │
│  ├── Add: Internal links, service relationship, FAQ                 │
│  └── Consider: New schema markup                                   │
│                                                                     │
│  🟠 MERGE                                                          │
│  ├── Two or more articles with similar search intent                │
│  ├── Keep best-performing, redirect others to it                    │
│  └── Requires: Content consolidation, 301 redirects                 │
│                                                                     │
│  🔴 REDIRECT                                                       │
│  ├── URL has history/authority but content not needed               │
│  ├── Redirect to relevant service/category page                      │
│  └── Requires: 301 redirect mapping                                 │
│                                                                     │
│  ⚫ NOINDEX / ARCHIVE                                               │
│  ├── No organic search value                                        │
│  ├── Thin content, duplicates, or outdated                         │
│  └── Options: Noindex, remove from sitemap, or delete              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Decision Tree

```
ARTICLE ANALYSIS
│
├── Is content still relevant?
│   └── NO → NOINDEX / DELETE
│   └── YES ↓
│
├── Is content high quality?
│   │   (Word count > 800, SEO score > 40, unique topic)
│   └── NO → UPDATE (improve) or MERGE
│   └── YES ↓
│
├── Is content unique (no duplicate topics)?
│   └── NO → MERGE (combine with similar)
│   └── YES ↓
│
├── Is URL valuable (traffic, links, rankings)?
│   │   (Check Search Console data if available)
│   └── YES → KEEP or UPDATE + ADD INTERNAL LINKS
│   └── NO ↓
│
└── Can URL be redirected to relevant destination?
    └── YES → REDIRECT
    └── NO → NOINDEX
```

### 2.3 Service Classification

Articles are classified by primary topic:

| Service | Keywords | Content Examples |
|---------|----------|------------------|
| Nano Ceramic Coating | ceramic, nano, coating | "Apa itu ceramic coating", "Harga ceramic coating" |
| PPF | ppf, paint protection film, film pelindung | "PPF vs Coating", "Benefits of PPF" |
| Premium Detailing | detailing, eksterior, interior | "Apa itu detailing", "Interior vs Exterior" |
| Premium Wash | wash, cuci, premium wash | "Premium Wash vs Cuci Biasa" |
| Rust Protection | karat, anti karat, rust | "Cara cegah karat", "Anti karat mobil" |
| Engine Detailing | engine, mesin | "Engine cleaning", "Tips mesin bersih" |
| General | tips, perawatan, dll | "Tips merawat mobil", allgemein |

### 2.4 Location Classification

Articles are geo-tagged by location mentioned:

| Location | Keywords | Notes |
|----------|----------|-------|
| Pluit | pluit | Original branch, most mentioned |
| Jakarta | jakarta (general) | If no specific area |
| Jakarta Utara | jakarta utara, شمال جاكارتا | |
| Jakarta Selatan | jakarta selatan, جنوب جاكارتا | |
| Depok | depok | |
| Tangerang | tangerang | |
| Bekasi | bekasi, krangi | |
| Bogor | bogor | |
| Jabodetabek | jabodetabek | Broad coverage |

---

## 3. SEARCH INTENT CLASSIFICATION

### 3.1 Intent Types

| Intent | Indicators | Example Queries |
|--------|------------|----------------|
| **Informational** | "apa", "kenapa", "bagaimana", "cara", "tips" | "Apa itu ceramic coating?" |
| **Commercial Investigation** | "vs", "perbedaan", "mana lebih baik" | "PPF vs Ceramic, mana lebih baik?" |
| **Transactional** | "harga", "biaya", "booking" | "Harga coating mobil Jakarta" |
| **Local** | Location + service | "Auto detailing Tangerang" |
| **Brand** | "autospa" | "AutoSPA Pluit reviews" |

### 3.2 Content Strategy by Intent

```
INFORMATIONAL
    │
    ├── Links to → SERVICE PAGE (education → conversion)
    ├── Links to → FAQ
    └── Internal links to → RELATED ARTICLES

COMMERCIAL INVESTIGATION
    │
    ├── Links to → SERVICE PAGE (comparison → decision)
    ├── Links to → PRICING
    └── CTA → BOOKING

TRANSACTIONAL
    │
    ├── Primary CTA → BOOKING / WHATSAPP
    └── Secondary → SERVICE PAGE

LOCAL
    │
    ├── Links to → LOCATION PAGE
    ├── Service + Location context
    └── CTA → BOOKING AT LOCATION
```

---

## 4. KNOWLEDGE ARCHITECTURE INTEGRATION

### 4.1 Content Hub Model

```
                    BLOG ARTICLE
                         │
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             ▼             ▼
    SERVICE ←→    FAQ ←→      LOCATION
         │             │             │
         │             │             │
         ▼             ▼             ▼
    ┌─────────────────────────────────┐
    │         SERVICE ENTITY           │
    │  ├── Packages                  │
    │  ├── Process                   │
    │  ├── Benefits                  │
    │  └── Related Articles          │
    └─────────────────────────────────┘
```

### 4.2 Internal Linking Strategy

Each article should link to:

| From Article Type | Link To |
|------------------|--------|
| "What is X" article | Service page |
| "How to" article | Service page + FAQ |
| "Comparison" article | Service page (both) |
| "Tips" article | Related service |
| "Location" article | Location page + Service |
| "Pricing" article | Service page + Packages |

### 4.3 Semantic Relationships

```
EDUCATIONAL CONTENT (Blog)
    │
    ├── Explains concept
    │   └── "Apa itu Nano Ceramic Coating?"
    │       └── links to → /services/nano-ceramic-coating/
    │
    ├── Solves problem
    │   └── "Cara Mengatasi Cat Mobil Kusam"
    │       └── links to → Service + FAQ
    │
    ├── Provides comparison
    │   └── "PPF vs Ceramic Coating"
    │       └── links to → Both service pages
    │
    └── Location-based
        └── "Auto Detailing Tangerang"
            └── links to → /locations/tangerang/ + Service
```

---

## 5. CONTENT QUALITY FRAMEWORK

### 5.1 Quality Indicators

| Factor | High Quality | Medium Quality | Low Quality |
|--------|-------------|---------------|-------------|
| Word Count | >1500 | 500-1500 | <500 |
| SEO Score | >60 | 30-60 | <30 |
| Focus Keyword | Set | Partial | None |
| Meta Description | Set + compelling | Partial | Missing |
| Internal Links | 3+ | 1-2 | 0 |
| External Links | 0-2 | 3-5 | 5+ |
| Images | 3+ with alt | 1-2 | 0 |
| Headings | H1 + H2 + H3 | H1 + H2 | H1 only |

### 5.2 Quality Distribution (Estimated)

```
174 POSTS
│
├── High Quality (30%)     ~52 posts
│   └── KEEP as-is, optimize internal links
│
├── Medium Quality (45%)  ~78 posts
│   └── UPDATE: improve structure, add links
│
└── Low Quality (25%)     ~44 posts
    └── MERGE/NOINDEX/REDIRECT
```

---

## 6. SEO PRESERVATION STRATEGY

### 6.1 Data to Preserve from Rank Math

| Data | Action |
|------|--------|
| Focus Keyword | Preserve as reference, validate relevance |
| Meta Title | Review, may need update for new structure |
| Meta Description | Preserve if still compelling |
| SEO Score | Use as quality baseline, not target |
| Primary Category | Map to new taxonomy |
| Robots Settings | Preserve noindex directives |

### 6.2 URL Preservation Rules

```
URL DECISIONS
│
├── URL has traffic AND good rankings
│   └── Keep URL, 301 only if merging
│
├── URL has backlinks
│   └── Always redirect (never delete)
│
├── URL has neither traffic nor links
│   └── Evaluate: Keep, redirect, or delete
│
└── Duplicate content
    └── 301 redirect to canonical URL
```

---

## 7. AUDIT BATCHES

### 7.1 Batch 1: Deep Audit (50 posts)

**Purpose:** Establish classification rules and taxonomy

**Posts:** First 50 by ID

**Deliverable:** Classification rules + sample classifications

### 7.2 Batch 2-4: Applied Classification (124 posts)

**Purpose:** Apply rules consistently across all posts

**Method:** Use Batch 1 rules, document edge cases

---

## 8. EXPECTED OUTCOMES

### 8.1 Classification Distribution (Estimated)

```
174 POSTS
│
├── 🟢 KEEP       XX  (High quality, unique topics)
├── 🟡 UPDATE     XX  (Good topics, need improvement)
├── 🟠 MERGE      XX  (Similar topics, consolidate)
├── 🔴 REDIRECT   XX  (Keep URL, redirect elsewhere)
└── ⚫ NOINDEX    XX  (Thin content, low value)
```

### 8.2 Service Distribution (Estimated)

```
174 POSTS BY SERVICE
│
├── Nano Ceramic Coating   ~45 posts (26%)
├── PPF                   ~25 posts (14%)
├── Premium Detailing     ~30 posts (17%)
├── Premium Wash          ~10 posts (6%)
├── Rust Protection       ~15 posts (9%)
├── Engine Detailing      ~10 posts (6%)
├── General/Tips          ~39 posts (22%)
```

### 8.3 GEO Distribution (Estimated)

```
174 POSTS BY LOCATION
│
├── Pluit                 ~25 posts (14%)
├── Jakarta (general)     ~50 posts (29%)
├── Other locations        ~20 posts (11%)
└── No specific location  ~79 posts (45%)
```

---

## 9. DELIVERABLES

### 9.1 Files Produced

| File | Location | Description |
|------|----------|-------------|
| blog-audit-174.csv | data/ | Master audit data |
| phase-2a-d-blog-audit.md | docs/ | This document |

### 9.2 CSV Fields

```csv
id,existing_url,title,category,published_date,modified_date,word_count,seo_title,meta_description,focus_keyword,seo_score,primary_topic,search_intent,content_quality,related_service,related_location,internal_link_opportunity,action,priority,notes
```

---

## 10. NEXT STEPS

### 10.1 Immediate

1. **Complete CSV generation** (Batch 1-4)
2. **Review Batch 1 classifications** (50 posts)
3. **Validate rules** against actual content
4. **Adjust classifications** based on review

### 10.2 After Audit Complete

1. **Export to operational tool** (Google Sheets)
2. **Prioritize by action + priority**
3. **Plan content updates** (UPDATE group)
4. **Plan redirects** (MERGE/REDIRECT group)
5. **Coordinate with Location verification**

### 10.3 Migration Execution

```
AFTER PHASE 2A-D COMPLETE
│
├── Phase 2B: Final Content Model
│   └── Lock entity definitions
│
├── Phase 2C: WPGraphQL Specification
│   └── Define GraphQL schema
│
└── Phase 2D: ACF Fields
    └── Create fields based on content model
```

---

## APPENDIX A: CATEGORY MAPPING

| Old Category | New Taxonomy | Action |
|-------------|--------------|--------|
| Tips & Insight | Blog Category | KEEP, may rename to "Tips" |
| Autospa Pluit | Location | SPLIT - keep as location tag |
| Bengkel Detailing | Blog Category | MERGE with "Detailing" |
| Salon Mobil Jakarta | Blog Category | KEEP as "Salon Mobil" |
| Coating Mobil | Service Link | MERGE with "Ceramic Coating" |
| Paint Protection Film | Service Link | KEEP as "PPF" |
| Rust Protection | Service Link | KEEP as "Rust Protection" |
| Mudik Lebaran | Blog Category | KEEP (seasonal, time-sensitive) |
| Auto Detailing | Blog Category | MERGE with "Detailing" |
| Engine Detailing | Service Link | KEEP as "Engine Detailing" |
| Eksterior Detailing | Service Link | KEEP as "Detailing" |
| Interior Detailing | Service Link | KEEP as "Detailing" |
| Nano Ceramic Coating | Service Link | MERGE with "Ceramic Coating" |
| Uncategorized | - | NOINDEX all |
| Experience | - | MERGE with relevant categories |
| Car Wash | Service Link | MERGE with "Premium Wash" |
| Glass Cleaning | Service Link | MERGE with "Detailing" |

---

## APPENDIX B: DUPLICATE TOPICS IDENTIFIED

| Topic | URL Count | Action |
|-------|-----------|--------|
| "Apa itu ceramic coating" | 1+ | KEEP best, redirect others |
| "PPF vs Coating" | 2+ | KEEP best, redirect others |
| "Auto Detailing Jakarta" | 5+ | MERGE into hub |
| "Salon Mobil Pluit" | 3+ | MERGE into location hub |
| "Tips Cuci Mobil" | 2+ | KEEP one, redirect others |
| "Harga Coating" | 3+ | KEEP comprehensive, redirect thin |

---

**Document Status:** IN PROGRESS - CSV generation pending
**Last Updated:** 2026-08-18
**Next Action:** Complete CSV, review Batch 1 classifications
