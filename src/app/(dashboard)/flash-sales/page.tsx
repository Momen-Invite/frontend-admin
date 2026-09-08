"use client";

import { useState, useCallback, useEffect } from "react";
import { FlashSale } from "@/types/superadmin";
import { flashSalesApi, PaginationMeta } from "@/lib/api-superadmin";
import { ApiError } from "@/lib/api";
import { toastManager } from "@/components/ui/toast";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const DEFAULT_META: PaginationMeta = { total: 0, page: 1, limit: 15, totalPages: 1, hasNextPage: false, hasPrevPage: false };

export default function FlashSalesPage() {
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newPromo, setNewPromo] = useState({ eventProductId: "", promoPrice: "", label: "", startsAt: "", endsAt: "" });

  const fetchFlashSales = useCallback(async () => {
    setLoading(true);
    try {
      const res = await flashSalesApi.list({ page, limit: 15, status: statusFilter !== "all" ? statusFilter : undefined });
      const d = res.data as { items: FlashSale[]; meta: PaginationMeta };
      setFlashSales(d.items ?? []);
      setMeta(d.meta ?? DEFAULT_META);
    } catch (err) {
      toastManager.error(err instanceof ApiError ? err.message : "Gagal memuat data flash sale.");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchFlashSales(); }, [fetchFlashSales]);
  useEffect(() => { setPage(1); }, [statusFilter]);

  const handleEndPromo = async (id: number, name: string) => {
    if (!confirm(`Akhiri promo "${name}"?`)) return;
    try {
      await flashSalesApi.end(id);
      toastManager.success(`Promo "${name}" telah diakhiri.`);
      fetchFlashSales();
    } catch (err) {
      toastManager.error(err instanceof ApiError ? err.message : "Gagal mengakhiri promo.");
    }
  };

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromo.eventProductId || !newPromo.promoPrice) { toastManager.error("ID Produk dan harga promo wajib diisi."); return; }
    setCreating(true);
    try {
      await flashSalesApi.create({
        eventProductId: Number(newPromo.eventProductId),
        promoPrice: Number(newPromo.promoPrice),
        label: newPromo.label,
        startsAt: newPromo.startsAt,
        endsAt: newPromo.endsAt,
      });
      toastManager.success("Flash sale baru berhasil dibuat.");
      setIsCreateOpen(false);
      setNewPromo({ eventProductId: "", promoPrice: "", label: "", startsAt: "", endsAt: "" });
      fetchFlashSales();
    } catch (err) {
      toastManager.error(err instanceof ApiError ? err.message : "Gagal membuat flash sale.");
    } finally {
      setCreating(false);
    }
  };

  const statusVariantMap: Record<string, "sukses" | "pending" | "gagal" | "nonaktif"> = {
    active: "sukses", scheduled: "pending", ended: "nonaktif",
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-background">Flash Sale & Promo Tema</h1>
          <p className="text-sm text-on-surface-variant mt-1">Kelola diskon tempo terbatas, jadwal promo, dan label penawaran khusus.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={fetchFlashSales} disabled={loading} className="rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">refresh</span>
          </Button>
          <Button size="sm" onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2 rounded-xl bg-primary text-on-primary">
            <span className="material-symbols-outlined text-lg">local_offer</span>
            <span>Buat Promo</span>
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        {[{ id: "all", label: "Semua" }, { id: "active", label: "Aktif" }, { id: "scheduled", label: "Terjadwal" }, { id: "ended", label: "Berakhir" }].map((tab) => (
          <button key={tab.id} onClick={() => { setStatusFilter(tab.id); setPage(1); }} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${statusFilter === tab.id ? "bg-primary text-on-primary" : "bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-low/50 text-xs font-semibold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/20">
              <tr>
                <th className="py-3.5 px-4">Produk Tema</th>
                <th className="py-3.5 px-4">Harga Normal</th>
                <th className="py-3.5 px-4">Harga Promo</th>
                <th className="py-3.5 px-4">Label</th>
                <th className="py-3.5 px-4">Mulai</th>
                <th className="py-3.5 px-4">Berakhir</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-on-surface">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 8 }).map((_, j) => (
                    <td key={j} className="py-3 px-4"><div className="h-4 bg-surface-container-low rounded animate-pulse" /></td>
                  ))}</tr>
                ))
              ) : flashSales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl block mb-2 opacity-50">local_offer</span>
                    Tidak ada data flash sale.
                  </td>
                </tr>
              ) : flashSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="py-3 px-4 font-semibold">{sale.productName}</td>
                  <td className="py-3 px-4 text-on-surface-variant line-through">Rp {sale.normalPrice.toLocaleString("id-ID")}</td>
                  <td className="py-3 px-4 font-bold text-primary">Rp {sale.promoPrice.toLocaleString("id-ID")}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary-container text-on-primary-container">{sale.label}</span>
                  </td>
                  <td className="py-3 px-4 text-xs">{new Date(sale.startsAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className="py-3 px-4 text-xs">{new Date(sale.endsAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className="py-3 px-4">
                    <StatusBadge variant={statusVariantMap[sale.status] ?? "nonaktif"} label={sale.status === "active" ? "Aktif" : sale.status === "scheduled" ? "Terjadwal" : "Berakhir"} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    {sale.status !== "ended" && (
                      <Button variant="ghost" size="sm" onClick={() => handleEndPromo(sale.id, sale.productName)} className="h-8 px-3 rounded-lg text-error hover:bg-error-container/20 text-xs">
                        Akhiri
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={meta.page} totalPages={meta.totalPages} totalItems={meta.total} pageSize={meta.limit} onPageChange={setPage} isLiveApi={!loading} />
      </div>

      {/* Create Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Buat Flash Sale Baru</DialogTitle>
            <DialogDescription>Atur diskon tempo terbatas untuk produk tema undangan.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreatePromo} className="space-y-4 my-2">
            {[
              { id: "eventProductId", label: "ID Produk Tema", type: "number", placeholder: "cth. 12" },
              { id: "promoPrice", label: "Harga Promo (Rp)", type: "number", placeholder: "cth. 150000" },
              { id: "label", label: "Label Promo", type: "text", placeholder: "cth. Diskon 40%" },
              { id: "startsAt", label: "Mulai Promo", type: "datetime-local", placeholder: "" },
              { id: "endsAt", label: "Akhir Promo", type: "datetime-local", placeholder: "" },
            ].map((field) => (
              <div key={field.id} className="space-y-1.5">
                <Label htmlFor={field.id} className="text-xs font-semibold">{field.label}</Label>
                <Input id={field.id} type={field.type} placeholder={field.placeholder} value={newPromo[field.id as keyof typeof newPromo]} onChange={(e) => setNewPromo((p) => ({ ...p, [field.id]: e.target.value }))} className="rounded-xl h-10" />
              </div>
            ))}
            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} disabled={creating} className="rounded-xl">Batal</Button>
              <Button type="submit" disabled={creating} className="rounded-xl bg-primary text-on-primary">
                {creating ? "Membuat..." : "Buat Flash Sale"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
