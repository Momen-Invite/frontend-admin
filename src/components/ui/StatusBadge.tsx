import { cn } from "@/lib/utils";

type StatusVariant =
  | "sukses"
  | "pending"
  | "ditolak"
  | "disetujui"
  | "proses"
  | "gagal";

interface StatusBadgeProps {
  variant: StatusVariant;
  label?: string;
  className?: string;
}

const VARIANT_STYLES: Record<
  StatusVariant,
  { className: string; defaultLabel: string }
> = {
  sukses: {
    className: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
    defaultLabel: "Sukses",
  },
  disetujui: {
    className: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
    defaultLabel: "Disetujui",
  },
  pending: {
    className: "bg-secondary-fixed text-on-secondary-fixed-variant",
    defaultLabel: "Pending",
  },
  proses: {
    className: "bg-secondary-fixed text-on-secondary-fixed-variant",
    defaultLabel: "Diproses",
  },
  ditolak: {
    className: "bg-error-container text-on-error-container",
    defaultLabel: "Ditolak",
  },
  gagal: {
    className: "bg-error-container text-on-error-container",
    defaultLabel: "Gagal",
  },
};

export function StatusBadge({ variant, label, className }: StatusBadgeProps) {
  const { className: variantClass, defaultLabel } = VARIANT_STYLES[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full font-label-capsule text-[10px] select-none",
        variantClass,
        className
      )}
    >
      {label ?? defaultLabel}
    </span>
  );
}

/** Helper: map string status dari API → StatusBadge variant */
export function mapToStatusVariant(status: string): StatusVariant {
  const normalized = status.toUpperCase();
  switch (normalized) {
    case "SUCCESS":
    case "SUKSES":
    case "COMPLETED":
      return "sukses";
    case "APPROVED":
    case "DISETUJUI":
      return "disetujui";
    case "PENDING":
      return "pending";
    case "PROCESSING":
    case "IN_PROGRESS":
      return "proses";
    case "REJECTED":
    case "DITOLAK":
      return "ditolak";
    case "FAILED":
    case "GAGAL":
    case "CANCELLED":
      return "gagal";
    default:
      return "pending";
  }
}
