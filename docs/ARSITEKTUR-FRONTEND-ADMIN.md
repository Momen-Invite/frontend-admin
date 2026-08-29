# Arsitektur Frontend Dasbor Pengelola: `frontend-host` & `frontend-superadmin`

**Versi Dokumen:** 1.0  
**Tanggal:** 27 Agustus 2026  
**Status:** Panduan Arsitektur Frontend Pengelola (*Admin & Host Interface Standards*)  
**Lokasi File:** `backend-momeninvite/docs/ARSITEKTUR-FRONTEND-ADMIN.md`  
**Target Aplikasi:** `frontend-host` (Dashboard Klien Pembuat Acara) & `frontend-superadmin` (Panel Super Admin & Staf)

---

## 1. Ringkasan & Pemisahan Dasbor

Dalam ekosistem Momen Invite, antarmuka pengelola dibagi secara tegas menjadi dua aplikasi frontend yang terpisah guna menjamin isolasi keamanan dan pengalaman pengguna yang optimal:

1. **`frontend-host` (Dasbor Klien / Pembuat Undangan):**
   - Ditujukan untuk calon pengantin, orang tua, atau pihak yang merayakan ulang tahun.
   - Fokus: Kemudahan merancang undangan (drag-and-drop builder), mengunggah foto/musik langsung ke Cloudflare R2, mengelola buku tamu/meja, serta memantau dan mencairkan (*withdraw*) saldo amplop digital.
   - Autentikasi: **Passwordless Email OTP (6 digit)**.
2. **`frontend-superadmin` (Dasbor Administrator Platform):**
   - Ditujukan untuk staf operasional (`ADMIN`) dan pemilik platform / bagian keuangan (`SUPER_ADMIN`).
   - Fokus: Memoderasi katalog template, meninjau bukti bayar order manual, memantau analitik pendapatan platform, serta melakukan audit dan persetujuan penarikan dana kado (*withdrawal approval*).
   - Autentikasi: **Email + Password Bcrypt Hash**.

---

## 2. Tech Stack Frontend Dasbor

| Komponen | Pilihan Teknologi | Peran & Justifikasi |
|---|---|---|
| **Framework** | Next.js (App Router) atau Vite + React 18/19 | Rendering cepat, layouting modular, dan ekosistem TypeScript yang matang. |
| **Styling & UI Kit** | Tailwind CSS + `shadcn/ui` (Radix Primitives) | Komponen UI bersih, aksesibel (A11y), mudah dikustomisasi (Dialog, Sheet, Table, Tabs). |
| **Icons** | Lucide React | Ikon modern, konsisten, dan ringan. |
| **State & Data Fetching**| TanStack Query (`@tanstack/react-query`) | Caching server-state, otomatisasi revalidasi data, dan *optimistic update*. |
| **Form & Validasi** | `react-hook-form` + `@hookform/resolvers` + Zod | Validasi skema form yang sinkron dengan kontrak API backend. |
| **Drag & Drop Builder** | `@dnd-kit/core` + `@dnd-kit/sortable` | Engine penyusunan urutan seksi undangan secara interaktif dan mulus. |
| **Tabel & Visualisasi Data**| `@tanstack/react-table` + Recharts | Tabel dinamis (sorting, filtering, pagination) untuk data tamu dan grafik pendapatan. |
| **Notifikasi Toast** | Sonner | Umpan balik toast notifikasi yang elegan di pojok layar. |

---

## 3. Arsitektur & Fitur `frontend-host` (Dashboard Klien)

### 3.1. Alur Autentikasi Host (Passwordless OTP)
1. Klien memasukkan alamat email pada halaman login.
2. Frontend menembak endpoint `POST /api/auth/request-code { email }`.
3. Klien menerima kode OTP 6 digit via email (Resend).
4. Klien memasukkan kode OTP ke input komponen `input-otp`.
5. Frontend memanggil `POST /api/auth/verify-code { email, code }`.
6. Backend merespon dengan sesi cookie HTTP-only (`connect.sid`). Klien otomatis diarahkan ke `/dashboard`.

---

### 3.2. Fitur Utama Dasbor Host

#### A. Pembuatan Undangan Multi-Event (Wedding, Birthday, Gathering)
- Klien dapat memilih jenis acara (`wedding` vs `birthday`).
- Untuk **Pernikahan:** Form meminta nama mempelai pria/wanita, orang tua, tanggal akad, resepsi, dan lokasi.
- Untuk **Ulang Tahun:** Form meminta nama yang berulang tahun (`celebrantName`), perayaan usia (`age`), tanggal pesta, serta isi surat emosional (`letterContent`).
- Seluruh data disimpan ke backend via `POST /api/my-invitations` yang otomatis mengisi kolom `event_type` dan payload `custom_data` JSON.

#### B. Interactive Section Builder (@dnd-kit)
- Klien dapat mengubah urutan tampilan 12 seksi undangan (misal: memindahkan Galeri Foto ke atas Linimasa Cerita) atau menonaktifkan seksi tertentu (toggle *visible / hidden*).
- State urutan seksi disimpan dalam format JSON string di kolom `invitations.section_config`.

#### C. Direct Media Upload ke Cloudflare R2
- Menggunakan pola **Pre-Signed URL** (tanpa membebani server backend):
  1. Klien memilih foto galeri atau file audio musik (.mp3).
  2. Frontend memanggil `POST /api/media/presign-upload { fileName, fileType, folder: "gallery" }`.
  3. Backend merespons `{ uploadUrl, publicUrl }`.
  4. Frontend melakukan stream upload langsung via HTTP `PUT <uploadUrl>` ke Cloudflare R2.
  5. URL publik (`publicUrl`) kemudian disimpan ke kolom `cover_photo_url`, `music_url`, atau array `gallery_photos`.

#### D. Manajemen Tamu & Scanner QR Check-in
- Fitur input tamu individual atau **import massal via file Excel (.xlsx/csv)**.
- Setiap tamu otomatis dibuatkan tautan personal unik berbasis `guest_code` (misal: `momeninvite.com/v/budi-ani?to=VIP-001`).
- Fitur **QR Code Check-in**: Klien dapat membuka kamera di HP untuk memindai QR code tamu di meja penerima tamu saat hari H acara untuk mengubah status menjadi `checked_in`.

#### E. Dompet Kado Digital (Host Wallet) & Form Withdrawal
- **Tab Keuangan:**
  - Menampilkan ringkasan total saldo aktif kado digital (`users.balance`).
  - Tabel riwayat amplop masuk yang dibayar tamu via Duitku (`transactions` where `transaction_type = 'GIFT_PAYMENT'`).
  - Form pengajuan pencairan dana (`POST /api/wallet/withdraw`): Input nominal penarikan, nama bank (BCA, Mandiri, dll.), nomor rekening, dan nama pemilik rekening.
  - Validasi: Nominal penarikan tidak boleh melebihi saldo aktif (`amount <= balance`).

---

## 4. Arsitektur & Fitur `frontend-superadmin` (Panel Admin)

### 4.1. Pemisahan Wewenang (Role-Based Access Control)
Di dalam panel admin, antarmuka membedakan hak akses secara ketat berdasarkan `admins.role`:
- **Role `admin` (Staf Operasional):** Hanya dapat melihat statistik umum, memoderasi template, meninjau order paket manual, dan memoderasi pesan kontak.
- **Role `superadmin` (Pemilik Platform / Finansial):** Memiliki akses penuh ke **Tab Persetujuan Pencairan Dana (*Withdrawals*)**, master rekening bank platform (`bank_settings`), dan manajemen tier harga (`pricing_plans`).

---

### 4.2. Fitur Utama Dasbor Superadmin

#### A. Audit & Persetujuan Pencairan Dana (Khusus Super Admin)
- **Tabel Antrean Penarikan:** Menampilkan seluruh permohonan penarikan dana berstatus `PENDING`.
- **Informasi Presisi:** Nama host, email, nominal penarikan (Rp), bank tujuan, nomor rekening, dan nama rekening.
- **Aksi Persetujuan (*Approve*):**
  - Super Admin melakukan transfer uang riil dari rekening kas platform ke rekening host.
  - Super Admin mengklik tombol **"Approve & Selesai"**.
  - Frontend mengirim `PATCH /api/admin/withdrawals/:id/approve`. Status tiket menjadi `APPROVED` dan notifikasi WhatsApp terkirim ke host.
- **Aksi Penolakan (*Reject*):**
  - Jika nomor rekening salah atau ada indikasi fraud, Super Admin mengklik **"Tolak Pencairan"** dengan menyertakan alasan.
  - Frontend mengirim `PATCH /api/admin/withdrawals/:id/reject`.
  - Backend secara atomik mengembalikan saldo (*auto-refund*) ke `users.balance` host.

#### B. Workflow Verifikasi Order Pembayaran Manual
- Menampilkan pesanan paket berbayar yang menggunakan metode transfer bank manual (`orders`).
- Preview bukti struk transfer gambar (`payment_confirmations.proof_image_url`).
- Tombol: **Review** $\rightarrow$ **Approve** (langsung mengaktifkan `user_subscriptions` dan status undangan host menjadi *published*).

#### C. Katalog Template & Template Builder
- Admin dapat membuat master template desain baru.
- Mengatur konfigurasi default tema (`theme_config`) dan urutan default seksi (`sections_config`).

#### D. Pengaturan CMS Landing Page & Rekening Bank Platform
- Editor key-value store untuk teks hero, banner promo, dan testimoni pada landing page publik.
- Konfigurasi rekening bank admin penampung transfer klien (`bank_settings`).

---

## 5. Struktur Standar Komunikasi API (API Contract)

Semua pemanggilan API dari kedua frontend dasbor ke backend `backend-momeninvite` mengikuti standar:
1. **Base URL:** Terpusat via environment variable `NEXT_PUBLIC_API_URL=https://api.momeninvite.com`.
2. **Kredensial Sesi:** Seluruh request wajib menyertakan cookie sesi HTTP-only: `fetch(url, { credentials: "include" })`.
3. **Penanganan Error Terpadu:**
   ```typescript
   export interface ApiErrorResponse {
     error: string;      // Kode error, misal: "UNAUTHORIZED", "INSUFFICIENT_BALANCE"
     message: string;    // Pesan ramah pengguna
     details?: any;      // Rincian error validasi Zod
   }
   ```
4. **Dokumentasi Endpoint:** Seluruh developer frontend dasbor dapat menguji dan merujuk endpoint secara interaktif melalui **Swagger UI** di: `https://api.momeninvite.com/api/docs`.
