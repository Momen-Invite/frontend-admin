# 04 — Loading Skeleton Dashboard Admin

**Tanggal:** 8 September 2026  
**Status:** ✅ Selesai  
**Dikerjakan oleh:** Antigravity AI  
**Terkait:** Integrasi Skeleton Component, Shimmer Animation, & Next.js App Router Loading Boundary

---

## 🎯 Tujuan

Membuat dan mengintegrasikan **Loading Skeleton** untuk admin dashboard, mencakup:
1. Menambahkan keyframe dan animasi `skeleton-shimmer` ke Tailwind CSS dan `globals.css`.
2. Menyediakan komponen referensi `v-skeleton-8.tsx` (Pattern) beserta dependensi utilitinya di `@/components/ui/v-skeleton-8-utils/skeleton`.
3. Membangun **DashboardSkeleton** khusus untuk layout halaman utama Admin Dashboard (Topbar, Metric Cards, Charts/Analytics, dan Tabel Aktivitas).
4. Membangun **KeuanganSkeleton** khusus untuk layout halaman Keuangan (Saldo Aktif, Form Pengajuan Withdrawal, Grafik Kado Mingguan, Tabel Amplop Digital, dan Tabel Riwayat Penarikan).
5. Mengintegrasikan App Router Suspense boundary via `loading.tsx` di Next.js 15 (`/` dan `/keuangan`).
6. Menyediakan halaman pratinjau interaktif di `/skeleton-preview`.

---

## 🛠️ Komponen & Perubahan Yang Dilakukan

### 1. Styling & Animasi (`tailwind.config.ts` & `globals.css`)
- **Keyframe Shimmer:**
  ```ts
  "skeleton-shimmer": {
    "0%": { transform: "translateX(-100%)" },
    "100%": { transform: "translateX(100%)" },
  }
  ```
- **Animation Utility:**
  `skeleton-shimmer 1.6s ease-in-out infinite`
- **Globals CSS Helper:**
  Ditambahkan `.shimmer-wrapper` dan gradien shimmer linear untuk animasi loading dinamis.

---

### 2. Komponen UI (`src/components/ui/`)

| Komponen | File | Deskripsi |
|---|---|---|
| **v-skeleton-8 Pattern** | `src/components/ui/v-skeleton-8.tsx` | Komponen skeleton panel ganda (sidebar mini + grid content + status bar) sesuai contoh referensi yang diberikan. |
| **Skeleton Utility** | `src/components/ui/v-skeleton-8-utils/skeleton.tsx` | Helper re-export dari `@/components/ui/skeleton` agar import seragam dan single-source-of-truth. |
| **DashboardSkeleton** | `src/components/ui/DashboardSkeleton.tsx` | Loading skeleton lengkap untuk halaman Dashboard utama: Topbar, 4 Metric cards, Area chart Recharts placeholder, dan tabel transaksi. |
| **KeuanganSkeleton** | `src/components/ui/KeuanganSkeleton.tsx` | Loading skeleton 12-kolom untuk halaman Keuangan: Balance Card, Withdrawal Form + slider, Weekly Chart bar, dan tabel riwayat amplop/penarikan. |

---

### 3. Next.js App Router Native Loading (`loading.tsx`)

Next.js 15 App Router secara otomatis menampilkan `loading.tsx` saat initial render atau saat transisi navigasi antar rute:
- `src/app/(dashboard)/loading.tsx` ➔ Menampilkan `<DashboardSkeleton />`
- `src/app/(dashboard)/keuangan/loading.tsx` ➔ Menampilkan `<KeuanganSkeleton />`

---

### 4. Pratinjau Interaktif (`/skeleton-preview`)

Halaman pratinjau dibuat di:
`src/app/(dashboard)/skeleton-preview/page.tsx`
Memungkinkan pengecekan visual interaktif dengan tab switcher untuk:
- Tab **Dashboard Skeleton**
- Tab **Keuangan Skeleton**
- Tab **v-skeleton-8 (Pattern)**

---

## 🧪 Hasil Pengujian & Verifikasi

1. **TypeScript Typecheck:**
   ```powershell
   npm run typecheck
   ```
   *Hasil:* **Exit code 0** (tanpa error tipe data atau import).
2. **Design Tokens:**
   Semua warna skeleton menggunakan MD3 surface tokens (`bg-surface-container`, `bg-surface-container-high`, `bg-card`) sehingga konsisten saat dark mode maupun light mode.
