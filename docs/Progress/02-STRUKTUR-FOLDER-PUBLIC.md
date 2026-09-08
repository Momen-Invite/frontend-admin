# 02 — Struktur Folder `public/` & Standar Industri

**Tanggal:** 8 September 2026  
**Status:** ✅ Selesai  
**Dikerjakan oleh:** Antigravity AI  

---

## 🎯 Tujuan

Membuat folder `public/` sebagai tempat penyimpanan seluruh static asset (gambar, font, video, dokumen) dengan struktur yang jelas, scalable, dan mudah di-maintain sesuai standar industri Next.js.

---

## ✅ Yang Sudah Dikerjakan

### 1. Pembuatan Folder `public/` beserta Subfolder

Seluruh folder berikut berhasil dibuat di root proyek:

```
public/
├── README.md               ← Dokumentasi penggunaan folder public
├── images/
│   ├── icons/              ← Ikon UI statis (SVG/WebP)
│   ├── logos/              ← Logo brand Momen Invite & partner
│   ├── avatars/            ← Avatar & foto profil default
│   ├── banners/            ← Banner promo & header marketing
│   ├── templates/          ← Thumbnail preview template undangan
│   ├── placeholders/       ← Gambar fallback / no-image
│   └── backgrounds/        ← Wallpaper & background pattern
├── fonts/                  ← Font lokal woff2 (opsional)
├── videos/                 ← Video hero / onboarding (max 5MB)
└── documents/              ← PDF yang dapat diunduh
```

### 2. Penambahan `.gitkeep` di Setiap Subfolder

Semua subfolder yang masih kosong dilengkapi dengan file `.gitkeep` agar dapat di-track oleh Git dan tidak hilang saat di-clone ulang.

Folder yang mendapat `.gitkeep`:
- `public/images/icons/.gitkeep`
- `public/images/logos/.gitkeep`
- `public/images/avatars/.gitkeep`
- `public/images/banners/.gitkeep`
- `public/images/templates/.gitkeep`
- `public/images/placeholders/.gitkeep`
- `public/images/backgrounds/.gitkeep`
- `public/fonts/.gitkeep`
- `public/videos/.gitkeep`
- `public/documents/.gitkeep`

### 3. Dokumentasi `public/README.md`

Dibuat dokumentasi lengkap yang mencakup:
- Tujuan setiap subfolder
- Tabel batas ukuran & format file yang dianjurkan
- Catatan penting: user-generated content tetap di Cloudflare R2

---

## 📐 Keputusan Desain & Standar Industri

| Keputusan | Alasan |
|-----------|--------|
| **Memisahkan `images/` menjadi subfolder** | Mempermudah pencarian asset, mencegah folder root `public/` jadi berantakan seiring project berkembang |
| **Tidak menyimpan media user di `public/`** | Semua upload user (foto galeri, musik) masuk ke Cloudflare R2 via Pre-Signed URL sesuai arsitektur yang sudah ditetapkan di `ARSITEKTUR-FRONTEND-ADMIN.md` |
| **Menggunakan `.gitkeep`** | Git tidak melacak folder kosong; `.gitkeep` memastikan struktur folder tetap ada di semua environment developer |
| **Konvensi `kebab-case`** | Konsisten, cross-platform (Linux web server case-sensitive), mudah dibaca |
| **`README.md` di dalam `public/`** | Onboarding developer baru lebih cepat memahami aturan penempatan asset tanpa perlu membaca dokumentasi eksternal |

---

## 🗂️ Struktur `src/` Saat Ini (Referensi)

Untuk kelengkapan, berikut kondisi folder `src/` yang sudah ada:

```
src/
├── app/
│   ├── (auth)/             ← Route group halaman autentikasi
│   ├── (dashboard)/        ← Route group halaman dashboard
│   ├── globals.css
│   ├── layout.tsx
│   └── providers.tsx
├── components/
│   ├── layout/             ← Komponen layout (Sidebar, Navbar, dll.)
│   └── ui/                 ← Komponen UI reusable (shadcn/ui)
├── lib/
│   ├── api.ts              ← HTTP client & helper fetch
│   ├── constants.ts        ← Konstanta global aplikasi
│   └── utils.ts            ← Utility functions (cn, format, dll.)
└── types/
    ├── api.ts
    ├── auth.ts
    ├── catalog.ts
    ├── cms.ts
    ├── order.ts
    ├── ticket.ts
    └── withdrawal.ts
```

---

## 🔜 Langkah Selanjutnya (Rekomendasi)

Untuk menjaga standar industri, pertimbangkan penambahan berikut ke folder `src/` di sprint mendatang:

| Folder | Isi | Prioritas |
|--------|-----|-----------|
| `src/hooks/` | Custom React hooks (`useAuth`, `useDebounce`, dll.) | 🔴 Tinggi |
| `src/services/` | API call functions per domain (authService, orderService) | 🔴 Tinggi |
| `src/store/` | Global state management (Zustand / Context) | 🟡 Sedang |
| `src/config/` | Konfigurasi app (routes, metadata, env validation) | 🟡 Sedang |

---

## 📁 File yang Dibuat/Diubah

| File | Status | Keterangan |
|------|--------|------------|
| `public/README.md` | ✅ Baru | Dokumentasi penggunaan folder public |
| `public/images/icons/.gitkeep` | ✅ Baru | Git tracker folder kosong |
| `public/images/logos/.gitkeep` | ✅ Baru | Git tracker folder kosong |
| `public/images/avatars/.gitkeep` | ✅ Baru | Git tracker folder kosong |
| `public/images/banners/.gitkeep` | ✅ Baru | Git tracker folder kosong |
| `public/images/templates/.gitkeep` | ✅ Baru | Git tracker folder kosong |
| `public/images/placeholders/.gitkeep` | ✅ Baru | Git tracker folder kosong |
| `public/images/backgrounds/.gitkeep` | ✅ Baru | Git tracker folder kosong |
| `public/fonts/.gitkeep` | ✅ Baru | Git tracker folder kosong |
| `public/videos/.gitkeep` | ✅ Baru | Git tracker folder kosong |
| `public/documents/.gitkeep` | ✅ Baru | Git tracker folder kosong |
| `docs/Progress/02-STRUKTUR-FOLDER-PUBLIC.md` | ✅ Baru | File progress ini |
