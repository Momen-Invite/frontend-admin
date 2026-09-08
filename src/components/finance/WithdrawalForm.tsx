"use client";

import { useState } from "react";
import { DragToConfirm } from "@/components/ui/DragToConfirm";

const BANK_OPTIONS = [
  "BCA - Bank Central Asia",
  "Mandiri",
  "BNI",
  "BRI",
  "CIMB Niaga",
  "Permata Bank",
  "Danamon",
];

interface WithdrawalFormProps {
  /** Saldo maksimal yang bisa ditarik */
  maxAmount: number;
  onSubmit?: (data: {
    amount: string;
    bank: string;
    accountNumber: string;
  }) => void;
}

export function WithdrawalForm({ maxAmount, onSubmit }: WithdrawalFormProps) {
  const [amount, setAmount] = useState(
    maxAmount.toLocaleString("id-ID")
  );
  const [bank, setBank] = useState(BANK_OPTIONS[0]);
  const [accountNumber, setAccountNumber] = useState("1234567890");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleConfirm = () => {
    setIsSubmitted(true);
    onSubmit?.({ amount, bank, accountNumber });
  };

  return (
    <section className="bg-surface-container-lowest rounded-xl shadow-card p-4 sm:p-lg flex flex-col">
      <h2 className="text-base sm:text-headline-md font-semibold sm:font-headline-md text-on-background mb-3 sm:mb-4">
        Form Pengajuan Withdrawal
      </h2>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {/* Jumlah Penarikan */}
        <div>
          <label className="block text-body-sm font-body-sm text-on-surface-variant mb-1">
            Jumlah Penarikan
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-on-surface-variant font-semibold text-sm">
                Rp
              </span>
            </div>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isSubmitted}
              className="block w-full pl-10 pr-3 py-2 border border-surface-container-highest rounded-lg bg-surface-bright text-on-background text-data-numeric font-data-numeric focus:ring-2 focus:ring-primary-container focus:border-primary transition-colors outline-none disabled:opacity-60"
            />
          </div>
        </div>

        {/* Bank Tujuan */}
        <div>
          <label className="block text-body-sm font-body-sm text-on-surface-variant mb-1">
            Bank Tujuan
          </label>
          <div className="relative">
            <select
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              disabled={isSubmitted}
              className="block w-full pl-3 pr-10 py-2 border border-surface-container-highest rounded-lg bg-surface-bright text-on-background text-body-sm font-body-sm focus:ring-2 focus:ring-primary-container focus:border-primary transition-colors outline-none appearance-none cursor-pointer disabled:opacity-60"
            >
              {BANK_OPTIONS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            {/* Chevron icon */}
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Nomor Rekening */}
        <div>
          <label className="block text-body-sm font-body-sm text-on-surface-variant mb-1">
            Nomor Rekening
          </label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            disabled={isSubmitted}
            placeholder="Masukkan nomor rekening"
            className="block w-full px-3 py-2 border border-surface-container-highest rounded-lg bg-surface-bright text-on-background text-data-numeric font-data-numeric focus:ring-2 focus:ring-primary-container focus:border-primary transition-colors outline-none disabled:opacity-60"
          />
        </div>

        {/* Disclaimer */}
        <p className="text-[11px] text-on-surface-variant italic leading-tight flex gap-1">
          <span className="material-symbols-outlined text-[14px] shrink-0 mt-0.5">
            info
          </span>
          Dana akan dicairkan manual oleh admin dalam 1×24 jam
        </p>

        {/* Drag to Confirm Slider */}
        <div className="mt-6 pt-2">
          <DragToConfirm
            onConfirm={handleConfirm}
            disabled={isSubmitted}
            successLabel="Pengajuan diproses ✓"
          />
        </div>
      </form>
    </section>
  );
}
