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
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-2xl border p-3.5 shadow-xl backdrop-blur-xl transition-all animate-in slide-in-from-bottom-2 text-xs font-semibold ${
              toast.type === "error"
                ? "border-rose-200/80 bg-rose-50/95 text-rose-950 shadow-rose-500/10"
                : toast.type === "info"
                ? "border-sky-200/80 bg-sky-50/95 text-sky-950 shadow-sky-500/10"
                : "border-emerald-200/80 bg-emerald-50/95 text-emerald-950 shadow-emerald-500/10"
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
              className="rounded-lg p-1 hover:bg-black/5 shrink-0 text-slate-400 hover:text-slate-700 transition"
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
