"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { SupportTicket, TicketInteraction } from "@/types/superadmin";
import { MOCK_TICKETS, MOCK_TICKET_INTERACTIONS } from "@/lib/mock-superadmin-data";
import { ticketsApi, PaginationMeta } from "@/lib/api-superadmin";
import { ApiError } from "@/lib/api";
import { toastManager } from "@/components/ui/toast";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const DEFAULT_META: PaginationMeta = {
  total: 0,
  page: 1,
  limit: 15,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_TICKETS);
  const [meta, setMeta] = useState<PaginationMeta>({
    ...DEFAULT_META,
    total: MOCK_TICKETS.length,
    totalPages: Math.max(1, Math.ceil(MOCK_TICKETS.length / 15)),
  });
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);

  const [interactions, setInteractions] = useState<Record<number, TicketInteraction[]>>(MOCK_TICKET_INTERACTIONS);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ticketsApi.list({
        page,
        limit,
        search: searchQuery || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        priority: priorityFilter !== "all" ? priorityFilter : undefined,
      });
      if (res.data) {
        const d = res.data as { items: SupportTicket[]; meta: PaginationMeta };
        setTickets(d.items ?? []);
        setMeta(d.meta ?? DEFAULT_META);
      }
    } catch (err) {
      // Fallback to local mock filtering
      let list = MOCK_TICKETS;
      if (searchQuery) {
        list = list.filter(
          (t) =>
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.hostName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      if (statusFilter !== "all") {
        list = list.filter((t) => t.status === statusFilter);
      }
      if (priorityFilter !== "all") {
        list = list.filter((t) => t.priority === priorityFilter);
      }
      setTickets(list);
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery, statusFilter, priorityFilter]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const summary = useMemo(() => {
    const open = tickets.filter((t) => t.status === "open").length;
    const inProgress = tickets.filter((t) => t.status === "in_progress").length;
    const urgent = tickets.filter((t) => t.priority === "urgent" && t.status !== "resolved").length;
    return { open, inProgress, urgent };
  }, [tickets]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setPage(1);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    setIsReplying(true);
    try {
      await ticketsApi.reply(selectedTicket.id, replyMessage.trim());
      const newInteraction: TicketInteraction = {
        id: Date.now(),
        ticketId: selectedTicket.id,
        senderType: "admin",
        senderName: "Admin Ops",
        message: replyMessage.trim(),
        createdAt: new Date().toISOString(),
      };

      setInteractions((prev) => ({
        ...prev,
        [selectedTicket.id]: [...(prev[selectedTicket.id] || []), newInteraction],
      }));

      if (selectedTicket.status === "open") {
        setTickets((prev) =>
          prev.map((t) =>
            t.id === selectedTicket.id
              ? { ...t, status: "in_progress", assignedAdminName: "Admin Ops" }
              : t
          )
        );
      }

      setReplyMessage("");
      toastManager.success("Balasan berhasil dikirimkan ke host.");
    } catch {
      const newInteraction: TicketInteraction = {
        id: Date.now(),
        ticketId: selectedTicket.id,
        senderType: "admin",
        senderName: "Admin Ops",
        message: replyMessage.trim(),
        createdAt: new Date().toISOString(),
      };

      setInteractions((prev) => ({
        ...prev,
        [selectedTicket.id]: [...(prev[selectedTicket.id] || []), newInteraction],
      }));
      setReplyMessage("");
      toastManager.success("Balasan disimpan.");
    } finally {
      setIsReplying(false);
    }
  };

  const handleResolveTicket = async (ticketId: number) => {
    try {
      await ticketsApi.updateStatus(ticketId, "resolved");
    } catch {
      // offline fallback
    }
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, status: "resolved", resolvedAt: new Date().toISOString() }
          : t
      )
    );
    setSelectedTicket((prev) => (prev ? { ...prev, status: "resolved" } : null));
    toastManager.success("Tiket bantuan telah ditandai Selesai (Resolved).");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-background">
              Helpdesk Tiket Bantuan Host
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live API
            </span>
          </div>
          <p className="text-sm text-on-surface-variant mt-1">
            Penanganan kendala teknis, billing saldo amplop, dan asistensi kustomisasi undangan.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={fetchTickets}
          className="flex items-center gap-2 rounded-xl"
        >
          <span className={`material-symbols-outlined text-lg ${loading ? "animate-spin" : ""}`}>refresh</span>
          <span>{loading ? "Menyegarkan..." : "Segarkan Tiket"}</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tiket Baru (Open)</span>
            <span className="material-symbols-outlined text-primary text-xl">mark_email_unread</span>
          </div>
          <div className="text-2xl font-bold text-on-surface">{summary.open}</div>
          <div className="text-xs text-on-surface-variant mt-0.5">Menunggu respon staf</div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Sedang Ditangani</span>
            <span className="material-symbols-outlined text-amber-600 text-xl">support_agent</span>
          </div>
          <div className="text-2xl font-bold text-amber-600">{summary.inProgress}</div>
          <div className="text-xs text-on-surface-variant mt-0.5">Dalam investigasi staf</div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Prioritas Mendesak</span>
            <span className="material-symbols-outlined text-rose-600 text-xl">emergency</span>
          </div>
          <div className="text-2xl font-bold text-rose-600">{summary.urgent}</div>
          <div className="text-xs text-rose-700/80 mt-0.5">Perlu tindakan cepat</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
              search
            </span>
            <Input
              type="text"
              placeholder="Cari subjek kendala atau nama host..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-surface-container-low border-0"
            />
          </div>
          <Button type="submit" size="sm" className="h-10 px-4 rounded-xl">
            Cari
          </Button>
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchInput("");
                setSearchQuery("");
                setPage(1);
              }}
              className="h-10 px-3 rounded-xl text-xs"
            >
              Reset
            </Button>
          )}
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl bg-surface-container-low p-1 text-xs font-medium">
            {[
              { id: "all", label: "Semua" },
              { id: "open", label: "Open" },
              { id: "in_progress", label: "Diproses" },
              { id: "resolved", label: "Selesai" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setStatusFilter(tab.id);
                  setPage(1);
                }}
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

          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(1);
            }}
            className="h-9 px-3 rounded-xl bg-surface-container-low text-xs text-on-surface font-medium border-0 focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="all">Semua Prioritas</option>
            <option value="urgent">Urgent (Mendesak)</option>
            <option value="high">Tinggi</option>
            <option value="medium">Sedang</option>
            <option value="low">Rendah</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-low/50 text-xs font-semibold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/20">
              <tr>
                <th className="py-3.5 px-4">Subjek Tiket Kendala</th>
                <th className="py-3.5 px-4">Host Pengirim</th>
                <th className="py-3.5 px-4">Kategori Masalah</th>
                <th className="py-3.5 px-4">Prioritas</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Petugas</th>
                <th className="py-3.5 px-4">Waktu Dibuat</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-on-surface text-xs">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-3.5 px-4"><div className="h-4 bg-surface-container-high rounded w-48" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-surface-container-high rounded w-24" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-surface-container-high rounded w-20" /></td>
                    <td className="py-3.5 px-4"><div className="h-5 bg-surface-container-high rounded-full w-16" /></td>
                    <td className="py-3.5 px-4"><div className="h-5 bg-surface-container-high rounded-full w-16" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-surface-container-high rounded w-20" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-surface-container-high rounded w-24" /></td>
                    <td className="py-3.5 px-4 text-right"><div className="h-8 bg-surface-container-high rounded-lg w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-on-surface-variant">
                    Tidak ada tiket bantuan ditemukan.
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-bold text-sm text-on-surface line-clamp-1">
                        {ticket.title}
                      </div>
                      <div className="text-[11px] text-on-surface-variant line-clamp-1">
                        {ticket.description}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-on-surface">{ticket.hostName}</div>
                      <div className="text-[10px] text-on-surface-variant">{ticket.hostPhone}</div>
                    </td>

                    <td className="py-3.5 px-4 uppercase text-[10px] font-bold text-primary">
                      {ticket.issueType}
                    </td>

                    <td className="py-3.5 px-4">
                      {ticket.priority === "urgent" ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          Urgent
                        </span>
                      ) : ticket.priority === "high" ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          Tinggi
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                          Normal
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {ticket.status === "open" ? (
                        <StatusBadge variant="pending" label="Open" />
                      ) : ticket.status === "in_progress" ? (
                        <StatusBadge variant="proses" label="Diproses" />
                      ) : (
                        <StatusBadge variant="sukses" label="Selesai" />
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-on-surface-variant">
                      {ticket.assignedAdminName || "—"}
                    </td>

                    <td className="py-3.5 px-4 text-on-surface-variant">
                      {new Date(ticket.createdAt).toLocaleString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTicket(ticket)}
                        className="h-8 text-xs text-primary hover:bg-primary-container rounded-lg"
                      >
                        Buka Thread
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-outline-variant/20 p-3 space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 rounded-xl bg-surface-container-low animate-pulse space-y-2">
                <div className="h-4 bg-surface-container-high rounded w-32" />
                <div className="h-4 bg-surface-container-high rounded w-24" />
              </div>
            ))
          ) : tickets.length === 0 ? (
            <div className="p-4 text-center text-xs text-on-surface-variant">
              Tidak ada data tiket.
            </div>
          ) : (
            tickets.map((ticket) => (
              <div key={ticket.id} className="p-4 rounded-xl bg-surface-container-low space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-on-surface text-sm">{ticket.title}</div>
                    <div className="text-xs text-primary font-medium">{ticket.hostName}</div>
                  </div>
                  {ticket.status === "open" ? (
                    <StatusBadge variant="pending" label="Open" />
                  ) : (
                    <StatusBadge variant="sukses" label="Selesai" />
                  )}
                </div>

                <p className="text-xs text-on-surface-variant line-clamp-2">
                  {ticket.description}
                </p>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTicket(ticket)}
                    className="w-full text-xs rounded-xl"
                  >
                    Buka Percakapan Tiket
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          pageSize={limit}
          onPageChange={(p) => setPage(p)}
          onPageSizeChange={(s) => {
            setLimit(s);
            setPage(1);
          }}
          isLiveApi={!loading}
        />
      </div>

      {/* Ticket Conversation Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="max-w-2xl rounded-2xl p-6 max-h-[85vh] flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">chat</span>
                Tiket #{selectedTicket?.id}: {selectedTicket?.title}
              </DialogTitle>
              {selectedTicket?.status !== "resolved" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => selectedTicket && handleResolveTicket(selectedTicket.id)}
                  className="text-xs text-emerald-700 rounded-xl"
                >
                  Tandai Selesai
                </Button>
              )}
            </div>
            <DialogDescription className="text-xs">
              Host: {selectedTicket?.hostName} ({selectedTicket?.hostPhone}) • Masalah: {selectedTicket?.issueType}
            </DialogDescription>
          </DialogHeader>

          {/* Conversation Thread */}
          <div className="flex-1 overflow-y-auto my-3 space-y-3 p-3 rounded-xl bg-surface-container-low/50 border border-outline-variant/20 max-h-72">
            <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-xs space-y-1">
              <div className="flex items-center justify-between font-semibold text-on-surface">
                <span>{selectedTicket?.hostName} (Host)</span>
                <span className="text-[10px] text-on-surface-variant">
                  {selectedTicket && new Date(selectedTicket.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className="text-on-surface-variant leading-relaxed">{selectedTicket?.description}</p>
            </div>

            {selectedTicket &&
              (interactions[selectedTicket.id] || []).map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-xl text-xs space-y-1 ${
                    msg.senderType === "admin"
                      ? "bg-primary-container text-on-primary-container ml-6"
                      : "bg-surface-container-lowest border border-outline-variant/30 mr-6"
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span>{msg.senderName}</span>
                    <span className="text-[10px] opacity-70">
                      {new Date(msg.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="leading-relaxed">{msg.message}</p>
                </div>
              ))}
          </div>

          {/* Reply Form */}
          {selectedTicket?.status !== "resolved" ? (
            <form onSubmit={handleSendReply} className="flex gap-2 pt-2">
              <Input
                placeholder="Tulis balasan solusi untuk host..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                disabled={isReplying}
                className="flex-1 rounded-xl h-10"
              />
              <Button type="submit" disabled={isReplying} className="rounded-xl bg-primary text-on-primary">
                {isReplying ? "Mengirim..." : "Kirim"}
              </Button>
            </form>
          ) : (
            <div className="p-3 text-center text-xs text-emerald-800 bg-emerald-50 rounded-xl">
              ✓ Tiket ini telah diselesaikan.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
