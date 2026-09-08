"use client";

import { useState, useCallback, useEffect } from "react";
import { EventAttendance } from "@/types/superadmin";
import { attendancesApi, PaginationMeta } from "@/lib/api-superadmin";
import { ApiError } from "@/lib/api";
import { toastManager } from "@/components/ui/toast";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";

const DEFAULT_META: PaginationMeta = { total: 0, page: 1, limit: 15, totalPages: 1, hasNextPage: false, hasPrevPage: false };

export default function AttendancesPage() {
  const [attendances, setAttendances] = useState<EventAttendance[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await attendancesApi.list({ page, limit: 15, search: searchQuery || undefined });
      const d = res.data as { items: EventAttendance[]; meta: PaginationMeta };
      setAttendances(d.items ?? []);
      setMeta(d.meta ?? DEFAULT_META);
    } catch (err) {
      toastManager.error(err instanceof ApiError ? err.message : "Gagal memuat log presensi.");
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { setPage(1); }, [searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-background">Log Presensi Scan QR</h1>
          <p className="text-sm text-on-surface-variant mt-1">Monitor seluruh rekaman check-in tamu hari-H menggunakan QR Code & metode manual.</p>
        </div>
        <Button size="sm" variant="outline" onClick={fetchData} disabled={loading} className="rounded-xl flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">refresh</span>
          <span className="hidden sm:inline">Segarkan</span>
        </Button>
      </div>

      <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
        <div className="relative flex-1 max-w-md flex gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
            <Input type="text" placeholder="Cari nama peserta, acara..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && setSearchQuery(searchInput)} className="pl-10 h-10 rounded-xl bg-surface-container-low border-0" />
          </div>
          <Button size="sm" onClick={() => setSearchQuery(searchInput)} className="h-10 rounded-xl">Cari</Button>
        </div>
      </div>

      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-low/50 text-xs font-semibold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/20">
              <tr>
                <th className="py-3.5 px-4">Peserta</th>
                <th className="py-3.5 px-4">Acara</th>
                <th className="py-3.5 px-4">Sesi</th>
                <th className="py-3.5 px-4">Metode</th>
                <th className="py-3.5 px-4">Pax Aktual</th>
                <th className="py-3.5 px-4">Souvenir</th>
                <th className="py-3.5 px-4">Waktu Masuk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-on-surface">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="py-3 px-4"><div className="h-4 bg-surface-container-low rounded animate-pulse" /></td>
                  ))}</tr>
                ))
              ) : attendances.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl block mb-2 opacity-50">qr_code_scanner</span>
                    Tidak ada rekaman presensi.
                  </td>
                </tr>
              ) : attendances.map((att) => (
                <tr key={att.id} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="py-3 px-4 font-semibold">{att.attendeeName}</td>
                  <td className="py-3 px-4 text-xs max-w-[160px] truncate">{att.eventTitle}</td>
                  <td className="py-3 px-4 text-xs">{att.sessionName}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${att.checkinMethod === "Scan QR" ? "bg-primary-container text-on-primary-container" : "bg-surface-variant text-on-surface-variant"}`}>
                      <span className="material-symbols-outlined text-sm">{att.checkinMethod === "Scan QR" ? "qr_code_scanner" : "keyboard"}</span>
                      {att.checkinMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium">{att.actualPax} orang</td>
                  <td className="py-3 px-4">
                    <StatusBadge variant={att.souvenirStatus === "Sudah Diberikan" ? "sukses" : "pending"} label={att.souvenirStatus} />
                  </td>
                  <td className="py-3 px-4 text-xs text-on-surface-variant">
                    {new Date(att.checkedInAt).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
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
