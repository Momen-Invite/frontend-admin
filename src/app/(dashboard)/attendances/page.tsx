"use client";

import { useState } from "react";
import { EventAttendance } from "@/types/superadmin";
import { MOCK_ATTENDANCES } from "@/lib/mock-superadmin-data";
import { toastManager } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EventAttendancesPage() {
  const [attendances, setAttendances] = useState<EventAttendance[]>(MOCK_ATTENDANCES);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = attendances.filter(
    (a) =>
      a.attendeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.qrCodeScanned.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.eventTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleSouvenir = (id: number) => {
    setAttendances((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              souvenirStatus:
                a.souvenirStatus === "Sudah Diberikan" ? "Belum" : "Sudah Diberikan",
            }
          : a
      )
    );
    toastManager.info("Status serah terima suvenir telah diperbarui.");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-background">
            Log Presensi & Check-in QR Hari-H
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Riwayat presensi tamu dan penerimaan suvenir secara real-time di lokasi acara.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            toastManager.success("Rekapitulasi absensi presensi berhasil diunduh.");
          }}
          className="flex items-center gap-2 rounded-xl"
        >
          <span className="material-symbols-outlined text-lg">download</span>
          <span>Unduh Rekap Presensi</span>
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
            placeholder="Cari kode QR, nama tamu yang hadir, atau meja..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-surface-container-low border-0"
          />
        </div>
      </div>

      {/* Attendance Table */}
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-low/50 text-xs font-semibold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/20">
              <tr>
                <th className="py-3.5 px-4">Tamu Hadir</th>
                <th className="py-3.5 px-4">Kode QR Scanned</th>
                <th className="py-3.5 px-4">Acara Undangan</th>
                <th className="py-3.5 px-4">Pax Riil</th>
                <th className="py-3.5 px-4">Gerbang & Petugas</th>
                <th className="py-3.5 px-4">Suvenir</th>
                <th className="py-3.5 px-4">Waktu Check-in</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-on-surface text-xs">
              {filtered.map((att) => (
                <tr key={att.id} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-sm text-on-surface">{att.attendeeName}</div>
                    <span className="text-[10px] text-on-surface-variant block">
                      Metode: {att.checkinMethod}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-primary">
                    {att.qrCodeScanned}
                  </td>

                  <td className="py-3.5 px-4 font-medium text-on-surface max-w-xs truncate">
                    {att.eventTitle}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-emerald-700">
                    {att.actualPax} Pax
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-on-surface">{att.gateOrDesk}</div>
                    <div className="text-[10px] text-on-surface-variant">Oleh: {att.checkedInByLabel}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleSouvenir(att.id)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 ${
                        att.souvenirStatus === "Sudah Diberikan"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xs">
                        {att.souvenirStatus === "Sudah Diberikan" ? "card_giftcard" : "hourglass_empty"}
                      </span>
                      {att.souvenirStatus}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-on-surface-variant font-mono">
                    {new Date(att.checkedInAt).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toastManager.info(`Log audit presensi ${att.attendeeName} valid.`)}
                      className="h-8 text-xs text-primary rounded-lg"
                    >
                      Audit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-outline-variant/20 p-3 space-y-3">
          {filtered.map((att) => (
            <div key={att.id} className="p-4 rounded-xl bg-surface-container-low space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-on-surface text-sm">{att.attendeeName}</div>
                  <span className="font-mono text-xs text-primary font-bold">{att.qrCodeScanned}</span>
                </div>
                <span className="font-bold text-emerald-700 text-sm">{att.actualPax} Pax</span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-outline-variant/20">
                <span className="text-on-surface-variant">{att.gateOrDesk}</span>
                <span className="font-semibold text-on-surface">{att.souvenirStatus}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
