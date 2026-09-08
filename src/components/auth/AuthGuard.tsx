"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-surface-container-low p-6">
        <div className="flex flex-col items-center gap-4 max-w-sm w-full text-center">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-primary/20 animate-ping opacity-75" />
            <div className="relative w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="material-symbols-outlined text-3xl text-on-primary animate-pulse">
                shield_person
              </span>
            </div>
          </div>

          <div className="space-y-1 mt-2">
            <h3 className="text-base font-bold text-on-surface">
              Memverifikasi Sesi Administrator...
            </h3>
            <p className="text-xs text-on-surface-variant">
              Memeriksa integritas kredensial dan hak akses RBAC platform
            </p>
          </div>

          {/* Skeleton placeholder bars */}
          <div className="w-full space-y-2 mt-4">
            <div className="h-2 bg-surface-container-high rounded-full w-3/4 mx-auto animate-pulse" />
            <div className="h-2 bg-surface-container-high rounded-full w-1/2 mx-auto animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
