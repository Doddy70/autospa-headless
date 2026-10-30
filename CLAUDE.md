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
GraphQL:  https://backend.autospajakarta.com/index.php?graphql
REST:     https://backend.autospajakarta.com/index.php?rest_route=/wp/v2
PHP:      8.2
Database: sql_staging_autospajakarta
Prefix:   wpa_
```

> The staging host routes WordPress through `index.php`: nginx answers 404 on
> `/graphql` and `/wp-json`, both APIs are reached through that file. The
> frontend is pointed at the staging install - the production site
> (`autospajakarta.com`) is **not** queried any more.

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

## Service Architecture (Layanan)

The Agntix "Projects" block (portfolio metro rows) is the architecture of the
service catalogue. The rows of the template were projects; here they are the
six AutoSPA services.

```bash
# The catalogue: WordPress first, the published mirror as fallback.
src/lib/services/catalog.ts     listServiceCards() / getServiceDetail(slug)
src/lib/services/adapters.ts    WordPress + mirror -> one presentation model
src/components/showcase/        the reused Agntix blocks (headline, rows, hero)
```

| Route | Source |
|-------|--------|
| `/` (section "Layanan") | `ServiceShowcase` over the catalogue |
| `/services` | catalogue rows + the 12 packages |
| `/services/<slug>` | detail page, portfolio detail architecture |
| `/our-services` | permanent redirect to `/services` |

Rules: the catalogue is read on the server, WordPress wins per field, the
static mirror (`src/data/services.ts`) fills the gaps, and the catalogue is
never empty. The service CPT is registered on the staging origin and carries
the six services, so the CMS answers and the mirror only fills the fields the
CMS does not carry yet (the header clip).

The CMS stores its prose as HTML (`wysiwyg`), the presentation layer prints
plain text - `toPlainText()` in `src/lib/wordpress/html.ts` is the boundary.

The media library holds a trap: an attachment inherits the visibility of its
parent post, and a parent of a type the schema does not expose makes the
attachment invisible to GraphQL - the ACF image field then resolves to null
even though the file is on disk. `acf-json/repair-media-parents.php` detaches
those attachments.

## Branch Directory (Lokasi)

The ten workshops are the `location` CPT. The directory is read on the
server, WordPress wins per field, and the branch directory in
`src/data/contact.ts` fills the gaps - it still carries the second phone
number of a branch, for instance.

```bash
src/lib/locations/catalog.ts              listLocationCards() / getLocationCard(slug)
src/lib/wordpress/repositories/locations.ts   the Location CPT -> the model
src/data/contact.ts                       the branch directory (the fallback)
```

| Route | Source |
|-------|--------|
| `/contact` | the branch directory, with the map embeds |
| `/locations` | the directory, from the CMS |

The slug of a branch is the same in the CMS and in the branch directory
(`pluit`, `depok-2`, `express-depok`, `pik-2`, `ciledug`, `bekasi`,
`kranji-bekasi`, `bogor`, `serpong`, `cikupa`), so the booking wizard and the
CMS address the same branch by the same name.

The CMS records are written by `acf-json/seed-locations.php` - idempotent,
and every string comes from the published contact page.

Details: `docs/service-architecture.md`.

## Booking Wizard (Reservasi)

The reservation wizard is a dialog that is mounted once in the root layout.
Every call to action that asks for a booking opens it - there is no separate
booking page any more.

```bash
src/lib/booking/            the domain: types, validation, summary, schedule, vehicles
src/components/booking/     the wizard, the modal, the trigger, the steps
src/context/BookingContext.tsx  the state of the dialog
src/app/api/services/       the catalogue as JSON for the dialog
```

Steps: service, branch, vehicle size, vehicle (skipped unless the service is
cut per model), arrival, customer, review. The arrival step asks how soon the
customer wants to come first (secepatnya / minggu ini / minggu depan / masih
konsultasi), then the day from a calendar and the time from the slots of the
branch.

The submission is handed over to **the WhatsApp number of the chosen branch**
(`branchWhatsapp()` in `src/data/contact.ts`), not to the central number.
There is no booking API: the request is a preference until the team confirms
it, and the wizard never claims otherwise.

Details: `docs/booking-wizard.md`.

Checks:

```bash
node scripts/perf/check-booking-wizard.mjs http://localhost:3200
```

## Before & After (the comparison slider)

The gallery shows the same detail of a vehicle before the work and after it.
The visitor drags the divider and compares the two photos.

```bash
src/data/before-after.ts                 the pairs - id, title, caption, photos
src/hooks/useBeforeAfterImageSlider.ts   the drag of the divider
src/components/ui/BeforeAfterSlider.tsx  one comparison (the frame and the divider)
src/components/ui/BeforeAfterCarousel.tsx  the card slider around it
src/components/home/sections/BeforeAfterSection.tsx  the section on the homepage
```

| Route | Source |
|-------|--------|
| `/` (section "Before & After") | `BeforeAfterSection` over the pairs |
| `/before-after` | the pairs, with the call to action |

The divider is one number - the percentage of the frame that shows the photo
from before the work. The hook keeps it and the component hands it to the
frame as the CSS variable `--ba-split`, so a resize of the window keeps the
divider where the visitor put it. The drag runs on the pointer events (mouse,
finger and pen take the same path) and the divider is a `slider` for the
screen readers.

The gallery is a card slider: three cards on a wide screen, two on a tablet,
one on a phone. The photos live in `public/images/before-after/` and are
served by the frontend itself - they are not in the WordPress media library
yet.

Details: `docs/before-after-gallery.md`.

Checks:

```bash
node scripts/perf/check-before-after.mjs http://localhost:3200
```

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
| Staging GraphQL `/graphql` returns 404 | High | Worked around - the endpoint is `index.php?graphql`; the content origin is now the staging install |
| A WPGraphQL image field of a `wysiwyg`/`textarea` field needs the markup stripped | Medium | Fixed - `toPlainText()` in `src/lib/wordpress/html.ts`; the CMS stores HTML, the presentation layer prints text |
| An attachment inherits the visibility of its parent | Medium | If the parent is of a type the schema does not expose, the attachment is invisible to GraphQL and every ACF image field that points at it resolves to null - see `acf-json/repair-media-parents.php` |

## Deployment (CI/CD)

A push to `main` builds the site on the production server, checks it and puts
it live. One engine, two callers:

```bash
.github/workflows/deploy.yml      the push to main (GitHub Actions -> ssh)
scripts/deploy/aapanel-deploy.sh the webhook of aaPanel (the server pulls)
scripts/deploy/deploy.sh          the engine: build, check, switch, roll back
scripts/deploy/verify-deploy.sh   the check of the public site
```

The live site is never built over: every deployment gets its own directory
under `releases/`, `current` is switched to it atomically, and the previous
one stays on disk as the way back. pm2 runs `run.sh`, a stable path that
enters the release `current` points at.

| Route | Source |
|-------|--------|
| `https://autospajakarta.com` | the release `current` points at |
| `/www/wwwroot/autospa-frontend` | the root of the deployment (`releases/`, `shared/`, `current`) |
| `/www/wwwroot/autospajakarta.com` | the clone of the repository (the source, not the live site) |

The settings of the repository (secret `DEPLOY_SSH_KEY`, variables
`DEPLOY_SSH_HOST`, `DEPLOY_SSH_USER`, `DEPLOY_SSH_PORT`, `APP_ROOT`) and the
path through aaPanel are in `docs/deployment.md`.

## Documentation

- **Agent onboarding / project state:** `docs/agent-onboarding.md`
- **Content Sync (Phase 2E):** `docs/phase-2e-headless-content-sync.md`
- **Deployment (CI/CD):** `docs/deployment.md`
- **Security — Elementor Pro backdoor:** `docs/security-elementor-pro-nulled-backdoor.md`
- **Architecture evaluation — Agntix:** `docs/agntix-standalone-evaluation.md`
- **Agntix "Projects" architecture:** `docs/agntix-projects-architecture.md`
- **Service architecture (Layanan):** `docs/service-architecture.md`
- **Booking wizard (reservation modal):** `docs/booking-wizard.md`
- **Before & After (comparison slider):** `docs/before-after-gallery.md`

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
