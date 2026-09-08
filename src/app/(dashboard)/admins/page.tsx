"use client";

import { useState, useCallback, useEffect } from "react";
import { AdminUser } from "@/types/superadmin";
import { adminsApi, PaginationMeta } from "@/lib/api-superadmin";
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

const DEFAULT_META: PaginationMeta = {
  total: 0, page: 1, limit: 15, totalPages: 1, hasNextPage: false, hasPrevPage: false,
};

export default function AdminsManagementPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: "", email: "", phone: "", role: "admin" as "admin" | "superadmin", password: "",
  });

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminsApi.list({ page, limit: 15 });
      const d = res.data as { items: AdminUser[]; meta: PaginationMeta };
      setAdmins(d.items ?? []);
      setMeta(d.meta ?? DEFAULT_META);
    } catch (err) {
      toastManager.error(err instanceof ApiError ? err.message : "Gagal memuat data admin.");
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  const handleUnlockAdmin = async (adminId: number) => {
    try {
      await adminsApi.unlock(adminId);
      toastManager.success("Gembok akun telah dibuka dan counter login direset ke 0.");
      fetchAdmins();
    } catch (err) {
      toastManager.error(err instanceof ApiError ? err.message : "Gagal membuka kunci akun.");
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      toastManager.error("Nama, email, dan password wajib diisi.");
      return;
    }
    setCreating(true);
    try {
      await adminsApi.create(newAdmin);
      toastManager.success(`Akun admin ${newAdmin.name} berhasil dibuat.`);
      setIsAddModalOpen(false);
      setNewAdmin({ name: "", email: "", phone: "", role: "admin", password: "" });
      fetchAdmins();
    } catch (err) {
      toastManager.error(err instanceof ApiError ? err.message : "Gagal membuat admin baru.");
    } finally {
      setCreating(false);
    }
  };

  const lockedAdmins = admins.filter((a) => a.failedAttempts >= 5 || a.lockedUntil);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-background">
            Manajemen Admin
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Kelola akun staf administrator, monitor keamanan login, dan kontrol akses panel.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={fetchAdmins} disabled={loading} className="rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">refresh</span>
            <span className="hidden sm:inline">Segarkan</span>
          </Button>
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-primary text-on-primary"
          >
            <span className="material-symbols-outlined text-lg">person_add</span>
            <span>Tambah Admin</span>
          </Button>
        </div>
      </div>

      {/* Alert Locked Admins */}
      {lockedAdmins.length > 0 && !loading && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-error-container/20 border border-error/30">
          <span className="material-symbols-outlined text-error text-2xl">warning</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-error">
              {lockedAdmins.length} Akun Terkunci Brute-Force
            </p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {lockedAdmins.map((a) => a.name).join(", ")} — memerlukan intervensi manual.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Total Admin", value: meta.total, icon: "admin_panel_settings", color: "text-primary" },
          { label: "Akun Terkunci", value: lockedAdmins.length, icon: "lock", color: "text-error" },
          { label: "Aktif", value: admins.filter((a) => a.status === "active").length, icon: "check_circle", color: "text-emerald-600" },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-on-surface-variant mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">{s.label}</span>
              <span className={`material-symbols-outlined text-xl ${s.color}`}>{s.icon}</span>
            </div>
            <div className="text-2xl font-bold text-on-surface">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-low/50 text-xs font-semibold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/20">
              <tr>
                <th className="py-3.5 px-4">Admin</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Login Gagal</th>
                <th className="py-3.5 px-4">Terakhir Login</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-on-surface">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="py-3 px-4">
                        <div className="h-4 bg-surface-container-low rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl block mb-2 opacity-50">admin_panel_settings</span>
                    Belum ada data admin.
                  </td>
                </tr>
              ) : (
                admins.map((admin) => {
                  const isLocked = !!(admin.failedAttempts >= 5 || admin.lockedUntil);
                  return (
                    <tr key={admin.id} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container font-bold text-xs flex items-center justify-center flex-shrink-0">
                            {admin.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-on-surface truncate">{admin.name}</div>
                            <div className="text-xs text-on-surface-variant truncate">{admin.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${admin.role === "superadmin" ? "bg-primary-container text-on-primary-container" : "bg-surface-variant text-on-surface-variant"}`}>
                          {admin.role === "superadmin" ? "Superadmin" : "Admin"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {isLocked ? <StatusBadge variant="gagal" label="Terkunci" /> : <StatusBadge variant="sukses" label="Aktif" />}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-bold ${admin.failedAttempts >= 3 ? "text-error" : "text-on-surface"}`}>
                          {admin.failedAttempts}×
                        </span>
                        {admin.lockedUntil && (
                          <div className="text-xs text-error/80">
                            s/d {new Date(admin.lockedUntil).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs text-on-surface-variant">
                        {admin.lastLoginAt
                          ? new Date(admin.lastLoginAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                          : "—"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isLocked && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUnlockAdmin(admin.id)}
                            className="h-8 px-3 rounded-lg text-emerald-600 hover:bg-emerald-50 text-xs font-medium"
                          >
                            <span className="material-symbols-outlined text-sm mr-1">lock_open</span>
                            Buka Kunci
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          pageSize={meta.limit}
          onPageChange={setPage}
          isLiveApi={!loading}
        />
      </div>

      {/* Add Admin Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">person_add</span>
              Tambah Admin Baru
            </DialogTitle>
            <DialogDescription>Buat akun staf administrator untuk mengakses panel ini.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateAdmin} className="space-y-4 my-2">
            {[
              { id: "name", label: "Nama Lengkap", type: "text", placeholder: "Nama admin" },
              { id: "email", label: "Alamat Email", type: "email", placeholder: "admin@example.com" },
              { id: "phone", label: "No. WhatsApp", type: "tel", placeholder: "08xxx" },
              { id: "password", label: "Password", type: "password", placeholder: "Min. 8 karakter" },
            ].map((field) => (
              <div key={field.id} className="space-y-1.5">
                <Label htmlFor={field.id} className="text-xs font-semibold">{field.label}</Label>
                <Input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={newAdmin[field.id as keyof typeof newAdmin]}
                  onChange={(e) => setNewAdmin((p) => ({ ...p, [field.id]: e.target.value }))}
                  className="rounded-xl h-10"
                />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label htmlFor="role" className="text-xs font-semibold">Role</Label>
              <select
                id="role"
                value={newAdmin.role}
                onChange={(e) => setNewAdmin((p) => ({ ...p, role: e.target.value as "admin" | "superadmin" }))}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-sm border border-outline-variant/30 focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="admin">Admin (Staf Operasional)</option>
                <option value="superadmin">Superadmin (Pemilik Platform)</option>
              </select>
            </div>
            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)} className="rounded-xl" disabled={creating}>Batal</Button>
              <Button type="submit" className="rounded-xl bg-primary text-on-primary" disabled={creating}>
                {creating ? "Membuat..." : "Buat Akun Admin"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
