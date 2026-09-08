/**
 * Superadmin API Service Layer
 * Semua endpoint /api/superadmin/* ter-type dan tersentralisasi di sini.
 */

import { api } from "@/lib/api";
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
  meta: PaginationMeta;
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

// ─── Modul 2: Auth & RBAC ───────────────────────────────────────────────────
export const usersApi = {
  list: (params?: ListParams) =>
    api.get<PaginatedData<User>>("/api/superadmin/users", params),
  ban: (id: number) =>
    api.patch(`/api/superadmin/users/${id}/ban`),
  unban: (id: number) =>
    api.patch(`/api/superadmin/users/${id}/unban`),
};

export const adminsApi = {
  list: (params?: ListParams) =>
    api.get<PaginatedData<AdminUser>>("/api/superadmin/admins", params),
  create: (body: Partial<AdminUser> & { password: string }) =>
    api.post<AdminUser>("/api/superadmin/admins", body),
  unlock: (id: number) =>
    api.patch(`/api/superadmin/admins/${id}/unlock`),
  delete: (id: number) =>
    api.delete(`/api/superadmin/admins/${id}`),
};

export const rolesApi = {
  list: (params?: ListParams) =>
    api.get<PaginatedData<RolePermission>>("/api/superadmin/roles", params),
  create: (body: { name: string; description?: string }) =>
    api.post<RolePermission>("/api/superadmin/roles", body),
  update: (id: number, body: { name?: string; description?: string }) =>
    api.put<RolePermission>(`/api/superadmin/roles/${id}`, body),
  delete: (id: number) =>
    api.delete(`/api/superadmin/roles/${id}`),
};

export const authSessionsApi = {
  listOtpLogs: (params?: ListParams) =>
    api.get<PaginatedData<OtpVerificationLog>>("/api/superadmin/otp-logs", params),
  listActiveSessions: (params?: ListParams) =>
    api.get<PaginatedData<ActiveSession>>("/api/superadmin/active-sessions", params),
  revokeSession: (sid: string) =>
    api.delete(`/api/superadmin/active-sessions/${sid}`),
};

// ─── Modul 3: Hosts ─────────────────────────────────────────────────────────
export const hostsApi = {
  list: (params?: ListParams) =>
    api.get<PaginatedData<HostData>>("/api/superadmin/hosts", params),
  toggleNotif: (id: number, allow: boolean) =>
    api.patch(`/api/superadmin/hosts/${id}/notif`, { allowNotifWa: allow }),
};

// ─── Modul 4: Katalog & Produk ──────────────────────────────────────────────
export const categoriesApi = {
  list: (params?: ListParams) =>
    api.get<PaginatedData<EventCategory>>("/api/superadmin/categories", params),
  create: (body: Partial<EventCategory>) =>
    api.post<EventCategory>("/api/superadmin/categories", body),
  update: (id: number, body: Partial<EventCategory>) =>
    api.put<EventCategory>(`/api/superadmin/categories/${id}`, body),
  delete: (id: number) =>
    api.delete(`/api/superadmin/categories/${id}`),
};

export const productsApi = {
  list: (params?: ListParams) =>
    api.get<PaginatedData<EventProduct>>("/api/superadmin/products", params),
  togglePublish: (id: number, isPublished: boolean) =>
    api.patch(`/api/superadmin/products/${id}/publish`, { isPublished }),
};

export const flashSalesApi = {
  list: (params?: ListParams) =>
    api.get<PaginatedData<FlashSale>>("/api/superadmin/flash-sales", params),
  create: (body: Partial<FlashSale>) =>
    api.post<FlashSale>("/api/superadmin/flash-sales", body),
  end: (id: number) =>
    api.patch(`/api/superadmin/flash-sales/${id}/end`),
};

// ─── Modul 6: Buku Tamu & Presensi ──────────────────────────────────────────
export const guestsApi = {
  list: (params?: ListParams) =>
    api.get<PaginatedData<EventGuest>>("/api/superadmin/guests", params),
};

export const registrationsApi = {
  list: (params?: ListParams) =>
    api.get<PaginatedData<EventRegistration>>("/api/superadmin/registrations", params),
};

export const attendancesApi = {
  list: (params?: ListParams) =>
    api.get<PaginatedData<EventAttendance>>("/api/superadmin/attendances", params),
};

// ─── Modul 7: Keuangan & Billing ────────────────────────────────────────────
export const invoicesApi = {
  list: (params?: ListParams) =>
    api.get<PaginatedData<PackageInvoice>>("/api/superadmin/invoices", params),
};

export const paymentsApi = {
  list: (params?: ListParams) =>
    api.get<PaginatedData<PaymentSessionLog>>("/api/superadmin/payments", params),
};

export const giftInvoicesApi = {
  list: (params?: ListParams) =>
    api.get<PaginatedData<GiftInvoiceRecord>>("/api/superadmin/gift-invoices", params),
};

export const withdrawalsApi = {
  list: (params?: ListParams) =>
    api.get<PaginatedData<WithdrawalRequest>>("/api/superadmin/withdrawals", params),
  approve: (id: number) =>
    api.patch(`/api/superadmin/withdrawals/${id}/approve`),
  reject: (id: number, reason: string) =>
    api.patch(`/api/superadmin/withdrawals/${id}/reject`, { reason }),
};

// ─── Modul 8: Tiket Bantuan & Ulasan ────────────────────────────────────────
export const ticketsApi = {
  list: (params?: ListParams) =>
    api.get<PaginatedData<SupportTicket>>("/api/superadmin/tickets", params),
  getById: (id: number) =>
    api.get<{ ticket: SupportTicket; interactions: TicketInteraction[] }>(`/api/superadmin/tickets/${id}`),
  reply: (id: number, message: string) =>
    api.post(`/api/superadmin/tickets/${id}/reply`, { message }),
  updateStatus: (id: number, status: string) =>
    api.patch(`/api/superadmin/tickets/${id}/status`, { status }),
};

export const reviewsApi = {
  list: (params?: ListParams) =>
    api.get<PaginatedData<ThemeReview>>("/api/superadmin/reviews", params),
  togglePublish: (id: number, isPublished: boolean) =>
    api.patch(`/api/superadmin/reviews/${id}/publish`, { isPublished }),
};

// ─── Modul 9: CMS & Marketing ────────────────────────────────────────────────
export const popupsApi = {
  list: (params?: ListParams) =>
    api.get<PaginatedData<PromoPopup>>("/api/superadmin/popups", params),
  create: (body: Partial<PromoPopup>) =>
    api.post<PromoPopup>("/api/superadmin/popups", body),
  update: (id: number, body: Partial<PromoPopup>) =>
    api.put<PromoPopup>(`/api/superadmin/popups/${id}`, body),
  delete: (id: number) =>
    api.delete(`/api/superadmin/popups/${id}`),
  toggle: (id: number, isActive: boolean) =>
    api.patch(`/api/superadmin/popups/${id}/toggle`, { isActive }),
};

export const sosmedApi = {
  list: (params?: ListParams) =>
    api.get<PaginatedData<SocialMediaAccount>>("/api/superadmin/sosmed", params),
  create: (body: Partial<SocialMediaAccount>) =>
    api.post<SocialMediaAccount>("/api/superadmin/sosmed", body),
  update: (id: number, body: Partial<SocialMediaAccount>) =>
    api.put<SocialMediaAccount>(`/api/superadmin/sosmed/${id}`, body),
  delete: (id: number) =>
    api.delete(`/api/superadmin/sosmed/${id}`),
};

export const faqApi = {
  listCategories: (params?: ListParams) =>
    api.get<PaginatedData<FaqCategory>>("/api/superadmin/faq-categories", params),
  listItems: (params?: ListParams) =>
    api.get<PaginatedData<FaqItem>>("/api/superadmin/faq-items", params),
  createCategory: (body: Partial<FaqCategory>) =>
    api.post<FaqCategory>("/api/superadmin/faq-categories", body),
  createItem: (body: Partial<FaqItem>) =>
    api.post<FaqItem>("/api/superadmin/faq-items", body),
  updateItem: (id: number, body: Partial<FaqItem>) =>
    api.put<FaqItem>(`/api/superadmin/faq-items/${id}`, body),
  deleteItem: (id: number) =>
    api.delete(`/api/superadmin/faq-items/${id}`),
};

export const contactMessagesApi = {
  list: (params?: ListParams) =>
    api.get<PaginatedData<ContactMessage>>("/api/superadmin/contact-messages", params),
  markRead: (id: number) =>
    api.patch(`/api/superadmin/contact-messages/${id}/read`),
  reply: (id: number, message: string) =>
    api.post(`/api/superadmin/contact-messages/${id}/reply`, { message }),
};

// ─── Modul 10: Notifikasi ────────────────────────────────────────────────────
export const notificationsApi = {
  listLogs: (params?: ListParams) =>
    api.get<PaginatedData<NotificationLog>>("/api/superadmin/notification-logs", params),
  listDead: (params?: ListParams) =>
    api.get<PaginatedData<DeadNotification>>("/api/superadmin/dead-notifications", params),
  retry: (id: number) =>
    api.patch(`/api/superadmin/dead-notifications/${id}/retry`),
};

// ─── Modul 11: Settings ──────────────────────────────────────────────────────
export const settingsApi = {
  getSite: () =>
    api.get<SiteSettings>("/api/superadmin/settings/site"),
  updateSite: (body: Partial<SiteSettings>) =>
    api.put<SiteSettings>("/api/superadmin/settings/site", body),
  getTransaction: () =>
    api.get<TransactionSettings>("/api/superadmin/settings/transaction"),
  updateTransaction: (body: Partial<TransactionSettings>) =>
    api.put<TransactionSettings>("/api/superadmin/settings/transaction", body),
  getGateway: () =>
    api.get<GatewaySettings>("/api/superadmin/settings/gateway"),
  updateGateway: (body: Partial<GatewaySettings>) =>
    api.put<GatewaySettings>("/api/superadmin/settings/gateway", body),
};

// ─── Modul 12: Activity Logs ─────────────────────────────────────────────────
export const activityLogsApi = {
  list: (params?: ListParams) =>
    api.get<PaginatedData<ActivityLog>>("/api/superadmin/activity-logs", params),
};
