# AutoSP AJakarta — Headless WordPress Migration

## Project Status

**Phase 2D.8: API Testing** — ✅ PASS

**Completed Phases:** 2D.1–2D.8 ✅

Production is READ ONLY. All development happens on staging only.

## Critical Rules

1. **Production Access**: READ ONLY — no PHP/ACF/CPT/GraphQL changes without sign-off
2. **Naming**: snake_case only (short_description, vehicle_sizes, not camelCase)
3. **Repository Pattern**: Components → repository → GraphQL (never raw fetch)
4. **Staging First**: Test everything on staging before any production changes

## Staging Environment

```
URL:      https://backend.autospajakarta.com
Admin:    https://backend.autospajakarta.com/wp-admin
GraphQL:  https://backend.autospajakarta.com/graphql
PHP:      8.2
Database: sql_staging_autospajakarta
Prefix:   wpa_
```

## Key Commands

```bash
# SSH to server
ssh -p 16916 root@148.230.101.241

# WP-CLI (staging)
php /www/server/php/82/bin/php /tmp/wp-cli.phar \
  --path=/www/wwwroot/backend.autospajakarta.com --allow-root <command>
```

## Completed Phases

| Phase | Status | Key Deliverables |
|-------|--------|-----------------|
| 2D.1 Environment Prep | ✅ | Staging with PHP 8.2 |
| 2D.2 ACF Fields | ✅ | 24 field groups imported |
| 2D.3 CPT Registration | ✅ | 5 CPTs, GraphQL working |
| 2D.4 Taxonomy Setup | ✅ | 17 categories reviewed |
| 2D.5 Relationship Testing | ✅ | Test data created |
| 2D.6 WPGraphQL ACF | ✅ | Nested structure verified |
| 2D.7 Test Data Entry | ✅ | Complete business dataset |
| **2D.8 API Testing** | **✅** | **20/20 tests PASS** |

## API Contract (Phase 2D.8 Results)

### Query Names (Verified)

```typescript
// Single entity by slug
serviceBy(slug: String!): Service
locationBy(slug: String!): Location
projectBy(slug: String!): Project

// List with pagination
services(first: Int): ServiceConnection
locations(first: Int): LocationConnection
projects(first: Int): ProjectConnection
fAQs(first: Int): FAQConnection
testimonials(first: Int): TestimonialConnection
```

### Key Findings

| Test | Result |
|------|--------|
| slug-based queries | ✅ Works |
| nested ACF fields | ✅ Works |
| repeater fields | ✅ Works |
| relationships | ✅ Works |
| pagination | ✅ Works |
| empty relationships | ✅ Safe ([]) |
| invalid slug | ✅ Returns null |
| draft visibility | ✅ Drafts hidden |

## ⚠️ CRITICAL: WPGraphQL ACF Nested Structure

**Field groups become nested objects in GraphQL:**

```graphql
# WRONG (flat):
shortDescription

# CORRECT (nested by field group):
serviceContent.shortDescription
serviceRelationships.relatedLocations.nodes[].databaseId
```

### GraphQL Field Naming Examples

```
Service:
  serviceBy(slug: "...")
  serviceHero.heroTitle
  serviceContent.shortDescription
  servicePackages.packages[].packageName
  serviceRelationships.relatedLocations.nodes[].databaseId

Location:
  locationBy(slug: "...")
  locationIdentity.locationPhone
  locationAddress.addressCity
  businessHours.openingHours[].dayName

Project:
  projectBy(slug: "...")
  projectContent.vehicleBrand
  projectRelationships.projectService.nodes[].databaseId

FAQ:
  fAQContent.faqQuestion
  fAQContext.faqService.nodes[].databaseId

Testimonial:
  testimonialContent.customerName
  testimonialContext.testimonialService.nodes[].databaseId
```

## Canonical Test Dataset

| Entity | IDs | Status |
|--------|-----|--------|
| Service | 6994, 6995, 6996 | 6994 COMPLETE |
| Location | 6997, 6998 | 6997 COMPLETE |
| Project | 6999, 7000 | 6999 COMPLETE |
| FAQ | 7001, 7002, 7003 | All populated |
| Testimonial | 7004, 7005 | All populated |

## Known Issues

| Issue | Severity | Status |
|-------|----------|--------|
| WordPress 7.0.4 anomaly | Medium | Documented |
| Category consolidation | — | Scheduled for 2D.9 |
| FAQ faqCategory not exposed | Low | Documented in 2D.8 report |
| Project challenge/solution/result not exposed | Low | Documented in 2D.8 report |

## Documentation

- **API Testing Report:** `docs/phase-2d8-api-testing-report.md` ← NEW
- **Phase Reports:** `docs/phase-2d*-execution-report.md`
- **Full Specs:** `docs/phase-2c-*.md`
- **Content Model:** `docs/phase-2b-content-model.md`

## Architecture

```
WordPress (Headless CMS) + WPGraphQL 2.19.0 + WPGraphQL ACF 2.7.1 + PHP 8.2
        ↓ GraphQL
Next.js 15 (App Router) + TypeScript + Tailwind
```

## Upcoming Phases

- 2D.9: Content Migration ← NEXT
- 2D.10: Media Migration
- 2D.11: Redirect Implementation
- 2D.12: Migration QA

## Known Issues

| Issue | Severity | Status |
|-------|----------|--------|
| WordPress 7.0.4 anomaly | Medium | Documented |
| Category consolidation | — | Scheduled for 2D.9 |
