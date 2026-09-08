"use client";

import { useState } from "react";
import { SiteSettings, TransactionSettings, GatewaySettings } from "@/types/superadmin";
import {
  MOCK_SITE_SETTINGS,
  MOCK_TRANSACTION_SETTINGS,
  MOCK_GATEWAY_SETTINGS,
} from "@/lib/mock-superadmin-data";
import { toastManager } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState<"site" | "trx" | "gateways">("site");

  const [site, setSite] = useState<SiteSettings>(MOCK_SITE_SETTINGS);
  const [trx, setTrx] = useState<TransactionSettings>(MOCK_TRANSACTION_SETTINGS);
  const [gateway, setGateway] = useState<GatewaySettings>(MOCK_GATEWAY_SETTINGS);

  const handleSaveSite = (e: React.FormEvent) => {
    e.preventDefault();
    toastManager.success("Pengaturan identitas situs dan SEO global berhasil disimpan.");
  };

  const handleSaveTrx = (e: React.FormEvent) => {
    e.preventDefault();
    toastManager.success("Konfigurasi penomoran transaksi dan waktu expired diperbarui.");
  };

  const handleSaveGateway = (e: React.FormEvent) => {
    e.preventDefault();
    toastManager.success("Kredensial gateway Fonnte WhatsApp dan SMTP berhasil diperbarui.");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-background">
              Konfigurasi Sistem & Gateway
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              Khusus Superadmin
            </span>
          </div>
          <p className="text-sm text-on-surface-variant mt-1">
            Pengaturan variabel lingkungan, penomoran faktur otomatis, dan kredensial gateway notifikasi.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="inline-flex rounded-2xl bg-surface-container-low p-1.5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("site")}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              activeTab === "site"
                ? "bg-surface-container-lowest text-primary font-bold shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Identitas & SEO
          </button>

          <button
            onClick={() => setActiveTab("trx")}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              activeTab === "trx"
                ? "bg-surface-container-lowest text-primary font-bold shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Aturan Transaksi
          </button>

          <button
            onClick={() => setActiveTab("gateways")}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              activeTab === "gateways"
                ? "bg-surface-container-lowest text-primary font-bold shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Gateway WhatsApp & Email
          </button>
        </div>
      </div>

      {/* Tab 1: Identitas Situs */}
      {activeTab === "site" && (
        <form onSubmit={handleSaveSite} className="max-w-2xl space-y-4">
          <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-bold text-on-surface">Metadata Global Situs</h2>

            <div className="space-y-3 pt-1">
              <div>
                <Label className="text-xs font-semibold">Nama Aplikasi / Brand</Label>
                <Input
                  value={site.websiteName}
                  onChange={(e) => setSite({ ...site, websiteName: e.target.value })}
                  className="mt-1 rounded-xl"
                  required
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">Meta Title Halaman Utama</Label>
                <Input
                  value={site.title}
                  onChange={(e) => setSite({ ...site, title: e.target.value })}
                  className="mt-1 rounded-xl"
                  required
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">Meta Description (SEO)</Label>
                <textarea
                  value={site.desc}
                  onChange={(e) => setSite({ ...site, desc: e.target.value })}
                  rows={3}
                  className="mt-1 w-full p-3 rounded-xl bg-surface-container-low text-xs border-0 focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">Teks Promo Pengumuman Navbar</Label>
                <Input
                  value={site.teksNavbar}
                  onChange={(e) => setSite({ ...site, teksNavbar: e.target.value })}
                  className="mt-1 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" className="rounded-xl bg-primary text-on-primary">
                Simpan Konfigurasi Situs
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Aturan Transaksi */}
      {activeTab === "trx" && (
        <form onSubmit={handleSaveTrx} className="max-w-2xl space-y-4">
          <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-bold text-on-surface">Parameter Transaksi & Faktur</h2>
            <p className="text-xs text-on-surface-variant">
              Format penomoran invoice pembayaran otomatis dan masa tenggang expired gateway.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <Label className="text-xs font-semibold">Prefix Nomor Invoice</Label>
                <Input
                  value={trx.trxPrefixId}
                  onChange={(e) => setTrx({ ...trx, trxPrefixId: e.target.value })}
                  className="mt-1 rounded-xl font-mono"
                  required
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">Nomor Awal Counter (Start ID)</Label>
                <Input
                  type="number"
                  value={trx.trxStartId}
                  onChange={(e) => setTrx({ ...trx, trxStartId: Number(e.target.value) })}
                  className="mt-1 rounded-xl font-mono"
                  required
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">Waktu Expired Tagihan (Menit)</Label>
                <Input
                  type="number"
                  value={trx.trxExpiredMinutes}
                  onChange={(e) => setTrx({ ...trx, trxExpiredMinutes: Number(e.target.value) })}
                  className="mt-1 rounded-xl"
                  required
                />
                <span className="text-[11px] text-on-surface-variant mt-0.5 block">
                  1440 menit = 24 Jam
                </span>
              </div>

              <div>
                <Label className="text-xs font-semibold">Jeda Delay Antrean Webhook (Menit)</Label>
                <Input
                  type="number"
                  value={trx.trxDelayMinutes}
                  onChange={(e) => setTrx({ ...trx, trxDelayMinutes: Number(e.target.value) })}
                  className="mt-1 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" className="rounded-xl bg-primary text-on-primary">
                Simpan Aturan Transaksi
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 3: Gateway WhatsApp & Email */}
      {activeTab === "gateways" && (
        <form onSubmit={handleSaveGateway} className="max-w-2xl space-y-4">
          <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-bold text-on-surface">Kredensial Fonnte WhatsApp API</h2>

            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold">Nomor WhatsApp Gateway</Label>
                  <Input
                    value={gateway.waPhone}
                    onChange={(e) => setGateway({ ...gateway, waPhone: e.target.value })}
                    className="mt-1 rounded-xl font-mono text-xs"
                    required
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold">Status Perangkat</Label>
                  <div className="mt-1 h-10 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Terhubung (Aktif)
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold">API Endpoint URL</Label>
                <Input
                  value={gateway.waApiUrl}
                  onChange={(e) => setGateway({ ...gateway, waApiUrl: e.target.value })}
                  className="mt-1 rounded-xl font-mono text-xs"
                  required
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">Token Kredensial (Masked)</Label>
                <Input
                  value={gateway.waTokenMasked}
                  onChange={(e) => setGateway({ ...gateway, waTokenMasked: e.target.value })}
                  className="mt-1 rounded-xl font-mono text-xs"
                  required
                />
              </div>
            </div>

            <h2 className="text-base font-bold text-on-surface pt-4 border-t border-outline-variant/20">
              Kredensial Email SMTP (Resend)
            </h2>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <Label className="text-xs font-semibold">SMTP Host Server</Label>
                <Input
                  value={gateway.emailSmtpHost}
                  onChange={(e) => setGateway({ ...gateway, emailSmtpHost: e.target.value })}
                  className="mt-1 rounded-xl font-mono text-xs"
                  required
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">SMTP Port</Label>
                <Input
                  type="number"
                  value={gateway.emailSmtpPort}
                  onChange={(e) => setGateway({ ...gateway, emailSmtpPort: Number(e.target.value) })}
                  className="mt-1 rounded-xl font-mono text-xs"
                  required
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">Alamat Pengirim (Sender Email)</Label>
                <Input
                  value={gateway.emailSenderAddress}
                  onChange={(e) => setGateway({ ...gateway, emailSenderAddress: e.target.value })}
                  className="mt-1 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">Nama Pengirim (Display Name)</Label>
                <Input
                  value={gateway.emailSenderName}
                  onChange={(e) => setGateway({ ...gateway, emailSenderName: e.target.value })}
                  className="mt-1 rounded-xl text-xs"
                  required
                />
              </div>
            </div>

            <div className="pt-3">
              <Button type="submit" className="rounded-xl bg-primary text-on-primary">
                Perbarui Kredensial Gateway
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
