import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-surface-container-low overflow-x-hidden">
      {/* Icon-only Sidebar — fixed, 96px wide */}
      <Sidebar />

      {/* Main Content Area — margin-left = sidebar-width (96px) + gutter (24px) + outer-gutter (24px) */}
      <main className="flex-grow ml-[calc(96px+48px)] mr-lg py-lg flex flex-col min-h-screen">
        {children}
      </main>
    </div>
  );
}
