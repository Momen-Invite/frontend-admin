"use client";

import { useState } from "react";
import { EventCategory } from "@/types/superadmin";
import { MOCK_CATEGORIES } from "@/lib/mock-superadmin-data";
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

export default function EventCategoriesPage() {
  const [categories, setCategories] = useState<EventCategory[]>(MOCK_CATEGORIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<EventCategory | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    requiresRsvp: true,
    description: "",
  });

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ name: "", slug: "", requiresRsvp: true, description: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: EventCategory) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      requiresRsvp: cat.requiresRsvp,
      description: cat.description || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      toastManager.error("Nama dan slug kategori wajib diisi.");
      return;
    }

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                name: formData.name,
                slug: formData.slug,
                requiresRsvp: formData.requiresRsvp,
                description: formData.description,
              }
            : c
        )
      );
      toastManager.success(`Kategori "${formData.name}" berhasil diperbarui.`);
    } else {
      const newCat: EventCategory = {
        id: Date.now(),
        name: formData.name,
        slug: formData.slug,
        requiresRsvp: formData.requiresRsvp,
        isActive: true,
        productCount: 0,
        description: formData.description,
        createdAt: new Date().toISOString(),
      };
      setCategories((prev) => [...prev, newCat]);
      toastManager.success(`Kategori baru "${formData.name}" berhasil ditambahkan.`);
    }

    setIsModalOpen(false);
  };

  const handleToggleActive = (id: number) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
    toastManager.info("Status aktif kategori diperbarui.");
  };

  const handleToggleRsvp = (id: number) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, requiresRsvp: !c.requiresRsvp } : c))
    );
    toastManager.info("Konfigurasi kebutuhan RSVP diperbarui.");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-background">
            Master Kategori Acara
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Kelola jenis acara (Wedding, Birthday, Greeting) dan pengaturan sistem RSVP otomatis.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-xl bg-primary text-on-primary"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          <span>Tambah Kategori</span>
        </Button>
      </div>

      {/* Categories Table */}
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-low/50 text-xs font-semibold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/20">
              <tr>
                <th className="py-3.5 px-4">Nama Kategori</th>
                <th className="py-3.5 px-4">Slug URL</th>
                <th className="py-3.5 px-4">Wajib Fitur RSVP?</th>
                <th className="py-3.5 px-4">Jumlah Tema</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-on-surface text-xs">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-sm text-on-surface">{cat.name}</div>
                    <div className="text-on-surface-variant text-[11px] max-w-sm truncate">
                      {cat.description || "—"}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-primary">
                    {cat.slug}
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleRsvp(cat.id)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-colors ${
                        cat.requiresRsvp
                          ? "bg-primary-container text-on-primary-container"
                          : "bg-surface-variant text-on-surface-variant"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xs">
                        {cat.requiresRsvp ? "task_alt" : "remove_done"}
                      </span>
                      {cat.requiresRsvp ? "Perlu RSVP & Tamu" : "Tanpa RSVP"}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-on-surface">
                    {cat.productCount} Tema Aktif
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleActive(cat.id)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        cat.isActive
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {cat.isActive ? "Aktif" : "Nonaktif"}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEdit(cat)}
                      className="h-8 text-xs text-primary hover:bg-primary-container rounded-lg"
                    >
                      Edit Kategori
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-outline-variant/20 p-3 space-y-3">
          {categories.map((cat) => (
            <div key={cat.id} className="p-4 rounded-xl bg-surface-container-low space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-on-surface text-sm">{cat.name}</div>
                  <div className="font-mono text-xs text-primary">{cat.slug}</div>
                </div>
                <button
                  onClick={() => handleToggleActive(cat.id)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    cat.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {cat.isActive ? "Aktif" : "Mati"}
                </button>
              </div>

              <div className="text-xs text-on-surface-variant line-clamp-2">
                {cat.description}
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(cat)}
                  className="w-full text-xs rounded-xl"
                >
                  Edit Kategori
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Category Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">category</span>
              {editingCategory ? "Edit Kategori Acara" : "Tambah Kategori Baru"}
            </DialogTitle>
            <DialogDescription>
              Atur tipe acara dan konfigurasi fitur bawaan bagi pesanan undangan.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 my-2">
            <div>
              <Label className="text-xs font-semibold">Nama Kategori</Label>
              <Input
                placeholder="Contoh: Tunangan & Lamaran"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 rounded-xl"
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Slug URL Kategori</Label>
              <Input
                placeholder="engagement"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                className="mt-1 rounded-xl font-mono"
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Deskripsi</Label>
              <Input
                placeholder="Deskripsi singkat jenis undangan..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 rounded-xl"
              />
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low">
              <input
                type="checkbox"
                id="requiresRsvp"
                checked={formData.requiresRsvp}
                onChange={(e) => setFormData({ ...formData, requiresRsvp: e.target.checked })}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
              <label htmlFor="requiresRsvp" className="text-xs text-on-surface cursor-pointer select-none">
                <span className="font-semibold block">Wajibkan Modul RSVP & Buku Tamu</span>
                <span className="text-on-surface-variant text-[11px]">
                  Jika aktif, pemesan kategori ini otomatis mendapatkan menu kelola tamu dan barcode presensi.
                </span>
              </label>
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
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
