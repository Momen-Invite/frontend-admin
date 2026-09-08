"use client";

import { useState } from "react";
import { ContactMessage } from "@/types/superadmin";
import { MOCK_CONTACT_MESSAGES } from "@/lib/mock-superadmin-data";
import { toastManager } from "@/components/ui/toast";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>(MOCK_CONTACT_MESSAGES);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const handleMarkRead = (id: number) => {
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-background">
            Kotak Masuk Pesan Kontak
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Pesan pertanyaan dan penawaran kerjasama dari form Hubungi Kami landing page.
          </p>
        </div>
      </div>

      {/* Messages List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-5 rounded-2xl bg-surface-container-lowest border shadow-sm flex flex-col justify-between transition-colors ${
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
                <p className="text-xs text-on-surface leading-relaxed bg-surface-container-low p-3 rounded-xl">
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
        ))}
      </div>
    </div>
  );
}
