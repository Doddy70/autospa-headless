# PHASE 2A: SERVICE CONTENT EXTRACTION
## AutoSP AJakarta - Headless WordPress Project

**Project:** Headless WordPress → Next.js for SEO/GEO Rebuild
**Date:** 2026-08-18
**Status:** IN PROGRESS - Service Extraction

---

## EXECUTIVE SUMMARY

### Extraction Results

Dari 6 existing service pages, kami mengekstrak:

| Service | Packages | Pricing Tiers | FAQ | Hero Images |
|---------|----------|---------------|-----|-------------|
| Premium Wash | 3 | 3 (Light/Full/+Undercarriage) | 5 | 1 |
| Premium Detailing | 3 | 3 (Interior/Exterior/Full) | 6 | 2 |
| Nano Ceramic Coating | 6 | 5 vehicle sizes each | 0 | 0 |
| 360° PPF | 3 | 5 vehicle sizes each | 0 | 0 |
| Premium Nano Ceramic | 6 | (links to detail) | 0 | 2 |
| Premium Coating LP | - | (landing page) | 0 | many |

### Key Findings

1. **Duplication**: Premium Nano Ceramic → sama dengan Nano Ceramic (duplicate)
2. **Landing Page**: Premium Coating LP → promotional page, bukan service
3. **Missing Structure**: Pricing, FAQ, process tidak terstruktur
4. **No Location Links**: Tidak ada penautan ke lokasi

---

## 1. EXISTING SERVICE PAGES

### 1.1 Premium Wash

**Page ID:** 3230
**URL:** `/premium-wash/`
**Type:** Service Page

**Content Structure:**

```
HERO
├── Image: Premium-Car-Wash-Hero4.jpg
└── Headline: "Premium Wash"

TAGLINE
└── "a car wash service that uses high-quality products 
    and procedures to thoroughly clean the car, both exterior 
    and interior"

PACKAGES
├── Light Detox → View Pricing (CTA)
├── Full Detox → View Pricing (CTA)
└── +Undercarriage Wash → View Pricing (CTA)

FAQ (5 questions)
├── How long does the wash process take?
├── How often should I get a Premium Wash?
├── Can I customize the Premium Wash service?
└── What is difference between Premium Wash vs regular wash?

CTA
├── Contact Us
└── WhatsApp: +62-819-3777-3888
```

**SEO Data:**
| Field | Value |
|-------|-------|
| Focus Keyword | premium wash |
| SEO Score | 67 |
| Featured Image | 3839 |

**Extracted Data:**
```yaml
title: "Premium Wash"
slug: "premium-wash"
tagline: "A car wash service that uses high-quality products and procedures to thoroughly clean the car, both exterior and interior"
description: ""
packages:
  - name: "Light Detox"
    pricing_cta: true
  - name: "Full Detox"
    pricing_cta: true
  - name: "+Undercarriage Wash"
    pricing_cta: true
faq:
  - q: "How long does the wash process take?"
    a: "Between 30 to 60 minutes depending on size and condition"
  - q: "How often should I get a Premium Wash?"
    a: "Every 3-4 months if parked outdoors or frequent driving"
  - q: "Can I customize the Premium Wash service?"
    a: "Yes, add-ons available: window treatment, headlight restoration, interior detailing"
  - q: "What is difference between Premium Wash vs regular wash?"
    a: "Multi-stage decontamination, two-bucket wash, clay bar, professional hand wax, tire dressing"
  - q: "Is the Premium Wash worth the investment?"
    a: "Enhances appearance and protects value in the long run"
images:
  - url: "https://autospajakarta.com/wp-content/uploads/2025/07/Premium-Car-Wash-Hero4.jpg"
whatsapp: "+6281937773888"
seo:
  focus_keyword: "premium wash"
  score: 67
```

---

### 1.2 Premium Detailing

**Page ID:** 3247
**URL:** `/premium-detailing/`
**Type:** Service Page

**Content Structure:**

```
HERO
├── Image: Slider-3.jpg
├── Image: Slider-45.jpg
└── Headline: "Premium Detailing"

TAGLINE
└── "We provide a Premium Service & produce Premium Results"

PACKAGES
├── Interior Detailing → View Pricing (CTA)
├── Exterior Detailing → View Pricing (CTA)
└── Full Detailing → View Pricing (CTA)

FAQ (6 questions)
├── What is auto detailing?
├── How long does it typically take to detail my vehicle?
├── What is the difference between a car wash and a detailing?
├── How often should I get my car detailed?
├── Are the products you use safe for my vehicle?
└── Will detailing my car improve its resale value?

CTA
├── Contact Us
└── WhatsApp: +62-819-3777-3888
```

**SEO Data:**
| Field | Value |
|-------|-------|
| Focus Keyword | Premium Full Detailing, full detailing car, premium detailing |
| Meta Description | Perawatan mobil menyeluruh yang mencakup pembersihan dan perlindungan detail pada bagian eksterior, interior, dan mesin mobil |
| SEO Score | 22 |
| Featured Image | 3847 |

**Extracted Data:**
```yaml
title: "Premium Detailing"
slug: "premium-detailing"
tagline: "We provide a Premium Service & produce Premium Results"
description: "Perawatan mobil menyeluruh yang mencakup pembersihan dan perlindungan detail pada bagian eksterior, interior, dan mesin mobil"
packages:
  - name: "Interior Detailing"
    pricing_cta: true
  - name: "Exterior Detailing"
    pricing_cta: true
  - name: "Full Detailing"
    pricing_cta: true
faq:
  - q: "What is auto detailing?"
    a: "Thorough cleaning and restoration of both interior and exterior. Goes beyond regular wash with deep cleaning, polishing, and protecting surfaces."
  - q: "How long does it typically take?"
    a: "Depends on vehicle size, condition, package selection, and add-ons"
  - q: "What is the difference between car wash and detailing?"
    a: "Wash is surface-level clean. Detailing is comprehensive cleaning with paint correction, waxing, upholstery conditioning."
  - q: "How often should I get my car detailed?"
    a: "Every 3-6 months typically, more often if driving often or in harsh conditions"
  - q: "Are the products safe for my vehicle?"
    a: "Yes, high-quality, safe, specifically designed for automotive use. Environmentally friendly options."
  - q: "Will detailing improve resale value?"
    a: "Yes, clean and well-maintained car is more attractive to buyers"
images:
  - url: "https://autospajakarta.com/wp-content/uploads/2024/08/Slider-3.jpg"
  - url: "https://autospajakarta.com/wp-content/uploads/2024/08/Slider-45.jpg"
whatsapp: "+6281937773888"
seo:
  focus_keyword: "Premium Full Detailing, full detailing car, premium detailing"
  meta_description: "Perawatan mobil menyeluruh yang mencakup pembersihan dan perlindungan detail pada bagian eksterior, interior, dan mesin mobil"
  score: 22
```

---

### 1.3 Nano Ceramic Coating

**Page ID:** 3250
**URL:** `/nano-ceramic-coating/`
**Type:** Service Page with Pricing

**Content Structure:**

```
HERO
├── Headline: "Car coating protects your car from ultra violet rays, 
│              preventing your car paint from dulling and fading."
└── (No hero image in content)

PACKAGES (6 Tiers)
├── Light Package - Double Layer
├── Bronze Package - Double Layer
├── Silver Package - Triple Layer
├── Gold Package - 5 Layers
├── Diamond Package - 7 Layers
└── Platinum Package - 10 Layers

EACH PACKAGE INCLUDES:
├── Vehicle sizes: Small, Medium, Large, X-Large, Super
├── Price range per size
├── Duration (workmanship days)
├── Durability (years)
└── Member maintenance (years)

CTA: WhatsApp booking links per package
```

**Package Details:**

| Package | Layers | Durability | Maintenance | Price Range (Small-Super) |
|---------|--------|------------|-------------|---------------------------|
| Light | 2 | 1-2 years | 1 year | IDR 3.000k - 8.000k |
| Bronze | 2 | 1-2 years | 2 years | IDR 4.000k - 9.000k |
| Silver | 3 | 3-4 years | 3 years | IDR 6.000k - 11.000k |
| Gold | 5 | 4-5 years | 4 years | IDR 8.000k - 13.000k |
| Diamond | 7 | 5-6 years | 5 years | IDR 10.000k - 15.000k |
| Platinum | 10 | up to 10 years | Lifetime | IDR 14.000k - 19.000k |

**Standard Inclusions (All Packages):**
- Full Car Detailing (Undercarriage, Engine, Interior, Body, Wheel, Glass)
- Full Body Coating (9H/9H+/10H/10H+)
- Full Window Coating
- Plastic Coating
- Velg Coating

**Additional Inclusions by Tier:**
- Silver+: Full Window Coating
- Diamond+: Full Leather Coating and Interior Coating
- Platinum: Lifetime Member Maintenance

**SEO Data:**
| Field | Value |
|-------|-------|
| Focus Keyword | nano ceramic coating |
| Meta Description | Nano ceramic coating adalah lapisan pelindung berbahan dasar keramik cair yang diaplikasikan pada permukaan kendaraan untuk memberikan perlindungan dan kilau ekstra pada cat |
| SEO Score | 73 |
| Featured Image | 3845 |

**Extracted Data:**
```yaml
title: "Nano Ceramic Coating"
slug: "nano-ceramic-coating"
tagline: "Car coating protects your car from ultra violet rays, preventing your car paint from dulling and fading"
description: "Nano ceramic coating adalah lapisan pelindung berbahan dasar keramik cair yang diaplikasikan pada permukaan kendaraan untuk memberikan perlindungan dan kilau ekstra pada cat"

service_type: "coating"
category: "ceramic"

packages:
  light:
    name: "Light Package"
    description: "Double Layer Nano Ceramic Coating Package"
    layers: 2
    hardness: "9H"
    durability: "1-2 years (depends on maintenance)"
    maintenance: "1 year member"
    pricing:
      small: 3000000
      medium: 4000000
      large: 5000000
      xlarge: 6000000
      super: 8000000
    includes:
      - "Full Car Detailing (Undercarriage, Engine, Interior, Body, Wheel, Glass)"
      - "Full Body Coating (9H)"
      - "Windshield Coating"
  
  bronze:
    name: "Bronze Package"
    layers: 2
    hardness: "9H"
    durability: "1-2 years"
    maintenance: "2 years"
    pricing:
      small: 4000000
      medium: 5000000
      large: 6000000
      xlarge: 7000000
      super: 9000000
    includes:
      - "Full Car Detailing"
      - "Full Body Coating (9H)"
      - "Full Window Coating"
      - "Plastic Coating"
      - "Velg Coating"
  
  silver:
    name: "Silver Package"
    layers: 3
    hardness: "9H+"
    durability: "3-4 years"
    maintenance: "3 years"
    pricing:
      small: 6000000
      medium: 7000000
      large: 8000000
      xlarge: 9000000
      super: 11000000
    includes:
      - "Full Car Detailing"
      - "Full Body Coating (9H+)"
      - "Full Window Coating"
      - "Plastic Coating"
      - "Velg Coating"
  
  gold:
    name: "Gold Package"
    layers: 5
    hardness: "10H"
    durability: "4-5 years"
    maintenance: "4 years"
    pricing:
      small: 8000000
      medium: 9000000
      large: 10000000
      xlarge: 11000000
      super: 13000000
    includes:
      - "Full Car Detailing"
      - "Full Body Coating (10H)"
      - "Full Window Coating"
      - "Plastic Coating"
      - "Velg Coating"
  
  diamond:
    name: "Diamond Package"
    layers: 7
    hardness: "10H"
    durability: "5-6 years"
    maintenance: "5 years"
    pricing:
      small: 10000000
      medium: 11000000
      large: 12000000
      xlarge: 13000000
      super: 15000000
    includes:
      - "Full Car Detailing"
      - "Full Body Coating (10H)"
      - "Full Window Coating"
      - "Plastic Coating"
      - "Velg Coating"
      - "Full Leather Coating"
      - "Interior Coating"
  
  platinum:
    name: "Platinum Package"
    layers: 10
    hardness: "10H+"
    durability: "up to 10 years"
    maintenance: "Lifetime"
    pricing:
      small: 14000000
      medium: 15000000
      large: 16000000
      xlarge: 17000000
      super: 19000000
    includes:
      - "Full Car Detailing"
      - "Full Body Coating (10H+)"
      - "Full Window Coating"
      - "Plastic Coating"
      - "Velg Coating"
      - "Full Leather Coating"
      - "Interior Coating"

technology:
  - "9H Ceramic Hardness"
  - "Self-healing properties"
  - "Hydrophobic surface"
  - "UV protection"

workmanship: "3-4 days (Light-Bronze-Silver), 4-5 days (Gold-Diamond-Platinum)"

whatsapp: "+6281937773888"

seo:
  focus_keyword: "nano ceramic coating"
  meta_description: "Nano ceramic coating adalah lapisan pelindung berbahan dasar keramik cair yang diaplikasikan pada permukaan kendaraan untuk memberikan perlindungan dan kilau ekstra pada cat"
  score: 73
```

---

### 1.4 360° Paint Protection Film (PPF)

**Page ID:** 3598
**URL:** `/360-paint-protection-film-package/`
**Type:** Service Page with Pricing

**Content Structure:**

```
HERO
├── Headline: "wrapping the entire exterior of a vehicle with a clear, 
              self-healing film to protect the paint from various types 
              of damage"
└── (No hero image in content)

PACKAGES (3 Tiers)
├── Daily PPF Package - 170 Micron, Self Curing, TPU Made in PRC
├── Premium PPF Package - 200 Micron, Self Curing, TPU Made in USA
└── Ultimate PPF Package - 230 Micron, Self Curing, TPU Made in USA

EACH PACKAGE INCLUDES:
├── Vehicle sizes: Small, Medium, Large, X-Large, Super
├── Price range per size
├── Durability (years)
├── Maintenance (years membership)
└── TPU Grade

STANDARD INCLUSIONS (All Packages):
├── Full Body Car Detailing (Undercarriage, Machine, Interior, Body, Velg & Glass)
├── Full Window Coating
├── Plastic Coating
└── Velg Coating

ADDITIONAL (Full packages):
├── Full Leather Coating
└── Interior Coating

CTA: WhatsApp booking links per package
```

**Package Details:**

| Package | Thickness | TPU Origin | Durability | Maintenance | Price Range |
|---------|-----------|------------|------------|-------------|-------------|
| Daily PPF | 170 micron | PRC | up to 3 years | 2 years | IDR 15.000k - 35.000k |
| Premium PPF | 200 micron | USA | up to 7 years | 5 years | IDR 25.000k - 45.000k |
| Ultimate PPF | 230 micron | USA | up to 10 years | 8 years | IDR 40.000k - 60.000k |

**SEO Data:**
| Field | Value |
|-------|-------|
| Focus Keyword | 360° Paint Protection Film (PPF), 360° PPF |
| Meta Description | 360° Paint Protection Film (PPF) Package involves wrapping the entire exterior of a vehicle with a clear, self-healing film to protect the paint |
| SEO Score | 19 |
| Featured Image | 3858 |

**Extracted Data:**
```yaml
title: "360° Paint Protection Film"
slug: "360-paint-protection-film"
short_name: "PPF"
tagline: "Wrapping the entire exterior of a vehicle with a clear, self-healing film to protect the paint from various types of damage"

service_type: "protection"
category: "ppf"

packages:
  daily:
    name: "Daily PPF Package"
    description: "170 Micron Thickness & Self Curing"
    thickness: "170 micron"
    tpu_grade: "TPU Made in PRC"
    durability: "up to 3 years (depends on care & use)"
    maintenance: "2 years membership"
    pricing:
      small: 15000000
      medium: 20000000
      large: 25000000
      xlarge: 30000000
      super: 35000000
  
  premium:
    name: "Premium PPF Package"
    description: "200 Micron Thickness & Self Curing"
    thickness: "200 micron"
    tpu_grade: "High Grade TPU Made in USA"
    durability: "up to 7 years"
    maintenance: "5 years membership"
    pricing:
      small: 25000000
      medium: 30000000
      large: 35000000
      xlarge: 40000000
      super: 45000000
  
  ultimate:
    name: "Ultimate PPF Package"
    description: "230 Micron Thickness & Self Curing"
    thickness: "230 micron"
    tpu_grade: "High Grade TPU Made in USA"
    durability: "up to 10 years"
    maintenance: "8 years membership"
    pricing:
      small: 40000000
      medium: 45000000
      large: 50000000
      xlarge: 55000000
      super: 60000000

standard_includes:
  - "Full Body Car Detailing (Undercarriage, Machine, Interior, Body, Velg & Glass)"
  - "Full Window Coating"
  - "Plastic Coating"
  - "Velg Coating"

premium_includes:
  - "Full Leather Coating"
  - "Interior Coating"

technology:
  - "TPU (Thermoplastic Polyurethane)"
  - "Self-healing film"
  - "Clear protection"
  - "UV protection"

whatsapp: "+6281937773888"

seo:
  focus_keyword: "360° Paint Protection Film (PPF), 360° PPF"
  meta_description: "360° Paint Protection Film (PPF) Package involves wrapping the entire exterior of a vehicle with a clear, self-healing film to protect the paint"
  score: 19
```

---

### 1.5 Premium Nano Ceramic Coating (Overview Page)

**Page ID:** 4336
**URL:** `/premium-nano-ceramic-coating/`
**Type:** Service Overview Page

**Content Structure:**

```
HERO
├── Image: Slider-3.jpg
├── Image: Slider-45.jpg
└── Headline: "Premium Nano Ceramic Coating"

TAGLINE
└── "We provide a Premium Service & produce Premium Results"

PACKAGE LINKS (6)
├── Light Package → View Pricing
├── Bronze Package → View Pricing
├── Silver Package → View Pricing
├── Gold Package → View Pricing
├── Diamond Package → View Pricing
└── Platinum Package → View Pricing

CTA
├── Contact Us
└── WhatsApp: +62-819-3777-3888
```

**SEO Data:**
| Field | Value |
|-------|-------|
| Focus Keyword | (none) |
| Meta Description | (none) |
| SEO Score | 11 |

**Analysis:** This is a DUPLICATE/INDEX page that links to Nano Ceramic Coating detailed page. Should be 301 redirected to `/nano-ceramic-coating/` or removed.

---

### 1.6 Premium Coating LP (Landing Page)

**Page ID:** 4581
**URL:** `/premium-coating-lp/`
**Type:** Landing Page (PROMOTIONAL)

**Content Structure:**

```
HERO
├── Video: YouTube shorts
└── Headline: "Lets make your car stunning!"
└── CTA: Book Now

GALLERY
├── Before/After photos
└── Activity photos (PIK2, 2025-11)

TESTIMONIALS (6 celebrity testimonials)
├── Judika (Artist/Penyanyi)
├── Ayu Ting Ting (Artist/Influencer)
├── Mpo Alfa (Artist/Influencer)
├── Master Limbad (Artist/Pesulap)
├── Soraya Rasyid (Artist/Influencer)
└── Kevin Andrean (Artist/Influencer)

VIDEO GALLERY
├── YouTube shorts

PROMO
└── "Get Free Glass Coating!" (limited slots)

TEAM LOGO
└── AutoSPA Jakarta Logo
```

**Analysis:** This is a PROMOTIONAL LANDING PAGE, not a service page. Content should be preserved as testimonial evidence but not as service entity.

---

## 2. CONTENT NORMALIZATION

### 2.1 Service Entity Consolidation

Based on extraction, we have 4 distinct services (not 6):

| Service | Source Pages | Action |
|---------|-------------|--------|
| **Premium Wash** | premium-wash | KEEP as-is, enrich |
| **Premium Detailing** | premium-detailing | KEEP as-is, enrich |
| **Nano Ceramic Coating** | nano-ceramic-coating | KEEP as main page |
| **Nano Ceramic Coating** | premium-nano-ceramic-coating | **MERGE** → redirect to main |
| **360° PPF** | 360-paint-protection-film-package | KEEP, rename slug |
| **Premium Coating LP** | premium-coating-lp | **ARCHIVE** → keep testimonials separately |

### 2.2 Missing Content to Add

| Service | Missing Data | Priority |
|---------|-------------|----------|
| Premium Wash | Full description, benefits, process steps, actual pricing | HIGH |
| Premium Detailing | Full description, benefits, process steps, actual pricing | HIGH |
| Nano Ceramic Coating | Hero images, additional context | MEDIUM |
| 360° PPF | Hero images, additional context | MEDIUM |

---

## 3. NEW SERVICE ENTITY MODEL

Based on extraction and Phase 1B Entity Architecture:

### 3.1 Service CPT Schema

```typescript
interface Service {
  // Basic Info
  id: string;
  title: string;
  slug: string;
  short_name: string;           // e.g., "PPF", "Ceramic"
  
  // Content
  tagline: string;              // Hero headline
  description: string;          // Full description
  excerpt: string;              // Short summary
  
  // Classification
  service_type: 'coating' | 'protection' | 'detailing' | 'wash' | 'other';
  category: string;             // e.g., "ceramic", "ppf", "detailing"
  
  // Packages
  packages: Package[];
  
  // Details
  process: ProcessStep[];
  technology: string[];         // Products/tech used
  benefits: string[];           // Customer benefits
  duration: string;             // Workmanship time
  warranty?: string;            // Warranty info
  
  // Relations
  locations: LocationReference[];  // Where available
  related_services: ServiceReference[];  // Cross-sell
  related_projects: ProjectReference[];  // Proof
  faqs: FAQReference[];         // Service FAQ
  
  // Media
  hero_images: Media[];
  gallery: Media[];
  before_after_examples: Media[];
  
  // CTA
  whatsapp: string;
  booking_url: string;
  
  // SEO
  seo: SEOData;
}

interface Package {
  id: string;
  name: string;
  description: string;
  tier: 'basic' | 'standard' | 'premium' | 'ultimate';
  
  // Pricing by vehicle size
  pricing: {
    small: number;     // City car, Jazz, Yaris
    medium: number;    // Civic, Corolla, Xpander
    large: number;     // CRV, Camry, Fortuner
    xlarge: number;    // Pajero, Alphard, HRV
    super: number;     // Land Cruiser, Patrol, etc.
  };
  
  // Technical specs
  layers?: number;
  hardness?: string;   // e.g., "9H", "10H+"
  thickness?: string; // e.g., "200 micron"
  tpu_grade?: string;
  
  // Value props
  durability: string;
  maintenance: string;
  
  // Inclusions
  includes: string[];
  excludes?: string[];
  
  // CTA
  pricing_cta?: boolean;
  booking_url?: string;
}

interface ProcessStep {
  order: number;
  title: string;
  description: string;
  duration?: string;
  image?: Media;
}

interface SEOData {
  focus_keywords: string[];
  meta_title: string;
  meta_description: string;
  canonical_url: string;
}
```

---

## 4. MIGRATION SPECIFICATION

### 4.1 Service Migration Matrix

| Existing Page | Page ID | New Entity | Action | New URL | Notes |
|--------------|---------|------------|--------|---------|-------|
| Premium Wash | 3230 | Service | **KEEP + ENRICH** | `/services/premium-wash/` | Add full content, pricing |
| Premium Detailing | 3247 | Service | **KEEP + ENRICH** | `/services/premium-detailing/` | Add full content, pricing |
| Nano Ceramic Coating | 3250 | Service | **KEEP** | `/services/nano-ceramic-coating/` | Main ceramic page |
| Premium Nano Ceramic | 4336 | Service | **MERGE** | - | 301 redirect to main |
| 360° PPF | 3598 | Service | **KEEP + RENAME** | `/services/paint-protection-film/` | Better SEO slug |
| Premium Coating LP | 4581 | Landing Page | **ARCHIVE** | - | Extract testimonials |

### 4.2 Content Mapping

#### Premium Wash
```yaml
source:
  url: "/premium-wash/"
  id: 3230
  hero_image: "Premium-Car-Wash-Hero4.jpg"
  
extracted:
  - 5 FAQ items
  - 3 package references
  - WhatsApp CTA
  
needed:
  - Full service description
  - Benefits list
  - Process steps (4-6 steps)
  - Detailed pricing per package
  - Technology/products used
  - Before/after images
  - Location availability

action: "Create full service page template, request missing content from AutoSPA"
```

#### Premium Detailing
```yaml
source:
  url: "/premium-detailing/"
  id: 3247
  hero_images: ["Slider-3.jpg", "Slider-45.jpg"]
  
extracted:
  - 6 FAQ items
  - 3 package references (Interior/Exterior/Full)
  - WhatsApp CTA
  
needed:
  - Full service description
  - Benefits list
  - Process steps for each package
  - Detailed pricing per package
  - Technology/products used
  - Before/after images
  - Location availability

action: "Create full service page template, request missing content from AutoSPA"
```

#### Nano Ceramic Coating
```yaml
source:
  url: "/nano-ceramic-coating/"
  id: 3250
  
extracted:
  - 6 complete packages with pricing
  - Technology info (9H hardness)
  - Inclusions per package
  - Durability info
  - Maintenance info
  
needed:
  - Hero images
  - Full description
  - Process steps
  - Benefits
  - Before/after examples
  - Location availability

action: "Add hero images, request process/benefits from AutoSPA"
```

#### 360° PPF
```yaml
source:
  url: "/360-paint-protection-film-package/"
  id: 3598
  
extracted:
  - 3 complete packages with pricing
  - TPU technology info
  - Thickness specs
  - Durability info
  - Maintenance info
  
needed:
  - Hero images
  - Full description
  - Process steps
  - Benefits
  - Before/after examples
  - Comparison with Ceramic Coating
  - Location availability

action: "Rename slug to /paint-protection-film/, add hero images, request process/benefits"
```

### 4.3 Redirect Plan

| Old URL | New URL | Type | Reason |
|---------|---------|------|--------|
| `/premium-nano-ceramic-coating/` | `/services/nano-ceramic-coating/` | 301 | Duplicate page |
| `/premium-coating-lp/` | (no redirect) | 410 | Landing page, not service |
| `/360-paint-protection-film-package/` | `/services/paint-protection-film/` | 301 | Better slug |

---

## 5. CONTENT COLLECTION CHECKLIST

### 5.1 Premium Wash - Data Needed

- [ ] **Full Description** (minimum 150 words)
- [ ] **Benefits** (5-7 bullet points)
- [ ] **Process Steps** (4-6 steps with descriptions)
- [ ] **Technology/Products Used**
- [ ] **Light Detox Pricing** (exact amount)
- [ ] **Full Detox Pricing** (exact amount)
- [ ] **+Undercarriage Wash Pricing** (exact amount)
- [ ] **Duration per Package**
- [ ] **Before/After Images** (minimum 2 sets)
- [ ] **Available Locations**

### 5.2 Premium Detailing - Data Needed

- [ ] **Full Description** (minimum 200 words)
- [ ] **Benefits** (5-7 bullet points)
- [ ] **Process Steps - Interior** (4-6 steps)
- [ ] **Process Steps - Exterior** (4-6 steps)
- [ ] **Process Steps - Full** (6-8 steps)
- [ ] **Technology/Products Used**
- [ ] **Interior Detailing Pricing** (exact amount)
- [ ] **Exterior Detailing Pricing** (exact amount)
- [ ] **Full Detailing Pricing** (exact amount)
- [ ] **Duration per Package**
- [ ] **Before/After Images** (minimum 3 sets)
- [ ] **Available Locations**

### 5.3 Nano Ceramic Coating - Data Needed

- [ ] **Hero Images** (2-3 high-quality)
- [ ] **Process Steps** (6-8 steps)
- [ ] **Technology Explanation** (what is 9H, self-healing, etc.)
- [ ] **Benefits** (5-7 bullet points)
- [ ] **Comparison with PPF** (when to choose ceramic vs PPF)
- [ ] **Maintenance Tips**
- [ ] **Before/After Images** (minimum 3 sets)
- [ ] **Available Locations**

### 5.4 360° PPF - Data Needed

- [ ] **Hero Images** (2-3 high-quality)
- [ ] **Process Steps** (6-8 steps)
- [ ] **Technology Explanation** (TPU, self-healing, thickness)
- [ ] **Benefits** (5-7 bullet points)
- [ ] **Comparison with Ceramic** (when to choose PPF vs ceramic)
- [ ] **Maintenance Tips**
- [ ] **Before/After Images** (minimum 3 sets)
- [ ] **Available Locations**

---

## 6. TESTIMONIAL EXTRACTION

### 6.1 From Premium Coating LP

| Customer | Role | Quote | Vehicle | Service |
|----------|------|-------|---------|---------|
| Judika | Artist/Penyanyi | "My car actually looks brand new. I am so impressed" | - | Coating |
| Ayu Ting Ting | Artist/Influencer | "Great work. Hasilnya puas, bahan dan material kualitas premium. Pengerjaan sesuai jadwal" | - | Coating |
| Mpo Alfa | Artist/Influencer | "Hasilnya sangat memuaskan, bikin mobil lbh kinclong. Terkesan banget dengan pekerjaan mereka!" | - | Coating |
| Master Limbad | Artist/Pesulap | "Mantap pokoknya. Dicoba bagi yang belum ayoook!" | - | Coating |
| Soraya Rasyid | Artist/Influencer | "Mereka tidak melewatkan satu pun bagian. bahkan meminta saya untuk memeriksa kembali sebelum pergi" | - | Coating |
| Kevin Andrean | Artist/Influencer | "Mobil saya menjadi mobil baru yang kinclong. Sangat sopan, profesional, dan 100% direkomendasikan!" | - | Coating |

**Action:** Create Testimonial CPT and import these as initial entries.

---

## 7. RECOMMENDATIONS

### 7.1 Immediate Actions

1. **Create Service Content Template** - Standard format for collecting missing data
2. **Request Data from AutoSPA** - Send checklist to client for completion
3. **Design Service CPT** - After receiving data, design ACF fields
4. **Plan Testimonial Import** - Extract and structure existing testimonials

### 7.2 Content Priority

```
PRIORITY 1 (Commercial Core)
├── Nano Ceramic Coating    → Main revenue driver
└── 360° PPF              → Secondary revenue driver

PRIORITY 2 (Support Services)
├── Premium Detailing     → Upsell from wash
└── Premium Wash          → Entry point

PRIORITY 3 (Future Services)
├── Rust Protection        → Mentioned in blog, not on site
├── Engine Detailing       → Mentioned in blog, not on site
└── Interior Detailing     → Mentioned in blog, not on site
```

### 7.3 SEO Considerations

- **Nano Ceramic Coating**: High search volume, competitive. Optimize with location modifiers.
- **PPF**: Moderate search volume, less competitive. Good opportunity.
- **Detailing**: High search volume, very competitive. Focus on local + service differentiation.
- **Premium Wash**: Lower search volume, more transactional intent.

---

## APPENDIX A: PRICING SUMMARY (from extraction)

### Ceramic Coating (IDR)

| Package | Small | Medium | Large | X-Large | Super |
|---------|-------|--------|-------|----------|-------|
| Light | 3.000k | 4.000k | 5.000k | 6.000k | 8.000k |
| Bronze | 4.000k | 5.000k | 6.000k | 7.000k | 9.000k |
| Silver | 6.000k | 7.000k | 8.000k | 9.000k | 11.000k |
| Gold | 8.000k | 9.000k | 10.000k | 11.000k | 13.000k |
| Diamond | 10.000k | 11.000k | 12.000k | 13.000k | 15.000k |
| Platinum | 14.000k | 15.000k | 16.000k | 17.000k | 19.000k |

### PPF (IDR)

| Package | Small | Medium | Large | X-Large | Super |
|---------|-------|--------|-------|----------|-------|
| Daily | 15.000k | 20.000k | 25.000k | 30.000k | 35.000k |
| Premium | 25.000k | 30.000k | 35.000k | 40.000k | 45.000k |
| Ultimate | 40.000k | 45.000k | 50.000k | 55.000k | 60.000k |

---

## APPENDIX B: WHATSAPP CONTACT

**All services link to:**
```
+62-819-3777-3888
wa.me/6281937773888
```

**Message template:** "halo admin saya mau booking untuk [SERVICE PACKAGE]"

---

**Document Status:** DRAFT - Pending client content collection
**Last Updated:** 2026-08-18
**Next Action:** Create content collection checklist and send to AutoSPA
