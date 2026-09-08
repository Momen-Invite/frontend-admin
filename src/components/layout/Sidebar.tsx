"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Icon name mapping ke Material Symbols names
interface NavItem {
  title: string;
  href: string;
  iconName: string;
}

const NAV_ITEMS: NavItem[] = [
  { title: "Dasbor", href: "/", iconName: "grid_view" },
  { title: "Verifikasi Pesanan", href: "/orders", iconName: "shopping_bag" },
  {
    title: "Katalog & Tema",
    href: "/catalog",
    iconName: "palette",
  },
  {
    title: "Persetujuan Penarikan",
    href: "/withdrawals",
    iconName: "account_balance_wallet",
  },
  {
    title: "Tiket Bantuan",
    href: "/tickets",
    iconName: "support_agent",
  },
  {
    title: "CMS & Landing Page",
    href: "/cms",
    iconName: "public",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-lg top-lg bottom-lg w-sidebar-width rounded-xl bg-surface-container-lowest shadow-card flex flex-col items-center py-lg space-y-md z-20">
      {/* Logo Mark */}
      <div className="mb-lg">
        <div className="w-12 h-12 bg-on-background text-surface-container-lowest rounded-lg flex items-center justify-center font-bold text-base tracking-tight select-none">
          MI
        </div>
      </div>

      {/* Navigation Icons */}
      <nav className="flex flex-col w-full px-2 space-y-1 flex-grow">
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
                "w-full flex items-center justify-center p-3 rounded-full transition-all duration-200",
                isActive
                  ? "bg-primary-container text-on-primary-container scale-95"
                  : "text-on-surface-variant hover:text-primary hover:scale-105"
              )}
            >
              <span
                className={cn(
                  "material-symbols-outlined text-[28px]",
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
      <div className="mt-auto pt-lg w-full px-2">
        <Link
          href="/settings"
          title="Pengaturan Sistem"
          className={cn(
            "w-full flex items-center justify-center p-3 rounded-full transition-all duration-200",
            pathname.startsWith("/settings")
              ? "bg-primary-container text-on-primary-container scale-95"
              : "text-on-surface-variant hover:text-primary hover:scale-105"
          )}
        >
          <span className="material-symbols-outlined text-[28px]">
            settings
          </span>
        </Link>
      </div>
    </aside>
  );
}
