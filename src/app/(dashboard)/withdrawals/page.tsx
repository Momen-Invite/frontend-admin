"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { STATUS_COLORS } from "@/lib/constants";
import { Withdrawal, WithdrawalStatus } from "@/types/withdrawal";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, CheckCircle, XCircle, AlertTriangle, Building2, User, CreditCard, RefreshCw } from "lucide-react";

// Mock data conforming to backend database schema
const initialWithdrawals: Withdrawal[] = [
  {
    id: 101,
    hostId: 12,
    hostName: "Rizky Firmansyah",
    hostEmail: "rizky.firman@gmail.com",
    hostPhone: "081298765432",
    amount: 2500000,
    bankName: "BCA",
    bankAccountNumber: "8720192831",
    bankAccountHolder: "Rizky Firmansyah",
    status: "PENDING",
    createdAt: "2026-08-27T10:30:00Z",
    updatedAt: "2026-08-27T10:30:00Z",
  },
  {
    id: 102,
    hostId: 19,
    hostName: "Nabila Putri Maharani",
    hostEmail: "nabila.putri@yahoo.com",
    hostPhone: "085712345678",
    amount: 1750000,
    bankName: "Bank Mandiri",
    bankAccountNumber: "1370019283719",
    bankAccountHolder: "Nabila Putri Maharani",
    status: "PENDING",
    createdAt: "2026-08-27T11:15:00Z",
    updatedAt: "2026-08-27T11:15:00Z",
  },
  {
    id: 103,
    hostId: 24,
    hostName: "Dimas Anggara",
    hostEmail: "dimas.anggara@gmail.com",
    hostPhone: "087890123456",
    amount: 4200000,
    bankName: "BRI",
    bankAccountNumber: "019283746192831",
    bankAccountHolder: "Dimas Anggara",
    status: "PENDING",
    createdAt: "2026-08-27T09:00:00Z",
    updatedAt: "2026-08-27T09:00:00Z",
  },
  {
    id: 99,
    hostId: 8,
    hostName: "Siti Rahmawati",
    hostEmail: "siti.rahma@gmail.com",
    amount: 5000000,
    bankName: "BCA",
    bankAccountNumber: "1230984712",
    bankAccountHolder: "Siti Rahmawati",
    status: "APPROVED",
    processedByAdminName: "Super Admin",
    processedAt: "2026-08-26T16:00:00Z",
    createdAt: "2026-08-26T14:20:00Z",
    updatedAt: "2026-08-26T16:00:00Z",
  },
];

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(initialWithdrawals);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [modalMode, setModalMode] = useState<"APPROVE" | "REJECT" | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOpenApproveModal = (item: Withdrawal) => {
    setSelectedWithdrawal(item);
    setModalMode("APPROVE");
  };

  const handleOpenRejectModal = (item: Withdrawal) => {
    setSelectedWithdrawal(item);
    setModalMode("REJECT");
    setRejectReason("");
  };

  const handleExecuteApprove = async () => {
    if (!selectedWithdrawal) return;
    setIsProcessing(true);
    try {
      // In production: await api.patch(`/api/admin/withdrawals/${selectedWithdrawal.id}/approve`);
      await new Promise((resolve) => setTimeout(resolve, 800));

      setWithdrawals((prev) =>
        prev.map((w) =>
          w.id === selectedWithdrawal.id
            ? {
                ...w,
                status: "APPROVED" as WithdrawalStatus,
                processedByAdminName: "Super Admin",
                processedAt: new Date().toISOString(),
              }
            : w
        )
      );

      toast.success(`Penarikan dana Rp${selectedWithdrawal.amount.toLocaleString("id-ID")} berhasil disahkan!`);
      setModalMode(null);
      setSelectedWithdrawal(null);
    } catch (error) {
      toast.error("Gagal menyetujui penarikan.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecuteReject = async () => {
    if (!selectedWithdrawal) return;
    if (!rejectReason.trim()) {
      toast.error("Alasan penolakan wajib diisi untuk mengembalikan saldo host.");
      return;
    }

    setIsProcessing(true);
    try {
      // In production: await api.patch(`/api/admin/withdrawals/${selectedWithdrawal.id}/reject`, { reason: rejectReason });
      await new Promise((resolve) => setTimeout(resolve, 800));

      setWithdrawals((prev) =>
        prev.map((w) =>
          w.id === selectedWithdrawal.id
            ? {
                ...w,
                status: "REJECTED" as WithdrawalStatus,
                rejectReason,
                processedByAdminName: "Super Admin",
                processedAt: new Date().toISOString(),
              }
            : w
        )
      );

      toast.success(
        `Penarikan ditolak. Saldo Rp${selectedWithdrawal.amount.toLocaleString("id-ID")} telah dikembalikan (auto-refund) ke dompet host.`
      );
      setModalMode(null);
      setSelectedWithdrawal(null);
    } catch (error) {
      toast.error("Gagal menolak penarikan.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Topbar title="Audit Penarikan Dana" searchPlaceholder="Cari host atau rekening..." />

      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Daftar Antrean Penarikan Saldo</CardTitle>
            <CardDescription className="text-xs">
              Seluruh mutasi pencairan dana kado digital tamu Momen Invite
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={() => toast.info("Memperbarui data...")}>
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-semibold text-xs">ID / Tanggal</TableHead>
                  <TableHead className="font-semibold text-xs">Host Pemilik Acara</TableHead>
                  <TableHead className="font-semibold text-xs">Detail Bank & Rekening</TableHead>
                  <TableHead className="font-semibold text-xs">Nominal (Rp)</TableHead>
                  <TableHead className="font-semibold text-xs">Status</TableHead>
                  <TableHead className="font-semibold text-xs text-right">Aksi Super Admin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawals.map((w) => (
                  <TableRow key={w.id} className="text-xs">
                    <TableCell className="font-mono">
                      <div className="font-semibold text-foreground">#{w.id}</div>
                      <div className="text-[10px] text-muted-foreground">{formatDate(w.createdAt)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-foreground">{w.hostName}</div>
                      <div className="text-[11px] text-muted-foreground">{w.hostEmail}</div>
                      {w.hostPhone && <div className="text-[10px] text-muted-foreground">{w.hostPhone}</div>}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-foreground flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                        {w.bankName}
                      </div>
                      <div className="font-mono text-muted-foreground">{w.bankAccountNumber}</div>
                      <div className="text-[10px] text-muted-foreground">a.n {w.bankAccountHolder}</div>
                    </TableCell>
                    <TableCell className="font-bold text-sm text-emerald-600">
                      {formatCurrency(w.amount)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                          STATUS_COLORS[w.status] || ""
                        }`}
                      >
                        {w.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {w.status === "PENDING" ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="success"
                            className="h-8 text-xs gap-1"
                            onClick={() => handleOpenApproveModal(w)}
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 text-xs gap-1"
                            onClick={() => handleOpenRejectModal(w)}
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Tolak
                          </Button>
                        </div>
                      ) : (
                        <div className="text-[11px] text-muted-foreground">
                          {w.processedByAdminName && <div>Disahkan: {w.processedByAdminName}</div>}
                          {w.rejectReason && <div className="text-rose-500 italic">Alasan: {w.rejectReason}</div>}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Approve Confirmation Modal */}
      <Dialog open={modalMode === "APPROVE"} onOpenChange={(open) => !open && setModalMode(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-600">
              <CheckCircle className="h-5 w-5" />
              Konfirmasi Persetujuan Pencairan Dana
            </DialogTitle>
            <DialogDescription className="text-xs">
              Pastikan Anda telah melakukan transfer kas riil ke rekening host berikut sebelum menekan tombol Approve.
            </DialogDescription>
          </DialogHeader>

          {selectedWithdrawal && (
            <div className="space-y-3 rounded-lg border bg-muted/30 p-4 text-xs">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Penerima Host:</span>
                <span className="font-semibold text-foreground">{selectedWithdrawal.hostName}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Bank Tujuan:</span>
                <span className="font-semibold text-foreground">{selectedWithdrawal.bankName}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Nomor Rekening:</span>
                <span className="font-mono font-semibold text-foreground">{selectedWithdrawal.bankAccountNumber}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Nama Pemilik Rekening:</span>
                <span className="font-semibold text-foreground">{selectedWithdrawal.bankAccountHolder}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm">
                <span className="font-semibold text-muted-foreground">Nominal Transfer:</span>
                <span className="font-bold text-emerald-600">{formatCurrency(selectedWithdrawal.amount)}</span>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setModalMode(null)}>
              Batal
            </Button>
            <Button variant="success" size="sm" onClick={handleExecuteApprove} disabled={isProcessing}>
              {isProcessing ? "Memproses..." : "Ya, Saya Sudah Transfer & Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Modal with Auto-Refund */}
      <Dialog open={modalMode === "REJECT"} onOpenChange={(open) => !open && setModalMode(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
              Tolak Permohonan Penarikan Saldo
            </DialogTitle>
            <DialogDescription className="text-xs">
              Sistem akan secara otomatis <strong>mengembalikan saldo (auto-refund)</strong> sebesar{" "}
              {selectedWithdrawal && formatCurrency(selectedWithdrawal.amount)} ke dompet host.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Label htmlFor="rejectReason" className="text-xs font-semibold">
              Alasan Penolakan (Wajib diisi):
            </Label>
            <Input
              id="rejectReason"
              placeholder="Contoh: Nomor rekening tidak cocok dengan nama host..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="text-xs"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setModalMode(null)}>
              Batal
            </Button>
            <Button variant="destructive" size="sm" onClick={handleExecuteReject} disabled={isProcessing}>
              {isProcessing ? "Memproses..." : "Tolak & Kembalikan Saldo Host"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
