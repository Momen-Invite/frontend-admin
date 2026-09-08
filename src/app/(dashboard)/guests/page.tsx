"use client";

import { useState, useMemo } from "react";
import { EventGuest, RsvpStatus } from "@/types/superadmin";
import { MOCK_GUESTS } from "@/lib/mock-superadmin-data";
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

export default function EventGuestsPage() {
  const [guests] = useState<EventGuest[]>(MOCK_GUESTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [rsvpFilter, setRsvpFilter] = useState<string>("all");
  const [selectedGuest, setSelectedGuest] = useState<EventGuest | null>(null);

  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      const matchSearch =
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.guestCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.eventTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchRsvp = rsvpFilter === "all" ? true : g.rsvpStatus === rsvpFilter;

      return matchSearch && matchRsvp;
    });
  }, [guests, searchQuery, rsvpFilter]);

  const summary = useMemo(() => {
    const total = guests.length;
    const attending = guests.filter((g) => g.rsvpStatus === "attending").length;
    const pending = guests.filter((g) => g.rsvpStatus === "pending").length;
    const declined = guests.filter((g) => g.rsvpStatus === "declined").length;
    return { total, attending, pending, declined };
  }, [guests]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-background">
            Buku Tamu & RSVP Undangan
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Pantau daftar tamu undangan acara, konfirmasi kehadiran RSVP, dan ucapan doa tamu.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            toastManager.success("Data buku tamu berhasil diekspor ke Excel.");
          }}
          className="flex items-center gap-2 rounded-xl"
        >
          <span className="material-symbols-outlined text-lg">download</span>
          <span>Ekspor Buku Tamu</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Tamu Diundang</span>
            <span className="material-symbols-outlined text-primary text-xl">contacts</span>
          </div>
          <div className="text-2xl font-bold text-on-surface">{summary.total}</div>
          <div className="text-xs text-on-surface-variant mt-0.5">Tercatat di sistem</div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Hadir (Attending)</span>
            <span className="material-symbols-outlined text-emerald-600 text-xl">how_to_reg</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600">{summary.attending}</div>
          <div className="text-xs text-emerald-700 font-medium mt-0.5">Konfirmasi hadir</div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Menunggu Jawaban</span>
            <span className="material-symbols-outlined text-amber-600 text-xl">hourglass_top</span>
          </div>
          <div className="text-2xl font-bold text-amber-600">{summary.pending}</div>
          <div className="text-xs text-on-surface-variant mt-0.5">Belum mengisi RSVP</div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tidak Hadir</span>
            <span className="material-symbols-outlined text-rose-600 text-xl">person_cancel</span>
          </div>
          <div className="text-2xl font-bold text-rose-600">{summary.declined}</div>
          <div className="text-xs text-on-surface-variant mt-0.5">Berhalangan hadir</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
            search
          </span>
          <Input
            type="text"
            placeholder="Cari kode tamu, nama, atau judul acara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-surface-container-low border-0"
          />
        </div>

        <div className="inline-flex rounded-xl bg-surface-container-low p-1 text-xs font-medium">
          {[
            { id: "all", label: "Semua RSVP" },
            { id: "attending", label: "Hadir" },
            { id: "pending", label: "Pending" },
            { id: "declined", label: "Tidak Hadir" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRsvpFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                rsvpFilter === tab.id
                  ? "bg-surface-container-lowest text-primary font-bold shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Guests Table */}
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-low/50 text-xs font-semibold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/20">
              <tr>
                <th className="py-3.5 px-4">Kode Tamu</th>
                <th className="py-3.5 px-4">Nama Tamu</th>
                <th className="py-3.5 px-4">Acara Undangan</th>
                <th className="py-3.5 px-4">Kategori & Meja</th>
                <th className="py-3.5 px-4">Status RSVP</th>
                <th className="py-3.5 px-4">Pax Hadir</th>
                <th className="py-3.5 px-4">Dibuka?</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-on-surface text-xs">
              {filteredGuests.map((guest) => (
                <tr key={guest.id} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-primary">
                    {guest.guestCode}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-sm text-on-surface">{guest.name}</div>
                    <div className="text-on-surface-variant text-[11px]">{guest.phone}</div>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-on-surface max-w-xs truncate">
                    {guest.eventTitle}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface-variant text-on-surface-variant">
                      {guest.category}
                    </span>
                    {guest.tableNumber && (
                      <span className="block text-[10px] text-on-surface-variant mt-0.5">
                        {guest.tableNumber}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    {guest.rsvpStatus === "attending" ? (
                      <StatusBadge variant="sukses" label="Hadir" />
                    ) : guest.rsvpStatus === "declined" ? (
                      <StatusBadge variant="gagal" label="Tidak Hadir" />
                    ) : (
                      <StatusBadge variant="pending" label="Belum Konfirmasi" />
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-on-surface">
                    {guest.rsvpPax} / {guest.maxGuests} Pax
                  </td>

                  <td className="py-3.5 px-4">
                    {guest.invitationOpenedAt ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        Dibuka
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-on-surface-variant">
                        <span className="material-symbols-outlined text-sm">visibility_off</span>
                        Belum
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedGuest(guest)}
                      className="h-8 text-xs text-primary hover:bg-primary-container rounded-lg"
                    >
                      Detail Tamu
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-outline-variant/20 p-3 space-y-3">
          {filteredGuests.map((guest) => (
            <div key={guest.id} className="p-4 rounded-xl bg-surface-container-low space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-primary block">
                    {guest.guestCode}
                  </span>
                  <div className="font-bold text-on-surface text-sm">{guest.name}</div>
                  <div className="text-[11px] text-on-surface-variant">{guest.eventTitle}</div>
                </div>
                {guest.rsvpStatus === "attending" ? (
                  <StatusBadge variant="sukses" label="Hadir" />
                ) : guest.rsvpStatus === "declined" ? (
                  <StatusBadge variant="gagal" label="Absen" />
                ) : (
                  <StatusBadge variant="pending" label="Pending" />
                )}
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedGuest(guest)}
                  className="w-full text-xs rounded-xl"
                >
                  Lihat Detail & Ucapan Doa
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Guest Dialog */}
      <Dialog open={!!selectedGuest} onOpenChange={() => setSelectedGuest(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">badge</span>
              Detail Tamu Undangan
            </DialogTitle>
            <DialogDescription>
              Informasi personalisasi tautan dan ucapan doa yang dikirim tamu.
            </DialogDescription>
          </DialogHeader>

          {selectedGuest && (
            <div className="space-y-4 my-2 text-sm">
              <div className="p-3.5 rounded-xl bg-surface-container-low space-y-1">
                <div className="font-mono text-xs font-bold text-primary">{selectedGuest.guestCode}</div>
                <div className="font-bold text-base text-on-surface">{selectedGuest.name}</div>
                <div className="text-xs text-on-surface-variant">{selectedGuest.eventTitle}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-surface-container-low">
                  <span className="text-on-surface-variant block mb-1">Kategori Tamu</span>
                  <span className="font-semibold text-on-surface">{selectedGuest.category}</span>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-low">
                  <span className="text-on-surface-variant block mb-1">Alokasi Meja / Sesi</span>
                  <span className="font-semibold text-on-surface">
                    {selectedGuest.groupSession || selectedGuest.tableNumber || "Reguler"}
                  </span>
                </div>
              </div>

              {selectedGuest.rsvpWishes && (
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs space-y-1">
                  <span className="font-bold text-amber-900 block flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">favorite</span>
                    Ucapan Doa Tamu:
                  </span>
                  <p className="text-on-surface italic leading-relaxed">
                    &ldquo;{selectedGuest.rsvpWishes}&rdquo;
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedGuest(null)}
              className="rounded-xl w-full"
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
