/**
 * Standard API Response Contract from Momen Invite Backend Core (FR-QA-01)
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  type: string;
  title: string;
  action: string;
  status: number;
  message: string;
  data: T;
  errors?: Record<string, string[]> | null;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  details?: Record<string, unknown> | null;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedData<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
