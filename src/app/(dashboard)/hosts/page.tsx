"use client";

import { useState, useMemo } from "react";
import { HostData } from "@/types/superadmin";
import { MOCK_HOSTS } from "@/lib/mock-superadmin-data";
import { toastManager } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function HostsManagementPage() {
  const [hosts, setHosts] = useState<HostData[]>(MOCK_HOSTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHost, setSelectedHost] = useState<HostData | null>(null);

  const filteredHosts = useMemo(() => {
    return hosts.filter(
      (h) =>
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.phone.includes(searchQuery)
    );
  }, [hosts, searchQuery]);

  const summary = useMemo(() => {
    const totalBalance = hosts.reduce((acc, h) => acc + h.balance, 0);
    const totalGifts = hosts.reduce((acc, h) => acc + h.totalGiftsReceived, 0);
    const totalWithdrawn = hosts.reduce((acc, h) => acc + h.totalWithdrawn, 0);
    return { totalBalance, totalGifts, totalWithdrawn };
  }, [hosts]);

  const handleToggleNotif = (hostId: number) => {
    setHosts((prev) =>
      prev.map((h) =>
        h.id === hostId ? { ...h, allowNotifWa: !h.allowNotifWa } : h
      )
    );
    toastManager.info("Pengaturan notifikasi WhatsApp host telah diperbarui.");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-background">
            Manajemen Host Penyelenggara
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Monitoring dompet kado digital, preferensi notifikasi, dan riwayat acara para host.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            toastManager.success("Laporan rekapitulasi kado host berhasil diunduh.");
          }}
          className="flex items-center gap-2 rounded-xl"
        >
          <span className="material-symbols-outlined text-lg">file_download</span>
          <span>Unduh Laporan Saldo</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Saldo Tertampung</span>
            <span className="material-symbols-outlined text-emerald-600 text-xl">account_balance_wallet</span>
          </div>
          <div className="text-2xl font-bold text-emerald-700">
            Rp {summary.totalBalance.toLocaleString("id-ID")}
          </div>
          <div className="text-xs text-on-surface-variant mt-0.5">Saldo aktif di dompet host</div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Akumulasi Kado Masuk</span>
            <span className="material-symbols-outlined text-primary text-xl">featured_seasonal_and_gifts</span>
          </div>
          <div className="text-2xl font-bold text-on-surface">
            Rp {summary.totalGifts.toLocaleString("id-ID")}
          </div>
          <div className="text-xs text-on-surface-variant mt-0.5">Dari seluruh tamu undangan</div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Dana Dicairkan</span>
            <span className="material-symbols-outlined text-tertiary text-xl">paid</span>
          </div>
          <div className="text-2xl font-bold text-on-surface">
            Rp {summary.totalWithdrawn.toLocaleString("id-ID")}
          </div>
          <div className="text-xs text-on-surface-variant mt-0.5">Transfer sukses ke bank host</div>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
        <div className="relative max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
            search
          </span>
          <Input
            type="text"
            placeholder="Cari nama host, email, atau no WhatsApp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-surface-container-low border-0"
          />
        </div>
      </div>

      {/* Host Table */}
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-low/50 text-xs font-semibold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/20">
              <tr>
                <th className="py-3.5 px-4">Host Penyelenggara</th>
                <th className="py-3.5 px-4">Total Acara</th>
                <th className="py-3.5 px-4">Saldo Kado Tersedia</th>
                <th className="py-3.5 px-4">Akumulasi Kado</th>
                <th className="py-3.5 px-4">Total Dicairkan</th>
                <th className="py-3.5 px-4">Notif WA</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-on-surface text-xs">
              {filteredHosts.map((host) => (
                <tr key={host.id} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container font-bold text-xs flex items-center justify-center">
                        {host.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-on-surface">{host.name}</div>
                        <div className="text-on-surface-variant">{host.email}</div>
                        <div className="text-on-surface-variant/80">{host.phone}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-on-surface">
                    {host.totalEvents} Acara
                  </td>

                  <td className="py-3.5 px-4 font-bold text-emerald-700 text-sm">
                    Rp {host.balance.toLocaleString("id-ID")}
                  </td>

                  <td className="py-3.5 px-4 font-medium text-on-surface">
                    Rp {host.totalGiftsReceived.toLocaleString("id-ID")}
                  </td>

                  <td className="py-3.5 px-4 font-medium text-on-surface-variant">
                    Rp {host.totalWithdrawn.toLocaleString("id-ID")}
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleNotif(host.id)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                        host.allowNotifWa
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-surface-variant text-on-surface-variant"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xs">
                        {host.allowNotifWa ? "notifications_active" : "notifications_off"}
                      </span>
                      {host.allowNotifWa ? "Aktif" : "Mati"}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedHost(host)}
                      className="h-8 text-xs text-primary hover:bg-primary-container rounded-lg"
                    >
                      Detail Dompet
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-outline-variant/20 p-3 space-y-3">
          {filteredHosts.map((host) => (
            <div key={host.id} className="p-4 rounded-xl bg-surface-container-low space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-on-surface text-sm">{host.name}</div>
                  <div className="text-xs text-on-surface-variant">{host.phone}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-on-surface-variant block">Saldo Dompet:</span>
                  <span className="font-bold text-emerald-700 text-sm">
                    Rp {host.balance.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedHost(host)}
                  className="w-full text-xs rounded-xl"
                >
                  Lihat Rincian Dompet Kado
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Host Detail Dialog */}
      <Dialog open={!!selectedHost} onOpenChange={() => setSelectedHost(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
              Rincian Dompet Kado Host
            </DialogTitle>
            <DialogDescription>
              Ikhtisar mutasi dan saldo amplop digital yang dimiliki oleh host.
            </DialogDescription>
          </DialogHeader>

          {selectedHost && (
            <div className="space-y-4 my-2 text-sm">
              <div className="p-4 rounded-xl bg-surface-container-low">
                <div className="font-bold text-base text-on-surface">{selectedHost.name}</div>
                <div className="text-xs text-on-surface-variant">{selectedHost.email} • {selectedHost.phone}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-surface-container-low">
                  <span className="text-on-surface-variant block mb-1">Saldo Dapat Ditarik</span>
                  <span className="font-bold text-base text-emerald-700">
                    Rp {selectedHost.balance.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-low">
                  <span className="text-on-surface-variant block mb-1">Total Kado Diterima</span>
                  <span className="font-bold text-base text-on-surface">
                    Rp {selectedHost.totalGiftsReceived.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Jumlah Acara Dibuat:</span>
                  <span className="font-semibold text-on-surface">{selectedHost.totalEvents} Acara</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Permintaan Penarikan Tertunda:</span>
                  <span className="font-semibold text-amber-600">{selectedHost.pendingWithdrawalCount} Permintaan</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedHost(null)}
              className="rounded-xl w-full"
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
