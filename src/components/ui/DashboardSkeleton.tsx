import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-lg w-full animate-fade-up">
      {/* ─── Topbar Skeleton ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md pb-md border-b border-surface-variant/40">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-lg bg-surface-container-high" />
          <Skeleton className="h-4 w-72 rounded-md bg-surface-container" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-48 sm:w-64 rounded-full bg-surface-container" />
          <Skeleton className="size-10 rounded-full bg-surface-container" />
          <Skeleton className="size-10 rounded-full bg-surface-container-high" />
        </div>
      </div>

      {/* ─── Metric Cards Grid (4 Cards) ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-md">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-card rounded-2xl border border-surface-variant/40 p-5 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28 rounded-md bg-surface-container" />
              <Skeleton className="size-10 rounded-xl bg-surface-container-high" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-36 rounded-lg bg-surface-container-high" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-16 rounded-full bg-surface-container" />
                <Skeleton className="h-3.5 w-24 rounded-md bg-surface-container" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Charts & Analytics Section (8 cols + 4 cols) ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/* Main Chart Card (8 cols) */}
        <div className="lg:col-span-8 bg-card rounded-2xl border border-surface-variant/40 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-44 rounded-md bg-surface-container-high" />
              <Skeleton className="h-3.5 w-60 rounded-md bg-surface-container" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-20 rounded-lg bg-surface-container" />
              <Skeleton className="h-8 w-20 rounded-lg bg-surface-container" />
              <Skeleton className="h-8 w-20 rounded-lg bg-surface-container-high" />
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="h-72 w-full flex items-end gap-3 pt-4 px-2">
            {[45, 65, 30, 85, 55, 90, 70, 80, 60, 95, 75, 85].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <Skeleton
                  className="w-full rounded-t-md bg-surface-container-high"
                  style={{ height: `${h}%` }}
                />
                <Skeleton className="h-3 w-6 rounded-sm bg-surface-container" />
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Card (4 cols) */}
        <div className="lg:col-span-4 bg-card rounded-2xl border border-surface-variant/40 p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-2 mb-6">
            <Skeleton className="h-6 w-36 rounded-md bg-surface-container-high" />
            <Skeleton className="h-3.5 w-48 rounded-md bg-surface-container" />
          </div>

          {/* Donut/Circle skeleton */}
          <div className="flex items-center justify-center my-4">
            <div className="relative size-44 rounded-full border-8 border-surface-container flex items-center justify-center">
              <div className="size-28 rounded-full bg-surface-container-low flex flex-col items-center justify-center space-y-1">
                <Skeleton className="h-5 w-16 rounded-md bg-surface-container-high" />
                <Skeleton className="h-3 w-12 rounded-md bg-surface-container" />
              </div>
            </div>
          </div>

          {/* Legend Items */}
          <div className="space-y-2.5 pt-2">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="size-3 rounded-full bg-surface-container-high" />
                  <Skeleton className="h-3.5 w-24 rounded-md bg-surface-container" />
                </div>
                <Skeleton className="h-3.5 w-12 rounded-md bg-surface-container-high" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Recent Activity / Table Skeleton ───────────────────────────────── */}
      <div className="bg-card rounded-2xl border border-surface-variant/40 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 rounded-md bg-surface-container-high" />
            <Skeleton className="h-3.5 w-64 rounded-md bg-surface-container" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-32 rounded-lg bg-surface-container" />
            <Skeleton className="h-9 w-24 rounded-lg bg-surface-container-high" />
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-surface-variant/30">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3.5 gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full bg-surface-container-high" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-36 rounded-md bg-surface-container-high" />
                  <Skeleton className="h-3 w-28 rounded-md bg-surface-container" />
                </div>
              </div>
              <div className="hidden sm:flex flex-col space-y-1 items-end">
                <Skeleton className="h-3.5 w-24 rounded-md bg-surface-container" />
                <Skeleton className="h-3 w-16 rounded-md bg-surface-container" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-20 rounded-full bg-surface-container" />
                <Skeleton className="h-8 w-20 rounded-lg bg-surface-container-high hidden md:block" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardSkeleton;
