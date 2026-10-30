# Checklist: Restore the CMS Model for Services (and the other CPTs)

**Tanggal verifikasi:** 2026-10-30
**Target:** `https://backend.autospajakarta.com` (staging)
**Status:** ⛔ belum dijalankan — butuh akses admin WP / shell

Dokumen ini adalah hasil audit terhadap staging pada 2026-10-30 memakai WordPress
MCP server (`mcp__wordpress__` → `backend.autospajakarta.com`) dan probe langsung
ke GraphQL/REST. Semua artefak yang dibutuhkan sudah ada di repo ini — yang hilang
adalah **pendaftaran**-nya di WordPress.

---

## 0. Diagnosis

| Cek | Cara | Hasil |
|---|---|---|
| WPGraphQL | `rank-math/get-system-status` (MCP) | ✅ aktif, versi **2.25.0** |
| WPGraphQL for ACF | idem | ✅ aktif, versi **3.0.0** |
| ACF | idem | ✅ aktif, versi **6.8.10** |
| Theme | idem | `Headless WP` (headless-wp-theme-O62MHDLGDohELCd1) |
| Plugin CPT | idem | ❌ tidak ada plugin/mu-plugin yang mendaftarkan CPT |
| `{ services(first:5) }` | POST `index.php?graphql` | ❌ `Cannot query field "services" on type "RootQuery"` |
| `{ serviceBy(slug:) }` | POST `index.php?graphql` | ❌ `Cannot query field "serviceBy" on type "RootQuery"` |
| `POST /wp/v2/types` | REST | ❌ hanya `post, page, attachment, …, rank_math_schema` |
| Rank Math sitemap | MCP | `post, page, category, video, local` — ❌ tidak ada `service` |
| Introspection | GraphQL | ❌ `introspection is not allowed for public requests by default` |

**Kesimpulan:** WPGraphQL + ACF sehat, tetapi **CPT `service` (dan 4 CPT lainnya)
tidak terdaftar**. Test data Phase 2D.7 (ID 6994–7006) juga hilang — staging
sekarang jelas install baru (ID post tertinggi ~4581, WP 7.1.4, theme & plugin
terpasang ulang dengan slug/hash baru).

Akibatnya `src/lib/services/catalog.ts` selalu jatuh ke mirror statis
`src/data/services.ts` (lihat `wordPressUnavailable` di file itu).

---

## 1. Yang harus didaftarkan

### 1.1 Lima CPT — `cpt/cpt-registration.php`

| CPT | GraphQL single / plural | Archive | `show_in_graphql` | `show_in_rest` | Dipakai frontend |
|---|---|---|---|---|---|
| `service` | `Service` / `Services` | `services` | ✅ | ✅ | ✅ repository services |
| `location` | `Location` / `Locations` | `locations` | ✅ | ✅ | ✅ query locations |
| `project` | `Project` / `Projects` | `projects` | ✅ | ✅ | ✅ relasi service |
| `faq` | `FAQ` / `FAQs` | — | ✅ | ✅ | ✅ relasi service |
| `testimonial` | `Testimonial` / `Testimonials` | — | ✅ | ✅ | ✅ relasi service |

Semua `supports`: `title, editor, thumbnail, excerpt, custom-fields, author`
(`project` & `testimonial` tanpa `editor`/`excerpt`).

> File ini adalah **plugin**: taruh di `wp-content/plugins/autosp-cpt/cpt-registration.php`
> lalu aktifkan, atau tempel ke dalam `functions.php` theme. `register_activation_hook`
> sudah menangani flush rewrite rules.

### 1.2 Dua puluh empat field group — `acf-json/group_*.json`

Kolom **GraphQL** adalah **kontrak** yang dipakai query frontend
(`src/lib/wordpress/queries/{services,locations}.ts`). Perhatikan tiga yang tidak
bisa ditebak dari judul grupnya:

| Group key | Judul ACF | GraphQL | Field | CPT |
|---|---|---|---|---|
| `group_service_hero` | Service Hero | `serviceHero` | 3 | service |
| `group_service_content` | Service Content | `serviceContent` | 5 (+3 repeater) | service |
| `group_service_packages` | Service Packages | `servicePackages` | 1 repeater | service |
| `group_service_media` | Service Gallery | **`serviceGallery`** ⚠ | 1 repeater | service |
| `group_service_relationships` | Service Relationships | `serviceRelationships` | 5 | service |
| `group_service_seo` | Service SEO | **`serviceSEO`** ⚠ | 6 | service |
| `group_location_identity` | Location Identity | `locationIdentity` | 4 | location |
| `group_location_address` | Location Address | `locationAddress` | 7 | location |
| `group_location_geo` | Location Geo | `locationGeo` | 4 | location |
| `group_location_business` | Business Hours | **`businessHours`** ⚠ | 1 repeater | location |
| `group_location_content` | Location Content | `locationContent` | 4 | location |
| `group_location_relationships` | Location Relationships | `locationRelationships` | 4 | location |
| `group_location_gallery` | Location Gallery | `locationGallery` | 1 repeater | location |
| `group_project_content` | Project Content | `projectContent` | 7 | project |
| `group_project_media` | Project Media | `projectMedia` | 4 | project |
| `group_project_relationships` | Project Relationships | `projectRelationships` | 3 | project |
| `group_faq_content` | FAQ Content | **`fAQContent`** ⚠ | 4 | faq |
| `group_faq_context` | FAQ Context | **`fAQContext`** ⚠ | 3 | faq |
| `group_testimonial_content` | Testimonial Content | `testimonialContent` | 6 | testimonial |
| `group_testimonial_media` | Testimonial Media | `testimonialMedia` | 2 | testimonial |
| `group_testimonial_context` | Testimonial Context | `testimonialContext` | 5 | testimonial |
| `group_post_relationships` | Post Relationships | `postRelationships` | 3 | post |
| `group_migration_status` | Migration Status | `migrationStatus` | 3 | post |
| `group_site_config` | Site Configuration | `siteConfiguration` | 24 (4 tab) | options page |

### 1.3 Pilihan `select` yang wajib ada

| Field | Nilai tersimpan → label |
|---|---|
| `service_category` | `coating`, `protection`, `detailing`, `wash`, `other` |
| `package_tier` | `basic`, `standard`, `premium`, `ultimate` |
| `size_label` (dalam `vehicle_sizes`) | `small`, `medium`, `large`, `xlarge`, `super` |
| `gallery_type` | `before`, `after`, `process`, `general` |
| `location_status` | `draft`, `verified`, `active`, `inactive` |
| `day_name` (dalam `opening_hours`) | `monday` … `sunday` |
| `location_gallery_type` | `exterior`, `interior`, `facility`, `team`, `general` |
| `faq_category` | `general`, `pricing`, `process`, `technical`, `booking` |
| `testimonial_source` | `website`, `google`, `instagram`, `facebook`, `other` |
| `migration_status` | `pending`, `reviewed`, `updated`, `merged`, `redirected`, `noindex` |

Nilai-nilai ini sudah dipetakan di `src/lib/wordpress/choices.ts` — kalau label
di ACF berubah, dua file itu harus ikut berubah.

### 1.4 Target relationship

| Field | Menunjuk ke |
|---|---|
| `related_services`, `related_projects`, `related_faqs`, `related_locations` (service) | CPT masing-masing |
| `location_services`, `location_testimonials`, `location_faqs` | CPT masing-masing |
| `project_service`, `project_location` | service / location |
| `faq_service`, `faq_location` | service / location |
| `testimonial_service`, `testimonial_location` | service / location |
| `post_service`, `post_location` (post) | service / location |

---

## 2. Prosedur

### Jalur A — WP Admin (tanpa SSH; Recommended sekarang)

Shell staging **tidak bisa diakses** dari mesin ini (`ssh -p 16916 …` timeout,
dan `docs/phase-2d9-execution-report.md` sudah mencatat `Permission denied`),
jadi semua langkah harus lewat WP Admin.

1. **Daftarkan CPT**
   WP Admin → Plugins → Install Plugin → Upload Plugin. Plugin-nya adalah
   `cpt/cpt-registration.php` (rename file/folder jadi `autosp-cpt.php` /
   folder `autosp-cpt/`), lalu **Activate**. Setelah aktivasi rewrite rules
   ter-flush otomatis.
2. **Import field group**
   WP Admin → ACF → Tools → Import Field Groups, satu per file (urutan
   `group_service` → `group_location` → `group_project` → `group_faq` →
   `group_testimonial` → `group_post` → `group_site_config`).
3. **Pasang options page** (hanya untuk `group_site_config`) — `acf-json/README.md`
   memuat potongan PHP `acf_add_options_page()`; tempel ke theme atau plugin kecil.
4. **Set nama GraphQL + exposure**
   WP Admin → ACF → tiap grup → Settings → centang **Show in GraphQL**, lalu isi
   **GraphQL Field Name** dengan nilai di tabel §1.2.(group "Service SEO" → `serviceSEO`,
   "Service Gallery" → `serviceGallery`, "FAQ Content" → `fAQContent`, "Business Hours" → `businessHours`).
   Alternatif: jalankan `acf-json/fix-graphql-group-names.php` via WP-CLI (Jalur B)
   atau WP Admin → Code Snippets/Plugin sementara.
5. **Aktifkan public introspection** (opsional, sangat disarankan untuk audit):
   WP Admin → GraphQL → Settings → *Enable Public Introspection*.
6. **Bersihkan cache schema**: WP Admin → GraphQL → Settings → Clear Schema Cache.

### Jalur B — SSH + WP-CLI (kalau akses shell sudah dikembalikan)

```bash
ssh -p 16916 root@148.230.101.241
WP="php /www/server/php/82/bin/php /tmp/wp-cli.phar --path=/www/wwwroot/backend.autospajakarta.com --allow-root"

# 1. CPT
$WP plugin install /tmp/autosp-cpt/autosp-cpt.php --activate

# 2. Field groups
$WP acf import group_service.json      # ulangi untuk 7 file
#    (butuh WP-CLI ACF: wp package install wp-cli/acf)

# 3. Nama GraphQL + exposure (menggantikan langkah manual #4)
$WP eval-file acf-json/fix-graphql-group-names.php --report
$WP eval-file acf-json/fix-graphql-group-names.php --write

# 4. Introspection
$WP eval-file acf-json/enable-introspection.php

# 5. Cache
$WP transient delete wpgraphql_schema
$WP option delete wpgraphql_schema
```

---

## 3. Jebakan

1. **Nama field group GraphQL.** `acf-json/enable-graphql-all-groups.php` yang
   sudah ada **menurunkan** nama dari `post_name` ("Service SEO" → `ServiceSeo`),
   sedangkan frontend meminta `serviceSEO`. Kalau skrip itu dipakai apa adanya,
   grup akan terekspos dengan nama yang tidak pernah ditanyakan →
   `Cannot query field "serviceSEO" on type "Service"`.
   `acf-json/fix-graphql-group-names.php` (baru, di repo ini) menutup jebakan ini.
2. **`acf-json/verify-graphql.php` memakai endpoint lama**
   `https://backend.autospajakarta.com/graphql` → **404**. Host staging hanya
   merutekan lewat `index.php`. Query harus ke
   `https://backend.autospajakarta.com/index.php?graphql` (POST).
3. **Introspection mati untuk request publik.** Tanpa itu, schema tidak bisa
   diaudit dari luar. `acf-json/enable-introspection.php` menyalakannya dengan
   menulis `public_introspection = true` ke option `graphql_settings`.
   Matikan lagi setelah audit selesai.
4. **Bentuk repeater.** `benefits` dan `process` pernah meledak dengan
   *Internal server error* karena meta tersimpan dalam bentuk yang salah
   (`docs/phase-2d9-execution-report.md`, Finding 3). Repo ini punya
   `acf-json/fix-acf-field-format.php`; **jangan** menjalankan
   `migrate-2d9-real-content.php --write` tanpa `--inspect` lebih dulu, dan
   tanpa dump database.
5. **Relationship harus array.** `update_post_meta($id, 'faq_service', 5)` menulis
   skalar; ACF `relationship` menyimpan array → field resolve `null`.
   `fix-relationships.php` dan `migrate-2d9-real-content.php` sudah pakai helper
   `add_relation()` yang menulis array + meta referensi `_<field>`.
6. **Backup database sebelum menulis apa pun.** Ini syarat yang sudah tercatat
   di laporan 2D.9 (Blocker B2).
7. **Test data Phase 2D.7 hilang** (ID 6994–7006). Kalau butuh fixture,
   `acf-json/complete-business-dataset.php` + `create-test-relationships.php`
   membuatnya ulang — tapi perbaiki dulu scalar-vs-array di
   `create-test-relationships.php` (Finding 1 di laporan 2D.9).
8. **Production tetap read-only.** Semua yang di atas hanya untuk staging.
   `autospajakarta.com` tidak punya CPT `service` sama sekali
   (hanya `post`, `page`, `elementor_library`, `metform-entry`, …) — jangan
   dipakai sebagai sumber data layanan.

---

## 4. Verifikasi

**a. GraphQL — CPT muncul**

```bash
curl -s -X POST "https://backend.autospajakarta.com/index.php?graphql" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ services(first:3){ nodes{ slug title serviceContent{ shortDescription } } } }"}'
```

Harus: `{"data":{"services":{"nodes":[...]}}}` — tanpa `errors`.

**b. GraphQL — grup ACF ter-expose dengan nama yang benar**

```bash
curl -s -X POST "https://backend.autospajakarta.com/index.php?graphql" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ serviceBy(slug:\"premium-wash\"){ slug serviceHero{ heroTitle } serviceContent{ shortDescription } serviceSEO{ seoTitle } } }"}'
```

Harus: semua field terisi, `errors` kosong. Kalau `Cannot query field "serviceSEO"`
→ nama grup belum benar (lihat Jebakan 1).

**c. Frontend**

```bash
npm run typecheck
npm run dev
node scripts/sync/check-inner-nav.mjs /services/premium-wash
```

- Di log dev server harus muncul `[services] WordPress returned no service` **hilang**
  (peringatan itu hanya muncul ketika fallback dipakai).
- `check:nav` tetap harus 5/5 OK (1 nav, 1 link "Booking Now", tanpa overflow 390px).

**d. Tidak ada regresi di mirror** — kalau CMS menjawab dengan data kosong, katalog
tetap harus merender 6 layanan dari mirror (aturan "katalog tidak pernah kosong"
di `docs/service-architecture.md`).

---

## 5. Peta file

| Kebutuhan | File di repo |
|---|---|
| Registrasi 5 CPT | `cpt/cpt-registration.php` |
| Import 24 field group | `acf-json/group_{service,location,project,faq,testimonial,post,site_config}.json` |
| Panduan import | `acf-json/README.md` |
| Nama GraphQL + exposure | `acf-json/fix-graphql-group-names.php` (baru) |
| Skrip lama (berbahaya, nama derives) | `acf-json/enable-graphql-all-groups.php` |
| Introspection on | `acf-json/enable-introspection.php` |
| Taxonomy (kategori/tags) | `cpt/taxonomy-setup.php`, `cpt/TAXONOMY-SETUP.md` |
| Test dataset | `acf-json/complete-business-dataset.php`, `acf-json/create-test-relationships.php` |
| Perbaikan repeater/relationship | `acf-json/fix-acf-field-format.php`, `acf-json/fix-relationships.php` |
| Laporan blocking 2D.9 | `_reference/New folder/docs/phase-2d9-execution-report.md` — **lokal saja, di-gitignore**; salin ke `docs/` kalau mau dipakai sebagai rujukan tim |
| Kontrak query frontend | `src/lib/wordpress/queries/services.ts`, `src/lib/wordpress/queries/locations.ts` |
| Pemetaan pilihan | `src/lib/wordpress/choices.ts` |

---

## 6. Dampak ke frontend setelah CMS hidup

Tidak ada perubahan kode frontend yang diperlukan:

- `src/lib/services/catalog.ts` sudah didesain untuk "WordPress menang per field,
  mirror mengisi kekosongan" — begitu `services`/`serviceBy` menjawab, repository
  yang ada akan mengambil alih secara otomatis.
- Field `video` (clip pembuka halaman layanan) tetap berasal dari mirror
  `src/data/services.ts` — file lokal `public/videos`, bukan aset CMS.
- `revalidate = 300` di `src/app/(inner)/services/[slug]/page.tsx` → katalog
  mengikuti CMS maksimal 5 menit.
