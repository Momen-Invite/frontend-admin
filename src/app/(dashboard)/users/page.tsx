"use client";

import { useState, useCallback, useEffect } from "react";
import { User, UserStatus } from "@/types/superadmin";
import { usersApi, PaginationMeta } from "@/lib/api-superadmin";
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

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToToggleBan, setUserToToggleBan] = useState<User | null>(null);
  const [banLoading, setBanLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await usersApi.list({
        page,
        limit: 15,
        search: searchQuery || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        role: roleFilter !== "all" ? roleFilter : undefined,
      });
      setUsers((res.data as { items: User[]; meta: PaginationMeta }).items ?? []);
      setMeta((res.data as { items: User[]; meta: PaginationMeta }).meta ?? DEFAULT_META);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Gagal memuat data pengguna.";
      toastManager.error(msg);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, statusFilter, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset ke page 1 saat filter berubah
  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, roleFilter]);

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setPage(1);
  };

  const handleConfirmBanToggle = async () => {
    if (!userToToggleBan) return;
    setBanLoading(true);
    try {
      const isBanned = userToToggleBan.status === "banned";
      if (isBanned) {
        await usersApi.unban(userToToggleBan.id);
        toastManager.success(`Akun ${userToToggleBan.name} berhasil dibuka blokirnya.`);
      } else {
        await usersApi.ban(userToToggleBan.id);
        toastManager.error(`Akun ${userToToggleBan.name} berhasil diblokir.`);
      }
      setUserToToggleBan(null);
      fetchUsers();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Gagal mengubah status akun.";
      toastManager.error(msg);
    } finally {
      setBanLoading(false);
    }
  };

  const activeCount = users.filter((u) => u.status === "active").length;
  const bannedCount = users.filter((u) => u.status === "banned").length;
  const hostCount = users.filter((u) => u.role === "host").length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-background">
            Manajemen Pengguna
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Pantau dan kelola seluruh akun pengguna, verifikasi kontak, dan kontrol aksesibilitas.
          </p>
        </div>

        <Button
          size="sm"
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-primary text-on-primary"
        >
          <span className="material-symbols-outlined text-lg">refresh</span>
          <span>Segarkan</span>
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Pengguna", value: meta.total, icon: "group", color: "text-primary", sub: "Semua tipe akun" },
          { label: "Host Penyelenggara", value: hostCount, icon: "event_available", color: "text-tertiary", sub: "Pemilik Undangan" },
          { label: "Akun Aktif", value: activeCount, icon: "check_circle", color: "text-emerald-600", sub: "Siap bertransaksi" },
          { label: "Akun Diblokir", value: bannedCount, icon: "block", color: "text-error", sub: "Perlu perhatian" },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-on-surface-variant mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">{stat.label}</span>
              <span className={`material-symbols-outlined text-xl ${stat.color}`}>{stat.icon}</span>
            </div>
            <div>
              <div className={`text-2xl font-bold ${stat.color === "text-error" && bannedCount > 0 ? "text-error" : "text-on-surface"}`}>{stat.value}</div>
              <div className="text-xs text-on-surface-variant mt-0.5">{stat.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md flex gap-2">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                search
              </span>
              <Input
                type="text"
                placeholder="Cari nama, email, atau no WhatsApp..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 h-10 rounded-xl bg-surface-container-low border-0"
              />
            </div>
            <Button size="sm" onClick={handleSearch} className="h-10 rounded-xl">Cari</Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl bg-surface-container-low p-1 text-xs font-medium">
              {[
                { id: "all", label: "Semua Status" },
                { id: "active", label: "Aktif" },
                { id: "banned", label: "Banned" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setStatusFilter(tab.id); setPage(1); }}
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

            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              className="h-9 px-3 rounded-xl bg-surface-container-low text-xs text-on-surface font-medium border-0 focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="all">Semua Peran</option>
              <option value="host">Host Penyelenggara</option>
              <option value="guest_registered">Tamu Terdaftar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-low/50 text-xs font-semibold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/20">
              <tr>
                <th className="py-3.5 px-4">Pengguna</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status Akun</th>
                <th className="py-3.5 px-4">Verifikasi</th>
                <th className="py-3.5 px-4">Total Pesanan</th>
                <th className="py-3.5 px-4">Saldo Kado</th>
                <th className="py-3.5 px-4">Tgl Daftar</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-on-surface">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="py-3 px-4">
                        <div className="h-4 bg-surface-container-low rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl block mb-2 opacity-50">person_off</span>
                    Tidak ada pengguna yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-on-surface truncate">{user.name}</div>
                          <div className="text-xs text-on-surface-variant truncate">{user.email}</div>
                          <div className="text-xs text-on-surface-variant/80">{user.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-variant text-on-surface-variant">
                        {user.role === "host" ? "Host Penyelenggara" : "Tamu Terdaftar"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {user.status === "active" ? (
                        <StatusBadge variant="sukses" label="Aktif" />
                      ) : (
                        <StatusBadge variant="gagal" label="Banned" />
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {user.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                          <span className="material-symbols-outlined text-sm filled">verified</span>
                          Terverifikasi
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-medium">
                          <span className="material-symbols-outlined text-sm">hourglass_empty</span>
                          Belum
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium">{user.totalOrders ?? 0} Undangan</td>
                    <td className="py-3 px-4 font-medium text-emerald-700">
                      Rp {(user.hostBalance ?? 0).toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-4 text-xs text-on-surface-variant">
                      {new Date(user.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                          className="h-8 w-8 p-0 rounded-lg text-primary hover:bg-primary-container"
                          title="Detail Pengguna"
                        >
                          <span className="material-symbols-outlined text-lg">visibility</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setUserToToggleBan(user)}
                          className={`h-8 w-8 p-0 rounded-lg ${user.status === "banned" ? "text-emerald-600 hover:bg-emerald-50" : "text-error hover:bg-error-container/20"}`}
                          title={user.status === "banned" ? "Buka Blokir" : "Blokir Akun"}
                        >
                          <span className="material-symbols-outlined text-lg">
                            {user.status === "banned" ? "lock_open" : "lock"}
                          </span>
                        </Button>
                      </div>
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
              <div key={i} className="p-4 rounded-xl bg-surface-container-low space-y-2">
                <div className="h-5 bg-surface-container-lowest rounded animate-pulse w-2/3" />
                <div className="h-4 bg-surface-container-lowest rounded animate-pulse w-1/2" />
              </div>
            ))
          ) : users.length === 0 ? (
            <div className="py-8 text-center text-on-surface-variant">Tidak ada pengguna yang cocok.</div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="p-4 rounded-xl bg-surface-container-low space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container font-bold text-xs flex items-center justify-center">
                      {user.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-on-surface">{user.name}</div>
                      <div className="text-xs text-on-surface-variant">{user.email}</div>
                    </div>
                  </div>
                  {user.status === "active" ? (
                    <StatusBadge variant="sukses" label="Aktif" />
                  ) : (
                    <StatusBadge variant="gagal" label="Banned" />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-outline-variant/20">
                  <div>
                    <span className="text-on-surface-variant block">Peran:</span>
                    <span className="font-medium text-on-surface">{user.role === "host" ? "Host" : "Tamu"}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block">Saldo Kado:</span>
                    <span className="font-semibold text-emerald-700">Rp {(user.hostBalance ?? 0).toLocaleString("id-ID")}</span>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)} className="h-8 text-xs rounded-xl">
                    Detail Profil
                  </Button>
                  <Button
                    variant={user.status === "banned" ? "default" : "destructive"}
                    size="sm"
                    onClick={() => setUserToToggleBan(user)}
                    className="h-8 text-xs rounded-xl"
                  >
                    {user.status === "banned" ? "Buka Blokir" : "Blokir"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          pageSize={meta.limit}
          onPageChange={setPage}
          isLiveApi={!loading}
        />
      </div>

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">account_circle</span>
              Detail Pengguna
            </DialogTitle>
            <DialogDescription>
              Informasi lengkap akun dan rekam jejak pengguna di platform.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 my-2 text-sm">
              <div className="p-4 rounded-xl bg-surface-container-low flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container font-bold text-sm flex items-center justify-center">
                  {selectedUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-base text-on-surface">{selectedUser.name}</div>
                  <div className="text-xs text-on-surface-variant">{selectedUser.email}</div>
                  <div className="text-xs text-primary font-medium">{selectedUser.phone}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-surface-container-low">
                  <span className="text-on-surface-variant block mb-1">Status Verifikasi</span>
                  <span className="font-semibold text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-emerald-600">
                      {selectedUser.isVerified ? "check_circle" : "cancel"}
                    </span>
                    {selectedUser.isVerified ? "Nomor Terverifikasi" : "Belum Verifikasi"}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low">
                  <span className="text-on-surface-variant block mb-1">Total Undangan Dibuat</span>
                  <span className="font-bold text-base text-on-surface">{selectedUser.totalOrders ?? 0}</span>
                </div>
              </div>

              {selectedUser.address && (
                <div className="p-3 rounded-xl bg-surface-container-low text-xs">
                  <span className="text-on-surface-variant block mb-1">Alamat Domisili</span>
                  <span className="font-medium text-on-surface">{selectedUser.address}</span>
                </div>
              )}

              <div className="p-3 rounded-xl bg-surface-container-low text-xs flex justify-between items-center">
                <span className="text-on-surface-variant">Saldo Amplop Digital:</span>
                <span className="font-bold text-emerald-700 text-sm">
                  Rp {(selectedUser.hostBalance ?? 0).toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedUser(null)} className="rounded-xl w-full">
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Ban/Unban Dialog */}
      <Dialog open={!!userToToggleBan} onOpenChange={() => setUserToToggleBan(null)}>
        <DialogContent className="max-w-sm rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-on-surface">
              <span className={`material-symbols-outlined ${userToToggleBan?.status === "banned" ? "text-emerald-600" : "text-error"}`}>
                {userToToggleBan?.status === "banned" ? "lock_open" : "warning"}
              </span>
              {userToToggleBan?.status === "banned" ? "Buka Blokir Akun" : "Konfirmasi Blokir Akun"}
            </DialogTitle>
            <DialogDescription className="text-xs pt-1">
              {userToToggleBan?.status === "banned"
                ? `Apakah Anda yakin ingin membuka pemblokiran akun ${userToToggleBan?.name}?`
                : `Apakah Anda yakin ingin memblokir akun ${userToToggleBan?.name}? Pengguna tidak akan dapat mengakses fitur undangan.`}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUserToToggleBan(null)}
              className="rounded-xl"
              disabled={banLoading}
            >
              Batal
            </Button>
            <Button
              variant={userToToggleBan?.status === "banned" ? "default" : "destructive"}
              size="sm"
              onClick={handleConfirmBanToggle}
              disabled={banLoading}
              className="rounded-xl"
            >
              {banLoading ? "Memproses..." : userToToggleBan?.status === "banned" ? "Buka Blokir" : "Ya, Blokir Akun"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
