# PHASE 1A: URL MAPPING DOCUMENT
## AutoSP AJakarta Headless WordPress Migration

**Project:** Headless WordPress → Next.js for SEO/GEO Rebuild
**Date:** 2026-08-18
**Prepared by:** Claude

---

## 📊 URL INVENTORY SUMMARY

| Category | Count | Action |
|----------|-------|--------|
| Pages | 19 | 15 Keep, 4 Redirect |
| Blog Posts | 174 | 170 Keep, 4 Merge/Redirect |
| Services (Portfolio) | 13 | 8 Keep, 5 Redirect |
| Categories | 17 | 3 Keep, 14 Redirect |
| **TOTAL** | **223** | |

---

## 🚨 CRITICAL: URL MAPPING RULES

### Principles Applied:
1. **Default KEEP** untuk semua URL yang terindeks
2. **Redirect ONLY** jika ada alasan SEO yang kuat
3. **MERGE** untuk konten duplikat/similar
4. **DELETE/NOINDEX** hanya untuk thin content / gibberish

### Redirect Types:
- **301** = Permanent redirect (preserve SEO value)
- **302** = Temporary redirect (use sparingly)

---

## SECTION 1: PAGES (19 URLs)

| OLD URL | HTTP Status | SEO Value | Action | NEW URL | Redirect |
|---------|-------------|----------|--------|---------|----------|
| `/` | 200 | ★★★★★ | **KEEP** | `/` | - |
| `/about/` | 200 | ★★★★ | **KEEP** | `/about/` | - |
| `/contact/` | 200 | ★★★★★ | **KEEP** | `/contact/` | - |
| `/our-services/` | 200 | ★★★★ | **KEEP** | `/services/` | - |
| `/services/` (archive) | 200 | ★★★ | **KEEP** | `/services/` | - |
| `/faq/` | 200 | ★★★ | **KEEP** | `/faq/` | - |
| `/team/` | 200 | ★★ | **KEEP** | `/about/#team` | - |
| `/pricing/` | 200 | ★★★ | **KEEP** | `/services/#pricing` | - |
| `/reservasi/` | 200 | ★★★★ | **KEEP** | `/booking/` | 301 |
| `/news-insight/` | 200 | ★★★ | **KEEP** | `/blog/` | 301 |
| `/blog-standard/` | 200 | ★★ | **REDIRECT** | `/blog/` | 301 |
| `/premium-nano-ceramic-coating/` | 200 | ★★★★ | **REDIRECT** | `/services/nano-ceramic-coating/` | 301 |
| `/premium-detailing/` | 200 | ★★★★ | **REDIRECT** | `/services/detailing/` | 301 |
| `/premium-wash/` | 200 | ★★★ | **REDIRECT** | `/services/premium-wash/` | 301 |
| `/360-paint-protection-film-package/` | 200 | ★★★ | **REDIRECT** | `/services/ppf-360/` | 301 |
| `/nano-ceramic-coating/` | 200 | ★★★★ | **REDIRECT** | `/services/nano-ceramic-coating/` | 301 |
| `/premium-coating-lp/` | 200 | ★★ | **DELETE/NOINDEX** | - | - |
| `/terms-conditions/` | 200 | ★★ | **KEEP** | `/terms-conditions/` | - |
| `/privacy-policy/` | 200 | ★★ | **KEEP** | `/privacy-policy/` | - |
| `/cookie-policy/` | 200 | ★★ | **KEEP** | `/cookie-policy/` | - |

### Page Mapping Notes:
- `/our-services/` → `/services/` (cleaner URL structure)
- `/news-insight/` → `/blog/` (standard naming)
- Service pages (Premium Wash, Detailing, Ceramic, PPF) → `/services/[slug]/`
- `/reservasi/` → `/booking/` (English for consistency)

---

## SECTION 2: SERVICES / PORTFOLIO (13 URLs)

| OLD URL | HTTP Status | SEO Value | Action | NEW URL | Redirect |
|---------|-------------|----------|--------|---------|----------|
| `/service/` (archive) | 200 | ★★★ | **KEEP** | `/services/` | - |
| `/service/premium-wash/` | 200 | ★★★ | **KEEP** | `/services/premium-wash/` | - |
| `/service/premium-full-detailing/` | 200 | ★★★★ | **KEEP** | `/services/detailing/` | - |
| `/service/premium-nano-ceramic-coating/` | 200 | ★★★★ | **KEEP** | `/services/nano-ceramic-coating/` | - |
| `/service/premium-360-ppf-package/` | 200 | ★★★ | **KEEP** | `/services/ppf-360/` | - |
| `/service/premium-ppf-package/` | 200 | ★★★ | **KEEP** | `/services/ppf/` | - |
| `/service/daily-ppf-package/` | 200 | ★★ | **KEEP** | `/services/ppf-daily/` | - |
| `/service/light-package/` | 200 | ★★ | **MERGE** | `/services/detailing/#packages` | 301 |
| `/service/bronze-packages/` | 200 | ★★ | **MERGE** | `/services/detailing/#packages` | 301 |
| `/service/silver-package/` | 200 | ★★ | **MERGE** | `/services/detailing/#packages` | 301 |
| `/service/gold-package/` | 200 | ★★ | **MERGE** | `/services/detailing/#packages` | 301 |
| `/service/diamond-package/` | 200 | ★★ | **MERGE** | `/services/detailing/#packages` | 301 |
| `/service/platinum-package/` | 200 | ★★ | **MERGE** | `/services/detailing/#packages` | 301 |

### Service Mapping Notes:
- **Package pages** (Light, Bronze, Silver, Gold, Diamond, Platinum) → **MERGE** into `/services/detailing/`
  - These are pricing tiers, not separate services
  - Redirects go to clean canonical `/services/detailing/` (no #packages fragment)
  - Internal navigation links can point to `#packages` anchor
- **PPF packages** (360, Premium, Daily) → KEEP as separate service pages
- **URL structure**: `/services/[slug]/` (lowercase, hyphenated)

---

## SECTION 3: BLOG POSTS (174 URLs)

### Strategy: PRESERVE ALL INDEXED URLs

**Principle:** 174 blog posts are existing SEO assets. Do NOT auto-change slugs.

#### Action Plan:
1. **Keep ALL existing post URLs** (default)
2. **Audit each for quality** before deciding
3. **Connect to new entity model** via categories/tags
4. **Redirect ONLY if**:
   - Duplicate content detected
   - Gibberish/auto-generated slug
   - Content merged into other posts

### Posts Requiring Special Attention (4 URLs):

| OLD URL | Issue | Action | NEW URL | Reason |
|---------|-------|--------|---------|--------|
| `/autospa-jakarta/` | Very similar to homepage | **KEEP** | `/autospa-jakarta/` | Has specific content |
| `/autospa-jakarta-2/` | Duplicate candidate | **AUDIT** | TBD | Review content overlap |
| `/salon-mobil-2/` | Duplicate candidate | **AUDIT** | TBD | Review content overlap |
| `/autospa-pluit/` (multiple: 2-8) | Location-specific | **KEEP** | `/locations/pluit/[slug]/` | Consider adding location prefix later |

### Blog URL Structure (New):
```
/blog/
/blog/[category-slug]/
/blog/[post-slug]/
```

#### Category Redirects (14 categories):

| OLD CATEGORY URL | Action | NEW URL |
|-----------------|--------|---------|
| `/category/tips-and-insight/` | **KEEP** | `/blog/tips-and-insight/` |
| `/category/auto-detailing/` | **KEEP** | `/blog/detailing/` |
| `/category/coating-mobil/` | **KEEP** | `/blog/ceramic-coating/` |
| `/category/paint-protection-film/` | **KEEP** | `/blog/ppf/` |
| `/category/rust-protection/` | **KEEP** | `/blog/rust-protection/` |
| `/category/engine-detailing/` | **KEEP** | `/blog/engine-detailing/` |
| `/category/interior-detailing/` | **KEEP** | `/blog/interior-detailing/` |
| `/category/eksterior-detailing/` | **KEEP** | `/blog/eksterior-detailing/` |
| `/category/glass-cleanning/` | **KEEP** | `/blog/glass-cleaning/` |
| `/category/car-wash/` | **KEEP** | `/blog/car-wash/` |
| `/category/nano-ceramic-coating/` | **MERGE** | `/blog/ceramic-coating/` |
| `/category/autospa-pluit/` | **KEEP** | `/locations/pluit/blog/` |
| `/category/mudik-lebaran/` | **KEEP** | `/blog/mudik-lebaran/` |
| `/category/bengkel-detailing/` | **MERGE** | `/blog/detailing/` |
| `/category/salon-mobil-jakarta/` | **MERGE** | `/blog/` (tag: jakarta) |
| `/category/experience/` | **KEEP** | `/blog/experience/` |
| `/category/uncategorized/` | **NOINDEX** | - | Will be cleaned up |

### Blog Redirect Summary:
- **3 Keep** (Tips, PPF, Rust)
- **4 Merge** (nano-ceramic → ceramic, bengkel → detailing, salon → blog, glass)
- **10 Keep** (all location-specific categories stay)
- **1 Noindex** (uncategorized)

---

## SECTION 4: SPECIAL PAGES

| OLD URL | HTTP Status | Action | NEW URL |
|---------|-------------|--------|---------|
| `/locations.kml` | 200 | **KEEP** | `/locations.kml` |
| `/sitemap_index.xml` | 200 | **KEEP** | `/sitemap.xml` |
| `/wp-admin/` | 200 | **NOINDEX** | - |
| `/wp-content/` | 200 | **NOINDEX** | - |
| `/wp-includes/` | 200 | **NOINDEX** | - |

---

## SECTION 5: 301 REDIRECT RULES (Next.js next.config.ts)

```typescript
// next.config.ts
const redirects = async () => [
  // Pages
  { source: '/our-services', destination: '/services', permanent: true },
  { source: '/news-insight', destination: '/blog', permanent: true },
  { source: '/blog-standard', destination: '/blog', permanent: true },
  { source: '/reservasi', destination: '/booking', permanent: true },

  // Service pages (root level → /services/)
  { source: '/premium-nano-ceramic-coating', destination: '/services/nano-ceramic-coating', permanent: true },
  { source: '/premium-detailing', destination: '/services/detailing', permanent: true },
  { source: '/premium-wash', destination: '/services/premium-wash', permanent: true },
  { source: '/360-paint-protection-film-package', destination: '/services/ppf-360', permanent: true },
  { source: '/nano-ceramic-coating', destination: '/services/nano-ceramic-coating', permanent: true },
  { source: '/premium-coating-lp', destination: '/', permanent: true },

  // Service packages → Detail page (NO fragment in redirect)
  { source: '/service/light-package', destination: '/services/detailing', permanent: true },
  { source: '/service/bronze-packages', destination: '/services/detailing', permanent: true },
  { source: '/service/silver-package', destination: '/services/detailing', permanent: true },
  { source: '/service/gold-package', destination: '/services/detailing', permanent: true },
  { source: '/service/diamond-package', destination: '/services/detailing', permanent: true },
  { source: '/service/platinum-package', destination: '/services/detailing', permanent: true },

  // Keep all other /service/* that are NOT packages above
  { source: '/service/premium-360-ppf-package', destination: '/services/ppf-360', permanent: true },
  { source: '/service/premium-ppf-package', destination: '/services/ppf', permanent: true },
  { source: '/service/daily-ppf-package', destination: '/services/ppf-daily', permanent: true },
  { source: '/service/premium-wash', destination: '/services/premium-wash', permanent: true },
  { source: '/service/premium-full-detailing', destination: '/services/detailing', permanent: true },
  { source: '/service/premium-nano-ceramic-coating', destination: '/services/nano-ceramic-coating', permanent: true },
  { source: '/service/premium-360-ppf-package', destination: '/services/ppf-360', permanent: true },

  // Categories
  { source: '/category/nano-ceramic-coating', destination: '/blog/ceramic-coating', permanent: true },
  { source: '/category/bengkel-detailing', destination: '/blog/detailing', permanent: true },
  { source: '/category/salon-mobil-jakarta', destination: '/blog', permanent: true },

  // Sitemap
  { source: '/sitemap_index.xml', destination: '/sitemap.xml', permanent: true },
];
```

---

## SECTION 6: URL AUDIT CHECKLIST

### High Priority (Review Before Launch):
- [ ] Verify `/autospa-jakarta/` vs `/` content difference
- [ ] Review all `/autospa-pluit-*` posts for location content
- [ ] Audit 174 posts for thin content / keyword cannibalization
- [ ] Check internal linking structure in posts

### Medium Priority (Phase 1B):
- [ ] Map each blog post to Service entity
- [ ] Map each blog post to Location entity
- [ ] Identify posts needing update/consolidation

### Low Priority (Phase 3):
- [ ] Implement redirects in next.config.ts
- [ ] Test all 301s
- [ ] Monitor 404 logs post-launch

---

## APPENDIX: FULL BLOG URL LIST (174)

<details>
<summary>Click to expand all 174 blog post URLs</summary>

### Auto Detailing Category (9 posts):
- `/auto-detailing-jakarta-untuk-mobil-baru-lindungi-cat-interior-sejak-hari-pertama/`
- `/auto-detailing-jakarta-layanan-profesional-restore-protect-mobil-anda/`
- `/auto-detailing-depok/`
- `/auto-detailing-depok-2/`
- `/auto-detailing-solusi-profesional-bikin-mobil-seperti-baru-lagi/`
- `/auto-detailing-tangerang/`
- `/auto-detailing-2/`
- `/manfaat-auto-detailing/`
- `/auto-detailing-jakarta/`

### Ceramic Coating Category (18+ posts):
- `/apakah-mobil-baru-butuh-coating-di-jakarta/`
- `/coating-mobil-di-jakarta/`
- `/coating-mobil-investasi-atau-pemborosan-ini-jawaban-jujurnya/`
- `/ketahanan-coating-mobil/`
- `/manfaat-nano-ceramic-coating-untuk-perlindungan-cat-mobil-anda/`
- `/coating-mobil-harian-dengan-harga-terjangkau/`
- `/ceramic-coating-terbaik-solusi-menakjubkan-di-jakarta/`
- `/ceramic-coating-terbaik-jakarta/`
- `/ceramic-coating-mobil-terbaik-dan-eksklusif-di-jakarta/`
- `/harga-ceramic-coating-mobil-jakarta/`
- `/nano-ceramic-coating-2/`
- `/nano-ceramic-coating/`
- `/nano-ceramic-coating-pluit/`
- `/the-best-nano-coating-mobil-di-kawasan-pluit/`
- `/coating-rubberized-anti-karat-solusi-terbaik-untuk-mobil-tua/`
- `/premium-nano-coating-perlindungan-cat-mobil-premium-di-jakarta/`
- `/panduan-lengkap-perawatan-dan-coating-mobil-di-autospa-jakarta/`
- `/bengkel-coating-mobil-jakarta/`

### PPF Category (16+ posts):
- `/perbedaan-360-paint-protection-film-vs-coating/`
- `/biaya-pemasangan-paint-protection-film-jakarta/`
- `/apakah-kombinasi-nano-ceramic-coating-dan-ppf/`
- `/apakah-360-paint-protection-film-wajib-untuk/`
- `/perbedaan-ppf-dan-coating/`
- `/ppf-vs-coating-mobil-pilihan-terbaik-wajib-punya-kini/`
- `/manfaat-paint-protection-film/`
- `/tips-merawat-paint-protection-film-mobil/`
- `/film-pelindung-cat-jakarta-wajib-punya-untuk-mobil-terbaik/`
- `/premium-ppf-2/`
- `/premium-ppf/`
- `/premium-ppf-paint-protection-film-mobil-di-jakarta/`
- `/ppf-mobil-premium-jakarta-wajib-punya-untuk-perlindungan-terbaik/`
- `/pasang-ppf-mobil-jakarta-solusi-terbaik-untuk-perlindungan/`
- `/ppf-mobil-jakarta/`
- `/paint-protection-film-solusi-anti-gores-untuk-mobil-anda/`

### Rust Protection Category (15 posts):
- `/cara-ampuh-cegah-karat-mobil-anda/`
- `/autospa-rust-protection-jaga-nilai-jual-mobil-anda/`
- `/perlindungan-kendaraan-dari-karat-yang-efektif/`
- `/kenapa-perlindungan-karat-mobil-penting-di-indonesia/`
- `/autospa-rust-protection-mobil-awet-harga-jual-tinggi/`
- `/autospa-rust-protection-vs-anti-karat-mana-lebih-baik/`
- `/apakah-perlindungan-karat-efektif-setelah-banjir/`
- `/harga-anti-karat-mobil-2026-jabodetabek-wajib-punya/`
- `/perawatan-anti-karat-wajib-punya-nano-coating-terbaik/`
- `/anti-karat-mobil-murah-solusi-terbaik-untuk-perlindungan/`
- `/undercoating-mobil-terdekat-solusi-terbaik-dan-terjangkau/`
- `/paket-anti-karat-mobil-fortuner-terbaik-dan-terjangkau/`

### Location-Specific Posts (Autospa Pluit - 25 posts):
- `/5-alasan-kenapa-autospa-jadi-salon-mobil-terbaik-di-pluit/`
- `/autospa-pluit/`
- `/autospa-pluit-2/`
- `/autospa-pluit-3/`
- `/autospa-pluit-4/`
- `/autospa-pluit-5/`
- `/autospa-pluit-6/`
- `/autospa-pluit-7/`
- `/autospa-pluit-8/`
- `/harga-salon-mobil-pluit/`
- `/rekomendasi-salon-mobil-pluit/`
- `/salon-mobil-terbaik-di-pluit-jakarta-utara/`
- `/harga-salon-mobil-di-kawasan-pluit-jakarta-utara/`
- `/kenapa-mobil-di-area-pluit-lebih-cepat-kusam-berkarat/`
- `/harga-auto-detailing-mobil-di-pluit/`
- `/atasi-mobil-berkarat-di-pantai-autospa-pluit-solusinya/`
- `/nano-ceramic-coating-pluit/`
- `/autospa-pluit-jakarta-utara-mobil-kinclong-tanpa-ribet/`
- `/bengkel-detailing-mobil-pluit/`

### Premium Wash Category (6 posts):
- `/premium-wash-undercarriage-jakarta/`
- `/tips-merawat-mobil-setelah-premium-wash-agar-tetap-kinclong-lebih-lama/`
- `/langkah-langkah-premium-wash-profesional-di-autospa-jakarta/`
- `/manfaat-premium-wash-untuk-mobil-coating-dan-cat-baru-agar-tetap-mengilap-lebih-lama/`
- `/perbedaan-premium-wash-dan-cuci-mobil-biasa-mana-yang-lebih-baik-untuk-mobil-kamu/`
- `/premium-wash-autospa-cara-aman-rawat-mobil-seperti-baru-setiap-hari/`

### Other Categories (91 posts):
- `/car-detailing-jakarta-wajib-punya-untuk-kendaraan-terbaik/`
- `/salon-mobil-profesional-terbaik-dengan-layanan-eksklusif-mudah/`
- `/salon-mobil-premium-jakarta-wajib-punya-untuk-mobil-terbaik/`
- `/salon-mobil-terdekat-eksklusif-dengan-harga-terjangkau/`
- `/salon-mobil-detailing-terjangkau-dan-menakjubkan-di-jakarta/`
- `/cara-memilih-salon-mobil-terbaik-di-jabodetabek/`
- `/salon-mobil-terdekat-di-jakarta/`
- `/salon-mobil-jakarta-selatan-paling-direkomendasikan/`
- `/salon-mobil-bekasi-murah-berkualitas/`
- `/salon-mobil-panggilan-vs-workshop-mana-yang-lebih-aman/`
- `/salon-mobil-2/`
- `/salon-mobil/`
- `/bengkel-detailing-2/`
- `/bengkel-detailing/`
- `/bengkel-detailing-interior-jakarta/`
- `/bengkel-detailing-mobil-baru-jakarta/`
- `/bengkel-detailing-mobil-premium/`
- `/bengkel-detailing-terdekat/`
- `/bengkel-detailing-mobil-yang-bagus-di-jakarta/`
- `/bengkel-detailing-solusi-perawatan-mobil-premium-di-jakarta/`
- `/bengkel-coating-profesional-di-jakarta/`
- `/bengkel-coating-mobil-terdekat-di-jakarta-cara-memilih-yang-tepat/`
- `/bengkel-coating-mobil-jakarta/`
- `/bengkel-coating-mobil-terbaik/`
- `/bengkel-coating-jakarta-solusi-proteksi-cat-mobil-paling-premium/`
- `/harga-paket-auto-detailing-jakarta-yang-worth/`
- `/auto-detailing-jakarta/`
- `/cara-memilih-jasa-auto-detailing-jakarta-yang-terbaik-terpercaya/`
- `/detailing-interior-mobil-terbaik-wajib-punya-untuk-perawatan-eksklusif/`
- `/detailing-interior-terbaik-jakarta/`
- `/detailing-mobil-premium-solusi-terbaik-untuk-mobil-anda/`
- `/detailing-mobil-premium-wajib-punya-untuk-penampilan-terbaik/`
- `/detailing-mobil-murah-wajib-punya-untuk-hasil-terbaik/`
- `/detailing-mobil-mudik/`
- `/detailing-eksterior-mobil-wajib-punya-dengan-hasil-terbaik/`
- `/paket-detailing-mobil-terbaik-solusi-eksklusif-dan-terjangkau/`
- `/perbedaan-bengkel-coating-biasa-vs-bengkel-coating-premium/`
- `/autospa-jakarta-car-wash-premium-spa-mobil-jakarta/`
- `/car-detailing-jakarta/`
- `/cuci-mobil-aman-cat-jakarta-terbaik-dan-terjangkau/`
- `/nano-coating-mobil-jakarta-terbaik-dan-wajib-punya/`
- `/perawatan-mobil-jakarta-wajib-punya-untuk-kendaraan-terbaik/`
- `/tempat-premium-coating-jakarta-rekomendasi-coating-mobil-terbaik/`
- `/perawatan-mobil-setelah-di-coating-tips-agar-kilap-tetap-awet/`
- `/perbedaan-premium-coating-dan-nano-ceramic-coating-jakarta-mana-yang-lebih-baik/`
- `/harga-premium-coating-mobil-di-jakarta-update-paket-kisaran-biaya-2025/`
- `/premium-coating-jakarta-panduan-lengkap-memilih-dan-merawat-coating-mobil-anda/`
- `/premium-ppf-paint-protection-film-mobil-di-jakarta/`
- `/detailing-mobil-rutin-di-jakarta-rahasia-kendaraan-harian-tetap-prima/`
- `/auto-detailing-depok/`
- `/nano-ceramic-coating-bogor-terbaik/`
- `/auto-detailing-bogor/`
- `/cara-mengatasi-headlamp-mobil-buram/`
- `/engine-detailing-mobil-mewah-wajib-punya-untuk-terbaik/`
- `/pembersihan-ruang-mesin-mobil-cara-terbaik-dan-mudah/`
- `/jasa-engine-detailing-terbaik-dan-mudah-untuk-mobil-anda/`
- `/engine-detailing-mobil-wajib-punya-untuk-performa-terbaik/`
- `/apakah-engine-detailing-aman-untuk-mobil-modern/`
- `/jasa-cuci-kaca-mobil-menakjubkan-dan-terjangkau/`
- `/anti-jamur-kaca-mobil-solusi-terbaik-untuk-visibilitas-jelas/`
- `/cara-mengatasi-jamur-kaca-mobil-jakarta/`
- `/cara-menghilangkan-jamur-kaca-mobil-jakarta/`
- `/masalah-bau-tidak-sedap-mobil/`
- `/car-detailing-jakarta-wajib-punya-untuk-kendaraan-terbaik/`
- `/kenapa-mobil-hitam-lebih-cepat-kusam-ini-solusi-detailing-yang-tepat/`
- `/solusi-cat-mobil-kusam-di-jakarta/`
- `/cara-mengatasi-jamur-kaca-mobil-jakarta/`
- `/cara-menghilangkan-noda-tar-mobil/`
- `/cara-mengatasi-emblem-mobil-kusam-di-jakarta/`
- `/kenapa-velg-mobil-cepat-kotor/`
- `/masalah-chrome-mobil-kusam/`
- `/cara-mengatasi-headlamp-mobil-buram/`
- `/cara-menghilangkan-waterspot-kaca-mobil-jakarta-2/`
- `/kenapa-cat-mobil-cepat-kusam-di-jakarta/`
- `/cara-menghilangkan-swirl-mark-cat-mobil-jakarta/`
- `/solusi-mobil-kusam-di-jakarta/`
- `/masalah-perawatan-mobil-setelah-auto-detailing/`
- `/kenapa-mobil-cepat-kusam-setelah-dicuci/`
- `/masalah-cat-mobil-kusam-dan-terlindungi/`
- `/mobil-kusam-dan-banyak-baret-halus/`
- `/masalah-coating-dan-poles-body-mobil-di/`
- `/kesalahan-merawat-nano-ceramic-coating/`
- `/kesalahan-membersihkan-cat-mobil/`
- `/cara-menghilangkan-baret-halus-pada-mobil/`
- `/perbedaan-coating-mobil-wax-sealant/`
- `/perbedaan-eksterior-detailing-dan-cuci-mobil/`
- `/mengapa-hasil-auto-detailing-jauh-lebih-baik/`
- `/berapa-lama-auto-detailing-mobil/`
- `/car-detailing-jakarta-wajib-punya-untuk-kendaraan-terbaik/`
- `/pelindung-cat-mobil-jakarta-terbaik-dan-wajib-punya/`
- `/cara-melindungi-cat-mobil-dari-goresan/`
- `/autospa-jakarta/`
- `/autospa-jakarta-2/`
- `/checklist-mudik-terakhir/`
- `/cara-membersihkan-mesin-setelah-perjalanan-jauh/`
- `/cara-mengembalikan-kilau-mobil-kusam-setelah-mudik/`
- `/cara-membersihkan-mobil-setelah-mudik/`
- `/cara-menghilangkan-bau-karpet-mobil-setelah-perjalanan/`
- `/persiapan-mobil-mudik/`
- `/mudik-lebaran/`

</details>

---

## Document Status

- [x] URL Inventory Complete (223 URLs)
- [x] HTTP Status Verified
- [x] Action Determined per URL
- [x] Redirect Rules Mapped
- [ ] Awaiting Phase 1B Entity Architecture
- [ ] Awaiting implementation in next.config.ts

**Next Action:** Proceed to Phase 1B - Entity Architecture
