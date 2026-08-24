# Phase 2D.6: WPGraphQL + ACF Exposure

**Date:** 2026-08-20 (Pending)
**Status:** PLANNED
**Precondition:** Phase 2D.5 completed, test data (IDs 6994-7005) ready

---

## Objective

Integrate ACF fields with WPGraphQL by installing and configuring `wp-graphql-acf` plugin, then systematically verify every field group, field type, and relationship against the canonical test dataset.

**Critical Principle:** Do NOT modify ACF schema just because GraphQL doesn't expose fields. First diagnose the root cause level.

---

## ⚠️ CRITICAL: GraphQL Field Mapping is the Contract

**The ACF to GraphQL field name mapping is the CONTRACT between WordPress and Next.js Repository.**

This mapping will be used by Next.js developers to:
- Write GraphQL queries
- Define TypeScript types
- Build repositories

**DO NOT assume field names. Document actual names from GraphQL introspection.**

Example:
```
ACF: short_description → GraphQL: shortDescription (MUST verify)
ACF: vehicle_sizes → GraphQL: ? (unknown until verified)
```

---

## Installation & Configuration Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. INSTALL PLUGIN                                          │
│    ssh + WP-CLI: plugin install wp-graphql-acf --activate  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. VERIFY COMPATIBILITY                                     │
│    - WPGraphQL version compatibility                        │
│    - PHP compatibility (8.2)                                │
│    - Plugin appears in WP Admin                             │
│    - Plugin activated without errors                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. ENABLE "SHOW IN GRAPHQL"                                │
│    WP Admin → ACF → each field group → Settings            │
│    ☑ Show in GraphQL (checkbox)                            │
│                                                             │
│    Required groups:                                         │
│    [ ] group_service_hero                                  │
│    [ ] group_service_content                               │
│    [ ] group_service_packages                               │
│    [ ] group_service_media                                 │
│    [ ] group_service_relationships                         │
│    [ ] group_service_seo                                   │
│    [ ] group_location_identity                             │
│    [ ] group_location_address                              │
│    [ ] group_location_geo                                  │
│    [ ] group_location_business                             │
│    [ ] group_location_content                              │
│    [ ] group_location_relationships                        │
│    [ ] group_location_gallery                              │
│    [ ] group_project_content                               │
│    [ ] group_project_media                                 │
│    [ ] group_project_relationships                         │
│    [ ] group_faq_content                                   │
│    [ ] group_faq_context                                   │
│    [ ] group_testimonial_content                           │
│    [ ] group_testimonial_media                             │
│    [ ] group_testimonial_context                           │
│    [ ] group_post_content                                  │
│    [ ] group_post_relationships                           │
│    [ ] group_site_config                                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. CLEAR GRAPHQL SCHEMA CACHE                              │
│    WP Admin → GraphQL → Settings → Clear Schema Cache      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. VERIFY FIELD GROUPS EXPOSURE                            │
│    Introspection query to list all types                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. VERIFY FIELD TYPES                                      │
│    For each field: verify name, type, and structure        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. VERIFY RELATIONSHIPS                                    │
│    Test each bidirectional relationship                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. RUN GRAPHQL QUERIES                                     │
│    Compare against database values                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
                              ✅ PASS or ❌ BLOCK
```

---

## Root Cause Diagnosis Levels

**When ACF field doesn't appear in GraphQL:**

```
LEVEL 1: Plugin Missing
    ├── wp-graphql-acf not installed
    └── wp-graphql-acf not activated

LEVEL 2: Configuration
    ├── "Show in GraphQL" not checked on field group
    ├── Field group not assigned to correct post type
    └── Field group inactive/deleted

LEVEL 3: GraphQL Exposure
    ├── Individual field "Show in GraphQL" disabled
    └── Field hidden by conditional logic

LEVEL 4: Field Type Support
    ├── repeater → may need special handling
    ├── flexible_content → may need special handling
    └── gallery → may need special handling

LEVEL 5: Naming
    ├── GraphQL name may differ from ACF name
    └── snake_case → camelCase conversion rules

LEVEL 6: Relationship Configuration
    ├── relationship field not properly configured
    ├── bidirectional not set up
    └── post_type filter not matching
```

**DO NOT skip levels.** Check in order: 1 → 2 → 3 → 4 → 5 → 6

---

## Field Verification Matrix (24 Field Groups)

### Format

```
ACF Field Group
├── Field Name (ACF)
├── Field Type (ACF)
├── GraphQL Field Name
├── GraphQL Type
└── Status: ✅/❌/⚠️
```

### Service CPT (6 Groups)

#### group_service_hero
```
hero_image        → ? (image type)
hero_title        → ? (text)
hero_description  → ? (textarea)
```

#### group_service_content
```
short_description → ? (textarea)
description       → ? (wysiwyg)
benefits          → ? (repeater)
  ├── benefit_title
  └── benefit_description
process           → ? (repeater)
  ├── step_number
  ├── step_title
  ├── step_description
  └── step_image
technology        → ? (repeater)
  └── technology_name
```

#### group_service_packages
```
packages          → ? (repeater)
  ├── package_name
  ├── package_tier
  ├── package_description
  ├── package_recommended
  ├── vehicle_sizes (nested repeater)
  │   ├── size_label
  │   └── price
  ├── package_features
  ├── package_durability
  ├── package_maintenance
  └── package_workmanship
```

#### group_service_media
```
gallery           → ? (repeater)
  ├── gallery_image
  ├── gallery_caption
  └── gallery_type
```

#### group_service_relationships
```
related_locations  → ? (relationship)
related_projects   → ? (relationship)
related_faqs       → ? (relationship)
related_services   → ? (relationship)
service_category   → ? (select)
```

#### group_service_seo
```
seo_title         → ? (text)
seo_description   → ? (textarea)
seo_canonical     → ? (url)
seo_robots        → ? (checkbox)
seo_focus_keyword → ? (text)
seo_og_image      → ? (image)
```

### Location CPT (7 Groups)

#### group_location_identity
```
location_status   → ?
location_phone    → ?
location_whatsapp → ?
location_email    → ?
```

#### group_location_address
```
address_street    → ?
address_district  → ?
address_city      → ?
address_province  → ?
address_postal_code → ?
address_country   → ?
```

#### group_location_geo
```
geo_latitude      → ? (number)
geo_longitude     → ? (number)
google_maps_url   → ? (url)
google_place_id   → ? (text)
```

#### group_location_business
```
opening_hours     → ? (repeater)
  ├── day_name
  ├── is_closed
  ├── open_time
  └── close_time
```

#### group_location_content
```
location_tagline      → ?
location_description   → ? (wysiwyg)
location_highlights    → ? (repeater)
  └── highlight
location_facilities    → ? (repeater)
  └── facility
service_areas          → ? (repeater)
  └── area_name
```

#### group_location_relationships
```
location_services      → ? (relationship)
location_google_business_url → ? (url)
location_testimonials  → ? (relationship)
location_faqs         → ? (relationship)
```

#### group_location_gallery
```
location_gallery       → ? (repeater)
  ├── location_gallery_image
  ├── location_gallery_caption
  └── location_gallery_type
```

### Project CPT (3 Groups)

#### group_project_content
```
vehicle_brand      → ?
vehicle_model      → ?
vehicle_year       → ?
vehicle_color      → ?
project_challenge  → ? (textarea)
project_solution   → ? (textarea)
project_result     → ? (textarea)
```

#### group_project_media
```
before_images      → ? (gallery)
process_images     → ? (gallery)
after_images       → ? (gallery)
project_gallery    → ? (gallery)
```

#### group_project_relationships
```
project_service    → ? (relationship, required)
project_location   → ? (relationship)
completed_at      → ? (date_picker)
```

### FAQ CPT (2 Groups)

#### group_faq_content
```
faq_question       → ?
faq_answer         → ? (wysiwyg)
faq_order          → ? (number)
faq_featured       → ? (true_false)
```

#### group_faq_context
```
faq_service       → ? (relationship)
faq_location      → ? (relationship)
faq_category      → ? (select)
```

### Testimonial CPT (3 Groups)

#### group_testimonial_content
```
customer_name      → ?
customer_role      → ?
customer_company   → ?
customer_quote     → ? (textarea)
customer_vehicle   → ?
```

#### group_testimonial_media
```
customer_photo     → ? (image)
video_url          → ? (url)
```

#### group_testimonial_context
```
testimonial_service     → ? (relationship)
testimonial_location    → ? (relationship)
testimonial_source      → ? (select)
testimonial_source_url  → ? (url)
testimonial_featured    → ? (true_false)
```

### Post CPT (2 Groups)

#### group_post_content
```
topic              → ? (text)
migration_status   → ? (select)
```

#### group_post_relationships
```
related_service    → ? (relationship)
related_location   → ? (relationship)
```

### Options Page (1 Group)

#### group_site_config
```
org_name, org_phone, social_*, default_seo_* → ?
```

---

## Relationship Cardinality Verification

**Canonical Test Dataset:**

| Post Type | ID | Title |
|-----------|-----|-------|
| Service | 6994 | Nano Ceramic Coating |
| Service | 6995 | Paint Protection Film |
| Service | 6996 | Auto Detailing Premium |
| Location | 6997 | AutoSP Pluit |
| Location | 6998 | AutoSP PIK 2 |
| Project | 6999 | Toyota Alphard Ceramic |
| Project | 7000 | Honda Civic PPF |
| FAQ | 7001 | Berapa Harga Ceramic Coating? |
| FAQ | 7002 | Berapa Lama Proses Coating? |
| FAQ | 7003 | Apakah Ada Garansi? |
| Testimonial | 7004 | John Doe |
| Testimonial | 7005 | Jane Smith |

### Expected Relationships (from database)

```
SERVICE 6994 (Nano Ceramic Coating)
├── related_locations: [6997, 6998]     → M:N
├── related_projects: [6999]           → M:N
├── related_faqs: [7001, 7002, 7003]   → M:N
├── related_services: [6994, 6995]     → M:N (self + sibling)
└── service_category: "coating"

SERVICE 6995 (Paint Protection Film)
├── related_locations: [6998]
├── related_projects: [7000]
├── related_faqs: [7003]
├── related_services: [6994]
└── service_category: "protection"

SERVICE 6996 (Auto Detailing Premium)
├── related_locations: [6997]
├── related_projects: []
├── related_faqs: []
├── related_services: []
└── service_category: "detailing"

LOCATION 6997 (AutoSP Pluit)
├── location_services: [6994, 6996]     ← Should match Service 6994, 6996's related_locations
├── location_testimonials: [7004]      ← Should match Testimonial 7004's testimonial_location
└── location_faqs: [7001, 7002]         ← Should match FAQ 7001, 7002's faq_location

LOCATION 6998 (AutoSP PIK 2)
├── location_services: [6994, 6995]    ← Should match Service 6994, 6995's related_locations
├── location_testimonials: [7005]      ← Should match Testimonial 7005's testimonial_location
└── location_faqs: [7003]               ← Should match FAQ 7003's faq_location

PROJECT 6999 (Toyota Alphard Ceramic)
├── project_service: 6994               ← Should match Service 6994's related_projects
└── project_location: (empty)

PROJECT 7000 (Honda Civic PPF)
├── project_service: 6995               ← Should match Service 6995's related_projects
└── project_location: (empty)

FAQ 7001 (Berapa Harga Ceramic Coating?)
├── faq_service: 6994                   ← Should match Service 6994's related_faqs
└── faq_location: 6997                 ← Should match Location 6997's location_faqs

FAQ 7002 (Berapa Lama Proses Coating?)
├── faq_service: 6994
└── faq_location: 6997

FAQ 7003 (Apakah Ada Garansi?)
├── faq_service: 6994, 6995             ← M:N
└── faq_location: 6998

TESTIMONIAL 7004 (John Doe)
├── testimonial_service: 6994           ← Should match Service 6994
└── testimonial_location: 6997          ← Should match Location 6997

TESTIMONIAL 7005 (Jane Smith)
├── testimonial_service: 6995           ← Should match Service 6995
└── testimonial_location: 6998           ← Should match Location 6998
```

---

## Test Queries

### Query 1: Service with all related entities

```graphql
query {
  service(id: "6994", idType: DATABASE_ID) {
    databaseId
    title

    # Scalars
    shortDescription
    serviceCategory

    # Repeaters
    benefits {
      benefitTitle
      benefitDescription
    }
    process {
      stepNumber
      stepTitle
      stepDescription
    }
    packages {
      packageName
      packageTier
      vehicleSizes {
        sizeLabel
        price
      }
    }

    # Relationships (M:N)
    relatedLocations {
      nodes {
        databaseId
        title
      }
    }
    relatedProjects {
      nodes {
        databaseId
        title
      }
    }
    relatedFaqs {
      nodes {
        databaseId
        faqQuestion
      }
    }
    relatedServices {
      nodes {
        databaseId
        title
      }
    }
  }
}
```

### Query 2: Location with services

```graphql
query {
  location(id: "6997", idType: DATABASE_ID) {
    databaseId
    title
    addressCity

    # Relationships
    locationServices {
      nodes {
        databaseId
        title
      }
    }
    locationTestimonials {
      nodes {
        databaseId
        customerName
      }
    }
    locationFaqs {
      nodes {
        databaseId
        faqQuestion
      }
    }
  }
}
```

### Query 3: Project with service and location

```graphql
query {
  project(id: "6999", idType: DATABASE_ID) {
    databaseId
    title
    vehicleBrand
    vehicleModel

    projectService {
      databaseId
      title
    }
    projectLocation {
      databaseId
      title
    }
  }
}
```

### Query 4: FAQ with contextual relationships

```graphql
query {
  faq(id: "7001", idType: DATABASE_ID) {
    databaseId
    faqQuestion
    faqCategory

    faqService {
      databaseId
      title
    }
    faqLocation {
      databaseId
      title
    }
  }
}
```

### Query 5: Bidirectional verification

```graphql
query {
  # Start from Service
  service(id: "6994", idType: DATABASE_ID) {
    title
    relatedLocations {
      nodes {
        databaseId
        title
      }
    }
  }

  # Start from Location (should see same Service)
  location(id: "6997", idType: DATABASE_ID) {
    title
    locationServices {
      nodes {
        databaseId
        title
      }
    }
  }
}
```

### Query 6: Empty relationships should not break

```graphql
query {
  project(id: "6999", idType: DATABASE_ID) {
    title
    projectLocation {
      databaseId
      title
    }
  }
}
```

---

## Definition of Done

### 2D.6 = PASS ONLY IF

**1. Field Groups (24/24 verified)**
- [ ] 24/24 field groups exposed in GraphQL
- [ ] Actual GraphQL field names documented (NOT assumed)
- [ ] Field types verified against schema

**2. Relationships (ALL must work)**

| Relationship | Direction | Cardinality | Required |
|-------------|-----------|-------------|----------|
| Service → Location | M:N | Multiple | ✅ |
| Location → Service | M:N | Multiple | ✅ |
| Service → Project | M:N | Multiple | ✅ |
| Project → Service | N:1 | Single | ✅ |
| Project → Location | N:1 | Single | ✅ |
| FAQ → Service | N:1 | Single | ✅ |
| FAQ → Location | N:1 | Single | ✅ |

**3. Data Consistency**
- [ ] GraphQL response matches database values EXACTLY
- [ ] No data loss or transformation errors

### 2D.6 = BLOCKED IF

- Any 1 critical relationship fails
- GraphQL response differs from database
- ACF field stored but not exposed (after diagnosis)

**NO PARTIAL PASS.** Either 100% or BLOCKED.

### Root Cause Diagnosis (DO NOT MODIFY ACF)

**Diagnosis Order (top to bottom, no skipping):**

```
LEVEL 1: Plugin Missing
    ├── wp-graphql-acf not installed
    └── wp-graphql-acf not activated

LEVEL 2: Configuration
    ├── "Show in GraphQL" not checked on field group
    ├── Field group not assigned to correct post type
    └── Field group inactive/deleted

LEVEL 3: GraphQL Exposure
    ├── Individual field "Show in GraphQL" disabled
    └── Field hidden by conditional logic

LEVEL 4: Field Type Support
    ├── repeater → may need special handling
    ├── flexible_content → may need special handling
    └── gallery → may need special handling

LEVEL 5: Naming
    ├── GraphQL name may differ from ACF name
    └── snake_case → camelCase conversion rules

LEVEL 6: Relationship Configuration
    ├── relationship field not properly configured
    ├── bidirectional not set up
    └── post_type filter not matching
```

**CRITICAL RULE:** Do NOT modify ACF schema to fix GraphQL issues.
Only diagnose and document. Fix at the appropriate level.

---

## Canonical Test Dataset (MANDATORY - DO NOT CREATE NEW)

**Use ONLY the existing dataset from Phase 2D.5:**

| Entity | IDs | Reason |
|--------|-----|--------|
| Service | 6994, 6995, 6996 | Phase 2D.5 canonical dataset |
| Location | 6997, 6998 | Phase 2D.5 canonical dataset |
| Project | 6999, 7000 | Phase 2D.5 canonical dataset |
| FAQ | 7001, 7002, 7003 | Phase 2D.5 canonical dataset |
| Testimonial | 7004, 7005 | Phase 2D.5 canonical dataset |

**DO NOT create new test data.** This ensures direct comparison between Phase 2D.5 and 2D.6 results.

---

## Execution Report Template

Use this format for Phase 2D.6 execution results:

---

### Phase 2D.6 Execution Report

**Date:**
**Executed by:**
**Plugin version:**
**Status:** PASS / BLOCKED

---

### Test Results Summary

| # | Test | Result | Evidence |
|---|------|--------|----------|
| 1 | Plugin installed | PASS/BLOCK | version: X.X.X |
| 2 | 24 field groups exposed | PASS/BLOCK | count: X/24 |
| 3 | GraphQL names mapped | PASS/BLOCK | see mapping table |
| 4 | Scalar fields | PASS/BLOCK | query response |
| 5 | Repeater fields | PASS/BLOCK | query response |
| 6 | Service → Location | PASS/BLOCK | response |
| 7 | Location → Service | PASS/BLOCK | response |
| 8 | Service → Project | PASS/BLOCK | response |
| 9 | Project → Service | PASS/BLOCK | response |
| 10 | Project → Location | PASS/BLOCK | response |
| 11 | FAQ → Service | PASS/BLOCK | response |
| 12 | FAQ → Location | PASS/BLOCK | response |
| 13 | Empty relationships | PASS/BLOCK | response |
| 14 | DB ↔ GraphQL match | PASS/BLOCK | comparison |

**Final Status:** 2D.6 = PASS / BLOCKED

---

### Critical: ACF to GraphQL Field Name Mapping

**This mapping is the CONTRACT between WordPress and Next.js Repository.**

**DO NOT assume names. Document actual names from GraphQL introspection.**

```
┌─────────────────────────────────────┬─────────────────────────────────────┬───────────┐
│ ACF Field (snake_case)              │ GraphQL Field (camelCase)          │ Type      │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ SERVICE CPT                                                              │           │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ hero_image                          │ ?                                   │ image     │
│ hero_title                          │ ?                                   │ String    │
│ hero_description                    │ ?                                   │ String    │
│ short_description                   │ ?                                   │ String    │
│ description                         │ ?                                   │ String    │
│ service_category                    │ ?                                   │ String    │
│ seo_title                           │ ?                                   │ String    │
│ seo_description                     │ ?                                   │ String    │
│ seo_canonical                       │ ?                                   │ String    │
│ seo_focus_keyword                   │ ?                                   │ String    │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ REPEATER: benefits                                                       │           │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ benefits                            │ ?                                   │ [Benefit] │
│   benefit_title                     │ ?                                   │ String    │
│   benefit_description               │ ?                                   │ String    │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ REPEATER: process                                                       │           │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ process                             │ ?                                   │ [Process] │
│   step_number                       │ ?                                   │ Int       │
│   step_title                        │ ?                                   │ String    │
│   step_description                  │ ?                                   │ String    │
│   step_image                        │ ?                                   │ String    │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ REPEATER: packages (nested)                                            │           │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ packages                            │ ?                                   │ [Package] │
│   package_name                      │ ?                                   │ String    │
│   package_tier                      │ ?                                   │ String    │
│   package_description               │ ?                                   │ String    │
│   package_recommended               │ ?                                   │ Boolean   │
│   vehicle_sizes                     │ ?                                   │ [Size]    │
│     size_label                      │ ?                                   │ String    │
│     price                           │ ?                                   │ Float     │
│   package_features                   │ ?                                   │ [String]  │
│   package_durability                 │ ?                                   │ String    │
│   package_maintenance               │ ?                                   │ String    │
│   package_workmanship               │ ?                                   │ String    │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ REPEATER: gallery                                                       │           │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ gallery                             │ ?                                   │ [Gallery] │
│   gallery_image                     │ ?                                   │ MediaItem │
│   gallery_caption                   │ ?                                   │ String    │
│   gallery_type                      │ ?                                   │ String    │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ RELATIONSHIPS                                                           │           │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ related_locations                   │ ?                                   │ Connection│
│ related_projects                    │ ?                                   │ Connection│
│ related_faqs                        │ ?                                   │ Connection│
│ related_services                    │ ?                                   │ Connection│
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ LOCATION CPT                                                             │           │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ location_status                     │ ?                                   │ String    │
│ location_phone                      │ ?                                   │ String    │
│ location_whatsapp                   │ ?                                   │ String    │
│ location_email                      │ ?                                   │ String    │
│ address_street                      │ ?                                   │ String    │
│ address_district                    │ ?                                   │ String    │
│ address_city                        │ ?                                   │ String    │
│ address_province                    │ ?                                   │ String    │
│ address_postal_code                 │ ?                                   │ String    │
│ address_country                     │ ?                                   │ String    │
│ geo_latitude                        │ ?                                   │ Float     │
│ geo_longitude                       │ ?                                   │ Float     │
│ google_maps_url                     │ ?                                   │ String    │
│ google_place_id                     │ ?                                   │ String    │
│ location_tagline                    │ ?                                   │ String    │
│ location_description                │ ?                                   │ String    │
│ location_google_business_url        │ ?                                   │ String    │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ REPEATER: opening_hours                                                 │           │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ opening_hours                       │ ?                                   │ [Hours]   │
│   day_name                          │ ?                                   │ String    │
│   is_closed                         │ ?                                   │ Boolean   │
│   open_time                         │ ?                                   │ String    │
│   close_time                        │ ?                                   │ String    │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ REPEATER: location_highlights                                          │           │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ location_highlights                  │ ?                                   │ [String]  │
│   highlight                         │ ?                                   │ String    │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ REPEATER: location_facilities                                         │           │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ location_facilities                  │ ?                                   │ [String]  │
│   facility                          │ ?                                   │ String    │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ REPEATER: service_areas                                                 │           │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ service_areas                       │ ?                                   │ [String]  │
│   area_name                         │ ?                                   │ String    │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ REPEATER: location_gallery                                             │           │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ location_gallery                    │ ?                                   │ [Gallery] │
│   location_gallery_image            │ ?                                   │ MediaItem │
│   location_gallery_caption          │ ?                                   │ String    │
│   location_gallery_type             │ ?                                   │ String    │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ RELATIONSHIPS                                                           │           │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ location_services                   │ ?                                   │ Connection│
│ location_testimonials               │ ?                                   │ Connection│
│ location_faqs                       │ ?                                   │ Connection│
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ PROJECT CPT                                                             │           │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ vehicle_brand                       │ ?                                   │ String    │
│ vehicle_model                       │ ?                                   │ String    │
│ vehicle_year                        │ ?                                   │ String    │
│ vehicle_color                       │ ?                                   │ String    │
│ project_challenge                   │ ?                                   │ String    │
│ project_solution                    │ ?                                   │ String    │
│ project_result                      │ ?                                   │ String    │
│ completed_at                        │ ?                                   │ String    │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ GALLERY: before_images                                                  │           │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ before_images                       │ ?                                   │ [MediaItem]│
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ GALLERY: after_images                                                   │           │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ after_images                        │ ?                                   │ [MediaItem]│
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ GALLERY: process_images                                                 │           │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ process_images                      │ ?                                   │ [MediaItem]│
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ RELATIONSHIPS                                                           │           │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ project_service                     │ ?                                   │ Connection│
│ project_location                    │ ?                                   │ Connection│
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ FAQ CPT                                                                 │           │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ faq_question                        │ ?                                   │ String    │
│ faq_answer                          │ ?                                   │ String    │
│ faq_order                           │ ?                                   │ Int       │
│ faq_featured                        │ ?                                   │ Boolean   │
│ faq_category                        │ ?                                   │ String    │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ RELATIONSHIPS                                                           │           │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ faq_service                         │ ?                                   │ Connection│
│ faq_location                        │ ?                                   │ Connection│
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ TESTIMONIAL CPT                                                         │           │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ customer_name                        │ ?                                   │ String    │
│ customer_role                        │ ?                                   │ String    │
│ customer_company                     │ ?                                   │ String    │
│ customer_quote                       │ ?                                   │ String    │
│ customer_vehicle                     │ ?                                   │ String    │
│ customer_photo                       │ ?                                   │ MediaItem │
│ video_url                           │ ?                                   │ String    │
│ testimonial_source                   │ ?                                   │ String    │
│ testimonial_source_url               │ ?                                   │ String    │
│ testimonial_featured                 │ ?                                   │ Boolean   │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ RELATIONSHIPS                                                           │           │
├─────────────────────────────────────┼─────────────────────────────────────┼───────────┤
│ testimonial_service                 │ ?                                   │ Connection│
│ testimonial_location                 │ ?                                   │ Connection│
└─────────────────────────────────────┴─────────────────────────────────────┴───────────┘
```

---

### Relationship Test Details

#### Service → Location (M:N)
```
Query: Service 6994
Expected: 2 locations (6997, 6998)
GraphQL response: [?]
Database value: [6997, 6998]
Match: YES/NO
```

#### Location → Service (M:N)
```
Query: Location 6997
Expected: 2 services (6994, 6996)
GraphQL response: [?]
Database value: [6994, 6996]
Match: YES/NO
```

#### Service → Project (M:N)
```
Query: Service 6994
Expected: 1 project (6999)
GraphQL response: [?]
Database value: [6999]
Match: YES/NO
```

#### Project → Service (N:1)
```
Query: Project 6999
Expected: 1 service (6994)
GraphQL response: {id: ?, title: ?}
Database value: 6994
Match: YES/NO
```

#### Project → Location (N:1)
```
Query: Project 6999
Expected: empty (not set in test data)
GraphQL response: ? (should be null or empty, not error)
Database value: empty
Match: YES/NO
```

#### FAQ → Service (N:1)
```
Query: FAQ 7001
Expected: 1 service (6994)
GraphQL response: {id: ?, title: ?}
Database value: 6994
Match: YES/NO
```

#### FAQ → Location (N:1)
```
Query: FAQ 7001
Expected: 1 location (6997)
GraphQL response: {id: ?, title: ?}
Database value: 6997
Match: YES/NO
```

---

### Issues Encountered

**If any test BLOCKED, document here:**

| Level | Issue | Diagnosis | Resolution |
|-------|-------|-----------|------------|
| 1-6   | ?     | ?         | ?          |

---

**Final Verdict:** 2D.6 = PASS / BLOCKED

---

## Canonical Test Dataset (MANDATORY - DO NOT CREATE NEW)

**Use ONLY the existing dataset from Phase 2D.5:**

| Entity | IDs | Reason |
|--------|-----|--------|
| Service | 6994, 6995, 6996 | Phase 2D.5 canonical dataset |
| Location | 6997, 6998 | Phase 2D.5 canonical dataset |
| Project | 6999, 7000 | Phase 2D.5 canonical dataset |
| FAQ | 7001, 7002, 7003 | Phase 2D.5 canonical dataset |
| Testimonial | 7004, 7005 | Phase 2D.5 canonical dataset |

**DO NOT create new test data.** This ensures direct comparison between Phase 2D.5 and 2D.6 results.

---

## Troubleshooting Guide

**RULE: Diagnose before action. Do NOT modify ACF schema.**

### Issue: Field group not appearing

1. **LEVEL 1:** Is plugin installed and activated?
2. **LEVEL 2:** Is "Show in GraphQL" checked on field group?
3. **LEVEL 3:** Is individual field exposed?
4. **LEVEL 4:** Is field type supported?
5. **LEVEL 5:** Check actual GraphQL name via introspection
6. **LEVEL 6:** Is relationship properly configured?

### Issue: Field name unexpected

ACF uses snake_case → GraphQL may use camelCase:

```
short_description → shortDescription (standard)
vehicle_brand → vehicleBrand (standard)
```

But **verify with introspection** — actual names must be documented.

### Issue: Repeater not returning data

1. Check repeater has minimum rows met
2. Check sub-field names are correct (use introspection)
3. Nested repeaters (vehicle_sizes) need special handling

### Issue: Relationship returns empty

1. Verify post IDs exist in database
2. Verify relationship field is configured for that post_type
3. Check bidirectional settings (if applicable)
4. Use database as source of truth

### Issue: GraphQL error on query

1. Check field names match actual GraphQL schema
2. Check required arguments are provided
3. Check connection syntax (nodes {...})

### Issue: GraphQL error on query

1. Check field names match actual GraphQL schema
2. Check required arguments are provided
3. Check connection syntax (nodes {...})

---

## Deliverables

**This is the contract for Next.js Repository development.**

1. **ACF → GraphQL Field Mapping Table** — ALL fields documented with actual GraphQL names
2. **Relationship Test Results** — All 7 critical relationships verified
3. **Database ↔ GraphQL Comparison** — Values must match EXACTLY
4. **Execution Report** — Filled template with PASS/BLOCK status
5. **Issue Log** — Any problems with root cause diagnosis
6. **Updated Handoff** — For next agent

**File to be created:** `docs/phase-2d6-execution-report.md`

---

## Next Phase

**Phase 2D.7: Test Data Entry** — Only proceeds if 2D.6 = PASS

Populate canonical test dataset with complete data:
- All Service fields (hero, content, packages, etc.)
- All Location fields (address, hours, etc.)
- All Project fields (vehicle info, images, etc.)
- All FAQ content
- All Testimonial content

This builds on Phase 2D.6 to ensure Next.js will have complete data to render.

---

**Document Status:** PLANNED
**Last Updated:** 2026-08-20
