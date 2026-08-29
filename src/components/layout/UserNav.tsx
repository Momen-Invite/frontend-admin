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
import { useRouter } from "next/navigation";

export function UserNav() {
  const router = useRouter();

  const handleLogout = () => {
    // In production, this calls POST /api/auth/admin/logout
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full ring-offset-background transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <Avatar className="h-8 w-8 border border-border">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
              SA
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold leading-none">Super Administrator</p>
            <p className="text-xs leading-none text-muted-foreground">
              superadmin@momeninvite.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profil Saya</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <KeyRound className="mr-2 h-4 w-4" />
          <span>Ganti Password</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <ShieldAlert className="mr-2 h-4 w-4" />
          <span>Audit Log Saya</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Keluar Sesi</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
