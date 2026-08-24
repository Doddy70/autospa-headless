# PHASE 2A-C: LOCATION VERIFICATION
## AutoSP AJakarta - Headless WordPress Project

**Project:** Headless WordPress → Next.js for SEO/GEO Rebuild
**Date:** 2026-08-18
**Status:** IN PROGRESS - Awaiting Client Verification

---

## 1. DISCOVERY SUMMARY

### Initial Audit Conclusion (REVISED)

| Previous Conclusion | Revised Conclusion |
|--------------------|--------------------|
| "No location data exists" | "Location data exists in unstructured/global page content, but no structured Location entity/CPT architecture" |

**This is a critical distinction:**
- Location data DOES exist (10 candidates discovered)
- But it is NOT structured as entities
- Cannot be queried, linked, or displayed contextually

---

## 2. CANDIDATE LOCATION INVENTORY

### 2.1 From Public Website

| # | Location Name | Address | Status |
|---|---------------|---------|--------|
| 1 | AutoSPA Pluit | Jl. Pluit Karang Ayu Barat No.16, Pluit, Jakarta Utara 14440 | ✅ Verified |
| 2 | AutoSPA Depok 2 | Jl. Kemakmuran Raya No.12, [City] | ⚠️ Partial |
| 3 | AutoSPA Express Depok | Jl. Margonda No.268, Depok | ⚠️ Partial |
| 4 | AutoSPA PIK 2 | Distrik Otomotif PIK 2, PIK, Jakarta Utara | ⚠️ Partial |
| 5 | AutoSPA Tangerang | Jl. Raden Saleh, Tangerang | ⚠️ Partial |
| 6 | AutoSPA Bekasi | Jl. Taman Galaxy Raya No.295, Bekasi | ⚠️ Partial |
| 7 | AutoSPA Kranji Bekasi | Chery Arta Bekasi, Kranji, Bekasi | ⚠️ Partial |
| 8 | AutoSPA Bogor | Jl. Raya Semplak, Bogor | ⚠️ Partial |
| 9 | AutoSPA Serpong | [Not available] | ❌ Unverified |
| 10 | AutoSPA Cikupa | [Not available] | ❌ Unverified |

### 2.2 External Verification - Pluit

**Google Business Profile Found:**
```
AutoSpa - Passion for Detail
├── Rating: 4.9
├── Reviews: 96
├── Status: Closed (based on listing)
├── Phone: 0877-1777-3888
├── Website: autospajakarta.com
└── Address: Jl. Pluit Karang Ayu Barat No.16, Pluit, Jakarta Utara 14440
```

**Note:** Rating/review count NOT to be stored as permanent CMS data until source-of-truth is determined.

---

## 3. LOCATION MODEL (REVISED)

### 3.1 Type + Status Matrix

```
LOCATION
│
├── TYPE
│   ├── physical        → Has physical address, can receive customers
│   └── service_area    → Area covered but no physical location
│
└── STATUS
    ├── draft          → Candidate, not yet verified
    ├── verified        → Client confirmed, data complete
    ├── active         → Currently operating
    └── inactive       → Temporarily/permanently closed
```

### 3.2 Why This Matters

| Scenario | Type | Status |
|----------|------|--------|
| AutoSPA Pluit | physical | active |
| AutoSPA Serpong (unverified) | physical | draft |
| Jakarta Utara (service area) | service_area | verified |
| Jabodetabek (service coverage) | service_area | verified |

### 3.3 Entity Schema (Draft)

```typescript
interface Location {
  // Identity
  id: string;
  name: string;                    // "AutoSPA Pluit"
  slug: string;                   // "pluit"
  location_type: 'physical' | 'service_area';
  status: 'draft' | 'verified' | 'active' | 'inactive';
  
  // Ownership (for governance)
  ownership: 'owned' | 'partner' | 'franchise' | 'workshop';
  
  // Contact
  contact: {
    phone: string;
    whatsapp: string;
    email?: string;
  };
  
  // Address (physical only)
  address: {
    street: string;
    district?: string;
    city: string;
    province: string;
    postal_code?: string;
    country: string;              // Default: "Indonesia"
  };
  
  // Geo
  coordinates: {
    latitude: number;
    longitude: number;
  };
  
  // Business Info
  business: {
    opening_hours: OperatingHours[];
    google_maps_url?: string;
    google_business_url?: string;
    place_id?: string;             // Google Places ID
  };
  
  // Content
  content: {
    description: string;
    highlights: string[];         // "Buka sejak 2014", "Spesialis Ceramic"
    gallery: Media[];
    facilities: string[];         // "Lift 2 mobil", "AC waiting area"
  };
  
  // Relationships
  relationships: {
    services: ServiceReference[];  // Available services at this location
    projects: ProjectReference[];    // Projects done here
    testimonials: TestimonialReference[];
    faqs: FAQReference[];
  };
  
  // Service Coverage (for GEO)
  service_areas: string[];          // "Pluit", "Penjaringan", "PIK", "Jakarta Utara"
  
  // SEO
  seo: {
    meta_title: string;
    meta_description: string;
    canonical_url: string;
    local_business_schema: boolean;
  };
}

interface OperatingHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  open: string;                    // "08:00"
  close: string;                  // "18:00"
  closed?: boolean;
}
```

---

## 4. GEO ARCHITECTURE CONSIDERATION

### 4.1 Brand vs Reality

| Aspect | Current Website | Actual Business |
|--------|---------------|-----------------|
| Domain | autospajakarta.com | - |
| Brand | "AutoSPA Jakarta" | - |
| Coverage | Listed as "Jakarta" | Jakarta + Depok + Tangerang + Bekasi + Bogor |
| Locations | 10 branches | Multi-city network |

### 4.2 Recommended Approach

```
ORGANIZATION (AutoSP AJakarta)
│
├── BRAND: "AutoSPA" / "AutoSP AJakarta"
│   └── Domain: autospajakarta.com
│
├── PHYSICAL LOCATIONS (10 branches)
│   └── Each with LocalBusiness schema
│
└── SERVICE AREAS
    ├── Jakarta (comprehensive)
    ├── Depok
    ├── Tangerang
    ├── Bekasi
    └── Bogor

NOT:
- "AutoSPA Jakarta" only
- 10 separate "AutoSPA [City]" organizations
```

### 4.3 URL Structure Decision

**Recommended:**
```
/locations/                    → Location listing
/locations/pluit/              → Pluit branch page (PRIORITY 1)
/locations/depok/              → Depok branch page (PRIORITY 2)
/locations/pik-2/              → PIK 2 branch page (PRIORITY 3)
...
```

**NOT:**
- Creating 10 pages immediately
- Creating service-area pages as CPT
- Geo targeting pages like `/jakarta/` or `/depok/`

---

## 5. LOCATION VERIFICATION SHEET

### 5.1 Template for Client

```
═══════════════════════════════════════════════════════════════════════════════
                    AUTOSPA LOCATION VERIFICATION SHEET
                    Headless WordPress Migration Project
═══════════════════════════════════════════════════════════════════════════════

INSTRUCTIONS:
- Mohon isi setiap kolom dengan data terbaru
- Tanda "-" jika informasi tidak berlaku
- Tanda "?" jika informasi tidak diketahui
- Spreadsheet akan dikirimkan terpisah dalam format Excel

═══════════════════════════════════════════════════════════════════════════════
SECTION A: BRANCH VERIFICATION
═══════════════════════════════════════════════════════════════════════════════

| # | Branch Name | Active? | Ownership | Address | City | Phone | WhatsApp | Email |
|---|-------------|---------|-----------|---------|------|-------|----------|-------|
| 1 | AutoSPA Pluit | ⬜ | ⬜ | ⬜ | Jakarta Utara | ⬜ | ⬜ | ⬜ |
| 2 | AutoSPA Depok 2 | ⬜ | ⬜ | ⬜ | Depok | ⬜ | ⬜ | ⬜ |
| 3 | AutoSPA Express Depok | ⬜ | ⬜ | ⬜ | Depok | ⬜ | ⬜ | ⬜ |
| 4 | AutoSPA PIK 2 | ⬜ | ⬜ | ⬜ | Jakarta Utara | ⬜ | ⬜ | ⬜ |
| 5 | AutoSPA Tangerang | ⬜ | ⬜ | ⬜ | Tangerang | ⬜ | ⬜ | ⬜ |
| 6 | AutoSPA Bekasi | ⬜ | ⬜ | ⬜ | Bekasi | ⬜ | ⬜ | ⬜ |
| 7 | AutoSPA Kranji Bekasi | ⬜ | ⬜ | ⬜ | Bekasi | ⬜ | ⬜ | ⬜ |
| 8 | AutoSPA Bogor | ⬜ | ⬜ | ⬜ | Bogor | ⬜ | ⬜ | ⬜ |
| 9 | AutoSPA Serpong | ⬜ | ⬜ | ⬜ | Tangerang | ⬜ | ⬜ | ⬜ |
|10 | AutoSPA Cikupa | ⬜ | ⬜ | ⬜ | Tangerang | ⬜ | ⬜ | ⬜ |

═══════════════════════════════════════════════════════════════════════════════
SECTION B: OPERATING HOURS
═══════════════════════════════════════════════════════════════════════════════

| # | Branch | Monday | Tuesday | Wednesday | Thursday | Friday | Saturday | Sunday |
|---|--------|--------|---------|-----------|----------|--------|----------|--------|
| 1 | AutoSPA Pluit | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 2 | AutoSPA Depok 2 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 3 | AutoSPA Express Depok | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 4 | AutoSPA PIK 2 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 5 | AutoSPA Tangerang | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 6 | AutoSPA Bekasi | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 7 | AutoSPA Kranji Bekasi | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 8 | AutoSPA Bogor | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 9 | AutoSPA Serpong | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
|10 | AutoSPA Cikupa | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

Format: "08:00 - 18:00" atau "Closed" jika tidak beroperasi

═══════════════════════════════════════════════════════════════════════════════
SECTION C: SERVICES AVAILABLE
═══════════════════════════════════════════════════════════════════════════════

Tanda ✓ jika service tersedia di lokasi tersebut

| # | Branch | Nano Ceramic | PPF | Detailing | Premium Wash | Rust Protection | Engine |
|---|--------|--------------|-----|-----------|--------------|-----------------|--------|
| 1 | AutoSPA Pluit | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 2 | AutoSPA Depok 2 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 3 | AutoSPA Express Depok | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 4 | AutoSPA PIK 2 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 5 | AutoSPA Tangerang | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 6 | AutoSPA Bekasi | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 7 | AutoSPA Kranji Bekasi | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 8 | AutoSPA Bogor | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 9 | AutoSPA Serpong | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
|10 | AutoSPA Cikupa | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

═══════════════════════════════════════════════════════════════════════════════
SECTION D: GOOGLE BUSINESS PROFILE
═══════════════════════════════════════════════════════════════════════════════

| # | Branch | Has GBP? | GBP Name | Place ID | Managed By |
|---|--------|----------|----------|----------|------------|
| 1 | AutoSPA Pluit | ⬜ | ⬜ | ⬜ | ⬜ |
| 2 | AutoSPA Depok 2 | ⬜ | ⬜ | ⬜ | ⬜ |
| 3 | AutoSPA Express Depok | ⬜ | ⬜ | ⬜ | ⬜ |
| 4 | AutoSPA PIK 2 | ⬜ | ⬜ | ⬜ | ⬜ |
| 5 | AutoSPA Tangerang | ⬜ | ⬜ | ⬜ | ⬜ |
| 6 | AutoSPA Bekasi | ⬜ | ⬜ | ⬜ | ⬜ |
| 7 | AutoSPA Kranji Bekasi | ⬜ | ⬜ | ⬜ | ⬜ |
| 8 | AutoSPA Bogor | ⬜ | ⬜ | ⬜ | ⬜ |
| 9 | AutoSPA Serpong | ⬜ | ⬜ | ⬜ | ⬜ |
|10 | AutoSPA Cikupa | ⬜ | ⬜ | ⬜ | ⬜ |

═══════════════════════════════════════════════════════════════════════════════
SECTION E: GEOGRAPHIC COORDINATES
═══════════════════════════════════════════════════════════════════════════════

Untuk Google Maps embed dan Schema markup

| # | Branch | Latitude | Longitude | Maps URL |
|---|--------|----------|-----------|----------|
| 1 | AutoSPA Pluit | ⬜ | ⬜ | ⬜ |
| 2 | AutoSPA Depok 2 | ⬜ | ⬜ | ⬜ |
| 3 | AutoSPA Express Depok | ⬜ | ⬜ | ⬜ |
| 4 | AutoSPA PIK 2 | ⬜ | ⬜ | ⬜ |
| 5 | AutoSPA Tangerang | ⬜ | ⬜ | ⬜ |
| 6 | AutoSPA Bekasi | ⬜ | ⬜ | ⬜ |
| 7 | AutoSPA Kranji Bekasi | ⬜ | ⬜ | ⬜ |
| 8 | AutoSPA Bogor | ⬜ | ⬜ | ⬜ |
| 9 | AutoSPA Serpong | ⬜ | ⬜ | ⬜ |
|10 | AutoSPA Cikupa | ⬜ | ⬜ | ⬜ |

Cara mendapatkan:
1. Buka Google Maps
2. Cari lokasi
3. Klik kanan → Coordinates muncul di atas
4. Copy latitude, longitude

═══════════════════════════════════════════════════════════════════════════════
SECTION F: CONTENT ASSETS
═══════════════════════════════════════════════════════════════════════════════

| # | Branch | Has Photos? | Photo Count | Has Description? | Notes |
|---|--------|-------------|-------------|-----------------|-------|
| 1 | AutoSPA Pluit | ⬜ | ⬜ | ⬜ | ⬜ |
| 2 | AutoSPA Depok 2 | ⬜ | ⬜ | ⬜ | ⬜ |
| 3 | AutoSPA Express Depok | ⬜ | ⬜ | ⬜ | ⬜ |
| 4 | AutoSPA PIK 2 | ⬜ | ⬜ | ⬜ | ⬜ |
| 5 | AutoSPA Tangerang | ⬜ | ⬜ | ⬜ | ⬜ |
| 6 | AutoSPA Bekasi | ⬜ | ⬜ | ⬜ | ⬜ |
| 7 | AutoSPA Kranji Bekasi | ⬜ | ⬜ | ⬜ | ⬜ |
| 8 | AutoSPA Bogor | ⬜ | ⬜ | ⬜ | ⬜ |
| 9 | AutoSPA Serpong | ⬜ | ⬜ | ⬜ | ⬜ |
|10 | AutoSPA Cikupa | ⬜ | ⬜ | ⬜ | ⬜ |

═══════════════════════════════════════════════════════════════════════════════
END OF VERIFICATION SHEET
═══════════════════════════════════════════════════════════════════════════════
```

---

## 6. VERIFICATION QUESTIONS

### 6.1 Ownership & Operations

1. **Apakah semua 10 lokasi tersebut masih aktif beroperasi?**
   - Jika tidak, yang mana yang sudah tutup?
   - Jika sementara tutup, kapan dibuka kembali?

2. **Bagaimana hubungan bisnis dengan masing-masing lokasi?**
   - Owned branch (milik AutoSPA langsung)
   - Partner
   - Franchise
   - Workshop collaboration
   - Lainnya (sebutkan)

3. **Apakah ada rencana membuka lokasi baru dalam 6-12 bulan ke depan?**

### 6.2 Contact Information

4. **Apakah nomor telepon yang tertera di website masih aktif dan bisa dihubungi?**
5. **Apakah WhatsApp di кажд lokasi sama atau berbeda?**
   - Jika berbeda, mohon berikan nomor per lokasi

### 6.3 Services

6. **Apakah semua service (Ceramic, PPF, Detailing, Wash) tersedia di semua lokasi?**
   - Jika tidak, service apa yang TIDAK tersedia di lokasi mana?

7. **Apakah ada service khusus yang hanya tersedia di lokasi tertentu?**

### 6.4 Google Business Profile

8. **Apakah masing-masing lokasi memiliki Google Business Profile sendiri?**
   - Jika ya, siapa yang mengelola (pusat atau cabang)?
   - Jika tidak, apakah perlu dibuat?

### 6.5 Content

9. **Apakah tersedia foto-foto setiap lokasi untuk website?**
   - Exterior
   - Interior
   - Facilities
   - Equipment

10. **Apakah ada deskripsi unik per lokasi?**
    - Atau semua lokasi menggunakan deskripsi yang sama?

---

## 7. LOCATION PRIORITY MATRIX

### 7.1 After Verification - Priority for Page Creation

| Priority | Location | Rationale |
|----------|----------|-----------|
| **1** | AutoSPA Pluit | Original branch, most verified, Google Business Profile exists |
| **2** | AutoSPA PIK 2 | New location (2025), promotional content available |
| **3** | AutoSPA Depok 2 | Secondary market, high population |
| **4** | AutoSPA Bekasi | Major market, densely populated |
| **5** | AutoSPA Tangerang | Major market, strategic location |
| **6** | AutoSPA Express Depok | Differentiated (Express concept) |
| **7** | AutoSPA Kranji Bekasi | Secondary in Bekasi area |
| **8** | AutoSPA Bogor | Secondary market |
| **9** | AutoSPA Serpong | Unverified, postpone |
| **10** | AutoSPA Cikupa | Unverified, postpone |

### 7.2 Minimum Viable Location Page

Before creating a `/locations/[slug]/` page, minimum content required:

```
REQUIRED (Must Have)
├── Location name
├── Complete address
├── Phone number
├── WhatsApp number
├── Operating hours
├── Google Maps embed
├── Services available (at least 1)
└── Contact CTA

STRONG (Should Have)
├── Location description (100+ words)
├── 3+ photos
├── 1+ testimonial from this location
├── 1+ project from this location
└── LocalBusiness schema

OPTIONAL (Nice to Have)
├── Facilities list
├── Highlights
├── Staff photo
├── FAQ
└── Google Business Profile link
```

---

## 8. SERVICE-LOCATION RELATIONSHIP

### 8.1 Matrix (To Be Confirmed)

| Service | Pluit | Depok 2 | Express | PIK 2 | Tangerang | Bekasi | Kranji | Bogor | Serpong | Cikupa |
|---------|-------|----------|---------|--------|-----------|--------|--------|-------|---------|--------|
| Nano Ceramic Coating | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ? | ? |
| 360° PPF | ✓ | ✓ | ? | ✓ | ✓ | ✓ | ? | ? | ? | ? |
| Premium Detailing | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ? | ? |
| Premium Wash | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ? | ? |
| Rust Protection | ? | ? | ? | ? | ? | ? | ? | ? | ? | ? |
| Engine Detailing | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ? | ? |

**Legend:** ✓ = Available | ? = Need verification

---

## 9. GEO ARCHITECTURE DECISION TREE

```
NEW LOCATION PAGE?
│
├── Is it a physical branch?
│   └── YES → Create Location CPT entry
│           └── Is status = 'active'?
│               └── YES → Create /locations/[slug]/ page
│               └── NO → Set status, do NOT create page yet
│
└── Is it a service area (no physical location)?
    └── YES → Add to location's service_areas[] field
            └── Do NOT create CPT entry
            └── Do NOT create page
```

---

## 10. CURRENT STATUS

```
PHASE 2A
│
├── ✅ Server Audit
├── ✅ Content Inventory
├── ✅ Gap Analysis
├── ✅ SEO Asset Preservation
├── ✅ Service Extraction
│
└── 🔵 Location Verification
       │
       ├── Website discovery      ✅ Complete
       ├── Initial branch inventory ✅ Complete (10 candidates)
       ├── External verification    ✅ Started (Pluit verified)
       ├── Client verification      ⏳ PENDING ← Current step
       └── Location CPT design     ⏳ After verification
```

---

## 11. NEXT STEPS

### Immediate (Before Blog Audit)

1. **Send Location Verification Sheet to AutoSPA**
   - Excel format for easy data entry
   - Deadline: 1 week

2. **Collect Verification Responses**
   - Follow up after 3 days if no response
   - Clarify ambiguities

3. **Update Location Inventory**
   - Mark verified vs unverified
   - Determine active vs inactive
   - Identify ownership type

### After Verification Complete

4. **Design Location CPT**
   - Based on confirmed fields
   - Create ACF field groups

5. **Create Service-Location Matrix**
   - Confirm which services at which locations

6. **Plan Location Page Rollout**
   - Priority 1-3 first (Pluit, PIK 2, Depok 2)
   - Assess content completeness before publishing

---

**Document Status:** IN PROGRESS - Awaiting Client Verification
**Last Updated:** 2026-08-18
**Next Action:** Send Location Verification Sheet to AutoSPA
