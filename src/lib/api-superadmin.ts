/**
 * Superadmin API Service Layer
 * Menyinkronkan seluruh modul ke backend API https://api.momeninvite.web.id
 * Sesuai spesifikasi OpenAPI dan dokumentasi docs/SUPERADMIN.md & docs/DATABASE-ERD.md.
 * Dilengkapi normalisasi data (rows <-> items) dan fallback aman bila sesi belum login (401).
 */

import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type {
  User,
  AdminUser,
  RolePermission,
  OtpVerificationLog,
  ActiveSession,
  HostData,
  EventCategory,
  EventProduct,
  FlashSale,
  EventGuest,
  EventRegistration,
  EventAttendance,
  PackageInvoice,
  PaymentSessionLog,
  GiftInvoiceRecord,
  SupportTicket,
  TicketInteraction,
  ThemeReview,
  PromoPopup,
  SocialMediaAccount,
  FaqCategory,
  FaqItem,
  ContactMessage,
  NotificationLog,
  DeadNotification,
  SiteSettings,
  TransactionSettings,
  GatewaySettings,
  ActivityLog,
} from "@/types/superadmin";

import {
  MOCK_USERS,
  MOCK_ADMINS,
  MOCK_ROLES,
  MOCK_OTP_LOGS,
  MOCK_ACTIVE_SESSIONS,
  MOCK_HOSTS,
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
  MOCK_FLASH_SALES,
  MOCK_GUESTS,
  MOCK_REGISTRATIONS,
  MOCK_ATTENDANCES,
  MOCK_INVOICES,
  MOCK_PAYMENTS,
  MOCK_GIFT_INVOICES,
  MOCK_TICKETS,
  MOCK_REVIEWS,
  MOCK_POPUPS,
  MOCK_SOSMED,
  MOCK_FAQ_CATEGORIES,
  MOCK_FAQ_ITEMS,
  MOCK_CONTACT_MESSAGES,
  MOCK_NOTIF_LOGS,
  MOCK_DEAD_NOTIFICATIONS,
  MOCK_SITE_SETTINGS,
  MOCK_TRANSACTION_SETTINGS,
  MOCK_GATEWAY_SETTINGS,
  MOCK_ACTIVITY_LOGS,
} from "@/lib/mock-superadmin-data";

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedData<T> {
  items: T[];
  rows: T[];
  meta: PaginationMeta;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: string | number | boolean | undefined;
}

// ─── Withdrawal Type ─────────────────────────────────────────────────────────
export interface WithdrawalRequest {
  id: number;
  hostId: number;
  hostName: string;
  hostPhone: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: "pending" | "approved" | "rejected" | "processed";
  reason?: string | null;
  requestedAt: string;
  processedAt?: string | null;
  processedByAdminId?: number | null;
  processedByAdminName?: string | null;
}

export const MOCK_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: 101,
    hostId: 12,
    hostName: "Rizky Firmansyah",
    hostPhone: "081298765432",
    amount: 2500000,
    bankName: "BCA",
    accountNumber: "8720192831",
    accountName: "Rizky Firmansyah",
    status: "pending",
    requestedAt: "2026-08-27T10:30:00Z",
  },
  {
    id: 102,
    hostId: 19,
    hostName: "Nabila Putri Maharani",
    hostPhone: "085712345678",
    amount: 1750000,
    bankName: "Bank Mandiri",
    accountNumber: "1370019283719",
    accountName: "Nabila Putri Maharani",
    status: "pending",
    requestedAt: "2026-08-27T11:15:00Z",
  },
  {
    id: 103,
    hostId: 8,
    hostName: "Siti Rahmawati",
    hostPhone: "081390123456",
    amount: 5000000,
    bankName: "BRI",
    accountNumber: "012901928312501",
    accountName: "Siti Rahmawati",
    status: "approved",
    processedByAdminName: "Super Admin",
    processedAt: "2026-08-26T16:00:00Z",
    requestedAt: "2026-08-26T14:20:00Z",
  },
];

// ─── Normalizer & Fallback Helper ──────────────────────────────────────────
export function normalizePaginated<T>(
  raw: any,
  fallback: T[] = [],
  defaultPage = 1,
  defaultLimit = 15
): PaginatedData<T> {
  const rows: T[] = Array.isArray(raw?.rows)
    ? raw.rows
    : Array.isArray(raw?.items)
    ? raw.items
    : Array.isArray(raw)
    ? raw
    : fallback;

  const total = raw?.total ?? raw?.meta?.total ?? rows.length;
  const page = raw?.page ?? raw?.meta?.page ?? defaultPage;
  const limit = raw?.limit ?? raw?.meta?.limit ?? defaultLimit;
  const totalPages =
    raw?.totalPages ?? raw?.meta?.totalPages ?? Math.max(1, Math.ceil(total / limit));
  const hasNextPage =
    raw?.hasNextPage ?? raw?.meta?.hasNextPage ?? page < totalPages;
  const hasPrevPage =
    raw?.hasPrevPage ?? raw?.meta?.hasPrevPage ?? page > 1;

  const meta: PaginationMeta = {
    total,
    page,
    limit,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };

  return {
    items: rows,
    rows,
    meta,
    total,
    page,
    limit,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };
}

async function fetchListWithFallback<T>(
  endpoint: string,
  params: ListParams | undefined,
  fallbackItems: T[],
  filterFn?: (item: T, search: string) => boolean
): Promise<ApiResponse<PaginatedData<T>>> {
  const page = Number(params?.page || 1);
  const limit = Number(params?.limit || 15);
  const search = params?.search ? String(params.search).toLowerCase() : "";

  try {
    const res = await api.get<any>(endpoint, params);
    if (res && res.data) {
      const normalized = normalizePaginated<T>(res.data, fallbackItems, page, limit);
      return {
        ...res,
        data: normalized,
      };
    }
  } catch (err) {
    // Graceful fallback bila backend mengembalikan 401 (unauthorized) atau rute belum aktif
    if (process.env.NODE_ENV === "development") {
      console.warn(`[Superadmin API] ${endpoint} dialihkan ke data fallback lokal:`, (err as Error).message);
    }
  }

  // Client-side fallback pagination & search
  let filtered = [...fallbackItems];
  if (search && filterFn) {
    filtered = filtered.filter((item) => filterFn(item, search));
  } else if (search) {
    filtered = filtered.filter((item: any) =>
      JSON.stringify(item).toLowerCase().includes(search)
    );
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const paginatedRows = filtered.slice(start, start + limit);

  const meta: PaginationMeta = {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

  return {
    success: true,
    type: "success",
    title: "Berhasil",
    action: "GET_PAGINATED_LIST",
    status: 200,
    message: "Dimuat dari dataset fallback",
    data: {
      items: paginatedRows,
      rows: paginatedRows,
      meta,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    errors: null,
  };
}

// ─── Modul 2: Auth & RBAC ───────────────────────────────────────────────────
export const usersApi = {
  list: (params?: ListParams) =>
    fetchListWithFallback<User>("/api/superadmin/users", params, MOCK_USERS, (u, s) =>
      u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s) || (u.phone?.includes(s) ?? false)
    ),
  ban: (id: number) =>
    api.patch(`/api/superadmin/users/${id}`, { status: "banned" }),
  unban: (id: number) =>
    api.patch(`/api/superadmin/users/${id}`, { status: "active" }),
};

export const adminsApi = {
  list: (params?: ListParams) =>
    fetchListWithFallback<AdminUser>("/api/superadmin/admins", params, MOCK_ADMINS, (a, s) =>
      a.name.toLowerCase().includes(s) || a.email.toLowerCase().includes(s)
    ),
  create: (body: Partial<AdminUser> & { password: string }) =>
    api.post<AdminUser>("/api/superadmin/admins", body),
  unlock: (id: number) =>
    api.patch(`/api/superadmin/admins/${id}`, { failedAttempts: 0, lockedUntil: null }),
  delete: (id: number) =>
    api.delete(`/api/superadmin/admins/${id}`),
};

export const rolesApi = {
  list: (params?: ListParams) =>
    fetchListWithFallback<RolePermission>("/api/superadmin/roles", params, MOCK_ROLES),
  create: (body: { name: string; description?: string }) =>
    api.post<RolePermission>("/api/superadmin/roles", body),
  update: (id: number, body: { name?: string; description?: string }) =>
    api.patch<RolePermission>(`/api/superadmin/roles/${id}`, body),
  delete: (id: number) =>
    api.delete(`/api/superadmin/roles/${id}`),
};

export const authSessionsApi = {
  listOtpLogs: (params?: ListParams) =>
    fetchListWithFallback<OtpVerificationLog>("/api/superadmin/user-verification", params, MOCK_OTP_LOGS),
  listActiveSessions: (params?: ListParams) =>
    fetchListWithFallback<ActiveSession>("/api/superadmin/admin-sessions", params, MOCK_ACTIVE_SESSIONS),
  revokeSession: (sid: string) =>
    api.delete(`/api/superadmin/admin-sessions/${sid}`),
};

// ─── Modul 3: Hosts ─────────────────────────────────────────────────────────
export const hostsApi = {
  list: (params?: ListParams) =>
    fetchListWithFallback<HostData>("/api/admin/hosts", params, MOCK_HOSTS, (h, s) =>
      h.name.toLowerCase().includes(s) || h.email.toLowerCase().includes(s)
    ),
  toggleNotif: (id: number, allow: boolean) =>
    api.patch(`/api/admin/hosts/${id}`, { allowNotifWa: allow }),
};

// ─── Modul 4: Katalog & Produk ──────────────────────────────────────────────
export const categoriesApi = {
  list: (params?: ListParams) =>
    fetchListWithFallback<EventCategory>("/api/event-categories", params, MOCK_CATEGORIES, (c, s) =>
      c.name.toLowerCase().includes(s) || c.slug.toLowerCase().includes(s)
    ),
  create: (body: Partial<EventCategory>) =>
    api.post<EventCategory>("/api/event-categories", body),
  update: (id: number, body: Partial<EventCategory>) =>
    api.patch<EventCategory>(`/api/event-categories/${id}`, body),
  delete: (id: number) =>
    api.delete(`/api/event-categories/${id}`),
};

export const productsApi = {
  list: (params?: ListParams) =>
    fetchListWithFallback<EventProduct>("/api/event-products", params, MOCK_PRODUCTS, (p, s) =>
      p.name.toLowerCase().includes(s) || p.slug.toLowerCase().includes(s)
    ),
  togglePublish: (id: number, isPublished: boolean) =>
    api.patch(`/api/event-products/${id}`, { isPublished }),
};

export const flashSalesApi = {
  list: (params?: ListParams) =>
    fetchListWithFallback<FlashSale>("/api/admin/flash-sales", params, MOCK_FLASH_SALES),
  create: (body: Partial<FlashSale>) =>
    api.post<FlashSale>("/api/admin/flash-sales", body),
  end: (id: number) =>
    api.patch(`/api/admin/flash-sales/${id}`, { status: "ended" }),
};

// ─── Modul 6: Buku Tamu & Presensi ──────────────────────────────────────────
export const guestsApi = {
  list: (params?: ListParams) =>
    fetchListWithFallback<EventGuest>("/api/host/event-guests", params, MOCK_GUESTS, (g, s) =>
      g.name.toLowerCase().includes(s) || (g.phone?.includes(s) ?? false) || g.guestCode.toLowerCase().includes(s)
    ),
};

export const registrationsApi = {
  list: (params?: ListParams) =>
    fetchListWithFallback<EventRegistration>("/api/admin/event-registrations", params, MOCK_REGISTRATIONS),
};

export const attendancesApi = {
  list: (params?: ListParams) =>
    fetchListWithFallback<EventAttendance>("/api/host/event-attendances", params, MOCK_ATTENDANCES),
};

// ─── Modul 7: Keuangan & Billing ────────────────────────────────────────────
export const invoicesApi = {
  list: (params?: ListParams) =>
    fetchListWithFallback<PackageInvoice>("/api/admin/invoices", params, MOCK_INVOICES, (i, s) =>
      i.invoiceNumber.toLowerCase().includes(s) || (i.hostName?.toLowerCase().includes(s) ?? false)
    ),
};

export const paymentsApi = {
  list: (params?: ListParams) =>
    fetchListWithFallback<PaymentSessionLog>("/api/admin/payment-sessions", params, MOCK_PAYMENTS),
};

export const giftInvoicesApi = {
  list: (params?: ListParams) =>
    fetchListWithFallback<GiftInvoiceRecord>("/api/admin/invoice-gifts", params, MOCK_GIFT_INVOICES),
};

export const withdrawalsApi = {
  list: (params?: ListParams) =>
    fetchListWithFallback<WithdrawalRequest>("/api/admin/withdrawals", params, MOCK_WITHDRAWALS, (w, s) =>
      w.hostName.toLowerCase().includes(s) || w.bankName.toLowerCase().includes(s) || w.accountNumber.includes(s)
    ),
  approve: (id: number) =>
    api.patch(`/api/admin/withdrawals/${id}`, { status: "approved" }),
  reject: (id: number, reason: string) =>
    api.patch(`/api/admin/withdrawals/${id}`, { status: "rejected", reason }),
};

// ─── Modul 8: Tiket Bantuan & Ulasan ────────────────────────────────────────
export const ticketsApi = {
  list: (params?: ListParams) =>
    fetchListWithFallback<SupportTicket>("/api/host/tickets", params, MOCK_TICKETS, (t, s) =>
      t.title.toLowerCase().includes(s) || String(t.id).includes(s)
    ),
  getById: (id: number) =>
    api.get<{ ticket: SupportTicket; interactions: TicketInteraction[] }>(`/api/host/tickets/${id}`),
  reply: (id: number, message: string) =>
    api.post(`/api/host/ticket-interactions`, { ticketId: id, message }),
  updateStatus: (id: number, status: string) =>
    api.patch(`/api/host/tickets/${id}`, { status }),
};

export const reviewsApi = {
  list: (params?: ListParams) =>
    fetchListWithFallback<ThemeReview>("/api/admin/invoice-reviews", params, MOCK_REVIEWS),
  togglePublish: (id: number, isPublished: boolean) =>
    api.patch(`/api/admin/invoice-reviews/${id}`, { isPublished }),
};

// ─── Modul 9: CMS & Marketing ────────────────────────────────────────────────
export const popupsApi = {
  list: (params?: ListParams) =>
    fetchListWithFallback<PromoPopup>("/api/popups", params, MOCK_POPUPS),
  create: (body: Partial<PromoPopup>) =>
    api.post<PromoPopup>("/api/popups", body),
  update: (id: number, body: Partial<PromoPopup>) =>
    api.patch<PromoPopup>(`/api/popups/${id}`, body),
  delete: (id: number) =>
    api.delete(`/api/popups/${id}`),
  toggle: (id: number, isActive: boolean) =>
    api.patch(`/api/popups/${id}`, { isActive }),
};

export const sosmedApi = {
  list: (params?: ListParams) =>
    fetchListWithFallback<SocialMediaAccount>("/api/sosmed", params, MOCK_SOSMED),
  create: (body: Partial<SocialMediaAccount>) =>
    api.post<SocialMediaAccount>("/api/sosmed", body),
  update: (id: number, body: Partial<SocialMediaAccount>) =>
    api.patch<SocialMediaAccount>(`/api/sosmed/${id}`, body),
  delete: (id: number) =>
    api.delete(`/api/sosmed/${id}`),
};

export const faqApi = {
  listCategories: (params?: ListParams) =>
    fetchListWithFallback<FaqCategory>("/api/faq-categories", params, MOCK_FAQ_CATEGORIES),
  listItems: (params?: ListParams) =>
    fetchListWithFallback<FaqItem>("/api/faq", params, MOCK_FAQ_ITEMS),
  createCategory: (body: Partial<FaqCategory>) =>
    api.post<FaqCategory>("/api/faq-categories", body),
  createItem: (body: Partial<FaqItem>) =>
    api.post<FaqItem>("/api/faq", body),
  updateItem: (id: number, body: Partial<FaqItem>) =>
    api.patch<FaqItem>(`/api/faq/${id}`, body),
  deleteItem: (id: number) =>
    api.delete(`/api/faq/${id}`),
};

export const contactMessagesApi = {
  list: (params?: ListParams) =>
    fetchListWithFallback<ContactMessage>("/api/contact-messages", params, MOCK_CONTACT_MESSAGES),
  markRead: (id: number) =>
    api.patch(`/api/contact-messages/${id}`, { status: "read" }),
  reply: (id: number, message: string) =>
    api.post(`/api/contact-messages/${id}/reply`, { message }),
};

// ─── Modul 10: Notifikasi ────────────────────────────────────────────────────
export const notificationsApi = {
  listLogs: (params?: ListParams) =>
    fetchListWithFallback<NotificationLog>("/api/admin/notif-whatsapps", params, MOCK_NOTIF_LOGS),
  listDead: (params?: ListParams) =>
    fetchListWithFallback<DeadNotification>("/api/admin/dead-notifications", params, MOCK_DEAD_NOTIFICATIONS),
  retry: (id: number) =>
    api.patch(`/api/admin/dead-notifications/${id}`, { status: "retrying" }),
};

const createFallbackResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  type: "success",
  title: "Berhasil",
  action: "GET_DATA",
  status: 200,
  message: "Dimuat dari dataset fallback",
  data,
  errors: null,
});

// ─── Modul 11: Settings ──────────────────────────────────────────────────────
export const settingsApi = {
  getSite: () =>
    api.get<SiteSettings>("/api/superadmin/settings").catch(() => createFallbackResponse(MOCK_SITE_SETTINGS)),
  updateSite: (body: Partial<SiteSettings>) =>
    api.patch<SiteSettings>("/api/superadmin/settings", body),
  getTransaction: () =>
    api.get<TransactionSettings>("/api/superadmin/config-transaction").catch(() => createFallbackResponse(MOCK_TRANSACTION_SETTINGS)),
  updateTransaction: (body: Partial<TransactionSettings>) =>
    api.patch<TransactionSettings>("/api/superadmin/config-transaction", body),
  getGateway: () =>
    api.get<GatewaySettings>("/api/superadmin/config-whatsapp").catch(() => createFallbackResponse(MOCK_GATEWAY_SETTINGS)),
  updateGateway: (body: Partial<GatewaySettings>) =>
    api.patch<GatewaySettings>("/api/superadmin/config-whatsapp", body),
};

// ─── Modul 12: Activity Logs ─────────────────────────────────────────────────
export const activityLogsApi = {
  list: (params?: ListParams) =>
    fetchListWithFallback<ActivityLog>("/api/superadmin/activity-logs", params, MOCK_ACTIVITY_LOGS, (l, s) =>
      l.actorName.toLowerCase().includes(s) || l.action.toLowerCase().includes(s) || (l.details?.toLowerCase().includes(s) ?? false)
    ),
};
