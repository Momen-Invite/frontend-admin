"use client";

import { Bell, Search, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserNav } from "@/components/layout/UserNav";
import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-8 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Search / Global Quick Filter */}
      <div className="flex items-center gap-4 w-96">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari order, host, atau tiket..."
            className="pl-9 bg-muted/40 h-9 rounded-lg text-xs"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Environment Badge */}
        <Badge variant="outline" className="text-[11px] gap-1 font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          PROD v3.0
        </Badge>

        <Badge variant="secondary" className="gap-1 text-xs">
          <Shield className="h-3 w-3 text-indigo-500" />
          SUPER ADMIN
        </Badge>

        {/* Notifications Icon */}
        <button
          type="button"
          className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
        </button>

        {/* Admin Profile */}
        <UserNav />
      </div>
    </header>
  );
}
