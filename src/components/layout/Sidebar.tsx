"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  iconName: string;
}

const NAV_ITEMS: NavItem[] = [
  { title: "Dasbor", href: "/", iconName: "grid_view" },
  { title: "Pengguna", href: "/users", iconName: "group" },
  { title: "Verifikasi Pesanan", href: "/orders", iconName: "shopping_bag" },
  { title: "Katalog Tema", href: "/catalog", iconName: "palette" },
  { title: "Buku Tamu & RSVP", href: "/guests", iconName: "badge" },
  { title: "Faktur Penjualan", href: "/invoices", iconName: "receipt_long" },
  { title: "Penarikan Dana", href: "/withdrawals", iconName: "account_balance_wallet" },
  { title: "Tiket Bantuan", href: "/tickets", iconName: "support_agent" },
  { title: "Log Notifikasi", href: "/notifications", iconName: "notifications" },
  { title: "CMS & Landing Page", href: "/cms", iconName: "public" },
  { title: "Audit Trail", href: "/activity-logs", iconName: "history" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex fixed left-lg top-lg bottom-lg w-sidebar-width rounded-2xl bg-surface-container-lowest shadow-card flex-col items-center py-4 z-20 overflow-hidden overflow-x-hidden border border-outline-variant/30 select-none">
      {/* Logo Mark */}
      <Link href="/" className="mb-2 flex-shrink-0" title="Momen Invite Admin">
        <div className="w-11 h-11 bg-on-background text-surface-container-lowest rounded-xl flex items-center justify-center font-bold text-base tracking-tight select-none shadow-sm hover:scale-105 transition-transform">
          MI
        </div>
      </Link>

      {/* Navigation Icons (Strictly Vertical Scroll only, completely hidden scrollbar, no horizontal scroll) */}
      <nav className="flex flex-col w-full px-2 space-y-1 overflow-y-auto overflow-x-hidden flex-grow py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.title}
              className={cn(
                "w-full flex items-center justify-center p-2 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-primary-container text-on-primary-container shadow-sm scale-95"
                  : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
              )}
            >
              <span
                className={cn(
                  "material-symbols-outlined text-[22px]",
                  isActive && "filled"
                )}
              >
                {item.iconName}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Settings — Bottom Anchored */}
      <div className="mt-auto pt-2 w-full px-2 border-t border-outline-variant/20 flex-shrink-0 overflow-x-hidden">
        <Link
          href="/settings"
          title="Pengaturan Sistem"
          className={cn(
            "w-full flex items-center justify-center p-2 rounded-xl transition-all duration-200",
            pathname.startsWith("/settings")
              ? "bg-primary-container text-on-primary-container shadow-sm scale-95"
              : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
          )}
        >
          <span className="material-symbols-outlined text-[22px]">
            settings
          </span>
        </Link>
      </div>
    </aside>
  );
}
