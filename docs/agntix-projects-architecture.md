# Evaluasi Arsitektur: Component "Projects" pada Template Agntix

**Tanggal:** 2026
**Status:** Evaluasi arsitektur (dokumen referensi)
**Sumber:** `C:\Users\pc\Documents\GitHub\autospa-web-agntix\src`
**Relevansi:** Section **Portfolio Metro** (`/recent-work`) di homepage `autospa`
 — implementasi kita: `src/components/home/sections/MetroProject.tsx`

---

## 1. Ringkasan Eksekutif

Arsitektur component Projects di template Agntix **berlapis dan mudah dibaca** (page →
component → data → style → motion), tapi **lapis motion-nya bocor**: seluruh animasi
dikelola dari satu file hook global yang **menggunakan selector CSS** sebagai kontrak,
bukan identitas component.

| Aspek | Penilaian |
|---|---|
| Struktur folder & layering | ✅ bagus — jelas, mudah dinavigasi |
| Component markup | ✅ bersih, konsisten antar varian |
| Data layer | ⚠️-coupled ke presentasi (`contentClass`, `slice()`) |
| Motion layer | ❌ **fokus masalah utama** — global selector, tanpa cleanup |
| Styling layer | ⚠️ theming by duplication, utilitas global |
| Performa bundling | ⚠️ file data menarik 50+ aset gambar ke graph modul |

**Verdik:** arsitektur template **layak dijadikan referensi visual**, tetapi **tidak
layak ditiru secara struktural**. Port kita di `autospa` sudah mengadopsi yang bagus
dan memperbaiki yang buruk — remainder ada di §6.

---

## 2. Peta Arsitektur

```
src/pages/portfolios/portfolio-metro/PortfolioMetroMain.tsx   ← orkestrator halaman
        │
        ├── components/project/PortfolioMertoProject.tsx       ← markup presentational
        ├── data/projectData.ts                                ← data (50+ proyek)
        ├── hooks/useGsapAnimation.ts                          ← SEMUA motion (1201 baris)
        ├── hooks/useScrollSmooth.ts                           ← ScrollSmoother (global)
        ├── hooks/useCursorAndBackground.ts                    ← kursor kustom (global)
        └── public/assets/scss/**                              ← style global (SCSS)
```

Angka pembanding:

| Metrik | Nilai |
|---|---|
| Halaman varian portfolio | **27** |
| Component varian project | **14** (`src/components/project/*.tsx`) |
| Fungsi animasi diekspor | **36** (`useGsapAnimation.ts`, 1201 baris) |
| Pemakaian `document.querySelectorAll` | **29** |
| Baris `projectData.ts` | **514** (memasukkan 50+ import gambar) |
| Halaman yang memakai `designProjectAnimation` | 2 (`design-agency`, `portfolio-metro`) |

---

## 3. Component Projects secara Detail

### 3.1 Halaman sebagai orkestrator

`PortfolioMetroMain.tsx` merakit halaman dan **memanggil animasi secara manual**:

```tsx
useGSAP(() => {
  const timer = setTimeout(() => {
    textRightScrollAnimation();
    designProjectAnimation();
    revalEffectAnimation();
    scrollMovingText();
    fadeAnimation();
    textInvertAnim2()
  }, 100)          // ← hack timing: tunggu DOM "siap"
  return () => clearTimeout(timer);
});
```

Masalah:
- Animasi **tidak dimiliki component** — lifecycle-nya di page, sementara markup-nya
  di component. Menghapus/menukar `PortfolioMertoProject` tanpa menyentuh page
  menyisakan animasi yatim.
- `setTimeout(100)` adalah tebakan; tidak ada callback "component mounted".
- Semua animasi dijalankan untuk **seluruh dokumen**, bukan untuk section yang di-render.

### 3.2 Component presentational

`PortfolioMertoProject.tsx` (4.5 KB) bersih dan mudah dibaca: heading, social link,
lalu `projectsData.slice(47, 52).map(...)` untuk merender baris foto + copy bergantian.

Yang baik:
- Konvensi penamaan konsisten (`design-project-area`, `design-project-item`,
  `design-project-thumb`, `tp-btn-sky-border`) → mudah di-*extend* dan di-*grep*.
- Varian baris (`item-1` / `item-2`) encodes arah masuk foto, jadi animasi tinggal
  membaca class.

Yang perlu dicatat:
- **Duplikasi lintas varian**: `DesignAgencyProject.tsx` vs `PortfolioMertoProject.tsx`
  ≈ 90% identik — hanya berbeda `slice()` dan isi heading. 14 component project
  berarti ~14 salinan struktur yang sama.
- **Kontrak implisit lewat class**: markupapus selector hook (`design-project-thumb
  item-1`). Mengganti class = animation mati diam-diam, tanpa error TypeScript.

### 3.3 Data layer

```ts
export interface projectsDT {
  id: number; title: string; image: StaticImageData | string;
  categories?: string[]; description?: string; year?: string;
  hasLineBreak?: boolean; layout?: string; contentClass?: string;
  link: string; /* + 8 field opsional lain */
}
```

- **Satu array untuk semua varian**, dipotong dengan indeks magis
  (`slice(47, 52)`, `slice(16, 19)`). Menambah proyek di tengah array diam-diam
  mengubah isi semua halaman.
- **`contentClass: "pl-200"`** — data menentukan presentasi via nama kelas SCSS. Copy-paste
  data ke markup: data tidak lagi murni data.
- **`layout?: string`** — string bebas (`"left"`), bukan union type; typo tidak
  terdeteksi.
- **Aset gambar di-import statis** dari `public/assets/img/...` → 50+ import di satu
  modul. Halaman mana pun yang mengimpor `projectData` menarik seluruh graph aset itu
  (byte gambar sendiri tetap terpisah, tapi metadata & wiring masuk bundle).

### 3.4 Motion layer — titik utama

Semua animasi tinggal di `useGsapAnimation.ts` dan **berbicara ke DOM lewat selector
global**:

```ts
export const designProjectAnimation = () => {
  gsap.matchMedia().add("(min-width: 991px)", () => {
    gsap.set('.design-project-thumb.item-1', { x: 400, rotate: 10 });
    gsap.set('.design-project-thumb.item-2', { x: -400, rotate: -10 });
    document.querySelectorAll('.design-project-item').forEach(item => { ... });
  });
}
```

Temuan:

| # | Temuan | Bukti | Dampak |
|---|---|---|---|
| M1 | Selector global, bukan scoped | `useGsapAnimation.ts:1082-1095` | Animasi bisa mengenai element milik section lain yang kebetulan memakai class sama; tidak bisa dipakai ulang di template yang lebih dari satu instance |
| M2 | **SplitText tidak pernah di-`revert()`** | `useGsapAnimation.ts:47-70`, `209-227` | Wrapper chars/lines menumpuk; layout bisa rusak setelah re-render/route change |
| M3 | Cleanup global, bukan per-component | `useGsapAnimation.ts:687`, `755` → `ScrollTrigger.getAll().forEach(t => t.kill())` | Satu section yang unmount **mematikan trigger section lain** yang masih hidup |
| M4 | Animasi bereaksi pada **class apa pun** di halaman | `revalEffectAnimation()` → `.tp_reveal_anim` | Section `AutoSpaFeaturesSection` di homepage kita juga memakai class serupa → akan ikut ter-split |
| M5 | Contract = string class, tanpa type check | `textInvertAnim2()` → `new SplitText('.tp_text_invert_2')` | Rename class = bug senyap, tidakCompile error |
| M6 | Timing awal done via `setTimeout(100)` | `PortfolioMetroMain.tsx` | Race condition: animasi bisa start sebelum layout selesai |

**Pola positif yang layak diambil:**
- `item-1` / `item-2` sebagai *motion primitive* arah masuk — elegan, murah.
- `matchMedia` untuk breakpoint → animasi desktop saja.
- `data-*` attribute sebagai konfigurasi animasi (`data-delay`, `data-fade-from`,
  `data-on-scroll`) → mudah di-*override* per elemen tanpa menambah class.

### 3.5 Styling layer

- SCSS global di `public/assets/scss/` dengan prefix `tp-`, plus grid mirip Bootstrap
  (`row`, `col-xl-7`, `order-xl-1`) dan container kustom `container-1680`.
- **Theming by duplication**: mode terang ditulis ulang di `_light.scss`
  (mis. `.tp_text_invert_2>div` diduplikasi dengan gradient `#111013 → #e4e4e4`).
  Token warna tidak dipakai → setiap variantsection butuh override manual.
- **Data ↔ style terkunci lewat nama class** (`contentClass: "pl-200"`), sehingga
  styling system tidak punya batas yang jelas.

---

## 4. Ringkasan Trade-off

| Yang diambil dari template | Yang tidak diambil |
|---|---|
| Konvensi visual section + primitive `item-1/item-2` | Arsitektur motion global (`useGsapAnimation.ts`) |
| Struktur markup baris: foto ↔ copy bergantian | `slice()` indeks magis pada data bersama |
| Konfigurasi animasi via `data-*` | `contentClass` (data menentukan class CSS) |
| Gradient reveal + drift headline (`tp_text_invert_2`, `tp-text-right-scroll`) | Import gambar statis di file data |
| Hitung mundur: heading 2 baris + social links + "Know More" | Theming by duplication di `_light.scss` |

---

## 5. Rekomendasi Arsitektur Target (untuk `autospa`)

```
src/data/metro.ts                        ← data murni + union type (sudah)
src/components/home/sections/
  MetroProject.tsx                      ← component + motion, satu file
  MetroProject.module.css               ← style lokal, token warna global
```

Aturan yang dipakai di port kita (dan sebaiknya jadi standar repo):

1. **Motion di dalam component**, bukan hook global.
   `useGSAP(fn, { scope: rootRef })` → semua query scoped ke section.
2. **Semua `SplitText` dicatat dan di-`revert()`** saat unmount.
3. **`matchMedia().revert()`** untuk breakpoint.
4. **Data murni**: union type untuk `layout`, tanpa `contentClass`.
5. **Token warna global**, bukan gradient hardcoded per komponen.
6. Kalau nanti butuh animasi yang sama di banyak tempat → ekstrak ke
   `src/lib/gsap/<primitive>.ts` yang **menerima elemen**, bukan selector global.

---

## 6. Status Port Kita vs Template (MetroProject)

> **Status:** blok Metro sudah dipakai ulang sebagai arsitektur **Layanan**.
> Rinciannya di `docs/service-architecture.md`.

| Item template | Status di `autospa` | Catatan |
|---|---|---|
| Heading 2 baris + gradient reveal | ✅ | `SplitText` + `backgroundPositionX`, sudah di-revert → `ShowcaseHeadline` |
| Drift horizontal kata pertama | ✅ | `tp-text-right-scroll` → `xPercent: 50 → -20` |
| Baris foto/copy bergantian | ✅ | `layout` menentukan sisi, sama seperti template → `ShowcaseRows` |
| Foto masuk miring lalu lurus | ✅ | `item-1`/`item-2` + `scrub: 1` |
| Judul baris reveal per karakter | ✅ | `tp_reveal_anim` → `SplitText chars` |
| Social links (4 platform) | ⚠️ diganti | digantikan CTA katalog (`aside` slot) |
| Tombol outline | ✅ | `tp-btn-sky-border` |
| "Know More" + panah | ⚠️ dibuang | kegunaan portfolio, bukan layanan |
| `contentClass` (padding vary) | ❌ tidak diambil | digantikan padding konsisten |
| Font display `dirtyline` | ❌ tidak diambil | memakai Inter Tight (keputusan brand) |
| **Gradient headline** | ✅ | template: `#e0eeee → #383C3E`; sekarang memakai token `--color-text-invert-from/to` |
| **Breakpoint** | ✅ | template `pl-100` mulai di `xl`; sudah disamakan |
| **Jumlah baris** | ⚠️ deviasi disengaja | template 5 baris; kita 6 layanan AutoSPA |
| **Sistem social links** | ⚠️ deviasi disengaja | template menumpuk vertikal rata kanan; ours chip horizontal |
| **`prefers-reduced-motion`** | ✅ tambahan ours | section dirender tanpa koreografi scroll bila pengguna memintanya |

---

## 7. Rekomendasi Tindak Lanjut

Selesai pada sesi ini:

1. **[P1] ✅ Gradient headline naik ke token** — `--color-text-invert-from/to` di
   `src/styles/variables.css`, dipakai `MetroProject.module.css`.
2. **[P1] ✅ Breakpoint `pl-100` disamakan ke `xl`**, sesuai template.
3. **[P2] ✅ `prefers-reduced-motion`** — section dirender tanpa animasi bila
   pengguna memintanya.

Sisa (tidak blocking):

4. **[P2] Pecah primitive GSAP** — bila `ParallaxShowcase`/`DesignAgencyVideo`
   memakai pola serupa, buat `src/lib/gsap/` (elemen-masuk, split-reveal) agar tidak
   ada duplikasi `useGSAP` per section.
5. **[P3] Class `tp_reveal_anim`** — hasil audit: hanya dipakai di `MetroProject`,
   jadi tidak ada risiko split silang antar section (berbeda dengan template).
