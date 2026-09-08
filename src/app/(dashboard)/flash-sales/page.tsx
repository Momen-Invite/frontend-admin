"use client";

import { useState } from "react";
import { FlashSale } from "@/types/superadmin";
import { MOCK_FLASH_SALES, MOCK_PRODUCTS } from "@/lib/mock-superadmin-data";
import { toastManager } from "@/components/ui/toast";
import { StatusBadge } from "@/components/ui/StatusBadge";
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

export default function FlashSalesManagementPage() {
  const [sales, setSales] = useState<FlashSale[]>(MOCK_FLASH_SALES);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    productId: 1,
    promoPrice: 89000,
    label: "Promo Spesial",
    startsAt: "2026-09-08T00:00",
    endsAt: "2026-09-15T23:59",
  });

  const handleCreateSale = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = MOCK_PRODUCTS.find((p) => p.id === Number(formData.productId));
    if (!prod) return;

    const newSale: FlashSale = {
      id: Date.now(),
      eventProductId: prod.id,
      productName: prod.name,
      normalPrice: prod.price,
      promoPrice: Number(formData.promoPrice),
      label: formData.label,
      startsAt: new Date(formData.startsAt).toISOString(),
      endsAt: new Date(formData.endsAt).toISOString(),
      status: "active",
    };

    setSales((prev) => [newSale, ...prev]);
    setIsModalOpen(false);
    toastManager.success(`Promo Flash Sale untuk "${prod.name}" berhasil dijadwalkan.`);
  };

  const handleEndPromo = (saleId: number) => {
    setSales((prev) =>
      prev.map((s) => (s.id === saleId ? { ...s, status: "ended" } : s))
    );
    toastManager.info("Flash sale telah diakhiri secara manual.");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-background">
            Flash Sale & Promosi Tema
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Atur diskon berbatas waktu pada katalog tema undangan untuk mendongkrak konversi pembelian.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-primary text-on-primary"
        >
          <span className="material-symbols-outlined text-lg">timer</span>
          <span>Buat Flash Sale Baru</span>
        </Button>
      </div>

      {/* Sales Table */}
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-low/50 text-xs font-semibold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/20">
              <tr>
                <th className="py-3.5 px-4">Label Kampanye</th>
                <th className="py-3.5 px-4">Tema Terkait</th>
                <th className="py-3.5 px-4">Harga Normal</th>
                <th className="py-3.5 px-4">Harga Flash Sale</th>
                <th className="py-3.5 px-4">Periode Diskon</th>
                <th className="py-3.5 px-4">Status Promo</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-on-surface text-xs">
              {sales.map((sale) => {
                const discountPct = Math.round(
                  ((sale.normalPrice - sale.promoPrice) / sale.normalPrice) * 100
                );

                return (
                  <tr key={sale.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-sm text-on-surface">{sale.label}</div>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold">
                        Hemat {discountPct}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-primary">
                      {sale.productName}
                    </td>

                    <td className="py-3.5 px-4 text-on-surface-variant line-through">
                      Rp {sale.normalPrice.toLocaleString("id-ID")}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-rose-600 text-sm">
                      Rp {sale.promoPrice.toLocaleString("id-ID")}
                    </td>

                    <td className="py-3.5 px-4 text-on-surface-variant">
                      <div>
                        {new Date(sale.startsAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}{" "}
                        s/d{" "}
                        {new Date(sale.endsAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {sale.status === "active" ? (
                        <StatusBadge variant="sukses" label="Sedang Berlangsung" />
                      ) : sale.status === "scheduled" ? (
                        <StatusBadge variant="pending" label="Terjadwal" />
                      ) : (
                        <StatusBadge variant="gagal" label="Berakhir" />
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {sale.status === "active" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEndPromo(sale.id)}
                          className="h-8 text-xs text-error hover:bg-error-container/20 rounded-lg"
                        >
                          Hentikan Promo
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-outline-variant/20 p-3 space-y-3">
          {sales.map((sale) => (
            <div key={sale.id} className="p-4 rounded-xl bg-surface-container-low space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-on-surface text-sm">{sale.label}</div>
                  <div className="text-xs text-primary font-medium">{sale.productName}</div>
                </div>
                {sale.status === "active" ? (
                  <StatusBadge variant="sukses" label="Aktif" />
                ) : (
                  <StatusBadge variant="gagal" label="Berakhir" />
                )}
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-outline-variant/20">
                <span className="line-through text-on-surface-variant">
                  Rp {sale.normalPrice.toLocaleString("id-ID")}
                </span>
                <span className="font-bold text-rose-600 text-sm">
                  Rp {sale.promoPrice.toLocaleString("id-ID")}
                </span>
              </div>

              {sale.status === "active" && (
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEndPromo(sale.id)}
                    className="w-full text-xs text-error rounded-xl"
                  >
                    Hentikan Promo
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Sale Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">campaign</span>
              Jadwalkan Flash Sale Tema
            </DialogTitle>
            <DialogDescription>
              Tentukan produk tema dan potongan harga khusus promosi.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSale} className="space-y-3.5 my-2">
            <div>
              <Label className="text-xs font-semibold">Tema Sasaran</Label>
              <select
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: Number(e.target.value) })}
                className="mt-1 w-full h-10 px-3 rounded-xl bg-surface-container-low text-xs font-medium border-0 focus:ring-2 focus:ring-primary outline-none"
              >
                {MOCK_PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Normal: Rp {p.price.toLocaleString("id-ID")})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-xs font-semibold">Nama Label Promo</Label>
              <Input
                placeholder="Contoh: Flash Sale 9.9"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="mt-1 rounded-xl"
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Harga Diskon Flash Sale (Rp)</Label>
              <Input
                type="number"
                value={formData.promoPrice}
                onChange={(e) => setFormData({ ...formData, promoPrice: Number(e.target.value) })}
                className="mt-1 rounded-xl font-semibold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Mulai Tanggal</Label>
                <Input
                  type="datetime-local"
                  value={formData.startsAt}
                  onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
                  className="mt-1 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">Berakhir Tanggal</Label>
                <Input
                  type="datetime-local"
                  value={formData.endsAt}
                  onChange={(e) => setFormData({ ...formData, endsAt: e.target.value })}
                  className="mt-1 rounded-xl text-xs"
                  required
                />
              </div>
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
                Simpan Flash Sale
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
