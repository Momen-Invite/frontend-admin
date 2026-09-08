"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
  isLiveApi?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
  className,
  isLiveApi,
}: PaginationProps) {
  const safeTotalPages = Math.max(1, totalPages);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with ellipsis
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (safeTotalPages <= maxVisible) {
      for (let i = 1; i <= safeTotalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(safeTotalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < safeTotalPages - 2) {
        pages.push("...");
      }

      if (!pages.includes(safeTotalPages)) {
        pages.push(safeTotalPages);
      }
    }

    return pages;
  }, [currentPage, safeTotalPages]);

  return (
    <div
      className={cn(
        "p-4 bg-surface-container-lowest border-t border-outline-variant/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs",
        className
      )}
    >
      {/* Left: Range Info & Status Badge */}
      <div className="flex items-center gap-2 text-on-surface-variant font-medium">
        <span>
          Menampilkan <strong className="text-on-surface font-semibold">{startItem}</strong>-
          <strong className="text-on-surface font-semibold">{endItem}</strong> dari{" "}
          <strong className="text-on-surface font-semibold">{totalItems}</strong> data
        </span>

        {isLiveApi !== undefined && (
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-bold select-none inline-flex items-center gap-1",
              isLiveApi
                ? "bg-emerald-100 text-emerald-800"
                : "bg-slate-100 text-slate-700"
            )}
            title={isLiveApi ? "Terhubung ke REST API Cloud" : "Mode Standalone / Fallback Local Data"}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                isLiveApi ? "bg-emerald-600 animate-pulse" : "bg-slate-400"
              )}
            />
            {isLiveApi ? "Live API" : "Simulasi"}
          </span>
        )}
      </div>

      {/* Right: Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Page Size Selector */}
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 mr-1">
            <span className="text-on-surface-variant text-[11px]">Tampilkan:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-8 px-2 rounded-lg bg-surface-container-low text-xs font-semibold text-on-surface border border-outline-variant/30 focus:ring-1 focus:ring-primary outline-none cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} / hal
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Buttons Nav */}
        <div className="inline-flex items-center gap-1">
          {/* First Page */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={currentPage <= 1}
            className="h-8 w-8 p-0 rounded-lg text-on-surface-variant disabled:opacity-30 hover:bg-surface-container-low"
            title="Halaman Pertama"
          >
            <span className="material-symbols-outlined text-base">first_page</span>
          </Button>

          {/* Prev Page */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="h-8 w-8 p-0 rounded-lg text-on-surface-variant disabled:opacity-30 hover:bg-surface-container-low"
            title="Halaman Sebelumnya"
          >
            <span className="material-symbols-outlined text-base">chevron_left</span>
          </Button>

          {/* Page numbers */}
          <div className="hidden sm:inline-flex items-center gap-1">
            {pageNumbers.map((p, idx) => {
              if (p === "...") {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="w-8 h-8 flex items-center justify-center text-on-surface-variant select-none"
                  >
                    …
                  </span>
                );
              }

              const pageNum = Number(p);
              const isActive = pageNum === currentPage;

              return (
                <button
                  key={`page-${pageNum}`}
                  onClick={() => onPageChange(pageNum)}
                  className={cn(
                    "w-8 h-8 rounded-lg font-semibold text-xs transition-colors flex items-center justify-center select-none",
                    isActive
                      ? "bg-primary text-on-primary shadow-sm"
                      : "text-on-surface hover:bg-surface-container-low"
                  )}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Compact page label on mobile */}
          <span className="sm:hidden px-2 font-semibold text-on-surface">
            {currentPage} / {safeTotalPages}
          </span>

          {/* Next Page */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= safeTotalPages}
            className="h-8 w-8 p-0 rounded-lg text-on-surface-variant disabled:opacity-30 hover:bg-surface-container-low"
            title="Halaman Berikutnya"
          >
            <span className="material-symbols-outlined text-base">chevron_right</span>
          </Button>

          {/* Last Page */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(safeTotalPages)}
            disabled={currentPage >= safeTotalPages}
            className="h-8 w-8 p-0 rounded-lg text-on-surface-variant disabled:opacity-30 hover:bg-surface-container-low"
            title="Halaman Terakhir"
          >
            <span className="material-symbols-outlined text-base">last_page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
