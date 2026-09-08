import { toastManager, toast } from "@/components/ui/toast";

// 1. Menggunakan Promise (Async Action / API Request):
toastManager.promise(
  simpanData(),
  {
    loading: { title: "Menyimpan Perubahan...", description: "Mohon tunggu sebentar" },
    success: (data) => ({ title: "Berhasil Disimpan!", description: "Data acara telah diperbarui." }),
    error: (err) => ({ title: "Gagal Menyimpan", description: "Periksa kembali koneksi internet Anda." }),
  }
);

// 2. Notifikasi Instan Cepat:
toast.success("Penarikan dana disetujui!");
toast.error("Gagal memverifikasi dokumen");
toast.warning("Saldo kas operasional menipis");
toast.info("Ada 3 pesanan baru yang masuk");
