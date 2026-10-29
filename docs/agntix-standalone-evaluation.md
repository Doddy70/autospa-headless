# Evaluasi: Agntix sebagai Build Frontend Standalone

**Tanggal:** 2026
**Status:** Evaluasi (dokumen referensi, belum ada kode yang diubah)
**Lingkup:** Pisahkan template `agntix/` dari build `autospa-frontend` yang sudah ada,
 lalu hubungkannya ke WordPress headless di `backend.autospajakarta.com`.

---

## 1. Ringkasan Eksekutif

Template Agntix **secara teknis sudah mendekati standalone**, tetapi **belum bisa
dibangun/deploy sebagai frontend AutoSPA** karena 4 hal blocking:

| # | Blocking | Status |
|---|----------|--------|
| A | `agntix/` ada di `.gitignore` root → tidak ter-track git, tidak bisa CI/deploy | ⛔ |
| B | Nol integrasi WordPress — seluruh konten masih data demo hardcoded | ⛔ |
| C | `next.config.ts` tidak punya `images.remotePatterns` → `next/image` akan throw saat memuat media WP | ⛔ |
| D | 82 route demo (`/creative-agency`, `/shops/*`, `/portfolio/*`…) → akan ter-index &acie SEO | ⛔ |

Satu好消息: **tidak ada tabrakan build antara keduanya saat ini.** Keduanya sudah punya
`package.json`, `node_modules`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`
masing-masing, dan root `tsconfig.json` sudah mengecualikan folder `agntix`.
Tidak ada satu pun import silang antara `src/` root dan `agntix/src/`.

Artinya: pemisahan build **tidak memerlukan pembongkaran**. Yang diperlukan adalah
(a) Lovelock Git, (b) porting data layer, (c) konfigurasi, (d) pemangkasan route.

---

## 2. Peta Build Saat Ini

### 2.1 Build A — `autospa-frontend` (root, `src/`)

| Aspek | Nilai |
|-------|-------|
| Next.js | 15.5.25 |
| Styling | Tailwind CSS 4.3.3 |
| State | Server Components + minimal client |
| Data | **Sudah terhubung WPGraphQL** via repository pattern |
| Route | 7 route: `/`, `/services`, `/services/[slug]`, `/locations`, `/about`, `/contact`, `+ sitemap` |
| Data layer | `src/lib/wordpress/` = 1.051 baris (client, queries, repositories, types) |
| SEO | `src/lib/seo/`, `src/lib/schema/`, `app/sitemap.ts`, `app/robots.ts` |
| Media | `public/` = 64 MB |

### 2.2 Build B — `agntix/agntix-nextjs`

| Aspek | Nilai |
|-------|-------|
| Next.js | 15.2.0 ( lebih tua dari Build A) |
| Styling | SCSS + Bootstrap 5.3.6 + jQuery 3.7.1 |
| Animasi | GSAP, Swiper 11, Slick, three.js, atropos, isotope, hover-effect |
| Data | **100% hardcoded** di `src/data/`, `src/constants/`, `src/pages/**` |
| Route | **82 `page.tsx`** — seluruhnya demo ThemeForest |
| Fonts | 9 Google Fonts (Inter, Besley, Space Grotesk, Playfair, Satisfy, Teko, Phudu, Poppins, Onest) |
| Ukuran | `src/` 3.8 MB, `public/` 23 MB |
| Git | **Diabaikan root `.gitignore`** (`agntix/`) — `git ls-files agntix` = 0 file |

### 2.3 Perbedaan kunci yang harus diarrhea

| Konsep | Build A | Build B | Dampak |
|--------|---------|---------|--------|
| Path alias | `@/*` → `./src/*` | `@/*` → `./src/*` | Kompatibel |
| Styling | Tailwind utility class | SCSS class + Bootstrap | **Token desain tidak bisa dibagi** — harus hardcode ulang |
| Font | Inter saja | 9 font | Perfgoodian perlu di-restrain |
| Image | `next/image` + remotePatterns | `<img>` / Swiper native | Perlu audit asset |
| Data | Server-side fetch ke WP | Import JSON statis | **Ini gap terbesar** |

---

## 3. Isu Teknis Teridentifikasi

### 3.1 Git — `agntix/` tidak pernah masuk repo

```
# .gitignore (root)
agntix/
```

Konsekuensi:
- Tidak ada CI/CD untuk Build B.
- Tidak ada review, tidak ada branch, tidak ada riwayat versi.
- Build B akan hilang kalau folder itu dihapus atau PCformat.
- `themeforest-agntix-...zip` (19.3 MB) ada di root tapi `.gitignore` juga tidak meng-exclude-nya
  (jadi **file lisensi ThemeForest ikut ter-commit** — perlu ditinjau).

### 3.2 `postcss.config.mjs` — sudah ditangani, tapi rapuh

Agntix punya file ini sendiri dengan komentar yang tepat:

> *"This local file is required so Next.js does not walk up the directory tree and pick up the parent project's Tailwind PostCSS config, which would break the build."*

Artinya pemisahan sudah **sengaja direkayasa** oleh whoever menyiapkan folder ini.
Tetap perlu dipertahankan kalau repositori dipisah.

### 3.3 `next.config.ts` Agntix — hanya 1 alias webpack

```ts
webpack: (config) => {
  config.resolve.alias = { ...config.resolve.alias,
    three: path.resolve(__dirname, "node_modules/three") };
  return config;
}
```

Yang **tidak ada** (sudah ada di Build A):
- `images.remotePatterns` → **wajib** untuk `backend.autospajakarta.com/wp-content/uploads/**`
- `images.formats` (avif/webp)
- `async redirects()` (mis. `/service/:slug` → `/services/:slug`)
- `async headers()` (security + cache)
- `experimental.optimizePackageImports`
- `poweredByHeader: false`

### 3.4 Environment — tidak ada sama sekali

Agntix tidak punya `.env.example` / `.env.local`. Yang dibutuhkan:

```bash
WORDPRESS_GRAPHQL_URL=https://backend.autospajakarta.com/graphql
NEXT_PUBLIC_SITE_URL=https://autospajakarta.com
WORDPRESS_REVALIDATE_SECONDS=300
```

### 3.5 Route demo yang tidak boleh lolos ke produksi

82 `page.tsx` dengan pola:
```
/creative-agency  /corporate-agency  /design-studio  /crypto-currency  ...
/portfolio-*  (30+ varian)  /shop*  /cart  /checkout  /wishlist
/blog-*  (9 varian)  /team*  /login  /register  /pricing  /faq
```

Kalau dibuild apa adanya, ini akan:
- Ter-index Google dan melawan domain utama.
- Mengambil resource (fetch WP) untuk halaman yang tidak pernah dilihat.
- Memperbesar `sitemap.xml` jadi tidak berguna.
- Membingungkan analytics.

Harus dipangkas ke route AutoSPA saja.

### 3.6 Root `tsconfig.json` sudah exclude `agntix`

```json
"exclude": ["node_modules", "time-tracking", "creative-portfolio",
             "html_framer", "_reference", "agntix"]
```

Sudah benar. Tidak perlu diubah kalau dipisah ke repo sendiri.

### 3.7 Dependency drift

| Paket | Build A | Build B | Catatan |
|-------|---------|---------|---------|
| next | 15.5.25 | 15.2.0 | Upgrade ke 15.5.25 saat migrasi |
| react | 19.2.8 (pin) | ^19.0.0 | Selaraskan |
| tailwind | 4.3.3 | — | Build B pakai SCSS |
| typescript | 5.9.3 | ^5 | Selaraskan |
| sharp | — | ^0.33.5 | **Wajib** untuk `next/image` produksi |

---

## 4. Opsi Arsitektur

### Opsi 1 — Repositori terpisah ⭐ REKOMENDASI

```
autospa/                    → autospa-frontend  (build lama, existing)
autospa-web-agntix/         → build baru (standalone)
```

**Pro:**
- Isolasi total: `package.json`, `node_modules`, CI, deploy, domain sendiri.
- Nol risiko regresi ke build existing — satisfying aturan "Production is READ ONLY".
- Agntix bisa naik versi Next/React tanpa menyentuh frontend yang sudah jalan.
- Bisa di-deploy ke sub-domain preview (`preview.autospajakarta.com`) untuk A/B sebelum cutover.

**Kontra:**
- Dua repo = dua pipeline CI, dua environment variable, dua proses deploy.
- Kode shared (repository pattern, schema, SEO) harus disalin/di-sync manual.

### Opsi 2 — Monorepo (`npm workspaces`)

```
autospa/
  apps/
    frontend-existing/   → src/ yang sekarang
    frontend-agntix/     → agntix/
  packages/
    wordpress-core/      → client, queries, types, repositories (shared)
```

**Pro:**
- Data layer dipakai dua build — tidak ada duplikasi.
- Satu `npm install` di root.
- `@autospa/wordpress` jadi package kedua.

**Kontra:**
- Refactor menyentuh build existing yang sudah production-ish (risiko).
- `tailwindcss` vs `scss` di dua app dalam satu root → wajib careful dengan PostCSS & `tsconfig` include (biayasetup tinggi, tapi solvable).
- `node_modules` root besar; tooling (`next lint`, Playwright) perlu dispace.

### Opsi 3 — Agntix tetap sebagai sandbox design, di-backport ke `src/`

Agntix tetap di-gitignore. Komponen yang dipakai yang dipindah ke `src/components/`.
Data layer tetap milik root.

**Pro:** NolDuplikasi, deploy tetap satu.
**Kontra:** **Bukan** "build terpisah" — gagal memenuhi permintaan eksplisit.

---

## 5. Rekomendasi

**Opsi 1**, dengan **fase awalagntix = preview/staging**, sementara Build A tetap melayani produksi.

Alasan: permintaan eksplisit Anda adalah build terpisah; Opsi 1 memenuhi itu dengan
risiko terendah terhadap frontend yang sudah berjalan, dan memberi jalur migrasi
(Agntix → preview → cutover produksi) tanpa memindahkan goalpost.

---

## 6. Rencana Migrasi (6 Fase)

### Fase A — Ekstraksi & Lock (estimasi 0.5 hari)
- [ ] `git init` repo baru `autospa-web-agntix`, pindahkan isi `agntix/agntix-nextjs/` ke root repo.
- [ ] Naikkan Next 15.2.0 → 15.5.25, React → 19.2.8, TS → 5.9.3.
- [ ] Pastikan `sharp` terpasang (untuk `next/image`).
- [ ] `.env.example` dibuat (3 var di atas).
- [ ] `npm run build` hijau sebagai baseline.

### Fase B — Data Layer WordPress (estimasi 2–3 hari) ⭐ Effort Terbesar
Port dari `autospa/src/lib/wordpress/` ke repo baru, **tanpa mengubah semantik**:
- [ ] `lib/wordpress/client.ts` — transport + handling `unavailable` paths (140 baris, copy persis).
- [ ] `lib/wordpress/types/{service,location}.ts`
- [ ] `lib/wordpress/queries/{services,locations}.ts`
- [ ] `lib/wordpress/repositories/{services,locations}.ts`
- [ ] **Tambahan**: entity baru yang belum ada di Build A → `project`, `faq`, `testimonial`, `post`.
- [ ] Tambah `blog`/`post` CPT bila ada di backend (belum terpetakan di Phase 2D.8).
- [ ] Struktur `lib/wordpress/choices.ts` & `normalize.ts` ikut.

> **Penting:** arsitektur `queries → repositories → components` harus dijaga.
> Komponen UI **dilarang** memanggil GraphQL langsung (Phase 1C RULE 7).

### Fase C — Konfigurasi & Aset (estimasi 1 hari)
- [ ] `next.config.ts`: `images.remotePatterns` untuk `backend.autospajakarta.com`,
      `formats: ['image/avif','image/webp']`, `deviceSizes`/`imageSizes`.
- [ ] `redirects()`: `/service/:slug` → `/services/:slug`, `/service` → `/services`.
- [ ] `headers()`: security headers + cache immutable untuk `/assets/:path*`.
- [ ] Audit `public/` (23 MB) — pangkas aset demo yang tidak dipakai.
- [ ] Header `<link rel="preconnect">` ke host WordPress di root layout.

### Fase D — Pangkas & Rebrand Route (estimasi 1.5 hari)
- [ ] Hapus route demo; sisakan hanya yang dibutuhkan AutoSPA.
- [ ] Route final yang/usulan:

| Route | Sumber Data |
|-------|-------------|
| `/` | Halaman depan — hero, services showcase, locations, testimonials |
| `/services` | `services(first:)` |
| `/services/[slug]` | `serviceBy(slug:)` |
| `/locations` | `locations(first:)` |
| `/locations/[slug]` | `locationBy(slug:)` |
| `/projects` | `projects(first:)` |
| `/projects/[slug]` | `projectBy(slug:)` |
| `/faq` | `fAQs(first:)` |
| `/about` | Statis / CMS |
| `/contact` | Statis + form |

- [ ] Ganti branding: logo, nama, warna, kontak, alamat, domain.
- [ ] Limitis font — pilih 2–3 dari 9 (perf Core Web Vitals).
- [ ] Ganti `<Image>` src `<img>` native untuk aset WP (atau biarkan native bila Swiper butuh).

### Fase E — SEO & Metadata (estimasi 1 hari)
- [ ] `app/sitemap.ts` — port dari Build A, sesuaikan dengan route final.
- [ ] `app/robots.ts`.
- [ ] `lib/seo/metadata.ts` — helper metadata per entitas.
- [ ] `lib/schema/` — JSON-LD `AutoRepairShop`, `Service`, `LocalBusiness`, `FAQPage`, `BreadcrumbList`.
- [ ] `generateStaticParams` + `revalidate` per route agar ISR bekerja.

### Fase F — Deploy Paralel & Cutover (estimasi 1 hari)
- [ ] Deploy Build B ke preview (mis. `preview.autospajakarta.com`).
- [ ] Smoke test GraphQL live dari environment preview.
- [ ] QA: semua route, 404, redirect, gambar, mobile, sitemap.
- [ ] (Nanti) Cutover: `autospajakarta.com` → Build B; Build A jadi arsip.

---

## 7. Estimasi Effort

| Fase | Durasi | Risiko |
|------|--------|--------|
| A. Ekstraksi & Lock | 0.5 hari | Rendah |
| B. Data Layer | 2–3 hari | **Sedang** — butuh familiarity dengan schema WPGraphQL + ACF nested |
| C. Konfigurasi & Aset | 1 hari | Rendah |
| D. Route & Rebrand | 1.5 hari | Sedang — 82 route, banyak unused import |
| E. SEO | 1 hari | Rendah — sudah ada di Build A, tinggal port |
| F. Deploy & Cutover | 1 hari | **Tinggi** —涉及 domain & indexing |
| **Total** | **~7–8 hari kerja** | |

### Risiko Utama

| Risiko | Mitigasi |
|--------|----------|
| Lighthouse turun drastis karena Bootstrap+jQuery+3 slider+three.js | Audit per halaman; buang `three.js` & demo portfolio; lazy-load Swiper |
| Render blocking SCSS | `@forward` → ubah ke `@use` + purge; optimasi critical CSS |
| Duplikasi data layer ke两份 | Jadwalkan monthly sync, atau pivot ke Opsi 2 bila drag terlalu berat |
| Salah pilih satu dari dua frontend untuk production | Cutover dijadwal eksplisit + smoke test sebelum DNS switch |
| Ekspos data demo ke publik | Route demo dihapus di Fase D, diverifikasi lewat `sitemap` + crawl check |

---

## 8. Perbandingan dengan Build A (yang existing)

Tidak ada alasan teknis untuk **membuang** Build A. Build A:
- Sudah punya integrasi WPGraphQL lengkap (1.051 baris, repository pattern).
- Sudah punya SEO + sitemap + robots + JSON-LD.
- Sudah Tailwind (CSS lebih kecil, build lebih cepat).
- Sudah 7 route inti yang berfungsi.

**Build B menang** pada: desain visual premium, animasi GSAP, komposisi section yang matang,
dan karena ini "tampilan yang/nginx benar-benar" — yang-di-buy user ThemeForest.

Kesimpulan: **Build B = shell visual, Build A = data layer & SEO.**
Rekomendasi_srategis: **port data layer & SEO dari Build A ke Build B** (Fase B + E),
lalu Build A menjadi legacy yang bisa diarsipkan setelah cutover berhasil.

---

## 9. Keputusan yang Dibutuhkan

Sebelum eksekusi perlu ditetapkan:

1. **Struktur repo** — Opsi 1 (repo terpisah) atau Opsi 2 (monorepo)?
2. **Hostname preview** — subdomain apa untuk Build B sebelum cutover?
3. **Entity cakupan Fase B** — apakah `project`, `faq`, `testimonial` masuk ronde ini,
   atau cukup `service` + `location` dulu?
4. **Nasib 82 route demo** — hapus total, atau sisakan `/creative-agency` sebagai
   alias ke homepage?
5. **Deployment target** — Vercel, Docker + Nginx, atauaa existing infra server
   `148.230.101.241`?
