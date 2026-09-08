"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { EventProduct } from "@/types/superadmin";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-superadmin-data";
import { toastManager } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function CatalogProductsPage() {
  const [products, setProducts] = useState<EventProduct[]>(MOCK_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<EventProduct | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    categoryId: 1,
    price: 149000,
    badge: "New",
    description: "",
    thumbnailUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=500&auto=format&fit=crop&q=60",
    themeSlug: "wedding-royal-gold",
  });

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.themeSlug.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat =
        categoryFilter === "all" ? true : p.eventCategoryId.toString() === categoryFilter;

      return matchSearch && matchCat;
    });
  }, [products, searchQuery, categoryFilter]);

  const handleTogglePublish = (id: number, currentStatus: boolean, name: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isPublished: !currentStatus } : p))
    );
    if (!currentStatus) {
      toastManager.success(`Tema "${name}" telah dipublikasikan ke katalog publik.`);
    } else {
      toastManager.info(`Tema "${name}" telah ditarik ke draft.`);
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = MOCK_CATEGORIES.find((c) => c.id === Number(formData.categoryId));

    const newProd: EventProduct = {
      id: Date.now(),
      eventCategoryId: Number(formData.categoryId),
      categoryName: cat?.name || "Pernikahan",
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      badge: formData.badge,
      themeSlug: formData.themeSlug,
      price: Number(formData.price),
      thumbnailUrl: formData.thumbnailUrl,
      isPublished: true,
      totalSold: 0,
      createdAt: new Date().toISOString(),
    };

    setProducts((prev) => [newProd, ...prev]);
    setIsModalOpen(false);
    toastManager.success(`Tema baru "${newProd.name}" berhasil ditambahkan.`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-background">
            Katalog & Tema Undangan
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Kelola template tema undangan digital, penetapan harga paket, dan status publikasi.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-primary text-on-primary"
        >
          <span className="material-symbols-outlined text-lg">add_photo_alternate</span>
          <span>Tambah Tema Baru</span>
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
            search
          </span>
          <Input
            type="text"
            placeholder="Cari tema undangan atau kode folder tema..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-surface-container-low border-0"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 px-3 rounded-xl bg-surface-container-low text-xs text-on-surface font-medium border-0 focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="all">Semua Kategori</option>
            {MOCK_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id.toString()}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              {/* Thumbnail Container */}
              <div className="relative aspect-[16/10] bg-surface-container-low overflow-hidden group">
                <Image
                  src={prod.thumbnailUrl}
                  alt={prod.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {prod.badge && (
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary text-on-primary shadow-sm">
                    {prod.badge}
                  </span>
                )}
                <div className="absolute top-2.5 right-2.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${
                      prod.isPublished
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-700 text-white"
                    }`}
                  >
                    {prod.isPublished ? "Terbit" : "Draft"}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-2">
                <span className="text-[11px] font-semibold text-primary block uppercase tracking-wider">
                  {prod.categoryName}
                </span>
                <h3 className="font-bold text-base text-on-surface line-clamp-1">{prod.name}</h3>
                <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                  {prod.description}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-on-surface-variant block">Harga Tema:</span>
                    <span className="font-bold text-base text-on-surface">
                      Rp {prod.price.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-on-surface-variant block">Terjual:</span>
                    <span className="font-semibold text-xs text-emerald-700">
                      {prod.totalSold} Kali
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 pt-0 flex items-center gap-2">
              <Button
                variant={prod.isPublished ? "outline" : "default"}
                size="sm"
                onClick={() => handleTogglePublish(prod.id, prod.isPublished, prod.name)}
                className="w-full text-xs rounded-xl"
              >
                {prod.isPublished ? "Tarik ke Draft" : "Publikasikan"}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedProduct(prod)}
                className="h-9 w-9 p-0 rounded-xl text-primary hover:bg-primary-container"
                title="Lihat Detail Konfigurasi"
              >
                <span className="material-symbols-outlined text-lg">settings</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Product Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">palette</span>
              Tambah Tema Undangan Baru
            </DialogTitle>
            <DialogDescription>
              Daftarkan template tema baru ke dalam katalog sistem Momen Invite.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateProduct} className="space-y-3.5 my-2">
            <div>
              <Label className="text-xs font-semibold">Nama Tema</Label>
              <Input
                placeholder="Contoh: Modern Rustic Floral"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 rounded-xl"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Kategori</Label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                  className="mt-1 w-full h-10 px-3 rounded-xl bg-surface-container-low text-xs font-medium border-0 focus:ring-2 focus:ring-primary outline-none"
                >
                  {MOCK_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-xs font-semibold">Harga Jual (Rp)</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="mt-1 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Theme Slug Folder</Label>
                <Input
                  placeholder="wedding-rustic-floral"
                  value={formData.themeSlug}
                  onChange={(e) => setFormData({ ...formData, themeSlug: e.target.value })}
                  className="mt-1 rounded-xl font-mono text-xs"
                  required
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">Badge Promosi</Label>
                <select
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="mt-1 w-full h-10 px-3 rounded-xl bg-surface-container-low text-xs font-medium border-0 focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="">Tanpa Badge</option>
                  <option value="Best Seller">Best Seller</option>
                  <option value="New">New</option>
                  <option value="Popular">Popular</option>
                  <option value="Trending">Trending</option>
                </select>
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold">URL Thumbnail Cover</Label>
              <Input
                placeholder="https://..."
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                className="mt-1 rounded-xl text-xs"
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Deskripsi Singkat</Label>
              <Input
                placeholder="Deskripsi keunggulan desain dan fitur..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 rounded-xl"
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl"
              >
                Batal
              </Button>
              <Button type="submit" className="rounded-xl bg-primary text-on-primary">
                Simpan & Rilis
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Product Detail Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">layers</span>
              Konfigurasi Komponen Tema
            </DialogTitle>
            <DialogDescription>
              Struktur seksi bawaan yang dirender saat tema ini dipilih oleh host.
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4 my-2 text-sm">
              <div className="p-3 rounded-xl bg-surface-container-low space-y-1">
                <div className="font-bold text-on-surface">{selectedProduct.name}</div>
                <div className="font-mono text-xs text-primary">Folder: {selectedProduct.themeSlug}</div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-on-surface-variant block">
                  Daftar Seksi Terintegrasi:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Hero Banner",
                    "Mempelai / Profil",
                    "Countdown Timer Hari-H",
                    "Lokasi Akad & Resepsi (Google Maps)",
                    "Amplop Kado Digital Realtime",
                    "Buku Tamu & Ucapan Doa",
                    "Galeri Foto Cloudflare R2",
                    "Protokol Kesehatan",
                  ].map((sec, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-surface-container-low text-on-surface border border-outline-variant/30"
                    >
                      ✓ {sec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedProduct(null)}
              className="rounded-xl w-full"
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
