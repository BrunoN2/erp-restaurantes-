import React from 'react';
import { CheckCircle2, AlertTriangle, Info, AlertOctagon, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Toasts: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-2xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-3 duration-200 ${
              isSuccess
                ? 'bg-slate-900/95 border-emerald-500/40 text-emerald-200'
                : isWarning
                ? 'bg-slate-900/95 border-amber-500/50 text-amber-200'
                : isError
                ? 'bg-slate-900/95 border-rose-500/50 text-rose-200'
                : 'bg-slate-900/95 border-slate-700 text-slate-200'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {isWarning && <AlertTriangle className="w-4 h-4 text-amber-400" />}
              {isError && <AlertOctagon className="w-4 h-4 text-rose-400" />}
              {!isSuccess && !isWarning && !isError && <Info className="w-4 h-4 text-blue-400" />}
            </div>

            <div className="flex-1 text-xs leading-relaxed font-medium">
              {toast.message}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
