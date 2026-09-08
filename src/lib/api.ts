import { ApiResponse, ApiErrorResponse } from "@/types/api";

// Gunakan path relatif agar request diproses melalui Next.js API Proxy (next.config.ts).
// Proxy meneruskan /api/* → https://api.momeninvite.web.id/api/*  server-side,
// sehingga cookie connect.sid dikirim dengan benar (same-origin).
const API_BASE_URL = typeof window !== "undefined"
  ? "" // client-side: pakai relative path → melewati Next.js proxy
  : (process.env.NEXT_PUBLIC_API_URL || "https://api.momeninvite.web.id"); // server-side (middleware, dll)

export class ApiError extends Error {
  status: number;
  error: string;
  details?: Record<string, unknown> | null;

  constructor(status: number, message: string, error = "API_ERROR", details: Record<string, unknown> | null | undefined = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.error = error;
    this.details = details;
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { params, ...customConfig } = options;

  let url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(customConfig.headers as Record<string, string>),
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("momen_admin_token");
    if (token && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    method: options.method || "GET",
    headers,
    // Required for cookie session authentication (admin_sessions / connect.sid)
    credentials: "include",
    ...customConfig,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      const errorData = data as ApiErrorResponse;
      throw new ApiError(
        response.status,
        errorData.message || `Request failed with status ${response.status}`,
        errorData.error || "SERVER_ERROR",
        errorData.details
      );
    }

    return data as ApiResponse<T>;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, (error as Error).message || "Koneksi ke server terputus.");
  }
}

export const api = {
  get: <T>(url: string, params?: Record<string, string | number | boolean | undefined>) =>
    apiClient<T>(url, { method: "GET", params }),

  post: <T>(url: string, body?: unknown) =>
    apiClient<T>(url, { method: "POST", body: body ? JSON.stringify(body) : undefined }),

  put: <T>(url: string, body?: unknown) =>
    apiClient<T>(url, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),

  patch: <T>(url: string, body?: unknown) =>
    apiClient<T>(url, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),

  delete: <T>(url: string) =>
    apiClient<T>(url, { method: "DELETE" }),
};
