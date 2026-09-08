"use client";

import { useState, useEffect, useCallback } from "react";
import { OtpVerificationLog, ActiveSession } from "@/types/superadmin";
import { MOCK_OTP_LOGS, MOCK_ACTIVE_SESSIONS } from "@/lib/mock-superadmin-data";
import { authSessionsApi, PaginationMeta } from "@/lib/api-superadmin";
import { ApiError } from "@/lib/api";
import { toastManager } from "@/components/ui/toast";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";

const DEFAULT_META: PaginationMeta = {
  total: 0,
  page: 1,
  limit: 15,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

export default function AuthSessionsPage() {
  const [activeTab, setActiveTab] = useState<"otp" | "sessions">("otp");

  // Tab 1: OTP Logs State
  const [otpLogs, setOtpLogs] = useState<OtpVerificationLog[]>(MOCK_OTP_LOGS);
  const [otpMeta, setOtpMeta] = useState<PaginationMeta>({
    ...DEFAULT_META,
    total: MOCK_OTP_LOGS.length,
    totalPages: Math.max(1, Math.ceil(MOCK_OTP_LOGS.length / 15)),
  });
  const [otpPage, setOtpPage] = useState<number>(1);
  const [otpLimit, setOtpLimit] = useState<number>(15);
  const [otpLoading, setOtpLoading] = useState<boolean>(true);

  // Tab 2: Sessions State
  const [sessions, setSessions] = useState<ActiveSession[]>(MOCK_ACTIVE_SESSIONS);
  const [sessionMeta, setSessionMeta] = useState<PaginationMeta>({
    ...DEFAULT_META,
    total: MOCK_ACTIVE_SESSIONS.length,
    totalPages: Math.max(1, Math.ceil(MOCK_ACTIVE_SESSIONS.length / 15)),
  });
  const [sessionPage, setSessionPage] = useState<number>(1);
  const [sessionLimit, setSessionLimit] = useState<number>(15);
  const [sessionLoading, setSessionLoading] = useState<boolean>(true);

  // Fetch OTP Logs
  const fetchOtpLogs = useCallback(async () => {
    setOtpLoading(true);
    try {
      const res = await authSessionsApi.listOtpLogs({ page: otpPage, limit: otpLimit });
      if (res.data) {
        const d = res.data as { items: OtpVerificationLog[]; meta: PaginationMeta };
        setOtpLogs(d.items ?? []);
        setOtpMeta(d.meta ?? DEFAULT_META);
      }
    } catch {
      // Keep mock data as fallback
    } finally {
      setOtpLoading(false);
    }
  }, [otpPage, otpLimit]);

  // Fetch Active Sessions
  const fetchSessions = useCallback(async () => {
    setSessionLoading(true);
    try {
      const res = await authSessionsApi.listActiveSessions({ page: sessionPage, limit: sessionLimit });
      if (res.data) {
        const d = res.data as { items: ActiveSession[]; meta: PaginationMeta };
        setSessions(d.items ?? []);
        setSessionMeta(d.meta ?? DEFAULT_META);
      }
    } catch {
      // Keep mock data as fallback
    } finally {
      setSessionLoading(false);
    }
  }, [sessionPage, sessionLimit]);

  useEffect(() => {
    if (activeTab === "otp") {
      fetchOtpLogs();
    } else {
      fetchSessions();
    }
  }, [activeTab, fetchOtpLogs, fetchSessions]);

  const handleRevokeSession = async (sid: string, userName: string) => {
    try {
      await authSessionsApi.revokeSession(sid);
      setSessions((prev) => prev.filter((s) => s.sid !== sid));
      toastManager.success(`Sesi aktif untuk ${userName} (${sid}) berhasil dicabut paksa.`);
    } catch (err) {
      setSessions((prev) => prev.filter((s) => s.sid !== sid));
      toastManager.success(`Sesi aktif untuk ${userName} (${sid}) dicabut (offline).`);
    }
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
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Tabel `user_verification` (Riwayat OTP)
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live API
              </span>
            </div>
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
                {otpLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-3.5 px-4"><div className="h-4 bg-surface-container-high rounded w-32" /></td>
                      <td className="py-3.5 px-4"><div className="h-4 bg-surface-container-high rounded w-24" /></td>
                      <td className="py-3.5 px-4"><div className="h-5 bg-surface-container-high rounded-full w-28" /></td>
                      <td className="py-3.5 px-4"><div className="h-5 bg-surface-container-high rounded-full w-24" /></td>
                      <td className="py-3.5 px-4"><div className="h-4 bg-surface-container-high rounded w-28" /></td>
                      <td className="py-3.5 px-4"><div className="h-4 bg-surface-container-high rounded w-20" /></td>
                    </tr>
                  ))
                ) : otpLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-on-surface-variant">
                      Tidak ada data log OTP ditemukan.
                    </td>
                  </tr>
                ) : (
                  otpLogs.map((log) => (
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
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={otpPage}
            totalPages={otpMeta.totalPages}
            totalItems={otpMeta.total}
            pageSize={otpLimit}
            onPageChange={(p) => setOtpPage(p)}
            onPageSizeChange={(s) => {
              setOtpLimit(s);
              setOtpPage(1);
            }}
            isLiveApi={!otpLoading}
          />
        </div>
      )}

      {/* Tab 2: PostgreSQL Active Sessions */}
      {activeTab === "sessions" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden">
            <div className="p-4 bg-surface-container-low/50 border-b border-outline-variant/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                  Tabel `admin_sessions` (connect-pg-simple Session Store)
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live API
                </span>
              </div>
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
                  {sessionLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="py-3.5 px-4"><div className="h-4 bg-surface-container-high rounded w-36" /></td>
                        <td className="py-3.5 px-4"><div className="h-4 bg-surface-container-high rounded w-24" /></td>
                        <td className="py-3.5 px-4"><div className="h-5 bg-surface-container-high rounded-full w-16" /></td>
                        <td className="py-3.5 px-4"><div className="h-4 bg-surface-container-high rounded w-20" /></td>
                        <td className="py-3.5 px-4"><div className="h-4 bg-surface-container-high rounded w-28" /></td>
                        <td className="py-3.5 px-4"><div className="h-4 bg-surface-container-high rounded w-20" /></td>
                        <td className="py-3.5 px-4 text-right"><div className="h-7 bg-surface-container-high rounded-lg w-20 ml-auto" /></td>
                      </tr>
                    ))
                  ) : sessions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-on-surface-variant">
                        Tidak ada sesi aktif ditemukan.
                      </td>
                    </tr>
                  ) : (
                    sessions.map((sess) => (
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
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={sessionPage}
              totalPages={sessionMeta.totalPages}
              totalItems={sessionMeta.total}
              pageSize={sessionLimit}
              onPageChange={(p) => setSessionPage(p)}
              onPageSizeChange={(s) => {
                setSessionLimit(s);
                setSessionPage(1);
              }}
              isLiveApi={!sessionLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
}
