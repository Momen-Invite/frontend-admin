"use client";

import { useState, useEffect, useCallback } from "react";
import { ActivityLog } from "@/types/superadmin";
import { MOCK_ACTIVITY_LOGS } from "@/lib/mock-superadmin-data";
import { activityLogsApi, PaginationMeta } from "@/lib/api-superadmin";
import { ApiError } from "@/lib/api";
import { toastManager } from "@/components/ui/toast";
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

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>(MOCK_ACTIVITY_LOGS);
  const [meta, setMeta] = useState<PaginationMeta>({
    ...DEFAULT_META,
    total: MOCK_ACTIVITY_LOGS.length,
    totalPages: Math.max(1, Math.ceil(MOCK_ACTIVITY_LOGS.length / 15)),
  });
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await activityLogsApi.list({
        page,
        limit,
        search: searchQuery || undefined,
      });
      if (res.data) {
        const d = res.data as { items: ActivityLog[]; meta: PaginationMeta };
        setLogs(d.items ?? []);
        setMeta(d.meta ?? DEFAULT_META);
      }
    } catch (err) {
      toastManager.error(err instanceof ApiError ? err.message : "Gagal memuat log aktivitas.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

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
              Audit Trail & Log Aktivitas Staf
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live API
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              Khusus Superadmin
            </span>
          </div>
          <p className="text-sm text-on-surface-variant mt-1">
            Rekam jejak seluruh mutasi data sensitif, persetujuan penarikan, dan akses panel admin.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            toastManager.success("Log audit trail berhasil diekspor untuk kepatuhan keamanan.");
          }}
          className="flex items-center gap-2 rounded-xl"
        >
          <span className="material-symbols-outlined text-lg">download</span>
          <span>Unduh Audit Log</span>
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
              placeholder="Cari nama admin, tindakan (ACTION), atau entitas..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-surface-container-low border-0 text-xs"
            />
          </div>
          <Button type="submit" size="sm" className="h-10 px-4 rounded-xl text-xs">
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
                <th className="py-3.5 px-4">Aktor Staf</th>
                <th className="py-3.5 px-4">Tindakan (Action)</th>
                <th className="py-3.5 px-4">Entitas Target</th>
                <th className="py-3.5 px-4">Keterangan Aktivitas</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4 text-right">Waktu Eksekusi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-on-surface text-xs">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-3.5 px-4"><div className="h-4 bg-surface-container-high rounded w-28" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-surface-container-high rounded w-24" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-surface-container-high rounded w-20" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-surface-container-high rounded w-48" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-surface-container-high rounded w-20" /></td>
                    <td className="py-3.5 px-4 text-right"><div className="h-4 bg-surface-container-high rounded w-28 ml-auto" /></td>
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-on-surface-variant">
                    Tidak ada log aktivitas ditemukan.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-sm text-on-surface">{log.actorName}</div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary-container text-on-primary-container uppercase">
                        {log.actorRole}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-primary">
                      {log.action}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-on-surface-variant">
                      {log.entityName} #{log.entityId}
                    </td>

                    <td className="py-3.5 px-4 text-on-surface max-w-sm leading-relaxed">
                      {log.details || "—"}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-on-surface-variant">
                      {log.ipAddress}
                    </td>

                    <td className="py-3.5 px-4 text-right text-on-surface-variant">
                      {new Date(log.createdAt).toLocaleString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
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
          ) : logs.length === 0 ? (
            <div className="p-4 text-center text-xs text-on-surface-variant">
              Tidak ada log aktivitas.
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-4 rounded-xl bg-surface-container-low space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-on-surface text-sm">{log.actorName}</div>
                    <span className="font-mono text-xs font-bold text-primary block">{log.action}</span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant font-mono">{log.ipAddress}</span>
                </div>

                <p className="text-xs text-on-surface leading-relaxed">
                  {log.details}
                </p>
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
