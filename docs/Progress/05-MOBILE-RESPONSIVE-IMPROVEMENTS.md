# 05 — Optimasi Tampilan Mobile & Responsivitas Dashboard

**Tanggal:** 8 September 2026  
**Status:** ✅ Selesai  
**Dikerjakan oleh:** Antigravity AI  
**Terkait:** Mobile Responsiveness, Bottom Navigation, Mobile Drawer, & Adaptive Tables

---

## 🔍 Masalah Yang Ditemukan Sebelumnya (Dari Screenshot User)

1. **Sidebar Desktop Tidak Tersembunyi di Mobile:**
   Komponen `Sidebar.tsx` tetap melayang secara fixed selebar 96px (`w-sidebar-width`) di kiri layar HP, menimpa dan memotong hampir sepertiga bidang pandang.
2. **Margin Kiri Hardcoded 144px:**
   Tag `<main>` di `DashboardLayout` menggunakan `ml-[calc(96px+48px)]` tanpa breakpoint, menyebabkan area konten terdorong 144px ke kanan pada layar selebar 390px (konten hanya tersisa ~220px).
3. **Topbar & Profil Overflow:**
   Judul halaman menggunakan ukuran font desktop yang besar (`30px`), dan pill profil menampilkan teks `Admin SUPER ADMIN` sehingga mendesak tombol notifikasi dan avatar ke luar batas layar.
4. **Tabel Desktop Sempit:**
   Tabel keuangan dengan banyak kolom terhimpit di layar sempit tanpa alternatif tampilan kartu vertikal.

---

## 🛠️ Solusi & Perubahan Yang Dilakukan

### 1. Navigasi Bawah Khusus Mobile (`BottomNavigation.tsx`)
- Dibuat komponen `src/components/layout/BottomNavigation.tsx` yang hanya muncul di mobile (`md:hidden`).
- Menampilkan 5 tab utama:
  - **Dasbor** (`/`, ikon `grid_view`)
  - **Pesanan** (`/orders`, ikon `shopping_bag`)
  - **Keuangan** (`/keuangan`, ikon `account_balance_wallet`)
  - **Katalog** (`/catalog`, ikon `palette`)
  - **Menu** (Memicu pembukaan Mobile Drawer)
- Dilengkapi indikator aktif berbentuk kapsul sesuai Material Design 3 dan background blur halus (`backdrop-blur-md`).

---

### 2. Slide-over Mobile Drawer (`MobileDrawer.tsx`)
- Dibuat komponen `src/components/layout/MobileDrawer.tsx` untuk menampung menu sekunder yang tidak muat di navigasi bawah:
  - Verifikasi Pesanan, Persetujuan Penarikan, Tiket Bantuan (dengan badge notifikasi), CMS & Landing Page, Pengaturan Sistem, dan Keluar Sesi.
  - Dilengkapi scroll-lock otomatis pada body saat drawer terbuka.

---

### 3. Penyesuaian `Sidebar.tsx` & `layout.tsx`
- **`Sidebar.tsx`**: Ditambahkan kelas `hidden md:flex` agar otomatis hilang di layar ponsel dan tablet kecil.
- **`layout.tsx`**: Diperbarui menjadi:
  ```tsx
  <main className="flex-grow ml-0 px-4 pt-3 pb-24 md:ml-[calc(96px+48px)] md:mr-lg md:py-lg md:px-0 md:pb-lg flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
  ```
  - Pada mobile: margin kiri `0`, padding horizontal `16px`, padding bawah `96px` (`pb-24`) agar konten terbawah tidak tertutup bottom bar.
  - Pada desktop: tetap kembali ke posisi semula (`ml-144px`).

---

### 4. Topbar Adaptif (`Topbar.tsx`)
- Judul responsif: `text-xl sm:text-2xl md:text-headline-lg font-bold tracking-tight truncate`.
- Chip profil responsif: teks disembunyikan pada layar `< sm` (`hidden sm:flex flex-col`), hanya menampilkan avatar bulat `AD` yang ringkas dan rapi.
- Jarak antar elemen mengecil secara otomatis pada ponsel (`gap-2 sm:gap-md`).

---

### 5. Dual-Mode Table Responsif (`GiftHistoryTable` & `WithdrawalHistoryTable`)
- **Di Mobile (`sm:hidden`)**: Menampilkan daftar kartu vertikal (card-list) sesuai referensi Stitch `keuangan_dashboard_mobile`. Setiap baris menampilkan nama tamu/bank, nominal berukuran besar di kanan, tanggal/waktu, dan status badge dengan touch target yang nyaman.
- **Di Desktop (`hidden sm:block`)**: Tetap menampilkan tabel multi-kolom penuh dengan hover effect.

---

### 6. Metric Cards & Chart Scaling
- Padding kartu diperhalus dari `p-lg (24px)` menjadi `p-4 sm:p-5 lg:p-lg`.
- Nilai angka nominal menggunakan ukuran responsif (`text-xl sm:text-2xl lg:text-headline-lg`) sehingga tidak terpotong.
- Chart Recharts diberikan tinggi proporsional (`h-56 sm:h-64`) dan tick sumbu Y ringkas (`jt` / `M`).

---

## 💡 Saran & Best Practice Agar Seluruh Halaman Selalu Rapi & Responsif

1. **Gunakan Fluid Breakpoints (Mobile-First):**
   - Selalu mulai styling dari mobile default (tanpa prefix), lalu tambahkan `sm:` (640px), `md:` (768px), `lg:` (1024px), dan `xl:` (1280px).
2. **Hindari Margin Kiri / Lebar Statis:**
   - Jangan gunakan `w-[500px]` atau `ml-[144px]` tanpa menyertakan `max-w-full` atau prefix breakpoint seperti `md:ml-[144px]`.
3. **Pola Dual-Mode untuk Tabel Data:**
   - Untuk halaman admin lain (seperti Daftar Tamu, Daftar Order, Daftar Template), terapkan pola yang sama: tabel di desktop (`hidden sm:table`), kartu vertikal di mobile (`sm:hidden`).
4. **Safe-Area Padding Bawah:**
   - Karena ada Bottom Navigation bar setinggi ~70px, pastikan setiap container halaman memiliki `pb-24` agar elemen paling bawah (seperti tombol simpan / konfirmasi) tidak tertutup navigasi.
5. **Touch Targets Minimal 44x44px:**
   - Pastikan setiap tombol aksi di HP memiliki area tap minimal `44px` agar mudah disentuh jari pengguna tanpa salah tekan.
