"use client";

import { useState } from "react";
import { UserNav } from "@/components/layout/UserNav";

interface TopbarProps {
  /** Judul halaman yang ditampilkan di kiri */
  title: string;
  /** Placeholder search input */
  searchPlaceholder?: string;
  /** Callback opsional jika tombol search mobile diklik */
  onSearchClick?: () => void;
}

export function Topbar({
  title,
  searchPlaceholder = "Cari order atau host...",
}: TopbarProps) {
  const [hasNotif] = useState(true);

  return (
    <header className="flex justify-between items-center w-full max-w-full mb-md md:mb-lg h-14 md:h-16 gap-3">
      {/* Page Title */}
      <h1 className="text-xl sm:text-2xl md:text-headline-lg font-bold tracking-tight text-on-background truncate">
        {title}
      </h1>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-md shrink-0">
        {/* Search Pill (Desktop) */}
        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-on-surface-variant text-lg">
              search
            </span>
          </div>
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="bg-surface-container-lowest border-none rounded-full py-2 pl-10 pr-4 text-body-sm font-body-sm w-48 lg:w-64 shadow-sm focus:ring-2 focus:ring-primary-container outline-none text-on-background placeholder:text-on-surface-variant transition-shadow"
          />
        </div>

        {/* Notifications Button */}
        <button
          type="button"
          className="relative p-2 bg-surface-container-lowest rounded-full shadow-sm text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
          title="Notifikasi"
        >
          <span className="material-symbols-outlined text-[20px] sm:text-[22px]">
            notifications
          </span>
          {hasNotif && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-surface-container-lowest" />
          )}
        </button>

        {/* User Profile Dropdown */}
        <UserNav />
      </div>
    </header>
  );
}

export default Topbar;
