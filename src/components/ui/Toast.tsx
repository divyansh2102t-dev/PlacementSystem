"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

interface ToastItem {
  id: number;
  message: string;
  type?: "success" | "error" | "info";
}

interface ToastContextType {
  notify: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType>({
  notify: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const notify = useCallback(
    (message: string, type: "success" | "error" | "info" = "success") => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none p-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-xl border p-3.5 shadow-lg backdrop-blur-md transition-all animate-in slide-in-from-bottom-2 text-xs font-medium ${
              toast.type === "error"
                ? "border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950/90 dark:text-rose-200"
                : toast.type === "info"
                ? "border-sky-300 bg-sky-50 text-sky-900 dark:border-sky-800 dark:bg-sky-950/90 dark:text-sky-200"
                : "border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/90 dark:text-emerald-200"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {toast.type === "error" ? (
                <AlertCircle size={16} className="text-rose-600 shrink-0" />
              ) : toast.type === "info" ? (
                <Info size={16} className="text-sky-600 shrink-0" />
              ) : (
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              )}
              <span className="truncate">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10 shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
