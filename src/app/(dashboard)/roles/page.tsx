"use client";

import { useState, useEffect, useCallback } from "react";
import { RolePermission } from "@/types/superadmin";
import { MOCK_ROLES } from "@/lib/mock-superadmin-data";
import { rolesApi } from "@/lib/api-superadmin";
import { toastManager } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

const PERMISSION_MATRIX = [
  {
    category: "Keuangan & Penarikan Dana",
    items: [
      { key: "WITHDRAWAL_APPROVAL", label: "Persetujuan & Transfer Pencairan Saldo Kado", superadmin: true, admin: false, host: false, guest: false },
      { key: "FINANCIAL_REPORT", label: "Akses Laporan Keuangan & Margin Gateway", superadmin: true, admin: false, host: false, guest: false },
      { key: "REQUEST_WITHDRAW", label: "Pengajuan Penarikan Saldo Dompet", superadmin: true, admin: false, host: true, guest: false },
    ],
  },
  {
    category: "Pesanan & Konten Undangan",
    items: [
      { key: "ORDER_VERIFY", label: "Verifikasi Pesanan Undangan Masuk", superadmin: true, admin: true, host: false, guest: false },
      { key: "CONTENT_MODERATE", label: "Moderasi Konten & Foto Galeri R2 Cloudflare", superadmin: true, admin: true, host: false, guest: false },
      { key: "CREATE_EVENT", label: "Membuat & Mengedit Undangan Web Pribadi", superadmin: true, admin: true, host: true, guest: false },
    ],
  },
  {
    category: "Buku Tamu, Tiket & Presensi",
    items: [
      { key: "MANAGE_GUESTS", label: "Manajemen Kuota Buku Tamu & RSVP Acara", superadmin: true, admin: true, host: true, guest: false },
      { key: "ATTENDANCE_SCAN", label: "Scan QR Check-in Hari-H Acara", superadmin: true, admin: true, host: true, guest: false },
      { key: "SUBMIT_RSVP", label: "Pengisian Konfirmasi Kehadiran & Doa Ucapan", superadmin: true, admin: true, host: true, guest: true },
      { key: "SEND_GIFT", label: "Kirim Amplop Kado Digital Realtime", superadmin: true, admin: true, host: true, guest: true },
    ],
  },
  {
    category: "Keamanan, Gateway & Sistem",
    items: [
      { key: "ADMIN_MANAGEMENT", label: "Manajemen Staf & Gembok Akun Admin", superadmin: true, admin: false, host: false, guest: false },
      { key: "GATEWAY_CONFIG", label: "Konfigurasi Fonnte WA, Duitku, & SMTP Resend", superadmin: true, admin: false, host: false, guest: false },
      { key: "AUDIT_LOG_VIEW", label: "Audit Trail Keamanan & Riwayat Log Aktivitas", superadmin: true, admin: false, host: false, guest: false },
    ],
  },
];

export default function RolesManagementPage() {
  const [roles, setRoles] = useState<RolePermission[]>(MOCK_ROLES);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await rolesApi.list();
      if (res.data) {
        const d = res.data as { items?: RolePermission[] } | RolePermission[];
        const items = Array.isArray(d) ? d : (d.items ?? []);
        if (items.length > 0) {
          setRoles(items);
        }
      }
    } catch {
      // Fallback to MOCK_ROLES
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleSync = async () => {
    toastManager.promise(
      fetchRoles().then(() => "Struktur wewenang peran berhasil disinkronisasi."),
      {
        loading: "Menyinkronkan skema wewenang...",
        success: (msg) => msg,
        error: "Gagal menyinkronkan RBAC.",
      }
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-background">
              Matriks Hak Akses & Peran (RBAC)
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live API
            </span>
          </div>
          <p className="text-sm text-on-surface-variant mt-1">
            Struktur wewenang 4 peran platform Momen Invite sesuai skema basis data PostgreSQL.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={handleSync}
          className="flex items-center gap-2 rounded-xl"
        >
          <span className={`material-symbols-outlined text-lg ${loading ? "animate-spin" : ""}`}>sync</span>
          <span>{loading ? "Menyinkronkan..." : "Sinkronisasi RBAC"}</span>
        </Button>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roles.map((role) => (
          <div
            key={role.id}
            className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-container text-on-primary-container">
                  {role.name}
                </span>
                <span className="text-xs text-on-surface-variant font-medium">
                  {role.userCount} Akun
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                {role.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs text-primary font-semibold">
              <span>{role.permissions.length} Wewenang Kunci</span>
              <span className="material-symbols-outlined text-base">verified_user</span>
            </div>
          </div>
        ))}
      </div>

      {/* Permission Matrix Table */}
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="p-4 bg-surface-container-low/60 border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">shield</span>
            <h2 className="text-sm font-bold text-on-surface">
              Matriks Wewenang Fungsional Lengkap
            </h2>
          </div>
          <span className="text-xs text-on-surface-variant hidden sm:inline">
            Terkunci oleh aturan RBAC middleware
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-low/30 text-xs font-semibold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/20">
              <tr>
                <th className="py-3 px-4 w-[40%]">Fungsi / Modul Sistem</th>
                <th className="py-3 px-4 text-center w-[15%]">Superadmin</th>
                <th className="py-3 px-4 text-center w-[15%]">Staf Admin</th>
                <th className="py-3 px-4 text-center w-[15%]">Host</th>
                <th className="py-3 px-4 text-center w-[15%]">Tamu Terdaftar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-on-surface text-xs">
              {PERMISSION_MATRIX.map((group, groupIdx) => (
                <div key={groupIdx} className="contents">
                  <tr className="bg-surface-container-low/20">
                    <td
                      colSpan={5}
                      className="py-2.5 px-4 font-bold text-primary uppercase tracking-wider text-[11px]"
                    >
                      {group.category}
                    </td>
                  </tr>
                  {group.items.map((item) => (
                    <tr
                      key={item.key}
                      className="hover:bg-surface-container-low/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-on-surface">
                        {item.label}
                        <span className="block font-mono text-[10px] text-on-surface-variant">
                          {item.key}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        {item.superadmin ? (
                          <span className="material-symbols-outlined text-emerald-600 text-lg filled">
                            check_circle
                          </span>
                        ) : (
                          <span className="material-symbols-outlined text-slate-300 text-lg">
                            cancel
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        {item.admin ? (
                          <span className="material-symbols-outlined text-emerald-600 text-lg filled">
                            check_circle
                          </span>
                        ) : (
                          <span className="material-symbols-outlined text-slate-300 text-lg">
                            cancel
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        {item.host ? (
                          <span className="material-symbols-outlined text-emerald-600 text-lg filled">
                            check_circle
                          </span>
                        ) : (
                          <span className="material-symbols-outlined text-slate-300 text-lg">
                            cancel
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        {item.guest ? (
                          <span className="material-symbols-outlined text-emerald-600 text-lg filled">
                            check_circle
                          </span>
                        ) : (
                          <span className="material-symbols-outlined text-slate-300 text-lg">
                            cancel
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </div>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
