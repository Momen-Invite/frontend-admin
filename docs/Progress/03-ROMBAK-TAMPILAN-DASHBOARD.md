# 03 — Rombak Tampilan Dashboard (Referensi Stitch)

**Tanggal:** 8 September 2026  
**Status:** ✅ Selesai  
**Dikerjakan oleh:** Antigravity AI  
**Referensi:** `docs/Stitch/UI dashboard Admin/stitch_moment_invite/stitch_moment_invite/keuangan_dashboard_desktop/`

---

## 🎯 Tujuan

Merombak seluruh tampilan dashboard admin agar menggunakan **design system Material Design 3** sesuai referensi Stitch, memisahkan komponen agar reusable, memperbarui `tailwind.config.ts` dengan token warna & tipografi lengkap, dan membuat halaman `/keuangan` yang identik dengan referensi desain.

---

## ✅ Yang Sudah Dikerjakan

### Phase 1: Design System

#### `tailwind.config.ts` — Diperbarui Total
- ✅ Ditambahkan **40+ Material Design 3 color tokens**: `primary`, `secondary`, `tertiary`, `surface`, `on-surface`, `outline`, dll.
- ✅ Ditambahkan **custom font scale**: `display`, `headline-lg`, `headline-md`, `body-lg`, `body-sm`, `button-text`, `label-capsule`, `data-numeric`
- ✅ Ditambahkan **custom spacing**: `xs (4px)`, `sm (8px)`, `md (16px)`, `lg (24px)`, `xl (40px)`, `sidebar-width (96px)`
- ✅ Ditambahkan **custom box shadows**: `card`, `overlay`
- ✅ Ditambahkan animasi baru: `slide-in-right`, `fade-up`
- ✅ Dipertahankan shadcn/ui compat tokens dan keyframes yang sudah ada

#### `globals.css` — Dirombak Total
- ✅ CSS variables dilaraskan dengan MD3 color tokens (warm amber/brown primary)
- ✅ Ditambahkan Material Symbols CSS class (`.material-symbols-outlined`, `.filled`)
- ✅ Ditambahkan slider styles untuk DragToConfirm component
- ✅ Ditambahkan custom scrollbar styling

---

### Phase 2: Layout Components

#### `Sidebar.tsx` — Dirombak Total
- ✅ Ubah dari sidebar lebar (w-64) → **icon-only sidebar** (96px wide)
- ✅ Fixed position, rounded-xl, floating dengan shadow
- ✅ Logo "MI" kotak hitam di atas
- ✅ Nav icons menggunakan **Material Symbols Outlined**
- ✅ Active state: `bg-primary-container` rounded-full dengan scale-95
- ✅ Hover state: scale-105 + text-primary transition
- ✅ Settings icon di-anchor ke bawah

#### `Topbar.tsx` — Komponen Baru
- ✅ Menggantikan Header lama sebagai per-page header
- ✅ Page title (h1) di kiri
- ✅ Search pill rounded-full di kanan
- ✅ Notification button rounded-full dengan badge merah
- ✅ User chip rounded-full dengan avatar + nama + role
- ✅ Props: `title`, `searchPlaceholder`

#### `Header.tsx` — Backward Compat Alias
- ✅ Diubah menjadi re-export dari Topbar untuk kompatibilitas

#### `(dashboard)/layout.tsx` — Diperbarui
- ✅ Hapus Header dari layout (pindah ke masing-masing page)
- ✅ `margin-left` disesuaikan untuk icon-only sidebar: `calc(96px + 48px)`
- ✅ Background menggunakan `bg-surface-container-low`

#### `PageHeader.tsx` — Deprecated
- ⚠️ Tidak dihapus secara fisik (menunggu tidak ada referensi lagi), fungsinya digantikan Topbar

---

### Phase 3: Shared UI Components (Baru)

#### `src/components/ui/StatusBadge.tsx`
- ✅ 6 variant: `sukses`, `disetujui`, `pending`, `proses`, `ditolak`, `gagal`
- ✅ Menggunakan MD3 tokens: `tertiary-fixed` (hijau/biru), `secondary-fixed` (kuning), `error-container` (merah)
- ✅ Helper function `mapToStatusVariant()` untuk mapping dari API string

#### `src/components/ui/DragToConfirm.tsx`
- ✅ Slider interaktif React dengan support **mouse & touch** (desktop + mobile)
- ✅ Progress fill animation dengan warna amber → hijau saat konfirmasi
- ✅ Snap-back otomatis jika tidak ditarik penuh
- ✅ `onConfirm` callback, `disabled` state, `successLabel` customizable

---

### Phase 4: Finance Components (Baru)

| Komponen | Path | Deskripsi |
|----------|------|-----------|
| `BalanceCard` | `src/components/finance/BalanceCard.tsx` | Card saldo amplop digital dengan display amount besar + tombol Tarik Dana |
| `WithdrawalForm` | `src/components/finance/WithdrawalForm.tsx` | Form withdrawal: input jumlah, dropdown bank, nomor rekening + DragToConfirm |
| `WeeklyGiftChart` | `src/components/finance/WeeklyGiftChart.tsx` | Bar chart mingguan div-based (bukan library), tooltip di bar aktif |
| `GiftHistoryTable` | `src/components/finance/GiftHistoryTable.tsx` | Tabel riwayat amplop: avatar inisial, pesan, metode badge, jumlah, status |
| `WithdrawalHistoryTable` | `src/components/finance/WithdrawalHistoryTable.tsx` | Tabel riwayat penarikan: tanggal, bank, masked account, jumlah, status |

---

### Phase 5: Pages

#### `src/app/(dashboard)/keuangan/page.tsx` — **BARU**
- ✅ Layout 12-kolom (lg): left 4 col + right 8 col
- ✅ Left: BalanceCard + WithdrawalForm + WeeklyGiftChart
- ✅ Right: GiftHistoryTable + WithdrawalHistoryTable
- ✅ Identik dengan referensi Stitch `keuangan_dashboard_desktop`

#### `src/app/(dashboard)/page.tsx` — Diperbarui
- ✅ Metric cards menggunakan MD3 color tokens (amber, tertiary-fixed, dll.)
- ✅ Recharts area chart dengan warna brand (amber + biru)
- ✅ Withdrawal queue dengan StatusBadge + MD3 surface colors
- ✅ Menggunakan Topbar menggantikan PageHeader

#### `src/app/(dashboard)/withdrawals/page.tsx` — Diperbarui
- ✅ PageHeader → Topbar

#### `src/app/(dashboard)/orders/page.tsx` — Diperbarui
- ✅ PageHeader → Topbar

---

### Phase 6: Root Layout

#### `src/app/layout.tsx` — Diperbarui
- ✅ Tambah `<link>` Google Material Symbols Outlined di `<head>`
- ✅ Inter font tetap via `next/font/google`
- ✅ Body class menggunakan `bg-surface-container-low`

---

## 📐 Keputusan Desain

| Keputusan | Alasan |
|-----------|--------|
| **Icon-only sidebar** | Persis seperti referensi Stitch — menghemat ruang horizontal, tampilan lebih premium |
| **Material Symbols bukan Lucide** | Referensi Stitch menggunakan Material Symbols; konsisten dengan design system MD3 |
| **Topbar per-page (bukan global)** | Setiap halaman punya title sendiri (h1) sesuai best practice aksesibilitas & SEO |
| **Div-based bar chart** | WeeklyGiftChart tidak pakai Recharts agar 1:1 sama referensi dan lebih ringan |
| **DragToConfirm slider** | UX pattern untuk aksi berisiko tinggi (penarikan dana) — mencegah accidental submit |
| **Finance folder terpisah** | Komponen domain-specific dipisah dari UI generic untuk maintainability |

---

## 🗂️ Struktur Komponen Akhir

```
src/
├── app/
│   ├── layout.tsx                    ✅ Material Symbols link
│   └── (dashboard)/
│       ├── layout.tsx                ✅ Icon-only sidebar margin
│       ├── page.tsx                  ✅ Dashboard overview diperbarui
│       ├── keuangan/
│       │   └── page.tsx              ✅ BARU — persis referensi Stitch
│       ├── withdrawals/page.tsx      ✅ Topbar update
│       └── orders/page.tsx           ✅ Topbar update
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx               ✅ Icon-only rebuild
│   │   ├── Topbar.tsx                ✅ BARU — page-level header
│   │   ├── Header.tsx                ✅ Backward compat alias
│   │   └── PageHeader.tsx            ⚠️  Deprecated (tidak dihapus)
│   ├── finance/                      ✅ BARU
│   │   ├── BalanceCard.tsx
│   │   ├── WithdrawalForm.tsx
│   │   ├── WeeklyGiftChart.tsx
│   │   ├── GiftHistoryTable.tsx
│   │   └── WithdrawalHistoryTable.tsx
│   └── ui/
│       ├── StatusBadge.tsx           ✅ BARU
│       ├── DragToConfirm.tsx         ✅ BARU
│       └── [komponen shadcn lama tetap ada]
│
├── public/                           ✅ Dari sprint sebelumnya
└── [lainnya tidak berubah]
```

---

## 📁 Summary File yang Dibuat/Diubah

| File | Status | Keterangan |
|------|--------|------------|
| `tailwind.config.ts` | ✅ Diubah | MD3 color tokens + font scale + spacing |
| `src/app/globals.css` | ✅ Diubah | CSS vars + Material Symbols + slider styles |
| `src/app/layout.tsx` | ✅ Diubah | Material Symbols Google Fonts link |
| `src/app/(dashboard)/layout.tsx` | ✅ Diubah | Margin sidebar baru |
| `src/app/(dashboard)/page.tsx` | ✅ Diubah | Design system baru |
| `src/app/(dashboard)/keuangan/page.tsx` | ✅ Baru | Halaman finance referensi Stitch |
| `src/app/(dashboard)/withdrawals/page.tsx` | ✅ Diubah | PageHeader → Topbar |
| `src/app/(dashboard)/orders/page.tsx` | ✅ Diubah | PageHeader → Topbar |
| `src/components/layout/Sidebar.tsx` | ✅ Diubah | Icon-only sidebar |
| `src/components/layout/Topbar.tsx` | ✅ Baru | Per-page header |
| `src/components/layout/Header.tsx` | ✅ Diubah | Backward compat alias |
| `src/components/ui/StatusBadge.tsx` | ✅ Baru | 6-variant status badge MD3 |
| `src/components/ui/DragToConfirm.tsx` | ✅ Baru | Drag slider untuk konfirmasi |
| `src/components/finance/BalanceCard.tsx` | ✅ Baru | Card saldo amplop |
| `src/components/finance/WithdrawalForm.tsx` | ✅ Baru | Form penarikan |
| `src/components/finance/WeeklyGiftChart.tsx` | ✅ Baru | Bar chart mingguan |
| `src/components/finance/GiftHistoryTable.tsx` | ✅ Baru | Tabel riwayat amplop |
| `src/components/finance/WithdrawalHistoryTable.tsx` | ✅ Baru | Tabel riwayat penarikan |
| `docs/Progress/03-ROMBAK-TAMPILAN-DASHBOARD.md` | ✅ Baru | File progress ini |
