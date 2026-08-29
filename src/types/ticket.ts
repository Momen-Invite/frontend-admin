export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Ticket {
  id: number;
  ticketCode: string;
  hostId: number;
  hostName: string;
  hostEmail: string;
  assignedAdminId?: number | null;
  assignedAdminName?: string | null;
  subject: string;
  category: "BILLING" | "TECHNICAL" | "DESIGN" | "OTHER";
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TicketInteraction {
  id: number;
  ticketId: number;
  senderType: "HOST" | "ADMIN";
  senderId: number;
  senderName: string;
  message: string;
  attachmentUrls?: string[];
  createdAt: string;
}
