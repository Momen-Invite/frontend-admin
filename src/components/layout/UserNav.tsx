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
import { LogOut, User, KeyRound, ShieldAlert } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function UserNav() {
  const { user, logout } = useAuth();

  const displayName = user?.name || "Super Administrator";
  const displayEmail = user?.email || "superadmin@momeninvite.com";
  const displayRole = user?.role === "admin" ? "Staf Administrator" : "Super Administrator";

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "SA";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full ring-offset-background transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <Avatar className="h-8 w-8 border border-border">
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 rounded-2xl p-1.5 shadow-xl" align="end" forceMount>
        <DropdownMenuLabel className="font-normal p-2">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold leading-none">{displayName}</p>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary-container text-on-primary-container uppercase">
                {user?.role || "SUPER"}
              </span>
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              {displayEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer rounded-xl text-xs">
          <User className="mr-2 h-4 w-4" />
          <span>Profil & Kredensial</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer rounded-xl text-xs">
          <KeyRound className="mr-2 h-4 w-4" />
          <span>Keamanan Kata Sandi</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer rounded-xl text-xs">
          <ShieldAlert className="mr-2 h-4 w-4" />
          <span>Audit Log Sesi Saya</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer rounded-xl text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
          onClick={() => logout()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Keluar Sesi</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
