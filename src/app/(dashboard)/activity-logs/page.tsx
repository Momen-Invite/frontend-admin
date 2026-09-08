"use client";

import { useState } from "react";
import { ActivityLog } from "@/types/superadmin";
import { MOCK_ACTIVITY_LOGS } from "@/lib/mock-superadmin-data";
import { toastManager } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ActivityLogsPage() {
  const [logs] = useState<ActivityLog[]>(MOCK_ACTIVITY_LOGS);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = logs.filter(
    (l) =>
      l.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.details && l.details.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-background">
              Audit Trail & Log Aktivitas Staf
            </h1>
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
        <div className="relative max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
            search
          </span>
          <Input
            type="text"
            placeholder="Cari nama admin, tindakan (ACTION), atau entitas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-surface-container-low border-0"
          />
        </div>
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
              {filtered.map((log) => (
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-outline-variant/20 p-3 space-y-3">
          {filtered.map((log) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}
