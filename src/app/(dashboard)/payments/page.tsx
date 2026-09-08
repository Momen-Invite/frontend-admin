"use client";

import { useState, useEffect, useCallback } from "react";
import { PaymentSessionLog } from "@/types/superadmin";
import { MOCK_PAYMENTS } from "@/lib/mock-superadmin-data";
import { paymentsApi, PaginationMeta } from "@/lib/api-superadmin";
import { ApiError } from "@/lib/api";
import { toastManager } from "@/components/ui/toast";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const DEFAULT_META: PaginationMeta = {
  total: 0,
  page: 1,
  limit: 15,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

export default function PaymentSessionsPage() {
  const [payments, setPayments] = useState<PaymentSessionLog[]>(MOCK_PAYMENTS);
  const [meta, setMeta] = useState<PaginationMeta>({
    ...DEFAULT_META,
    total: MOCK_PAYMENTS.length,
    totalPages: Math.max(1, Math.ceil(MOCK_PAYMENTS.length / 15)),
  });
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPayment, setSelectedPayment] = useState<PaymentSessionLog | null>(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await paymentsApi.list({
        page,
        limit,
        search: searchQuery || undefined,
      });
      if (res.data) {
        const d = res.data as { items: PaymentSessionLog[]; meta: PaginationMeta };
        setPayments(d.items ?? []);
        setMeta(d.meta ?? DEFAULT_META);
      }
    } catch (err) {
      toastManager.error(err instanceof ApiError ? err.message : "Gagal memuat data sesi pembayaran.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

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
              Sesi Gateway & Webhook Log
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live API
            </span>
          </div>
          <p className="text-sm text-on-surface-variant mt-1">
            Monitoring sesi gateway Duitku, validasi signature SHA256, dan payload webhook mentah.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={() => {
            fetchPayments();
            toastManager.info("Menyinkronkan sesi gateway...");
          }}
          className="flex items-center gap-2 rounded-xl"
        >
          <span className={`material-symbols-outlined text-lg ${loading ? "animate-spin" : ""}`}>sync</span>
          <span>{loading ? "Menyinkronkan..." : "Sinkronkan Sesi"}</span>
        </Button>
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
              placeholder="Cari referensi gateway atau nomor target..."
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
                <th className="py-3.5 px-4">Referensi Gateway</th>
                <th className="py-3.5 px-4">Tipe Transaksi</th>
                <th className="py-3.5 px-4">Nomor Target</th>
                <th className="py-3.5 px-4">Nominal</th>
                <th className="py-3.5 px-4">Kanal</th>
                <th className="py-3.5 px-4">Signature SHA256</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Webhook Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-on-surface text-xs">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-3.5 px-4"><div className="h-4 bg-surface-container-high rounded w-28" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-surface-container-high rounded w-20" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-surface-container-high rounded w-24" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-surface-container-high rounded w-20" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-surface-container-high rounded w-16" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-surface-container-high rounded w-16" /></td>
                    <td className="py-3.5 px-4"><div className="h-5 bg-surface-container-high rounded-full w-20" /></td>
                    <td className="py-3.5 px-4 text-right"><div className="h-8 bg-surface-container-high rounded-lg w-24 ml-auto" /></td>
                  </tr>
                ))
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-on-surface-variant">
                    Tidak ada log sesi pembayaran ditemukan.
                  </td>
                </tr>
              ) : (
                payments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary">
                      {pay.paymentReference}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-on-surface">
                      {pay.targetType}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-on-surface-variant">
                      {pay.targetNumber}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-emerald-700 text-sm">
                      Rp {pay.amount.toLocaleString("id-ID")}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-on-surface-variant">
                      {pay.paymentMethod}
                    </td>

                    <td className="py-3.5 px-4">
                      {pay.signatureValid ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                          <span className="material-symbols-outlined text-sm">verified</span>
                          Valid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-600 font-semibold">
                          <span className="material-symbols-outlined text-sm">warning</span>
                          Invalid
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {pay.status === "paid" ? (
                        <StatusBadge variant="sukses" label="Terbayar" />
                      ) : (
                        <StatusBadge variant="pending" label={pay.status} />
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPayment(pay)}
                        className="h-8 text-xs rounded-lg flex items-center gap-1 ml-auto"
                      >
                        <span className="material-symbols-outlined text-sm">data_object</span>
                        Lihat JSON
                      </Button>
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
          ) : payments.length === 0 ? (
            <div className="p-4 text-center text-xs text-on-surface-variant">
              Tidak ada data pembayaran.
            </div>
          ) : (
            payments.map((pay) => (
              <div key={pay.id} className="p-4 rounded-xl bg-surface-container-low space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-primary block">
                      {pay.paymentReference}
                    </span>
                    <div className="font-bold text-on-surface text-sm">{pay.targetType}</div>
                  </div>
                  <StatusBadge variant={pay.status === "paid" ? "sukses" : "pending"} label={pay.status} />
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-outline-variant/20">
                  <span className="text-on-surface-variant">Nominal:</span>
                  <span className="font-bold text-emerald-700">
                    Rp {pay.amount.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPayment(pay)}
                    className="w-full text-xs rounded-xl"
                  >
                    Buka Raw Payload Webhook
                  </Button>
                </div>
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

      {/* JSON Viewer Dialog */}
      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="max-w-lg rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">terminal</span>
              Raw Webhook Payload Duitku
            </DialogTitle>
            <DialogDescription>
              Snapshot data callback JSON yang dikirimkan oleh payment gateway.
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-3 my-2 text-xs">
              <div className="p-3 rounded-xl bg-surface-container-low flex justify-between">
                <span className="text-on-surface-variant">Target Faktur:</span>
                <span className="font-mono font-bold text-on-surface">
                  {selectedPayment.targetNumber}
                </span>
              </div>

              <div className="relative">
                <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-60 leading-relaxed">
                  {JSON.stringify(selectedPayment.payloadSnapshot || {}, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedPayment(null)}
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
