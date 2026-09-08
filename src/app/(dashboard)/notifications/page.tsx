"use client";

import { useState } from "react";
import { NotificationLog, DeadNotification } from "@/types/superadmin";
import { MOCK_NOTIF_LOGS, MOCK_DEAD_NOTIFICATIONS } from "@/lib/mock-superadmin-data";
import { toastManager } from "@/components/ui/toast";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";

export default function NotificationLogsPage() {
  const [activeTab, setActiveTab] = useState<"whatsapp" | "email" | "dead">("whatsapp");
  const [notifLogs] = useState<NotificationLog[]>(MOCK_NOTIF_LOGS);
  const [deadNotifs, setDeadNotifs] = useState<DeadNotification[]>(MOCK_DEAD_NOTIFICATIONS);

  const handleRetryDead = (id: number) => {
    toastManager.promise(
      new Promise((res) => setTimeout(res, 1200)),
      {
        loading: "Mencoba mengirim ulang via gateway...",
        success: () => {
          setDeadNotifs((prev) => prev.filter((d) => d.id !== id));
          return "Pesan berhasil dikirimkan ulang ke antrean gateway!";
        },
        error: () => "Gagal mengirim ulang pesan.",
      }
    );
  };

  const handleDiscardDead = (id: number) => {
    setDeadNotifs((prev) => prev.filter((d) => d.id !== id));
    toastManager.info("Pesan antrean dead letter diabaikan.");
  };

  const filteredLogs = notifLogs.filter((n) =>
    activeTab === "whatsapp" ? n.channel === "whatsapp" : n.channel === "email"
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-background">
            Log Notifikasi & Gateway Antrean
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Pantau pengiriman pesan WhatsApp Fonnte, Email SMTP Resend, dan pemulihan Dead Letter Queue.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="inline-flex rounded-2xl bg-surface-container-low p-1.5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("whatsapp")}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === "whatsapp"
                ? "bg-surface-container-lowest text-primary font-bold shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-base">chat</span>
            <span>WhatsApp Log</span>
          </button>

          <button
            onClick={() => setActiveTab("email")}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === "email"
                ? "bg-surface-container-lowest text-primary font-bold shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-base">mail</span>
            <span>Email Log</span>
          </button>

          <button
            onClick={() => setActiveTab("dead")}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === "dead"
                ? "bg-surface-container-lowest text-rose-600 font-bold shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-base">warning</span>
            <span>Dead Letter ({deadNotifs.length})</span>
          </button>
        </div>
      </div>

      {/* Tabs Content */}
      {activeTab !== "dead" ? (
        <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container-low/50 text-xs font-semibold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/20">
                <tr>
                  <th className="py-3.5 px-4">Penerima</th>
                  <th className="py-3.5 px-4">Konten / Subjek Pesan</th>
                  <th className="py-3.5 px-4">Status Pengiriman</th>
                  <th className="py-3.5 px-4">Percobaan Ulang</th>
                  <th className="py-3.5 px-4">Respon Gateway</th>
                  <th className="py-3.5 px-4 text-right">Waktu Kirim</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 text-on-surface text-xs">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-on-surface">
                      {log.recipient}
                    </td>

                    <td className="py-3.5 px-4 max-w-sm truncate text-on-surface">
                      {log.subjectOrPreview}
                    </td>

                    <td className="py-3.5 px-4">
                      {log.status === "sent" ? (
                        <StatusBadge variant="sukses" label="Terkirim" />
                      ) : log.status === "failed" ? (
                        <StatusBadge variant="gagal" label="Gagal" />
                      ) : (
                        <StatusBadge variant="pending" label="Pending" />
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-on-surface">
                      {log.retryCount} Kali
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-on-surface-variant max-w-xs truncate">
                      {log.providerResponse || "—"}
                    </td>

                    <td className="py-3.5 px-4 text-right text-on-surface-variant">
                      {new Date(log.createdAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Dead Letter Queue Tab */
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs text-rose-900 flex items-start gap-3">
            <span className="material-symbols-outlined text-rose-600 text-2xl flex-shrink-0">
              error
            </span>
            <div>
              <span className="font-bold block mb-0.5">Antrean Dead Letter Queue (DLQ)</span>
              Notifikasi di bawah ini mengalami kegagalan kirim berulang kali melampaui batas toleransi (3 kali). Anda dapat memicu percobaan kirim ulang paksa setelah kendala gateway diselesaikan.
            </div>
          </div>

          <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden">
            {deadNotifs.length === 0 ? (
              <div className="py-12 text-center text-on-surface-variant text-xs">
                <span className="material-symbols-outlined text-4xl block mb-2 text-emerald-600">
                  check_circle
                </span>
                Tidak ada antrean dead letter saat ini. Semua notifikasi berjalan normal.
              </div>
            ) : (
              <div className="divide-y divide-outline-variant/20">
                {deadNotifs.map((dead) => (
                  <div key={dead.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-rose-800">
                          {dead.channel}
                        </span>
                        <span className="font-mono font-bold text-xs text-on-surface">
                          {dead.recipient}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-on-surface">{dead.payloadSummary}</div>
                      <div className="text-xs text-rose-600 font-mono">{dead.errorMessage}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDiscardDead(dead.id)}
                        className="text-xs rounded-xl"
                      >
                        Abaikan
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleRetryDead(dead.id)}
                        className="text-xs rounded-xl bg-primary text-on-primary flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">replay</span>
                        Kirim Ulang
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
