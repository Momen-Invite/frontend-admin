# Laporan Progress Setup Tech Stack: `frontend-admin` (Momen Invite)

**Tanggal Eksekusi:** 29 Agustus 2026  
**Status:** Selesai (Completed)  
**Dokumen Acuan:** `docs/PRD.md` (Bab 8.3, 14, 15) & `docs/ARSITEKTUR-FRONTEND-ADMIN.md`  
**Lokasi Modul:** `frontend-admin/`  

---

## 1. Ringkasan Eksekusi & Ruang Lingkup

Telah diselesaikan inisialisasi dan konfigurasi **Master Tech Stack** untuk aplikasi **`frontend-admin` (Panel Dasbor Administrator & Keuangan Platform Momen Invite)**. 

Aplikasi ini bertanggung jawab sebagai pusat kendali operasional, audit keuangan pencairan amplop kado digital host (*Withdrawals Approval*), verifikasi pesanan manual, moderasi katalog template multi-event, sistem tiket bantuan, dan konfigurasi platform global.

---

## 2. Rincian Tech Stack yang Dikonfigurasi

Sesuai dengan tabel *Master Tech Stack Matrix* pada PRD (Bab 14) dan panduan arsitektur frontend admin:

| Kategori | Teknologi Terpasang | Versi | Peran & Justifikasi |
|---|---|---|---|
| **Framework Web** | Next.js (App Router) | `^15.1.7` / React 19 | Server-Side Rendering (SSR), layouting bersarang modular, route grouping (`(auth)`, `(dashboard)`). |
| **Language** | TypeScript | `^5.7.3` | Type safety ketat, sinkronisasi skema Zod dan tipe data Skema Database v3 47 Tabel. |
| **Styling & Design Tokens** | Tailwind CSS + CSS Variables | `^3.4.17` | Utility-first styling dengan sistem token warna semantik, radius, dan dark mode support. |
| **Komponen UI Primitives** | Radix UI (`@radix-ui/*`) | Latest | Primitif UI tanpa styling bawaan yang ramah aksesibilitas (A11y): Dialog, Dropdown, Tabs, Select, Avatar, Separator, dll. |
| **Icons Library** | Lucide React | `^0.475.0` | Ikonografi modern, konsisten, dan ringan. |
| **State & Data Fetching** | TanStack Query v5 (`@tanstack/react-query`) | `^5.66.0` | Caching server-state, otomatisasi revalidasi data, dan manajemen query/mutasi HTTP. |
| **Form Handling & Validasi**| React Hook Form + `@hookform/resolvers` + Zod | Latest | Validasi input form berbasis skema deklaratif yang selaras dengan validasi backend Express. |
| **Visualisasi Data & Tabel** | TanStack Table v8 (`@tanstack/react-table`) + Recharts | `^8.21.2` / `^2.15.1` | Tabel dinamis (sorting/filter/pagination) dan grafik tren pendapatan serta perputaran kado digital. |
| **Drag & Drop Builder** | `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` | Latest | Engine penyusunan urutan seksi template undangan secara interaktif. |
| **Notifikasi UI** | Sonner | `^2.0.1` | Sistem toast notifikasi terpadu di pojok layar. |
| **Animasi & Efek Visual** | Framer Motion + Canvas Confetti | `^12.4.7` / `^1.9.4` | Transisi halaman mulus dan efek selebrasi. |

---

## 3. Struktur Direktori Proyek yang Dibuat

```text
frontend-admin/
├── docs/
│   ├── PRD.md                             # Master Global PRD
│   ├── ARSITEKTUR-FRONTEND-ADMIN.md      # Blueprint Frontend Admin
│   ├── DATABASE-ERD.md                   # Kamus Data 47 Tabel
│   ├── FUNDAMENTAL.md                    # 30 Pilar Resiliensi
│   ├── Progress/
│   │   └── 01-SETUP-TECH-STACK.md        # Laporan Ini
│   └── Stitch/                            # Desain UI Prototype
│
├── public/                                # Aset statis & logo
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── layout.tsx                # Layout autentikasi latar gelap imersif
│   │   │   └── login/
│   │   │       └── page.tsx              # Halaman Login Admin + Brute Force Notice
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx                # Layout Dasbor dengan Sidebar & Header
│   │   │   ├── page.tsx                  # Dashboard Overview + Recharts Analytics
│   │   │   ├── withdrawals/
│   │   │   │   └── page.tsx              # Konsol Audit Penarikan Saldo (Super Admin)
│   │   │   └── orders/
│   │   │       └── page.tsx              # Verifikasi Bukti Bayar Manual & Pesanan
│   │   ├── globals.css                   # Tailwind base tokens (Light/Dark variables)
│   │   ├── layout.tsx                    # Root Layout + Font Inter + Meta noindex
│   │   └── providers.tsx                 # Wrapper QueryClientProvider & Toaster
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx               # Navigasi Menu Admin dengan Role Guard
│   │   │   ├── Header.tsx                # Top Bar dengan status server & UserNav
│   │   │   ├── UserNav.tsx               # Dropdown profil admin & logout
│   │   │   └── PageHeader.tsx            # Header halaman terstandarisasi
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── badge.tsx
│   │       ├── table.tsx
│   │       ├── dialog.tsx
│   │       ├── tabs.tsx
│   │       ├── select.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── avatar.tsx
│   │       ├── separator.tsx
│   │       ├── skeleton.tsx
│   │       └── sonner.tsx
│   │
│   ├── lib/
│   │   ├── api.ts                        # HTTP Client tersentralisasi (credentials: include)
│   │   ├── utils.ts                      # Helper cn(), formatCurrency (IDR), formatDate
│   │   └── constants.ts                  # Menu Sidebar, RBAC roles, badge styles
│   │
│   └── types/
│       ├── api.ts                        # Kontrak Respon Baku API Backend (FR-QA-01)
│       ├── auth.ts                       # Tipe Admin, Role ADMIN / SUPER_ADMIN, Session
│       ├── withdrawal.ts                 # Tipe Penarikan Dana (PENDING/APPROVED/REJECTED)
│       ├── order.ts                      # Tipe Pesanan Undangan, Invoices, Payment Proofs
│       ├── catalog.ts                    # Tipe Produk Tema, Kategori Acara, Aset Media
│       ├── ticket.ts                     # Tipe Tiket Bantuan & Diskusi Interaksi
│       └── cms.ts                        # Tipe Bank Platform, FAQ, Popups, System Settings
│
├── .env.example                          # Template variabel lingkungan
├── .env.local                            # Konfigurasi lingkungan lokal
├── .gitignore                            # Pengabaian git terstandarisasi
├── components.json                       # Konfigurasi shadcn/ui
├── next.config.ts                        # Keamanan private admin headers & CDN domain
├── package.json                          # Dependensi proyek
├── postcss.config.mjs                    # Konfigurasi PostCSS
├── tailwind.config.ts                    # Konfigurasi tema Tailwind & tokens
└── tsconfig.json                         # Konfigurasi TypeScript + path alias @/*
```

---

## 4. Fitur & Keamanan yang Telah Diimplementasikan

1. **Security Headers (Private Portal Isolation):**
   - Mengonfigurasi header `X-Robots-Tag: noindex, nofollow, noarchive` pada `next.config.ts` dan metadata Next.js untuk mencegah portal admin terindeks oleh search engine publik (FR-SYS-05).
   - Menambahkan header `X-Frame-Options: DENY` dan `X-Content-Type-Options: nosniff`.
2. **Kontrak API Terstandarisasi (FR-QA-01):**
   - Mendefinisikan tipe respon `ApiResponse<T>` dan client `src/lib/api.ts` yang otomatis membawa cookie sesi HTTP-only (`credentials: "include"`) ke backend `backend-momeninvite`.
3. **Role-Based Access Control (RBAC):**
   - Navigasi sidebar secara otomatis menyaring modul sensitif (seperti *Persetujuan Penarikan Dana*, *Rekening Bank Platform*, *Audit Activity Logs*) hanya untuk role `SUPER_ADMIN`.
4. **Modul Finansial Khusus Super Admin (`/withdrawals`):**
   - Dilengkapi dialog konfirmasi transfer kas riil sebelum *Approve*.
   - Dilengkapi modal *Reject* dengan validasi alasan penolakan dan mekanisme *auto-refund* ke saldo dompet host.
5. **Verifikasi Bukti Pembayaran Manual (`/orders`):**
   - Menampilkan preview bukti struk transfer dan tombol aktivasi pesanan.

---

## 5. Langkah Selanjutnya (Next Steps)
- Menjalankan instalasi paket dependensi: `npm install`
- Melanjutkan integrasi endpoint API real-time dengan `backend-momeninvite` untuk autentikasi sesi dan sinkronisasi data master.
