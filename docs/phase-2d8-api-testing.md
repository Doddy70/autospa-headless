# Phase 2D.8: API Contract Testing

**Date:** 2026-08-20
**Status:** IN PROGRESS
**Objective:** Prove WordPress + ACF + WPGraphQL data pipeline works for frontend consumption

---

## Pipeline to Verify

```
WordPress (database)
    ↓
ACF (field groups)
    ↓
WPGraphQL ACF plugin
    ↓
GraphQL Schema (nested structure)
    ↓
GraphQL Query
    ↓
Response
    ↓
Next.js Repository Layer
    ↓
TypeScript Types
```

---

## Test Matrix

| Test | Description | Expected Result |
|------|-------------|-----------------|
| API-01 | Service query by slug | Valid response |
| API-02 | Location query by slug | Valid response |
| API-03 | Project query by slug | Valid response |
| API-04 | FAQ query | Valid response |
| API-05 | Testimonial query | Valid response |
| API-06 | Service → Location (M:N) | Array of locations |
| API-07 | Location → Service (M:N) | Array of services |
| API-08 | Service → Project (M:N) | Array of projects |
| API-09 | Project → Service (N:1) | Single service |
| API-10 | Project → Location (N:1) | Single location (may be null) |
| API-11 | FAQ → Service (N:1) | Single service |
| API-12 | FAQ → Location (N:1) | Single location |
| API-13 | Nested ACF fields | Complete structure |
| API-14 | Repeater fields | Array of items |
| API-15 | Package → vehicle sizes | Nested structure |
| API-16 | SEO fields | String values |
| API-17 | Pagination | cursor-based |
| API-18 | Empty relationships | null or [] (no error) |
| API-19 | Invalid/nonexistent slug | null (404) |
| API-20 | Draft vs Published | Draft not exposed |

---

## Key Testing Requirements

### 1. Slug-Based Queries (Production Pattern)

Frontend URLs will be:
```
/services/nano-ceramic-coating
/locations/pluit
/projects/toyota-alphard-ceramic-coating
```

Test queries MUST use slug:
```graphql
service(id: "nano-ceramic-coating", idType: SLUG)
```

NOT:
```graphql
service(id: "6994", idType: DATABASE_ID)  # This is test pattern only
```

### 2. Actual Query Names

Use introspection to find correct query names. Expected:
- `serviceBy` or `service` with SLUG idType
- Similar pattern for other CPTs

### 3. Published vs Draft

Create a draft post and verify:
- Published → visible in GraphQL
- Draft → NOT visible (should return null)

### 4. Empty Relationships

Must return valid response:
```json
{
  "service": {
    "relatedProjects": null  // or []
  }
}
```

NOT a query error.

### 5. Missing Slug

Must return predictable null:
```json
{
  "service": null
}
```

NOT a 500 error.

---

## API Contract Output

After testing, document:

```typescript
// Next.js Repository Interface

interface ServiceRepository {
  getBySlug(slug: string): Promise<Service | null>
  getAll(options?: GetAllOptions): Promise<Service[]>
  getRelated(slug: string): Promise<Service[]>
}

// GraphQL Query Contract

query GetServiceBySlug($slug: String!) {
  serviceBy(slug: $slug) {  // ← ACTUAL NAME FROM SCHEMA
    databaseId
    title
    serviceContent {
      shortDescription
      benefits { benefitTitle }
    }
    serviceRelationships {
      relatedLocations { nodes { databaseId } }
    }
  }
}
```

---

## Scripts to Create

1. `test-slug-queries.php` - Test slug-based retrieval
2. `test-relationships.php` - Test all relationship directions
3. `test-pagination.php` - Test pagination
4. `test-visibility.php` - Test draft vs published
5. `test-empty-invalid.php` - Test empty relationships and invalid slugs

---

## Deliverables

1. **API Contract Document** - Actual query names and field mappings
2. **Test Results Matrix** - All 20 tests passed/failed
3. **Repository Interface** - TypeScript interface ready for Next.js
4. **Updated Handoff** - For next agent
