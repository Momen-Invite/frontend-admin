"use client";

import { useState } from "react";
import { OtpVerificationLog, ActiveSession } from "@/types/superadmin";
import { MOCK_OTP_LOGS, MOCK_ACTIVE_SESSIONS } from "@/lib/mock-superadmin-data";
import { toastManager } from "@/components/ui/toast";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";

export default function AuthSessionsPage() {
  const [activeTab, setActiveTab] = useState<"otp" | "sessions">("otp");
  const [otpLogs] = useState<OtpVerificationLog[]>(MOCK_OTP_LOGS);
  const [sessions, setSessions] = useState<ActiveSession[]>(MOCK_ACTIVE_SESSIONS);

  const handleRevokeSession = (sid: string, userName: string) => {
    setSessions((prev) => prev.filter((s) => s.sid !== sid));
    toastManager.success(`Sesi aktif untuk ${userName} (${sid}) berhasil dicabut paksa.`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-background">
            Log Verifikasi OTP & Sesi Aktif
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Monitoring pengiriman kode OTP pendaftaran serta sesi login PostgreSQL aktif staf admin.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="inline-flex rounded-2xl bg-surface-container-low p-1.5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("otp")}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "otp"
                ? "bg-surface-container-lowest text-primary font-bold shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-lg">pin</span>
            <span>Log OTP Verifikasi</span>
          </button>

          <button
            onClick={() => setActiveTab("sessions")}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "sessions"
                ? "bg-surface-container-lowest text-primary font-bold shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-lg">devices</span>
            <span>Sesi Aktif PostgreSQL ({sessions.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: OTP Logs */}
      {activeTab === "otp" && (
        <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden">
          <div className="p-4 bg-surface-container-low/50 border-b border-outline-variant/20 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Tabel `user_verification` (Riwayat OTP)
            </span>
            <span className="text-xs text-on-surface-variant">
              Masa berlaku default 5 menit
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container-low/20 text-xs font-semibold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/20">
                <tr>
                  <th className="py-3 px-4">Tujuan (No WA / Email)</th>
                  <th className="py-3 px-4">Kanal</th>
                  <th className="py-3 px-4">Tujuan Penggunaan</th>
                  <th className="py-3 px-4">Status Penggunaan</th>
                  <th className="py-3 px-4">Waktu Dikirim</th>
                  <th className="py-3 px-4">Waktu Digunakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 text-on-surface text-xs">
                {otpLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-on-surface">
                      {log.target}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <span className="material-symbols-outlined text-base text-primary">
                          {log.channel === "whatsapp" ? "chat" : "mail"}
                        </span>
                        {log.channel === "whatsapp" ? "WhatsApp (Fonnte)" : "Email (SMTP)"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full font-semibold bg-surface-variant text-on-surface-variant">
                        {log.purpose === "register"
                          ? "Pendaftaran Akun Baru"
                          : log.purpose === "reset_password"
                          ? "Lupa Password"
                          : "2FA Login"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {log.usedAt ? (
                        <StatusBadge variant="sukses" label="Berhasil Diverifikasi" />
                      ) : log.isExpired ? (
                        <StatusBadge variant="gagal" label="Kadaluarsa (Expired)" />
                      ) : (
                        <StatusBadge variant="pending" label="Menunggu Input" />
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-on-surface-variant">
                      {new Date(log.createdAt).toLocaleString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-on-surface-variant">
                      {log.usedAt
                        ? new Date(log.usedAt).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: PostgreSQL Active Sessions */}
      {activeTab === "sessions" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden">
            <div className="p-4 bg-surface-container-low/50 border-b border-outline-variant/20 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Tabel `admin_sessions` (connect-pg-simple Session Store)
              </span>
              <span className="text-xs text-on-surface-variant">
                Sesi kadaluarsa otomatis dihapus oleh scheduler
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-container-low/20 text-xs font-semibold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/20">
                  <tr>
                    <th className="py-3 px-4">Session ID</th>
                    <th className="py-3 px-4">Staf Admin</th>
                    <th className="py-3 px-4">Peran</th>
                    <th className="py-3 px-4">IP Address</th>
                    <th className="py-3 px-4">Browser & Perangkat</th>
                    <th className="py-3 px-4">Masa Berlaku</th>
                    <th className="py-3 px-4 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 text-on-surface text-xs">
                  {sessions.map((sess) => (
                    <tr key={sess.sid} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-primary font-semibold">
                        {sess.sid}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-on-surface">
                        {sess.userName}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-primary-container text-on-primary-container font-bold text-[10px] uppercase">
                          {sess.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-on-surface-variant">
                        {sess.ipAddress}
                      </td>

                      <td className="py-3.5 px-4 text-on-surface-variant">
                        {sess.deviceInfo}
                      </td>

                      <td className="py-3.5 px-4 text-on-surface-variant">
                        s/d{" "}
                        {new Date(sess.expiresAt).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRevokeSession(sess.sid, sess.userName)}
                          className="h-7 text-xs rounded-lg"
                        >
                          Revoke Sesi
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
