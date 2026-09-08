import { formatCurrency } from "@/lib/utils";

interface BalanceCardProps {
  balance: number;
  guestCount: number;
  onWithdrawClick?: () => void;
}

export function BalanceCard({
  balance,
  guestCount,
  onWithdrawClick,
}: BalanceCardProps) {
  return (
    <section className="bg-surface-container-lowest rounded-xl shadow-card p-4 sm:p-lg flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 text-on-surface-variant mb-3 sm:mb-4">
        <span className="material-symbols-outlined text-lg">
          account_balance_wallet
        </span>
        <h2 className="text-base sm:text-headline-md font-semibold sm:font-headline-md text-on-background">
          Saldo Amplop Digital
        </h2>
      </div>

      {/* Amount */}
      <div className="mb-1">
        <span className="text-2xl sm:text-3xl lg:text-display font-extrabold font-display text-on-background tracking-tight">
          {formatCurrency(balance)}
        </span>
      </div>

      {/* Sub info */}
      <p className="text-body-sm font-body-sm text-on-surface-variant mb-6 flex items-center gap-1">
        <span className="material-symbols-outlined text-[14px]">
          arrow_upward
        </span>
        Terkumpul dari {guestCount} tamu
      </p>

      {/* CTA Button */}
      <button
        type="button"
        onClick={onWithdrawClick}
        className="w-full bg-primary-container text-on-primary-container text-button-text font-button-text rounded-lg py-3 hover:bg-inverse-primary transition-colors mt-auto flex items-center justify-center gap-2 shadow-sm"
      >
        <span className="material-symbols-outlined text-lg">payments</span>
        Tarik Dana
      </button>

      {/* Decorative background circle */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-primary-container opacity-10 pointer-events-none" />
    </section>
  );
}
