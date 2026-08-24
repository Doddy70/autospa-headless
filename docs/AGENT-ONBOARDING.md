# Agent Onboarding — AutoSP AJakarta Headless WordPress Migration

**For:** Claude Code agents continuing this project
**Last Updated:** 2026-08-18
**Status:** Phase 2D.4 COMPLETED — Proceeding to 2D.5

---

## 📌 Project Overview

**Client:** AutoSP AJakarta — premium auto detailing & ceramic coating studio
**Location:** Jakarta, Indonesia
**Goal:** Migrate from monolithic WordPress to Headless WordPress + Next.js 15 architecture

### Business Context

- Premium automotive aesthetic services (ceramic coating, premium wash, PPF)
- 10+ physical locations across Jakarta area
- 174 blog posts, 19 pages, 12 portfolio items — all SEO-preserved
- Target: maximize organic SEO + GEO targeting for Jabodetabek area

---

## 🏗️ Architecture (FROZEN)

```
┌─────────────────────────────────────────────────────┐
│                  WordPress (Headless CMS)            │
│                  backend.autospajakarta.com           │
│                  PHP 8.2 ✅                          │
│                  WPGraphQL 2.12.0                    │
└──────────────────────┬──────────────────────────────┘
                       │ GraphQL
                       ▼
┌─────────────────────────────────────────────────────┐
│                  Next.js 15 (Frontend)              │
│                  App Router, TypeScript              │
│                  Vercel (planned)                  │
│                  Cloudflare CDN (planned)            │
└─────────────────────────────────────────────────────┘
```

### Key Stack Decisions

| Layer | Technology | Version/Notes |
|-------|------------|---------------|
| CMS Backend | WordPress | Headless mode |
| API | WPGraphQL | 2.12.0 |
| PHP | **8.2** | ✅ On staging |
| Frontend | Next.js | 15 (App Router) |
| Styling | Tailwind CSS | — |
| Language | TypeScript | Strict mode |
| Design | Dark Mode + Glassmorphism + #27A8DF | Frozen |

---

## ✅ Phase Progress

### Completed Phases

| Phase | Status | Output |
|-------|--------|--------|
| 1A — URL Mapping | ✅ COMPLETE | Redirect matrix for 174 posts |
| 1B — Entity Architecture | ✅ COMPLETE | 7 entities |
| 1C — Frontend Architecture | ✅ COMPLETE | Design system blueprint |
| 2A — Content Audit | ✅ COMPLETE | 174-post audit CSV |
| 2B — Content Model | ✅ COMPLETE | Entity definitions |
| 2C — Technical Spec | ✅ COMPLETE | ACF, GraphQL, Repository |
| **2D.1** | ✅ COMPLETE | Staging ready |
| **2D.2** | ✅ COMPLETE | 24 ACF field groups |
| **2D.3** | ✅ COMPLETE | 5 CPTs registered |
| **2D.4** | ✅ COMPLETE | Taxonomy reviewed |

### Phase 2D Implementation Order

```
✅ 2D.1 → Environment Preparation (STAGING READY)
✅ 2D.2 → ACF Fields (24 groups imported)
✅ 2D.3 → CPT Registration (Service, Location, Project, FAQ, Testimonial)
✅ 2D.4 → Taxonomy Setup (Categories/Tags reviewed)
⏳ 2D.5 → Relationship Fields ← NEXT
⏳ 2D.6 → WPGraphQL Setup
⏳ 2D.7 → Test Data Entry
⏳ 2D.8 → API Testing
⏳ 2D.9 → Content Migration
⏳ 2D.10 → Media Migration
⏳ 2D.11 → Redirect Implementation
⏳ 2D.12 → Migration QA
         ↓
  PHASE 3 → Next.js Development
```

---

## 🔒 Frozen Specifications (DO NOT MODIFY)

```
✅ snake_case field naming (short_description, not shortDescription)
✅ Repository pattern (components → repository.getBySlug() → GraphQL)
✅ ISR Caching: Service/Location 1h, Blog 24h, Legal 1 week
✅ Webhook revalidation on publish/update
✅ SEO boundary: WordPress owns metadata, Next.js generates JSON-LD
✅ No public mutations (admin-only writes)
✅ Dark Mode + Glassmorphism + #27A8DF
✅ Blog routing: /blog/[category]/ + /articles/[slug]/
✅ 7 Entities: Organization, Location, Service, Project, FAQ, Testimonial, BlogPost
```

---

## 🏠 Staging Environment (ACTIVE)

```
Staging URL:     https://backend.autospajakarta.com
Admin:           https://backend.autospajakarta.com/wp-admin
GraphQL:        https://backend.autospajakarta.com/graphql
PHP Version:     8.2 ✅
SSL Certificate: Active ✅
Database:        sql_staging_autospajakarta
Table Prefix:   wpa_
```

### Registered CPTs

| CPT | Slug | GraphQL | Field Groups |
|-----|------|---------|-------------|
| Service | service | ✅ services | 6 |
| Location | location | ✅ locations | 7 |
| Project | project | ✅ projects | 3 |
| FAQ | faq | ✅ fAQs | 2 |
| Testimonial | testimonial | ✅ testimonials | 3 |

### ACF Field Groups (24 total)

| CPT | Field Groups |
|-----|-------------|
| Service | Hero, Content, Packages, Gallery, Relationships, SEO |
| Location | Identity, Address, Geo, Business Hours, Content, Relationships, Gallery |
| Project | Content, Media, Relationships |
| FAQ | Content, Context |
| Testimonial | Content, Media, Context |
| Post | Relationships, Migration Status |
| Options | Site Configuration |

---

## 🔑 Server Access

### SSH
```bash
ssh -p 16916 root@148.230.101.241
```

### WP-CLI
```bash
/www/server/php/82/bin/php /tmp/wp-cli.phar
```

### Example Commands
```bash
# List services
/www/server/php/82/bin/php /tmp/wp-cli.phar --path=/www/wwwroot/backend.autospajakarta.com --allow-root post list --post_type=service

# List categories
/www/server/php/82/bin/php /tmp/wp-cli.phar --path=/www/wwwroot/backend.autospajakarta.com --allow-root term list category

# Test GraphQL
curl -s https://backend.autospajakarta.com/graphql -H 'Content-Type: application/json' -d '{"query":"{ services { nodes { title } } }"}'

# Flush rewrite rules
/www/server/php/82/bin/php /tmp/wp-cli.phar --path=/www/wwwroot/backend.autospajakarta.com --allow-root rewrite flush
```

---

## 📁 Project Structure

```
autospa_headless/
│
├── docs/                          # All project documentation
│   ├── AGENT-ONBOARDING.md        # This file
│   ├── GOVERNANCE.md              # AI Execute, Human Decide
│   │
│   ├── phase-1a-url-mapping.md     # URL inventory & redirects
│   ├── phase-1b-entity-architecture.md
│   ├── phase-1c-frontend-architecture.md
│   │
│   ├── phase-2a-*.md              # Content audit
│   ├── phase-2b-*.md              # Content model
│   ├── phase-2c-*.md              # Technical specs
│   ├── phase-2d-1-*.md            # Environment prep (COMPLETED)
│   └── phase-2d-implementation-roadmap.md
│
├── acf-json/                      # ACF field group JSON
│   ├── group_service.json         # 6 field groups
│   ├── group_location.json        # 7 field groups
│   ├── group_project.json         # 3 field groups
│   ├── group_faq.json             # 2 field groups
│   ├── group_testimonial.json      # 3 field groups
│   ├── group_post.json            # 2 field groups
│   └── group_site_config.json     # 1 field group
│
├── cpt/                           # CPT & taxonomy files
│   ├── cpt-registration.php        # Active CPT plugin
│   ├── taxonomy-setup.php         # Taxonomy setup
│   ├── consolidate-categories.php # Run during 2D.9
│   └── TAXONOMY-SETUP.md
│
├── data/
│   └── blog-audit-174.csv        # 174 posts with action/priority
│
├── src/                          # [TO BE CREATED] Next.js 15 app
│
├── coretan saya.md               # Server credentials
│
└── .remember/
    └── now.md                   # Session handoff buffer
```

---

## 🚫 What NOT To Do

1. **Never touch production WordPress** without explicit user approval
2. **Never modify production PHP** — staging only
3. **Never hardcode credentials** in documentation
4. **Never use camelCase** for field names
5. **Never create components that call GraphQL directly** — always use repository pattern
6. **Never skip phase gates** — complete each phase before proceeding

---

## 📞 Governance

**Rule:** "AI Execute, Human Decide"

- AI executes technical tasks autonomously
- Human decides: architecture, priorities, go/no-go gates
- AI asks for permission when uncertain
- AI documents everything before execution

---

## 🎯 Next Phase: 2D.5 - Relationship Fields

### Tasks
1. Verify Service ↔ Location relationship works
2. Verify Service ↔ Project relationship works
3. Verify Project ↔ Location relationship works
4. Test bidirectional linking
5. Verify GraphQL returns related data

### Reference
- ACF relationship fields already configured
- Need to create test data and verify queries work

---

## 📝 Notes for Agent

1. **Read `.remember/now.md`** at start of each session
2. **Read relevant phase docs** before implementing
3. **Update `.remember/now.md`** before ending session
4. **Keep credentials secure** — never commit to repo
5. **All code goes in `src/`** — Next.js app (future phase)
6. **UI reference** is in `archived/exsit-template/` — do not modify
