# AutoSPA Jakarta — Headless WordPress Migration

**Stack:** Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4
**Backend:** WordPress headless CMS (WPGraphQL 2.19.0 + WPGraphQL ACF 2.7.1, PHP 8.2)
**Last Updated:** 2026-10-29

---

## 📋 Current Phase

### Phase 2E COMPLETED — Headless Content Sync & Article API

```
✅ 2D.1 → Environment Preparation (staging, PHP 8.2)
✅ 2D.2 → ACF Fields (24 field groups)
✅ 2D.3 → CPT Registration (5 CPTs)
✅ 2D.4 → Taxonomy Setup
✅ 2D.5 → Relationship Testing
✅ 2D.6 → WPGraphQL ACF Setup
✅ 2D.7 → Test Data Entry
✅ 2D.8 → API Testing (20/20 PASS)
✅ 2D.9 → Content Migration
✅ 2E   → Headless Content Sync & Article API
        ↓
  NEXT → Content Migration hardening, media migration, redirects, QA
```

**Production is READ ONLY.** All development happens on staging.

### Staging Status

| Component | Status |
|-----------|--------|
| URL | https://backend.autospajakarta.com |
| PHP | 8.2 ✅ |
| WPGraphQL | 2.19.0 ✅ (staging `/graphql` returns 404 — see Known Issues) |
| ACF | ✅ |
| CPTs | 5 registered ✅ |

---

## 🔒 Gate 0 — Production Read Only

```
┌──────────────────────────────────────┐
│  GATE 0 — PRODUCTION READ ONLY │
│  No production changes.               │
└──────────────────────────────────────┘
```

Content is served from the read-only mirror in `src/content/pages/*.html` plus
`public/wp-content/**`. Nothing is fetched from production at runtime.

---

## 📁 Project Structure

```
autospa/
│
├── docs/                              # Project documentation (3 docs)
├── scripts/sync/                      # Content sync + verification pipeline
├── src/
│   ├── app/
│   │   ├── (inner)/                   # Shared layout group (sticky Navbar)
│   │   │   ├── blog/                  # Article list + detail + categories
│   │   │   ├── services/              # Service catalogue + [slug]
│   │   │   ├── faq/ team/ pricing/    # Native pages
│   │   │   ├── reservasi/             # Booking form
│   │   │   ├── our-services/          # Service overview
│   │   │   ├── premium-coating-lp/    # Landing page
│   │   │   └── terms|privacy|cookie/  # Legal
│   │   ├── api/                       # Read-only REST proxy routes
│   │   └── page.tsx                   # Homepage (native)
│   ├── components/
│   │   ├── ui/                        # Tailwind v4 kit (Accordion, CtaBand…)
│   │   ├── content/                   # Elementor + article renderers
│   │   ├── contact/  home/  shared/   # Feature components
│   ├── content/                       # Mirrored page HTML + structured data
│   ├── data/                          # Extracted service catalogue
│   └── lib/wordpress/                 # Repository layer (html, pages, rest)
│
├── public/wp-content/                 # Mirrored media (gitignored, rebuilt)
└── acf-json/ cpt/ data/               # WordPress-side source of truth
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│              WordPress (Headless CMS)               │
│              WPGraphQL 2.19.0 / ACF 2.7.1           │
│              Production = READ ONLY                 │
└──────────────────────┬──────────────────────────────┘
                       │ REST (read-only, read at build time)
                       ▼
┌─────────────────────────────────────────────────────┐
│              Next.js 15 (App Router)                │
│              SSG + ISR, TypeScript, Tailwind v4     │
└─────────────────────────────────────────────────────┘
```

---

## 🔑 Key Technical Decisions (LOCKED)

1. **snake_case** field naming throughout (e.g. `short_description`)
2. **Repository pattern** — components use repositories, not raw fetch
3. **Read-only origin** — the app never mutates WordPress
4. **Mirror + native pages** — Elementor layouts ship as snapshots; commercial
   pages (services, pricing, booking) are native React
5. **No public mutations** — WordPress admin only
6. **Design** — Dark Mode + Glassmorphism + #27A8DF

---

## 🔗 Server Access

### SSH
```bash
ssh -p 16916 root@148.230.101.241
```

### WP-CLI
```bash
/www/server/php/82/bin/php /tmp/wp-cli.phar \
  --path=/www/wwwroot/backend.autospajakarta.com --allow-root
```

### GraphQL Test
```bash
curl -s https://backend.autospajakarta.com/graphql \
  -H 'Content-Type: application/json' \
  -d '{"query":"{ services { nodes { title } }"}'
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| `docs/phase-2e-headless-content-sync.md` | Content sync pipeline, routes, env vars |
| `docs/security-elementor-pro-nulled-backdoor.md` | Backdoor found in the nulled Elementor Pro drop |
| `docs/agntix-standalone-evaluation.md` | Evaluation of the Agntix template as an alternative frontend |

The phase 1A–2D9 planning documents were retired in favour of the Phase 2E
architecture; their content remains in the git history.

---

## 🎯 Project Goals

1. **SEO Optimization** — Maximize organic search visibility
2. **GEO Targeting** — Local SEO for Jabodetabek area
3. **CRO Integration** — Search → Education → Trust → Proof → CTA
4. **Performance** — Core Web Vitals optimization
