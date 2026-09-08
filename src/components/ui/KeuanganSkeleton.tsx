import { Skeleton } from "@/components/ui/skeleton";

export function KeuanganSkeleton() {
  return (
    <div className="flex flex-col gap-md sm:gap-lg w-full animate-fade-up">
      {/* ─── Topbar Skeleton ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 pb-md border-b border-surface-variant/40">
        <div className="space-y-1.5">
          <Skeleton className="h-7 sm:h-8 w-32 sm:w-40 rounded-lg bg-surface-container-high" />
          <Skeleton className="h-3.5 sm:h-4 w-44 sm:w-64 rounded-md bg-surface-container" />
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Skeleton className="hidden md:block h-10 w-48 rounded-full bg-surface-container" />
          <Skeleton className="size-9 sm:size-10 rounded-full bg-surface-container" />
          <Skeleton className="size-9 sm:size-10 rounded-full bg-surface-container-high" />
        </div>
      </div>

      {/* ─── Dashboard Grid (12 Columns) ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md sm:gap-lg flex-grow">
        {/* ── Left Column (4 cols / ~35%) ──────────────────────────────────── */}
        <div className="lg:col-span-4 flex flex-col gap-md sm:gap-lg">
          {/* Balance Card Skeleton */}
          <div className="bg-card rounded-2xl border border-surface-variant/40 p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28 rounded-md bg-surface-container" />
              <Skeleton className="h-5 sm:h-6 w-16 sm:w-20 rounded-full bg-surface-container-high" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 sm:h-10 w-44 sm:w-52 rounded-xl bg-surface-container-high" />
              <Skeleton className="h-3.5 sm:h-4 w-36 sm:w-40 rounded-md bg-surface-container" />
            </div>
            <Skeleton className="h-10 sm:h-11 w-full rounded-xl bg-surface-container-high" />
          </div>

          {/* Withdrawal Form Skeleton */}
          <div className="bg-card rounded-2xl border border-surface-variant/40 p-4 sm:p-6 shadow-sm space-y-3 sm:space-y-4">
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-44 rounded-md bg-surface-container-high" />
              <Skeleton className="h-3.5 w-56 rounded-md bg-surface-container" />
            </div>

            {/* Input & Quick Chips */}
            <div className="space-y-3 pt-2">
              <Skeleton className="h-11 sm:h-12 w-full rounded-xl bg-surface-container" />
              <div className="flex items-center gap-1.5 sm:gap-2">
                {[1, 2, 3, 4].map((_, i) => (
                  <Skeleton key={i} className="h-7 flex-1 rounded-lg bg-surface-container" />
                ))}
              </div>
            </div>

            {/* Slider track skeleton */}
            <div className="pt-2">
              <Skeleton className="h-11 sm:h-12 w-full rounded-full bg-surface-container-high" />
            </div>
          </div>

          {/* Weekly Gift Chart Skeleton */}
          <div className="bg-card rounded-2xl border border-surface-variant/40 p-4 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-36 rounded-md bg-surface-container-high" />
                <Skeleton className="h-3.5 w-24 rounded-md bg-surface-container" />
              </div>
              <Skeleton className="h-7 w-20 rounded-lg bg-surface-container" />
            </div>

            {/* 7 Daily Bars */}
            <div className="h-36 sm:h-44 w-full flex items-end justify-between gap-1.5 sm:gap-2 pt-4 px-1">
              {[35, 55, 25, 75, 95, 45, 20].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <Skeleton
                    className={`w-full rounded-t-md ${
                      i === 4 ? "bg-primary/40" : "bg-surface-container-high"
                    }`}
                    style={{ height: `${h}%` }}
                  />
                  <Skeleton className="h-2.5 sm:h-3 w-4 sm:w-5 rounded-sm bg-surface-container" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Column (8 cols / ~65%) ─────────────────────────────────── */}
        <div className="lg:col-span-8 flex flex-col gap-md sm:gap-lg">
          {/* Digital Gift History Table Skeleton */}
          <div className="bg-card rounded-2xl border border-surface-variant/40 p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1.5">
                <Skeleton className="h-5 sm:h-6 w-44 rounded-md bg-surface-container-high" />
                <Skeleton className="h-3.5 w-56 rounded-md bg-surface-container" />
              </div>
              <Skeleton className="h-8 sm:h-9 w-24 rounded-lg bg-surface-container-high" />
            </div>

            {/* Rows */}
            <div className="divide-y divide-surface-variant/30">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-3 gap-3">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <Skeleton className="size-9 sm:size-10 rounded-full bg-surface-container-high shrink-0" />
                    <div className="space-y-1 min-w-0">
                      <Skeleton className="h-3.5 sm:h-4 w-32 sm:w-36 rounded-md bg-surface-container-high" />
                      <Skeleton className="h-3 w-44 sm:w-52 rounded-md bg-surface-container" />
                    </div>
                  </div>
                  <Skeleton className="h-5 sm:h-6 w-16 sm:w-20 rounded-full bg-surface-container shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Withdrawal History Table Skeleton */}
          <div className="bg-card rounded-2xl border border-surface-variant/40 p-4 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-40 rounded-md bg-surface-container-high" />
              <Skeleton className="h-7 sm:h-8 w-20 sm:w-24 rounded-lg bg-surface-container" />
            </div>

            <div className="divide-y divide-surface-variant/30">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-3 gap-3">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <Skeleton className="size-8 sm:size-9 rounded-xl bg-surface-container-high shrink-0" />
                    <div className="space-y-1">
                      <Skeleton className="h-3.5 w-24 sm:w-28 rounded-md bg-surface-container-high" />
                      <Skeleton className="h-3 w-32 sm:w-36 rounded-md bg-surface-container" />
                    </div>
                  </div>
                  <Skeleton className="h-5 sm:h-6 w-16 sm:w-20 rounded-full bg-surface-container" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KeuanganSkeleton;
