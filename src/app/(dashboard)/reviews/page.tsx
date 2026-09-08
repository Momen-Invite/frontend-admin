"use client";

import { useState, useEffect, useCallback } from "react";
import { ThemeReview } from "@/types/superadmin";
import { MOCK_REVIEWS } from "@/lib/mock-superadmin-data";
import { reviewsApi, PaginationMeta } from "@/lib/api-superadmin";
import { ApiError } from "@/lib/api";
import { toastManager } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";

const DEFAULT_META: PaginationMeta = {
  total: 0,
  page: 1,
  limit: 12,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

export default function ThemeReviewsPage() {
  const [reviews, setReviews] = useState<ThemeReview[]>(MOCK_REVIEWS);
  const [meta, setMeta] = useState<PaginationMeta>({
    ...DEFAULT_META,
    total: MOCK_REVIEWS.length,
    totalPages: Math.max(1, Math.ceil(MOCK_REVIEWS.length / 12)),
  });
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(12);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reviewsApi.list({
        page,
        limit,
        search: searchQuery || undefined,
      });
      if (res.data) {
        const d = res.data as { items: ThemeReview[]; meta: PaginationMeta };
        setReviews(d.items ?? []);
        setMeta(d.meta ?? DEFAULT_META);
      }
    } catch (err) {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setPage(1);
  };

  const handleTogglePublish = async (id: number, current: boolean) => {
    try {
      await reviewsApi.togglePublish(id, !current);
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isPublished: !current } : r))
      );
      if (!current) {
        toastManager.success("Ulasan berhasil dipublikasikan ke landing page.");
      } else {
        toastManager.info("Ulasan disembunyikan dari publik.");
      }
    } catch {
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isPublished: !current } : r))
      );
      toastManager.success(!current ? "Ulasan dipublikasikan (offline)." : "Ulasan disembunyikan.");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-background">
              Moderasi Ulasan & Testimoni Tema
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live API
            </span>
          </div>
          <p className="text-sm text-on-surface-variant mt-1">
            Validasi ulasan bintang dan testimoni kepuasan pelanggan sebelum ditampilkan di landing page.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={fetchReviews}
          className="flex items-center gap-2 rounded-xl"
        >
          <span className={`material-symbols-outlined text-lg ${loading ? "animate-spin" : ""}`}>refresh</span>
          <span>{loading ? "Menyegarkan..." : "Segarkan Ulasan"}</span>
        </Button>
      </div>

      {/* Toolbar */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
              search
            </span>
            <Input
              type="text"
              placeholder="Cari nama pengulas, produk tema, atau testimoni..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-surface-container-low border-0"
            />
          </div>
          <Button type="submit" size="sm" className="h-10 px-4 rounded-xl">
            Cari
          </Button>
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchInput("");
                setSearchQuery("");
                setPage(1);
              }}
              className="h-10 px-3 rounded-xl text-xs"
            >
              Reset
            </Button>
          )}
        </form>
      </div>

      {/* Reviews Grid */}
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm p-5 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-surface-container-low animate-pulse space-y-3 h-48 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="h-5 bg-surface-container-high rounded w-32" />
                  <div className="h-3 bg-surface-container-high rounded w-20" />
                  <div className="h-12 bg-surface-container-high rounded mt-2" />
                </div>
                <div className="h-8 bg-surface-container-high rounded-xl w-24" />
              </div>
            ))
          ) : reviews.length === 0 ? (
            <div className="col-span-full py-12 text-center text-on-surface-variant text-sm">
              Tidak ada ulasan ditemukan.
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-surface-container-low/40 border border-outline-variant/30 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-base text-on-surface">{rev.userName}</div>
                      <div className="text-xs text-primary font-medium">{rev.productName}</div>
                    </div>

                    <div className="flex text-amber-500 text-sm">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`material-symbols-outlined text-sm ${
                            i < rev.rating ? "filled" : "opacity-30"
                          }`}
                        >
                          star
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-on-surface leading-relaxed italic bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/10">
                    &ldquo;{rev.message}&rdquo;
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between">
                  <span className="text-[11px] text-on-surface-variant">
                    {new Date(rev.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>

                  <Button
                    variant={rev.isPublished ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleTogglePublish(rev.id, rev.isPublished)}
                    className="h-8 text-xs rounded-xl"
                  >
                    {rev.isPublished ? "Sembunyikan" : "Publikasikan"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          pageSize={limit}
          onPageChange={(p) => setPage(p)}
          onPageSizeChange={(s) => {
            setLimit(s);
            setPage(1);
          }}
          isLiveApi={!loading}
        />
      </div>
    </div>
  );
}
