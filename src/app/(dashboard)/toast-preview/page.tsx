"use client";

import { Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/button";
import PromiseToast from "@/components/ui/promise-toast";
import { toastManager, toast } from "@/components/ui/toast";
import { CircleCheckIcon, AlertCircleIcon, InfoIcon, AlertTriangleIcon } from "lucide-react";

export default function ToastPreviewPage() {
  return (
    <div className="flex flex-col gap-lg w-full pb-xl">
      <Topbar
        title="Toast Notification Preview"
        searchPlaceholder="Cari tipe toast..."
      />

      {/* Intro Banner */}
      <div className="bg-card rounded-2xl border border-surface-variant/40 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-on-background">
            Sistem Toast Universal (Tengah Layar)
          </h2>
          <p className="text-sm text-on-surface-variant mt-1 max-w-2xl">
            Toast dapat dipanggil dari komponen manapun menggunakan{" "}
            <code className="bg-surface-container px-2 py-0.5 rounded font-mono text-xs text-primary font-semibold">
              toastManager.promise()
            </code>{" "}
            atau shorthand{" "}
            <code className="bg-surface-container px-2 py-0.5 rounded font-mono text-xs text-primary font-semibold">
              toast.success()
            </code>
            . Notifikasi akan selalu muncul di tengah atas layar secara konsisten.
          </p>
        </div>
      </div>

      {/* Grid Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Promise Toast (Referenced Component) */}
        <div className="bg-card rounded-2xl border border-surface-variant/40 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <h3 className="font-bold text-base text-on-background">
                Promise Toast (Loading ➔ Sukses/Gagal)
              </h3>
            </div>
            <p className="text-xs text-on-surface-variant mt-1.5">
              Mensimulasikan request asynchronous selama 2 detik. Hasilnya memiliki peluang acak 70% sukses dan 30% gagal.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low flex flex-col items-center justify-center gap-3">
            <PromiseToast />
            <span className="text-[11px] text-on-surface-variant">
              Klik tombol di atas untuk melihat status loading dan perubahannya di tengah layar
            </span>
          </div>
        </div>

        {/* Card 2: One-Click Instant Toasts */}
        <div className="bg-card rounded-2xl border border-surface-variant/40 p-6 shadow-sm space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-success" />
              <h3 className="font-bold text-base text-on-background">
                Toast Instan Sesuai Tipe
              </h3>
            </div>
            <p className="text-xs text-on-surface-variant mt-1.5">
              Panggil langsung dengan notifikasi sukses, gagal, peringatan, atau info.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <Button
              variant="outline"
              onClick={() =>
                toastManager.success("Penarikan Disetujui!", {
                  description: "Dana Rp 2.500.000 telah berhasil diproses ke rekening BCA.",
                })
              }
              className="flex items-center gap-2 justify-start h-10 border-success/30 hover:bg-success/10 text-xs"
            >
              <CircleCheckIcon className="size-4 text-success shrink-0" />
              <span>Toast Sukses</span>
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                toastManager.error("Gagal Verifikasi", {
                  description: "Koneksi gateway pembayaran sedang mengalami gangguan teknis.",
                })
              }
              className="flex items-center gap-2 justify-start h-10 border-error/30 hover:bg-error/10 text-xs"
            >
              <AlertCircleIcon className="size-4 text-error shrink-0" />
              <span>Toast Error</span>
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                toastManager.warning("Peringatan Saldo Kas", {
                  description: "Saldo kas operasional tersisa di bawah batas aman minimum.",
                })
              }
              className="flex items-center gap-2 justify-start h-10 border-warning/30 hover:bg-warning/10 text-xs"
            >
              <AlertTriangleIcon className="size-4 text-warning shrink-0" />
              <span>Toast Peringatan</span>
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                toastManager.info("Pembaruan Sistem", {
                  description: "Maintenance server terjadwal akan dilakukan pukul 02:00 WIB.",
                })
              }
              className="flex items-center gap-2 justify-start h-10 border-info/30 hover:bg-info/10 text-xs"
            >
              <InfoIcon className="size-4 text-info shrink-0" />
              <span>Toast Info</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Static Visual Spec Preview (from demo.tsx) */}
      <div className="bg-card rounded-2xl border border-surface-variant/40 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-on-background">
          Desain Visual Toast Popover
        </h3>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-4 bg-surface-container-low rounded-xl">
          <div className="w-full max-w-sm select-none rounded-xl border border-surface-variant/40 bg-surface-container-lowest text-on-surface shadow-overlay p-3.5">
            <div className="flex items-center gap-2.5 text-sm">
              <div className="shrink-0">
                <CircleCheckIcon className="size-4 text-success" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-sm text-on-background">
                  This is a success toast!
                </span>
                <span className="text-xs text-on-surface-variant">
                  Success: Data loaded successfully
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
