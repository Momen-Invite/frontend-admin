"use client";

import { useState, useCallback, useEffect } from "react";
import { HostData } from "@/types/superadmin";
import { hostsApi, PaginationMeta } from "@/lib/api-superadmin";
import { ApiError } from "@/lib/api";
import { toastManager } from "@/components/ui/toast";
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
  total: 0, page: 1, limit: 15, totalPages: 1, hasNextPage: false, hasPrevPage: false,
};

export default function HostsManagementPage() {
  const [hosts, setHosts] = useState<HostData[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHost, setSelectedHost] = useState<HostData | null>(null);

  const fetchHosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await hostsApi.list({ page, limit: 15, search: searchQuery || undefined });
      const d = res.data as { items: HostData[]; meta: PaginationMeta };
      setHosts(d.items ?? []);
      setMeta(d.meta ?? DEFAULT_META);
    } catch (err) {
      toastManager.error(err instanceof ApiError ? err.message : "Gagal memuat data host.");
      setHosts([]);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => { fetchHosts(); }, [fetchHosts]);
  useEffect(() => { setPage(1); }, [searchQuery]);

  const handleToggleNotif = async (host: HostData) => {
    try {
      await hostsApi.toggleNotif(host.id, !host.allowNotifWa);
      toastManager.info("Pengaturan notifikasi WhatsApp host telah diperbarui.");
      fetchHosts();
    } catch (err) {
      toastManager.error(err instanceof ApiError ? err.message : "Gagal memperbarui notifikasi.");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-background">
            Host Penyelenggara
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Pantau data host acara, saldo amplop kado digital, dan status notifikasi WhatsApp.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={fetchHosts} disabled={loading} className="rounded-xl flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">refresh</span>
          <span className="hidden sm:inline">Segarkan</span>
        </Button>
      </div>

      {/* Toolbar */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md flex gap-2">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
              <Input
                type="text"
                placeholder="Cari nama, email host..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setSearchQuery(searchInput)}
                className="pl-10 h-10 rounded-xl bg-surface-container-low border-0"
              />
            </div>
            <Button size="sm" onClick={() => setSearchQuery(searchInput)} className="h-10 rounded-xl">Cari</Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-low/50 text-xs font-semibold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/20">
              <tr>
                <th className="py-3.5 px-4">Host</th>
                <th className="py-3.5 px-4">Total Event</th>
                <th className="py-3.5 px-4">Saldo Amplop</th>
                <th className="py-3.5 px-4">Total Kado Diterima</th>
                <th className="py-3.5 px-4">Total Dicairkan</th>
                <th className="py-3.5 px-4">Notif WA</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-on-surface">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="py-3 px-4"><div className="h-4 bg-surface-container-low rounded animate-pulse" /></td>
                  ))}</tr>
                ))
              ) : hosts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl block mb-2 opacity-50">event_available</span>
                    Tidak ada data host.
                  </td>
                </tr>
              ) : hosts.map((host) => (
                <tr key={host.id} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-tertiary-container text-on-tertiary-container font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {host.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-on-surface truncate">{host.name}</div>
                        <div className="text-xs text-on-surface-variant truncate">{host.email}</div>
                        <div className="text-xs text-on-surface-variant/80">{host.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium">{host.totalEvents} Event</td>
                  <td className="py-3 px-4 font-bold text-emerald-700">
                    Rp {host.balance.toLocaleString("id-ID")}
                    {host.pendingWithdrawalCount > 0 && (
                      <span className="ml-2 text-xs text-amber-600 font-medium">({host.pendingWithdrawalCount} pending)</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant">Rp {host.totalGiftsReceived.toLocaleString("id-ID")}</td>
                  <td className="py-3 px-4 text-on-surface-variant">Rp {host.totalWithdrawn.toLocaleString("id-ID")}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleNotif(host)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${host.allowNotifWa ? "bg-emerald-100 text-emerald-800" : "bg-surface-variant text-on-surface-variant"}`}
                    >
                      <span className="material-symbols-outlined text-sm">{host.allowNotifWa ? "notifications_active" : "notifications_off"}</span>
                      {host.allowNotifWa ? "Aktif" : "Nonaktif"}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedHost(host)}
                      className="h-8 w-8 p-0 rounded-lg text-primary hover:bg-primary-container"
                      title="Detail Host"
                    >
                      <span className="material-symbols-outlined text-lg">visibility</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden p-3 space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 rounded-xl bg-surface-container-low space-y-2">
                <div className="h-5 bg-surface-container-lowest rounded animate-pulse w-2/3" />
                <div className="h-4 bg-surface-container-lowest rounded animate-pulse w-1/2" />
              </div>
            ))
          ) : hosts.map((host) => (
            <div key={host.id} className="p-4 rounded-xl bg-surface-container-low space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container font-bold text-xs flex items-center justify-center">
                  {host.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-on-surface">{host.name}</div>
                  <div className="text-xs text-on-surface-variant">{host.email}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-outline-variant/20">
                <div>
                  <span className="text-on-surface-variant block">Saldo:</span>
                  <span className="font-bold text-emerald-700">Rp {host.balance.toLocaleString("id-ID")}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Event:</span>
                  <span className="font-medium">{host.totalEvents}</span>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="outline" size="sm" onClick={() => setSelectedHost(host)} className="h-8 text-xs rounded-xl">Detail</Button>
              </div>
            </div>
          ))}
        </div>

        <Pagination currentPage={meta.page} totalPages={meta.totalPages} totalItems={meta.total} pageSize={meta.limit} onPageChange={setPage} isLiveApi={!loading} />
      </div>

      {/* Host Detail Dialog */}
      <Dialog open={!!selectedHost} onOpenChange={() => setSelectedHost(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">event_available</span>
              Detail Host Penyelenggara
            </DialogTitle>
            <DialogDescription>Ringkasan keuangan dan aktivitas host di platform.</DialogDescription>
          </DialogHeader>
          {selectedHost && (
            <div className="space-y-3 my-2 text-sm">
              <div className="p-4 rounded-xl bg-surface-container-low flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-tertiary-container text-on-tertiary-container font-bold text-sm flex items-center justify-center">
                  {selectedHost.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-base text-on-surface">{selectedHost.name}</div>
                  <div className="text-xs text-on-surface-variant">{selectedHost.email}</div>
                  <div className="text-xs text-primary font-medium">{selectedHost.phone}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { label: "Saldo Amplop", value: `Rp ${selectedHost.balance.toLocaleString("id-ID")}`, bold: true, color: "text-emerald-700" },
                  { label: "Total Kado Diterima", value: `Rp ${selectedHost.totalGiftsReceived.toLocaleString("id-ID")}` },
                  { label: "Total Dicairkan", value: `Rp ${selectedHost.totalWithdrawn.toLocaleString("id-ID")}` },
                  { label: "Pending Withdrawal", value: `${selectedHost.pendingWithdrawalCount} permohonan`, color: selectedHost.pendingWithdrawalCount > 0 ? "text-amber-600" : undefined },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-xl bg-surface-container-low">
                    <span className="text-on-surface-variant block mb-1">{item.label}</span>
                    <span className={`font-semibold ${item.color ?? "text-on-surface"}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedHost(null)} className="rounded-xl w-full">Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
