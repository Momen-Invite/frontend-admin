"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { MobileDrawer } from "@/components/layout/MobileDrawer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface-container-low overflow-x-hidden relative w-full">
      {/* Icon-only Sidebar — fixed on desktop, hidden on mobile */}
      <Sidebar />

      {/* Main Content Area */}
      {/* Mobile: ml-0, px-4, pt-3, pb-24 (room for bottom nav) */}
      {/* Desktop: ml-[144px], mr-lg, py-lg, px-0 */}
      <main className="flex-grow ml-0 px-4 pt-3 pb-24 md:ml-[calc(96px+48px)] md:mr-lg md:py-lg md:px-0 md:pb-lg flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar (md:hidden) */}
      <BottomNavigation onOpenMenu={() => setIsDrawerOpen(true)} />

      {/* Mobile Slide-over Drawer for Extra Menus */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
