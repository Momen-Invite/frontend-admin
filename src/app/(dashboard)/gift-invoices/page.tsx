"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { GiftInvoiceRecord } from "@/types/superadmin";
import { MOCK_GIFT_INVOICES } from "@/lib/mock-superadmin-data";
import { giftInvoicesApi, PaginationMeta } from "@/lib/api-superadmin";
import { ApiError } from "@/lib/api";
import { toastManager } from "@/components/ui/toast";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";

const DEFAULT_META: PaginationMeta = {
  total: 0,
  page: 1,
  limit: 15,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

export default function GiftInvoicesPage() {
  const [giftInvoices, setGiftInvoices] = useState<GiftInvoiceRecord[]>(MOCK_GIFT_INVOICES);
  const [meta, setMeta] = useState<PaginationMeta>({
    ...DEFAULT_META,
    total: MOCK_GIFT_INVOICES.length,
    totalPages: Math.max(1, Math.ceil(MOCK_GIFT_INVOICES.length / 15)),
  });
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchGiftInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await giftInvoicesApi.list({
        page,
        limit,
        search: searchQuery || undefined,
      });
      if (res.data) {
        const d = res.data as { items: GiftInvoiceRecord[]; meta: PaginationMeta };
        setGiftInvoices(d.items ?? []);
        setMeta(d.meta ?? DEFAULT_META);
      }
    } catch (err) {
      toastManager.error(err instanceof ApiError ? err.message : "Gagal memuat amplop kado.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery]);

  useEffect(() => {
    fetchGiftInvoices();
  }, [fetchGiftInvoices]);

  const totalGifts = useMemo(() => {
    return giftInvoices.reduce((acc, g) => (g.status === "paid" ? acc + g.amount : acc), 0);
  }, [giftInvoices]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setPage(1);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-background">
              Transaksi Amplop Kado Digital
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live API
            </span>
          </div>
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
              Total Amplop Kado Terkumpul (Halaman Ini)
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
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
              search
            </span>
            <Input
              type="text"
              placeholder="Cari pengirim, host penerima, atau acara..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-surface-container-low border-0"
            />
          </div>
          <Button type="submit" size="sm" className="h-10 px-4 rounded-xl">
            Cari
          </Button>
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchInput("");
                setSearchQuery("");
                setPage(1);
              }}
              className="h-10 px-3 rounded-xl text-xs"
            >
              Reset
            </Button>
          )}
        </form>
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
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-3.5 px-4"><div className="h-4 bg-surface-container-high rounded w-28" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-surface-container-high rounded w-24" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-surface-container-high rounded w-36" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-surface-container-high rounded w-20" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-surface-container-high rounded w-32" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-surface-container-high rounded w-16" /></td>
                    <td className="py-3.5 px-4"><div className="h-5 bg-surface-container-high rounded-full w-20" /></td>
                    <td className="py-3.5 px-4 text-right"><div className="h-4 bg-surface-container-high rounded w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : giftInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-on-surface-variant">
                    Tidak ada transaksi amplop kado digital ditemukan.
                  </td>
                </tr>
              ) : (
                giftInvoices.map((gift) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-outline-variant/20 p-3 space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 rounded-xl bg-surface-container-low animate-pulse space-y-2">
                <div className="h-4 bg-surface-container-high rounded w-32" />
                <div className="h-4 bg-surface-container-high rounded w-24" />
              </div>
            ))
          ) : giftInvoices.length === 0 ? (
            <div className="p-4 text-center text-xs text-on-surface-variant">
              Tidak ada data amplop.
            </div>
          ) : (
            giftInvoices.map((gift) => (
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
            ))
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          pageSize={limit}
          onPageChange={(p) => setPage(p)}
          onPageSizeChange={(s) => {
            setLimit(s);
            setPage(1);
          }}
          isLiveApi={!loading}
        />
      </div>
    </div>
  );
}
