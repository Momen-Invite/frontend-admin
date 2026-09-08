/**
 * Tipe Data & Skema Database Superadmin Momen Invite
 * Merujuk pada docs/SUPERADMIN.md dan docs/DATABASE-ERD.md
 */

// ─── Modul 2: Auth & RBAC ───────────────────────────────────────────────────
export type UserRole = "superadmin" | "admin" | "host" | "guest_registered";
export type UserStatus = "active" | "banned" | "suspended";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role: UserRole;
  status: UserStatus;
  isVerified: boolean;
  createdAt: string;
  totalOrders?: number;
  hostBalance?: number;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role: "admin" | "superadmin";
  status: "active" | "inactive" | "suspended";
  failedAttempts: number;
  lockedUntil?: string | null;
  lastLoginAt?: string;
  createdAt: string;
}

export interface RolePermission {
  id: number;
  name: UserRole;
  description: string;
  permissions: string[];
  userCount: number;
  createdAt: string;
}

export interface OtpVerificationLog {
  id: number;
  target: string;
  channel: "email" | "whatsapp";
  purpose: "register" | "reset_password" | "login_2fa";
  isExpired: boolean;
  usedAt?: string | null;
  createdAt: string;
}

export interface ActiveSession {
  sid: string;
  userId: number;
  userName: string;
  role: string;
  ipAddress: string;
  deviceInfo: string;
  expiresAt: string;
  createdAt: string;
}

// ─── Modul 3: Hosts Penyelenggara ──────────────────────────────────────────
export interface HostData {
  id: number;
  userId: number;
  name: string;
  email: string;
  phone: string;
  balance: number;
  allowNotifWa: boolean;
  createdAt: string;
  totalEvents: number;
  totalGiftsReceived: number;
  totalWithdrawn: number;
  pendingWithdrawalCount: number;
}

// ─── Modul 4: Katalog & Produk ──────────────────────────────────────────────
export interface EventCategory {
  id: number;
  name: string;
  slug: string;
  requiresRsvp: boolean;
  isActive: boolean;
  productCount: number;
  description?: string;
  createdAt: string;
}

export interface EventProduct {
  id: number;
  eventCategoryId: number;
  categoryName: string;
  name: string;
  slug: string;
  description: string;
  badge?: string;
  themeSlug: string;
  price: number;
  thumbnailUrl: string;
  isPublished: boolean;
  totalSold: number;
  createdAt: string;
  sectionsConfig?: string[];
  themeConfig?: Record<string, any>;
}

export interface FlashSale {
  id: number;
  eventProductId: number;
  productName: string;
  normalPrice: number;
  promoPrice: number;
  label: string;
  startsAt: string;
  endsAt: string;
  status: "scheduled" | "active" | "ended";
}

// ─── Modul 6: Buku Tamu & Presensi ──────────────────────────────────────────
export type RsvpStatus = "pending" | "attending" | "declined" | "tentative";

export interface EventGuest {
  id: number;
  eventOrderId: number;
  eventTitle: string;
  guestCode: string;
  name: string;
  phone: string;
  email?: string;
  category: "VIP" | "Keluarga" | "Teman" | "Rekan Kerja" | "Reguler";
  groupSession?: string;
  tableNumber?: string;
  maxGuests: number;
  rsvpStatus: RsvpStatus;
  rsvpPax: number;
  rsvpWishes?: string;
  invitationOpenedAt?: string | null;
  createdAt: string;
}

export interface EventRegistration {
  id: number;
  eventOrderId: number;
  eventTitle: string;
  userId: number;
  userName: string;
  userEmail: string;
  ticketCode: string;
  ticketType: string;
  status: "confirmed" | "pending_payment" | "cancelled";
  paxCount: number;
  registeredAt: string;
}

export interface EventAttendance {
  id: number;
  eventOrderId: number;
  eventTitle: string;
  attendeeName: string;
  attendeeType: "guest" | "walk_in" | "registered_user";
  qrCodeScanned: string;
  actualPax: number;
  sessionName: string;
  checkinMethod: "Scan QR" | "Manual Input";
  checkedInByLabel: string;
  souvenirStatus: "Sudah Diberikan" | "Belum";
  gateOrDesk: string;
  checkedInAt: string;
}

// ─── Modul 7: Keuangan & Billing ────────────────────────────────────────────
export type InvoiceStatus = "PENDING" | "SUCCESS" | "FAILED" | "EXPIRED";

export interface PackageInvoice {
  id: number;
  eventOrderId: number;
  invoiceNumber: string;
  hostName: string;
  hostEmail: string;
  eventProductNameSnapshot: string;
  subtotal: number;
  tax: number;
  total: number;
  dueDate: string;
  status: InvoiceStatus;
  paidAt?: string | null;
  paymentMethod?: string;
  createdAt: string;
}

export interface PaymentSessionLog {
  id: number;
  paymentReference: string;
  targetType: "Invoice Tema" | "Amplop Kado" | "Tiket Event";
  targetNumber: string;
  amount: number;
  paymentMethod: string;
  status: "active" | "expired" | "superseded" | "paid";
  signatureValid: boolean;
  webhookReceivedAt?: string | null;
  payloadSnapshot?: Record<string, any>;
  createdAt: string;
}

export interface GiftInvoiceRecord {
  id: number;
  hostId: number;
  hostName: string;
  eventOrderId: number;
  eventTitle: string;
  senderName: string;
  senderMessage?: string;
  amount: number;
  status: "pending" | "paid" | "expired";
  paymentMethod: string;
  paidAt?: string | null;
  createdAt: string;
}

// ─── Modul 8: Support Tickets & Reviews ─────────────────────────────────────
export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export interface SupportTicket {
  id: number;
  hostId: number;
  hostName: string;
  hostPhone: string;
  eventTitle?: string;
  issueType: "billing" | "technical" | "design" | "other";
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedAdminId?: number | null;
  assignedAdminName?: string | null;
  createdAt: string;
  resolvedAt?: string | null;
  interactionsCount: number;
}

export interface TicketInteraction {
  id: number;
  ticketId: number;
  senderType: "host" | "admin";
  senderName: string;
  message: string;
  fileAttachment?: { name: string; url: string; size: string } | null;
  createdAt: string;
}

export interface ThemeReview {
  id: number;
  userId: number;
  userName: string;
  productName: string;
  categoryName: string;
  rating: number;
  message: string;
  isPublished: boolean;
  createdAt: string;
}

// ─── Modul 9: CMS & Marketing ───────────────────────────────────────────────
export interface PromoPopup {
  id: number;
  title: string;
  displayLocate: "all" | "landing" | "host" | "public";
  imgUrl: string;
  linkBanner: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface SocialMediaAccount {
  id: number;
  name: string;
  url: string;
  icon: string;
}

export interface FaqCategory {
  id: number;
  name: string;
  queueNumber: number;
  itemCount: number;
}

export interface FaqItem {
  id: number;
  faqCategoryId: number;
  categoryName: string;
  question: string;
  answer: string;
  queueNumber: number;
  isActive: boolean;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  createdAt: string;
}

// ─── Modul 10: Notification Logs ────────────────────────────────────────────
export interface NotificationLog {
  id: number;
  channel: "whatsapp" | "email";
  recipient: string;
  eventTitle?: string;
  subjectOrPreview: string;
  status: "pending" | "sent" | "failed";
  retryCount: number;
  createdAt: string;
  providerResponse?: string;
}

export interface DeadNotification {
  id: number;
  channel: "whatsapp" | "email";
  recipient: string;
  payloadSummary: string;
  errorMessage: string;
  retryCount: number;
  status: "dead" | "discarded" | "resolved";
  lastAttemptAt: string;
}

// ─── Modul 11 & 12: Settings & Activity Logs ────────────────────────────────
export interface SiteSettings {
  websiteName: string;
  title: string;
  desc: string;
  author: string;
  teksNavbar: string;
  logoUrl?: string;
  iconUrl?: string;
  keywords: string[];
}

export interface TransactionSettings {
  trxPrefixId: string;
  trxStartId: number;
  trxExpiredMinutes: number;
  trxDelayMinutes: number;
}

export interface GatewaySettings {
  waProvider: string;
  waDeviceName: string;
  waPhone: string;
  waApiUrl: string;
  waTokenMasked: string;
  waStatus: "aktif" | "tidak";
  emailSmtpHost: string;
  emailSmtpPort: number;
  emailSenderAddress: string;
  emailSenderName: string;
}

export interface ActivityLog {
  id: number;
  actorAdminId: number;
  actorName: string;
  actorRole: "admin" | "superadmin";
  action: string;
  entityName: string;
  entityId: string | number;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  details?: string;
}
