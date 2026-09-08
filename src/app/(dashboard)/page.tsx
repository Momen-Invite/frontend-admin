"use client";

import Link from "next/link";
import { Topbar } from "@/components/layout/Topbar";
import { formatCurrency } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const chartData = [
  { date: "21 Agu", revenue: 4_200_000, gifts: 6_500_000 },
  { date: "22 Agu", revenue: 5_100_000, gifts: 8_200_000 },
  { date: "23 Agu", revenue: 6_800_000, gifts: 11_400_000 },
  { date: "24 Agu", revenue: 7_400_000, gifts: 13_900_000 },
  { date: "25 Agu", revenue: 6_200_000, gifts: 10_200_000 },
  { date: "26 Agu", revenue: 8_900_000, gifts: 16_500_000 },
  { date: "27 Agu", revenue: 11_500_000, gifts: 21_800_000 },
];

const pendingWithdrawals = [
  {
    id: 1,
    hostName: "Rizky Firmansyah",
    bank: "BCA",
    account: "8720192831",
    amount: 2_500_000,
    time: "10 menit lalu",
  },
  {
    id: 2,
    hostName: "Nabila Putri Maharani",
    bank: "Mandiri",
    account: "137001928371",
    amount: 1_750_000,
    time: "25 menit lalu",
  },
  {
    id: 3,
    hostName: "Dimas Anggara",
    bank: "BRI",
    account: "0192837461928",
    amount: 4_200_000,
    time: "1 jam lalu",
  },
];

// ─── Metric Card ──────────────────────────────────────────────────────────────
interface MetricCardProps {
  title: string;
  value: string;
  sub: string;
  iconName: string;
  iconBgClass: string;
  iconColorClass: string;
}

function MetricCard({
  title,
  value,
  sub,
  iconName,
  iconBgClass,
  iconColorClass,
}: MetricCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-card p-lg flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-label-capsule font-label-capsule text-on-surface-variant uppercase tracking-wider">
          {title}
        </p>
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBgClass}`}
        >
          <span
            className={`material-symbols-outlined text-[20px] ${iconColorClass}`}
          >
            {iconName}
          </span>
        </div>
      </div>
      <div>
        <p className="text-headline-lg font-headline-lg text-on-background">
          {value}
        </p>
        <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">
          {sub}
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardOverviewPage() {
  return (
    <>
      <Topbar
        title="Ringkasan Platform"
        searchPlaceholder="Cari order, host, atau tiket..."
      />

      <div className="flex flex-col gap-lg flex-grow">
        {/* Metric Cards */}
        <div className="grid gap-lg md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Saldo Amplop Host"
            value={formatCurrency(84_500_000)}
            sub="↑ +18.4% dari minggu lalu"
            iconName="account_balance_wallet"
            iconBgClass="bg-tertiary-fixed"
            iconColorClass="text-on-tertiary-fixed-variant"
          />
          <MetricCard
            title="Penarikan Menunggu Audit"
            value="3 Permohonan"
            sub={`Total nominal: ${formatCurrency(8_450_000)}`}
            iconName="schedule"
            iconBgClass="bg-secondary-fixed"
            iconColorClass="text-on-secondary-fixed-variant"
          />
          <MetricCard
            title="Order Undangan Aktif"
            value="1.248 Acara"
            sub="86 pesanan menunggu konfirmasi"
            iconName="shopping_bag"
            iconBgClass="bg-primary-fixed"
            iconColorClass="text-on-primary-fixed-variant"
          />
          <MetricCard
            title="Tiket Bantuan Terbuka"
            value="5 Tiket"
            sub="2 berstatus prioritas tinggi (URGENT)"
            iconName="support_agent"
            iconBgClass="bg-error-container"
            iconColorClass="text-on-error-container"
          />
        </div>

        {/* Chart + Withdrawal Queue */}
        <div className="grid gap-lg lg:grid-cols-12 flex-grow">
          {/* Revenue / Gifts Trend Chart */}
          <section className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-card p-lg flex flex-col">
            <div className="mb-4">
              <h2 className="text-headline-md font-headline-md text-on-background">
                Tren Pendapatan & Kado Digital
              </h2>
              <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">
                Grafik 7 hari terakhir — paket vs amplop kado digital (QRIS)
              </p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorGifts"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#f2a93b"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor="#f2a93b"
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#005faf"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor="#005faf"
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e1e2e4"
                  />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                    tick={{ fill: "#514535" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                    tick={{ fill: "#514535" }}
                    tickFormatter={(v) => `${v / 1_000_000}M`}
                  />
                  <Tooltip
                    formatter={(value: number | string) => [
                      formatCurrency(Number(value)),
                      "",
                    ]}
                    contentStyle={{
                      backgroundColor: "#2e3132",
                      border: "none",
                      borderRadius: "8px",
                      color: "#f0f1f3",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="gifts"
                    name="Kado Masuk"
                    stroke="#f2a93b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorGifts)"
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Pendapatan Paket"
                    stroke="#005faf"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Pending Withdrawal Queue */}
          <section className="lg:col-span-5 bg-surface-container-lowest rounded-xl shadow-card flex flex-col overflow-hidden">
            <div className="p-lg pb-md border-b border-surface-container-highest flex justify-between items-center">
              <div>
                <h2 className="text-headline-md font-headline-md text-on-background">
                  Antrean Penarikan Dana
                </h2>
                <p className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">
                  Menunggu transfer kas manual
                </p>
              </div>
              <StatusBadge variant="pending" label="3 Pending" />
            </div>

            <div className="flex-1 p-lg space-y-3">
              {pendingWithdrawals.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-surface-container-highest p-3 bg-surface-bright/50 hover:bg-surface-bright transition-colors"
                >
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-body-sm font-semibold text-on-background truncate">
                      {item.hostName}
                    </p>
                    <p className="text-[11px] text-on-surface-variant">
                      {item.bank} • {item.account}
                    </p>
                    <span className="text-[10px] text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">
                        schedule
                      </span>
                      {item.time}
                    </span>
                  </div>
                  <div className="text-right space-y-1.5 shrink-0 ml-3">
                    <div className="text-data-numeric font-data-numeric text-success text-sm">
                      {formatCurrency(item.amount)}
                    </div>
                    <Link href="/withdrawals">
                      <button
                        type="button"
                        className="h-7 px-3 text-[11px] font-semibold bg-surface-container rounded-lg border border-surface-container-highest text-on-surface hover:bg-primary-container hover:text-on-primary-container hover:border-primary-container transition-colors"
                      >
                        Review
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-lg pt-0">
              <Link href="/withdrawals" className="w-full">
                <button
                  type="button"
                  className="w-full py-2.5 text-button-text font-button-text text-primary bg-surface-container rounded-lg border border-outline-variant hover:bg-primary-container hover:text-on-primary-container hover:border-primary-container transition-colors flex items-center justify-center gap-2"
                >
                  Buka Konsol Persetujuan
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_forward
                  </span>
                </button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
