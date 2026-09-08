"use client";

import { useState, useCallback, useEffect } from "react";
import { EventRegistration } from "@/types/superadmin";
import { registrationsApi, PaginationMeta } from "@/lib/api-superadmin";
import { ApiError } from "@/lib/api";
import { toastManager } from "@/components/ui/toast";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";

const DEFAULT_META: PaginationMeta = { total: 0, page: 1, limit: 15, totalPages: 1, hasNextPage: false, hasPrevPage: false };

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await registrationsApi.list({ page, limit: 15, search: searchQuery || undefined, status: statusFilter !== "all" ? statusFilter : undefined });
      const d = res.data as { items: EventRegistration[]; meta: PaginationMeta };
      setRegistrations(d.items ?? []);
      setMeta(d.meta ?? DEFAULT_META);
    } catch (err) {
      toastManager.error(err instanceof ApiError ? err.message : "Gagal memuat registrasi tiket.");
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { setPage(1); }, [searchQuery, statusFilter]);

  const statusVariant = (s: string) => s === "confirmed" ? "sukses" : s === "cancelled" ? "gagal" : "pending";
  const statusLabel = (s: string) => s === "confirmed" ? "Terkonfirmasi" : s === "cancelled" ? "Dibatalkan" : "Pending Bayar";

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-background">Registrasi Tiket Acara Publik</h1>
          <p className="text-sm text-on-surface-variant mt-1">Monitor seluruh pendaftaran tiket acara publik & status konfirmasi pembayaran.</p>
        </div>
        <Button size="sm" variant="outline" onClick={fetchData} disabled={loading} className="rounded-xl flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">refresh</span>
          <span className="hidden sm:inline">Segarkan</span>
        </Button>
      </div>

      <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 max-w-md flex gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
            <Input type="text" placeholder="Cari nama, kode tiket, email..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && setSearchQuery(searchInput)} className="pl-10 h-10 rounded-xl bg-surface-container-low border-0" />
          </div>
          <Button size="sm" onClick={() => setSearchQuery(searchInput)} className="h-10 rounded-xl">Cari</Button>
        </div>
        <div className="inline-flex rounded-xl bg-surface-container-low p-1 text-xs font-medium self-start">
          {[{ id: "all", label: "Semua" }, { id: "confirmed", label: "Terkonfirmasi" }, { id: "pending_payment", label: "Pending" }, { id: "cancelled", label: "Batal" }].map((tab) => (
            <button key={tab.id} onClick={() => { setStatusFilter(tab.id); setPage(1); }} className={`px-3 py-1.5 rounded-lg transition-colors ${statusFilter === tab.id ? "bg-surface-container-lowest text-primary font-bold shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-low/50 text-xs font-semibold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/20">
              <tr>
                <th className="py-3.5 px-4">Kode Tiket</th>
                <th className="py-3.5 px-4">Peserta</th>
                <th className="py-3.5 px-4">Acara</th>
                <th className="py-3.5 px-4">Jenis Tiket</th>
                <th className="py-3.5 px-4">Pax</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Tgl Daftar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-on-surface">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="py-3 px-4"><div className="h-4 bg-surface-container-low rounded animate-pulse" /></td>
                  ))}</tr>
                ))
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl block mb-2 opacity-50">confirmation_number</span>
                    Tidak ada data registrasi tiket.
                  </td>
                </tr>
              ) : registrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs font-bold text-primary">{reg.ticketCode}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold">{reg.userName}</div>
                    <div className="text-xs text-on-surface-variant">{reg.userEmail}</div>
                  </td>
                  <td className="py-3 px-4 text-xs max-w-[200px] truncate">{reg.eventTitle}</td>
                  <td className="py-3 px-4 text-xs">{reg.ticketType}</td>
                  <td className="py-3 px-4 font-medium">{reg.paxCount} orang</td>
                  <td className="py-3 px-4">
                    <StatusBadge variant={statusVariant(reg.status)} label={statusLabel(reg.status)} />
                  </td>
                  <td className="py-3 px-4 text-xs text-on-surface-variant">
                    {new Date(reg.registeredAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={meta.page} totalPages={meta.totalPages} totalItems={meta.total} pageSize={meta.limit} onPageChange={setPage} isLiveApi={!loading} />
      </div>
    </div>
  );
}
