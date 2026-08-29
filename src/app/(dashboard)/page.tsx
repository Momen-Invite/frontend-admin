"use client";

import {
  Wallet,
  ShoppingBag,
  Users,
  LifeBuoy,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const chartData = [
  { date: "21 Agu", revenue: 4200000, gifts: 6500000 },
  { date: "22 Agu", revenue: 5100000, gifts: 8200000 },
  { date: "23 Agu", revenue: 6800000, gifts: 11400000 },
  { date: "24 Agu", revenue: 7400000, gifts: 13900000 },
  { date: "25 Agu", revenue: 6200000, gifts: 10200000 },
  { date: "26 Agu", revenue: 8900000, gifts: 16500000 },
  { date: "27 Agu", revenue: 11500000, gifts: 21800000 },
];

const pendingWithdrawals = [
  {
    id: 1,
    hostName: "Rizky Firmansyah",
    bank: "BCA (8720192831)",
    amount: 2500000,
    time: "10 menit lalu",
  },
  {
    id: 2,
    hostName: "Nabila Putri Maharani",
    bank: "Mandiri (137001928371)",
    amount: 1750000,
    time: "25 menit lalu",
  },
  {
    id: 3,
    hostName: "Dimas Anggara",
    bank: "BRI (0192837461928)",
    amount: 4200000,
    time: "1 jam lalu",
  },
];

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Ringkasan Ekosistem Platform"
        description="Pantau pendapatan produk, perputaran kado digital, dan aksi persetujuan keuangan secara real-time."
      >
        <Link href="/withdrawals">
          <Button className="gap-2 shadow-sm">
            <Wallet className="h-4 w-4" />
            Audit Penarikan Saldo
          </Button>
        </Link>
      </PageHeader>

      {/* Metric Cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Saldo Amplop Host
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <Wallet className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(84500000)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-600 font-semibold">+18.4%</span> dari minggu lalu
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Penarikan Menunggu Audit
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              3 Permohonan
            </div>
            <p className="mt-1 text-xs text-amber-600 font-medium">
              Total nominal: {formatCurrency(8450000)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Order Undangan Aktif
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1,248 Acara</div>
            <p className="mt-1 text-xs text-muted-foreground">
              86 pesanan menunggu konfirmasi
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tiket Bantuan Terbuka
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600">
              <LifeBuoy className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">5 Tiket</div>
            <p className="mt-1 text-xs text-muted-foreground">
              2 berstatus prioritas tinggi (URGENT)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Revenue / Gifts Trend */}
        <Card className="lg:col-span-4 border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Tren Pendapatan & Perputaran Kado Digital
            </CardTitle>
            <CardDescription className="text-xs">
              Grafik 7 hari terakhir transaksi paket vs amplop kado digital (Duitku QRIS)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGifts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickFormatter={(val) => `Rp${val / 1000000}M`}
                  />
                  <Tooltip
                    formatter={(value: number | string | undefined) => [
                      formatCurrency(Number(value || 0)),
                      "",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="gifts"
                    name="Kado Masuk (Rp)"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorGifts)"
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Pendapatan Paket (Rp)"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pending Withdrawals Quick Console */}
        <Card className="lg:col-span-3 border-border shadow-sm flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">
                Antrean Penarikan Dana
              </CardTitle>
              <Badge variant="warning" className="text-[11px]">
                3 Pending
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Permohonan pencairan dana host yang memerlukan transfer kas manual
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            {pendingWithdrawals.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-border/80 p-3 bg-card/60 transition-all hover:bg-muted/30"
              >
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-foreground">
                    {item.hostName}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{item.bank}</p>
                  <span className="text-[10px] text-muted-foreground/80 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {item.time}
                  </span>
                </div>
                <div className="text-right space-y-1.5">
                  <div className="text-xs font-bold text-emerald-600">
                    {formatCurrency(item.amount)}
                  </div>
                  <Link href="/withdrawals">
                    <Button size="sm" variant="outline" className="h-7 text-xs px-2.5">
                      Review
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
          <div className="p-6 pt-0">
            <Link href="/withdrawals" className="w-full">
              <Button variant="secondary" className="w-full text-xs gap-1.5">
                Buka Konsol Persetujuan Lengkap
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
