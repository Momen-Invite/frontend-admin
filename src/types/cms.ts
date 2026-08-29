export interface BankSetting {
  id: number;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountHolderName: string;
  logoUrl?: string | null;
  isActive: boolean;
  orderIndex: number;
}

export interface FaqItem {
  id: number;
  categoryId: number;
  categoryName?: string;
  question: string;
  answer: string;
  orderIndex: number;
  isActive: boolean;
}

export interface PopupPromo {
  id: number;
  title: string;
  imageUrl?: string | null;
  targetUrl?: string | null;
  isActive: boolean;
  startAt: string;
  endAt: string;
}

export interface SystemConfig {
  siteName: string;
  siteDescription: string;
  supportEmail: string;
  supportPhone: string;
  maintenanceMode: boolean;
  allowManualTransfer: boolean;
  minWithdrawalAmount: number;
  maxWithdrawalAmount: number;
}
