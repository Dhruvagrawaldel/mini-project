"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

type ToastType = "success" | "error";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = "success", duration = 3000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Slide in
    const enterTimer = setTimeout(() => setVisible(true), 10);
    // Auto-dismiss
    const exitTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 400); // wait for slide-out animation
    }, duration);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
    };
  }, [duration, onClose]);

  const isSuccess = type === "success";

  return (
    <div
      className={`fixed top-6 right-6 z-[9999] flex items-center gap-4 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-400 ease-out max-w-sm
        ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-4 scale-95"}
        ${isSuccess
          ? "bg-black/80 border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)]"
          : "bg-black/80 border-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.2)]"
        }`}
    >
      {/* Icon */}
      <div className={`relative shrink-0 ${isSuccess ? "text-emerald-400" : "text-red-400"}`}>
        {/* Glow ring */}
        <div className={`absolute inset-0 rounded-full blur-md opacity-60 ${isSuccess ? "bg-emerald-500" : "bg-red-500"}`} />
        <div className={`relative p-1.5 rounded-full ${isSuccess ? "bg-emerald-500/20 border border-emerald-500/30" : "bg-red-500/20 border border-red-500/30"}`}>
          {isSuccess
            ? <CheckCircle2 className="w-5 h-5" />
            : <XCircle className="w-5 h-5" />
          }
        </div>
      </div>

      {/* Message */}
      <div className="flex-1">
        <p className={`font-black text-sm ${isSuccess ? "text-emerald-300" : "text-red-300"}`}>
          {isSuccess ? "Success!" : "Error"}
        </p>
        <p className="text-white/70 text-xs font-medium mt-0.5">{message}</p>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl overflow-hidden">
        <div
          className={`h-full rounded-b-2xl ${isSuccess ? "bg-emerald-500" : "bg-red-500"}`}
          style={{
            animation: `toast-shrink ${duration}ms linear forwards`,
          }}
        />
      </div>

      {/* Close button */}
      <button
        onClick={() => { setVisible(false); setTimeout(onClose, 400); }}
        className="shrink-0 text-white/30 hover:text-white/70 transition-colors p-1 rounded-lg hover:bg-white/10"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <style jsx>{`
        @keyframes toast-shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
}
