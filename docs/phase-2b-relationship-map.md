# PHASE 2B: RELATIONSHIP MAP
## AutoSP AJakarta - Headless WordPress Project

**Project:** Headless WordPress → Next.js for SEO/GEO Rebuild
**Date:** 2026-08-18
**Status:** FINAL - Relationships Locked

---

## 1. RELATIONSHIP OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ENTITY RELATIONSHIPS                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│    ┌──────────────┐                                                       │
│    │ ORGANIZATION │                                                       │
│    └──────┬───────┘                                                       │
│           │ 1:N                                                          │
│           ▼                                                               │
│    ┌──────────────┐                                                       │
│    │  LOCATION    │◄──────────────────────────┐                            │
│    └──────┬───────┘                           │                            │
│           │                                   │                            │
│    ┌──────┴───────┐                    ┌────┴────┐                      │
│    │              │                    │         │                       │
│    ▼              ▼                    ▼         ▼                        │
│ ┌──────┐    ┌──────┐          ┌──────────┐  ┌─────┐                   │
│ │Project│    │ FAQ  │          │ Service  │  │Testi│                   │
│ └──┬───┘    └──┬───┘          └────┬─────┘  └──┬──┘                   │
│    │           │                    │            │                        │
│    │           │               ┌────┴────┐      │                        │
│    │           │               ▼         ▼      │                        │
│    │           │           ┌───────┐  ┌────┐  │                        │
│    │           │           │Package│  │ FAQ│──┘                        │
│    │           │           └───────┘  └────┘                             │
│    │           │                                                      │
│    │           └──────────────────────────────────────┐                │
│    │                                                      │                │
│    └─────────────────────────────────────────────────────┘                │
│                                                                          │
│    ┌──────────────────────────────────────────────────────────────────┐   │
│    │                         BLOG (Post)                              │   │
│    │                                                                  │   │
│    │    Category ◄─────────► Topic ◄─────────► Service (optional)    │   │
│    │                                  │                               │   │
│    │                                  └──────────► Location (optional) │   │
│    │                                                                  │   │
│    └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. DETAILED RELATIONSHIP SPECIFICATIONS

### 2.1 Organization → Location

```
Type: 1:N (One Organization, Many Locations)

Organization
    │
    └── locations[] ──────► Location[]

Implementation:
- Organization is global singleton
- Locations reference Organization
- No reverse pointer in Location model
```

**Rationale:** Single brand, multiple physical branches

---

### 2.2 Location ↔ Service

```
Type: M:N (Many-to-Many)

Location ────────────────► Service
    │                          │
    │ ◄────────────────────────┘
    │
    └── services[] ──────► Available services at this location

Not all locations have all services.
Not all services are available at all locations.
```

**Example:**
| Location | Services Available |
|----------|------------------|
| Pluit | Ceramic, PPF, Detailing, Wash, Engine, Rust |
| PIK 2 | Ceramic, PPF, Detailing, Wash |
| Express Depok | Detailing, Wash only |

**Why this matters:**
- Service page shows "Available at: Pluit, PIK 2, ..."
- Location page shows "Services: Detailing, Premium Wash"
- GEO targeting based on service availability

**Implementation:**
```typescript
// On Location
services: ServiceReference[]

// On Service  
locations: LocationReference[]
```

---

### 2.3 Service → Package

```
Type: 1:N (Embedded, not separate CPT)

Service
    │
    └── packages[] ──────► ServicePackage[]

ServicePackage is embedded in Service, not a separate entity.
```

**Rationale:**
- Packages are variants of the same service
- No independent SEO pages for packages
- Pricing display is component-based rendering

**Exception:** If future analysis shows package needs its own page (e.g., `/services/ceramic/light-package/`), then promote to CPT.

---

### 2.4 Service ↔ Project

```
Type: 1:N (One Service, Many Projects)

Service
    │
    └── projects[] ──────► Project[]

Project
    │
    └── service ──────────► Service
```

**Rationale:**
- Projects demonstrate proof-of-work for service
- Each project has one primary service
- Projects may link to location where work was done

---

### 2.5 Location → Project

```
Type: 1:N (One Location, Many Projects)

Location
    │
    └── projects[] ──────► Project[]

Project
    │
    └── location? ────────► Location (optional)
```

**Rationale:**
- Track which projects were done at which location
- Show "Recent work at Pluit" on location page
- Optional: some projects may not have specific location

---

### 2.6 Service ↔ FAQ

```
Type: 1:N (One Service, Many FAQs)

Service
    │
    └── faqs[] ──────► FAQ[]

FAQ
    │
    └── context ────────► { type: 'service', service: Service }

FAQs can be:
- Global (type: 'global')
- Service-specific (type: 'service')
- Location-specific (type: 'location')
```

**Display Logic:**
| FAQ Context | /faq/ | /services/[slug]/ | /locations/[slug]/ |
|-------------|-------|------------------|---------------------|
| global | ✅ | ✅ | ✅ |
| service | ❌ | ✅ | ❌ |
| location | ❌ | ❌ | ✅ |

---

### 2.7 Location ↔ Testimonial

```
Type: 1:N (Optional relationship)

Location
    │
    └── testimonials[] ──────► Testimonial[]

Testimonial
    │
    └── location? ────────► Location (optional)
```

**Rationale:**
- Some testimonials are tied to location
- Some testimonials are brand-level (no location)

---

### 2.8 Blog → Service

```
Type: N:1 (Optional relationship)

Post (Blog)
    │
    └── relationships.service ──────► Service (optional)

Post
    │
    └── relationships.location ──────► Location (optional)
```

**Important:**
- Blog-to-Service is OPTIONAL
- Not every post should force-link to a service
- "Apa itu Ceramic Coating" → Service: Ceramic
- "Tips Cuci Mobil" → No specific service needed

**Benefits of proper linking:**
- Enables "Related Articles" on service pages
- Enables "Related Service" on blog pages
- Builds semantic knowledge graph

---

## 3. GRAPHQL QUERY PATTERNS

### 3.1 Service with Related Data

```graphql
query ServicePage($slug: String!) {
  service(slug: $slug) {
    id
    title
    slug
    excerpt
    description
    
    # Related entities
    locations {
      id
      name
      address { city }
    }
    
    packages {
      id
      name
      tier
      pricing { small medium large xlarge super }
      includes
    }
    
    faqs(context: { type: service }) {
      question
      answer
    }
    
    projects(first: 6) {
      id
      title
      vehicle { brand model }
      afterImages { url }
    }
  }
}
```

### 3.2 Location with Related Data

```graphql
query LocationPage($slug: String!) {
  location(slug: $slug) {
    id
    name
    address { street city }
    contact { phone whatsapp }
    openingHours { day open close }
    
    # Related entities
    services {
      id
      title
      slug
    }
    
    projects(first: 6) {
      id
      title
      vehicle { brand model }
    }
    
    faqs(context: { type: location }) {
      question
      answer
    }
  }
}
```

### 3.3 Project with Full Context

```graphql
query ProjectPage($slug: String!) {
  project(slug: $slug) {
    id
    title
    vehicle { brand model year color }
    description
    
    # Relationships
    service {
      id
      title
      slug
    }
    location {
      id
      name
      address { city }
    }
    
    # Media
    beforeImages { url }
    afterImages { url }
  }
}
```

### 3.4 Blog with Relationships

```graphql
query BlogPost($slug: String!) {
  post(slug: $slug) {
    id
    title
    content
    date
    
    # Relationships (optional)
    relationships {
      topic
      service {
        id
        title
        slug
      }
      location {
        id
        name
        slug
      }
    }
    
    # Related content
    relatedPosts(first: 3) {
      id
      title
      slug
    }
  }
}
```

---

## 4. PAGE TEMPLATE DATA REQUIREMENTS

### 4.1 Service Page

```
Required Data:
├── Service
│   ├── title, slug, excerpt, description
│   ├── heroImage
│   ├── benefits[]
│   ├── process[]
│   ├── packages[]
│   └── technology[]
│
├── Locations (available)
│   └── id, name, address.city
│
├── FAQ (service context)
│   └── question, answer
│
├── Projects (proof)
│   └── id, title, vehicle, afterImages
│
├── Related Services
│   └── id, title, slug
│
└── Organization
    └── name, phone, whatsapp
```

### 4.2 Location Page

```
Required Data:
├── Location
│   ├── name, slug, address, coordinates
│   ├── contact { phone, whatsapp }
│   ├── openingHours[]
│   ├── description
│   ├── highlights[]
│   ├── serviceAreas[]
│   └── gallery[]
│
├── Services (available at this location)
│   └── id, title, slug
│
├── Projects (done at this location)
│   └── id, title, vehicle, afterImages
│
├── FAQ (location context)
│   └── question, answer
│
└── Testimonials (from this location)
    └── name, quote, source
```

### 4.3 Homepage

```
Required Data:
├── Organization
│   └── name, tagline, logo
│
├── Locations (featured)
│   └── id, name, address, phone, heroImage
│
├── Services (all)
│   └── id, title, slug, excerpt, heroImage
│
├── Projects (featured, 6 items)
│   └── id, title, vehicle, service, afterImages
│
├── Testimonials (featured, 3 items)
│   └── name, quote, source
│
├── FAQ (global, 5 items)
│   └── question, answer
│
└── Blog (latest, 3 posts)
    └── id, title, slug, date, featuredImage
```

---

## 5. CONTENT FLOW DIAGRAMS

### 5.1 Education → Conversion Flow

```
SEARCH QUERY: "apa itu ceramic coating"
    │
    ▼
BLOG POST: "Apa itu Nano Ceramic Coating?"
    │
    ├── Links to → /services/nano-ceramic-coating/
    │
    └── Related Articles
        │
        ▼
SERVICE PAGE: Nano Ceramic Coating
    │
    ├── Benefits
    ├── Process
    ├── Packages with Pricing
    │
    └── CTA: Book Now / WhatsApp
```

### 5.2 Location → Service Flow

```
SEARCH QUERY: "auto detailing pluit"
    │
    ▼
LOCATION PAGE: AutoSPA Pluit
    │
    ├── Services Available
    │   └── Ceramic, PPF, Detailing, Wash
    │
    ├── Projects (done at Pluit)
    │   └── Before/After gallery
    │
    └── CTA: Book at Pluit / WhatsApp
```

### 5.3 Project → Service Flow

```
PROJECT PAGE: Toyota Alphard - Ceramic Coating
    │
    ├── Vehicle: Toyota Alphard
    ├── Service: Nano Ceramic Coating (Platinum Package)
    ├── Location: AutoSPA Pluit
    │
    ├── Before/After Images
    ├── Challenge → Solution → Result
    │
    └── Related Projects
        │
        ▼
NEXT.JS Related Projects Widget
```

---

## 6. CROSS-REFERENCE CHECKLIST

| Entity | Can Link To | Cannot Link To |
|--------|-------------|----------------|
| Service | Location, Project, FAQ, Testimonial | - |
| Location | Service, Project, FAQ, Testimonial | - |
| Project | Service, Location | - |
| FAQ | Service, Location | - |
| Testimonial | Service, Location | - |
| Blog Post | Service, Location, Category, Tag | - |

---

**Document Status:** FINAL - Relationships Locked
**Last Updated:** 2026-08-18
**Next:** Phase 2C - ACF + WPGraphQL Specification
