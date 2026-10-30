# Agent Onboarding — AutoSP AJakarta (headless frontend)

Handoff untuk agent baru yang接手 repo `autospa`. Tulis untuk dibaca sekali
di awal, lalu pakai `CLAUDE.md` sebagai rujukan singkat.

> Bahasa dokumen ini campur Indonesia/English, mengikuti gaya repo.

---

## 1. Project state

**AutoSP AJakarta** = frontend headless Next.js di atas WordPress (CMS masih
WordPress, presentation dipindah ke React). Repo ini adalah **frontend saja**;
tidak ada deploy ke server, tidak ada perubahan ke WordPress.

| Fase | Status | Isi |
|------|--------|-----|
| 2D.1–2D.8 | ✅ | Staging, ACF 24 field group, 5 CPT, 17 kategori, GraphQL terverifikasi (20/20 tes) |
| 2E | ✅ | 16 halaman statis dimirror, article API (204 post), 243 URL sitemap, `npm run sync:*` |
| 2F (section home) | ✅ (baru) | 5 section Agntix di-port + header global (lihat §4) |

Production **read-only**. Semua query ke WP hanya `GET`; tidak pernah mutasi.

Branch aktif: `feat/phase-2e-native-pages` (belum ada commit untuk pekerjaan
terbaru — lihat §6).

## 2. Stack & struktur

Next.js 15.5 (App Router) · React 19 · TypeScript strict · Tailwind v4
(`@tailwindcss/postcss`, token di `src/styles/variables.css` via `@theme`) ·
`motion` (framer-motion v13) · `gsap` + `@gsap/react` + ScrollTrigger ·
`lucide-react` · Playwright.

```
src/
  app/                 route groups: (inner)/* = halaman non-home, api/* = proxy REST
  components/
    layout/            Header, MobileMenuPanel, SearchOverlay  (baru)
    home/              Hero, CTA, sections/*  (section homepage)
    content/ ui/ shared/ contact/ motion/ seo/
  config/              site.ts (SITE, CTA, routes), navigation.ts (menu)
  data/                services.ts, packages.ts, contact.ts, awards.ts*, funfact.ts*, homework.ts*
  lib/wordpress/       client, rest, repositories/, queries/, types/  ← satu-satunya tempat GraphQL
  hooks/ styles/ icons/ interface/ context/ utils/
docs/                  phase-2e-*, agntix-standalone-evaluation, security-elementor-pro-*
scripts/sync/          fetch, assets, fonts, build-manifest, verify, compare, check-inner-nav
```

Aturan struktur: **komponen → repository → GraphQL** (tidak pernah fetch langsung
di komponen). Penamaan field CMS `snake_case`.

## 3. Design system

Token唯一的 sumber: `src/styles/variables.css` (`@theme`).
`bg-background-8` (hitam), `text-primary-500` (#27A8DF, brand),
`text-ns-green`/`ns-yellow`/`ns-cyan`, `font-inter-tight`, `main-container`
(max-w-[1290px]), utility `pt-header` (72px).

Dark theme default (`<html class="dark">`). Eyebrow = uppercase kecil +
tracking lebar; headline = bold besar; copy body `text-white/60`.

**Tidak ada Bootstrap/SCSS Agntix.** Kalau mem-port komponen dari template
`autospa-web-agntix`, tulis ulang jadi Tailwind utility. Aset juga: pakai
yang sudah ada di `public/` — jangan copy aset template (gambar award badge,
dsb. diganti dengan CSS/SVG).

## 4. Pekerjaan sesi terakhir (sudah done, tinggal-ASLI)

**Header global** (port dari `autospa-web-agntix/src/layouts/headers/CorporateAgencyHeader.tsx`):
`src/components/layout/Header.tsx` (fixed, transparan → solid+blur saat scroll
via `useNavbarScroll(20)`), `MobileMenuPanel.tsx` (off-canvas kanan),
`SearchOverlay.tsx` (→ `/blog?search=…`), data menu di `src/config/navigation.ts`.
Mount di `src/app/layout.tsx`; `(inner)/layout.tsx` cuma reserve `pt-header`.
Navbar lama (`src/components/home/hero/Navbar.tsx`) dihapus.

**Section home baru** (`src/components/home/sections/`):
`WorkSection` (sticky代替 pin GSAP), `FunFactSection` (3 panel sticky 100svh;
angka 10/6/4 ditelusuri ke `BRANCHES`/`SERVICES`), `ProjectSection` (6 kartu
dari `SERVICES`), `AwardSection`, `DesignAgencyVideo` (menggantikan
`PalletRossCards` yang sudah dihapus).

**Animasi GSAP "expand video on scroll"** — port persis dari template
`src/hooks/useGsapAnimation.ts` → `videoAnimation()`:
ScrollTrigger `{ pin: true, scrub: 1, start: 'top 40px', end: '+=100%' }`,
`.to(wrap, { scale: 3.2, ease: 'none' })`, `transform-origin: top center`,
hanya ≥1199px.

**Aset video/gambar**:
hero = `public/videos/Desain tanpa judul.mp4`; band = `public/videos/hero_video.mp4`;
still band = `public/images/banner{1,2,3,4,5,7} Autospa.jpg`.

Section "REFINE & PROTECT / YOUR VEHICLE" juga sudah dihapus dari `src/app/page.tsx`.

## 5. Gotcha teknis (penting)

1. **Wrapper homepage wajib `overflowX: 'clip'`** — `hidden` membuat scroll
   container dan mematikan pin ScrollTrigger.
2. **Path ber-spasi harus di-encode**: `banner1%20Autospa.jpg`.
3. **Dev server port 3100 sering tertinggal** dari sesi lama → hasil uji
   stale. `taskkill //PID <pid> //F` dulu, lalu `npm run dev`.
4. `npx tsc --noEmit` kadang melaporkan `.next/types/app/zz-video-preview/page.ts`
   yang hilang — re-run atau `rm -rf .next/types`.
5. `check:nav` (`scripts/sync/check-inner-nav.mjs`) mewajibkan: tepat satu
   `<header>` berisi `<nav>`, tepat satu link "Booking Now", `data-testid="mobile-menu-toggle"` dan `data-testid="mobile-menu"`, tidak ada horizontal overflow di 390px, `h1` tidak tertutup header. Jalankan dengan `MSYS_NO_PATHCONV=1` (Git Bash mengutak path `/about`).
6. Screenshot PNG tidak bisa dibaca di sesi ini (Read mengembalikan URL) —
   verifikasi visual lewat pengukuran DOM (getBoundingClientRect / computed style).
7. Paralelisasi agent: satu agent = satu file, brief harus menyebut file
   output dan aturan "jangan sentuh file lain" (nama file bisa ditulis ulang
   agent lain → cek `git status` setelahnya).

## 6. Next steps (urutan prioritas)

1. `src/data/awards.ts` masih **placeholder** → ganti dengan award/sertifikasi
   AutoSPA yang terverifikasi sebelum launch.
2. `npm run build` ulang (build terakhir sebelum penghapusan section REFINE &
   pergantian gambar banner).
3. Commit — belum ada commit untuk semua pekerjaan sesi ini. `git status`
   akan menunjukkan banyak `M`/`??`.
4. Optional: `public/videos/buat_section_videol.mp4` kini tidak terpakai —
   hapus atau pakai sebagai poster/band kedua.

## 7. Command

```bash
npm run dev            # http://localhost:3100
npm run typecheck      # tsc --noEmit
npm run build          # production build
npm run sync:content   # re-mirror pages/media/fonts/manifest (read-only)
npm run sync:verify    # semua aset terreferensi ada di public/
npm run sync:compare   # render vs sumber mirror
node scripts/sync/check-inner-nav.mjs /faq /contact   # cek navigasi
node scripts/perf/probe.mjs http://localhost:3200 /    # ukur FCP/LCP/CLS
node scripts/perf/faststart.mjs <video.mp4>           # remux mp4 faststart
```

Env: `WORDPRESS_GRAPHQL_URL`, `WORDPRESS_REST_URL`, `WORDPRESS_SITE_URL`,
`NEXT_PUBLIC_SITE_URL`, `WORDPRESS_REVALIDATE_SECONDS` (lihat `.env.example`).

## 8. Performa (hasil sesi 2026-10-29)

Diukur di **build produksi** (`next build` + `next start`), throttled 4G
(1.6 Mbps) + CPU 4×, viewport 1440×900. Angka ini yang dipakai, bukan
 Lighthouse: `scripts/perf/probe.mjs`.

| Metrik | Sebelum | Sesudah |
|--------|---------|---------|
| FCP | 2888 ms | 1220 ms |
| LCP | 5664 ms | 4700 ms (masih `<video>` hero) |
| CLS | 0 | 0 |
| Long tasks | 3531 ms | 2152 ms |
| Transfer | 766 kB | 583 kB |

Yang sudah diterapkan:

- `scripts/perf/faststart.mjs` — remux MP4 supaya `moov` ada di depan.
  Tanpa ini browser harus unduh seluruh file sebelum play; itu yang bikin
  video hero jadi LCP paling lambat. `public/videos/Desain tanpa judul.mp4`
  dan `hero_video.mp4` sudah di-remux. **Backup file asli:**
  `C:/Users/pc/AppData/Local/Temp/autospa-video-backups`.
- Hero headline pakai keyframes CSS (`src/styles/hero.css`), bukan
  framer-motion: elemen ber-opacity 0 tidak eligible jadi LCP.
- `prefetch={false}` pada link nav/menu mobile/CTA hero (prefetch RSC
  `/about` + `/our-services` ≈ 200 kB dan bersaing dengan resource kritis).
- GSAP + ScrollTrigger dimuat dinamis setelah idle (band video).
- `content-visibility: auto` via utility `render-lazy` untuk section bawah fold.
- Poster band digenerate dari frame video (`public/assets/gallery/band-poster.jpg`).

Sisa opportunity (kerjakan di server production / tooling lengkap):

- Re-encode `Desain tanpa judul.mp4` (1 MB) ke CRF 30 ± faststart → ±350 kB;
  ini yang menahan LCP di ~4.7 s karena frame pertama baru tampil setelah
  chunk pertama (~500 kB) terunduh. Butuh `ffmpeg` (tidak ada di mesin ini).
- Re-encode `hero_video.mp4` (4 MB) untuk band video.
- Audit ukuran CSS (110 kB) dan hydration 673 node.

