/**
 * Superadmin API Service Layer for Momen Invite
 * Menghubungkan seluruh modul ke backend API https://api.momeninvite.web.id
 * Dilengkapi fallback cerdas ke dataset komprehensif bila sesi belum terautentikasi (401)
 */

import {
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
  ThemeReview,
  PromoPopup,
  SocialMediaAccount,
  FaqItem,
  ContactMessage,
  NotificationLog,
  SiteSettings,
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
  MOCK_FAQ_ITEMS,
  MOCK_CONTACT_MESSAGES,
  MOCK_NOTIF_LOGS,
  MOCK_SITE_SETTINGS,
  MOCK_ACTIVITY_LOGS,
} from "@/lib/mock-superadmin-data";

// Gunakan path relatif (sama seperti api.ts) agar melewati Next.js proxy
const API_BASE_URL =
  typeof window !== "undefined"
    ? "" // client-side → relative path → Next.js proxy
    : (process.env.NEXT_PUBLIC_API_URL || "https://api.momeninvite.web.id");

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLiveApi: boolean;
}

// Helper untuk fetch aman dengan fallback lokal
async function safeFetch<T>(
  endpoint: string,
  fallbackItems: T[],
  page = 1,
  limit = 10,
  filterFn?: (item: T) => boolean
): Promise<PaginatedResult<T>> {
  try {
    const base = API_BASE_URL || "";
    const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = new URL(`${base}${path}`, typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(limit));

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        // Backend pattern: { rows: [...], total, page, limit, totalPages }
        if (json.data.rows && Array.isArray(json.data.rows)) {
          return {
            data: json.data.rows as T[],
            total: json.data.total ?? json.data.rows.length,
            page: json.data.page ?? page,
            limit: json.data.limit ?? limit,
            totalPages: json.data.totalPages ?? Math.ceil((json.data.total ?? json.data.rows.length) / limit),
            isLiveApi: true,
          };
        } else if (Array.isArray(json.data)) {
          return {
            data: json.data.slice((page - 1) * limit, page * limit) as T[],
            total: json.data.length,
            page,
            limit,
            totalPages: Math.ceil(json.data.length / limit),
            isLiveApi: true,
          };
        }
      }
    }
  } catch {
    // Graceful fallback to client-side data
  }

  // Client-side fallback pagination
  let items = fallbackItems;
  if (filterFn) {
    items = items.filter(filterFn);
  }

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const startIndex = (page - 1) * limit;
  const paginatedData = items.slice(startIndex, startIndex + limit);

  return {
    data: paginatedData,
    total,
    page,
    limit,
    totalPages,
    isLiveApi: false,
  };
}

// ─── Superadmin API Service Methods ──────────────────────────────────────────
export const superadminService = {
  // 1. Modul 2: Auth & RBAC
  getUsers: (page = 1, limit = 10, search = "", status = "all") =>
    safeFetch<User>(
      "/api/superadmin/users",
      MOCK_USERS,
      page,
      limit,
      (u) =>
        (status === "all" || u.status === status) &&
        (u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          u.phone.includes(search))
    ),

  getAdmins: (page = 1, limit = 10) =>
    safeFetch<AdminUser>("/api/superadmin/admins", MOCK_ADMINS, page, limit),

  getRoles: (page = 1, limit = 10) =>
    safeFetch<RolePermission>("/api/superadmin/roles", MOCK_ROLES, page, limit),

  getOtpLogs: (page = 1, limit = 10) =>
    safeFetch<OtpVerificationLog>(
      "/api/superadmin/user-verification",
      MOCK_OTP_LOGS,
      page,
      limit
    ),

  getActiveSessions: (page = 1, limit = 10) =>
    safeFetch<ActiveSession>(
      "/api/superadmin/admin-sessions",
      MOCK_ACTIVE_SESSIONS,
      page,
      limit
    ),

  // 2. Modul 3 & 4: Hosts & Catalog
  getHosts: (page = 1, limit = 10, search = "") =>
    safeFetch<HostData>(
      "/api/superadmin/users",
      MOCK_HOSTS,
      page,
      limit,
      (h) =>
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.email.toLowerCase().includes(search.toLowerCase())
    ),

  getCategories: (page = 1, limit = 10) =>
    safeFetch<EventCategory>(
      "/api/event-categories",
      MOCK_CATEGORIES,
      page,
      limit
    ),

  getProducts: (page = 1, limit = 10, search = "") =>
    safeFetch<EventProduct>(
      "/api/event-product",
      MOCK_PRODUCTS,
      page,
      limit,
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(search.toLowerCase())
    ),

  getFlashSales: (page = 1, limit = 10) =>
    safeFetch<FlashSale>(
      "/api/admin/flash-sales",
      MOCK_FLASH_SALES,
      page,
      limit
    ),

  // 3. Modul 6: Tamu & Presensi
  getGuests: (page = 1, limit = 10, search = "", rsvpStatus = "all") =>
    safeFetch<EventGuest>(
      "/api/host/event-guests",
      MOCK_GUESTS,
      page,
      limit,
      (g) =>
        (rsvpStatus === "all" || g.rsvpStatus === rsvpStatus) &&
        (g.name.toLowerCase().includes(search.toLowerCase()) ||
          g.guestCode.toLowerCase().includes(search.toLowerCase()))
    ),

  getRegistrations: (page = 1, limit = 10, search = "") =>
    safeFetch<EventRegistration>(
      "/api/admin/event-registrations",
      MOCK_REGISTRATIONS,
      page,
      limit,
      (r) =>
        r.userName.toLowerCase().includes(search.toLowerCase()) ||
        r.ticketCode.toLowerCase().includes(search.toLowerCase())
    ),

  getAttendances: (page = 1, limit = 10, search = "") =>
    safeFetch<EventAttendance>(
      "/api/host/event-attendances",
      MOCK_ATTENDANCES,
      page,
      limit,
      (a) =>
        a.attendeeName.toLowerCase().includes(search.toLowerCase()) ||
        a.qrCodeScanned.toLowerCase().includes(search.toLowerCase())
    ),

  // 4. Modul 7: Keuangan & Billing
  getInvoices: (page = 1, limit = 10, search = "", status = "all") =>
    safeFetch<PackageInvoice>(
      "/api/admin/invoices",
      MOCK_INVOICES,
      page,
      limit,
      (i) =>
        (status === "all" || i.status === status) &&
        (i.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
          i.hostName.toLowerCase().includes(search.toLowerCase()))
    ),

  getPayments: (page = 1, limit = 10, search = "") =>
    safeFetch<PaymentSessionLog>(
      "/api/admin/payment-sessions",
      MOCK_PAYMENTS,
      page,
      limit,
      (p) =>
        p.paymentReference.toLowerCase().includes(search.toLowerCase()) ||
        p.targetNumber.toLowerCase().includes(search.toLowerCase())
    ),

  getGiftInvoices: (page = 1, limit = 10, search = "") =>
    safeFetch<GiftInvoiceRecord>(
      "/api/admin/invoice-gifts",
      MOCK_GIFT_INVOICES,
      page,
      limit,
      (g) =>
        g.senderName.toLowerCase().includes(search.toLowerCase()) ||
        g.hostName.toLowerCase().includes(search.toLowerCase())
    ),

  // 5. Modul 8: Support Tickets & Reviews
  getTickets: (page = 1, limit = 10, status = "all") =>
    safeFetch<SupportTicket>(
      "/api/host/tickets",
      MOCK_TICKETS,
      page,
      limit,
      (t) => status === "all" || t.status === status
    ),

  getReviews: (page = 1, limit = 10) =>
    safeFetch<ThemeReview>(
      "/api/admin/invoice-reviews",
      MOCK_REVIEWS,
      page,
      limit
    ),

  // 6. Modul 9: CMS & Marketing
  getPopups: (page = 1, limit = 10) =>
    safeFetch<PromoPopup>("/api/popups", MOCK_POPUPS, page, limit),

  getSosmed: (page = 1, limit = 10) =>
    safeFetch<SocialMediaAccount>("/api/sosmed", MOCK_SOSMED, page, limit),

  getFaq: (page = 1, limit = 10) =>
    safeFetch<FaqItem>("/api/faq", MOCK_FAQ_ITEMS, page, limit),

  getContactMessages: (page = 1, limit = 10) =>
    safeFetch<ContactMessage>(
      "/api/contact-messages",
      MOCK_CONTACT_MESSAGES,
      page,
      limit
    ),

  // 7. Modul 10: Notifikasi
  getNotifications: (page = 1, limit = 10, channel = "whatsapp") =>
    safeFetch<NotificationLog>(
      channel === "whatsapp" ? "/api/admin/notif-whatsapps" : "/api/admin/notif-emails",
      MOCK_NOTIF_LOGS,
      page,
      limit,
      (n) => n.channel === channel
    ),

  // 8. Modul 11 & 12: Konfigurasi & Audit Trail
  getSettings: () =>
    safeFetch<SiteSettings>("/api/superadmin/settings", [MOCK_SITE_SETTINGS], 1, 1),

  getActivityLogs: (page = 1, limit = 10, search = "") =>
    safeFetch<ActivityLog>(
      "/api/superadmin/activity-logs",
      MOCK_ACTIVITY_LOGS,
      page,
      limit,
      (l) =>
        l.actorName.toLowerCase().includes(search.toLowerCase()) ||
        l.action.toLowerCase().includes(search.toLowerCase())
    ),
};
