"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { BalanceCard } from "@/components/finance/BalanceCard";
import { WithdrawalForm } from "@/components/finance/WithdrawalForm";
import { WeeklyGiftChart } from "@/components/finance/WeeklyGiftChart";
import {
  GiftHistoryTable,
  type GiftTransaction,
} from "@/components/finance/GiftHistoryTable";
import {
  WithdrawalHistoryTable,
  type WithdrawalRecord,
} from "@/components/finance/WithdrawalHistoryTable";

// ─── Sample Data ──────────────────────────────────────────────────────────────
const BALANCE = 2_450_000;
const GUEST_COUNT = 18;

const WEEKLY_DATA = [
  { day: "Sn", amount: 200_000 },
  { day: "Sl", amount: 400_000 },
  { day: "Rb", amount: 150_000 },
  { day: "Km", amount: 600_000 },
  { day: "Jm", amount: 850_000, isActive: true },
  { day: "Sb", amount: 300_000 },
  { day: "Mg", amount: 100_000 },
];

const GIFT_TRANSACTIONS: GiftTransaction[] = [
  {
    id: 1,
    guestName: "Andi Setiawan",
    message: "Selamat menempuh hidup baru!",
    time: "Hari ini, 14:30",
    method: "QRIS",
    amount: 500_000,
    status: "sukses",
  },
  {
    id: 2,
    guestName: "Dian Sastro",
    message: "Maaf ga bisa hadir ya...",
    time: "Kemarin, 09:15",
    method: "VA BCA",
    amount: 1_000_000,
    status: "sukses",
  },
  {
    id: 3,
    guestName: "Reza Rahardian",
    message: "Langgeng terus ya bro",
    time: "12 Okt, 20:00",
    method: "GOPAY",
    amount: 250_000,
    status: "pending",
  },
  {
    id: 4,
    guestName: "Hamba Allah",
    message: "Berkah selalu",
    time: "10 Okt, 11:22",
    method: "QRIS",
    amount: 100_000,
    status: "sukses",
  },
];

const WITHDRAWAL_RECORDS: WithdrawalRecord[] = [
  {
    id: 1,
    date: "01 Okt 2023",
    bankName: "BCA",
    maskedAccount: "**** **** 890",
    amount: 5_000_000,
    status: "disetujui",
  },
  {
    id: 2,
    date: "15 Sep 2023",
    bankName: "Mandiri",
    maskedAccount: "**** **** 123",
    amount: 2_500_000,
    status: "disetujui",
  },
];

export default function KeuanganPage() {
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);

  return (
    <>
      {/* Top App Bar */}
      <Topbar
        title="Keuangan"
        searchPlaceholder="Cari transaksi..."
      />

      {/* Dashboard Grid — 12 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg flex-grow">
        {/* ── Left Column (4 cols / ~35%) ──────────────────────────────── */}
        <div className="lg:col-span-4 flex flex-col gap-lg">
          {/* Saldo Aktif */}
          <BalanceCard
            balance={BALANCE}
            guestCount={GUEST_COUNT}
            onWithdrawClick={() => setShowWithdrawalForm(true)}
          />

          {/* Form Pengajuan Withdrawal */}
          {(showWithdrawalForm || true) && (
            <WithdrawalForm
              maxAmount={BALANCE}
              onSubmit={(data) => {
                console.log("Withdrawal submitted:", data);
              }}
            />
          )}

          {/* Grafik Kado Mingguan */}
          <WeeklyGiftChart data={WEEKLY_DATA} />
        </div>

        {/* ── Right Column (8 cols / ~65%) ─────────────────────────────── */}
        <div className="lg:col-span-8 flex flex-col gap-lg">
          {/* Riwayat Amplop Digital */}
          <GiftHistoryTable
            transactions={GIFT_TRANSACTIONS}
            onViewAll={() => console.log("Lihat semua transaksi")}
          />

          {/* Riwayat Penarikan */}
          <WithdrawalHistoryTable records={WITHDRAWAL_RECORDS} />
        </div>
      </div>
    </>
  );
}
