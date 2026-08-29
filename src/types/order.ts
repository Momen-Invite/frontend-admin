export type OrderStatus = "pending_payment" | "success" | "cancelled" | "expired";
export type PaymentMethod = "DUITKU_QRIS" | "DUITKU_VA" | "MANUAL_TRANSFER";

export interface EventOrder {
  id: number;
  orderNumber: string;
  hostId: number;
  hostName: string;
  hostEmail: string;
  productId: number;
  productName: string;
  categoryId: number;
  categoryName: string;
  title: string;
  slug: string;
  totalAmount: number;
  status: OrderStatus;
  isPublished: boolean;
  paymentMethod: PaymentMethod;
  invoiceNumber: string;
  paymentProofUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentProof {
  id: number;
  orderId: number;
  invoiceId: number;
  proofImageUrl: string;
  senderBank: string;
  senderAccountName: string;
  transferAmount: number;
  transferDate: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  adminNotes?: string | null;
  verifiedByAdminId?: number | null;
  createdAt: string;
}
