# Agent Onboarding Prompt
## AutoSP AJakarta - Phase 2D.5+ Continuation

---

## 🎯 Your Mission

Continue the WordPress Headless CMS implementation for AutoSP AJakarta. You are starting at **Phase 2D.5: Relationship Fields**.

---

## 📍 Current Project State

### Completed Phases (2D.1 - 2D.4)

| Phase | Status | Key Deliverable |
|-------|--------|-----------------|
| 2D.1 Environment Prep | ✅ | Staging environment ready |
| 2D.2 ACF Fields | ✅ | 24 field groups imported |
| 2D.3 CPT Registration | ✅ | 5 CPTs registered, GraphQL working |
| 2D.4 Taxonomy Setup | ✅ | Categories/Tags reviewed |

### Next Target: Phase 2D.5

```
2D.5 → Relationship Fields ← START HERE
2D.6 → WPGraphQL Setup
2D.7 → Test Data Entry
2D.8 → API Testing
2D.9 → Content Migration
2D.10 → Media Migration
2D.11 → Redirect Implementation
2D.12 → Migration QA
         ↓
  PHASE 3 → Next.js Development
```

---

## 🏠 Staging Environment

```
URL:        https://backend.autospajakarta.com
Admin:      https://backend.autospajakarta.com/wp-admin
GraphQL:    https://backend.autospajakarta.com/graphql
PHP:        8.2
Database:   sql_staging_autospajakarta
Table Prefix: wpa_
```

### SSH Access
```bash
ssh -p 16916 root@148.230.101.241
```

### WP-CLI
```bash
/www/server/php/82/bin/php /tmp/wp-cli.phar
```

---

## 📊 What Exists on Staging

### 5 Registered CPTs

| CPT | Slug | GraphQL Query |
|-----|------|---------------|
| Service | service | `{ services { nodes { title } } }` |
| Location | location | `{ locations { nodes { title } } }` |
| Project | project | `{ projects { nodes { title } } }` |
| FAQ | faq | `{ fAQs { nodes { title } } }` |
| Testimonial | testimonial | `{ testimonials { nodes { title } } }` |

### 24 ACF Field Groups

| CPT | Field Groups | Key Fields |
|-----|-------------|-----------|
| Service | 6 | hero_image, short_description, packages (repeater), gallery, related_locations, seo_* |
| Location | 7 | identity, address, geo (lat/lng), opening_hours (repeater), content, location_services, service_areas (repeater) |
| Project | 3 | vehicle_brand, before/after_images, project_service, project_location |
| FAQ | 2 | faq_question, faq_service, faq_location |
| Testimonial | 3 | customer_name, testimonial_service, testimonial_source |
| Post | 2 | topic (text), related_service, related_location, migration_status |
| Options | 1 | org_name, social_*, default_seo_* |

### Test Posts Created

| Post ID | Type | Title |
|---------|------|-------|
| 6856 | Service | Nano Ceramic Coating |
| 6857 | Location | AutoSP Pluit |
| 6858 | Project | Toyota Alphard Ceramic Coating |
| 6859 | FAQ | Berapa lama proses ceramic coating? |
| 6860 | Testimonial | Bpk. John Doe |

---

## 📋 Phase 2D.5 Tasks

### Objective: Verify relationship fields work bidirectionally

#### 1. Verify ACF Relationship Fields

Check these fields exist and are properly configured:

```
Service:
  - related_locations (relationship)
  - related_projects (relationship)
  - related_faqs (relationship)
  - service_category (select)

Location:
  - location_services (relationship)
  - service_areas (repeater)

Project:
  - project_service (relationship)
  - project_location (relationship)

FAQ:
  - faq_service (relationship)
  - faq_location (relationship)

Testimonial:
  - testimonial_service (relationship)
  - testimonial_location (relationship)

Post:
  - post_service (relationship)
  - post_location (relationship)
```

#### 2. Test Bidirectional Relationships

Create test data to verify:

```graphql
# Test: Link Service to Location
mutation {
  updateService(input: {
    id: "service_ID"
    relatedLocations: ["location_ID"]
  }) {
    service {
      relatedLocations {
        nodes {
          title
        }
      }
    }
  }
}
```

#### 3. Verify GraphQL Returns Related Data

Test queries like:

```graphql
# Get service with related locations
{
  service(id: "service_ID") {
    title
    relatedLocations {
      nodes {
        title
        locationPhone
      }
    }
  }
}

# Get location with its services
{
  location(id: "location_ID") {
    title
    locationServices {
      nodes {
        title
        serviceCategory
      }
    }
  }
}
```

---

## 🔑 Critical Rules

### Gate 0

```
🔴 PRODUCTION IS READ ONLY
🔴 All development on STAGING ONLY
🔴 No changes without explicit approval
```

### Naming Convention

```
✅ CORRECT: short_description, vehicle_sizes, geo_latitude
❌ WRONG:   shortDescription, vehicleSizes
```

### Repository Pattern (for Phase 3)

```
✅ CORRECT:
   component → useServiceRepository() → repository.getBySlug() → GraphQL

❌ WRONG:
   component → fetch('/graphql', { body: query })
```

---

## 📁 Key Files

### Local Project
```
autospa_headless/
├── docs/
│   ├── AGENT-ONBOARDING.md        # Full onboarding doc
│   ├── PHASE-2D1-2D4-HANDOFF.md # Handoff doc
│   └── phase-2c-*.md              # Technical specs
├── acf-json/                       # ACF JSON files
├── cpt/                           # CPT plugins & scripts
└── .remember/
    └── now.md                    # Current state
```

### Server Files
```
/www/wwwroot/backend.autospajakarta.com/
├── wp-content/mu-plugins/
│   ├── cpt-registration.php
│   └── acf-options-page.php
└── acf-json/
    └── *.json
```

---

## 📖 Read First

Before doing anything, read these files:

1. **`docs/AGENT-ONBOARDING.md`** - Complete project context
2. **`docs/PHASE-2D1-2D4-HANDOFF.md`** - Detailed handoff of completed work
3. **`.remember/now.md`** - Current session state
4. **`docs/phase-2c-acf-specification.md`** - Field specifications
5. **`docs/phase-2b-relationship-map.md`** - Relationship specs

---

## 🎯 Your First Actions

### Step 1: Verify Staging
```bash
# SSH to server
ssh -p 16916 root@148.230.101.241

# Test GraphQL
curl -s https://backend.autospajakarta.com/graphql \
  -H 'Content-Type: application/json' \
  -d '{"query":"{ services { nodes { title } } }"}'
```

### Step 2: Check Current State
```bash
# List CPTs
/www/server/php/82/bin/php /tmp/wp-cli.phar \
  --path=/www/wwwroot/backend.autospajakarta.com \
  --allow-root post list --post_type=service

# Check categories
/www/server/php/82/bin/php /tmp/wp-cli.phar \
  --path=/www/wwwroot/backend.autospajakarta.com \
  --allow-root term list category
```

### Step 3: Read Documentation
- Open `docs/PHASE-2D1-2D4-HANDOFF.md`
- Understand what was built
- Note any issues encountered

### Step 4: Start Phase 2D.5
- Create test data linking entities
- Verify relationship fields work
- Test GraphQL queries for relationships

---

## ⚠️ Known Issues from Previous Session

1. **ACF Import** - Had double-serialization issue, fixed with `fix-locations-direct.php`
2. **Field Meta** - Some imported fields missing meta, fixed with `fix-field-meta.php`
3. **Nginx** - Needed WordPress rewrite rules added to config

If you encounter similar issues, check those fix scripts.

---

## 📞 If Stuck

1. Check `docs/PHASE-2D1-2D4-HANDOFF.md` for details
2. Check `.remember/now.md` for current state
3. Use `Skill: systematic-debugging` for complex issues
4. Use `Skill: brainstorming` for design decisions

---

## ✅ Sign-Off Before Next Phase

Phase 2D.5 is complete when:
- [ ] Relationship fields verified in ACF
- [ ] Test data created linking entities
- [ ] GraphQL queries return related data
- [ ] Bidirectional links work
- [ ] Document any issues

---

**Start:** Read the handoff document, then begin Phase 2D.5.
