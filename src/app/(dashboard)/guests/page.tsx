"use client";

import { useState, useCallback, useEffect } from "react";
import { EventGuest, RsvpStatus } from "@/types/superadmin";
import { guestsApi, PaginationMeta } from "@/lib/api-superadmin";
import { ApiError } from "@/lib/api";
import { toastManager } from "@/components/ui/toast";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";

const DEFAULT_META: PaginationMeta = { total: 0, page: 1, limit: 15, totalPages: 1, hasNextPage: false, hasPrevPage: false };

const RSVP_VARIANT: Record<RsvpStatus, "sukses" | "pending" | "gagal" | "nonaktif"> = {
  attending: "sukses", pending: "pending", declined: "gagal", tentative: "nonaktif",
};
const RSVP_LABEL: Record<RsvpStatus, string> = {
  attending: "Hadir", pending: "Pending", declined: "Tidak Hadir", tentative: "Mungkin",
};

export default function GuestsPage() {
  const [guests, setGuests] = useState<EventGuest[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [rsvpFilter, setRsvpFilter] = useState("all");

  const fetchGuests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await guestsApi.list({ page, limit: 15, search: searchQuery || undefined, rsvpStatus: rsvpFilter !== "all" ? rsvpFilter : undefined });
      const d = res.data as { items: EventGuest[]; meta: PaginationMeta };
      setGuests(d.items ?? []);
      setMeta(d.meta ?? DEFAULT_META);
    } catch (err) {
      toastManager.error(err instanceof ApiError ? err.message : "Gagal memuat data tamu.");
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, rsvpFilter]);

  useEffect(() => { fetchGuests(); }, [fetchGuests]);
  useEffect(() => { setPage(1); }, [searchQuery, rsvpFilter]);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-background">Buku Tamu Undangan</h1>
          <p className="text-sm text-on-surface-variant mt-1">Monitor status RSVP, undangan dibuka, dan respons konfirmasi kehadiran tamu.</p>
        </div>
        <Button size="sm" variant="outline" onClick={fetchGuests} disabled={loading} className="rounded-xl flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">refresh</span>
          <span className="hidden sm:inline">Segarkan</span>
        </Button>
      </div>

      {/* Toolbar */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 max-w-md flex gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
            <Input type="text" placeholder="Cari nama, kode, acara..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && setSearchQuery(searchInput)} className="pl-10 h-10 rounded-xl bg-surface-container-low border-0" />
          </div>
          <Button size="sm" onClick={() => setSearchQuery(searchInput)} className="h-10 rounded-xl">Cari</Button>
        </div>
        <div className="inline-flex rounded-xl bg-surface-container-low p-1 text-xs font-medium self-start">
          {[{ id: "all", label: "Semua" }, { id: "attending", label: "Hadir" }, { id: "pending", label: "Pending" }, { id: "declined", label: "Tidak Hadir" }].map((tab) => (
            <button key={tab.id} onClick={() => { setRsvpFilter(tab.id); setPage(1); }} className={`px-3 py-1.5 rounded-lg transition-colors ${rsvpFilter === tab.id ? "bg-surface-container-lowest text-primary font-bold shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}>
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
                <th className="py-3.5 px-4">Kode Tamu</th>
                <th className="py-3.5 px-4">Nama Tamu</th>
                <th className="py-3.5 px-4">Acara</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">RSVP</th>
                <th className="py-3.5 px-4">Jumlah Hadir</th>
                <th className="py-3.5 px-4">Ucapan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-on-surface">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="py-3 px-4"><div className="h-4 bg-surface-container-low rounded animate-pulse" /></td>
                  ))}</tr>
                ))
              ) : guests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl block mb-2 opacity-50">people</span>
                    Tidak ada data tamu undangan.
                  </td>
                </tr>
              ) : guests.map((guest) => (
                <tr key={guest.id} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs font-bold text-primary">{guest.guestCode}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold">{guest.name}</div>
                    <div className="text-xs text-on-surface-variant">{guest.phone}</div>
                  </td>
                  <td className="py-3 px-4 text-xs max-w-[200px] truncate">{guest.eventTitle}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-surface-variant text-on-surface-variant font-medium">{guest.category}</span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge variant={RSVP_VARIANT[guest.rsvpStatus]} label={RSVP_LABEL[guest.rsvpStatus]} />
                  </td>
                  <td className="py-3 px-4 font-medium">{guest.rsvpPax} / {guest.maxGuests} orang</td>
                  <td className="py-3 px-4 max-w-[200px]">
                    {guest.rsvpWishes ? (
                      <p className="text-xs text-on-surface-variant truncate" title={guest.rsvpWishes}>{guest.rsvpWishes}</p>
                    ) : <span className="text-xs text-on-surface-variant/50">—</span>}
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
