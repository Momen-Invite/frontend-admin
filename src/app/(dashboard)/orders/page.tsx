"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { STATUS_COLORS } from "@/lib/constants";
import { EventOrder } from "@/types/order";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, CheckCircle2, XCircle, FileText, Sparkles } from "lucide-react";

const initialOrders: EventOrder[] = [
  {
    id: 501,
    orderNumber: "ORD-2026-08-001",
    hostId: 12,
    hostName: "Rizky & Amanda",
    hostEmail: "rizky.manda@wedding.com",
    productId: 1,
    productName: "Tema Elegance Royal Gold",
    categoryId: 1,
    categoryName: "Pernikahan (Wedding)",
    title: "The Wedding of Rizky & Amanda",
    slug: "rizky-amanda",
    totalAmount: 149000,
    status: "pending_payment",
    isPublished: false,
    paymentMethod: "MANUAL_TRANSFER",
    invoiceNumber: "INV-20260827-001",
    paymentProofUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60",
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T08:30:00Z",
  },
  {
    id: 502,
    orderNumber: "ORD-2026-08-002",
    hostId: 14,
    hostName: "Bunda Sarah",
    hostEmail: "sarah.bunda@gmail.com",
    productId: 2,
    productName: "Tema Pastel Playful Kids",
    categoryId: 2,
    categoryName: "Ulang Tahun (Birthday)",
    title: "1st Birthday Little Arka",
    slug: "arka-1st-birthday",
    totalAmount: 99000,
    status: "success",
    isPublished: true,
    paymentMethod: "DUITKU_QRIS",
    invoiceNumber: "INV-20260827-002",
    createdAt: "2026-08-27T09:15:00Z",
    updatedAt: "2026-08-27T09:16:00Z",
  },
  {
    id: 503,
    orderNumber: "ORD-2026-08-003",
    hostId: 18,
    hostName: "Kevin Sanjaya",
    hostEmail: "kevin.sweet17@gmail.com",
    productId: 3,
    productName: "Tema Neon Cyber Party",
    categoryId: 3,
    categoryName: "Birthday Greeting",
    title: "Sweet 17th Birthday Kevin",
    slug: "kevin-sweet-17",
    totalAmount: 79000,
    status: "pending_payment",
    isPublished: false,
    paymentMethod: "MANUAL_TRANSFER",
    invoiceNumber: "INV-20260827-003",
    paymentProofUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60",
    createdAt: "2026-08-27T10:00:00Z",
    updatedAt: "2026-08-27T10:10:00Z",
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<EventOrder[]>(initialOrders);
  const [previewProof, setPreviewProof] = useState<EventOrder | null>(null);

  const handleApproveOrder = (order: EventOrder) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id
          ? { ...o, status: "success" as const, isPublished: true }
          : o
      )
    );
    toast.success(`Pesanan ${order.orderNumber} berhasil diverifikasi dan diaktifkan!`);
    setPreviewProof(null);
  };

  return (
    <div className="space-y-6">
      <Topbar title="Verifikasi Pesanan" searchPlaceholder="Cari order atau host..." />

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Semua Pesanan Undangan</CardTitle>
          <CardDescription className="text-xs">
            Daftar transaksi pembelian tema template oleh Host
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-semibold text-xs">No. Order / Invoice</TableHead>
                  <TableHead className="font-semibold text-xs">Pemesan & Kategori</TableHead>
                  <TableHead className="font-semibold text-xs">Template Produk</TableHead>
                  <TableHead className="font-semibold text-xs">Metode & Nominal</TableHead>
                  <TableHead className="font-semibold text-xs">Status</TableHead>
                  <TableHead className="font-semibold text-xs text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="text-xs">
                    <TableCell className="font-mono">
                      <div className="font-semibold text-foreground">{order.orderNumber}</div>
                      <div className="text-[10px] text-muted-foreground">{order.invoiceNumber}</div>
                      <div className="text-[10px] text-muted-foreground">{formatDate(order.createdAt)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-foreground">{order.hostName}</div>
                      <div className="text-[11px] text-muted-foreground">{order.hostEmail}</div>
                      <Badge variant="outline" className="mt-1 text-[10px] px-1.5 py-0">
                        {order.categoryName}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">{order.productName}</div>
                      <div className="text-[11px] text-muted-foreground italic">/{order.slug}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-foreground">{formatCurrency(order.totalAmount)}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{order.paymentMethod}</div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                          order.status === "success"
                            ? STATUS_COLORS.SUCCESS
                            : STATUS_COLORS.PENDING
                        }`}
                      >
                        {order.status === "success" ? "Lunas & Aktif" : "Menunggu Bayar"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {order.paymentMethod === "MANUAL_TRANSFER" && order.paymentProofUrl && order.status === "pending_payment" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs gap-1"
                          onClick={() => setPreviewProof(order)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Review Struk
                        </Button>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">Otomatis Gateway</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Proof Preview Modal */}
      <Dialog open={!!previewProof} onOpenChange={(open) => !open && setPreviewProof(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Verifikasi Struk Transfer Manual
            </DialogTitle>
            <DialogDescription className="text-xs">
              Periksa kecocokan nominal transfer pada bukti struk berikut.
            </DialogDescription>
          </DialogHeader>

          {previewProof && (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-lg border bg-muted/40 p-2 text-center">
                <img
                  src={previewProof.paymentProofUrl || ""}
                  alt="Bukti Transfer"
                  className="max-h-64 w-full object-contain rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs rounded-lg border p-3 bg-muted/20">
                <div>
                  <span className="text-muted-foreground">No. Order:</span>
                  <p className="font-semibold font-mono">{previewProof.orderNumber}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Tagihan:</span>
                  <p className="font-bold text-emerald-600">{formatCurrency(previewProof.totalAmount)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Pemesan:</span>
                  <p className="font-semibold">{previewProof.hostName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Produk Tema:</span>
                  <p className="font-semibold">{previewProof.productName}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setPreviewProof(null)}>
              Tutup
            </Button>
            {previewProof && (
              <Button
                variant="success"
                size="sm"
                className="gap-1.5"
                onClick={() => handleApproveOrder(previewProof)}
              >
                <CheckCircle2 className="h-4 w-4" />
                Sahkan & Aktifkan Undangan
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
