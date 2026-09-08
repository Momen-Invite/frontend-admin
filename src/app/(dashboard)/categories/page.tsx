"use client";

import { useState, useCallback, useEffect } from "react";
import { EventCategory } from "@/types/superadmin";
import { categoriesApi, PaginationMeta } from "@/lib/api-superadmin";
import { ApiError } from "@/lib/api";
import { toastManager } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/ui/pagination";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const DEFAULT_META: PaginationMeta = { total: 0, page: 1, limit: 15, totalPages: 1, hasNextPage: false, hasPrevPage: false };
const EMPTY_FORM = { name: "", slug: "", description: "", requiresRsvp: false, isActive: true };

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [editTarget, setEditTarget] = useState<EventCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await categoriesApi.list({ page, limit: 15 });
      const d = res.data as { items: EventCategory[]; meta: PaginationMeta };
      setCategories(d.items ?? []);
      setMeta(d.meta ?? DEFAULT_META);
    } catch (err) {
      toastManager.error(err instanceof ApiError ? err.message : "Gagal memuat kategori.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openCreate = () => {
    setEditTarget(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (cat: EventCategory) => {
    setEditTarget(cat);
    setFormData({ name: cat.name, slug: cat.slug, description: cat.description ?? "", requiresRsvp: cat.requiresRsvp, isActive: cat.isActive });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) { toastManager.error("Nama dan slug wajib diisi."); return; }
    setSaving(true);
    try {
      if (editTarget) {
        await categoriesApi.update(editTarget.id, formData);
        toastManager.success(`Kategori "${formData.name}" berhasil diperbarui.`);
      } else {
        await categoriesApi.create(formData);
        toastManager.success(`Kategori "${formData.name}" berhasil dibuat.`);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      toastManager.error(err instanceof ApiError ? err.message : "Gagal menyimpan kategori.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: EventCategory) => {
    if (!confirm(`Hapus kategori "${cat.name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    try {
      await categoriesApi.delete(cat.id);
      toastManager.success(`Kategori "${cat.name}" berhasil dihapus.`);
      fetchCategories();
    } catch (err) {
      toastManager.error(err instanceof ApiError ? err.message : "Gagal menghapus kategori.");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-background">Master Kategori Acara</h1>
          <p className="text-sm text-on-surface-variant mt-1">Kelola kategori undangan dan kontrol aktivasi RSVP per kategori.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={fetchCategories} disabled={loading} className="rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">refresh</span>
          </Button>
          <Button size="sm" onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-primary text-on-primary">
            <span className="material-symbols-outlined text-lg">add</span>
            <span>Tambah Kategori</span>
          </Button>
        </div>
      </div>

      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-low/50 text-xs font-semibold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/20">
              <tr>
                <th className="py-3.5 px-4">Nama Kategori</th>
                <th className="py-3.5 px-4">Slug</th>
                <th className="py-3.5 px-4">RSVP</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Jml Produk</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-on-surface">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="py-3 px-4"><div className="h-4 bg-surface-container-low rounded animate-pulse" /></td>
                  ))}</tr>
                ))
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl block mb-2 opacity-50">category</span>
                    Belum ada kategori.
                  </td>
                </tr>
              ) : categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="py-3 px-4 font-semibold">{cat.name}</td>
                  <td className="py-3 px-4 text-xs font-mono text-on-surface-variant">{cat.slug}</td>
                  <td className="py-3 px-4">
                    {cat.requiresRsvp
                      ? <span className="px-2 py-0.5 rounded-full text-xs bg-primary-container text-on-primary-container font-semibold">RSVP Wajib</span>
                      : <span className="px-2 py-0.5 rounded-full text-xs bg-surface-variant text-on-surface-variant font-semibold">Tidak</span>}
                  </td>
                  <td className="py-3 px-4">
                    {cat.isActive ? <StatusBadge variant="sukses" label="Aktif" /> : <StatusBadge variant="nonaktif" label="Nonaktif" />}
                  </td>
                  <td className="py-3 px-4">{cat.productCount} tema</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(cat)} className="h-8 w-8 p-0 rounded-lg text-primary hover:bg-primary-container" title="Edit">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(cat)} className="h-8 w-8 p-0 rounded-lg text-error hover:bg-error-container/20" title="Hapus">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={meta.page} totalPages={meta.totalPages} totalItems={meta.total} pageSize={meta.limit} onPageChange={setPage} isLiveApi={!loading} />
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">{editTarget ? "Edit Kategori" : "Tambah Kategori Baru"}</DialogTitle>
            <DialogDescription>Isi detail kategori acara undangan di bawah ini.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 my-2">
            <div className="space-y-1.5">
              <Label htmlFor="cat-name" className="text-xs font-semibold">Nama Kategori</Label>
              <Input id="cat-name" placeholder="cth. Pernikahan" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} className="rounded-xl h-10" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cat-slug" className="text-xs font-semibold">Slug URL</Label>
              <Input id="cat-slug" placeholder="cth. pernikahan" value={formData.slug} onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))} className="rounded-xl h-10 font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cat-desc" className="text-xs font-semibold">Deskripsi (opsional)</Label>
              <Input id="cat-desc" placeholder="Deskripsi singkat kategori" value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} className="rounded-xl h-10" />
            </div>
            <div className="flex flex-col gap-3">
              {[
                { id: "requiresRsvp", label: "Wajibkan RSVP untuk kategori ini", key: "requiresRsvp" as const },
                { id: "isActive", label: "Kategori aktif (tampil di platform)", key: "isActive" as const },
              ].map((toggle) => (
                <label key={toggle.id} className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setFormData((p) => ({ ...p, [toggle.key]: !p[toggle.key] }))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${formData[toggle.key] ? "bg-primary" : "bg-outline-variant"}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${formData[toggle.key] ? "translate-x-6" : "translate-x-1"}`} />
                  </div>
                  <span className="text-sm text-on-surface">{toggle.label}</span>
                </label>
              ))}
            </div>
            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={saving} className="rounded-xl">Batal</Button>
              <Button type="submit" disabled={saving} className="rounded-xl bg-primary text-on-primary">
                {saving ? "Menyimpan..." : editTarget ? "Simpan Perubahan" : "Buat Kategori"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
