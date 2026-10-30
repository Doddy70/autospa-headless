# Arsitektur Layanan (Services) — Agntix "Projects" → AutoSPA Headless

**Tanggal:** 2026
**Status:** Implementasi
**Lingkup:** Section Portfolio Metro dari template Agntix dipakai ulang sebagai
 arsitektur katalog **Layanan** untuk situs headless AutoSPA.

---

## 1. Ringkasan

Template Agntix memuat blok "Projects" yang paling dekat dengan kebutuhan
AutoSPA: baris foto dan copy yang bergantian, dengan motion scroll (foto masuk
miring lalu lurus, judul ter-reveal per karakter). Di template isinya adalah
*project*; di AutoSPA isinya adalah *layanan*.

| Permukaan | Antes | Sesudah |
|---|---|---|
| Homepage | `MetroProject` + `src/data/metro.ts` (7 baris hardcode) | `ServiceShowcase` + katalog (6 layanan, dari CMS) |
| `/services` | tidak ada | katalog baris + 12 paket |
| `/our-services` | katalog kartu + paket | redirect permanen → `/services` |
| `/services/<slug>` | halaman statis dari `data/services.ts` | halaman detail di arsitektur portfolio detail + katalog |

---

## 2. Lapisan

```
data/services.ts                mirror statis dari halaman produksi
lib/wordpress/repositories/     repository GraphQL (sumber(headless)
        │
        ▼
lib/services/catalog.ts         katalog: WP lebih dulu, mirror sebagai fallback
        │  adapters.ts          pemetaan ke model presentasi
        │  assets.ts            URL media → mirror lokal bila ada
        ▼
components/showcase/            blok Agntix yang dipakai ulang
  ShowcaseHeadline.tsx          judul dua kata + gradient reveal + drift
  ShowcaseRows.tsx              baris foto ↔ copy (isi katalog)
  PackageRows.tsx               paket sebagai baris
  ServiceHero.tsx               header halaman detail
        │
        ▼
app/page.tsx                    homepage (server component)
app/(inner)/services/page.tsx   katalog
app/(inner)/services/[slug]/    detail
```

### Aturan katalog (`lib/services/catalog.ts`)

1. **WordPress menang** untuk setiap field yang dimilikinya.
2. **Mirror statis** mengisi kekosongan (jawaban FAQ, highlight, foto galeri).
3. **Katalog tidak pernah kosong**: ketika GraphQL tidak menjawab, seluruh
   katalog diambil dari mirror.
4. **Satu percobaan per proses**: endpoint yang gagal ditandai di
   `wordPressUnavailable`, jadi halaman tidak menunggu timeout berulang.
5. **Urutan produksi dipertahankan** (nomor "01".."06"), layanan yang hanya
   ada di WordPress ditambahkan di akhir.

> Status saat ini: GraphQL produksi (`autospajakarta.com/graphql`) tidak
> mengekspos query `services`/`serviceBy` maupun tipe `Service` - query itu
> divalidasi terhadap staging, yang `/graphql`-nya tidak terjangkau. Karena
> itu katalog berjalan di jalur mirror sampai CMS-nya siap.

---

## 3. Komponen

| Komponen | Asal Agntix | Perbedaan |
|---|---|---|
| `ShowcaseHeadline` | `portfolio-metro` | judul dua kata, gradient reveal, drift kata pertama; slot `aside` untuk CTA |
| `ShowcaseRows` | `portfolio-metro` | baris foto ↔ copy; sumber = katalog, bukan array hardcode |
| `PackageRows` | `portfolio-metro` | baris dengan isi paket (yang pada template adalah project) |
| `ServiceHero` | `portfolio-details-*` | judul ter-reveal per karakter + foto hero |

Semua animasi:

- `useGSAP` **scoped** ke root component (`{ scope: rootRef }`),
- setiap `SplitText` dicatat dan di-`revert()` saat unmount,
- `matchMedia().revert()` untuk breakpoint,
- dihentikan_total bila `prefers-reduced-motion: reduce`.

 bandingkan dengan template: `hooks/useGsapAnimation.ts` memakai selector
 global, tidak pernah re-`revert()` SplitText, dan mematikan seluruh
 ScrollTrigger saat satu section unmount.

---

## 4. Perubahan yang menyertainya

| Berkas | Perubahan |
|---|---|
| `next.config.ts` | `autospajakarta.com` masuk `remotePatterns` - mirror media tidak mencakup semua file upload |
| `src/app/sitemap.ts` | `/our-services` dihapus, entry layanan diambil dari katalog |
| `src/config/navigation.ts`, `Footer.tsx` | link katalog → `/services` |
| `src/app/(inner)/our-services/page.tsx` | redirect permanen → `/services` |

---

## 5. Catatan operasional

- Halaman katalog, homepage, dan detail layanan memakai `revalidate = 300`,
  jadi katalog mengikuti CMS dalam 5 menit setelah endpoint menjawab.
- `npm run typecheck` dan `npm run build` bersih; `/`, `/services`,
  `/services/<slug>` dan redirect `/our-services` diverifikasi di browser
  (0 console error).
