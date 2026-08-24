# PHASE 2C: SCHEMA FREEZE + PHASE 2D IMPLEMENTATION ROADMAP
## AutoSP AJakarta - Headless WordPress Project

**Project:** Headless WordPress → Next.js for SEO/GEO Rebuild
**Date:** 2026-08-18
**Status:** 🔒 SCHEMA FROZEN - Implementation Phase

---

## 1. SCHEMA FREEZE CHECKLIST

### 1.1 Phase 2C Completed Deliverables

| Document | Version | Status | Date |
|----------|---------|--------|------|
| ACF Specification | 1.0 | ✅ Frozen | 2026-08-18 |
| WPGraphQL Schema | 1.0 | ✅ Frozen | 2026-08-18 |
| Query Architecture | 1.0 | ✅ Frozen | 2026-08-18 |
| API Contract | 1.0 | ✅ Frozen | 2026-08-18 |
| SEO Migration Contract | 1.0 | ✅ Frozen | 2026-08-18 |
| Content Model | 1.0 | ✅ Frozen | (Phase 2B) |
| Relationship Map | 1.0 | ✅ Frozen | (Phase 2B) |
| Taxonomy | 1.0 | ✅ Frozen | (Phase 2B) |

### 1.2 🔒 Frozen Schemas

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       🔒 SCHEMAS FROZEN                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ENTITIES (Phase 2B)                                                     │
│  ├── Organization ✅                                                     │
│  ├── Location ✅                                                        │
│  ├── Service ✅                                                         │
│  ├── Project ✅                                                          │
│  ├── FAQ ✅                                                              │
│  ├── Testimonial ✅                                                     │
│  └── Blog ✅                                                            │
│                                                                          │
│  ACF FIELDS (Phase 2C-1)                                                │
│  ├── Service Fields ✅                                                    │
│  ├── Location Fields ✅                                                   │
│  ├── Project Fields ✅                                                   │
│  ├── FAQ Fields ✅                                                       │
│  ├── Testimonial Fields ✅                                               │
│  └── Site Config ✅                                                     │
│                                                                          │
│  GRAPHQL TYPES (Phase 2C-2)                                             │
│  ├── Service Type ✅                                                     │
│  ├── Location Type ✅                                                    │
│  ├── Project Type ✅                                                    │
│  ├── FAQ Type ✅                                                        │
│  ├── Testimonial Type ✅                                                │
│  └── Connections ✅                                                     │
│                                                                          │
│  QUERY PATTERNS (Phase 2C-3)                                             │
│  ├── Repository Pattern ✅                                                │
│  ├── Caching Strategy ✅                                                │
│  └── Webhook/Revalidation ✅                                            │
│                                                                          │
│  API CONTRACT (Phase 2C-4)                                               │
│  ├── Endpoints ✅                                                       │
│  ├── Security Headers ✅                                                │
│  ├── Error Handling ✅                                                  │
│  └── Monitoring ✅                                                      │
│                                                                          │
│  SEO MIGRATION (Phase 2C-5)                                             │
│  ├── Redirect Matrix ✅                                                   │
│  ├── Indexability Rules ✅                                               │
│  └── Sitemap Strategy ✅                                                 │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.3 Schema Change Process

```
CHANGE REQUESTS:

For CRITICAL bugs only:
  1. Document the issue
  2. Propose fix
  3. Migration team review
  4. Schema update
  5. All implementations update

For NEW requirements:
  1. Document requirement
  2. Impact analysis
  3. Schema amendment proposal
  4. Stakeholder approval
  5. Version bump (v1.0 → v1.1)
  6. Migration schedule
```

---

## 2. PHASE 2D IMPLEMENTATION CHECKLIST

```
PHASE 2D: WordPress Implementation
│
├── 2D.1 WordPress Preparation
├── 2D.2 ACF Fields
├── 2D.3 CPT Registration
├── 2D.4 Taxonomy Setup
├── 2D.5 Relationship Fields
├── 2D.6 WPGraphQL Setup
├── 2D.7 Test Data Entry
├── 2D.8 API Testing
├── 2D.9 Content Migration
├── 2D.10 Media Migration
├── 2D.11 Redirect Implementation
└── 2D.12 Migration QA
```

---

### 2D.1 WordPress Preparation

```
PRE-FLIGHT CHECKLIST:

□ Server Requirements
  ├── PHP 8.2+ (after compatibility audit)
  ├── WordPress 6.x+ (latest stable)
  ├── MySQL/MariaDB
  └── SSL certificate

□ Plugin Stack
  ├── WPGraphQL (verify version)
  ├── WPGraphQL ACF (verify compatibility)
  ├── Advanced Custom Fields PRO (for ACF blocks)
  ├── Redirection plugin (for redirect management)
  └── WordPress Multisite? NO (single site)

□ Staging Environment
  ├── Clone production to staging
  ├── Test domain: staging.autospajakarta.com
  ├── Access credentials ready
  └── Backup system verified

□ Development Workflow
  ├── Local development environment
  ├── Version control (Git)
  ├── CI/CD pipeline (if applicable)
  └── Deployment process documented
```

### 2D.2 ACF Fields

```
IMPLEMENTATION ORDER:

1. Service Fields (Priority 1)
   □ service_content group
   □ service_packages group
   □ service_media group
   □ service_relationships group
   □ service_seo group

2. Location Fields (Priority 2)
   □ location_identity group
   □ location_address group
   □ location_geo group
   □ location_business group
   □ location_content group
   □ location_relationships group
   □ location_gallery group

3. Project Fields (Priority 3)
   □ project_content group
   □ project_media group
   □ project_relationships group

4. FAQ Fields (Priority 4)
   □ faq_content group
   □ faq_context group

5. Testimonial Fields (Priority 5)
   □ testimonial_content group
   □ testimonial_media group
   □ testimonial_context group

6. Site Config (Priority 6)
   □ organization_info group
   □ social_profiles group
   □ default_seo group

7. Post Fields (Priority 7)
   □ post_relationships group
   □ migration_status group

VERIFICATION:
□ All field names match specification
□ Field types correct (text, number, relationship, etc.)
□ Required fields marked
□ Validation rules applied
□ Local JSON export of field groups
□ Git commit of field JSON
```

### 2D.3 CPT Registration

```
IMPLEMENTATION ORDER:

1. Create CPT for Service
   □ slug: 'service'
   □ capabilities: read, edit_posts, delete_posts
   □ supports: title, editor, thumbnail, excerpt, custom-fields
   □ show_in_graphql: true
   □ graphql_single_name: 'Service'
   □ graphql_plural_name: 'Services'

2. Create CPT for Location
   □ slug: 'location'
   □ supports: title, editor, thumbnail, excerpt
   □ show_in_graphql: true
   □ graphql_single_name: 'Location'
   □ graphql_plural_name: 'Locations'

3. Create CPT for Project
   □ slug: 'project'
   □ supports: title, editor, thumbnail
   □ show_in_graphql: true
   □ graphql_single_name: 'Project'
   □ graphql_plural_name: 'Projects'

4. Create CPT for FAQ
   □ slug: 'faq'
   □ supports: title, editor
   □ show_in_graphql: true
   □ graphql_single_name: 'FAQ'
   □ graphql_plural_name: 'FAQs'

5. Create CPT for Testimonial
   □ slug: 'testimonial'
   □ supports: title, thumbnail
   □ show_in_graphql: true
   □ graphql_single_name: 'Testimonial'
   □ graphql_plural_name: 'Testimonials'

VERIFICATION:
□ All CPTs registered
□ GraphQL shows new types
□ Admin menu shows CPTs
□ Permissions correct
□ Archive pages work (if public)
□ Git commit of CPT code
```

### 2D.4 Taxonomy Setup

```
WORDPRESS TAXONOMIES:

1. Categories (already exist)
   □ Review existing categories
   □ Merge/rename per taxonomy document
   □ Assign to Posts
   □ Verify hierarchy

2. Tags (already exist)
   □ Review tag list
   □ Remove duplicates
   □ Set tag limit (5 per post)

3. Topic Field (custom, not taxonomy)
   □ Add to Post ACF group
   □ Verify field appears in post editor

4. Service Areas (NOT CPT)
   □ Service areas stored in Location field
   □ No taxonomy registration needed

VERIFICATION:
□ Category count: 9 (per spec)
□ Tag cleanup complete
□ Post-relationships field working
□ Migration-ready category assignments
```

### 2D.5 Relationship Fields

```
IMPLEMENTATION VERIFICATION:

Service ↔ Location:
□ Service field: related_locations (relationship)
□ Location field: location_services (relationship)
□ Bidirectional link works
□ GraphQL query returns correct data

Service ↔ Project:
□ Project field: project_service (relationship)
□ Service field: related_projects (connection)
□ Bidirectional link works

Project ↔ Location:
□ Project field: project_location (relationship)
□ Location field: location_projects (connection)
□ Bidirectional link works

FAQ Context:
□ FAQ field: faq_service (relationship)
□ FAQ field: faq_location (relationship)
□ Context rules working

Testimonial Context:
□ Testimonial: testimonial_service (relationship)
□ Testimonial: testimonial_location (relationship)
□ Source tracking working

VERIFICATION:
□ All relationships functional
□ GraphQL returns related data
□ Admin UI shows relationships
□ No circular reference issues
```

### 2D.6 WPGraphQL Setup

```
WPGraphQL VERIFICATION:

1. Core WPGraphQL
   □ Plugin active
   □ /graphql endpoint accessible
   □ Introspection enabled (dev only)

2. ACF Integration
   □ wp-graphql-acf active
   □ ACF fields exposed in GraphQL
   □ Repeater fields working
   □ True/False fields boolean in GraphQL

3. Connection Types
   □ ServiceToLocationConnection works
   □ LocationToServiceConnection works
   □ ServiceToProjectConnection works
   □ All custom connections registered

4. Security
   □ Query depth limited
   □ Rate limiting configured
   □ Introspection disabled in production
   □ Sensitive fields not exposed

GRAPHQL QUERY TESTING:
□ Query all services
□ Query service by slug
□ Query service with locations
□ Query service with projects
□ Query location with services
□ Query project with vehicle data
□ Mutation queries rejected (public read-only)
```

### 2D.7 Test Data Entry

```
MINIMUM TEST DATA FOR VERIFICATION:

Service (1-2):
□ Nano Ceramic Coating
  - 2 packages (Light, Platinum)
  - Hero image
  - Short description
  - 3 benefits
  - 4 process steps

Location (1):
□ AutoSPA Pluit
  - Full address
  - Phone/WhatsApp
  - Opening hours
  - 3 services linked
  - Description

Project (1-2):
□ Toyota test project
  - Vehicle data
  - Before/After images
  - Service linked
  - Location linked

FAQ (3):
□ 1 global FAQ
□ 1 service-specific FAQ
□ 1 location-specific FAQ

Testimonial (1):
□ Test quote with attribution

Blog Post (1):
□ Test post with relationships
□ Topic field populated
□ Service link
□ Location link

VERIFICATION:
□ All test data creates successfully
□ GraphQL queries return test data
□ Relationships show correctly
□ SEO fields work
```

### 2D.8 API Testing

```
TESTING PROTOCOL:

Unit Tests:
□ Each field type works (text, number, relationship, etc.)
□ Validation rules enforced
□ Required field errors appear

Integration Tests:
□ WordPress save triggers webhook (mock)
□ GraphQL returns fresh data
□ Relationships persist

E2E Tests:
□ Create Service → Check GraphQL → Check WP admin
□ Create Location → Link to Service → Query relationship
□ Full CRUD cycle for each entity

Performance Tests:
□ GraphQL query < 500ms
□ Complex queries < 2s
□ No N+1 query issues

Security Tests:
□ Unauthorized write attempts rejected
□ Deep queries timeout
□ Sensitive fields not in response
□ Rate limiting works

DOCUMENTATION:
□ API testing results
□ Performance benchmarks
□ Security test results
□ Known issues and workarounds
```

### 2D.9 Content Migration

```
MIGRATION ORDER (per Phase 2A-D audit):

Phase 1: Services
□ Create Service CPT entries from extracted data
□ Map 4 services (Ceramic, PPF, Detailing, Wash)
□ Add packages from extraction
□ Link to locations
□ Verify all fields populated

Phase 2: Locations
□ Create Location entries from verification
□ Map 10 candidates (prioritize verified first)
□ Add address, hours, contact
□ Link to services
□ Verify complete before public

Phase 3: Projects
□ Migrate 12 existing portfolio items
□ Add vehicle data
□ Link to service and location
□ Verify before/after images

Phase 4: FAQs
□ Create FAQ entries from existing content
□ Add contextual relationships
□ Set display order
□ Verify in GraphQL

Phase 5: Blog Posts (per audit action)
□ KEEP (28): Update and verify
□ UPDATE (142): Batch update in priority order
□ NOINDEX (5): Mark as noindex
□ Verify content integrity

Phase 6: Testimonials
□ Create testimonial entries
□ Source attribution verified
□ Featured flags set

MIGRATION TRACKING:
□ All content logged in migration CSV
□ Status updated per item
□ Issues documented
□ Sign-off obtained
```

### 2D.10 Media Migration

```
MEDIA ASSET MIGRATION:

1. Inventory Existing Media
   □ Count: 815 items
   □ Image types: JPG, PNG, WebP
   □ Video count: 5
   □ Orphaned media cleanup

2. Image Optimization Pipeline
   □ WebP/AVIF generation
   □ Thumbnail regeneration
   □ Alt text audit
   □ Size limits enforced

3. Media Organization
   □ Folder structure: /2024/ /2025/ /2026/
   □ Naming convention
   □ Caption/description cleanup

4. CDN Integration (if applicable)
   □ Cloudflare/Image CDN
   □ Cache headers
   □ Resize endpoints

VERIFICATION:
□ All images load
□ Thumbnails generate correctly
□ Alt text present
□ Performance acceptable
□ CDN caching works
```

### 2D.11 Redirect Implementation

```
REDIRECT WORKFLOW:

1. Staging First
   □ All redirects tested on staging
   □ Chain verification (no redirect loops)
   □ Performance impact checked

2. Production Deployment
   □ Redirection plugin configured
   □ Next.js redirects in config
   □ nginx rules (if applicable)

3. Monitoring Setup
   □ 404 tracker active
   □ Search Console alerts
   □ Analytics events for 404s

4. Rollback Plan
   □ Previous state preserved
   □ Quick rollback steps documented
   □ Communication plan for issues

REDIRECT VERIFICATION:
□ All 301s tested (crawl)
□ No redirect chains (single hop)
□ NOINDEX on excluded pages
□ Canonical tags correct
□ Sitemap updated
□ robots.txt updated
□ Cached redirects cleared
```

### 2D.12 Migration QA

```
QA CHECKLIST:

Final Verification:
□ All content visible in WordPress
□ All GraphQL queries return correct data
□ All relationships linked
□ SEO metadata populated
□ Featured images working
□ No PHP errors
□ No JavaScript errors
□ Core Web Vitals acceptable

Staging Sign-off:
□ Development team
□ SEO team
□ Client review
□ Performance test
□ Security test

Production Deployment:
□ Backup verified
□ DNS switch ready
□ Monitoring active
□ Communication sent
□ Rollback tested

Post-Launch (Week 1):
□ Traffic monitoring
□ Ranking tracking
□ Error monitoring
□ Performance baseline
□ Client training

ISSUE ESCALATION:
□ Critical: Immediate response
□ High: < 4 hours
□ Medium: < 24 hours
□ Low: Next sprint
```

---

## 3. PHASE 3: NEXT.JS IMPLEMENTATION PREVIEW

### 3.1 Design System Lock

```
BASELINE CONFIRMED:
├── Mode: Dark Mode
├── Effect: Glassmorphism
├── Inspiration: Apple-inspired
├── Brand Color: #27A8DF (AutoSPA Blue)
├── Cinematic automotive photography
└── Reference: Pulkitxm Claude Directory - aura-email-landing
```

### 3.2 Implementation Order

```
NEXT.JS FRONTEND ORDER:

1. Design System Foundation
   □ Tailwind config
   □ Color tokens
   □ Typography scale
   □ Spacing system
   □ Glassmorphism utilities

2. Core Components
   □ Button (variants)
   □ Card (glass effect)
   □ Input fields
   □ Badge/Tag

3. Layout Components
   □ Container
   □ Section
   □ Header (glass nav)
   □ Footer

4. Navigation
   □ Desktop menu
   □ Mobile menu
   □ Breadcrumbs

5. Automotive Components
   □ ServiceCard
   □ LocationCard
   □ ProjectCard
   □ BeforeAfter slider
   □ BookingCTA

6. Content Components
   □ Service page template
   □ Location page template
   □ Project page template
   □ Blog post template
   □ FAQ accordion

7. SEO Components
   □ Metadata generator
   □ JSON-LD generators
   □ Sitemap

8. Page Templates
   □ Homepage
   □ Services listing
   □ Service detail
   □ Locations listing
   □ Location detail
   □ Projects listing
   □ Project detail
   □ Blog listing
   □ Blog post
   □ About
   □ FAQ
   □ Contact
   □ Booking

9. Integration
   □ WordPress client
   □ Repository pattern
   □ ISR configuration
   □ Webhook endpoint
   □ Error boundaries

10. Performance
    □ Image optimization
    □ Font loading
    □ Bundle analysis
    □ Lighthouse audit
```

---

## 4. TIMELINE ESTIMATE

```
PHASE 2D: WordPress (Estimated)
├── 2D.1-2D.2: 1 week
├── 2D.3-2D.4: 1 week
├── 2D.5-2D.6: 1 week
├── 2D.7-2D.8: 1 week
├── 2D.9-2D.10: 1-2 weeks
├── 2D.11-2D.12: 1 week
└── Buffer: 1 week
TOTAL: 6-8 weeks

PHASE 3: Next.js (Estimated)
├── Design System: 1 week
├── Core Components: 1 week
├── Page Templates: 2-3 weeks
├── Content Integration: 1 week
├── SEO/Performance: 1 week
├── QA: 1 week
└── Buffer: 1 week
TOTAL: 8-10 weeks

GRAND TOTAL: 14-18 weeks
```

---

**Document Status:** 🔒 SCHEMA FROZEN
**Implementation Start:** Pending resource allocation
**Target Launch:** TBD based on timeline
**Last Updated:** 2026-08-18
