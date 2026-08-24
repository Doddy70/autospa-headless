# PHASE 2D.1 - 2D.4 HANDOFF DOCUMENT
## AutoSP AJakarta Headless WordPress Migration

**Date:** 2026-08-18
**Status:** ✅ Phases 2D.1 - 2D.4 COMPLETED
**Prepared For:** Next Agent / Phase 2D.5

---

## EXECUTIVE SUMMARY

| Phase | Status | Key Deliverables |
|-------|--------|-----------------|
| 2D.1 Environment Prep | ✅ COMPLETE | Staging environment with PHP 8.2 |
| 2D.2 ACF Fields | ✅ COMPLETE | 24 field groups imported |
| 2D.3 CPT Registration | ✅ COMPLETE | 5 CPTs registered, GraphQL working |
| 2D.4 Taxonomy Setup | ✅ COMPLETE | Categories/Tags reviewed |

---

## 1. STAGING ENVIRONMENT

### Access
```
URL:     https://backend.autospajakarta.com
Admin:   https://backend.autospajakarta.com/wp-admin
GraphQL: https://backend.autospajakarta.com/graphql
PHP:     8.2
Database: sql_staging_autospajakarta
Prefix:  wpa_
```

### SSH Access
```bash
ssh -p 16916 root@148.230.101.241
```

### WP-CLI Commands
```bash
# WP-CLI binary location
/www/server/php/82/bin/php /tmp/wp-cli.phar

# Example: List services
/www/server/php/82/bin/php /tmp/wp-cli.phar --path=/www/wwwroot/backend.autospajakarta.com --allow-root post list --post_type=service

# Flush rewrite rules
/www/server/php/82/bin/php /tmp/wp-cli.phar --path=/www/wwwroot/backend.autospajakarta.com --allow-root rewrite flush
```

---

## 2. REGISTERED CUSTOM POST TYPES

| CPT | Slug | GraphQL | Test Post ID |
|-----|------|---------|--------------|
| Service | `service` | ✅ | 6856 |
| Location | `location` | ✅ | 6857 |
| Project | `project` | ✅ | 6858 |
| FAQ | `faq` | ✅ (fAQs) | 6859 |
| Testimonial | `testimonial` | ✅ (testimonials) | 6850 |

### GraphQL Test Queries
```graphql
{ services { nodes { title } } }
{ locations { nodes { title } } }
{ projects { nodes { title } } }
{ fAQs { nodes { title } } }
{ testimonials { nodes { title } } }
```

---

## 3. ACF FIELD GROUPS

### 24 Field Groups Total

| CPT | Groups | Sample Fields |
|-----|--------|---------------|
| Service | 6 | hero_image, short_description, packages (repeater), gallery, related_locations, seo_* |
| Location | 7 | identity, address, geo (lat/lng), opening_hours (repeater), service_areas (repeater), relationships |
| Project | 3 | vehicle_brand, before_images, project_service |
| FAQ | 2 | faq_question, faq_service, faq_location |
| Testimonial | 3 | customer_name, testimonial_service, testimonial_source |
| Post | 2 | topic (text), related_service, related_location, migration_status |
| Options | 1 | org_name, org_phone, social_*, default_seo_* |

### ACF Fields Location
```
/www/wwwroot/backend.autospajakarta.com/wp-content/mu-plugins/
├── cpt-registration.php      # CPT registration
└── acf-options-page.php       # Options page config
```

### JSON Files Location
```
/www/wwwroot/backend.autospajakarta.com/acf-json/
├── group_service.json
├── group_location.json
├── group_project.json
├── group_faq.json
├── group_testimonial.json
├── group_post.json
└── group_site_config.json
```

---

## 4. TAXONOMY STATUS

### Categories (17 total)

| Category | Posts | Action |
|----------|-------|--------|
| Tips & Insight | 37 | Keep |
| Bengkel Detailing | 23 | Merge → Auto Detailing |
| Salon Mobil Jakarta | 19 | Rename → Salon Mobil |
| Coating Mobil | 18 | Rename → Coating |
| Paint Protection Film | 16 | Keep |
| Rust Protection | 15 | Keep |
| Engine Detailing | 9 | Keep (merge Interior/Eksterior) |
| Auto Detailing | 9 | Keep |
| Mudik Lebaran | 9 | Rename → Mudik & Seasonal |
| Experience | 3 | Merge → Tips & Insight |
| Eksterior Detailing | 3 | Merge → Engine Detailing |
| Glass Cleanning | 2 | Merge → Car Wash |
| Interior Detailing | 2 | Merge → Engine Detailing |
| Car Wash | 2 | Keep |
| Nano Ceramic Coating | 4 | Merge → Coating |
| Uncategorized | 7 | NOINDEX |
| Autospa Pluit | 25 | REMOVE from category |

**Note:** Category consolidation will happen during Phase 2D.9.

### Tags
- Total: 1294+
- Recommended cleanup: Phase 2D.9
- Keep: detailing, coating, ppf, ceramic, tips, harga, review, jakarta
- Max per post: 5

---

## 5. RELATIONSHIP FIELDS (ACF)

### Post Relationships
| Field | Type | Purpose |
|-------|------|---------|
| topic | text | Semantic classification |
| related_service | relationship | Service link |
| related_location | relationship | Location link |

### Service Relationships
| Field | Type |
|-------|------|
| related_locations | relationship |
| related_projects | relationship |
| related_faqs | relationship |
| related_services | relationship |
| service_category | select |

### Location Relationships
| Field | Type |
|-------|------|
| location_services | relationship |
| location_testimonials | relationship |
| location_faqs | relationship |
| service_areas | repeater (text) |

### Project Relationships
| Field | Type |
|-------|------|
| project_service | relationship |
| project_location | relationship |

---

## 6. ISSUES RESOLVED

### ACF Import Issues
- Original import script caused double-serialization of `_location` meta
- Fixed using `fix-locations-direct.php` (direct DB update)
- Field groups now properly associated with CPTs

### Field Meta Issues
- Imported fields missing `_key`, `_name`, `_type` meta
- Fixed using `fix-field-meta.php` (109 fields processed)
- All fields now properly configured

### Nginx Configuration
- Added WordPress rewrite rules to nginx config
- GraphQL endpoint now working properly

---

## 7. PHASE 2D.5 READINESS

### Pre-conditions Met
- [x] CPTs registered
- [x] ACF fields created
- [x] ACF fields linked to CPTs
- [x] GraphQL queries working

### For Phase 2D.5 Testing
1. Create test data linking Service ↔ Location
2. Create test data linking Service ↔ Project
3. Verify bidirectional relationships work in GraphQL
4. Document any issues

---

## 8. FILES CREATED

### Local Project Files
```
autospa_headless/
├── docs/
│   └── AGENT-ONBOARDING.md          # Updated for current state
│
├── acf-json/
│   ├── group_*.json                 # 7 field group JSON files
│   ├── README.md                   # Deployment guide
│   └── import-acf.php              # Import script
│
├── cpt/
│   ├── cpt-registration.php        # CPT plugin
│   ├── taxonomy-setup.php          # Taxonomy plugin
│   ├── consolidate-categories.php  # Run in 2D.9
│   ├── fix-acf-locations.php      # Helper
│   ├── fix-locations-direct.php    # DB fix
│   ├── fix-field-meta.php         # Field meta fix
│   └── TAXONOMY-SETUP.md          # Documentation
│
└── .remember/
    └── now.md                     # Session state
```

### Server Files
```
/www/wwwroot/backend.autospajakarta.com/
├── wp-content/
│   └── mu-plugins/
│       ├── cpt-registration.php
│       └── acf-options-page.php
├── acf-json/
│   ├── *.json                    # ACF field groups
│   └── fix-*.php                 # Fix scripts
└── wp-config.php                 # Staging config
```

---

## 9. KNOWN ISSUES

| Issue | Severity | Status |
|-------|----------|--------|
| WordPress 7.0.4 anomaly | Medium | Documented, not blocking |
| Production PHP 7.4.33 EOL | High | Staging uses 8.2 ✅ |
| element-camp memory issue | Low | Not tested on staging |
| SSL cert (production) | Medium | Staging SSL active ✅ |

---

## 10. NEXT STEPS

### Immediate (Phase 2D.5)
1. Test relationship fields with sample data
2. Verify GraphQL returns related entities
3. Document any issues

### Upcoming (Phase 2D.6 - 2D.12)
- Phase 2D.6: WPGraphQL Setup
- Phase 2D.7: Test Data Entry
- Phase 2D.8: API Testing
- Phase 2D.9: Content Migration (run consolidate-categories.php)
- Phase 2D.10: Media Migration
- Phase 2D.11: Redirect Implementation
- Phase 2D.12: Migration QA

---

## SIGN-OFF

| Phase | Lead | Date |
|-------|------|------|
| 2D.1 Environment Prep | ✅ | 2026-08-18 |
| 2D.2 ACF Fields | ✅ | 2026-08-18 |
| 2D.3 CPT Registration | ✅ | 2026-08-18 |
| 2D.4 Taxonomy Setup | ✅ | 2026-08-18 |

**Next Agent:** Review this document, read `.remember/now.md`, then proceed to Phase 2D.5.

---

**Document Status:** ✅ COMPLETED
**Last Updated:** 2026-08-18
