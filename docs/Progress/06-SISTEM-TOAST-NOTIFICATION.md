# 06 — Sistem Toast Notification Universal & Centered

**Tanggal:** 8 September 2026  
**Status:** ✅ Selesai  
**Dikerjakan oleh:** Antigravity AI  
**Terkait:** Global Toast Manager, Promise Toast, ToastProvider, & Centered Screen Positioning

---

## 🎯 Tujuan

Membangun sistem notifikasi **Toast Universal** yang dapat dipanggil kapan saja dan dari mana saja di seluruh aplikasi dashboard:
1. Mendukung **Promise Toast** (`toastManager.promise`) dengan transisi halus dari status *Loading*, *Success*, hingga *Error*.
2. Posisi toast muncul di **tengah atas layar** (*center screen*) sesuai permintaan user (`position="top-center"`).
3. Mendukung shorthand pemanggilan instan: `toast.success()`, `toast.error()`, `toast.info()`, `toast.warning()`.
4. Visual toast dirancang dengan glassmorphism modern, bayangan popover, dan ikon lucide-react yang proporsional.

---

## 🛠️ Komponen & Perubahan Yang Dilakukan

### 1. File Utama (`src/components/ui/toast.tsx`)
- **`toastManager`**:
  - `toastManager.promise(promise, options)`: Menerima promise async dan memetakan status loading, success, atau error dengan pesan title dan description kustom.
  - `toastManager.success(title, options)`
  - `toastManager.error(title, options)`
  - `toastManager.info(title, options)`
  - `toastManager.warning(title, options)`
  - `toastManager.loading(title, options)`
  - `toastManager.dismiss(id)`
- **`toast`**: Export callable langsung (`toast("Pesan")` atau `toast.success("Berhasil!")`).
- **`ToastProvider`**: Wrapper provider yang mengonfigurasi toaster agar selalu berada di posisi tengah (`top-center`) dengan tema Material Design 3.

---

### 2. Komponen Referensi (`src/components/ui/promise-toast.tsx`)
Komponen `Particle` sesuai kode referensi yang diberikan:
```tsx
import { Button } from "@/components/ui/button";
import { toastManager } from "@/components/ui/toast";

export default function Particle() {
  return (
    <Button
      onClick={() => {
        toastManager.promise(
          new Promise<string>((resolve, reject) => {
            const shouldSucceed = Math.random() > 0.3;
            setTimeout(() => {
              if (shouldSucceed) {
                resolve("Data loaded successfully");
              } else {
                reject(new Error("Failed to load data"));
              }
            }, 2000);
          }),
          {
            error: () => ({
              description: "Please try again.",
              title: "Something went wrong",
            }),
            loading: {
              description: "The promise is loading.",
              title: "Loading…",
            },
            success: (data: string) => ({
              description: `Success: ${data}`,
              title: "This is a success toast!",
            }),
          },
        );
      }}
      variant="outline"
    >
      Run Promise
    </Button>
  );
}
```

---

### 3. Integrasi Global (`src/app/providers.tsx`)
Di `Providers`, Toaster lama diganti dengan `ToastProvider` terpusat:
```tsx
<QueryClientProvider client={queryClient}>
  <ToastProvider>
    {children}
  </ToastProvider>
</QueryClientProvider>
```

---

### 4. Halaman Pratinjau Interaktif (`/toast-preview`)
Dibuat di `src/app/(dashboard)/toast-preview/page.tsx`:
- Tombol uji coba **Promise Toast** (Loading 2 detik ➔ Berhasil/Gagal)
- Tombol cepat untuk menguji **Toast Sukses, Error, Warning, dan Info**
- Mockup visual card toast

---

## 📖 Cara Penggunaan di Komponen Lain

### Contoh 1: Menyimpan Form atau Penarikan Dana
```tsx
import { toastManager } from "@/components/ui/toast";

async function handleWithdraw() {
  await toastManager.promise(apiWithdraw(amount), {
    loading: { title: "Memproses Penarikan...", description: "Mohon tunggu sebentar" },
    success: (res) => ({
      title: "Penarikan Diajukan!",
      description: `Penarikan sebesar Rp ${res.amount} sedang diverifikasi admin.`,
    }),
    error: (err) => ({
      title: "Gagal Mengajukan Penarikan",
      description: err.message || "Silakan coba beberapa saat lagi.",
    }),
  });
}
```

### Contoh 2: Notifikasi Singkat Instan
```tsx
import { toast } from "@/components/ui/toast";

toast.success("Link undangan berhasil disalin!");
toast.error("Format rekening bank tidak valid");
```
