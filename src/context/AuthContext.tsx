"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authApi, AdminLoginPayload, AdminUserData, LoginResponseData } from "@/lib/api-auth";
import { ApiError } from "@/lib/api";
import { toastManager } from "@/components/ui/toast";

interface AuthContextType {
  user: AdminUserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AdminLoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = "momen_admin_user";
const STORAGE_KEY_AUTH = "momen_admin_authenticated";
const COOKIE_NAME = "momen_admin_session";

function setAuthCookie(value: string, days = 7) {
  if (typeof document === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${COOKIE_NAME}=${value}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
}

function removeAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  // Inisialisasi status autentikasi dari localStorage saat mount
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem(STORAGE_KEY_AUTH);
      const storedUser = localStorage.getItem(STORAGE_KEY_USER);

      if (storedAuth === "true" && storedUser) {
        const parsedUser = JSON.parse(storedUser) as AdminUserData;
        setUser(parsedUser);
        setIsAuthenticated(true);
        setAuthCookie("1");
      }
    } catch {
      // Abaikan parsing error
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login handler
  const login = async (credentials: AdminLoginPayload) => {
    try {
      const response = await authApi.login(credentials);
      
      const responseData = response.data as LoginResponseData | undefined;
      const adminData = responseData?.user || responseData?.admin || {
        id: 1,
        email: credentials.email,
        name: credentials.email.split("@")[0].replace(/[^a-zA-Z]/g, " ").trim() || "Administrator",
        role: "superadmin" as const,
      };

      setUser(adminData);
      setIsAuthenticated(true);

      // Simpan status login & token
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_AUTH, "true");
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(adminData));
        if (responseData?.token) {
          localStorage.setItem("momen_admin_token", responseData.token);
        }
        setAuthCookie("1");
      }

      toastManager.success(`Selamat datang kembali, ${adminData.name}!`);
      router.replace("/");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 423) {
          toastManager.error("Akun sementara terkunci karena melebihi batas percobaan (5x). Silakan coba lagi nanti.");
        } else if (err.status === 401) {
          toastManager.error(err.message || "Email atau password salah.");
        } else {
          toastManager.error(err.message || "Terjadi kesalahan saat masuk.");
        }
      } else {
        toastManager.error("Gagal terhubung ke server autentikasi.");
      }
      throw err;
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);

      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY_AUTH);
        localStorage.removeItem(STORAGE_KEY_USER);
        localStorage.removeItem("momen_admin_token");
        removeAuthCookie();
      }

      toastManager.info("Sesi Anda telah diakhiri. Silakan login kembali.");
      router.replace("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
}
