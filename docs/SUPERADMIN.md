# Blueprint & Arsitektur Panel Superadmin (`frontend-superadmin`)
## Panduan Lengkap Halaman, Data, Relasi Database & Komponen UI per Modul

**Aplikasi Target:** `frontend-superadmin` (Panel Dasbor Administrator & Keuangan Platform)  
**Dokumen Pendukung:** `docs/DATABASE-ERD.md` (47 Tabel), `docs/ARSITEKTUR-FRONTEND-ADMIN.md`, `docs/PRD.md`  
**Backend API:** Express.js 5 (`backend-momeninvite`) via REST API & Datatable AJAX  
**Format Respon API:** `{ success: boolean, type: string, title: string, action: string, status: number, message: string, data: any, errors: any }`

---

## DAFTAR ISI

1. [Prinsip Desain & Hak Akses (RBAC)](#1-prinsip-desain--hak-akses-rbac)
2. [Layout Global & Komponen Desain Standar](#2-layout-global--komponen-desain-standar)
3. [MODUL 1: Dashboard & Analitik Platform](#modul-1-dashboard--analitik-platform)
   - [Halaman 1.1: Dashboard Ringkasan Eksekutif (`/admin/dashboard`)](#halaman-11-dashboard-ringkasan-eksekutif-admindashboard)
4. [MODUL 2: Manajemen Akun & Hak Akses (Auth & RBAC)](#modul-2-manajemen-akun--hak-akses-auth--rbac)
   - [Halaman 2.1: Master Pengguna / Host User (`/admin/users`)](#halaman-21-master-pengguna--host-user-adminusers)
   - [Halaman 2.2: Master Staf Administrator (`/admin/admins`)](#halaman-22-master-staf-administrator-adminadmins)
   - [Halaman 2.3: Master Peran & Role (`/admin/roles`)](#halaman-23-master-peran--role-adminroles)
   - [Halaman 2.4: Log Sesi & Verifikasi OTP (`/admin/auth-sessions`)](#halaman-24-log-sesi--verifikasi-otp-adminauth-sessions)
5. [MODUL 3: Manajemen Host Penyelenggara](#modul-3-manajemen-host-penyelenggara)
   - [Halaman 3.1: Data Host & Saldo Kado Digital (`/admin/hosts`)](#halaman-31-data-host--saldo-kado-digital-adminhosts)
6. [MODUL 4: Katalog Tema & Produk Undangan](#modul-4-katalog-tema--produk-undangan)
   - [Halaman 4.1: Master Kategori Acara (`/admin/categories`)](#halaman-41-master-kategori-acara-admincategories)
   - [Halaman 4.2: Katalog Tema Undangan (`/admin/products`)](#halaman-42-katalog-tema-undangan-adminproducts)
   - [Halaman 4.3: Kelola Aset Default Tema (`/admin/products/:id/assets`)](#halaman-43-kelola-aset-default-tema-adminproductsidassets)
   - [Halaman 4.4: Flash Sale & Promo Tema (`/admin/flash-sales`)](#halaman-44-flash-sale--promo-tema-adminflash-sales)
7. [MODUL 5: Monitoring Event Orders & Konten Undangan](#modul-5-monitoring-event-orders--konten-undangan)
   - [Halaman 5.1: Daftar Pesanan Undangan / Event Orders (`/admin/event-orders`)](#halaman-51-daftar-pesanan-undangan--event-orders-adminevent-orders)
   - [Halaman 5.2: Detail & Moderasi Konten Undangan (`/admin/event-orders/:id`)](#halaman-52-detail--moderasi-konten-undangan-adminevent-ordersid)
8. [MODUL 6: Monitoring Buku Tamu, Tiket & Presensi Hari-H](#modul-6-monitoring-buku-tamu-tiket--presensi-hari-h)
   - [Halaman 6.1: Buku Tamu Undangan (`/admin/guests`)](#halaman-61-buku-tamu-undangan-adminguests)
   - [Halaman 6.2: Registrasi Tiket Acara Publik (`/admin/registrations`)](#halaman-62-registrasi-tiket-acara-publik-adminregistrations)
   - [Halaman 6.3: Log Presensi Scan QR Hari-H (`/admin/attendances`)](#halaman-63-log-presensi-scan-qr-hari-h-adminattendances)
9. [MODUL 7: Keuangan, Billing & Dompet Digital (Finansial)](#modul-7-keuangan-billing--dompet-digital-finansial)
   - [Halaman 7.1: Invoice Pembelian Tema (`/admin/invoices`)](#halaman-71-invoice-pembelian-tema-admininvoices)
   - [Halaman 7.2: Sesi Pembayaran & Bukti Gateway (`/admin/payments`)](#halaman-72-sesi-pembayaran--bukti-gateway-adminpayments)
   - [Halaman 7.3: Transaksi Amplop Kado Digital (`/admin/gift-invoices`)](#halaman-73-transaksi-amplop-kado-digital-admingift-invoices)
   - [Halaman 7.4: Konsol Persetujuan Penarikan Dana (Withdrawal Approval) (`/admin/withdrawals`)](#halaman-74-konsol-persetujuan-penarikan-dana-withdrawal-approval-adminwithdrawals)
10. [MODUL 8: Pusat Bantuan (Support Tickets) & Ulasan](#modul-8-pusat-bantuan-support-tickets--ulasan)
    - [Halaman 8.1: Helpdesk Tiket Dukungan (`/admin/tickets`)](#halaman-81-helpdesk-tiket-dukungan-admintickets)
    - [Halaman 8.2: Thread Percakapan Tiket (`/admin/tickets/:id`)](#halaman-82-thread-percakapan-tiket-adminticketsid)
    - [Halaman 8.3: Moderasi Ulasan & Rating Tema (`/admin/reviews`)](#halaman-83-moderasi-ulasan--rating-tema-adminreviews)
11. [MODUL 9: CMS, Marketing & Halaman Publik](#modul-9-cms-marketing--halaman-publik)
    - [Halaman 9.1: Banner Popup Promo (`/admin/popups`)](#halaman-91-banner-popup-promo-adminpopups)
    - [Halaman 9.2: Akun Sosial Media Resmi (`/admin/sosmed`)](#halaman-92-akun-sosial-media-resmi-adminsosmed)
    - [Halaman 9.3: Kategori & Tanya Jawab FAQ (`/admin/faq`)](#halaman-93-kategori--tanya-jawab-faq-adminfaq)
    - [Halaman 9.4: Kebijakan Privasi & Syarat Ketentuan (`/admin/legal-pages`)](#halaman-94-kebijakan-privasi--syarat-ketentuan-adminlegal-pages)
    - [Halaman 9.5: Pengaturan Konten Landing Page (`/admin/landing-settings`)](#halaman-95-pengaturan-konten-landing-page-adminlanding-settings)
    - [Halaman 9.6: Kotak Masuk Pesan Kontak Form (`/admin/contact-messages`)](#halaman-96-kotak-masuk-pesan-kontak-form-admincontact-messages)
12. [MODUL 10: Gateway Notifikasi & Delivery Logs](#modul-10-gateway-notifikasi--delivery-logs)
    - [Halaman 10.1: Antrean & Log WhatsApp Fonnte (`/admin/notif-whatsapp`)](#halaman-101-antrean--log-whatsapp-fonnte-adminnotif-whatsapp)
    - [Halaman 10.2: Antrean & Log Email Resend (`/admin/notif-email`)](#halaman-102-antrean--log-email-resend-adminnotif-email)
    - [Halaman 10.3: Antrean Notifikasi Gagal (Dead Letter Queue) (`/admin/dead-notifications`)](#halaman-103-antrean-notifikasi-gagal-dead-letter-queue-admindead-notifications)
13. [MODUL 11: Konfigurasi Sistem & Gateway Kredensial](#modul-11-konfigurasi-sistem--gateway-kredensial)
    - [Halaman 11.1: Identitas Situs & SEO Global (`/admin/settings/site`)](#halaman-111-identitas-situs--seo-global-adminsettingssite)
    - [Halaman 11.2: Aturan Transaksi & Penomoran Invoice (`/admin/settings/transaction`)](#halaman-112-aturan-transaksi--penomoran-invoice-adminsettingstransaction)
    - [Halaman 11.3: Gateway WhatsApp Fonnte (`/admin/settings/whatsapp`)](#halaman-113-gateway-whatsapp-fonnte-adminsettingswhatsapp)
    - [Halaman 11.4: Gateway Email SMTP / Resend (`/admin/settings/smtp`)](#halaman-114-gateway-email-smtp--resend-adminsettingssmtp)
    - [Halaman 11.5: Aturan Pop-up Dialog (`/admin/settings/popup`)](#halaman-115-aturan-pop-up-dialog-adminsettingspopup)
14. [MODUL 12: Keamanan Sistem & Audit Trail](#modul-12-keamanan-sistem--audit-trail)
    - [Halaman 12.1: Audit Log Keamanan & Aktivitas (`/admin/activity-logs`)](#halaman-121-audit-log-keamanan--aktivitas-adminactivity-logs)
15. [Matriks Verifikasi 47 Tabel Database](#15-matriks-verifikasi-47-tabel-database)

---

## 1. PRINSIP DESAIN & HAK AKSES (RBAC)

Di panel `frontend-superadmin`, terdapat dua level hak akses (*Role-Based Access Control*) berdasarkan tabel `admins.role_id`:

| Role | Label UI | Lingkup Hak Akses |
|---|---|---|
| `admin` | **Staf Operasional** | Operasional harian: melihat ringkasan order, memoderasi tema & konten undangan, memproses tiket bantuan, meninjau pesan kontak, moderasi review. **Dilarang mencairkan dana / approval withdrawal**, dilarang mengubah konfigurasi gateway/sistem, dilarang mengelola staf admin lain. |
| `superadmin` | **Pemilik Platform & Finance** | **Akses Penuh Tanpa Batas**: Wewenang tunggal untuk *Approve/Reject* penarikan saldo kado (`withdrawals`), konfigurasi rekening kas, manajemen akun admin lain, pengaturan gateway Fonnte/Resend/Duitku, konfigurasi sistem global, dan audit trail log. |

---

## 2. LAYOUT GLOBAL & KOMPONEN DESAIN STANDAR

Agar antarmuka seragam dan mudah dibangun oleh desainer (Figma / Web Studio), terapkan standar layout berikut:

```
+-----------------------------------------------------------------------------------------+
| [LOGO] Momen Invite Superadmin        | [Search Global]   | [Notif Badge] [Profil Admin]|
+-------------------+---------------------------------------------------------------------+
| SIDEBAR NAVIGASI  | BREADCRUMB: Beranda > Modul > Nama Halaman                         |
|                   +---------------------------------------------------------------------+
| - Dashboard       | HEADER HALAMAN: [Judul Halaman]                  [Tombol Aksi Utama]|
| - Pengguna & Role | Deskripsi ringkas fungsi halaman                                    |
| - Host Acara      +---------------------------------------------------------------------+
| - Katalog Tema    | KARTU METRIK / STATS SUMMARY (Bila ada: 3-4 widget KPI)             |
| - Pesanan Undangan+---------------------------------------------------------------------+
| - Buku Tamu & QR  | TOOLBAR: [Input Pencarian] [Dropdown Filter 1] [Filter 2] [Export]  |
| - Keuangan & WD   +---------------------------------------------------------------------+
| - Tiket Bantuan   | TABEL DATA UTAMA (Pagination Server-Side, Sortable Headers, Badges) |
| - CMS & Marketing |                                                                     |
| - Log Notifikasi  +---------------------------------------------------------------------+
| - Konfigurasi     | PAGINATION: Menampilkan 1-10 dari 250 data     [ < 1 2 3 4 5 > ]     |
| - Audit Trail     +---------------------------------------------------------------------+
|                   | FOOTER: Momen Invite Platform Core Engine v3.0.0                    |
+-------------------+---------------------------------------------------------------------+
```

### Palet Status Badges
- **Hijau (`success`, `approved`, `active`, `confirmed`, `paid`):** `bg-emerald-50 text-emerald-700 border-emerald-200`
- **Kuning (`pending`, `scheduled`, `in_progress`, `open`):** `bg-amber-50 text-amber-700 border-amber-200`
- **Merah (`failed`, `rejected`, `banned`, `expired`, `dead`):** `bg-rose-50 text-rose-700 border-rose-200`
- **Biru (`resolved`, `completed`, `guest_registered`, `read`):** `bg-sky-50 text-sky-700 border-sky-200`
- **Abu-abu (`draft`, `archived`, `unread`, `superseded`):** `bg-slate-100 text-slate-700 border-slate-200`

---

## MODUL 1: DASHBOARD & ANALITIK PLATFORM

### Halaman 1.1: Dashboard Ringkasan Eksekutif (`/admin/dashboard`)
Halaman pertama setelah login, memberikan *helicopter view* performa platform dan antrean tindakan mendesak.

#### 1. Komponen UI Halaman
- **4 Kartu Ringkasan KPI Utama:**
  1. *Total Pendapatan Penjualan Tema:* Rp (Akumulasi `invoices` status `SUCCESS`)
  2. *Total Amplop Kado Mengalir:* Rp (Akumulasi `invoice_gifts` status `paid`)
  3. *Antrean Penarikan Pending:* X Permintaan (Total `withdrawals` status `PENDING`) $\rightarrow$ Border berkedip/aksen merah
  4. *Total Undangan Aktif:* X Acara (Total `event_orders` status `success` & `is_published = true`)
- **Grafik Tren Penjualan & Kado (Recharts):** Grafik area multi-series (Rentang 7 hari / 30 hari / 1 tahun).
- **Widget Aksi Cepat (Quick Actions Grid):**
  - Tabel 5 Penarikan Dana Terbaru yang butuh approval segera.
  - Tabel 5 Tiket Bantuan dengan prioritas `urgent` / `high` yang belum ditanggapi.
  - Log aktivitas staf admin terkini (5 baris terakhir).

#### 2. Endpoint API Backend Terkait
- `GET /api/admin/withdrawals` (filter `status=PENDING`, limit 5)
- `POST /api/admin/tickets/query` (filter `status=open`, sort `priority=desc`, limit 5)
- `POST /api/admin/activity-logs/query` (sort `createdAt=desc`, limit 5)
- `POST /api/admin/invoices/query` (filter `status=SUCCESS`)

---

## MODUL 2: MANAJEMEN AKUN & HAK AKSES (AUTH & RBAC)

### Halaman 2.1: Master Pengguna / Host User (`/admin/users`)
Mengelola seluruh akun pemilik undangan (klien/host) dan tamu terdaftar.

#### 1. Komponen UI Halaman
- **Header:** Judul "Manajemen Pengguna", deskripsi jumlah user aktif, tombol *Refresh*.
- **Toolbar:**
  - Search: nama, email, no telepon (`email`, `name`, `phone`).
  - Filter Role: Dropdown (`host`, `guest_registered`).
  - Filter Status: Dropdown (`active`, `banned`, `suspended`).
- **Tabel Pengguna:**
  - Kolom: ID, Nama Pengguna, Email, Nomor Telepon, Role, Status Akun (Badge), Verifikasi (Icon Ceklis Hijau / Silang Abu), Tanggal Daftar, Aksi.
  - Kolom Aksi: Tombol *Detail Drawer*, *Ubah Status (Banned/Active)*, *Lihat Profil Host & Undangan*.
- **Modal / Drawer Detail Pengguna:**
  - Informasi profil lengkap & alamat.
  - Tab "Undangan Dimiliki" (`event_orders` milik user ini).
  - Tab "Riwayat Token & Sesi" (dari `user_refresh_tokens`).

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Utama:** `users`
  | Nama Kolom | Tipe Data | Keterangan di UI | Status Input Form |
  |---|---|---|---|
  | `id` | serial PK | Nomor ID unik pengguna | Read-Only |
  | `name` | text | Nama lengkap klien | Input Text |
  | `email` | text UK | Alamat email terdaftar | Input Email (Unik) |
  | `phone` | varchar UK | Nomor WhatsApp/HP | Input Tel (+62) |
  | `password_hash` | text | Password hash (bcrypt) | **Tersembunyi** (tidak pernah tampil) |
  | `address` | text | Alamat domisili | Input Textarea |
  | `role_id` | int FK | Peran sistem | Dropdown pilih `roles` (Superadmin Only) |
  | `status` | varchar | active / banned / suspended | Dropdown Status Badge |
  | `is_verified` | boolean | Status verifikasi email/WA | Toggle / Badge status |
  | `created_at` | timestamp | Waktu pendaftaran akun | Read-Only |
- **Relasi Database (FK):**
  - `users.role_id` $\rightarrow$ `roles.id` (1:N)
  - `users.id` $\leftarrow$ `hosts.user_id` (1:1 Relasi ke dompet host)
  - `users.id` $\leftarrow$ `user_refresh_tokens.user_id` (1:N Sesi login)
  - `users.id` $\leftarrow$ `user_verification.user_id` (1:N OTP)

#### 3. Endpoint API Backend
- `POST /api/superadmin/users/query` (Datatable query, filter, search, pagination)
- `GET /api/superadmin/users/:id` (Detail user)
- `PATCH /api/superadmin/users/:id` (Update status/role — Super Admin only)

---

### Halaman 2.2: Master Staf Administrator (`/admin/admins`)
*(Khusus Role `superadmin`)* — Mengelola staf operasional dan akun administrator platform.

#### 1. Komponen UI Halaman
- **Header:** Judul "Master Staf Administrator", tombol *"+ Tambah Staf Baru"*.
- **Tabel Staf Admin:**
  - Kolom: ID, Nama Staf, Email, No Telepon, Level Role (`admin` vs `superadmin`), Percobaan Gagal (`failed_attempts`), Terkunci Sampai (`locked_until`), Status Akun, Aksi.
  - Aksi: Tombol *Edit Akun*, *Reset Password*, *Buka Kunci Akun (Unlock)*, *Hapus Staf*.
- **Modal Dialog "Tambah / Edit Staf Admin":**
  - Form: Nama Lengkap, Email Kantor, Nomor Telepon, Alamat, Password Baru, Pilihan Role (`admin` atau `superadmin`), Status.

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Utama:** `admins`
  | Nama Kolom | Tipe Data | Keterangan di UI | Status Input Form |
  |---|---|---|---|
  | `id` | serial PK | ID Admin | Read-Only |
  | `name` | text | Nama admin | Input Text (Wajib) |
  | `email` | text UK | Email login panel | Input Email (Wajib, Unik) |
  | `password_hash` | text | Password hash | Input Password (Otomatis di-hash bcrypt salt 12) |
  | `phone` | varchar | Nomor HP admin | Input Tel |
  | `address` | text | Alamat staf | Textarea |
  | `role_id` | int FK | Role hak akses | Dropdown `roles.name` (`admin` / `superadmin`) |
  | `status` | varchar | active / inactive / suspended | Radio / Select |
  | `failed_attempts` | int | Jumlah salah password berturut | Counter (Otomatis reset saat unlock) |
  | `locked_until` | timestamp | Waktu buka gembok brute-force | Date-time / Status badge |
- **Relasi Database (FK):**
  - `admins.role_id` $\rightarrow$ `roles.id` (1:N)
  - `admins.id` $\leftarrow$ `activity_logs.actor_admin_id` (1:N Log aktivitas)
  - `admins.id` $\leftarrow$ `withdrawals.processed_by_admin_id` (1:N Admin pengesah penarikan)
  - `admins.id` $\leftarrow$ `tickets.assigned_admin_id` (1:N Penanggung jawab tiket)

#### 3. Endpoint API Backend
- `POST /api/superadmin/admins/query` (Datatable admin)
- `POST /api/superadmin/admins` (Buat akun admin baru)
- `PATCH /api/superadmin/admins/:id` (Edit admin / reset password)
- `DELETE /api/superadmin/admins/:id` (Hapus admin)

---

### Halaman 2.3: Master Peran & Role (`/admin/roles`)
*(Khusus Role `superadmin`)* — Tabel referensi hak akses sistem.

#### 1. Komponen UI Halaman
- **Tabel Master Role:**
  - 4 Role Baku: `superadmin`, `admin`, `host`, `guest_registered`.
  - Kolom: ID, Kode Role (`name`), Deskripsi Hak Akses, Tanggal Dibuat.

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Utama:** `roles`
  | Nama Kolom | Tipe Data | Keterangan di UI | Status Input Form |
  |---|---|---|---|
  | `id` | serial PK | ID Role | Read-Only |
  | `name` | varchar UK | Identifier unik role | Read-Only (Kunci sistem) |
  | `description` | text | Penjelasan wewenang role | Input Text |

---

### Halaman 2.4: Log Sesi & Verifikasi OTP (`/admin/auth-sessions`)
*(Khusus Role `superadmin`)* — Audit autentikasi untuk investigasi keamanan dan kendala OTP user.

#### 1. Komponen UI Halaman
- **Tab 1: Log Verifikasi OTP (`user_verification`):**
  - Tabel: Target (Email / No HP), Channel (Email / WhatsApp), Tujuan (`register`, `reset_password`), Status Kadaluarsa, Waktu Terpakai (`used_at`), Timestamp.
  - *Catatan Keamanan:* Kolom `code` OTP disembunyikan/diberi masking demi keamanan data.
- **Tab 2: Sesi Aktif PostgreSQL (`admin_sessions`):**
  - Tabel: Session ID (`sid`), Expire Timestamp. Tombol: *Paksa Logout Sesi Ini (Revoke)*.
- **Tab 3: Refresh Token User (`user_refresh_tokens`):**
  - Tabel: User ID, Info Device/Browser (`device_info`), Masa Berlaku (`expires_at`), Status Dicabut (`revoked_at`).

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Terkait:** `user_verification`, `admin_sessions`, `user_refresh_tokens`
  - Relasi FK: `user_verification.user_id` $\rightarrow$ `users.id`, `user_refresh_tokens.user_id` $\rightarrow$ `users.id`.

---

## MODUL 3: MANAJEMEN HOST PENYELENGGARA

### Halaman 3.1: Data Host & Saldo Kado Digital (`/admin/hosts`)
Mengawasi pengguna yang bertindak sebagai penyelenggara acara pemegang saldo kado digital.

#### 1. Komponen UI Halaman
- **Header:** Judul "Daftar Host Acara", Total Saldo Tertampung di Platform (Rp).
- **Toolbar:** Pencarian nama/email host, filter rentang saldo (> 0 vs = 0), filter izin WA.
- **Tabel Host:**
  - Kolom: Host ID, Nama Host (dari relasi `users`), Email Host, Nomor WhatsApp, **Saldo Kado Aktif (`balance`)**, Notifikasi WhatsApp (Aktif / Nonaktif), Tanggal Terdaftar, Aksi.
  - Kolom Aksi: Tombol *Lihat Detail Host*, *Riwayat Mutasi Kado*, *Riwayat Penarikan Dana*.
- **Drawer Detail Host:**
  - Profil lengkap host.
  - Daftar semua undangan yang dibuat (`event_orders`).
  - Ringkasan total kado masuk vs total saldo ditarik.
  - Tombol pintasan langsung ke menu Approval Penarikan jika host ini memiliki tiket pending.

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Utama:** `hosts`
  | Nama Kolom | Tipe Data | Keterangan di UI | Status Input Form |
  |---|---|---|---|
  | `id` | serial PK | ID Host | Read-Only |
  | `user_id` | int FK UK | Relasi ke akun pengguna | Read-Only (1:1 terikat) |
  | `balance` | decimal(14,2) | Saldo amplop kado digital siap tarik | **Terproteksi Keras** (Hanya berubah via transaksi ACID Duitku / Withdrawal) |
  | `allow_notif_wa` | boolean | Izin menerima notifikasi WhatsApp | Toggle switch |
  | `created_at` | timestamp | Tanggal registrasi host | Read-Only |
- **Relasi Database (FK):**
  - `hosts.user_id` $\rightarrow$ `users.id` (1:1 relasi pemilik akun)
  - `hosts.id` $\leftarrow$ `event_orders.host_id` (1:N Undangan dibuat)
  - `hosts.id` $\leftarrow$ `invoice_gifts.host_id` (1:N Amplop kado diterima)
  - `hosts.id` $\leftarrow$ `withdrawals.host_id` (1:N Riwayat penarikan dana)
  - `hosts.id` $\leftarrow$ `tickets.host_id` (1:N Tiket bantuan diajukan)

#### 3. Endpoint API Backend
- `POST /api/admin/hosts/query` (Datatable host dengan join profil user)
- `GET /api/admin/hosts/:id` (Detail host beserta saldo dan riwayat)
- `PATCH /api/admin/hosts/:id` (Hanya mengubah `allow_notif_wa`)

---

## MODUL 4: KATALOG TEMA & PRODUK UNDANGAN

### Halaman 4.1: Master Kategori Acara (`/admin/categories`)
Mengelola jenis acara yang didukung oleh sistem Momen Invite.

#### 1. Komponen UI Halaman
- **Header:** Judul "Kategori Acara", Tombol *"+ Tambah Kategori"*.
- **Tabel Kategori:**
  - Kolom: ID, Nama Kategori, Slug URL (`wedding`, `birthday`, `birthday_greeting`, `gathering`), Wajib RSVP (Ya/Tidak), Status Aktif (Publish/Draft), Total Tema Tersedia, Aksi.
  - Aksi: *Edit Kategori*, *Toggle Status*, *Hapus (Bila belum ada order)*.
- **Modal Tambah / Edit Kategori:**
  - Nama Kategori (cth: "Pernikahan Islami"), Slug URL, Toggle `requires_rsvp`, Toggle `is_active`.

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Utama:** `event_categories`
  | Nama Kolom | Tipe Data | Keterangan di UI | Status Input Form |
  |---|---|---|---|
  | `id` | serial PK | ID Kategori | Read-Only |
  | `name` | varchar | Nama kategori acara | Input Text (Wajib) |
  | `slug` | varchar UK | Identifier URL ramah SEO | Input Text (Wajib, Unik) |
  | `requires_rsvp` | boolean | Apakah butuh form kehadiran RSVP | Toggle Switch |
  | `is_active` | boolean | Tampil di landing page katalog | Toggle Switch |
- **Relasi Database (FK):**
  - `event_categories.id` $\leftarrow$ `event_product.event_category_id` (1:N Tema di kategori ini)

#### 3. Endpoint API Backend
- `POST /api/admin/event-categories/query` | `POST /api/admin/event-categories` | `PATCH /api/admin/event-categories/:id`

---

### Halaman 4.2: Katalog Tema Undangan (`/admin/products`)
Mengatur master tema/template undangan yang dijual secara a-la-carte kepada host.

#### 1. Komponen UI Halaman
- **Header:** Judul "Katalog Tema Undangan", Tombol *"+ Buat Desain Tema Baru"*.
- **Toolbar:** Filter Kategori Acara, Filter Status Publish, Search nama tema / slug.
- **Tabel Tema:**
  - Kolom: Thumbnail Aset, Nama Tema, Kategori Acara, Slug (`wedding1`, `ultah-luxury`), Badge Promo (cth: "Best Seller", "New"), Harga Normal (Rp), Status Publish, Total Terjual, Aksi.
  - Aksi: *Edit Metadata*, *Kelola Aset Media*, *Konfigurasi JSON Seksi & Tema*, *Hapus*.
- **Modal / Editor Form Produk Tema:**
  - Nama Tema & Slug URL.
  - Pilihan Kategori (`event_category_id`).
  - Deskripsi singkat tema.
  - Badge promo teks (`badge`).
  - Tema slug pengenal engine rendering (`theme_slug`).
  - Harga satuan produk (`price` dalam rupiah integer).
  - **Code/JSON Editor:**
    - `sections_config` (Daftar susunan seksi bawaan tema).
    - `theme_config` (Microcopy default, palet warna, tipografi bawaan tema).
  - Toggle `is_published`.

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Utama:** `event_product`
  | Nama Kolom | Tipe Data | Keterangan di UI | Status Input Form |
  |---|---|---|---|
  | `id` | serial PK | ID Produk Tema | Read-Only |
  | `event_category_id` | int FK | Kategori acara | Dropdown pilih `event_categories` |
  | `name` | text | Nama komersial tema | Input Text (Wajib) |
  | `slug` | varchar UK | Slug tema sistem | Input Text (Wajib, Unik) |
  | `description` | text | Deskripsi fitur tema | Textarea |
  | `badge` | varchar | Label badge menarik | Input Text ("Popular", "Hot") |
  | `theme_slug` | varchar | Kode styling tema | Input Text |
  | `price` | int | Harga beli tema (Rp) | Input Angka / Mata Uang |
  | `sections_config` | jsonb | Urutan seksi default | JSON Editor / Tree Builder |
  | `theme_config` | jsonb | Teks default & config tema | JSON Editor |
  | `is_published` | boolean | Tampil di katalog publik | Toggle Switch |
- **Relasi Database (FK):**
  - `event_product.event_category_id` $\rightarrow$ `event_categories.id` (N:1)
  - `event_product.id` $\leftarrow$ `event_assets.event_product_id` (1:N Aset foto/audio default)
  - `event_product.id` $\leftarrow$ `event_orders.event_product_id` (1:N Undangan yang memakai tema)
  - `event_product.id` $\leftarrow$ `flash_sales.event_product_id` (1:N Promo diskon tema)

#### 3. Endpoint API Backend
- `POST /api/admin/event-products/query` | `POST /api/admin/event-products` | `PATCH /api/admin/event-products/:id`

---

### Halaman 4.3: Kelola Aset Default Tema (`/admin/products/:id/assets`)
Mengelola file media contoh (foto thumbnail, backsound default, foto hero) untuk tiap template.

#### 1. Komponen UI Halaman
- **Breadcrumb:** Master Tema > Nama Tema > Kelola Aset Media.
- **Komponen Upload Langsung ke Cloudflare R2:**
  - Slot Media Selector: Dropdown (`thumbnail`, `hero_photo`, `default_music`, `final_bg`, `video_preview`).
  - File Dropzone (Foto/Audio MP3/Video MP4).
- **Galeri Aset Tersimpan:**
  - Kartu preview aset, tipe file (image/audio/video), slot posisi, nomor urutan sort (`sort_order`), tombol *Hapus Aset*.

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Utama:** `event_assets`
  | Nama Kolom | Tipe Data | Keterangan di UI | Status Input Form |
  |---|---|---|---|
  | `id` | serial PK | ID Aset | Read-Only |
  | `event_product_id` | int FK | Tema pemilik aset | Terpilih otomatis via Route Param |
  | `type` | varchar | image / video / audio | Terdeteksi otomatis dari MIME |
  | `url` | text | URL file di CDN R2 | Diisi via Cloudflare R2 Presign Upload |
  | `slot` | varchar | Slot penempatan tema | Dropdown (`thumbnail`, `hero_photo`, dll.) |
  | `sort_order` | int | Urutan kemunculan | Input Angka |
- **Relasi Database (FK):**
  - `event_assets.event_product_id` $\rightarrow$ `event_product.id` (N:1)

---

### Halaman 4.4: Flash Sale & Promo Tema (`/admin/flash-sales`)
Menyelenggarakan diskon tema berbatas waktu otomatis (countdown promo).

#### 1. Komponen UI Halaman
- **Header:** Judul "Flash Sale & Event Promo", Tombol *"+ Buat Jadwal Promo"*.
- **Tabel Flash Sale:**
  - Kolom: ID, Tema Terpilih, Harga Normal, **Harga Promo Flash Sale (Rp)**, Label Promo ("Diskon 50% Gajian"), Waktu Mulai, Waktu Berakhir, Status (`scheduled` / `active` / `ended`), Aksi.
  - Aksi: *Edit Periode*, *Hentikan Promo Sekarang*, *Hapus*.

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Utama:** `flash_sales`
  | Nama Kolom | Tipe Data | Keterangan di UI | Status Input Form |
  |---|---|---|---|
  | `id` | serial PK | ID Flash Sale | Read-Only |
  | `event_product_id` | int FK | Tema yang didiskon | Dropdown pilih `event_product` |
  | `promo_price` | int | Harga coret spesial (Rp) | Input Mata Uang (Harus < Harga Normal) |
  | `label` | varchar | Judul banner promo | Input Text ("Promo Hari Kemerdekaan") |
  | `starts_at` | timestamp | Waktu mulai promo | Date-Time Picker |
  | `ends_at` | timestamp | Waktu berakhir promo | Date-Time Picker |
  | `status` | varchar | scheduled / active / ended | Badge Status Otomatis |
- **Relasi Database (FK):**
  - `flash_sales.event_product_id` $\rightarrow$ `event_product.id` (N:1)

---

## MODUL 5: MONITORING EVENT ORDERS & KONTEN UNDANGAN

### Halaman 5.1: Daftar Pesanan Undangan / Event Orders (`/admin/event-orders`)
Memantau seluruh pesanan undangan yang dibuat oleh host di platform.

#### 1. Komponen UI Halaman
- **Header:** Judul "Pesanan Undangan & Konten Acara".
- **Toolbar Filter:**
  - Pencarian: Slug URL undangan (`slug`), Nama Venue (`venue_name`), Alamat.
  - Filter Status Order: `pending_payment`, `success`, `failed`, `expired`, `completed`, `archived`.
  - Filter Tanggal Acara: Date range filter.
- **Tabel Event Orders:**
  - Kolom: ID Order, Slug Publik (Link Klik langsung buka `/v/:slug`), Nama Host, Tema Dipakai, Tanggal Acara, Status Bayar (Badge), Status Publikasi (`is_published`), Selesai Pada (`completed_at`), Aksi.
  - Aksi: Tombol *Lihat Detail Konten*, *Buka Undangan Publik*, *Arsipkan*.

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Utama:** `event_orders`
  | Nama Kolom | Tipe Data | Keterangan di UI | Status Input Form |
  |---|---|---|---|
  | `id` | serial PK | ID Order Undangan | Read-Only |
  | `slug` | varchar UK | Alamat link undangan publik | Tautan klik (`momeninvite.com/v/:slug`) |
  | `host_id` | int FK | Host pemilik acara | Relasi ke `hosts` |
  | `event_product_id` | int FK | Tema desain yang dibeli | Relasi ke `event_product` |
  | `venue_name` | text | Nama tempat/gedung acara | Text preview |
  | `venue_address` | text | Alamat lengkap lokasi | Text preview |
  | `event_date` | date | Tanggal pelaksanaan acara | Basis otomatisasi cron `completed` |
  | `requires_login` | boolean | Wajib login untuk lihat acara | Toggle status |
  | `status` | varchar | pending_payment / success / failed / expired / completed / archived | Badge Status |
  | `is_published` | boolean | Status tayang undangan | Toggle / Badge (Hanya true bila order sukses) |
  | `section_config` | jsonb | Konfigurasi urutan 12 seksi | JSON viewer |
  | `completed_at` | timestamp | Waktu acara dinyatakan usai | Read-Only |
- **Relasi Database (FK):**
  - `event_orders.host_id` $\rightarrow$ `hosts.id` (N:1)
  - `event_orders.event_product_id` $\rightarrow$ `event_product.id` (N:1)
  - `event_orders.id` $\leftarrow$ `data_wedding.event_order_id` (1:1 Khusus pernikahan)
  - `event_orders.id` $\leftarrow$ `data_birthday.event_order_id` (1:1 Khusus ulang tahun)
  - `event_orders.id` $\leftarrow$ `data_birthday_greeting.event_order_id` (1:1 Ucapan ultah interaktif)
  - `event_orders.id` $\leftarrow$ `data_galeries.event_order_id` (1:N Galeri foto/video)
  - `event_orders.id` $\leftarrow$ `event_wishes.event_order_id` (1:N Buku doa/harapan)
  - `event_orders.id` $\leftarrow$ `event_guests.event_order_id` (1:N Tamu undangan)
  - `event_orders.id` $\leftarrow$ `invoices.event_order_id` (1:1 Tagihan paket)

---

### Halaman 5.2: Detail & Moderasi Konten Undangan (`/admin/event-orders/:id`)
Halaman inspeksi menyeluruh terhadap isi konten yang diisi oleh klien (untuk moderasi konten tidak senonoh / melanggar hukum).

#### 1. Komponen UI Halaman
- **Header:** Slug Undangan, Status Acara, Tombol *Buka Tampilan Asli Publik*.
- **Navigasi Berbasis Tab:**
  - **Tab 1: Data Acara Spesifik:**
    - Jika Pernikahan: Tampilkan form data dari tabel `data_wedding` (Nama Mempelai Pria & Wanita, Orang Tua Masing-Masing, Tanggal/Waktu Akad & Resepsi, Google Maps URL, Kutipan Doa, Linimasa Pertemuan).
    - Jika Ulang Tahun / Ucapan: Tampilkan data dari `data_birthday` & `data_birthday_greeting` (Nama Celebrant, Usia Dirayakan, Dress Code, Isi Amplop Surat Emosional, Kartu Harapan).
  - **Tab 2: Galeri Media R2 (`data_galeries`):**
    - Grid preview semua foto & video yang diunggah host. Tombol *Hapus Foto Melanggar*.
  - **Tab 3: Moderasi Doa & Ucapan (`event_wishes`):**
    - Tabel pesan tamu yang masuk. Kolom: Nama Tamu, Pesan Doa, Status Tayang (`is_published`). Tombol *Sembunyikan Pesan Kasar / Spam*.

#### 2. Spesifikasi Database & Kolom Tabel Terkait
- **Tabel `data_wedding` (1:1 dengan `event_orders`):**
  `event_order_id` (PK/FK), `groom_name`, `bride_name`, `groom_parents`, `bride_parents`, `akad_date`, `akad_time`, `reception_date`, `reception_time`, `maps_url`, `opening_quote`, `additional_notes`, `timeline_items` (JSONB).
- **Tabel `data_birthday` & `data_birthday_greeting` (1:1):**
  `event_order_id` (PK/FK), `celebrant_name`, `celebrant_age`, `hero_description`, `letter_title`, `letter_salutation`, `letter_sender_name`, `letter_paragraphs` (JSONB), `timeline_items` (JSONB), `wish_cards` (JSONB), `quotes_items` (JSONB).
- **Tabel `data_galeries` (1:N):**
  `id`, `event_order_id`, `url`, `type` (image/video/audio), `slot` (cover_photo, backsound, gallery, teaser), `category`, `caption`, `sort_order`.
- **Tabel `event_wishes` (1:N):**
  `id`, `event_order_id`, `user_id` (opsional), `guest_name`, `message`, `is_published` (Admin dapat toggle false untuk menyembunyikan).

---

## MODUL 6: MONITORING BUKU TAMU, TIKET & PRESENSI HARI-H

### Halaman 6.1: Buku Tamu Undangan (`/admin/guests`)
Melihat daftar tamu undangan privat yang di-input host pada setiap acara.

#### 1. Komponen UI Halaman
- **Header:** Judul "Daftar Tamu Undangan", Dropdown Pilih Acara/Event Order.
- **Tabel Tamu (`event_guests`):**
  - Kolom: ID, Kode Tamu Unik (`guest_code`), Nama Tamu, Nomor WhatsApp, Email, Kategori (VIP / Keluarga / Teman), Meja (`table_number`), Kuota Pax (`max_guests`), Status RSVP (Badge: Pending / Attending / Declined), Jumlah Pax RSVP, Waktu Undangan Dibuka, Aksi.

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Utama:** `event_guests`
  | Nama Kolom | Tipe Data | Keterangan di UI | Status Input Form |
  |---|---|---|---|
  | `id` | serial PK | ID Tamu | Read-Only |
  | `event_order_id` | int FK | Acara terkait | Relasi ke `event_orders` |
  | `guest_code` | varchar UK | Kode unik URL personal | cth: `VIP-001` (Auto-generated) |
  | `name` | varchar | Nama tamu undangan | Text |
  | `phone` | varchar | Nomor WA tujuan kirim | Text Tel |
  | `email` | varchar | Email tamu | Email |
  | `category` | varchar | Klasifikasi tamu | Badge / Text ("VIP", "Keluarga") |
  | `group_session` | varchar | Sesi jam kehadiran | Sesi 1 / Sesi 2 |
  | `table_number` | varchar | Nomor meja resepsi | Text |
  | `address_or_institution` | text | Asal instansi / kota | Text |
  | `max_guests` | int | Jatah orang yang boleh dibawa | Angka |
  | `rsvp_status` | varchar | pending / attending / declined / tentative | Badge Status RSVP |
  | `rsvp_pax` | int | Konfirmasi jumlah orang hadir | Angka |
  | `rsvp_wishes` | text | Doa saat isi RSVP | Text |
  | `invitation_opened_at` | timestamp | Kapan link tamu dibuka | Date-time |
- **Relasi Database (FK):**
  - `event_guests.event_order_id` $\rightarrow$ `event_orders.id` (N:1)
  - `event_guests.id` $\leftarrow$ `event_attendances.guest_id` (1:N Log presensi hari-H)

---

### Halaman 6.2: Registrasi Tiket Acara Publik (`/admin/registrations`)
Memantau peserta yang membeli/mendaftar tiket pada event publik (seminar, konser musik, gathering).

#### 1. Komponen UI Halaman
- **Tabel Registrasi (`event_registrations`):**
  - Kolom: ID, Kode Tiket (`ticket_code`), Nama Pemesan (`users.name`), Acara, Jenis Tiket (`ticket_type` cth: "VIP Pass"), Pax (`pax_count`), Status Tiket (confirmed / pending_payment / cancelled), Waktu Daftar.
  - Relasi ke Sesi Pembayaran: Tautan ke `payment_sessions.registration_id`.

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Utama:** `event_registrations`
  - Kolom: `id`, `event_order_id`, `user_id`, `ticket_code` (UK), `ticket_type`, `status`, `pax_count`, `form_responses` (JSONB jawaban formulir kustom), `registered_at`.
  - Relasi FK: `event_order_id` $\rightarrow$ `event_orders.id`, `user_id` $\rightarrow$ `users.id`.

---

### Halaman 6.3: Log Presensi Scan QR Hari-H (`/admin/attendances`)
Audit absensi fisik tamu di lokasi resepsi hari-H.

#### 1. Komponen UI Halaman
- **Header:** Judul "Log Presensi & Check-in Hari-H", Widget Realtime Total Tamu Hadir vs Total Undangan.
- **Tabel Kehadiran (`event_attendances`):**
  - Kolom: Waktu Check-in (`checked_in_at`), Nama Hadir (`attendee_name`), Tipe Tamu (guest / walk_in / registered_user), Kode QR yang Discan, Sesi Acara (Akad / Resepsi), Metode (Scan QR / Manual), Petugas Penerima (`checked_in_by_label`), Status Suvenir (Sudah Diberikan / Belum), Pintu/Meja Masuk (`gate_or_desk`).

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Utama:** `event_attendances`
  - Kolom: `id`, `event_order_id`, `attendee_type`, `guest_id`, `registration_id`, `user_id`, `attendee_name`, `qr_code_scanned`, `actual_pax`, `session_name`, `checkin_method`, `checked_in_by_label`, `souvenir_status`, `gate_or_desk`, `notes`, `checked_in_at`.
  - Relasi FK: `event_order_id` $\rightarrow$ `event_orders.id`, `guest_id` $\rightarrow$ `event_guests.id`.

---

## MODUL 7: KEUANGAN, BILLING & DOMPET DIGITAL (FINANSIAL)

### Halaman 7.1: Invoice Pembelian Tema (`/admin/invoices`)
Catatan seluruh tagihan pemesanan paket tema undangan dari host ke platform.

#### 1. Komponen UI Halaman
- **Header:** Judul "Invoice Pembelian Paket", Total Omset Terbayar (Rp).
- **Tabel Tagihan:**
  - Kolom: Nomor Invoice (`invoice_number`), Nama Host Pemesan, Nama Tema Snapshot, Subtotal, Pajak, Total Bayar (Rp), Batas Waktu Bayar (`due_date`), Status (`PENDING`, `SUCCESS`, `FAILED`, `EXPIRED`), Waktu Lunas (`paid_at`), Aksi.
  - Aksi: *Lihat Detail Sesi Gateway*, *Cetak Bukti Faktur*.

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Utama:** `invoices`
  | Nama Kolom | Tipe Data | Keterangan di UI | Status Input Form |
  |---|---|---|---|
  | `id` | serial PK | ID Invoice | Read-Only |
  | `event_order_id` | int FK | Pesanan terkait | Relasi ke `event_orders` |
  | `invoice_number` | varchar UK | Nomor faktur resmi | cth: `INV-20260908-001` (Auto) |
  | `event_product_name_snapshot` | text | Nama tema saat transaksi | Mencegah perubahan jika tema di-rename |
  | `subtotal` | int | Nilai paket (Rp) | Angka |
  | `tax` | int | PPN / Biaya admin | Angka |
  | `total` | int | Total harus dibayar | Angka |
  | `due_date` | timestamp | Batas expired pembayaran | Countdown / Tanggal |
  | `status` | varchar | PENDING/SUCCESS/FAILED/EXPIRED | Badge Status |
  | `paid_at` | timestamp | Waktu transaksi sukses | Tanggal bayar |
- **Relasi Database (FK):**
  - `invoices.event_order_id` $\rightarrow$ `event_orders.id` (1:1)
  - `invoices.id` $\leftarrow$ `payment_sessions.invoice_id` (1:N Sesi pembayaran)

---

### Halaman 7.2: Sesi Pembayaran & Bukti Gateway (`/admin/payments`)
Audit jejak transaksi Duitku Payment Gateway untuk investigasi komplain klien.

#### 1. Komponen UI Halaman
- **Tab 1: Sesi Transaksi Duitku (`payment_sessions`):**
  - Kolom: ID, Referensi Transaksi (`payment_reference`), Tautan Transaksi (Invoice Tema / Kado Host / Tiket), Metode Pembayaran (QRIS / VA Mandiri / BCA / ShopeePay), Status Sesi (`active`, `expired`, `superseded`).
- **Tab 2: Bukti Webhook Mentah (`payment_proofs`):**
  - Kolom: Session ID, Signature Sah (Icon Centang Hijau / Silang Merah), Waktu Terima Webhook, Tombol *Lihat JSON Mentah Callback*.
  - Modal JSON Viewer: Menampilkan payload asli dari server Duitku untuk pengecekan rekonsiliasi bank.

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Terkait:** `payment_sessions`, `payment_proofs`
  - Relasi FK: `payment_sessions.invoice_id` $\rightarrow$ `invoices.id`, `payment_sessions.gift_invoice_id` $\rightarrow$ `invoice_gifts.id`, `payment_sessions.registration_id` $\rightarrow$ `event_registrations.id`.
  - `payment_proofs.payment_session_id` $\rightarrow$ `payment_sessions.id`.

---

### Halaman 7.3: Transaksi Amplop Kado Digital (`/admin/gift-invoices`)
Melihat seluruh aliran dana amplop digital dari para tamu yang masuk ke dompet host.

#### 1. Komponen UI Halaman
- **Header:** Judul "Amplop & Kado Digital Tamu", Akumulasi Kado Masuk.
- **Tabel Amplop Kado (`invoice_gifts`):**
  - Kolom: ID Kado, Nama Host Penerima, Acara Terkait, **Nama Pengirim Kado** (dari JSON `sender.name`), Pesan Ucapan Kado, **Nominal Amplop (Rp)**, Status Pembayaran, Waktu Bayar.

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Utama:** `invoice_gifts`
  | Nama Kolom | Tipe Data | Keterangan di UI | Status Input Form |
  |---|---|---|---|
  | `id` | serial PK | ID Kado | Read-Only |
  | `host_id` | int FK | Host penerima kado | Relasi ke `hosts` |
  | `event_order_id` | int FK | Undangan acara | Relasi ke `event_orders` |
  | `sender` | jsonb | Info pengirim | `{name, message, source, source_id}` |
  | `amount` | decimal(14,2) | Nominal uang kado (Rp) | Angka Mata Uang |
  | `status` | varchar | pending / paid / expired | Badge Status |
  | `paid_at` | timestamp | Waktu tamu menyelesaikan bayar | Tanggal |
- **Relasi Database (FK):**
  - `invoice_gifts.host_id` $\rightarrow$ `hosts.id` (N:1)
  - `invoice_gifts.event_order_id` $\rightarrow$ `event_orders.id` (N:1)

---

### Halaman 7.4: Konsol Persetujuan Penarikan Dana (Withdrawal Approval) (`/admin/withdrawals`)
*(👑 FITUR PALING KRUSIAL — KHUSUS ROLE `superadmin`)*  
Tempat Super Admin (Finance) mengaudit dan mengesahkan pencairan uang riil dari kas platform ke rekening bank host.

#### 1. Komponen UI Halaman
- **Header:** Judul "Konsol Persetujuan Penarikan Dana", Banner Peringatan Keuangan: *"Pastikan mutasi kas bank keluar sesuai sebelum menekan tombol Approve"*.
- **Kartu Ringkasan:** Total Pending (Jumlah Tiket & Total Rp), Total Disetujui Bulan Ini (Rp), Total Ditolak.
- **Toolbar:** Filter Status (`PENDING`, `APPROVED`, `REJECTED`), Search nama host / nomor rekening.
- **Tabel Antrean Penarikan:**
  - Kolom: ID Tiket, Waktu Pengajuan, Nama Host, Email & No WA, **Nominal Penarikan (Rp)**, **Bank Tujuan**, **Nomor Rekening**, **Nama Pemilik Rekening**, Status (Badge Kuning `PENDING` / Hijau `APPROVED` / Merah `REJECTED`), Admin Pemroses, Aksi.
  - Kolom Aksi (Khusus baris `PENDING`):
    - Tombol Hijau: **"Approve & Selesai"**
    - Tombol Merah: **"Tolak Pencairan"**
- **Modal Konfirmasi "Persetujuan Penarikan (Approval Dialog)":**
  - Rekapitulasi Data Transfer:
    - Host: Budi Santoso
    - Nominal Transfer: **Rp 1.500.000**
    - Bank Tujuan: **BCA**
    - No Rekening: **1234567890** (Tersedia tombol *Salin Nomor*)
    - Atas Nama: **Budi Santoso**
  - Peringatan: *"Saya menyatakan telah melakukan transfer uang riil sebesar Rp 1.500.000 ke rekening di atas."*
  - Tombol: [Batal] | [Ya, Konfirmasi & Tandai Selesai] $\rightarrow$ Memicu `PATCH /api/admin/withdrawals/:id/approve`.
- **Modal "Tolak Penarikan (Rejection Dialog)":**
  - Form Input Wajib: **Alasan Penolakan** (cth: "Nomor rekening tidak terdaftar / nama pemilik rekening berbeda dengan data host").
  - Catatan Sistem: *"Menolak penarikan ini akan secara otomatis mengembalikan (auto-refund) saldo Rp 1.500.000 ke dompet host secara aman."*
  - Tombol: [Batal] | [Tolak & Refund Saldo] $\rightarrow$ Memicu `PATCH /api/admin/withdrawals/:id/reject`.

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Utama:** `withdrawals`
  | Nama Kolom | Tipe Data | Keterangan di UI | Status Input Form |
  |---|---|---|---|
  | `id` | serial PK | ID Tiket Penarikan | Read-Only |
  | `host_id` | int FK | Host pemohon | Relasi ke `hosts` |
  | `amount` | decimal(14,2) | Jumlah nominal dicairkan | Terkunci sejak pengajuan |
  | `bank_name` | varchar | Nama bank penerima | Snapshot teks (BCA, Mandiri, BRI) |
  | `account_number` | varchar | Nomor rekening tujuan | Snapshot teks rekening |
  | `account_name` | varchar | Nama pemilik rekening | Snapshot nama sesuai buku tabungan |
  | `status` | varchar | PENDING / APPROVED / REJECTED | Badge Status |
  | `processed_at` | timestamp | Waktu verifikasi dieksekusi | Terisi otomatis saat disetujui/tolak |
  | `processed_by_admin_id` | int FK | Admin pengesah | Terisi otomatis ID Super Admin login |
  | `processed_by_admin_name`| text | Nama admin pengesah | Terisi snapshot nama admin |
  | `reject_reason` | text | Alasan bila ditolak | Wajib diisi jika ditolak |
- **Relasi Database (FK):**
  - `withdrawals.host_id` $\rightarrow$ `hosts.id` (N:1)
  - `withdrawals.processed_by_admin_id` $\rightarrow` `admins.id` (N:1 Relasi staf pengesah)

#### 3. Endpoint API Backend Terkait
- `GET /api/admin/withdrawals` (Mendapatkan seluruh daftar)
- `PATCH /api/admin/withdrawals/:id/approve` (Khusus role `superadmin`)
- `PATCH /api/admin/withdrawals/:id/reject` (Khusus role `superadmin`, body: `{ reason: string }`)

---

## MODUL 8: PUSAT BANTUAN (SUPPORT TICKETS) & ULASAN

### Halaman 8.1: Helpdesk Tiket Dukungan (`/admin/tickets`)
Pusat pengaduan keluhan dan kendala teknis dari para klien penyelenggara acara.

#### 1. Komponen UI Halaman
- **Header:** Judul "Pusat Bantuan & Tiket Masuk", Tab Filter Cepat (Semua, Terbuka, Dalam Proses, Selesai).
- **Tabel Tiket:**
  - Kolom: ID Tiket, Subjek / Judul Tiket, Host Pengirim, Kategori Masalah (`issue_type`: billing / technical / design / other), Prioritas (Badge Warna: `low` [abu], `medium` [biru], `high` [oranye], `urgent` [merah berkedip]), Status Tiket (`open`, `in_progress`, `resolved`, `closed`), Staf Ditugaskan (`assigned_admin_id`), Tanggal Masuk, Aksi.
  - Aksi: Tombol *Buka Thread Obrolan Tiket*, *Assign ke Saya*.

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Utama:** `tickets`
  | Nama Kolom | Tipe Data | Keterangan di UI | Status Input Form |
  |---|---|---|---|
  | `id` | serial PK | ID Tiket | Read-Only |
  | `host_id` | int FK | Host yang komplain | Relasi ke `hosts` |
  | `event_order_id` | int FK | Acara bermasalah (opsional) | Relasi ke `event_orders` |
  | `issue_type` | varchar ENUM | billing / technical / design / other | Dropdown Kategori |
  | `title` | text | Judul keluhan | Input Text |
  | `description` | text | Rincian kendala | Textarea |
  | `priority` | varchar ENUM | low / medium / high / urgent | Dropdown Prioritas |
  | `status` | varchar ENUM | open / in_progress / resolved / closed| Dropdown Status Tiket |
  | `assigned_admin_id`| int FK | Staf penanggung jawab | Dropdown pilih staf `admins` |
  | `resolved_at` | timestamp | Waktu tiket dituntaskan | Otomatis terisi saat `resolved` |
- **Relasi Database (FK):**
  - `tickets.host_id` $\rightarrow$ `hosts.id` (N:1)
  - `tickets.assigned_admin_id` $\rightarrow$ `admins.id` (N:1)
  - `tickets.id` $\leftarrow$ `ticket_interactions.ticket_id` (1:N Thread pesan)

---

### Halaman 8.2: Thread Percakapan Tiket (`/admin/tickets/:id`)
Tampilan seperti messenger atau live chat antara staf admin dengan host pengirim tiket.

#### 1. Komponen UI Halaman
- **Sidebar Info Tiket (Kanan/Kiri):**
  - Data Host, No WA, Undangan Terkait, Prioritas Tiket, Dropdown Ubah Status (`in_progress` / `resolved`).
- **Area Pesan Chat (Tengah):**
  - Bubble chat bergantian: Bubble Kiri (Pesan dari Host) vs Bubble Kanan (Pesan Balasan Admin).
  - Lampiran File / Screenshot bukti error.
- **Form Input Balasan (Bawah):**
  - Textarea ketik balasan solusi.
  - Tombol upload file screenshot.
  - Tombol *Kirim Balasan*.

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Utama:** `ticket_interactions`
  - Kolom: `id`, `ticket_id`, `sender_host_id` (terisi jika host), `sender_admin_id` (terisi jika admin), `message` (isi pesan), `file` (JSONB info file), `created_at`.
  - Relasi FK: `ticket_id` $\rightarrow$ `tickets.id`, `sender_admin_id` $\rightarrow$ `admins.id`.

---

### Halaman 8.3: Moderasi Ulasan & Rating Tema (`/admin/reviews`)
Meninjau ulasan bintang 1-5 yang diberikan pembeli tema untuk ditampilkan di landing page.

#### 1. Komponen UI Halaman
- **Header:** Judul "Ulasan & Rating Pembeli", Rata-rata Rating Global (Bintang).
- **Tabel Ulasan:**
  - Kolom: ID, Nama User, Tema Terkait, Kategori Acara, Rating Bintang (1 s.d. 5 Bintang Emas), Pesan Ulasan, **Status Tampil (`is_published`)**, Tanggal Ulasan, Aksi.
  - Aksi: Toggle Switch Tampilkan/Sembunyikan dari Publik (Khusus Superadmin).

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Utama:** `invoice_reviews`
  - Kolom: `id`, `user_id`, `event_order_id`, `event_category_id`, `event_product_id`, `rating` (int 1-5), `message`, `is_published` (boolean).
  - Relasi FK: `user_id` $\rightarrow$ `users.id`, `event_product_id` $\rightarrow$ `event_product.id`.

---

## MODUL 9: CMS, MARKETING & HALAMAN PUBLIK

### Halaman 9.1: Banner Popup Promo (`/admin/popups`)
Mengatur banner pop-up yang muncul di layar pengunjung ketika membuka web.

#### 1. Komponen UI Halaman
- **Header:** Judul "Banner Pop-up Promosi", Tombol *"+ Buat Banner Baru"*.
- **Tabel Pop-up:**
  - Kolom: Thumbnail Banner, Judul Promo, Lokasi Tayang (`all`, `landing`, `host`, `public`), Link Tautan Tujuan, Periode Tayang (Tanggal Mulai s.d. Selesai), Status Aktif, Aksi.
- **Modal Form Banner:**
  - Judul Banner, Dropdown `display_locate`, Upload Gambar Banner ke R2 (`img`), Input `link_banner`, Date Picker `start_date` & `end_date`.

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Utama:** `popups`
  - Kolom: `id`, `title`, `display_locate` (varchar), `img` (URL R2), `link_banner`, `start_date`, `end_date`.

---

### Halaman 9.2: Akun Sosial Media Resmi (`/admin/sosmed`)
Menautkan akun media sosial resmi Momen Invite yang tampil di footer landing page.

#### 1. Komponen UI Halaman
- **Tabel Sosmed:**
  - Kolom: Nama Platform (Instagram, TikTok, YouTube, WhatsApp), Icon Identifier, URL Profil Resmi, Aksi (Edit/Hapus).

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Utama:** `sosmed`
  - Kolom: `id`, `name`, `url`, `icon`.

---

### Halaman 9.3: Kategori & Tanya Jawab FAQ (`/admin/faq`)
Pusat pengaturan pertanyaan umum (Frequently Asked Questions) di landing page.

#### 1. Komponen UI Halaman
- **Tab 1: Kategori FAQ (`faq_categories`):**
  - Tabel: Nama Kategori (cth: "Pemesanan & Pembayaran", "Desain & Fitur"), Urutan (`queue_number`), Aksi.
- **Tab 2: Daftar Pertanyaan FAQ (`faq`):**
  - Tabel: Kategori Terkait, Judul Pertanyaan, Cuplikan Jawaban, Urutan Tampil, Aksi (Edit/Hapus).
  - Modal Form: Dropdown Kategori, Input Pertanyaan, Textarea / Markdown Editor Jawaban, Nomor Urut Antrean.

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Terkait:** `faq_categories`, `faq`
  - Relasi FK: `faq.faq_categories_id` $\rightarrow$ `faq_categories.id` (N:1).

---

### Halaman 9.4: Kebijakan Privasi & Syarat Ketentuan (`/admin/legal-pages`)
Editor dokumen hukum platform Momen Invite.

#### 1. Komponen UI Halaman
- **Tab 1: Syarat & Ketentuan Layanan (`pages_terms`):**
  - Rich-Text / Markdown Editor teks ketentuan platform. Tombol *Simpan Perubahan*.
- **Tab 2: Kebijakan Privasi (`pages_privacy`):**
  - Rich-Text / Markdown Editor perlindungan data pribadi dan amplop kado.

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Terkait:** `pages_terms` (`id`, `content`), `pages_privacy` (`id`, `content`).

---

### Halaman 9.5: Pengaturan Konten Landing Page (`/admin/landing-settings`)
*(Khusus Role `superadmin`)* — Key-Value Store konten teks landing page utama.

#### 1. Komponen UI Halaman
- **Tabel Key-Value:**
  - Baris Konfigurasi:
    - `hero_title`: Judul besar di landing page utama
    - `hero_subtitle`: Subjudul deskripsi di bawah hero
    - `cta_button_text`: Teks tombol pendaftaran utama
    - `stat_couples_count`: Angka pameran pasangan yang terlayani
- **Aksi:** Klik baris untuk inline edit atau modal edit nilai teks/JSON.

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Utama:** `landing_settings`
  - Kolom: `id`, `key` (varchar UK), `value` (text/jsonb).

---

### Halaman 9.6: Kotak Masuk Pesan Kontak Form (`/admin/contact-messages`)
Menampung pertanyaan dari pengunjung umum yang mengisi formulir "Hubungi Kami" di landing page.

#### 1. Komponen UI Halaman
- **Tabel Kotak Masuk:**
  - Kolom: Waktu Kirim, Nama Pengirim, Email, No WhatsApp, Subjek Pesan, Status (`unread`, `read`, `replied`), Aksi.
- **Modal Baca Pesan:**
  - Tampilkan isi pesan lengkap.
  - Tombol *Balas via Email (mailto)* atau *Balas via WhatsApp*.
  - Ubah status otomatis menjadi `read`.

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Utama:** `contact_messages`
  - Kolom: `id`, `name`, `email`, `phone`, `subject`, `message`, `status`.

---

## MODUL 10: GATEWAY NOTIFIKASI & DELIVERY LOGS

### Halaman 10.1: Antrean & Log WhatsApp Fonnte (`/admin/notif-whatsapp`)
Audit pengiriman pesan WhatsApp otomatis (konfirmasi order, OTP, approval penarikan dana).

#### 1. Komponen UI Halaman
- **Tabel Log WhatsApp:**
  - Kolom: ID, Acara Terkait, Nomor Tujuan WA, Cuplikan Pesan, Status Pengiriman (`pending`, `sent`, `failed`), Waktu Dibuat, Aksi.
  - Aksi: Tombol *Lihat Callback Response Fonnte* (dari tabel `response_whatsapps`).

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Terkait:** `notif_whatsapps`, `response_whatsapps`
  - Relasi FK: `response_whatsapps.notif_whatsapp_id` $\rightarrow$ `notif_whatsapps.id`.

---

### Halaman 10.2: Antrean & Log Email Resend (`/admin/notif-email`)
Audit pengiriman email transaksi dan notifikasi via provider Resend/SMTP.

#### 1. Komponen UI Halaman
- **Tabel Log Email:**
  - Kolom: ID, Email Tujuan, Subjek Email, Status Delivery (`pending`, `sent`, `failed`), Waktu Kirim, Aksi.
  - Aksi: *Lihat Response Payload Resend* (dari tabel `response_emails`).

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Terkait:** `notif_emails`, `response_emails`
  - Relasi FK: `response_emails.notif_email_id` $\rightarrow$ `notif_emails.id`.

---

### Halaman 10.3: Antrean Notifikasi Gagal (Dead Letter Queue) (`/admin/dead-notifications`)
Menampung pesan WA atau email yang gagal terkirim setelah retry berulang kali untuk tindakan manual.

#### 1. Komponen UI Halaman
- **Header:** Judul "Antrean Gagal (Dead Letter Queue)", Total Pesan Gagal.
- **Tabel Dead Letter:**
  - Kolom: ID, Channel (WhatsApp / Email), Target Penerima, Alasan Error (`error_message`), Jumlah Percobaan (`retry_count`), Status (`dead`, `discarded`, `resolved`), Aksi.
  - Aksi:
    - Tombol *Coba Kirim Ulang Sekarang (Retry)*
    - Tombol *Abaikan & Buang (Discard)*

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Utama:** `dead_notifications`
  - Kolom: `id`, `channel`, `recipient`, `payload` (JSONB), `error_message`, `retry_count`, `status`.

---

## MODUL 11: KONFIGURASI SISTEM & GATEWAY KREDENSIAL

*(⚠️ SELURUH MODUL INI HANYA DAPAT DIAKSES OLEH ROLE `superadmin`)*

### Halaman 11.1: Identitas Situs & SEO Global (`/admin/settings/site`)
Pengaturan identitas brand, favicon, logo, dan meta tag mesin pencari.

#### 1. Komponen UI Halaman
- **Formulir Pengaturan Web (Singleton 1 Baris):**
  - Nama Website (`website_name` cth: "Momen Invite").
  - Tagline Situs / SEO Title (`title`).
  - Unggah Logo Utama & Favicon Icon ke R2 (`icon`, `logo`, `profile_pic`).
  - Deskripsi Website (`desc`).
  - Teks Pengumuman Navbar (`teks_navbar` cth: "Promo Diskon Kemerdekaan Aktif!").
  - SEO Meta Keywords (Tag Input builder disimpan ke JSONB).
  - Unggah Galeri Banner Hero Landing (`hero_img` JSONB).

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Utama:** `settings` (Singleton Baris ID = 1)
  - Kolom: `id`, `website_name`, `title`, `icon`, `logo`, `profile_pic`, `author`, `keywords` (JSONB), `desc`, `teks_navbar`, `hero_img` (JSONB).

---

### Halaman 11.2: Aturan Transaksi & Penomoran Invoice (`/admin/settings/transaction`)
Mengatur format penomoran invoice dan masa berlaku kadaluarsa pembayaran.

#### 1. Komponen UI Halaman
- **Formulir Transaksi (Singleton Baris ID = 1):**
  - Prefix Invoice (`trx_prefix_id` cth: "MOMEN" atau "INV").
  - Nomor Urut Awal Transaksi (`trx_start_id` cth: 1000).
  - Batas Waktu Kadaluarsa Invoice (`trx_expired` dalam menit, cth: 1440 menit = 24 jam).
  - Delay Pengiriman Notifikasi (`trx_delay` dalam menit).

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Utama:** `config_transaction` (Singleton Baris ID = 1)
  - Kolom: `id`, `trx_prefix_id`, `trx_start_id`, `trx_expired`, `trx_delay`.

---

### Halaman 11.3: Gateway WhatsApp Fonnte (`/admin/settings/whatsapp`)
Mengatur kredensial token Fonnte WhatsApp API langsung dari antarmuka web (tanpa perlu restart server `.env`).

#### 1. Komponen UI Halaman
- **Formulir / Tabel Konfigurasi Device WA:**
  - Nama Provider (`provider` cth: "Fonnte").
  - Label Device (`device_name` cth: "Device Notifikasi Utama").
  - Nomor Pengirim WhatsApp (`phone`).
  - Endpoint API URL (`url` cth: `https://api.fonnte.com/send`).
  - API Token Gateway (`token` dengan input type password / masking).
  - Status Saklar (`status`: 'aktif' / 'tidak').
  - Tombol *Uji Coba Kirim Pesan Tes (Test Ping)*.

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Utama:** `config_whatsapp`
  - Kolom: `id`, `provider`, `device_name`, `phone`, `url`, `token` (Tersimpan aman di DB), `status`, `event_category_ids`.

---

### Halaman 11.4: Gateway Email SMTP / Resend (`/admin/settings/smtp`)
Mengatur konfigurasi server pengiriman email sistem.

#### 1. Komponen UI Halaman
- **Formulir Konfigurasi Email:**
  - Nama Pengirim (`smtp_name` cth: "Momen Invite Notification").
  - Host Server (`smtp_host` cth: `smtp.resend.com`).
  - Port (`smtp_port` cth: 587 atau 465).
  - Username SMTP (`smtp_username`).
  - Password / API Key Resend (`smtp_password` dengan input type password).
  - Tombol *Kirim Email Uji Coba*.

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Utama:** `config_smtp`
  - Kolom: `id`, `smtp_name`, `smtp_host`, `smtp_port`, `smtp_username`, `smtp_password`.

---

### Halaman 11.5: Aturan Pop-up Dialog (`/admin/settings/popup`)
Aturan ukuran dan durasi modal pop-up iklan di sisi pengguna.

#### 1. Komponen UI Halaman
- **Formulir Aturan Modal (Singleton):**
  - Ukuran Dialog Popup (`size`: Dropdown Small / Medium / Large).
  - Tombol 'Sudah Dibaca' (`btn_is_read`: Toggle Aktif/Nonaktif).
  - Durasi Penutupan Otomatis (`duration_is_read`: Angka detik, cth: 10 detik).

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Utama:** `config_popup`
  - Kolom: `id`, `size`, `btn_is_read`, `duration_is_read`.

---

## MODUL 12: KEAMANAN SISTEM & AUDIT TRAIL

### Halaman 12.1: Audit Log Keamanan & Aktivitas (`/admin/activity-logs`)
*(Khusus Role `superadmin`)* — Rekam jejak seluruh aktivitas penting demi integritas forensik platform.

#### 1. Komponen UI Halaman
- **Header:** Judul "Audit Log Keamanan & Aktivitas Staf".
- **Toolbar:** Filter Aktor (Admin vs User), Filter Rentang Tanggal, Search deskripsi aktivitas / IP.
- **Tabel Audit Trail:**
  - Kolom: Waktu Eksekusi (`created_at`), Tipe Aktor (`actor_type`), Nama/Email Aktor (`actor_admin_id` atau `actor_user_id`), IP Address Pengakses, Deskripsi Aksi (`action` cth: *"Mengubah status tiket #12 menjadi resolved"*, *"Approve penarikan dana Rp 500.000 untuk host #4"*).

#### 2. Spesifikasi Database & Kolom Tabel
- **Tabel Utama:** `activity_logs`
  | Nama Kolom | Tipe Data | Keterangan di UI | Status Input Form |
  |---|---|---|---|
  | `id` | serial PK | ID Log | Read-Only |
  | `actor_type` | varchar | admin / user | Badge Identitas |
  | `actor_user_id` | int FK | Pengguna pelaku aksi (bila user) | Link ke profil user |
  | `actor_admin_id` | int FK | Staf pelaku aksi (bila admin) | Link ke profil staf admin |
  | `ip_address` | varchar | Alamat IP pengakses | Badge Monospace |
  | `action` | text | Catatan narasi perubahan data | Deskripsi lengkap |
  | `created_at` | timestamp | Waktu presisi tindakan | Timestamp |
- **Relasi Database (FK):**
  - `activity_logs.actor_user_id` $\rightarrow$ `users.id` (N:1, nullable)
  - `activity_logs.actor_admin_id` $\rightarrow$ `admins.id` (N:1, nullable)

---

## 15. MATRIKS VERIFIKASI 47 TABEL DATABASE

Tabel di bawah ini membuktikan bahwa **seluruh 47 tabel** dalam `docs/DATABASE-ERD.md` telah dipetakan secara tuntas ke dalam modul dan halaman antarmuka Superadmin:

| No | Nama Tabel Database | Domain ERD | Modul Superadmin | Halaman Tempat Data Dikelola |
|:---:|---|---|---|---|
| 1 | `roles` | Domain 1 (Auth) | Modul 2 | Halaman 2.3 (`/admin/roles`) |
| 2 | `users` | Domain 1 (Auth) | Modul 2 | Halaman 2.1 (`/admin/users`) |
| 3 | `user_refresh_tokens` | Domain 1 (Auth) | Modul 2 | Halaman 2.4 (`/admin/auth-sessions`) |
| 4 | `user_verification` | Domain 1 (Auth) | Modul 2 | Halaman 2.4 (`/admin/auth-sessions`) |
| 5 | `admins` | Domain 1 (Auth) | Modul 2 | Halaman 2.2 (`/admin/admins`) |
| 6 | `admin_sessions` | Domain 1 (Auth) | Modul 2 | Halaman 2.4 (`/admin/auth-sessions`) |
| 7 | `activity_logs` | Domain 1 (Auth) | Modul 12 | Halaman 12.1 (`/admin/activity-logs`) |
| 8 | `hosts` | Domain 2 (Host) | Modul 3 | Halaman 3.1 (`/admin/hosts`) |
| 9 | `event_categories` | Domain 3 (Katalog) | Modul 4 | Halaman 4.1 (`/admin/categories`) |
| 10 | `event_product` | Domain 3 (Katalog) | Modul 4 | Halaman 4.2 (`/admin/products`) |
| 11 | `event_assets` | Domain 3 (Katalog) | Modul 4 | Halaman 4.3 (`/admin/products/:id/assets`) |
| 12 | `event_orders` | Domain 4 (Orders) | Modul 5 | Halaman 5.1 & 5.2 (`/admin/event-orders`) |
| 13 | `data_wedding` | Domain 4 (Orders) | Modul 5 | Halaman 5.2 (Tab Pernikahan) |
| 14 | `data_birthday` | Domain 4 (Orders) | Modul 5 | Halaman 5.2 (Tab Ulang Tahun) |
| 15 | `data_birthday_greeting` | Domain 4 (Orders) | Modul 5 | Halaman 5.2 (Tab Ucapan Ultah) |
| 16 | `data_galeries` | Domain 4 (Orders) | Modul 5 | Halaman 5.2 (Tab Galeri Media R2) |
| 17 | `event_wishes` | Domain 4 (Orders) | Modul 5 | Halaman 5.2 (Tab Moderasi Doa Tamu) |
| 18 | `event_guests` | Domain 5 (Tamu) | Modul 6 | Halaman 6.1 (`/admin/guests`) |
| 19 | `event_registrations` | Domain 5 (Tamu) | Modul 6 | Halaman 6.2 (`/admin/registrations`) |
| 20 | `event_attendances` | Domain 5 (Tamu) | Modul 6 | Halaman 6.3 (`/admin/attendances`) |
| 21 | `invoices` | Domain 6 (Billing) | Modul 7 | Halaman 7.1 (`/admin/invoices`) |
| 22 | `payment_sessions` | Domain 6 (Billing) | Modul 7 | Halaman 7.2 (`/admin/payments`) |
| 23 | `payment_proofs` | Domain 6 (Billing) | Modul 7 | Halaman 7.2 (`/admin/payments`) |
| 24 | `invoice_gifts` | Domain 6 (Billing) | Modul 7 | Halaman 7.3 (`/admin/gift-invoices`) |
| 25 | `withdrawals` | Domain 6 (Billing) | Modul 7 | Halaman 7.4 (`/admin/withdrawals`) |
| 26 | `flash_sales` | Domain 6 (Billing) | Modul 4 | Halaman 4.4 (`/admin/flash-sales`) |
| 27 | `invoice_reviews` | Domain 7 (Review) | Modul 8 | Halaman 8.3 (`/admin/reviews`) |
| 28 | `tickets` | Domain 8 (Tiket) | Modul 8 | Halaman 8.1 (`/admin/tickets`) |
| 29 | `ticket_interactions` | Domain 8 (Tiket) | Modul 8 | Halaman 8.2 (`/admin/tickets/:id`) |
| 30 | `notif_whatsapps` | Domain 9 (Notif) | Modul 10 | Halaman 10.1 (`/admin/notif-whatsapp`) |
| 31 | `response_whatsapps` | Domain 9 (Notif) | Modul 10 | Halaman 10.1 (`/admin/notif-whatsapp`) |
| 32 | `notif_emails` | Domain 9 (Notif) | Modul 10 | Halaman 10.2 (`/admin/notif-email`) |
| 33 | `response_emails` | Domain 9 (Notif) | Modul 10 | Halaman 10.2 (`/admin/notif-email`) |
| 34 | `dead_notifications` | Domain 9 (Notif) | Modul 10 | Halaman 10.3 (`/admin/dead-notifications`) |
| 35 | `popups` | Domain 10 (CMS) | Modul 9 | Halaman 9.1 (`/admin/popups`) |
| 36 | `sosmed` | Domain 10 (CMS) | Modul 9 | Halaman 9.2 (`/admin/sosmed`) |
| 37 | `faq_categories` | Domain 10 (CMS) | Modul 9 | Halaman 9.3 (`/admin/faq`) |
| 38 | `faq` | Domain 10 (CMS) | Modul 9 | Halaman 9.3 (`/admin/faq`) |
| 39 | `pages_terms` | Domain 10 (CMS) | Modul 9 | Halaman 9.4 (`/admin/legal-pages`) |
| 40 | `pages_privacy` | Domain 10 (CMS) | Modul 9 | Halaman 9.4 (`/admin/legal-pages`) |
| 41 | `landing_settings` | Domain 10 (CMS) | Modul 9 | Halaman 9.5 (`/admin/landing-settings`) |
| 42 | `contact_messages` | Domain 10 (CMS) | Modul 9 | Halaman 9.6 (`/admin/contact-messages`) |
| 43 | `settings` | Domain 11 (Config)| Modul 11 | Halaman 11.1 (`/admin/settings/site`) |
| 44 | `config_transaction` | Domain 11 (Config)| Modul 11 | Halaman 11.2 (`/admin/settings/transaction`) |
| 45 | `config_whatsapp` | Domain 11 (Config)| Modul 11 | Halaman 11.3 (`/admin/settings/whatsapp`) |
| 46 | `config_smtp` | Domain 11 (Config)| Modul 11 | Halaman 11.4 (`/admin/settings/smtp`) |
| 47 | `config_popup` | Domain 11 (Config)| Modul 11 | Halaman 11.5 (`/admin/settings/popup`) |

---
**Selesai.** Dokumen ini siap digunakan sebagai acuan blueprint pengerjaan desain UI/UX di Figma maupun implementasi komponen frontend di aplikasi `frontend-superadmin`.
