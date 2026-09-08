"use client";

import { useState } from "react";
import { ThemeReview } from "@/types/superadmin";
import { MOCK_REVIEWS } from "@/lib/mock-superadmin-data";
import { toastManager } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

export default function ThemeReviewsPage() {
  const [reviews, setReviews] = useState<ThemeReview[]>(MOCK_REVIEWS);

  const handleTogglePublish = (id: number, current: boolean) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isPublished: !current } : r))
    );
    if (!current) {
      toastManager.success("Ulasan berhasil dipublikasikan ke halaman katalog tema.");
    } else {
      toastManager.info("Ulasan telah disembunyikan dari publik.");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-background">
            Moderasi Ulasan & Testimoni Tema
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Validasi ulasan bintang dan testimoni kepuasan pelanggan sebelum ditampilkan di landing page.
          </p>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between"
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

              <p className="text-xs text-on-surface leading-relaxed italic bg-surface-container-low p-3 rounded-xl">
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
        ))}
      </div>
    </div>
  );
}
