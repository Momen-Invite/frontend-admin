"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User, KeyRound, ShieldAlert, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function UserNav() {
  const { user, logout } = useAuth();

  const displayName = user?.name || "Super Administrator";
  const displayEmail = user?.email || "superadmin@momeninvite.com";
  const displayRole = user?.role === "admin" ? "Staf Admin" : "Super Admin";

  const getInitials = (name: string) => {
    return (
      name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "SA"
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2.5 rounded-full px-2 py-1.5 transition-colors hover:bg-surface-container-high focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          {/* Avatar */}
          <Avatar className="h-8 w-8 border-2 border-primary/20 shrink-0">
            <AvatarFallback className="bg-primary text-on-primary font-bold text-xs">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>

          {/* Name + Role — visible on md+ */}
          <div className="hidden md:flex flex-col items-start leading-tight">
            <span className="text-xs font-semibold text-on-surface truncate max-w-[120px]">
              {displayName}
            </span>
            <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wide">
              {displayRole}
            </span>
          </div>

          {/* Chevron */}
          <ChevronDown className="hidden md:block h-3.5 w-3.5 text-on-surface-variant shrink-0" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-60 rounded-2xl p-1.5 shadow-xl border border-outline-variant/40"
        align="end"
        sideOffset={8}
        forceMount
      >
        {/* Profile info */}
        <DropdownMenuLabel className="font-normal p-2.5">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary/20 shrink-0">
              <AvatarFallback className="bg-primary text-on-primary font-bold text-sm">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-on-surface truncate">
                  {displayName}
                </p>
                <span className="shrink-0 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-primary/10 text-primary uppercase">
                  {user?.role || "SUPER"}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant truncate mt-0.5">
                {displayEmail}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="mx-1.5" />

        <DropdownMenuItem className="cursor-pointer rounded-xl text-xs gap-2.5 px-3 py-2.5 hover:bg-surface-container-high">
          <User className="h-4 w-4 text-on-surface-variant" />
          <span>Profil &amp; Kredensial</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer rounded-xl text-xs gap-2.5 px-3 py-2.5 hover:bg-surface-container-high">
          <KeyRound className="h-4 w-4 text-on-surface-variant" />
          <span>Keamanan Kata Sandi</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer rounded-xl text-xs gap-2.5 px-3 py-2.5 hover:bg-surface-container-high">
          <ShieldAlert className="h-4 w-4 text-on-surface-variant" />
          <span>Audit Log Sesi</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="mx-1.5" />

        <DropdownMenuItem
          className="cursor-pointer rounded-xl text-xs gap-2.5 px-3 py-2.5 text-red-600 focus:bg-red-50 focus:text-red-700 hover:bg-red-50"
          onClick={() => logout()}
        >
          <LogOut className="h-4 w-4" />
          <span>Keluar dari Sesi</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
