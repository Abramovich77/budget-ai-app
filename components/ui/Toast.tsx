"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: ToastAction;
  persistent?: boolean; // Don't auto-dismiss if true
}

interface ToastContextType {
  showToast: (
    type: ToastType,
    title: string,
    message?: string,
    duration?: number,
    action?: ToastAction,
    persistent?: boolean
  ) => void;
  success: (title: string, message?: string, duration?: number) => void;
  error: (title: string, message?: string, duration?: number) => void;
  warning: (title: string, message?: string, duration?: number) => void;
  info: (title: string, message?: string, duration?: number) => void;
  successWithUndo: (
    title: string,
    message: string,
    onUndo: () => void,
    duration?: number
  ) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-500 dark:border-green-700",
    iconColor: "text-green-600 dark:text-green-400",
    textColor: "text-green-900 dark:text-green-100",
  },
  error: {
    icon: XCircle,
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-500 dark:border-red-700",
    iconColor: "text-red-600 dark:text-red-400",
    textColor: "text-red-900 dark:text-red-100",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-500 dark:border-yellow-700",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    textColor: "text-yellow-900 dark:text-yellow-100",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-500 dark:border-blue-700",
    iconColor: "text-blue-600 dark:text-blue-400",
    textColor: "text-blue-900 dark:text-blue-100",
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (
      type: ToastType,
      title: string,
      message?: string,
      duration = 5000,
      action?: ToastAction,
      persistent = false
    ) => {
      const id = Math.random().toString(36).substring(7);
      const toast: Toast = { id, type, title, message, duration, action, persistent };

      setToasts((prev) => [...prev, toast]);

      // Only auto-dismiss if not persistent and has positive duration
      if (!persistent && duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, message?: string) => showToast("success", title, message),
    [showToast]
  );

  const error = useCallback(
    (title: string, message?: string) => showToast("error", title, message),
    [showToast]
  );

  const warning = useCallback(
    (title: string, message?: string) => showToast("warning", title, message),
    [showToast]
  );

  const info = useCallback(
    (title: string, message?: string, duration?: number) => showToast("info", title, message, duration),
    [showToast]
  );

  const successWithUndo = useCallback(
    (title: string, message: string, onUndo: () => void, duration = 5000) => {
      showToast(
        "success",
        title,
        message,
        duration,
        {
          label: "Undo",
          onClick: onUndo,
        },
        false // Not persistent - will auto-dismiss after duration
      );
    },
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{ showToast, success, error, warning, info, successWithUndo }}
    >
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
        {toasts.map((toast) => {
          const config = toastConfig[toast.type];
          const Icon = config.icon;

          return (
            <div
              key={toast.id}
              className={`${config.bgColor} ${config.borderColor} border-l-4 p-4 rounded-lg shadow-lg animate-slide-in-right min-w-[320px]`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`h-5 w-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold ${config.textColor} text-sm`}>
                    {toast.title}
                  </h4>
                  {toast.message && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      {toast.message}
                    </p>
                  )}
                  {toast.action && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => {
                          toast.action?.onClick();
                          removeToast(toast.id);
                        }}
                        className={`text-sm font-medium ${config.iconColor} hover:opacity-80 transition underline`}
                      >
                        {toast.action.label}
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className={`${config.iconColor} hover:opacity-70 transition flex-shrink-0`}
                  aria-label="Close notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
