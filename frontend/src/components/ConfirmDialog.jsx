import React from 'react';
import { AlertTriangle, UserMinus, Trash2, X } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  patient,
  actionType = 'delete', // 'delete' or 'discharge'
  confirmText,
  isLoading = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  const isDelete = actionType === 'delete';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isDelete ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-secondary'
            }`}>
              {isDelete ? <Trash2 className="w-5 h-5" /> : <UserMinus className="w-5 h-5" />}
            </div>
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-2">
            {title}
          </h3>

          <p className="text-sm text-slate-600 mb-4">
            {message}
          </p>

          {patient && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-6">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Patient ID:</span>
                <span className="font-semibold text-slate-800">{patient.patient_id}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Full Name:</span>
                <span className="font-semibold text-slate-800">{patient.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Ward / Department:</span>
                <span className="font-medium text-slate-700">{patient.ward} • {patient.department}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all flex items-center space-x-2 disabled:opacity-50 ${
                isDelete
                  ? 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500/30'
                  : 'bg-secondary hover:bg-secondary-dark focus:ring-secondary/30'
              }`}
            >
              {isLoading && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              )}
              <span>{confirmText || (isDelete ? 'Delete Patient' : 'Confirm Discharge')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
