import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onClose }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start space-x-3 p-4 rounded-xl shadow-lg border animate-fade-in transition-all ${
              isSuccess
                ? 'bg-white border-emerald-300 text-slate-800'
                : isError
                ? 'bg-white border-rose-300 text-slate-800'
                : isWarning
                ? 'bg-white border-amber-300 text-slate-800'
                : 'bg-white border-blue-300 text-slate-800'
            }`}
          >
            <div className="flex-shrink-0 pt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
              {isError && <XCircle className="w-5 h-5 text-rose-500" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-500" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-blue-500" />}
            </div>

            <div className="flex-1 min-w-0">
              {toast.title && (
                <h4 className="text-xs font-bold text-slate-900 mb-0.5">
                  {toast.title}
                </h4>
              )}
              <p className="text-xs text-slate-600 leading-snug break-words">
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onClose(toast.id)}
              className="flex-shrink-0 text-slate-400 hover:text-slate-600 p-0.5 rounded focus:outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
