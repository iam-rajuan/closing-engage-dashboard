import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import { Check, AlertTriangle, Info, X } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────

export type ToastVariant = "success" | "error" | "info";

interface Toast {
  id: string;
  title: string;
  message?: string;
  variant: ToastVariant;
  duration: number;
}

interface ToastContextValue {
  showToast: (
    title: string,
    options?: { message?: string; variant?: ToastVariant; duration?: number }
  ) => void;
}

// ── Context ────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

// ── Provider ───────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (
      title: string,
      {
        message,
        variant = "success",
        duration = 4000,
      }: { message?: string; variant?: ToastVariant; duration?: number } = {}
    ) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { id, title, message, variant, duration }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col-reverse gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ── Toast Item ─────────────────────────────────────────────────────

const variantConfig = {
  success: {
    icon: Check,
    bg: "bg-[#f0fdf4]",
    border: "border-[#bbf7d0]",
    iconBg: "bg-[#22c55e]",
    iconColor: "text-white",
    progress: "bg-[#22c55e]",
  },
  error: {
    icon: AlertTriangle,
    bg: "bg-[#fef2f2]",
    border: "border-[#fecaca]",
    iconBg: "bg-[#ef4444]",
    iconColor: "text-white",
    progress: "bg-[#ef4444]",
  },
  info: {
    icon: Info,
    bg: "bg-[#eff6ff]",
    border: "border-[#bfdbfe]",
    iconBg: "bg-[#3b82f6]",
    iconColor: "text-white",
    progress: "bg-[#3b82f6]",
  },
};

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const config = variantConfig[toast.variant];
  const Icon = config.icon;

  return (
    <div
      className={`pointer-events-auto w-[380px] overflow-hidden rounded-2xl border ${config.border} ${config.bg} shadow-[0_20px_60px_rgba(15,23,42,0.12)] toast-slide-in`}
    >
      <div className="flex items-start gap-3.5 px-4 py-4">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${config.iconBg} ${config.iconColor}`}
        >
          <Icon size={16} strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-semibold text-slate-800">{toast.title}</div>
          {toast.message && (
            <div className="mt-0.5 text-[13px] leading-5 text-slate-500">{toast.message}</div>
          )}
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          className="shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-white/60 hover:text-slate-600"
        >
          <X size={14} />
        </button>
      </div>
      {/* Progress bar */}
      <div className="h-[3px] w-full bg-black/[0.04]">
        <div
          className={`h-full ${config.progress} toast-progress`}
          style={{ animationDuration: `${toast.duration}ms` }}
        />
      </div>
    </div>
  );
}
