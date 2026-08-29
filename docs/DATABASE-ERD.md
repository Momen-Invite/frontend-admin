# Database Schema — Momen Invite (v3)

Konsolidasi dari seluruh restrukturisasi setelah v2. Tipe kolom mengikuti konvensi Drizzle ORM.

## Tabel yang resmi mati sejak v2

`pricing_plans`, `addons`, `invitation_addons`, `templates` (→ `event_product`), `invitations` (→ `event_orders`), `guests` lama, `rsvp_entries`, `guestbook_entries` (→ `event_wishes`), `love_story_items` (dilebur jadi kolom `timeline_items` di `data_wedding`), `template_reviews` (→ `invoice_reviews`), `gift_transactions` (→ `invoice_gifts`), `email_verifications` (→ `user_verification`), `user_sessions` lama (→ `admin_sessions`), `orders`/`transactions` lama.

## ⚠️ Masih terbuka / butuh Anda lengkapi

- `data_birthday` — kolomnya baru asumsi minim (belum ada referensi field lengkap dari Anda seperti `data_birthday_greeting`).
- `data_wedding.timeline_items` — saya tambahkan sendiri (bukan permintaan eksplisit Anda) untuk konsisten dengan pola `data_birthday_greeting.timeline_items`, menggantikan `love_story_items`. Koreksi kalau Anda maunya tetap tabel relasional terpisah.
- `event_registrations.ticket_type` — sengaja saya biarkan varchar bebas, bukan ENUM, karena nilainya ("Free Pass", "VIP Pass") bisa beda-beda tiap event/host, tidak bisa dipatok satu set nilai global.

---

## DOMAIN 1: Identitas & Autentikasi

### `roles`

| Kolom                   | Tipe           | Deskripsi                                    |
| ----------------------- | -------------- | -------------------------------------------- |
| id                      | serial PK      |                                              |
| name                    | varchar UK     | host / guest_registered / admin / superadmin |
| description             | text, nullable |                                              |
| created_at / updated_at | timestamp      |                                              |

### `users`

| Kolom                                | Tipe                 | Deskripsi                   |
| ------------------------------------ | -------------------- | --------------------------- |
| id                                   | serial PK            |                             |
| email                                | text UK              |                             |
| phone                                | varchar UK, nullable |                             |
| password_hash                        | text                 |                             |
| name                                 | text                 |                             |
| address                              | text, nullable       |                             |
| role_id                              | FK → roles.id        |                             |
| status                               | varchar              | active / banned / suspended |
| is_verified                          | boolean              |                             |
| created_at / updated_at / deleted_at | timestamp            |                             |

### `user_refresh_tokens`

| Kolom       | Tipe                | Deskripsi |
| ----------- | ------------------- | --------- |
| id          | serial PK           |           |
| user_id     | FK → users.id       |           |
| token_hash  | text                |           |
| device_info | text, nullable      |           |
| expires_at  | timestamp           |           |
| revoked_at  | timestamp, nullable |           |
| created_at  | timestamp           |           |

### `user_verification`

| Kolom      | Tipe                    | Deskripsi                                                 |
| ---------- | ----------------------- | --------------------------------------------------------- |
| id         | serial PK               |                                                           |
| user_id    | FK → users.id, nullable | Kosong kalau verifikasi terjadi sebelum akun resmi dibuat |
| target     | varchar                 | Isi email atau nomor HP                                   |
| channel    | varchar                 | email / whatsapp                                          |
| code       | varchar                 |                                                           |
| purpose    | varchar                 | register / reset_password / change_phone                  |
| expires_at | timestamp               |                                                           |
| used_at    | timestamp, nullable     |                                                           |
| created_at | timestamp               |                                                           |

### `admins`

Tanpa FK ke `users` — isolasi fisik total.

| Kolom                                | Tipe                | Deskripsi          |
| ------------------------------------ | ------------------- | ------------------ |
| id                                   | serial PK           |                    |
| email                                | text UK             |                    |
| password_hash                        | text                |                    |
| name                                 | text                |                    |
| role_id                              | FK → roles.id       | admin / superadmin |
| phone                                | varchar             |                    |
| address                              | text                |                    |
| status                               | varchar             |                    |
| failed_attempts                      | int                 |                    |
| locked_until                         | timestamp, nullable |                    |
| created_at / updated_at / deleted_at | timestamp           |                    |

### `admin_sessions`

| Kolom  | Tipe       | Deskripsi |
| ------ | ---------- | --------- |
| sid    | varchar PK |           |
| sess   | json       |           |
| expire | timestamp  |           |

### `activity_logs`

| Kolom                                | Tipe                     | Deskripsi                                  |
| ------------------------------------ | ------------------------ | ------------------------------------------ |
| id                                   | serial PK                |                                            |
| actor_user_id                        | FK → users.id, nullable  |                                            |
| actor_admin_id                       | FK → admins.id, nullable | Tepat satu dari dua kolom aktor ini terisi |
| actor_type                           | varchar                  |                                            |
| ip_address                           | varchar                  |                                            |
| action                               | text                     |                                            |
| created_at / updated_at / deleted_at | timestamp                |                                            |

---

## DOMAIN 2: Host

### `hosts`

| Kolom                                | Tipe             | Deskripsi |
| ------------------------------------ | ---------------- | --------- |
| id                                   | serial PK        |           |
| user_id                              | FK UK → users.id |           |
| balance                              | decimal          |           |
| allow_notif_wa                       | boolean          |           |
| created_at / updated_at / deleted_at | timestamp        |           |

---

## DOMAIN 3: Katalog Acara

### `event_categories`

| Kolom                                | Tipe       | Deskripsi                                            |
| ------------------------------------ | ---------- | ---------------------------------------------------- |
| id                                   | serial PK  |                                                      |
| slug                                 | varchar UK | wedding, birthday, birthday_greeting, gathering, dst |
| name                                 | varchar    |                                                      |
| requires_rsvp                        | boolean    |                                                      |
| is_active                            | boolean    |                                                      |
| created_at / updated_at / deleted_at | timestamp  |                                                      |

### `event_product`

| Kolom                                | Tipe                     | Deskripsi                                                    |
| ------------------------------------ | ------------------------ | ------------------------------------------------------------ |
| id                                   | serial PK                |                                                              |
| event_category_id                    | FK → event_categories.id |                                                              |
| name                                 | text                     |                                                              |
| slug                                 | varchar UK               | wedding1, birthday_greeting1, dst                            |
| description                          | text                     |                                                              |
| badge                                | varchar                  |                                                              |
| theme_slug                           | varchar                  |                                                              |
| sections_config                      | jsonb                    |                                                              |
| theme_config                         | jsonb                    | Microcopy & style default tema (label tombol, badge section) |
| price                                | int                      | Harga langsung per produk (a-la-carte)                       |
| is_published                         | boolean                  |                                                              |
| created_at / updated_at / deleted_at | timestamp                |                                                              |

### `event_assets`

| Kolom            | Tipe                  | Deskripsi                                           |
| ---------------- | --------------------- | --------------------------------------------------- |
| id               | serial PK             |                                                     |
| event_product_id | FK → event_product.id |                                                     |
| type             | varchar               | image / video / audio                               |
| url              | text                  |                                                     |
| slot             | varchar, nullable     | thumbnail, hero_photo, default_music, final_bg, dst |
| sort_order       | int                   |                                                     |
| created_at       | timestamp             |                                                     |

---

## DOMAIN 4: Event Orders & Konten Acara

### `event_orders`

| Kolom                                | Tipe                    | Deskripsi                                                           |
| ------------------------------------ | ----------------------- | ------------------------------------------------------------------- |
| id                                   | serial PK               |                                                                     |
| slug                                 | varchar UK              |                                                                     |
| host_id                              | FK → hosts.id           |                                                                     |
| event_product_id                     | FK → event_product.id   |                                                                     |
| venue_name                           | text, nullable          | Generik lintas kategori                                             |
| venue_address                        | text, nullable          |                                                                     |
| event_date                           | date, nullable, indexed | Generik — basis cron auto-`completed`                               |
| requires_login                       | boolean                 |                                                                     |
| status                               | varchar                 | pending_payment / success / failed / expired / completed / archived |
| is_published                         | boolean                 | Toggle host, hanya bisa true setelah status = success               |
| section_config                       | jsonb                   |                                                                     |
| completed_at                         | timestamp, nullable     |                                                                     |
| created_at / updated_at / deleted_at | timestamp               |                                                                     |

### `data_wedding`

| Kolom                                | Tipe                     | Deskripsi                                       |
| ------------------------------------ | ------------------------ | ----------------------------------------------- |
| event_order_id                       | PK, FK → event_orders.id | Shared primary key, 1:1                         |
| groom_name                           | text                     |                                                 |
| bride_name                           | text                     |                                                 |
| groom_parents                        | text                     |                                                 |
| bride_parents                        | text                     |                                                 |
| akad_date                            | date                     |                                                 |
| akad_time                            | text                     |                                                 |
| reception_date                       | date                     |                                                 |
| reception_time                       | text                     |                                                 |
| maps_url                             | text                     |                                                 |
| opening_quote                        | text                     |                                                 |
| additional_notes                     | text                     |                                                 |
| timeline_items                       | jsonb                    | Linimasa momen — gantikan `love_story_items` ⚠️ |
| created_at / updated_at / deleted_at | timestamp                |                                                 |

### `data_birthday` ⚠️ belum lengkap

| Kolom                                | Tipe                     | Deskripsi |
| ------------------------------------ | ------------------------ | --------- |
| event_order_id                       | PK, FK → event_orders.id |           |
| celebrant_name                       | text                     |           |
| celebrant_age                        | int                      |           |
| dress_code                           | text, nullable           |           |
| additional_notes                     | text                     |           |
| created_at / updated_at / deleted_at | timestamp                |           |

### `data_birthday_greeting`

| Kolom                                | Tipe                     | Deskripsi |
| ------------------------------------ | ------------------------ | --------- |
| event_order_id                       | PK, FK → event_orders.id |           |
| celebrant_name                       | text                     |           |
| celebrant_age                        | int                      |           |
| hero_description                     | text                     |           |
| letter_title                         | text                     |           |
| letter_salutation                    | text                     |           |
| letter_sender_name                   | text                     |           |
| letter_paragraphs                    | jsonb                    |           |
| timeline_items                       | jsonb                    |           |
| wish_cards                           | jsonb                    |           |
| quotes_items                         | jsonb                    |           |
| created_at / updated_at / deleted_at | timestamp                |           |

### `data_galeries`

| Kolom                                | Tipe                 | Deskripsi                                                       |
| ------------------------------------ | -------------------- | --------------------------------------------------------------- |
| id                                   | serial PK            |                                                                 |
| event_order_id                       | FK → event_orders.id | Per-instance, bukan per-produk                                  |
| type                                 | varchar              | image / video / audio                                           |
| slot                                 | varchar, nullable    | cover_photo, backsound, video_teaser, gallery, love_story_photo |
| category                             | varchar, nullable    | Filter galeri publik — relevan kalau slot = gallery             |
| caption                              | text, nullable       |                                                                 |
| sort_order                           | int                  |                                                                 |
| created_at / updated_at / deleted_at | timestamp            |                                                                 |

### `event_wishes`

| Kolom                   | Tipe                    | Deskripsi |
| ----------------------- | ----------------------- | --------- |
| id                      | serial PK               |           |
| event_order_id          | FK → event_orders.id    |           |
| user_id                 | FK → users.id, nullable |           |
| guest_name              | text                    |           |
| message                 | text                    |           |
| is_published            | boolean                 |           |
| created_at / deleted_at | timestamp               |           |

---

## DOMAIN 5: Tamu, Registrasi & Presensi

### `event_guests`

Tamu privat, tanpa login — wedding/ultah/khitanan/VIP dinner.

| Kolom                                | Tipe                 | Deskripsi                              |
| ------------------------------------ | -------------------- | -------------------------------------- |
| id                                   | serial PK            |                                        |
| event_order_id                       | FK → event_orders.id |                                        |
| guest_code                           | varchar UK           |                                        |
| name                                 | varchar              |                                        |
| phone                                | varchar              |                                        |
| email                                | varchar, nullable    |                                        |
| category                             | varchar              | VIP/VVIP/Keluarga/Teman Kantor         |
| group_session                        | varchar              |                                        |
| table_number                         | varchar              |                                        |
| address_or_institution               | text                 |                                        |
| max_guests                           | int, default 1       |                                        |
| rsvp_status                          | varchar (ENUM)       | pending/attending/declined/tentative   |
| rsvp_pax                             | int, default 0       |                                        |
| rsvp_wishes                          | text                 | Privat — cuma dari tamu di daftar host |
| rsvp_at                              | timestamp, nullable  |                                        |
| invitation_sent_at                   | timestamp, nullable  |                                        |
| invitation_opened_at                 | timestamp, nullable  |                                        |
| created_at / updated_at / deleted_at | timestamp            |                                        |

### `event_registrations`

Peserta acara publik/berbayar — wajib login.

| Kolom                                | Tipe                 | Deskripsi                                    |
| ------------------------------------ | -------------------- | -------------------------------------------- |
| id                                   | serial PK            |                                              |
| event_order_id                       | FK → event_orders.id |                                              |
| user_id                              | FK → users.id        |                                              |
| ticket_code                          | varchar UK           |                                              |
| ticket_type                          | varchar              | Bebas per-event, bukan ENUM ⚠️               |
| status                               | varchar (ENUM)       | confirmed/pending_payment/cancelled/waitlist |
| pax_count                            | int, default 1       |                                              |
| form_responses                       | jsonb                |                                              |
| registered_at                        | timestamp            |                                              |
| created_at / updated_at / deleted_at | timestamp            |                                              |

_Relasi pembayaran: lewat `payment_sessions.registration_id`, bukan FK langsung di tabel ini._

### `event_attendances`

Log presensi fisik hari-H — terpisah dari niat (guest/registration).

| Kolom                   | Tipe                                  | Deskripsi                                                                              |
| ----------------------- | ------------------------------------- | -------------------------------------------------------------------------------------- |
| id                      | serial PK                             |                                                                                        |
| event_order_id          | FK → event_orders.id                  |                                                                                        |
| attendee_type           | varchar (ENUM)                        | guest / registered_user / walk_in                                                      |
| guest_id                | FK → event_guests.id, nullable        |                                                                                        |
| registration_id         | FK → event_registrations.id, nullable |                                                                                        |
| user_id                 | FK → users.id, nullable               |                                                                                        |
| attendee_name           | varchar                               | Snapshot, biar laporan absensi cepat di-query                                          |
| qr_code_scanned         | varchar                               |                                                                                        |
| actual_pax              | int, default 1                        |                                                                                        |
| session_name            | varchar                               | Akad, Resepsi, Day 1, dst                                                              |
| checkin_method          | varchar (ENUM)                        | qr_scan/manual_search/nfc/walk_in                                                      |
| checked_in_by_label     | varchar, nullable                     | Teks bebas ("Panitia Pintu Barat") — bukan FK, tidak ada akun staf event di sistem ini |
| souvenir_status         | boolean, default false                |                                                                                        |
| gate_or_desk            | varchar                               |                                                                                        |
| notes                   | text                                  |                                                                                        |
| checked_in_at           | timestamp                             |                                                                                        |
| created_at / deleted_at | timestamp                             |                                                                                        |

---

## DOMAIN 6: Billing & Pembayaran

### `invoices`

| Kolom                                | Tipe                 | Deskripsi                      |
| ------------------------------------ | -------------------- | ------------------------------ |
| id                                   | serial PK            |                                |
| event_order_id                       | FK → event_orders.id |                                |
| invoice_number                       | varchar UK           |                                |
| event_product_name_snapshot          | text                 |                                |
| subtotal                             | int                  |                                |
| tax                                  | int                  |                                |
| total                                | int                  |                                |
| due_date                             | timestamp            |                                |
| status                               | varchar              | PENDING/SUCCESS/FAILED/EXPIRED |
| paid_at                              | timestamp, nullable  |                                |
| created_at / updated_at / deleted_at | timestamp            |                                |

### `payment_sessions`

| Kolom             | Tipe                                  | Deskripsi                             |
| ----------------- | ------------------------------------- | ------------------------------------- |
| id                | serial PK                             |                                       |
| invoice_id        | FK → invoices.id, nullable            |                                       |
| gift_invoice_id   | FK → invoice_gifts.id, nullable       |                                       |
| registration_id   | FK → event_registrations.id, nullable | Tepat satu dari tiga kolom ini terisi |
| payment_reference | varchar UK                            |                                       |
| payment_method    | varchar                               | QRIS/VA/E-Wallet                      |
| instruction_data  | jsonb                                 |                                       |
| expires_at        | timestamp                             |                                       |
| status            | varchar                               | active/expired/superseded             |
| created_at        | timestamp                             |                                       |

### `payment_proofs`

| Kolom                | Tipe                     | Deskripsi |
| -------------------- | ------------------------ | --------- |
| id                   | serial PK                |           |
| payment_session_id   | FK → payment_sessions.id |           |
| gateway_raw_response | jsonb                    |           |
| is_valid_signature   | boolean                  |           |
| received_at          | timestamp                |           |
| created_at           | timestamp                |           |

### `invoice_gifts`

| Kolom                   | Tipe                 | Deskripsi                                                    |
| ----------------------- | -------------------- | ------------------------------------------------------------ |
| id                      | serial PK            |                                                              |
| host_id                 | FK → hosts.id        | Penerima                                                     |
| event_order_id          | FK → event_orders.id |                                                              |
| sender                  | jsonb                | {name, message, source: rsvp/guestbook/anonymous, source_id} |
| amount                  | decimal              |                                                              |
| status                  | varchar              |                                                              |
| paid_at                 | timestamp, nullable  |                                                              |
| created_at / deleted_at | timestamp            |                                                              |

### `withdrawals`

| Kolom                   | Tipe                     | Deskripsi                 |
| ----------------------- | ------------------------ | ------------------------- |
| id                      | serial PK                |                           |
| host_id                 | FK → hosts.id            |                           |
| amount                  | decimal                  |                           |
| bank_name               | varchar                  | Snapshot                  |
| account_number          | varchar                  | Snapshot                  |
| account_name            | varchar                  | Snapshot                  |
| status                  | varchar                  | PENDING/APPROVED/REJECTED |
| processed_at            | timestamp, nullable      |                           |
| processed_by_admin_id   | FK → admins.id, nullable |                           |
| processed_by_admin_name | text                     | Snapshot                  |
| reject_reason           | text, nullable           |                           |
| created_at / deleted_at | timestamp                |                           |

### `flash_sales`

| Kolom                                | Tipe                  | Deskripsi              |
| ------------------------------------ | --------------------- | ---------------------- |
| id                                   | serial PK             |                        |
| event_product_id                     | FK → event_product.id |                        |
| promo_price                          | int                   |                        |
| label                                | varchar               |                        |
| starts_at                            | timestamp             |                        |
| ends_at                              | timestamp             |                        |
| status                               | varchar               | scheduled/active/ended |
| created_at / updated_at / deleted_at | timestamp             |                        |

---

## DOMAIN 7: Review

### `invoice_reviews`

| Kolom                                | Tipe                     | Deskripsi                         |
| ------------------------------------ | ------------------------ | --------------------------------- |
| id                                   | serial PK                |                                   |
| user_id                              | FK → users.id            |                                   |
| event_order_id                       | FK → event_orders.id     |                                   |
| event_category_id                    | FK → event_categories.id | Denormalized, disalin saat insert |
| event_product_id                     | FK → event_product.id    | Denormalized                      |
| rating                               | int                      |                                   |
| message                              | text                     |                                   |
| is_published                         | boolean                  |                                   |
| created_at / updated_at / deleted_at | timestamp                |                                   |

---

## DOMAIN 8: Dukungan / Ticket

### `tickets`

| Kolom                                | Tipe                           | Deskripsi                        |
| ------------------------------------ | ------------------------------ | -------------------------------- |
| id                                   | serial PK                      |                                  |
| host_id                              | FK → hosts.id                  |                                  |
| event_order_id                       | FK → event_orders.id, nullable |                                  |
| issue_type                           | varchar (ENUM)                 | billing/technical/design/other   |
| title                                | text                           |                                  |
| description                          | text                           |                                  |
| priority                             | varchar (ENUM)                 | low/medium/high/urgent           |
| status                               | varchar (ENUM)                 | open/in_progress/resolved/closed |
| assigned_admin_id                    | FK → admins.id, nullable       |                                  |
| resolved_at                          | timestamp, nullable            |                                  |
| created_at / updated_at / deleted_at | timestamp                      |                                  |

### `ticket_interactions`

| Kolom           | Tipe                     | Deskripsi                               |
| --------------- | ------------------------ | --------------------------------------- |
| id              | serial PK                |                                         |
| ticket_id       | FK → tickets.id          |                                         |
| sender_host_id  | FK → hosts.id, nullable  |                                         |
| sender_admin_id | FK → admins.id, nullable | Tepat satu dari dua kolom sender terisi |
| message         | text                     |                                         |
| file            | jsonb, nullable          |                                         |
| created_at      | timestamp                |                                         |

---

## DOMAIN 9: Notifikasi (tidak berubah)

`notif_whatsapps`, `response_whatsapps`, `notif_emails`, `response_emails`, `dead_notifications`.

## DOMAIN 10: CMS & Marketing (tidak berubah)

`popups`, `sosmed` (tanpa `locate`), `faq_categories`, `faq`, `pages_terms`, `pages_privacy`, `landing_settings`, `contact_messages`.

## DOMAIN 11: Konfigurasi Sistem

`settings` (gabungan `config_website`+`preference`), `config_transaction`, `config_whatsapp`, `config_smtp`, `config_popup`.
