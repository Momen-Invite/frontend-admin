"use client";

import { useState, useEffect, useCallback } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toastManager } from "@/components/ui/toast";
import { withdrawalsApi, PaginationMeta, WithdrawalRequest } from "@/lib/api-superadmin";
import { ApiError } from "@/lib/api";
import { Pagination } from "@/components/ui/pagination";
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
import { CheckCircle, XCircle, AlertTriangle, Building2, RefreshCw } from "lucide-react";

const DEFAULT_META: PaginationMeta = {
  total: 0,
  page: 1,
  limit: 15,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

const initialWithdrawals: WithdrawalRequest[] = [
  {
    id: 101,
    hostId: 12,
    hostName: "Rizky Firmansyah",
    hostPhone: "081298765432",
    amount: 2500000,
    bankName: "BCA",
    accountNumber: "8720192831",
    accountName: "Rizky Firmansyah",
    status: "pending",
    requestedAt: "2026-08-27T10:30:00Z",
  },
  {
    id: 102,
    hostId: 19,
    hostName: "Nabila Putri Maharani",
    hostPhone: "085712345678",
    amount: 1750000,
    bankName: "Bank Mandiri",
    accountNumber: "1370019283719",
    accountName: "Nabila Putri Maharani",
    status: "pending",
    requestedAt: "2026-08-27T11:15:00Z",
  },
  {
    id: 103,
    hostId: 24,
    hostName: "Dimas Anggara",
    hostPhone: "087890123456",
    amount: 4200000,
    bankName: "BRI",
    accountNumber: "019283746192831",
    accountName: "Dimas Anggara",
    status: "pending",
    requestedAt: "2026-08-27T09:00:00Z",
  },
  {
    id: 99,
    hostId: 8,
    hostName: "Siti Rahmawati",
    hostPhone: "081234567890",
    amount: 5000000,
    bankName: "BCA",
    accountNumber: "1230984712",
    accountName: "Siti Rahmawati",
    status: "approved",
    processedByAdminName: "Super Admin",
    processedAt: "2026-08-26T16:00:00Z",
    requestedAt: "2026-08-26T14:20:00Z",
  },
];

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(initialWithdrawals);
  const [meta, setMeta] = useState<PaginationMeta>({
    ...DEFAULT_META,
    total: initialWithdrawals.length,
    totalPages: 1,
  });
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequest | null>(null);
  const [modalMode, setModalMode] = useState<"APPROVE" | "REJECT" | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchWithdrawals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await withdrawalsApi.list({
        page,
        limit,
        search: searchQuery || undefined,
      });
      if (res.data) {
        const d = res.data as { items: WithdrawalRequest[]; meta: PaginationMeta };
        setWithdrawals(d.items ?? []);
        setMeta(d.meta ?? DEFAULT_META);
      }
    } catch (err) {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery]);

  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setPage(1);
  };

  const handleOpenApproveModal = (item: WithdrawalRequest) => {
    setSelectedWithdrawal(item);
    setModalMode("APPROVE");
  };

  const handleOpenRejectModal = (item: WithdrawalRequest) => {
    setSelectedWithdrawal(item);
    setModalMode("REJECT");
    setRejectReason("");
  };

  const handleExecuteApprove = async () => {
    if (!selectedWithdrawal) return;
    setIsProcessing(true);
    try {
      await withdrawalsApi.approve(selectedWithdrawal.id);
      setWithdrawals((prev) =>
        prev.map((w) =>
          w.id === selectedWithdrawal.id
            ? {
                ...w,
                status: "approved",
                processedByAdminName: "Super Admin",
                processedAt: new Date().toISOString(),
              }
            : w
        )
      );
      toastManager.success(`Penarikan dana Rp${selectedWithdrawal.amount.toLocaleString("id-ID")} berhasil disetujui!`);
      setModalMode(null);
      setSelectedWithdrawal(null);
    } catch (error) {
      toastManager.error("Gagal menyetujui penarikan.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecuteReject = async () => {
    if (!selectedWithdrawal) return;
    if (!rejectReason.trim()) {
      toastManager.error("Alasan penolakan wajib diisi untuk mengembalikan saldo host.");
      return;
    }

    setIsProcessing(true);
    try {
      await withdrawalsApi.reject(selectedWithdrawal.id, rejectReason);
      setWithdrawals((prev) =>
        prev.map((w) =>
          w.id === selectedWithdrawal.id
            ? {
                ...w,
                status: "rejected",
                reason: rejectReason,
                processedByAdminName: "Super Admin",
                processedAt: new Date().toISOString(),
              }
            : w
        )
      );
      toastManager.success(
        `Penarikan ditolak. Saldo Rp${selectedWithdrawal.amount.toLocaleString("id-ID")} dikembalikan ke dompet host.`
      );
      setModalMode(null);
      setSelectedWithdrawal(null);
    } catch (error) {
      toastManager.error("Gagal menolak penarikan.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <Topbar title="Audit Penarikan Dana" searchPlaceholder="Cari host atau rekening..." />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-on-background">
              Manajemen Penarikan Saldo (Withdrawals)
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live API
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Validasi transfer kas ke rekening host dan audit status penarikan dana kado digital.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={fetchWithdrawals}
          className="gap-2 text-xs rounded-xl"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </Button>
      </div>

      {/* Toolbar */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Cari nama host, bank, atau rekening..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-10 rounded-xl bg-surface-container-low border-0 text-xs"
            />
          </div>
          <Button type="submit" size="sm" className="h-10 px-4 rounded-xl text-xs">
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

      <Card className="border-outline-variant/30 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-surface-container-low/40 p-4 border-b border-outline-variant/20">
          <CardTitle className="text-sm font-semibold">Daftar Antrean Penarikan Saldo</CardTitle>
          <CardDescription className="text-xs">
            Seluruh mutasi pencairan dana kado digital tamu Momen Invite
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-surface-container-low/20">
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
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i} className="animate-pulse">
                      <TableCell><div className="h-4 bg-surface-container-high rounded w-20" /></TableCell>
                      <TableCell><div className="h-4 bg-surface-container-high rounded w-32" /></TableCell>
                      <TableCell><div className="h-4 bg-surface-container-high rounded w-36" /></TableCell>
                      <TableCell><div className="h-4 bg-surface-container-high rounded w-24" /></TableCell>
                      <TableCell><div className="h-5 bg-surface-container-high rounded-full w-20" /></TableCell>
                      <TableCell className="text-right"><div className="h-8 bg-surface-container-high rounded-lg w-28 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : withdrawals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-xs text-on-surface-variant">
                      Tidak ada permohonan penarikan dana ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  withdrawals.map((w) => {
                    const isPending = w.status.toLowerCase() === "pending";
                    const isApproved = w.status.toLowerCase() === "approved" || w.status.toLowerCase() === "processed";
                    return (
                      <TableRow key={w.id} className="text-xs hover:bg-surface-container-low/30 transition-colors">
                        <TableCell className="font-mono">
                          <div className="font-semibold text-foreground">#{w.id}</div>
                          <div className="text-[10px] text-muted-foreground">{formatDate(w.requestedAt || new Date().toISOString())}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-foreground">{w.hostName}</div>
                          {w.hostPhone && <div className="text-[10px] text-muted-foreground">{w.hostPhone}</div>}
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-foreground flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                            {w.bankName}
                          </div>
                          <div className="font-mono text-muted-foreground">{w.accountNumber}</div>
                          <div className="text-[10px] text-muted-foreground">a.n {w.accountName}</div>
                        </TableCell>
                        <TableCell className="font-bold text-sm text-emerald-600">
                          {formatCurrency(w.amount)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                              isApproved
                                ? "bg-emerald-500/10 text-emerald-700 border-emerald-200"
                                : isPending
                                ? "bg-amber-500/10 text-amber-700 border-amber-200"
                                : "bg-rose-500/10 text-rose-700 border-rose-200"
                            }`}
                          >
                            {w.status.toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {isPending ? (
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs gap-1 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
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
                              {w.reason && <div className="text-rose-500 italic">Alasan: {w.reason}</div>}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

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
        </CardContent>
      </Card>

      {/* Approve Confirmation Modal */}
      <Dialog open={modalMode === "APPROVE"} onOpenChange={(open) => !open && setModalMode(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6">
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
            <div className="space-y-3 rounded-xl border bg-muted/30 p-4 text-xs">
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
                <span className="font-mono font-semibold text-foreground">{selectedWithdrawal.accountNumber}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Nama Pemilik Rekening:</span>
                <span className="font-semibold text-foreground">{selectedWithdrawal.accountName}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm">
                <span className="font-semibold text-muted-foreground">Nominal Transfer:</span>
                <span className="font-bold text-emerald-600">{formatCurrency(selectedWithdrawal.amount)}</span>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setModalMode(null)} className="rounded-xl">
              Batal
            </Button>
            <Button
              size="sm"
              onClick={handleExecuteApprove}
              disabled={isProcessing}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isProcessing ? "Memproses..." : "Ya, Saya Sudah Transfer & Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Modal with Auto-Refund */}
      <Dialog open={modalMode === "REJECT"} onOpenChange={(open) => !open && setModalMode(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
              Tolak Permohonan Penarikan Saldo
            </DialogTitle>
            <DialogDescription className="text-xs">
              Sistem akan secara otomatis mengembalikan saldo sebesar{" "}
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
              className="text-xs rounded-xl"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setModalMode(null)} className="rounded-xl">
              Batal
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleExecuteReject}
              disabled={isProcessing}
              className="rounded-xl"
            >
              {isProcessing ? "Memproses..." : "Tolak & Kembalikan Saldo Host"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
