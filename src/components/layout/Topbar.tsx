"use client";

import { useState } from "react";

interface TopbarProps {
  /** Judul halaman yang ditampilkan di kiri */
  title: string;
  /** Placeholder search input */
  searchPlaceholder?: string;
}

export function Topbar({
  title,
  searchPlaceholder = "Cari transaksi...",
}: TopbarProps) {
  const [hasNotif] = useState(true);

  return (
    <header className="flex justify-between items-center w-full max-w-full mb-lg h-16">
      {/* Page Title */}
      <h1 className="text-headline-lg text-on-background font-bold tracking-tight font-headline-lg">
        {title}
      </h1>

      {/* Right Actions */}
      <div className="flex items-center gap-md">
        {/* Search Pill */}
        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-on-surface-variant text-lg">
              search
            </span>
          </div>
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="bg-surface-container-lowest border-none rounded-full py-2 pl-10 pr-4 text-body-sm font-body-sm w-64 shadow-sm focus:ring-2 focus:ring-primary-container outline-none text-on-background placeholder:text-on-surface-variant transition-shadow"
          />
        </div>

        {/* Notifications */}
        <button
          type="button"
          className="relative p-2 bg-surface-container-lowest rounded-full shadow-sm text-on-surface-variant hover:text-primary transition-colors"
          title="Notifikasi"
        >
          <span className="material-symbols-outlined text-[22px]">
            notifications
          </span>
          {hasNotif && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-surface-container-lowest" />
          )}
        </button>

        {/* User Profile Chip */}
        <button
          type="button"
          className="flex items-center gap-2 bg-surface-container-lowest rounded-full pl-1 pr-4 py-1 shadow-sm hover:bg-surface-bright transition-colors border border-transparent hover:border-outline-variant"
        >
          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs select-none">
            AD
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="text-button-text font-button-text text-on-background">
              Admin
            </span>
            <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
              SUPER ADMIN
            </span>
          </div>
        </button>
      </div>
    </header>
  );
}
