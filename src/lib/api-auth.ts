/**
 * Admin Authentication API Service Layer
 * Sesuai panduan DATABASE-ERD.md (Domain 1: admins & admin_sessions)
 * Endpoint: POST /api/auth/admin/login
 */

import { api, ApiError } from "@/lib/api";

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface AdminUserData {
  id: number;
  email: string;
  name: string;
  role: "superadmin" | "admin";
  phone?: string;
  address?: string;
  status?: string;
  avatarUrl?: string | null;
}

export interface LoginResponseData {
  user?: AdminUserData;
  admin?: AdminUserData;
  session?: {
    sid: string;
    expiresAt: string;
  };
  token?: string;
}

export const authApi = {
  /**
   * Login administrator ke platform Momen Invite
   * Endpoint: POST /api/auth/admin/login
   * Mendukung cookie session (connect.sid) dan PostgreSQL admin_sessions
   */
  login: async (credentials: AdminLoginPayload) => {
    return api.post<LoginResponseData>("/api/auth/admin/login", credentials);
  },

  /**
   * Verifikasi sesi aktif administrator saat ini
   * Memanggil endpoint superadmin untuk memverifikasi apakah cookie connect.sid masih valid
   */
  checkSession: async () => {
    try {
      // Menguji validitas session cookie terhadap endpoint master admins
      const res = await api.get<{ items: AdminUserData[] }>("/api/superadmin/admins", { limit: 1 });
      return res.success;
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        return false;
      }
      return false;
    }
  },

  /**
   * Logout administrator
   * Membersihkan session
   */
  logout: async () => {
    try {
      // Panggil endpoint logout jika backend menyediakannya
      await api.post("/api/auth/logout").catch(() => {});
    } catch {
      // Ignore error jika backend hanya mengandalkan penghapusan client cookie
    }
  },
};
