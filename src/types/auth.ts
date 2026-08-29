export type AdminRole = "ADMIN" | "SUPER_ADMIN";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: AdminRole;
  avatarUrl?: string | null;
  failedAttempts: number;
  lockedUntil?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSession {
  user: AdminUser;
  expiresAt: string;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
