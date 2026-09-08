"use client";

import React from "react";
import { toast as sonnerToast, Toaster as SonnerToaster } from "sonner";
import {
  CircleCheckIcon,
  AlertCircleIcon,
  InfoIcon,
  AlertTriangleIcon,
  Loader2Icon,
} from "lucide-react";

export interface ToastContent {
  title: string;
  description?: string;
}

export type ToastResult<T> =
  | string
  | ToastContent
  | ((value: T) => string | ToastContent);

export interface PromiseToastOptions<T> {
  loading: string | ToastContent;
  success: ToastResult<T>;
  error: ToastResult<any>;
}

export interface ToastOptions {
  description?: string;
  duration?: number;
  id?: string | number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Global toast manager object conforming to promise-toast specs and universal use
 */
export const toastManager = {
  /**
   * Universal Promise toast: handles loading, success, and error states seamlessly
   */
  promise<T>(
    promise: Promise<T>,
    options: PromiseToastOptions<T>
  ) {
    const loadingData =
      typeof options.loading === "string"
        ? { title: options.loading, description: undefined }
        : options.loading;

    return sonnerToast.promise(promise, {
      loading: (
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 shrink-0 text-primary">
            <Loader2Icon className="size-4 animate-spin" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-sm text-foreground">
              {loadingData.title}
            </span>
            {loadingData.description && (
              <span className="text-xs text-muted-foreground">
                {loadingData.description}
              </span>
            )}
          </div>
        </div>
      ),
      success: (data: T) => {
        const resolved =
          typeof options.success === "function"
            ? options.success(data)
            : options.success;

        const resData =
          typeof resolved === "string"
            ? { title: resolved, description: undefined }
            : resolved;

        return (
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 shrink-0 text-success">
              <CircleCheckIcon className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-sm text-foreground">
                {resData.title}
              </span>
              {resData.description && (
                <span className="text-xs text-muted-foreground">
                  {resData.description}
                </span>
              )}
            </div>
          </div>
        );
      },
      error: (err: any) => {
        const resolved =
          typeof options.error === "function"
            ? options.error(err)
            : options.error;

        const resData =
          typeof resolved === "string"
            ? { title: resolved, description: undefined }
            : resolved;

        return (
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 shrink-0 text-error">
              <AlertCircleIcon className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-sm text-foreground">
                {resData.title}
              </span>
              {resData.description && (
                <span className="text-xs text-muted-foreground">
                  {resData.description}
                </span>
              )}
            </div>
          </div>
        );
      },
    });
  },

  success(title: string, options?: ToastOptions) {
    return sonnerToast.success(title, {
      description: options?.description,
      duration: options?.duration,
      id: options?.id,
      icon: <CircleCheckIcon className="size-4 text-success" />,
      action: options?.action,
    });
  },

  error(title: string, options?: ToastOptions) {
    return sonnerToast.error(title, {
      description: options?.description,
      duration: options?.duration,
      id: options?.id,
      icon: <AlertCircleIcon className="size-4 text-error" />,
      action: options?.action,
    });
  },

  info(title: string, options?: ToastOptions) {
    return sonnerToast.info(title, {
      description: options?.description,
      duration: options?.duration,
      id: options?.id,
      icon: <InfoIcon className="size-4 text-info" />,
      action: options?.action,
    });
  },

  warning(title: string, options?: ToastOptions) {
    return sonnerToast.warning(title, {
      description: options?.description,
      duration: options?.duration,
      id: options?.id,
      icon: <AlertTriangleIcon className="size-4 text-warning" />,
      action: options?.action,
    });
  },

  loading(title: string, options?: ToastOptions) {
    return sonnerToast.loading(title, {
      description: options?.description,
      id: options?.id,
      icon: <Loader2Icon className="size-4 animate-spin text-primary" />,
    });
  },

  custom(jsx: (id: string | number) => React.ReactElement, options?: any) {
    return sonnerToast.custom(jsx, options);
  },

  dismiss(id?: string | number) {
    return sonnerToast.dismiss(id);
  },
};

/**
 * Direct callable toast function with attached methods
 */
export const toast = Object.assign(
  (title: string, options?: ToastOptions) => {
    return sonnerToast(title, {
      description: options?.description,
      duration: options?.duration,
      id: options?.id,
      action: options?.action,
    });
  },
  toastManager
);

export interface ToastProviderProps {
  children?: React.ReactNode;
}

/**
 * Centered Toast Provider component
 * Positions toasts right at the top-center of the screen
 */
export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <SonnerToaster
        position="top-center"
        closeButton
        richColors={false}
        toastOptions={{
          className:
            "group toast font-sans rounded-xl border border-surface-variant/50 bg-surface-container-lowest/95 backdrop-blur-md text-on-surface shadow-2xl p-4 transition-all duration-300 min-w-[320px] max-w-[420px] mx-auto",
          classNames: {
            toast: "border-border shadow-overlay flex items-center gap-3",
            title: "font-semibold text-sm text-on-background",
            description: "text-xs text-on-surface-variant mt-0.5",
            actionButton: "bg-primary text-on-primary font-semibold text-xs rounded-lg px-3 py-1.5",
            cancelButton: "bg-surface-container text-on-surface text-xs rounded-lg px-3 py-1.5",
            closeButton: "bg-surface-container-high text-on-surface hover:bg-surface-variant",
          },
        }}
      />
    </>
  );
}

export default toastManager;
