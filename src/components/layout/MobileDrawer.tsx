"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DrawerItem {
  title: string;
  href: string;
  iconName: string;
  badge?: string;
}

const SECONDARY_NAV_ITEMS: DrawerItem[] = [
  { title: "Dasbor Utama", href: "/", iconName: "grid_view" },
  { title: "Verifikasi Pesanan", href: "/orders", iconName: "shopping_bag" },
  { title: "Katalog & Tema", href: "/catalog", iconName: "palette" },
  { title: "Manajemen Keuangan", href: "/keuangan", iconName: "account_balance_wallet" },
  { title: "Persetujuan Penarikan", href: "/withdrawals", iconName: "payments" },
  { title: "Tiket Bantuan", href: "/tickets", iconName: "support_agent", badge: "3" },
  { title: "CMS & Landing Page", href: "/cms", iconName: "public" },
  { title: "Pengaturan Sistem", href: "/settings", iconName: "settings" },
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
      <div className="relative ml-auto w-[85%] max-w-[320px] bg-surface-container-lowest h-full shadow-2xl flex flex-col p-6 z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-variant/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-on-background text-surface-container-lowest rounded-xl flex items-center justify-center font-bold text-sm select-none">
              MI
            </div>
            <div>
              <div className="font-bold text-on-background text-base">Momen Invite</div>
              <div className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                Admin Portal
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
        <div className="my-4 p-3.5 rounded-xl bg-surface-container-low flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
            AD
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-on-background text-sm truncate">Admin Momen</div>
            <div className="text-xs text-on-surface-variant truncate">admin@momeninvite.com</div>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto space-y-1.5 py-2">
          {SECONDARY_NAV_ITEMS.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-on-primary font-semibold shadow-sm"
                    : "text-on-surface hover:bg-surface-container hover:text-primary"
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "material-symbols-outlined text-[20px]",
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
                      "px-2 py-0.5 rounded-full text-[11px] font-bold",
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

        {/* Footer actions */}
        <div className="pt-4 border-t border-surface-variant/40 mt-auto">
          <button
            type="button"
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-error font-semibold rounded-xl hover:bg-error/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Keluar Sesi</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MobileDrawer;
