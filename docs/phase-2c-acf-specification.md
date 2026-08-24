# PHASE 2C: ACF FIELD SPECIFICATION
## AutoSP AJakarta - Headless WordPress Project

**Project:** Headless WordPress → Next.js for SEO/GEO Rebuild
**Date:** 2026-08-18
**Status:** TECHNICAL SPECIFICATION (Not for Implementation)

---

## 1. ACF PRINCIPLES

### 1.1 Field Naming Convention

```
PRINCIPLE: snake_case for ALL field names

✅ CORRECT:
  - short_description
  - hero_image
  - vehicle_sizes
  - meta_title

❌ INCORRECT:
  - shortDescription (camelCase)
  - heroImage (camelCase)
  - shortDesc (abbreviated)
  - service_short_desc (mixed)
```

### 1.2 Native WP vs ACF

| Data Type | Storage | Reason |
|----------|---------|--------|
| title | WordPress native | Built-in, SEO-critical |
| slug | WordPress native | Permalink system |
| content | WordPress native | Editor integration |
| excerpt | WordPress native | Built-in |
| featured_image | WordPress native | Featured image system |
| publish_date | WordPress native | Publishing workflow |
| categories | WordPress native | Taxonomy system |
| tags | WordPress native | Taxonomy system |
| structured_data | ACF | Business logic |
| relationships | ACF | Custom connections |
| pricing | ACF | Structured format |
| coordinates | ACF | Non-native data |
| opening_hours | ACF | Structured format |

---

## 2. SERVICE CPT FIELDS

### 2.1 Field Group: Service Content

```
Field Group: service_content
Location: Service CPT
Position: Normal

FIELDS:
┌─────────────────────────────────────────────────────────────────────────┐
│ group: hero                                                         │
│ ├── field: hero_image                                              │
│ │   type: image                                                    │
│ │   return_format: array                                           │
│ │   required: yes                                                  │
│ │                                                                   │
│ ├── field: hero_title                                              │
│ │   type: text                                                     │
│ │   required: yes                                                  │
│ │   max_length: 80                                                │
│ │                                                                   │
│ └── field: hero_description                                        │
│     type: textarea                                                 │
│     rows: 3                                                        │
│     max_length: 300                                                │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ group: content                                                      │
│ ├── field: short_description                                       │
│ │   type: textarea                                                 │
│ │   rows: 4                                                        │
│ │   max_length: 500                                                │
│ │   required: yes                                                  │
│ │                                                                   │
│ ├── field: description                                             │
│ │   type: wysiwyg                                                 │
│ │   tabs: visual                                                   │
│ │   required: yes                                                  │
│ │                                                                   │
│ ├── field: benefits                                                │
│ │   type: repeater                                                │
│ │   sub_fields:                                                    │
│ │   │   ├── benefit_title (text, required)                          │
│ │   │   └── benefit_description (textarea, rows: 2)                  │
│ │   collapsed: benefit_title                                        │
│ │   min: 3                                                        │
│ │   max: 7                                                        │
│ │                                                                   │
│ ├── field: process                                                 │
│ │   type: repeater                                                │
│ │   sub_fields:                                                    │
│ │   │   ├── step_number (number, required)                          │
│ │   │   ├── step_title (text, required)                           │
│ │   │   ├── step_description (textarea, rows: 3)                    │
│ │   │   └── step_image (image, return: url)                       │
│ │   min: 4                                                        │
│ │   max: 8                                                        │
│ │                                                                   │
│ └── field: technology                                             │
│     type: repeater                                                │
│     sub_fields:                                                     │
│     └── technology_name (text, required)                            │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Field Group: Service Packages

```
Field Group: service_packages
Location: Service CPT
Position: Normal

┌─────────────────────────────────────────────────────────────────────────┐
│ group: packages                                                    │
│ type: repeater                                                    │
│ collapsed: package_name                                            │
│ min: 1                                                            │
│ max: 10                                                           │
│                                                                   │
│ SUB-FIELDS:                                                       │
│ ├── field: package_name                                           │
│ │   type: text                                                    │
│ │   required: yes                                                 │
│ │   placeholder: "Light Package"                                   │
│ │                                                                   │
│ ├── field: package_tier                                           │
│ │   type: select                                                  │
│ │   choices:                                                       │
│ │   │   basic | Standard | basic                                   │
│ │   │   standard | Standard | standard                              │
│ │   │   premium | Premium | premium                                 │
│ │   │   ultimate | Ultimate | ultimate                            │
│ │   required: yes                                                 │
│ │                                                                   │
│ ├── field: package_description                                    │
│ │   type: text                                                    │
│ │   placeholder: "Double layer nano ceramic coating"                 │
│ │                                                                   │
│ ├── field: package_recommended                                    │
│ │   type: true_false                                              │
│ │   default_value: 0                                               │
│ │   message: "Mark as recommended package"                         │
│ │                                                                   │
│ ├── field: vehicle_sizes                                          │
│ │   type: repeater                                                │
│ │   min: 5                                                        │
│ │   max: 5                                                        │
│ │   sub_fields:                                                     │
│ │   │   ├── size_label (select, required)                         │
│ │   │   │   choices:                                               │
│ │   │   │       small | Small (City Car)                           │
│ │   │   │       medium | Medium (Sedan/SUV)                        │
│ │   │   │       large | Large (Large SUV)                          │
│ │   │   │       xlarge | X-Large (MPV)                             │
│ │   │   │       super | Super (Luxury)                             │
│ │   │   │                                                          │
│ │   │   └── price (number, required)                               │
│ │   │       thousand-separator: yes                                │
│ │   │       prefix: "IDR "                                        │
│ │                                                                   │
│ ├── field: package_features                                       │
│ │   type: repeater                                                │
│ │   sub_fields:                                                     │
│ │   │   └── feature (text, required)                               │
│ │                                                                   │
│ ├── field: package_durability                                     │
│ │   type: text                                                    │
│ │   placeholder: "1-2 years"                                     │
│ │                                                                   │
│ ├── field: package_maintenance                                   │
│ │   type: text                                                    │
│ │   placeholder: "1 year member maintenance"                       │
│ │                                                                   │
│ └── field: package_workmanship                                   │
│     type: text                                                    │
│     placeholder: "3-4 days"                                      │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Field Group: Service Media

```
Field Group: service_media
Location: Service CPT
Position: Side

┌─────────────────────────────────────────────────────────────────────────┐
│ group: gallery                                                    │
│ type: repeater                                                   │
│ max: 20                                                          │
│                                                                   │
│ SUB-FIELDS:                                                       │
│ ├── field: gallery_image                                          │
│ │   type: image                                                   │
│ │   return_format: array                                          │
│ │   required: yes                                                 │
│ │                                                                   │
│ ├── field: gallery_caption                                       │
│ │   type: text                                                   │
│ │                                                                   │
│ └── field: gallery_type                                          │
│     type: select                                                  │
│     choices:                                                       │
│     before | Before Image                                         │
│     after | After Image                                           │
│     process | Process Image                                       │
│     general | General                                             │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.4 Field Group: Service Relationships

```
Field Group: service_relationships
Location: Service CPT
Position: Side

┌─────────────────────────────────────────────────────────────────────────┐
│ field: related_locations                                         │
│ type: relationship                                               │
│ post_type: location                                              │
│ filters: search                                                   │
│ min: 1                                                            │
│                                                                   │
│ field: related_projects                                          │
│ type: relationship                                               │
│ post_type: project                                               │
│ filters: search                                                   │
│                                                                   │
│ field: related_faqs                                              │
│ type: relationship                                               │
│ post_type: faq                                                   │
│ filters: search                                                   │
│                                                                   │
│ field: related_services                                          │
│ type: relationship                                               │
│ post_type: service                                               │
│ filters: search                                                   │
│                                                                   │
│ field: service_category                                          │
│ type: select                                                     │
│ required: yes                                                     │
│ choices:                                                          │
│ coating | Coating                                                  │
│ protection | Protection                                           │
│ detailing | Detailing                                            │
│ wash | Wash                                                      │
│ other | Other                                                    │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.5 Field Group: Service SEO

```
Field Group: service_seo
Location: Service CPT
Position: Side

┌─────────────────────────────────────────────────────────────────────────┐
│ field: seo_title                                                 │
│ type: text                                                       │
│ max_length: 60                                                   │
│ placeholder: "{title} | AutoSPA Jakarta"                          │
│                                                                   │
│ field: seo_description                                          │
│ type: textarea                                                   │
│ rows: 3                                                          │
│ max_length: 160                                                  │
│                                                                   │
│ field: seo_canonical                                            │
│ type: url                                                         │
│                                                                   │
│ field: seo_robots                                               │
│ type: checkbox                                                   │
│ choices:                                                          │
│ index | Index                                                    │
│ follow | Follow                                                  │
│                                                                   │
│ field: seo_focus_keyword                                        │
│ type: text                                                       │
│                                                                   │
│ field: seo_og_image                                             │
│ type: image                                                     │
│ return_format: array                                             │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. LOCATION CPT FIELDS

### 3.1 Field Group: Location Identity

```
Field Group: location_identity
Location: Location CPT
Position: Normal (tab 1)

┌─────────────────────────────────────────────────────────────────────────┐
│ field: location_status                                           │
│ type: select                                                     │
│ required: yes                                                     │
│ default_value: draft                                              │
│ choices:                                                          │
│ draft | Draft (Not verified)                                       │
│ verified | Verified (Data complete)                                │
│ active | Active (Operating)                                        │
│ inactive | Inactive (Closed/Temporary)                            │
│                                                                   │
│ field: location_phone                                            │
│ type: text                                                       │
│ required: yes                                                     │
│ placeholder: "021-XXXX-XXXX"                                     │
│                                                                   │
│ field: location_whatsapp                                         │
│ type: text                                                       │
│ placeholder: "628XXXXXXXXX"                                       │
│                                                                   │
│ field: location_email                                            │
│ type: email                                                     │
│ placeholder: "info@autospajakarta.com"                            │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Field Group: Location Address

```
Field Group: location_address
Location: Location CPT
Position: Normal (tab 1)

┌─────────────────────────────────────────────────────────────────────────┐
│ field: address_street                                            │
│ type: text                                                       │
│ required: yes                                                     │
│ placeholder: "Jl. Pluit Karang Ayu Barat No.16"                   │
│                                                                   │
│ field: address_district                                          │
│ type: text                                                       │
│ placeholder: "Pluit"                                             │
│                                                                   │
│ field: address_city                                             │
│ type: text                                                       │
│ required: yes                                                     │
│ placeholder: "Jakarta Utara"                                      │
│                                                                   │
│ field: address_province                                          │
│ type: text                                                       │
│ required: yes                                                     │
│ placeholder: "DKI Jakarta"                                        │
│                                                                   │
│ field: address_postal_code                                       │
│ type: text                                                       │
│ placeholder: "14440"                                             │
│                                                                   │
│ field: address_country                                           │
│ type: text                                                       │
│ default_value: "Indonesia"                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Field Group: Location Geo

```
Field Group: location_geo
Location: Location CPT
Position: Normal (tab 1)

┌─────────────────────────────────────────────────────────────────────────┐
│ field: geo_latitude                                             │
│ type: number                                                   │
│ required: yes                                                   │
│ step: 0.000001                                                │
│                                                                   │
│ field: geo_longitude                                           │
│ type: number                                                   │
│ required: yes                                                   │
│ step: 0.000001                                                │
│                                                                   │
│ field: google_maps_url                                          │
│ type: url                                                       │
│ placeholder: "https://maps.google.com/..."                      │
│                                                                   │
│ field: google_place_id                                          │
│ type: text                                                      │
│ placeholder: "ChIJ..."                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.4 Field Group: Location Business

```
Field Group: location_business
Location: Location CPT
Position: Normal (tab 2)

┌─────────────────────────────────────────────────────────────────────────┐
│ field: opening_hours                                            │
│ type: repeater                                                 │
│ min: 7                                                         │
│ max: 7                                                          │
│                                                                   │
│ SUB-FIELDS:                                                     │
│ ├── field: day_name                                             │
│ │   type: select                                                │
│ │   choices:                                                     │
│ │   monday | Monday                                             │
│ │   tuesday | Tuesday                                           │
│ │   wednesday | Wednesday                                        │
│ │   thursday | Thursday                                         │
│ │   friday | Friday                                             │
│ │   saturday | Saturday                                          │
│ │   sunday | Sunday                                             │
│ │                                                               │
│ ├── field: is_closed                                            │
│ │   type: true_false                                            │
│ │   default_value: 0                                             │
│ │                                                               │
│ ├── field: open_time                                            │
│ │   type: time_picker                                           │
│ │   display_format: H:i                                          │
│ │   return_format: H:i                                           │
│ │                                                               │
│ └── field: close_time                                           │
│     type: time_picker                                           │
│     display_format: H:i                                          │
│     return_format: H:i                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.5 Field Group: Location Content

```
Field Group: location_content
Location: Location CPT
Position: Normal (tab 2)

┌─────────────────────────────────────────────────────────────────────────┐
│ field: location_tagline                                         │
│ type: text                                                      │
│ max_length: 100                                                 │
│ placeholder: "Spesialis Ceramic Coating sejak 2014"               │
│                                                                   │
│ field: location_description                                     │
│ type: wysiwyg                                                  │
│ tabs: visual                                                    │
│ required: yes                                                    │
│                                                                   │
│ field: location_highlights                                     │
│ type: repeater                                                 │
│ max: 5                                                          │
│ SUB-FIELDS:                                                     │
│ └── highlight (text, required)                                   │
│                                                                   │
│ field: location_facilities                                     │
│ type: repeater                                                 │
│ max: 10                                                         │
│ SUB-FIELDS:                                                     │
│ └── facility (text, required)                                   │
│                                                                   │
│ field: service_areas                                           │
│ type: repeater                                                 │
│ SUB-FIELDS:                                                     │
│ └── area_name (text, required)                                  │
│     placeholder: "Jakarta Utara"                                │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.6 Field Group: Location Relationships

```
Field Group: location_relationships
Location: Location CPT
Position: Side

┌─────────────────────────────────────────────────────────────────────────┐
│ field: location_services                                        │
│ type: relationship                                             │
│ post_type: service                                              │
│ filters: search                                                 │
│ min: 1                                                          │
│                                                                   │
│ field: location_google_business_url                              │
│ type: url                                                       │
│ placeholder: "Google Business Profile URL"                       │
│                                                                   │
│ field: location_testimonials                                    │
│ type: relationship                                             │
│ post_type: testimonial                                          │
│ filters: search                                                 │
│                                                                   │
│ field: location_faqs                                           │
│ type: relationship                                             │
│ post_type: faq                                                  │
│ filters: search                                                 │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.7 Field Group: Location Gallery

```
Field Group: location_gallery
Location: Location CPT
Position: Side

┌─────────────────────────────────────────────────────────────────────────┐
│ field: location_gallery                                         │
│ type: repeater                                                 │
│ max: 30                                                         │
│                                                                   │
│ SUB-FIELDS:                                                     │
│ ├── field: location_gallery_image                               │
│ │   type: image                                                │
│ │   return_format: array                                       │
│ │   required: yes                                               │
│ │                                                               │
│ ├── field: location_gallery_caption                             │
│ │   type: text                                                │
│ │                                                               │
│ └── field: location_gallery_type                              │
│     type: select                                               │
│     choices:                                                    │
│     exterior | Exterior                                         │
│     interior | Interior                                         │
│     facility | Facility                                         │
│     team | Team                                                │
│     general | General                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. PROJECT CPT FIELDS

### 4.1 Field Group: Project Content

```
Field Group: project_content
Location: Project CPT
Position: Normal

┌─────────────────────────────────────────────────────────────────────────┐
│ field: vehicle_brand                                            │
│ type: text                                                     │
│ required: yes                                                    │
│ placeholder: "Toyota"                                           │
│                                                                   │
│ field: vehicle_model                                           │
│ type: text                                                     │
│ required: yes                                                    │
│ placeholder: "Alphard"                                         │
│                                                                   │
│ field: vehicle_year                                            │
│ type: text                                                     │
│ placeholder: "2023"                                            │
│                                                                   │
│ field: vehicle_color                                           │
│ type: text                                                     │
│ placeholder: "Black"                                            │
│                                                                   │
│ field: project_challenge                                       │
│ type: textarea                                                 │
│ rows: 4                                                        │
│ placeholder: "Apa masalah yang dibawa customer?"                 │
│                                                                   │
│ field: project_solution                                       │
│ type: textarea                                                 │
│ rows: 4                                                        │
│ placeholder: "Solusi yang dilakukan"                             │
│                                                                   │
│ field: project_result                                         │
│ type: textarea                                                 │
│ rows: 4                                                        │
│ placeholder: "Hasil akhir yang dicapai"                        │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Field Group: Project Media

```
Field Group: project_media
Location: Project CPT
Position: Normal

┌─────────────────────────────────────────────────────────────────────────┐
│ field: before_images                                            │
│ type: gallery                                                  │
│ min: 1                                                          │
│                                                                   │
│ field: process_images                                          │
│ type: gallery                                                  │
│                                                                   │
│ field: after_images                                            │
│ type: gallery                                                  │
│ min: 1                                                          │
│                                                                   │
│ field: project_gallery                                        │
│ type: gallery                                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Field Group: Project Relationships

```
Field Group: project_relationships
Location: Project CPT
Position: Side

┌─────────────────────────────────────────────────────────────────────────┐
│ field: project_service                                         │
│ type: relationship                                             │
│ post_type: service                                              │
│ required: yes                                                    │
│                                                                   │
│ field: project_location                                         │
│ type: relationship                                             │
│ post_type: location                                             │
│                                                                   │
│ field: completed_at                                            │
│ type: date_picker                                              │
│ display_format: d/m/Y                                           │
│ return_format: Y-m-d                                            │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 5. FAQ CPT FIELDS

### 5.1 Field Group: FAQ Content

```
Field Group: faq_content
Location: FAQ CPT
Position: Normal

┌─────────────────────────────────────────────────────────────────────────┐
│ field: faq_question                                            │
│ type: text                                                     │
│ required: yes                                                    │
│ placeholder: "Berapa lama proses ceramic coating?"                │
│                                                                   │
│ field: faq_answer                                              │
│ type: wysiwyg                                                 │
│ tabs: visual                                                   │
│ required: yes                                                    │
│                                                                   │
│ field: faq_order                                              │
│ type: number                                                   │
│ default_value: 0                                                │
│                                                                   │
│ field: faq_featured                                            │
│ type: true_false                                               │
│ default_value: 0                                                │
│ message: "Show in FAQ page highlights"                           │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Field Group: FAQ Context

```
Field Group: faq_context
Location: FAQ CPT
Position: Side

┌─────────────────────────────────────────────────────────────────────────┐
│ field: faq_service                                             │
│ type: relationship                                             │
│ post_type: service                                              │
│                                                                   │
│ field: faq_location                                           │
│ type: relationship                                             │
│ post_type: location                                             │
│                                                                   │
│ field: faq_category                                           │
│ type: select                                                     │
│ choices:                                                         │
│ general | General                                               │
│ pricing | Pricing                                               │
│ process | Process                                               │
│ technical | Technical                                          │
│ booking | Booking                                               │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6. TESTIMONIAL CPT FIELDS

### 6.1 Field Group: Testimonial Content

```
Field Group: testimonial_content
Location: Testimonial CPT
Position: Normal

┌─────────────────────────────────────────────────────────────────────────┐
│ field: customer_name                                           │
│ type: text                                                     │
│ required: yes                                                    │
│ placeholder: "Bpk. John Doe"                                    │
│                                                                   │
│ field: customer_role                                           │
│ type: text                                                     │
│ placeholder: "Pengusaha"                                        │
│                                                                   │
│ field: customer_company                                       │
│ type: text                                                     │
│ placeholder: "PT Contoh Indonesia"                               │
│                                                                   │
│ field: customer_quote                                         │
│ type: textarea                                                 │
│ rows: 4                                                        │
│ required: yes                                                    │
│                                                                   │
│ field: customer_vehicle                                        │
│ type: text                                                     │
│ placeholder: "Toyota Alphard 2023"                               │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Field Group: Testimonial Media

```
Field Group: testimonial_media
Location: Testimonial CPT
Position: Normal

┌─────────────────────────────────────────────────────────────────────────┐
│ field: customer_photo                                         │
│ type: image                                                     │
│ return_format: array                                            │
│ preview_size: thumbnail                                         │
│                                                                   │
│ field: video_url                                               │
│ type: url                                                       │
│ placeholder: "YouTube or video URL (optional)"                   │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.3 Field Group: Testimonial Context

```
Field Group: testimonial_context
Location: Testimonial CPT
Position: Side

┌─────────────────────────────────────────────────────────────────────────┐
│ field: testimonial_service                                     │
│ type: relationship                                             │
│ post_type: service                                              │
│                                                                   │
│ field: testimonial_location                                    │
│ type: relationship                                             │
│ post_type: location                                             │
│                                                                   │
│ field: testimonial_source                                      │
│ type: select                                                     │
│ required: yes                                                    │
│ choices:                                                         │
│ website | Website                                                │
│ google | Google Review                                          │
│ instagram | Instagram                                            │
│ facebook | Facebook                                             │
│ other | Other                                                   │
│                                                                   │
│ field: testimonial_source_url                                   │
│ type: url                                                       │
│ placeholder: "Link to original review"                           │
│                                                                   │
│ field: testimonial_featured                                    │
│ type: true_false                                               │
│ default_value: 0                                               │
│ message: "Display prominently"                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 7. SITE CONFIG (OPTIONS PAGE)

### 7.1 ACF Options Page

```
Page: Site Configuration
Parent: Options
Position: High

┌─────────────────────────────────────────────────────────────────────────┐
│ FIELD GROUP: organization_info                                   │
│                                                                   │
│ field: org_name                                                │
│ type: text                                                     │
│ required: yes                                                   │
│ default_value: "AutoSP AJakarta"                                │
│                                                                   │
│ field: org_legal_name                                          │
│ type: text                                                     │
│                                                                   │
│ field: org_description                                         │
│ type: textarea                                                 │
│ rows: 3                                                        │
│                                                                   │
│ field: org_logo                                                │
│ type: image                                                     │
│ return_format: array                                            │
│                                                                   │
│ field: org_favicon                                             │
│ type: image                                                     │
│ return_format: array                                            │
│                                                                   │
│ field: org_url                                                │
│ type: url                                                       │
│ default_value: "https://autospajakarta.com"                    │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ FIELD GROUP: organization_contact                               │
│                                                                   │
│ field: org_primary_phone                                       │
│ type: text                                                     │
│ placeholder: "021-XXXX-XXXX"                                    │
│                                                                   │
│ field: org_whatsapp                                            │
│ type: text                                                     │
│ placeholder: "628XXXXXXXXX"                                     │
│                                                                   │
│ field: org_email                                              │
│ type: email                                                    │
│ default_value: "info@autospajakarta.com"                       │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ FIELD GROUP: social_profiles                                    │
│                                                                   │
│ field: social_instagram                                         │
│ type: url                                                       │
│                                                                   │
│ field: social_facebook                                         │
│ type: url                                                       │
│                                                                   │
│ field: social_youtube                                           │
│ type: url                                                       │
│                                                                   │
│ field: social_tiktok                                            │
│ type: url                                                       │
│                                                                   │
│ field: social_linkedin                                          │
│ type: url                                                       │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ FIELD GROUP: default_seo                                        │
│                                                                   │
│ field: default_seo_title                                       │
│ type: text                                                     │
│ max_length: 60                                                 │
│ placeholder: "{page_title} | AutoSPA Jakarta"                   │
│                                                                   │
│ field: default_seo_description                                │
│ type: textarea                                                 │
│ rows: 3                                                        │
│ max_length: 160                                                │
│                                                                   │
│ field: default_og_image                                       │
│ type: image                                                    │
│ return_format: array                                           │
│                                                                   │
│ field: default_robots                                         │
│ type: checkbox                                                 │
│ choices:                                                        │
│ index | Index                                                   │
│ follow | Follow                                                 │
│                                                                   │
│ field: google_analytics_id                                     │
│ type: text                                                     │
│ placeholder: "G-XXXXXXXXXX"                                    │
│                                                                   │
│ field: google_tag_manager_id                                   │
│ type: text                                                     │
│ placeholder: "GTM-XXXXXXX"                                     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 8. BLOG POST ADDITIONAL FIELDS

### 8.1 Field Group: Post Relationships

```
Field Group: post_relationships
Location: Post (Posts)
Position: Side

┌─────────────────────────────────────────────────────────────────────────┐
│ field: post_topic                                               │
│ type: text                                                     │
│ placeholder: "Ceramic Coating"                                  │
│ instructions: "Semantic topic classification"                    │
│                                                                   │
│ field: post_service                                           │
│ type: relationship                                             │
│ post_type: service                                              │
│                                                                   │
│ field: post_location                                           │
│ type: relationship                                             │
│ post_type: location                                             │
└─────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Field Group: Migration Status

```
Field Group: migration_status
Location: Post (Posts)
Position: Side (collapsed)

┌─────────────────────────────────────────────────────────────────────────┐
│ field: migration_status                                        │
│ type: select                                                     │
│ choices:                                                         │
│ pending | Pending Review                                         │
│ reviewed | Reviewed                                             │
│ updated | Updated                                               │
│ merged | Merged                                                 │
│ redirected | Redirected                                         │
│ noindex | Noindex                                              │
│                                                                   │
│ field: migration_notes                                          │
│ type: textarea                                                 │
│ rows: 3                                                         │
│ placeholder: "Internal notes about migration status"               │
│                                                                   │
│ field: migration_date                                          │
│ type: date_time_picker                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 9. FIELD REFERENCE

### 9.1 Service Fields Summary

| Field Group | Field Name | Type | Required | Repeater |
|------------|-----------|------|---------|----------|
| hero | hero_image | image | yes | no |
| hero | hero_title | text | yes | no |
| hero | hero_description | textarea | no | no |
| content | short_description | textarea | yes | no |
| content | description | wysiwyg | yes | no |
| content | benefits | repeater | no | yes |
| content | process | repeater | no | yes |
| content | technology | repeater | no | yes |
| packages | packages | repeater | no | yes |
| media | gallery | repeater | no | yes |
| relationships | related_locations | relationship | no | yes |
| relationships | related_projects | relationship | no | yes |
| relationships | related_faqs | relationship | no | yes |
| relationships | service_category | select | yes | no |
| seo | seo_title | text | no | no |
| seo | seo_description | textarea | no | no |
| seo | seo_canonical | url | no | no |

### 9.2 Location Fields Summary

| Field Group | Field Name | Type | Required | Repeater |
|------------|-----------|------|---------|----------|
| identity | location_status | select | yes | no |
| identity | location_phone | text | yes | no |
| address | address_street | text | yes | no |
| address | address_city | text | yes | no |
| geo | geo_latitude | number | yes | no |
| geo | geo_longitude | number | yes | no |
| business | opening_hours | repeater | no | yes |
| content | location_description | wysiwyg | yes | no |
| content | service_areas | repeater | no | yes |
| relationships | location_services | relationship | yes | yes |

---

## 10. VALIDATION RULES

### 10.1 Service

```
REQUIRED:
- hero_image
- hero_title
- short_description
- description
- service_category
- related_locations (min: 1)

VALIDATION:
- short_description max_length: 500
- seo_title max_length: 60
- seo_description max_length: 160
- vehicle_sizes must have exactly 5 entries (small/medium/large/xlarge/super)
- price must be positive integer
```

### 10.2 Location

```
REQUIRED:
- location_status
- location_phone
- address_street
- address_city
- geo_latitude
- geo_longitude
- location_description
- location_services (min: 1)

VALIDATION:
- latitude range: -90 to 90
- longitude range: -180 to 180
- phone format: digits and dashes only
- whatsapp format: starts with 62
```

### 10.3 Project

```
REQUIRED:
- vehicle_brand
- vehicle_model
- project_service
- before_images (min: 1)
- after_images (min: 1)

VALIDATION:
- year format: 4 digits
- completed_at: valid date
```

---

**Document Status:** TECHNICAL SPECIFICATION (For Review)
**Last Updated:** 2026-08-18
**Next:** Review → Schema Freeze → Phase 2D Implementation
