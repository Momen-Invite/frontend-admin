"use client";

import { useState, useMemo } from "react";
import { PackageInvoice, InvoiceStatus } from "@/types/superadmin";
import { MOCK_INVOICES } from "@/lib/mock-superadmin-data";
import { toastManager } from "@/components/ui/toast";
import { StatusBadge } from "@/components/ui/StatusBadge";
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

export default function PackageInvoicesPage() {
  const [invoices, setInvoices] = useState<PackageInvoice[]>(MOCK_INVOICES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedInvoice, setSelectedInvoice] = useState<PackageInvoice | null>(null);

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const matchSearch =
        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.hostEmail.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === "all" ? true : inv.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [invoices, searchQuery, statusFilter]);

  const summary = useMemo(() => {
    const totalVolume = invoices
      .filter((i) => i.status === "SUCCESS")
      .reduce((acc, i) => acc + i.total, 0);
    const paidCount = invoices.filter((i) => i.status === "SUCCESS").length;
    const pendingCount = invoices.filter((i) => i.status === "PENDING").length;
    return { totalVolume, paidCount, pendingCount };
  }, [invoices]);

  const handleMarkPaid = (id: number) => {
    setInvoices((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              status: "SUCCESS",
              paidAt: new Date().toISOString(),
              paymentMethod: "MANUAL_VERIFIED",
            }
          : i
      )
    );
    toastManager.success("Faktur berhasil ditandai LUNAS secara manual.");
    setSelectedInvoice(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-background">
            Invoice Pembelian Paket Tema
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Daftar tagihan pembayaran pembelian paket tema undangan digital oleh host.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            toastManager.success("Laporan faktur penjualan berhasil diunduh.");
          }}
          className="flex items-center gap-2 rounded-xl"
        >
          <span className="material-symbols-outlined text-lg">download</span>
          <span>Unduh Rekap Faktur</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Volume Penjualan Tema</span>
            <span className="material-symbols-outlined text-emerald-600 text-xl">payments</span>
          </div>
          <div className="text-2xl font-bold text-emerald-700">
            Rp {summary.totalVolume.toLocaleString("id-ID")}
          </div>
          <div className="text-xs text-on-surface-variant mt-0.5">Dari transaksi lunas</div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Faktur Lunas</span>
            <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
          </div>
          <div className="text-2xl font-bold text-on-surface">{summary.paidCount}</div>
          <div className="text-xs text-on-surface-variant mt-0.5">Tema otomatis aktif</div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Menunggu Pembayaran</span>
            <span className="material-symbols-outlined text-amber-600 text-xl">pending_actions</span>
          </div>
          <div className="text-2xl font-bold text-amber-600">{summary.pendingCount}</div>
          <div className="text-xs text-on-surface-variant mt-0.5">Menunggu respon gateway</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
            search
          </span>
          <Input
            type="text"
            placeholder="Cari nomor faktur (INV-...), nama, atau email host..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-surface-container-low border-0"
          />
        </div>

        <div className="inline-flex rounded-xl bg-surface-container-low p-1 text-xs font-medium">
          {[
            { id: "all", label: "Semua Status" },
            { id: "SUCCESS", label: "Lunas" },
            { id: "PENDING", label: "Pending" },
            { id: "EXPIRED", label: "Kadaluarsa" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === tab.id
                  ? "bg-surface-container-lowest text-primary font-bold shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-low/50 text-xs font-semibold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/20">
              <tr>
                <th className="py-3.5 px-4">No. Faktur</th>
                <th className="py-3.5 px-4">Host Pembeli</th>
                <th className="py-3.5 px-4">Paket Tema</th>
                <th className="py-3.5 px-4">Total Tagihan</th>
                <th className="py-3.5 px-4">Metode Bayar</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Tgl Terbit</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-on-surface text-xs">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-primary">
                    {inv.invoiceNumber}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-sm text-on-surface">{inv.hostName}</div>
                    <div className="text-on-surface-variant text-[11px]">{inv.hostEmail}</div>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-on-surface">
                    {inv.eventProductNameSnapshot}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-sm text-on-surface">
                    Rp {inv.total.toLocaleString("id-ID")}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono text-xs text-on-surface-variant">
                      {inv.paymentMethod || "—"}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {inv.status === "SUCCESS" ? (
                      <StatusBadge variant="sukses" label="Lunas" />
                    ) : inv.status === "PENDING" ? (
                      <StatusBadge variant="pending" label="Menunggu Bayar" />
                    ) : (
                      <StatusBadge variant="gagal" label="Kadaluarsa" />
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-on-surface-variant">
                    {new Date(inv.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedInvoice(inv)}
                      className="h-8 text-xs text-primary hover:bg-primary-container rounded-lg"
                    >
                      Detail Faktur
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-outline-variant/20 p-3 space-y-3">
          {filtered.map((inv) => (
            <div key={inv.id} className="p-4 rounded-xl bg-surface-container-low space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-primary block">
                    {inv.invoiceNumber}
                  </span>
                  <div className="font-bold text-on-surface text-sm">{inv.hostName}</div>
                  <div className="text-xs text-on-surface-variant">{inv.eventProductNameSnapshot}</div>
                </div>
                {inv.status === "SUCCESS" ? (
                  <StatusBadge variant="sukses" label="Lunas" />
                ) : (
                  <StatusBadge variant="gagal" label={inv.status} />
                )}
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-outline-variant/20">
                <span className="text-on-surface-variant">Nominal Faktur:</span>
                <span className="font-bold text-sm text-on-surface">
                  Rp {inv.total.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedInvoice(inv)}
                  className="w-full text-xs rounded-xl"
                >
                  Lihat Faktur Lengkap
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice Detail Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">receipt_long</span>
              Faktur Penjualan #{selectedInvoice?.invoiceNumber}
            </DialogTitle>
            <DialogDescription>
              Bukti sah transaksi pembelian tema undangan digital.
            </DialogDescription>
          </DialogHeader>

          {selectedInvoice && (
            <div className="space-y-4 my-2 text-sm">
              <div className="p-3.5 rounded-xl bg-surface-container-low flex justify-between items-center">
                <div>
                  <div className="font-bold text-on-surface">{selectedInvoice.hostName}</div>
                  <div className="text-xs text-on-surface-variant">{selectedInvoice.hostEmail}</div>
                </div>
                {selectedInvoice.status === "SUCCESS" ? (
                  <StatusBadge variant="sukses" label="Lunas" />
                ) : (
                  <StatusBadge variant="gagal" label={selectedInvoice.status} />
                )}
              </div>

              <div className="space-y-2 border-y border-outline-variant/20 py-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Produk Tema:</span>
                  <span className="font-semibold text-on-surface">{selectedInvoice.eventProductNameSnapshot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Subtotal:</span>
                  <span className="font-semibold text-on-surface">Rp {selectedInvoice.subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">PPN (0%):</span>
                  <span className="font-semibold text-on-surface">Rp 0</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-outline-variant/20">
                  <span className="text-on-surface">Total Pembayaran:</span>
                  <span className="text-emerald-700">Rp {selectedInvoice.total.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Kanal Gateway:</span>
                  <span className="font-mono text-on-surface">{selectedInvoice.paymentMethod || "Belum dipilih"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Tgl Pelunasan:</span>
                  <span className="text-on-surface">
                    {selectedInvoice.paidAt ? new Date(selectedInvoice.paidAt).toLocaleString("id-ID") : "—"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            {selectedInvoice?.status === "PENDING" && (
              <Button
                variant="default"
                size="sm"
                onClick={() => handleMarkPaid(selectedInvoice.id)}
                className="rounded-xl w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Tandai Lunas Manual
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setSelectedInvoice(null)}
              className="rounded-xl w-full sm:w-auto"
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
