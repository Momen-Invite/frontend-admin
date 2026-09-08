"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavSection {
  groupTitle: string;
  items: {
    title: string;
    href: string;
    iconName: string;
    badge?: string;
  }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    groupTitle: "Operasional Utama",
    items: [
      { title: "Dasbor", href: "/", iconName: "grid_view" },
      { title: "Verifikasi Pesanan", href: "/orders", iconName: "shopping_bag" },
    ],
  },
  {
    groupTitle: "Manajemen Akun & Host",
    items: [
      { title: "Master Pengguna", href: "/users", iconName: "group" },
      { title: "Staf Administrator", href: "/admins", iconName: "admin_panel_settings" },
      { title: "Matriks Peran RBAC", href: "/roles", iconName: "shield" },
      { title: "Sesi & Log OTP", href: "/auth-sessions", iconName: "devices" },
      { title: "Host Penyelenggara", href: "/hosts", iconName: "person_celebrate" },
    ],
  },
  {
    groupTitle: "Katalog & Acara",
    items: [
      { title: "Kategori Acara", href: "/categories", iconName: "category" },
      { title: "Katalog & Tema", href: "/catalog", iconName: "palette" },
      { title: "Flash Sale Promo", href: "/flash-sales", iconName: "timer" },
    ],
  },
  {
    groupTitle: "Buku Tamu & Hari-H",
    items: [
      { title: "Buku Tamu & RSVP", href: "/guests", iconName: "badge" },
      { title: "Registrasi Tiket", href: "/registrations", iconName: "confirmation_number" },
      { title: "Presensi QR Hari-H", href: "/attendances", iconName: "qr_code_scanner" },
    ],
  },
  {
    groupTitle: "Keuangan & Billing",
    items: [
      { title: "Faktur Paket Tema", href: "/invoices", iconName: "receipt_long" },
      { title: "Persetujuan Penarikan", href: "/withdrawals", iconName: "payments" },
      { title: "Transaksi Amplop Kado", href: "/gift-invoices", iconName: "featured_seasonal_and_gifts" },
      { title: "Gateway & Webhook", href: "/payments", iconName: "account_balance" },
    ],
  },
  {
    groupTitle: "Pusat Bantuan & CMS",
    items: [
      { title: "Tiket Bantuan", href: "/tickets", iconName: "support_agent", badge: "3" },
      { title: "Moderasi Ulasan", href: "/reviews", iconName: "rate_review" },
      { title: "CMS & Landing Page", href: "/cms", iconName: "public" },
      { title: "Kotak Masuk Kontak", href: "/contact-messages", iconName: "mail" },
      { title: "Log Notifikasi Gateway", href: "/notifications", iconName: "notifications" },
    ],
  },
  {
    groupTitle: "Konfigurasi & Audit",
    items: [
      { title: "Pengaturan Sistem", href: "/settings", iconName: "settings" },
      { title: "Audit Trail Keamanan", href: "/activity-logs", iconName: "history" },
    ],
  },
];

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Content */}
      <div className="relative ml-auto w-[85%] max-w-[320px] bg-surface-container-lowest h-full shadow-2xl flex flex-col p-5 z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-variant/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-on-background text-surface-container-lowest rounded-xl flex items-center justify-center font-bold text-sm select-none">
              MI
            </div>
            <div>
              <div className="font-bold text-on-background text-base">Momen Invite</div>
              <div className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                Superadmin Portal
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-on-surface-variant hover:bg-surface-variant/40 transition-colors"
            aria-label="Tutup Menu"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* User Card */}
        <div className="my-3 p-3 rounded-xl bg-surface-container-low flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
            SA
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-on-background text-xs truncate">Superadmin Momen</div>
            <div className="text-[11px] text-on-surface-variant truncate">superadmin@momeninvite.com</div>
          </div>
        </div>

        {/* Nav Links Grouped */}
        <div className="flex-1 overflow-y-auto space-y-4 py-1 pr-1 scrollbar-none">
          {NAV_SECTIONS.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <div className="px-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                {section.groupTitle}
              </div>

              {section.items.map((item) => {
                const isActive =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors",
                      isActive
                        ? "bg-primary text-on-primary font-semibold shadow-sm"
                        : "text-on-surface hover:bg-surface-container hover:text-primary"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "material-symbols-outlined text-[18px]",
                          isActive && "filled"
                        )}
                      >
                        {item.iconName}
                      </span>
                      <span>{item.title}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold",
                          isActive
                            ? "bg-on-primary text-primary"
                            : "bg-error text-on-error"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-surface-variant/40 mt-auto">
          <button
            type="button"
            onClick={() => {
              onClose();
              window.location.href = "/login";
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-error font-semibold rounded-xl hover:bg-error/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Keluar Sesi Superadmin</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MobileDrawer;
