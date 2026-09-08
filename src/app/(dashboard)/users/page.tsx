"use client";

import { useState, useMemo } from "react";
import { User, UserStatus, UserRole } from "@/types/superadmin";
import { MOCK_USERS } from "@/lib/mock-superadmin-data";
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

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToToggleBan, setUserToToggleBan] = useState<User | null>(null);

  // Filters
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.phone.includes(searchQuery);

      const matchStatus =
        statusFilter === "all" ? true : u.status === statusFilter;

      const matchRole =
        roleFilter === "all" ? true : u.role === roleFilter;

      return matchSearch && matchStatus && matchRole;
    });
  }, [users, searchQuery, statusFilter, roleFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = users.length;
    const hosts = users.filter((u) => u.role === "host").length;
    const active = users.filter((u) => u.status === "active").length;
    const banned = users.filter((u) => u.status === "banned").length;
    return { total, hosts, active, banned };
  }, [users]);

  // Handler for toggle ban
  const handleConfirmBanToggle = () => {
    if (!userToToggleBan) return;

    const newStatus: UserStatus =
      userToToggleBan.status === "banned" ? "active" : "banned";

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userToToggleBan.id ? { ...u, status: newStatus } : u
      )
    );

    if (newStatus === "banned") {
      toastManager.error(`Akun ${userToToggleBan.name} berhasil diblokir.`);
    } else {
      toastManager.success(`Akun ${userToToggleBan.name} telah diaktifkan kembali.`);
    }

    setUserToToggleBan(null);
  };

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

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toastManager.promise(
                new Promise((res) => setTimeout(res, 1200)),
                {
                  loading: "Mengekspor data pengguna...",
                  success: () => "Data pengguna berhasil diekspor ke CSV.",
                  error: () => "Gagal mengekspor data.",
                }
              );
            }}
            className="flex items-center gap-2 rounded-xl"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            <span>Ekspor CSV</span>
          </Button>

          <Button
            size="sm"
            onClick={() => {
              setUsers(MOCK_USERS);
              toastManager.info("Data pengguna telah dimutakhirkan.");
            }}
            className="flex items-center gap-2 rounded-xl bg-primary text-on-primary"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
            <span>Segarkan</span>
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Pengguna</span>
            <span className="material-symbols-outlined text-primary text-xl">group</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-on-surface">{stats.total}</div>
            <div className="text-xs text-on-surface-variant mt-0.5">Semua tipe akun</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Host Penyelenggara</span>
            <span className="material-symbols-outlined text-tertiary text-xl">event_available</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-on-surface">{stats.hosts}</div>
            <div className="text-xs text-emerald-600 font-medium mt-0.5">Pemilik Undangan</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Akun Aktif</span>
            <span className="material-symbols-outlined text-emerald-600 text-xl">check_circle</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-on-surface">{stats.active}</div>
            <div className="text-xs text-on-surface-variant mt-0.5">Siap bertransaksi</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Akun Diblokir</span>
            <span className="material-symbols-outlined text-error text-xl">block</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-error">{stats.banned}</div>
            <div className="text-xs text-error/80 mt-0.5">Perlu perhatian</div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
              search
            </span>
            <Input
              type="text"
              placeholder="Cari nama, email, atau no WhatsApp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-surface-container-low border-0"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Tabs */}
            <div className="inline-flex rounded-xl bg-surface-container-low p-1 text-xs font-medium">
              {[
                { id: "all", label: "Semua Status" },
                { id: "active", label: "Aktif" },
                { id: "banned", label: "Banned" },
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

            {/* Role Select */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-9 px-3 rounded-xl bg-surface-container-low text-xs text-on-surface font-medium border-0 focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="all">Semua Peran</option>
              <option value="host">Host Penyelenggara</option>
              <option value="guest_registered">Tamu Terdaftar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table & Cards */}
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
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl block mb-2 opacity-50">
                      person_off
                    </span>
                    Tidak ada pengguna yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
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

                    <td className="py-3 px-4 font-medium">
                      {user.totalOrders ?? 0} Undangan
                    </td>

                    <td className="py-3 px-4 font-medium text-emerald-700">
                      Rp {(user.hostBalance ?? 0).toLocaleString("id-ID")}
                    </td>

                    <td className="py-3 px-4 text-xs text-on-surface-variant">
                      {new Date(user.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
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
                          className={`h-8 w-8 p-0 rounded-lg ${
                            user.status === "banned"
                              ? "text-emerald-600 hover:bg-emerald-50"
                              : "text-error hover:bg-error-container/20"
                          }`}
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
          {filteredUsers.length === 0 ? (
            <div className="py-8 text-center text-on-surface-variant">
              Tidak ada pengguna yang cocok.
            </div>
          ) : (
            filteredUsers.map((user) => (
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
                    <span className="font-medium text-on-surface">
                      {user.role === "host" ? "Host" : "Tamu"}
                    </span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block">Saldo Kado:</span>
                    <span className="font-semibold text-emerald-700">
                      Rp {(user.hostBalance ?? 0).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedUser(user)}
                    className="h-8 text-xs rounded-xl"
                  >
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
                  <span className="font-bold text-base text-on-surface">
                    {selectedUser.totalOrders ?? 0}
                  </span>
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

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setSelectedUser(null)}
              className="rounded-xl w-full"
            >
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
              <span
                className={`material-symbols-outlined ${
                  userToToggleBan?.status === "banned" ? "text-emerald-600" : "text-error"
                }`}
              >
                {userToToggleBan?.status === "banned" ? "lock_open" : "warning"}
              </span>
              {userToToggleBan?.status === "banned" ? "Buka Blokir Akun" : "Konfirmasi Blokir Akun"}
            </DialogTitle>
            <DialogDescription className="text-xs pt-1">
              {userToToggleBan?.status === "banned"
                ? `Apakah Anda yakin ingin membuka pemblokiran akun ${userToToggleBan?.name}? Pengguna akan dapat login kembali.`
                : `Apakah Anda yakin ingin memblokir akun ${userToToggleBan?.name}? Pengguna tidak akan dapat mengakses fitur undangan maupun bertransaksi.`}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUserToToggleBan(null)}
              className="rounded-xl"
            >
              Batal
            </Button>
            <Button
              variant={userToToggleBan?.status === "banned" ? "default" : "destructive"}
              size="sm"
              onClick={handleConfirmBanToggle}
              className="rounded-xl"
            >
              {userToToggleBan?.status === "banned" ? "Buka Blokir" : "Ya, Blokir Akun"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
