"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDEBAR_NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Sparkles, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Sidebar() {
  const pathname = usePathname();

  // In a real session, this role comes from useAuth / session
  const currentRole = "SUPER_ADMIN";

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-card text-card-foreground shadow-sm">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-tight text-foreground">
            MOMEN INVITE
          </span>
          <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-500" /> Admin Console
          </span>
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Menu Navigasi
        </div>
        {SIDEBAR_NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;

          if (item.roleRequired === "SUPER_ADMIN" && currentRole !== "SUPER_ADMIN") {
            return null;
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span>{item.title}</span>
              </div>
              {item.badge && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] px-1.5 py-0 h-4 border",
                    isActive
                      ? "border-primary-foreground/30 text-primary-foreground bg-primary-foreground/10"
                      : "border-border text-muted-foreground"
                  )}
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </div>

      {/* User / Footer Status */}
      <div className="border-t border-border p-4">
        <div className="flex items-center justify-between rounded-lg bg-muted/60 p-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-foreground">API Server</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600">Online</span>
        </div>
      </div>
    </aside>
  );
}
