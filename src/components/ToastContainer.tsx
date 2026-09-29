import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCart();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-white border border-neutral-200/90 shadow-2xl backdrop-blur-md text-neutral-900 transition-all transform animate-in slide-in-from-bottom-3 duration-300"
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              {isInfo && <Info className="w-4 h-4 text-blue-600" />}
              {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-600" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold tracking-wider uppercase font-mono text-neutral-950">{toast.title}</p>
              {toast.description && (
                <p className="text-xs text-neutral-600 mt-0.5 truncate">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-neutral-950 transition-colors p-0.5"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
