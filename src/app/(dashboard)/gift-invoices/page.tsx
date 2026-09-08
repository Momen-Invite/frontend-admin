"use client";

import { useState, useMemo } from "react";
import { GiftInvoiceRecord } from "@/types/superadmin";
import { MOCK_GIFT_INVOICES } from "@/lib/mock-superadmin-data";
import { toastManager } from "@/components/ui/toast";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function GiftInvoicesPage() {
  const [giftInvoices] = useState<GiftInvoiceRecord[]>(MOCK_GIFT_INVOICES);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return giftInvoices.filter(
      (g) =>
        g.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.eventTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [giftInvoices, searchQuery]);

  const totalGifts = useMemo(() => {
    return giftInvoices.reduce((acc, g) => (g.status === "paid" ? acc + g.amount : acc), 0);
  }, [giftInvoices]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-background">
            Transaksi Amplop Kado Digital
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Monitoring amplop kado tunai dari tamu yang langsung diteruskan ke dompet saldo host.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            toastManager.success("Laporan amplop digital berhasil diunduh.");
          }}
          className="flex items-center gap-2 rounded-xl"
        >
          <span className="material-symbols-outlined text-lg">download</span>
          <span>Unduh Rekap Amplop</span>
        </Button>
      </div>

      {/* Stats Banner */}
      <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">featured_seasonal_and_gifts</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block">
              Total Amplop Kado Terkumpul
            </span>
            <span className="text-2xl font-bold text-emerald-700">
              Rp {totalGifts.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        <div className="text-xs text-on-surface-variant sm:text-right">
          <div>Terverifikasi otomatis via Payment Gateway</div>
          <div className="text-emerald-700 font-semibold mt-0.5">Langsung masuk ke saldo host tanpa potongan</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
        <div className="relative max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
            search
          </span>
          <Input
            type="text"
            placeholder="Cari nama pengirim, nama host, atau acara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-surface-container-low border-0"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-low/50 text-xs font-semibold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/20">
              <tr>
                <th className="py-3.5 px-4">Pengirim Kado</th>
                <th className="py-3.5 px-4">Host Penerima</th>
                <th className="py-3.5 px-4">Acara Undangan</th>
                <th className="py-3.5 px-4">Nominal Amplop</th>
                <th className="py-3.5 px-4">Pesan Doa</th>
                <th className="py-3.5 px-4">Metode Bayar</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-on-surface text-xs">
              {filtered.map((gift) => (
                <tr key={gift.id} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-sm text-on-surface">
                    {gift.senderName}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-primary">
                    {gift.hostName}
                  </td>

                  <td className="py-3.5 px-4 font-medium text-on-surface max-w-xs truncate">
                    {gift.eventTitle}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-emerald-700 text-sm">
                    Rp {gift.amount.toLocaleString("id-ID")}
                  </td>

                  <td className="py-3.5 px-4 italic text-on-surface-variant max-w-xs truncate">
                    &ldquo;{gift.senderMessage || "—"}&rdquo;
                  </td>

                  <td className="py-3.5 px-4 font-mono text-on-surface-variant">
                    {gift.paymentMethod}
                  </td>

                  <td className="py-3.5 px-4">
                    <StatusBadge variant="sukses" label="Terbayar" />
                  </td>

                  <td className="py-3.5 px-4 text-right text-on-surface-variant">
                    {gift.paidAt
                      ? new Date(gift.paidAt).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-outline-variant/20 p-3 space-y-3">
          {filtered.map((gift) => (
            <div key={gift.id} className="p-4 rounded-xl bg-surface-container-low space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-on-surface text-sm">{gift.senderName}</div>
                  <div className="text-xs text-primary font-medium">Kepada: {gift.hostName}</div>
                </div>
                <span className="font-bold text-emerald-700 text-sm">
                  Rp {gift.amount.toLocaleString("id-ID")}
                </span>
              </div>

              {gift.senderMessage && (
                <div className="text-xs italic text-on-surface-variant bg-surface-container-lowest p-2 rounded-lg">
                  &ldquo;{gift.senderMessage}&rdquo;
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
