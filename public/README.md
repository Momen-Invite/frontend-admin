# 📁 Public Assets — `frontend-admin`

Folder ini berisi seluruh **static asset** yang di-serve langsung oleh Next.js tanpa pemrosesan (tidak di-bundle webpack).

> **Konvensi penamaan:** `kebab-case`, huruf kecil semua.  
> Contoh: `logo-momeninvite.svg`, `icon-bell-32.png`

---

## 📂 Struktur Folder

```
public/
├── images/
│   ├── icons/          → Ikon UI statis (jika tidak memakai icon font/SVG inline)
│   ├── logos/          → Logo brand (momeninvite, partner, sponsor)
│   ├── avatars/        → Avatar/foto profil default & placeholder
│   ├── banners/        → Banner promo & header marketing
│   ├── templates/      → Thumbnail preview desain template undangan
│   ├── placeholders/   → Gambar fallback / skeleton (misal: no-image.svg)
│   └── backgrounds/    → Wallpaper & background pattern halaman
├── fonts/              → Font lokal (woff2) jika tidak memakai Google Fonts CDN
├── videos/             → Video pendek untuk hero / onboarding
└── documents/          → File PDF yang dapat diunduh (panduan, contoh undangan)
```

---

## 📌 Aturan Penggunaan

| Kategori        | Ukuran Maks | Format yang Dianjurkan |
|-----------------|-------------|------------------------|
| `icons/`        | 10 KB       | SVG / WebP             |
| `logos/`        | 50 KB       | SVG / WebP             |
| `avatars/`      | 100 KB      | WebP / JPEG            |
| `banners/`      | 300 KB      | WebP / JPEG            |
| `templates/`    | 200 KB      | WebP / JPEG            |
| `placeholders/` | 20 KB       | SVG / WebP             |
| `backgrounds/`  | 500 KB      | WebP / SVG             |
| `fonts/`        | 500 KB/file | woff2                  |
| `videos/`       | 5 MB        | mp4 (H.264)            |
| `documents/`    | 2 MB        | PDF                    |

---

## ⚠️ Catatan Penting

- **Jangan simpan gambar user-generated content di sini.** Semua upload dari Host & Admin disimpan di **Cloudflare R2** melalui pre-signed URL.
- File di folder ini **tidak dioptimasi otomatis** oleh Next.js Image Optimization. Gunakan komponen `<Image>` dari `next/image` untuk gambar yang memerlukan optimasi.
- Setiap subfolder memiliki file `.gitkeep` agar folder terlacak di Git saat masih kosong.
