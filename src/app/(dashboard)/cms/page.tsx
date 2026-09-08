"use client";

import { useState } from "react";
import Image from "next/image";
import { PromoPopup, SocialMediaAccount, FaqCategory, FaqItem } from "@/types/superadmin";
import {
  MOCK_POPUPS,
  MOCK_SOSMED,
  MOCK_FAQ_CATEGORIES,
  MOCK_FAQ_ITEMS,
} from "@/lib/mock-superadmin-data";
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

export default function CmsManagementPage() {
  const [activeTab, setActiveTab] = useState<"popups" | "sosmed" | "faq">("popups");

  const [popups, setPopups] = useState<PromoPopup[]>(MOCK_POPUPS);
  const [sosmed, setSosmed] = useState<SocialMediaAccount[]>(MOCK_SOSMED);
  const [faqCategories] = useState<FaqCategory[]>(MOCK_FAQ_CATEGORIES);
  const [faqItems, setFaqItems] = useState<FaqItem[]>(MOCK_FAQ_ITEMS);

  // Dialog Add Popup
  const [isPopupModalOpen, setIsPopupModalOpen] = useState(false);
  const [popupForm, setPopupForm] = useState({
    title: "",
    displayLocate: "landing" as "landing" | "host" | "public" | "all",
    imgUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=60",
    linkBanner: "/catalog",
    startDate: "2026-09-08",
    endDate: "2026-09-30",
  });

  const handleTogglePopup = (id: number) => {
    setPopups((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
    toastManager.info("Status tayang pop-up telah diperbarui.");
  };

  const handleAddPopup = (e: React.FormEvent) => {
    e.preventDefault();
    const newPopup: PromoPopup = {
      id: Date.now(),
      title: popupForm.title,
      displayLocate: popupForm.displayLocate,
      imgUrl: popupForm.imgUrl,
      linkBanner: popupForm.linkBanner,
      startDate: popupForm.startDate,
      endDate: popupForm.endDate,
      isActive: true,
    };
    setPopups((prev) => [newPopup, ...prev]);
    setIsPopupModalOpen(false);
    toastManager.success("Banner pop-up promosi baru berhasil dijadwalkan.");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-background">
            CMS & Pemasaran Landing Page
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Kelola banner pop-up promosi, tautan sosial media resmi, dan pusat bantuan FAQ.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="inline-flex rounded-2xl bg-surface-container-low p-1.5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("popups")}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              activeTab === "popups"
                ? "bg-surface-container-lowest text-primary font-bold shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Banner Pop-up
          </button>
          <button
            onClick={() => setActiveTab("sosmed")}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              activeTab === "sosmed"
                ? "bg-surface-container-lowest text-primary font-bold shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Media Sosial
          </button>
          <button
            onClick={() => setActiveTab("faq")}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              activeTab === "faq"
                ? "bg-surface-container-lowest text-primary font-bold shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Pertanyaan FAQ
          </button>
        </div>
      </div>

      {/* Tab 1: Popups */}
      {activeTab === "popups" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => setIsPopupModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-primary text-on-primary"
            >
              <span className="material-symbols-outlined text-lg">add_photo_alternate</span>
              <span>Buat Pop-up Baru</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popups.map((popup) => (
              <div
                key={popup.id}
                className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[21/9] bg-surface-container-low overflow-hidden">
                    <Image
                      src={popup.imgUrl}
                      alt={popup.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          popup.isActive ? "bg-emerald-500 text-white" : "bg-slate-700 text-white"
                        }`}
                      >
                        {popup.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      Lokasi: Halaman {popup.displayLocate}
                    </span>
                    <h3 className="font-bold text-base text-on-surface">{popup.title}</h3>
                    <div className="text-xs text-on-surface-variant">
                      Periode: {popup.startDate} s/d {popup.endDate}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 flex justify-end gap-2">
                  <Button
                    variant={popup.isActive ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleTogglePopup(popup.id)}
                    className="text-xs rounded-xl"
                  >
                    {popup.isActive ? "Nonaktifkan" : "Aktifkan"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Sosmed */}
      {activeTab === "sosmed" && (
        <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm p-6 space-y-4 max-w-xl">
          <h2 className="text-base font-bold text-on-surface">Tautan Media Sosial Resmi</h2>
          <p className="text-xs text-on-surface-variant">
            Tautan ini otomatis dirender pada footer landing page dan halaman publik.
          </p>

          <div className="space-y-3 pt-2">
            {sosmed.map((s, idx) => (
              <div key={s.id} className="space-y-1">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-primary">{s.icon}</span>
                  {s.name}
                </Label>
                <Input
                  value={s.url}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSosmed((prev) =>
                      prev.map((item) => (item.id === s.id ? { ...item, url: val } : item))
                    );
                  }}
                  className="rounded-xl text-xs"
                />
              </div>
            ))}
          </div>

          <div className="pt-3">
            <Button
              onClick={() => toastManager.success("Tautan media sosial berhasil disimpan.")}
              className="rounded-xl bg-primary text-on-primary w-full"
            >
              Simpan Perubahan Media Sosial
            </Button>
          </div>
        </div>
      )}

      {/* Tab 3: FAQ */}
      {activeTab === "faq" && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-on-surface">Daftar Pertanyaan & Jawaban FAQ</h2>
              <Button
                size="sm"
                onClick={() => toastManager.info("Form tambah FAQ dibuka.")}
                className="text-xs rounded-xl"
              >
                + Tambah FAQ Baru
              </Button>
            </div>

            <div className="space-y-3 pt-2">
              {faqItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary uppercase">
                      {item.categoryName}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold">Aktif Tayang</span>
                  </div>
                  <h4 className="font-bold text-sm text-on-surface">{item.question}</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Popup Dialog */}
      <Dialog open={isPopupModalOpen} onOpenChange={setIsPopupModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">add_photo_alternate</span>
              Jadwalkan Pop-up Promosi
            </DialogTitle>
            <DialogDescription>
              Tampilkan banner pop-up pengumuman atau promo kepada pengunjung web.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddPopup} className="space-y-3.5 my-2">
            <div>
              <Label className="text-xs font-semibold">Judul Banner</Label>
              <Input
                placeholder="Contoh: Flash Sale Diskon 40%"
                value={popupForm.title}
                onChange={(e) => setPopupForm({ ...popupForm, title: e.target.value })}
                className="mt-1 rounded-xl"
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Lokasi Penayangan</Label>
              <select
                value={popupForm.displayLocate}
                onChange={(e) =>
                  setPopupForm({
                    ...popupForm,
                    displayLocate: e.target.value as "landing" | "host" | "public" | "all",
                  })
                }
                className="mt-1 w-full h-10 px-3 rounded-xl bg-surface-container-low text-xs font-medium border-0 focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="landing">Halaman Utama (Landing Page)</option>
                <option value="host">Dashboard Host</option>
                <option value="public">Semua Halaman Publik</option>
                <option value="all">Seluruh Platform</option>
              </select>
            </div>

            <div>
              <Label className="text-xs font-semibold">URL Gambar Banner</Label>
              <Input
                value={popupForm.imgUrl}
                onChange={(e) => setPopupForm({ ...popupForm, imgUrl: e.target.value })}
                className="mt-1 rounded-xl text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Tgl Mulai</Label>
                <Input
                  type="date"
                  value={popupForm.startDate}
                  onChange={(e) => setPopupForm({ ...popupForm, startDate: e.target.value })}
                  className="mt-1 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">Tgl Selesai</Label>
                <Input
                  type="date"
                  value={popupForm.endDate}
                  onChange={(e) => setPopupForm({ ...popupForm, endDate: e.target.value })}
                  className="mt-1 rounded-xl text-xs"
                  required
                />
              </div>
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPopupModalOpen(false)}
                className="rounded-xl"
              >
                Batal
              </Button>
              <Button type="submit" className="rounded-xl bg-primary text-on-primary">
                Simpan & Tayangkan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
