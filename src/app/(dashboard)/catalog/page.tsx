"use client";

import { useState, useCallback, useEffect } from "react";
import { EventProduct } from "@/types/superadmin";
import { productsApi, PaginationMeta } from "@/lib/api-superadmin";
import { ApiError } from "@/lib/api";
import { toastManager } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { StatusBadge } from "@/components/ui/StatusBadge";
import Image from "next/image";

const DEFAULT_META: PaginationMeta = { total: 0, page: 1, limit: 12, totalPages: 1, hasNextPage: false, hasPrevPage: false };

export default function CatalogPage() {
  const [products, setProducts] = useState<EventProduct[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [publishFilter, setPublishFilter] = useState("all");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productsApi.list({
        page,
        limit: 12,
        search: searchQuery || undefined,
        isPublished: publishFilter !== "all" ? publishFilter === "published" : undefined,
      });
      const d = res.data as { items: EventProduct[]; meta: PaginationMeta };
      setProducts(d.items ?? []);
      setMeta(d.meta ?? DEFAULT_META);
    } catch (err) {
      toastManager.error(err instanceof ApiError ? err.message : "Gagal memuat katalog produk.");
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, publishFilter]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { setPage(1); }, [searchQuery, publishFilter]);

  const handleTogglePublish = async (product: EventProduct) => {
    try {
      await productsApi.togglePublish(product.id, !product.isPublished);
      toastManager.success(`Tema "${product.name}" ${!product.isPublished ? "dipublikasikan" : "disembunyikan"}.`);
      fetchProducts();
    } catch (err) {
      toastManager.error(err instanceof ApiError ? err.message : "Gagal mengubah status publikasi.");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-background">Katalog Tema Undangan</h1>
          <p className="text-sm text-on-surface-variant mt-1">Kelola tema & produk undangan, kontrol publikasi, dan pantau penjualan.</p>
        </div>
        <Button size="sm" variant="outline" onClick={fetchProducts} disabled={loading} className="rounded-xl flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">refresh</span>
          <span className="hidden sm:inline">Segarkan</span>
        </Button>
      </div>

      {/* Toolbar */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 max-w-md flex gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
            <Input type="text" placeholder="Cari nama tema..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && setSearchQuery(searchInput)} className="pl-10 h-10 rounded-xl bg-surface-container-low border-0" />
          </div>
          <Button size="sm" onClick={() => setSearchQuery(searchInput)} className="h-10 rounded-xl">Cari</Button>
        </div>
        <div className="inline-flex rounded-xl bg-surface-container-low p-1 text-xs font-medium self-start">
          {[{ id: "all", label: "Semua" }, { id: "published", label: "Dipublikasi" }, { id: "draft", label: "Draft" }].map((tab) => (
            <button key={tab.id} onClick={() => { setPublishFilter(tab.id); setPage(1); }} className={`px-3 py-1.5 rounded-lg transition-colors ${publishFilter === tab.id ? "bg-surface-container-lowest text-primary font-bold shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 overflow-hidden">
              <div className="aspect-video bg-surface-container-low animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-surface-container-low rounded animate-pulse w-3/4" />
                <div className="h-3 bg-surface-container-low rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center text-on-surface-variant rounded-2xl bg-surface-container-lowest border border-outline-variant/30">
          <span className="material-symbols-outlined text-5xl block mb-3 opacity-40">photo_library</span>
          <p>Tidak ada produk yang cocok.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
              <div className="relative aspect-video bg-surface-container-low overflow-hidden">
                {product.thumbnailUrl ? (
                  <Image src={product.thumbnailUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">image</span>
                  </div>
                )}
                {product.badge && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold bg-primary text-on-primary">{product.badge}</span>
                )}
                <div className="absolute top-2 right-2">
                  {product.isPublished ? <StatusBadge variant="sukses" label="Publik" /> : <StatusBadge variant="nonaktif" label="Draft" />}
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <p className="text-xs text-on-surface-variant mb-1">{product.categoryName}</p>
                <h3 className="font-semibold text-on-surface text-sm leading-snug mb-2">{product.name}</h3>
                <div className="mt-auto flex items-center justify-between">
                  <div>
                    <div className="text-base font-bold text-primary">Rp {product.price.toLocaleString("id-ID")}</div>
                    <div className="text-xs text-on-surface-variant">{product.totalSold} terjual</div>
                  </div>
                  <Button
                    variant={product.isPublished ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleTogglePublish(product)}
                    className="rounded-xl text-xs h-8"
                  >
                    {product.isPublished ? "Sembunyikan" : "Publikasi"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 overflow-hidden">
        <Pagination currentPage={meta.page} totalPages={meta.totalPages} totalItems={meta.total} pageSize={meta.limit} onPageChange={setPage} isLiveApi={!loading} />
      </div>
    </div>
  );
}
