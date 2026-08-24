# Phase 2D.4: Taxonomy Setup Documentation

## AutoSP AJakarta - Headless WordPress Migration

**Status:** ✅ Setup Complete
**Date:** 2026-08-18
**Target:** Staging (backend.autospajakarta.com)

---

## Current State

### 1. Categories (WordPress Native)

| Category | Slug | Posts | Status |
|----------|------|-------|--------|
| Tips & Insight | tips-and-insight | 37 | ✅ Keep |
| Auto Detailing | auto-detailing | 9 | ✅ Keep (merge from Bengkel Detailing) |
| Coating | coating-mobil | 18 | ⚠️ Rename to 'coating' |
| Paint Protection Film | paint-protection-film | 16 | ✅ Keep |
| Rust Protection | rust-protection | 15 | ✅ Keep |
| Engine Detailing | engine-detailing | 9 | ✅ Keep (merge Interior/Eksterior) |
| Car Wash | car-wall | 2 | ✅ Keep (merge Glass Cleaning) |
| Salon Mobil | salon-mobil-jakarta | 19 | ⚠️ Rename to 'salon-mobil' |
| Mudik & Seasonal | mudik-lebaran | 9 | ⚠️ Rename |
| Uncategorized | uncategorized | 7 | ⚠️ NOINDEX |

**Note:** Actual category consolidation happens during Phase 2D.9 (Content Migration).

### 2. Tags (WordPress Native)

| Metric | Value |
|--------|-------|
| Total Tags | 1294+ |
| Recommended Action | Cleanup in Phase 2D.9 |

**Recommended Tags (per spec):**
- Generic: `detailing`, `coating`, `ppf`, `ceramic`
- Common: `tips`, `harga`, `review`
- Geographic: `jakarta`, `jabodetabek`

**Tag Limit:** Maximum 5 tags per post

### 3. Topic Field (ACF - Post)

| Field | Type | Location | Status |
|-------|------|----------|--------|
| Topic | text | Post Relationships | ✅ Available |

**Purpose:** Semantic classification independent of editorial categories

### 4. Service Areas (ACF - Location)

| Field | Type | Location | Status |
|-------|------|----------|--------|
| Service Areas | repeater | Location Content | ✅ Available |

**Purpose:** Store operational service areas per location (not taxonomy)

---

## Target Taxonomy Structure

```
Blog Post
├── Category (hierarchical, 9 categories)
├── Tag (flat, max 5 per post)
├── Topic (ACF text field)
├── Service (ACF relationship)
└── Location (ACF relationship)

Location Entity
├── service_areas[] (ACF repeater)
└── blog_posts[] (relationship)
```

---

## Category Consolidation Plan

| Old Category | New Category | Action |
|-------------|-------------|--------|
| Bengkel Detailing | Auto Detailing | MERGE |
| Salon Mobil Jakarta | Salon Mobil | RENAME |
| Coating Mobil | Coating | RENAME |
| Nano Ceramic Coating | Coating | MERGE |
| Interior Detailing | Engine Detailing | MERGE |
| Eksterior Detailing | Engine Detailing | MERGE |
| Glass Cleaning | Car Wash | MERGE |
| Experience | Tips & Insight | MERGE |
| Autospa Pluit | — | REMOVE from category |
| Uncategorized | — | NOINDEX |

**Script:** `consolidate-categories.php` (run during Phase 2D.9)

---

## Verification

### Check Categories
```bash
wp term list category --fields=name,slug,count
```

### Check Tags
```bash
wp term list post_tag --fields=name,slug,count | wc -l
```

### Verify ACF Fields
```bash
wp eval 'var_dump(acf_get_field_groups(["post_type" => "post"]));'
```

---

## Next Steps

1. ✅ Taxonomy review complete
2. ⏳ Category consolidation (Phase 2D.9)
3. ⏳ Tag cleanup (Phase 2D.9)
4. ⏳ Content migration

---

**Document Status:** ✅ Phase 2D.4 Complete
**Last Updated:** 2026-08-18
