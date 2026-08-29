import {
  LayoutDashboard,
  Wallet,
  ShoppingBag,
  Palette,
  LifeBuoy,
  Flame,
  Globe,
  Building2,
  ScrollText,
  Settings,
} from "lucide-react";
import { AdminRole } from "@/types/auth";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roleRequired?: AdminRole;
  badge?: string;
}

export const SIDEBAR_NAV_ITEMS: NavItem[] = [
  {
    title: "Dasbor Utama",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Persetujuan Penarikan",
    href: "/withdrawals",
    icon: Wallet,
    roleRequired: "SUPER_ADMIN", // Exclusive to Superadmin as per PRD
    badge: "Keuangan",
  },
  {
    title: "Verifikasi Pesanan",
    href: "/orders",
    icon: ShoppingBag,
  },
  {
    title: "Katalog & Tema",
    href: "/catalog",
    icon: Palette,
  },
  {
    title: "Tiket Bantuan",
    href: "/tickets",
    icon: LifeBuoy,
  },
  {
    title: "Flash Sales & Promo",
    href: "/flash-sales",
    icon: Flame,
  },
  {
    title: "CMS & Landing Page",
    href: "/cms",
    icon: Globe,
  },
  {
    title: "Rekening Bank Platform",
    href: "/bank-settings",
    icon: Building2,
    roleRequired: "SUPER_ADMIN",
  },
  {
    title: "Audit Activity Logs",
    href: "/audit-logs",
    icon: ScrollText,
    roleRequired: "SUPER_ADMIN",
  },
  {
    title: "Pengaturan Sistem",
    href: "/settings",
    icon: Settings,
    roleRequired: "SUPER_ADMIN",
  },
];

export const STATUS_COLORS = {
  PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  APPROVED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  REJECTED: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  SUCCESS: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  CANCELLED: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  OPEN: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  IN_PROGRESS: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  RESOLVED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  CLOSED: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};
