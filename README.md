# AutoSPA Jakarta - Headless WordPress Project

**Stack:** Next.js 15 + React 19 + TypeScript + Tailwind CSS + WPGraphQL + Headless WordPress
**Last Updated:** 2026-08-18

---

## 📋 Current Phase

### Phase 2D.4 COMPLETED — Next: 2D.5

```
✅ 2D.1 → Environment Preparation (STAGING READY)
✅ 2D.2 → ACF Fields (24 field groups)
✅ 2D.3 → CPT Registration (5 CPTs)
✅ 2D.4 → Taxonomy Setup (reviewed)
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

### Staging Status

| Component | Status |
|-----------|--------|
| URL | https://backend.autospajakarta.com |
| PHP | 8.2 ✅ |
| SSL | Active ✅ |
| WPGraphQL | Working ✅ |
| ACF | 6.8.7 ✅ |
| CPTs | 5 registered ✅ |

---

## 🔒 Gate 0 — Production Read Only

```
┌──────────────────────────────────────┐
│  GATE 0 — PRODUCTION READ ONLY │
│  No production changes.               │
└──────────────────────────────────────┘
```

---

## 📁 Project Structure

```
autospa_headless/
│
├── docs/                              # Project documentation
│   ├── AGENT-ONBOARDING.md           # Agent onboarding guide
│   ├── PHASE-2D1-2D4-HANDOFF.md    # Phases 2D.1-2D.4 handoff
│   ├── phase-2c-*.md                # Technical specifications
│   └── phase-2d-*.md                # Implementation roadmaps
│
├── acf-json/                         # ACF field group JSON files
│   ├── group_service.json            # 6 field groups
│   ├── group_location.json           # 7 field groups
│   ├── group_project.json            # 3 field groups
│   ├── group_faq.json               # 2 field groups
│   ├── group_testimonial.json        # 3 field groups
│   ├── group_post.json              # 2 field groups
│   └── group_site_config.json       # 1 field group
│
├── cpt/                              # CPT & taxonomy files
│   ├── cpt-registration.php          # CPT registration plugin
│   ├── taxonomy-setup.php           # Taxonomy setup
│   └── consolidate-categories.php   # Run during 2D.9
│
├── data/
│   └── blog-audit-174.csv           # 174 posts with action/priority
│
├── src/                              # [TO BE CREATED] Next.js 15 app
│
├── archived/
│   └── exsit-template/              # UI reference (NOT active)
│
├── coretan saya.md                  # Server access credentials
│
└── .remember/
    └── now.md                      # Session handoff buffer
```

---

## 🏗️ Architecture (FROZEN)

```
┌─────────────────────────────────────────────────────┐
│                  WordPress (Headless CMS)            │
│                  backend.autospajakarta.com           │
│                  PHP 8.2                            │
│                  WPGraphQL 2.12.0                    │
└──────────────────────┬──────────────────────────────┘
                       │ GraphQL
                       ▼
┌─────────────────────────────────────────────────────┐
│                  Next.js 15 (Frontend)              │
│                  App Router, TypeScript              │
│                  Dark Mode + Glassmorphism          │
└─────────────────────────────────────────────────────┘
```

---

## 🔑 Key Technical Decisions (LOCKED)

1. **snake_case** field naming throughout (e.g., `short_description`)
2. **Repository pattern** — components use repositories, not raw GraphQL
3. **ISR caching** — Service/Location 1h, Blog 24h, Legal 1 week
4. **Webhook revalidation** — WordPress → Next.js cache clear
5. **SEO boundary** — WordPress owns metadata
6. **No public mutations** — WordPress admin only
7. **Blog routing** — /blog/[category]/ + /articles/[slug]/
8. **Design** — Dark Mode + Glassmorphism + #27A8DF

---

## 🔗 Server Access

### SSH
```bash
ssh -p 16916 root@148.230.101.241
```

### WP-CLI
```bash
/www/server/php/82/bin/php /tmp/wp-cli.phar
```

### GraphQL Test
```bash
curl -s https://backend.autospajakarta.com/graphql \
  -H 'Content-Type: application/json' \
  -d '{"query":"{ services { nodes { title } }"}'
```

---

## 📚 Documentation

### Key Documents
| Document | Description |
|----------|-------------|
| `docs/AGENT-ONBOARDING.md` | Agent onboarding guide |
| `docs/PHASE-2D1-2D4-HANDOFF.md` | Phases 2D.1-2D.4 handoff |
| `docs/phase-2d-implementation-roadmap.md` | Full 12-step checklist |

### Phase 2C Technical Specifications
| Document | Description |
|----------|-------------|
| `docs/phase-2c-acf-specification.md` | ACF field names, types |
| `docs/phase-2c-wpgraphql-schema.md` | GraphQL types, connections |
| `docs/phase-2c-query-architecture.md` | Repository pattern, caching |
| `docs/phase-2c-api-contract.md` | Endpoints, errors |
| `docs/phase-2c-seo-migration-contract.md` | Redirect matrix |

### Content Model
| Document | Description |
|----------|-------------|
| `docs/phase-2b-content-model.md` | 7 entities defined |
| `docs/phase-2b-relationship-map.md` | M:N relationships |
| `docs/phase-2b-taxonomy.md` | WordPress taxonomy |

---

## 🎯 Project Goals

1. **SEO Optimization** — Maximize organic search visibility
2. **GEO Targeting** — Local SEO for Jabodetabek area
3. **CRO Integration** — Search → Education → Trust → Proof → CTA
4. **Performance** — Core Web Vitals optimization
