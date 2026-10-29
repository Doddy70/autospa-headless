# AutoSP AJakarta — Headless WordPress Migration

## Project Status

**Phase 2E: Headless Content Sync & Article API** — ✅ PASS

**Completed Phases:** 2D.1–2D.8 ✅, 2E ✅

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
| **2E Content Sync** | **✅** | **16 static pages mirrored, article API (204 posts), 243 sitemap URLs** |

## Phase 2E — Content Sync (local staging)

The 19 published pages of `autospajakarta.com` are Elementor layouts and are shipped as
snapshots; the articles are served from the WordPress REST API. Both origins are read
only - nothing was deployed to production.

```bash
npm run dev              # http://localhost:3100
npm run sync:content     # re-mirror pages, media, fonts, manifest (read-only)
npm run sync:verify      # every referenced asset exists in public/
npm run sync:compare     # rendered page vs mirrored source
```

| Route | Source |
|-------|--------|
| `/<slug>` (16 pages) | static snapshot, `src/app/[slug]/page.tsx` |
| `/blog`, `/blog/<slug>`, `/blog/category/<slug>` | native React over the article API |
| `/api/articles`, `/api/articles/<slug>`, `/api/categories` | read-only REST proxy |

Env: `WORDPRESS_GRAPHQL_URL`, `WORDPRESS_REST_URL`, `WORDPRESS_SITE_URL`,
`NEXT_PUBLIC_SITE_URL`, `WORDPRESS_REVALIDATE_SECONDS` (see `.env.example`).

Details: `docs/phase-2e-headless-content-sync.md`.

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
| Staging GraphQL `/graphql` returns 404, WPGraphQL unreachable | High | Open - content origin is production (read-only) |

## Documentation

- **Content Sync (Phase 2E):** `docs/phase-2e-headless-content-sync.md`
- **Security — Elementor Pro backdoor:** `docs/security-elementor-pro-nulled-backdoor.md`
- **Architecture evaluation — Agntix:** `docs/agntix-standalone-evaluation.md`

> The phase 1A–2D9 planning documents were retired in favour of the Phase 2E
> architecture above. Their content now lives in the git history.

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
