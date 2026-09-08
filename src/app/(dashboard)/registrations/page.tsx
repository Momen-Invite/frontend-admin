"use client";

import { useState, useMemo } from "react";
import { EventRegistration } from "@/types/superadmin";
import { MOCK_REGISTRATIONS } from "@/lib/mock-superadmin-data";
import { toastManager } from "@/components/ui/toast";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EventRegistrationsPage() {
  const [registrations, setRegistrations] = useState<EventRegistration[]>(MOCK_REGISTRATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((r) => {
      const matchSearch =
        r.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.ticketCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.eventTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === "all" ? true : r.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [registrations, searchQuery, statusFilter]);

  const handleConfirmTicket = (id: number, code: string) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "confirmed" } : r))
    );
    toastManager.success(`Tiket ${code} telah dikonfirmasi dan QR pass dikirimkan.`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-background">
            Registrasi Tiket Acara Publik
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Monitoring pendaftaran tiket peserta untuk seminar, konser mini, atau temu komunitas.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            toastManager.success("Daftar registrasi tiket berhasil diunduh.");
          }}
          className="flex items-center gap-2 rounded-xl"
        >
          <span className="material-symbols-outlined text-lg">download</span>
          <span>Ekspor Tiket</span>
        </Button>
      </div>

      {/* Toolbar */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
            search
          </span>
          <Input
            type="text"
            placeholder="Cari kode tiket, nama peserta, atau judul acara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-surface-container-low border-0"
          />
        </div>

        <div className="inline-flex rounded-xl bg-surface-container-low p-1 text-xs font-medium">
          {[
            { id: "all", label: "Semua Status" },
            { id: "confirmed", label: "Terkonfirmasi" },
            { id: "pending_payment", label: "Menunggu Bayar" },
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
      </div>

      {/* Registrations Table */}
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-low/50 text-xs font-semibold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/20">
              <tr>
                <th className="py-3.5 px-4">Kode Tiket</th>
                <th className="py-3.5 px-4">Nama Peserta</th>
                <th className="py-3.5 px-4">Acara</th>
                <th className="py-3.5 px-4">Jenis Tiket</th>
                <th className="py-3.5 px-4">Pax</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Waktu Daftar</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-on-surface text-xs">
              {filteredRegistrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-primary">
                    {reg.ticketCode}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-sm text-on-surface">{reg.userName}</div>
                    <div className="text-on-surface-variant text-[11px]">{reg.userEmail}</div>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-on-surface max-w-xs truncate">
                    {reg.eventTitle}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-container text-on-primary-container">
                      {reg.ticketType}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-on-surface">
                    {reg.paxCount} Orang
                  </td>

                  <td className="py-3.5 px-4">
                    {reg.status === "confirmed" ? (
                      <StatusBadge variant="sukses" label="Terkonfirmasi" />
                    ) : reg.status === "pending_payment" ? (
                      <StatusBadge variant="pending" label="Menunggu Pembayaran" />
                    ) : (
                      <StatusBadge variant="gagal" label="Dibatalkan" />
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-on-surface-variant">
                    {new Date(reg.registeredAt).toLocaleString("id-ID", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {reg.status === "pending_payment" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleConfirmTicket(reg.id, reg.ticketCode)}
                        className="h-8 text-xs text-emerald-700 rounded-lg"
                      >
                        Konfirmasi Lunas
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          toastManager.info(`E-Ticket ${reg.ticketCode} dikirim ulang ke email.`);
                        }}
                        className="h-8 text-xs text-primary rounded-lg"
                      >
                        Kirim Ulang QR
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-outline-variant/20 p-3 space-y-3">
          {filteredRegistrations.map((reg) => (
            <div key={reg.id} className="p-4 rounded-xl bg-surface-container-low space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-primary block">
                    {reg.ticketCode}
                  </span>
                  <div className="font-bold text-on-surface text-sm">{reg.userName}</div>
                </div>
                {reg.status === "confirmed" ? (
                  <StatusBadge variant="sukses" label="Lunas" />
                ) : (
                  <StatusBadge variant="pending" label="Pending" />
                )}
              </div>

              <div className="text-xs text-on-surface-variant">
                {reg.eventTitle} • <span className="font-semibold">{reg.ticketType}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
