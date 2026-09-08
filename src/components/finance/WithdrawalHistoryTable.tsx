import { formatCurrency } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";

export interface WithdrawalRecord {
  id: string | number;
  date: string;
  bankName: string;
  /** Masked account number, e.g. "**** **** 890" */
  maskedAccount: string;
  amount: number;
  status: "disetujui" | "pending" | "ditolak";
}

interface WithdrawalHistoryTableProps {
  records: WithdrawalRecord[];
}

export function WithdrawalHistoryTable({
  records,
}: WithdrawalHistoryTableProps) {
  return (
    <section className="bg-surface-container-lowest rounded-xl shadow-card flex flex-col overflow-hidden">
      {/* Section Header */}
      <div className="p-4 sm:p-lg pb-3 sm:pb-md border-b border-surface-container-highest">
        <h2 className="text-base sm:text-headline-md font-semibold sm:font-headline-md text-on-background">
          Riwayat Penarikan
        </h2>
      </div>

      {/* Mobile Card-List View (sm:hidden) */}
      <div className="sm:hidden divide-y divide-surface-container-highest">
        {records.map((rec) => (
          <div key={rec.id} className="p-4 space-y-2 hover:bg-surface-bright/50 transition-colors">
            <div className="flex justify-between items-start gap-2">
              <div>
                <div className="font-semibold text-on-background text-sm">
                  {rec.bankName}
                </div>
                <div className="text-xs text-on-surface-variant font-mono">
                  {rec.maskedAccount}
                </div>
              </div>
              <div className="text-data-numeric font-data-numeric text-on-background font-semibold text-sm shrink-0">
                {formatCurrency(rec.amount)}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1">
              <span>{rec.date}</span>
              <StatusBadge variant={rec.status} />
            </div>
          </div>
        ))}

        {records.length === 0 && (
          <div className="py-8 text-center text-on-surface-variant text-xs">
            Belum ada riwayat penarikan
          </div>
        )}
      </div>

      {/* Desktop Table View (hidden sm:block) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-surface-container-highest text-on-surface-variant text-label-capsule font-label-capsule uppercase tracking-wider bg-surface-bright/50">
              <th className="py-3 px-4 lg:px-lg font-semibold">Tanggal</th>
              <th className="py-3 px-4 font-semibold">Tujuan</th>
              <th className="py-3 px-4 font-semibold text-right">Jumlah</th>
              <th className="py-3 px-4 lg:px-lg font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="text-body-sm font-body-sm">
            {records.map((rec) => (
              <tr
                key={rec.id}
                className="border-b border-surface-container-highest hover:bg-surface-bright transition-colors last:border-0"
              >
                {/* Date */}
                <td className="py-3 px-4 lg:px-lg whitespace-nowrap text-on-surface-variant">
                  {rec.date}
                </td>

                {/* Bank + Masked Account */}
                <td className="py-3 px-4">
                  <div className="font-semibold text-on-background">
                    {rec.bankName}
                  </div>
                  <div className="text-xs text-on-surface-variant">
                    {rec.maskedAccount}
                  </div>
                </td>

                {/* Amount */}
                <td className="py-3 px-4 text-right text-data-numeric font-data-numeric text-on-background font-semibold">
                  {formatCurrency(rec.amount)}
                </td>

                {/* Status */}
                <td className="py-3 px-4 lg:px-lg text-center">
                  <StatusBadge variant={rec.status} />
                </td>
              </tr>
            ))}

            {records.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="py-12 text-center text-on-surface-variant text-body-sm"
                >
                  Belum ada riwayat penarikan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
