export type WithdrawalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Withdrawal {
  id: number;
  hostId: number;
  hostName: string;
  hostEmail: string;
  hostPhone?: string | null;
  amount: number;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  status: WithdrawalStatus;
  rejectReason?: string | null;
  processedByAdminId?: number | null;
  processedByAdminName?: string | null;
  processedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApproveWithdrawalPayload {
  notes?: string;
}

export interface RejectWithdrawalPayload {
  reason: string;
}
