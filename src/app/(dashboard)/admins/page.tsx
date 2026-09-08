"use client";

import { useState } from "react";
import { AdminUser } from "@/types/superadmin";
import { MOCK_ADMINS } from "@/lib/mock-superadmin-data";
import { toastManager } from "@/components/ui/toast";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AdminsManagementPage() {
  const [admins, setAdmins] = useState<AdminUser[]>(MOCK_ADMINS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    phone: "",
    role: "admin" as "admin" | "superadmin",
    password: "",
  });

  const handleUnlockAdmin = (adminId: number) => {
    setAdmins((prev) =>
      prev.map((a) =>
        a.id === adminId
          ? { ...a, failedAttempts: 0, lockedUntil: null, status: "active" }
          : a
      )
    );
    toastManager.success("Gembok akun telah dibuka dan counter login direset ke 0.");
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin.name || !newAdmin.email) {
      toastManager.error("Nama dan email wajib diisi.");
      return;
    }

    const created: AdminUser = {
      id: Date.now(),
      name: newAdmin.name,
      email: newAdmin.email,
      phone: newAdmin.phone,
      role: newAdmin.role,
      status: "active",
      failedAttempts: 0,
      lockedUntil: null,
      lastLoginAt: undefined,
      createdAt: new Date().toISOString(),
    };

    setAdmins((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    setNewAdmin({ name: "", email: "", phone: "", role: "admin", password: "" });
    toastManager.success(`Staf admin ${created.name} berhasil ditambahkan.`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-background">
              Manajemen Staf Administrator
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              Khusus Superadmin
            </span>
          </div>
          <p className="text-sm text-on-surface-variant mt-1">
            Kelola staf internal, wewenang akses panel, dan monitoring keamanan gembok login akun.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-primary text-on-primary shadow-sm"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          <span>Tambah Staf Admin</span>
        </Button>
      </div>

      {/* Security Banner Alert */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest border border-amber-200/60 bg-gradient-to-r from-amber-50/50 to-orange-50/30 flex items-start gap-3">
        <span className="material-symbols-outlined text-amber-600 text-2xl flex-shrink-0">
          security
        </span>
        <div className="text-xs text-on-surface leading-relaxed">
          <span className="font-bold text-amber-900 block mb-0.5">
            Protokol Keamanan Brute-Force PostgreSQL
          </span>
          Akun staf otomatis digembok (locked) selama 30 menit jika terjadi kegagalan sandi 3 kali berturut-turut. Superadmin memiliki wewenang untuk membuka gembok akun dan mereset counter percobaan login.
        </div>
      </div>

      {/* Admin Table */}
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-low/50 text-xs font-semibold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/20">
              <tr>
                <th className="py-3.5 px-4">Staf Admin</th>
                <th className="py-3.5 px-4">Tingkat Hak Akses</th>
                <th className="py-3.5 px-4">Status Akun</th>
                <th className="py-3.5 px-4">Percobaan Gagal</th>
                <th className="py-3.5 px-4">Status Gembok (Lock)</th>
                <th className="py-3.5 px-4">Login Terakhir</th>
                <th className="py-3.5 px-4 text-right">Aksi Keamanan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-on-surface">
              {admins.map((admin) => {
                const isLocked = !!admin.lockedUntil;

                return (
                  <tr key={admin.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container font-bold text-xs flex items-center justify-center">
                          {admin.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-on-surface">{admin.name}</div>
                          <div className="text-xs text-on-surface-variant">{admin.email}</div>
                          <div className="text-xs text-on-surface-variant/80">{admin.phone}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {admin.role === "superadmin" ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary text-on-primary">
                          Superadmin (Lead)
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-surface-variant text-on-surface-variant">
                          Staf Admin Ops
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {admin.status === "active" ? (
                        <StatusBadge variant="sukses" label="Aktif" />
                      ) : (
                        <StatusBadge variant="gagal" label="Nonaktif" />
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`font-semibold ${
                          admin.failedAttempts > 0 ? "text-error" : "text-on-surface-variant"
                        }`}
                      >
                        {admin.failedAttempts} / 3
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {isLocked ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-error-container text-on-error-container">
                          <span className="material-symbols-outlined text-sm">lock</span>
                          Terkunci s/d{" "}
                          {new Date(admin.lockedUntil!).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                          <span className="material-symbols-outlined text-sm">lock_open</span>
                          Aman
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-on-surface-variant">
                      {admin.lastLoginAt
                        ? new Date(admin.lastLoginAt).toLocaleString("id-ID", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Belum pernah"}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {isLocked ? (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleUnlockAdmin(admin.id)}
                          className="h-8 text-xs rounded-xl flex items-center gap-1 ml-auto"
                        >
                          <span className="material-symbols-outlined text-sm">key</span>
                          Buka Kunci
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toastManager.info(`Sandi staf ${admin.name} disetel ulang via email.`);
                          }}
                          className="h-8 text-xs rounded-xl"
                        >
                          Reset Sandi
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-outline-variant/20 p-3 space-y-3">
          {admins.map((admin) => (
            <div key={admin.id} className="p-4 rounded-xl bg-surface-container-low space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-on-surface">{admin.name}</div>
                  <div className="text-xs text-on-surface-variant">{admin.email}</div>
                </div>
                {admin.role === "superadmin" ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-on-primary">
                    Superadmin
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-surface-variant text-on-surface-variant">
                    Admin
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-outline-variant/20">
                <span className="text-on-surface-variant">Status Gembok:</span>
                {admin.lockedUntil ? (
                  <span className="text-error font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">lock</span> Terkunci
                  </span>
                ) : (
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">lock_open</span> Aman
                  </span>
                )}
              </div>

              <div className="flex justify-end pt-2">
                {admin.lockedUntil ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleUnlockAdmin(admin.id)}
                    className="h-8 text-xs rounded-xl w-full"
                  >
                    Buka Kunci Akun
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toastManager.info(`Sandi staf ${admin.name} direset.`)}
                    className="h-8 text-xs rounded-xl w-full"
                  >
                    Kirim Reset Sandi
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Admin Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">person_add</span>
              Tambah Staf Administrator
            </DialogTitle>
            <DialogDescription>
              Undang staf baru ke dalam sistem portal admin Momen Invite.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateAdmin} className="space-y-4 my-2">
            <div>
              <Label className="text-xs font-semibold">Nama Lengkap</Label>
              <Input
                placeholder="Contoh: Amanda Lestari"
                value={newAdmin.name}
                onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                className="mt-1 rounded-xl"
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Email Resmi Perusahaan</Label>
              <Input
                type="email"
                placeholder="staf@momeninvite.com"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                className="mt-1 rounded-xl"
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">No. WhatsApp</Label>
              <Input
                placeholder="081234567890"
                value={newAdmin.phone}
                onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                className="mt-1 rounded-xl"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Tingkat Hak Akses</Label>
              <select
                value={newAdmin.role}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, role: e.target.value as "admin" | "superadmin" })
                }
                className="mt-1 w-full h-10 px-3 rounded-xl bg-surface-container-low text-sm font-medium border-0 focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="admin">Staf Admin Operasional</option>
                <option value="superadmin">Superadmin (Akses Penuh)</option>
              </select>
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-xl"
              >
                Batal
              </Button>
              <Button type="submit" className="rounded-xl bg-primary text-on-primary">
                Simpan & Kirim Undangan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
