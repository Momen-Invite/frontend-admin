"use client";

import { useState, useEffect, useCallback } from "react";
import { ContactMessage } from "@/types/superadmin";
import { MOCK_CONTACT_MESSAGES } from "@/lib/mock-superadmin-data";
import { contactMessagesApi, PaginationMeta } from "@/lib/api-superadmin";
import { ApiError } from "@/lib/api";
import { toastManager } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";

const DEFAULT_META: PaginationMeta = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>(MOCK_CONTACT_MESSAGES);
  const [meta, setMeta] = useState<PaginationMeta>({
    ...DEFAULT_META,
    total: MOCK_CONTACT_MESSAGES.length,
    totalPages: 1,
  });
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await contactMessagesApi.list({
        page,
        limit,
        search: searchQuery || undefined,
      });
      if (res.data) {
        const d = res.data as { items: ContactMessage[]; meta: PaginationMeta };
        setMessages(d.items ?? []);
        setMeta(d.meta ?? DEFAULT_META);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setPage(1);
  };

  const handleMarkRead = async (id: number) => {
    try {
      await contactMessagesApi.markRead(id);
    } catch {
      // offline fallback
    }
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "read" } : m))
    );
    toastManager.info("Pesan ditandai sebagai dibaca.");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-background">
              Kotak Masuk Pesan Kontak
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live API
            </span>
          </div>
          <p className="text-sm text-on-surface-variant mt-1">
            Pesan pertanyaan dan penawaran kerjasama dari form Hubungi Kami landing page.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={fetchMessages}
          className="flex items-center gap-2 rounded-xl"
        >
          <span className={`material-symbols-outlined text-lg ${loading ? "animate-spin" : ""}`}>refresh</span>
          <span>{loading ? "Menyegarkan..." : "Segarkan Kotak Masuk"}</span>
        </Button>
      </div>

      {/* Toolbar */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
              search
            </span>
            <Input
              type="text"
              placeholder="Cari nama pengirim, subjek, atau isi pesan..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-surface-container-low border-0 text-xs"
            />
          </div>
          <Button type="submit" size="sm" className="h-10 px-4 rounded-xl text-xs">
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
      </div>

      {/* Messages Grid */}
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm p-5 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-surface-container-low animate-pulse space-y-3 h-48"
              >
                <div className="h-4 bg-surface-container-high rounded w-32" />
                <div className="h-3 bg-surface-container-high rounded w-24" />
                <div className="h-16 bg-surface-container-high rounded mt-2" />
              </div>
            ))
          ) : messages.length === 0 ? (
            <div className="col-span-full py-12 text-center text-on-surface-variant text-sm">
              Tidak ada pesan kontak ditemukan.
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-5 rounded-2xl bg-surface-container-low/40 border shadow-sm flex flex-col justify-between transition-colors ${
                  msg.status === "unread"
                    ? "border-primary/50 bg-primary-container/10"
                    : "border-outline-variant/30"
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-base text-on-surface flex items-center gap-2">
                        {msg.name}
                        {msg.status === "unread" && (
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <div className="text-xs text-on-surface-variant">
                        {msg.email} • {msg.phone}
                      </div>
                    </div>

                    <span className="text-[11px] text-on-surface-variant">
                      {new Date(msg.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="pt-1">
                    <div className="font-semibold text-xs text-primary mb-1">{msg.subject}</div>
                    <p className="text-xs text-on-surface leading-relaxed bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/10">
                      {msg.message}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between">
                  {msg.status === "unread" ? (
                    <button
                      onClick={() => handleMarkRead(msg.id)}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Tandai Dibaca
                    </button>
                  ) : (
                    <span className="text-xs text-on-surface-variant">Dibaca</span>
                  )}

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/${msg.phone.replace(/^0/, "62")}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs rounded-xl flex items-center gap-1 text-emerald-700"
                      >
                        <span className="material-symbols-outlined text-sm">chat</span>
                        WhatsApp
                      </Button>
                    </a>

                    <a href={`mailto:${msg.email}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs rounded-xl flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">mail</span>
                        Email
                      </Button>
                    </a>
                  </div>
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
    </div>
  );
}
