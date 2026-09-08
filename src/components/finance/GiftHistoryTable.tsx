import { formatCurrency } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";

export interface GiftTransaction {
  id: string | number;
  /** Nama tamu pengirim */
  guestName: string;
  /** Pesan/ucapan dari tamu (opsional) */
  message?: string;
  /** Waktu transaksi dalam format string siap tampil */
  time: string;
  /** Metode pembayaran: QRIS, VA BCA, GOPAY, dll. */
  method: string;
  amount: number;
  /** Status: "sukses" | "pending" | "gagal" */
  status: "sukses" | "pending" | "gagal";
}

interface GiftHistoryTableProps {
  transactions: GiftTransaction[];
  onViewAll?: () => void;
}

/** Generate initial avatar dari nama */
function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/** Alternating avatar colors */
const AVATAR_COLORS = [
  "bg-secondary-container text-on-secondary-container",
  "bg-surface-variant text-on-surface-variant",
  "bg-tertiary-container text-on-tertiary-container",
];

export function GiftHistoryTable({
  transactions,
  onViewAll,
}: GiftHistoryTableProps) {
  return (
    <section className="bg-surface-container-lowest rounded-xl shadow-card flex flex-col overflow-hidden">
      {/* Section Header */}
      <div className="p-4 sm:p-lg pb-3 sm:pb-md border-b border-surface-container-highest flex justify-between items-center bg-surface-container-lowest">
        <h2 className="text-base sm:text-headline-md font-semibold sm:font-headline-md text-on-background">
          Riwayat Amplop Digital
        </h2>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-primary text-button-text font-button-text hover:underline text-xs sm:text-sm font-semibold"
          >
            Lihat Semua
          </button>
        )}
      </div>

      {/* Mobile Card-List View (sm:hidden) */}
      <div className="sm:hidden divide-y divide-surface-container-highest">
        {transactions.map((tx, idx) => (
          <div key={tx.id} className="p-4 space-y-2 hover:bg-surface-bright/50 transition-colors">
            <div className="flex justify-between items-start gap-2">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    AVATAR_COLORS[idx % AVATAR_COLORS.length]
                  }`}
                >
                  {getInitials(tx.guestName)}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-on-background text-sm truncate">
                    {tx.guestName}
                  </div>
                  {tx.message && (
                    <div className="text-xs text-on-surface-variant italic truncate max-w-[200px]">
                      &ldquo;{tx.message}&rdquo;
                    </div>
                  )}
                </div>
              </div>
              <div className="text-data-numeric font-data-numeric text-success font-semibold text-sm shrink-0">
                +{formatCurrency(tx.amount)}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1">
              <div className="flex items-center gap-2">
                <span>{tx.time}</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-surface-variant text-on-surface-variant">
                  {tx.method}
                </span>
              </div>
              <StatusBadge variant={tx.status} />
            </div>
          </div>
        ))}

        {transactions.length === 0 && (
          <div className="py-8 text-center text-on-surface-variant text-xs">
            Belum ada transaksi amplop digital
          </div>
        )}
      </div>

      {/* Desktop Table View (hidden sm:block) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-surface-container-highest text-on-surface-variant text-label-capsule font-label-capsule uppercase tracking-wider bg-surface-bright/50">
              <th className="py-3 px-4 lg:px-lg font-semibold">Tamu</th>
              <th className="py-3 px-4 font-semibold hidden md:table-cell">
                Waktu
              </th>
              <th className="py-3 px-4 font-semibold">Metode</th>
              <th className="py-3 px-4 font-semibold text-right">Jumlah</th>
              <th className="py-3 px-4 lg:px-lg font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="text-body-sm font-body-sm">
            {transactions.map((tx, idx) => (
              <tr
                key={tx.id}
                className="border-b border-surface-container-highest hover:bg-surface-bright transition-colors last:border-0"
              >
                {/* Guest */}
                <td className="py-3 px-4 lg:px-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                        AVATAR_COLORS[idx % AVATAR_COLORS.length]
                      }`}
                    >
                      {getInitials(tx.guestName)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-on-background truncate">
                        {tx.guestName}
                      </div>
                      {tx.message && (
                        <div className="text-xs text-on-surface-variant italic truncate max-w-[150px]">
                          &ldquo;{tx.message}&rdquo;
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Time */}
                <td className="py-3 px-4 text-on-surface-variant hidden md:table-cell whitespace-nowrap">
                  {tx.time}
                </td>

                {/* Method */}
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-surface-variant text-on-surface-variant">
                    {tx.method}
                  </span>
                </td>

                {/* Amount */}
                <td className="py-3 px-4 text-right text-data-numeric font-data-numeric text-success font-semibold">
                  +{formatCurrency(tx.amount)}
                </td>

                {/* Status */}
                <td className="py-3 px-4 lg:px-lg text-center">
                  <StatusBadge variant={tx.status} />
                </td>
              </tr>
            ))}

            {transactions.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-on-surface-variant text-body-sm"
                >
                  Belum ada transaksi amplop digital
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
