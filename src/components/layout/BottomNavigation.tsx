"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  onOpenMenu?: () => void;
}

interface BottomNavItem {
  label: string;
  href: string;
  iconName: string;
  isAction?: boolean;
}

const NAV_ITEMS: BottomNavItem[] = [
  { label: "Dasbor", href: "/", iconName: "grid_view" },
  { label: "Pesanan", href: "/orders", iconName: "shopping_bag" },
  { label: "Keuangan", href: "/keuangan", iconName: "account_balance_wallet" },
  { label: "Katalog", href: "/catalog", iconName: "palette" },
  { label: "Menu", href: "#menu", iconName: "menu", isAction: true },
];

export function BottomNavigation({ onOpenMenu }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi Mobile"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-surface-container-lowest/95 backdrop-blur-md border-t border-surface-variant/40 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] h-[70px] pb-safe flex items-center justify-around px-2"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = !item.isAction && (
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
        );

        if (item.isAction) {
          return (
            <button
              key={item.label}
              type="button"
              onClick={onOpenMenu}
              className="flex flex-col items-center justify-center flex-1 py-1 group text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
            >
              <div className="p-1 rounded-full transition-transform active:scale-90">
                <span className="material-symbols-outlined text-[22px]">
                  {item.iconName}
                </span>
              </div>
              <span className="text-[10px] font-label-capsule font-medium mt-0.5 leading-none">
                {item.label}
              </span>
            </button>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center flex-1 py-1 group transition-colors focus:outline-none"
          >
            <div
              className={cn(
                "px-3 py-1 rounded-full transition-all duration-200 flex items-center justify-center",
                isActive
                  ? "bg-primary-container text-on-primary-container scale-105"
                  : "text-on-surface-variant group-hover:text-primary"
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
            </div>
            <span
              className={cn(
                "text-[10px] font-label-capsule mt-0.5 leading-none transition-colors",
                isActive
                  ? "font-bold text-on-background"
                  : "font-medium text-on-surface-variant group-hover:text-primary"
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export default BottomNavigation;
