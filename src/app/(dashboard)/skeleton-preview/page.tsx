"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { DashboardSkeleton } from "@/components/ui/DashboardSkeleton";
import { KeuanganSkeleton } from "@/components/ui/KeuanganSkeleton";
import { Pattern } from "@/components/ui/v-skeleton-8";

export default function SkeletonPreviewPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "keuangan" | "pattern">("dashboard");

  return (
    <div className="flex flex-col gap-lg w-full pb-xl">
      <Topbar
        title="Loading Skeleton Preview"
        searchPlaceholder="Cari komponen..."
      />

      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-surface-variant/40 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 rounded-xl text-button-text transition-all ${
              activeTab === "dashboard"
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface-container-low text-on-surface hover:bg-surface-container"
            }`}
          >
            Dashboard Skeleton
          </button>
          <button
            onClick={() => setActiveTab("keuangan")}
            className={`px-4 py-2 rounded-xl text-button-text transition-all ${
              activeTab === "keuangan"
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface-container-low text-on-surface hover:bg-surface-container"
            }`}
          >
            Keuangan Skeleton
          </button>
          <button
            onClick={() => setActiveTab("pattern")}
            className={`px-4 py-2 rounded-xl text-button-text transition-all ${
              activeTab === "pattern"
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface-container-low text-on-surface hover:bg-surface-container"
            }`}
          >
            v-skeleton-8 (Pattern)
          </button>
        </div>

        <div className="text-body-sm text-on-surface-variant">
          Status: <span className="font-semibold text-primary">Simulasi Loading Aktif</span>
        </div>
      </div>

      {/* Preview Container */}
      <div className="w-full">
        {activeTab === "dashboard" && <DashboardSkeleton />}
        {activeTab === "keuangan" && <KeuanganSkeleton />}
        {activeTab === "pattern" && (
          <div className="flex min-h-[400px] w-full items-center justify-center rounded-2xl border border-surface-variant/40 bg-card p-8 shadow-sm">
            <Pattern />
          </div>
        )}
      </div>
    </div>
  );
}
