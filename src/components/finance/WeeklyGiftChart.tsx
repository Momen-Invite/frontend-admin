import { formatCurrency } from "@/lib/utils";

interface WeeklyBarData {
  day: string;
  amount: number;
  isActive?: boolean;
}

interface WeeklyGiftChartProps {
  data: WeeklyBarData[];
  /** Nilai maksimal untuk normalisasi tinggi bar (default: highest value) */
  maxValue?: number;
  title?: string;
}

const DEFAULT_DATA: WeeklyBarData[] = [
  { day: "Sn", amount: 200000 },
  { day: "Sl", amount: 400000 },
  { day: "Rb", amount: 150000 },
  { day: "Km", amount: 600000 },
  { day: "Jm", amount: 850000, isActive: true },
  { day: "Sb", amount: 300000 },
  { day: "Mg", amount: 100000 },
];

export function WeeklyGiftChart({
  data = DEFAULT_DATA,
  maxValue,
  title = "Kado Mingguan",
}: WeeklyGiftChartProps) {
  const max = maxValue ?? Math.max(...data.map((d) => d.amount));
  const activeBar = data.find((d) => d.isActive);

  return (
    <section className="bg-surface-container-lowest rounded-xl shadow-card p-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-headline-md font-headline-md text-on-background">
          {title}
        </h2>
        <button
          type="button"
          className="text-on-surface-variant hover:text-primary transition-colors"
          title="Opsi lainnya"
        >
          <span className="material-symbols-outlined text-sm">more_horiz</span>
        </button>
      </div>

      {/* Chart Area */}
      <div className="relative">
        {/* Tooltip for active bar */}
        {activeBar && (
          <div
            className="absolute -top-4 transform -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-2 py-1 rounded-md text-[10px] font-bold shadow-overlay z-10 whitespace-nowrap"
            style={{
              left: `${
                (data.findIndex((d) => d.isActive) / (data.length - 1)) * 85 +
                7
              }%`,
            }}
          >
            {formatCurrency(activeBar.amount)}
          </div>
        )}

        {/* Bars */}
        <div className="flex items-end justify-between h-32 px-2">
          {data.map((bar, i) => {
            const heightPct = max > 0 ? (bar.amount / max) * 100 : 0;
            return (
              <div
                key={i}
                title={`${bar.day}: ${formatCurrency(bar.amount)}`}
                className={`w-8 rounded-t-full relative cursor-pointer transition-colors ${
                  bar.isActive
                    ? "bg-primary-container shadow-sm"
                    : "bg-surface-variant hover:bg-secondary-container"
                }`}
                style={{ height: `${Math.max(heightPct, 5)}%` }}
              />
            );
          })}
        </div>

        {/* X Axis Labels */}
        <div className="flex justify-between mt-2 px-3 text-[10px] text-on-surface-variant font-semibold">
          {data.map((bar, i) => (
            <span
              key={i}
              className={bar.isActive ? "text-on-background" : ""}
            >
              {bar.day}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
