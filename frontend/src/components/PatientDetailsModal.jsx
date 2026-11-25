import React from 'react';
import { 
  X, 
  User, 
  Building2, 
  Stethoscope, 
  Calendar, 
  Clock, 
  Edit3, 
  UserMinus, 
  CheckCircle2, 
  ShieldAlert 
} from 'lucide-react';
import { formatDate, formatDateTime } from '../utils/validators';

export default function PatientDetailsModal({
  isOpen,
  patient,
  onClose,
  onEdit,
  onDischarge,
}) {
  if (!isOpen || !patient) return null;

  const isAdmitted = patient.status === 'Admitted';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-primary to-primary-light text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2.5 py-0.5 rounded-md bg-white/20 text-white font-mono text-xs font-semibold tracking-wide">
              {patient.patient_id}
            </span>
            {isAdmitted ? (
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Currently Admitted</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-300" />
                <span>Discharged</span>
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {patient.name}
          </h2>
          <p className="text-xs text-blue-100/90 mt-0.5">
            {patient.age} years old • {patient.gender}
          </p>
        </div>

        {/* Content Details Grid */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Medical Placement Section */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Hospital Placement & Care Team
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center space-x-2 text-slate-500 text-xs mb-1">
                  <Building2 className="w-3.5 h-3.5 text-secondary" />
                  <span>Ward</span>
                </div>
                <div className="font-semibold text-sm text-slate-900">
                  {patient.ward}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center space-x-2 text-slate-500 text-xs mb-1">
                  <User className="w-3.5 h-3.5 text-secondary" />
                  <span>Department</span>
                </div>
                <div className="font-semibold text-sm text-slate-900">
                  {patient.department}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center space-x-2 text-slate-500 text-xs mb-1">
                  <Stethoscope className="w-3.5 h-3.5 text-secondary" />
                  <span>Physician</span>
                </div>
                <div className="font-semibold text-sm text-slate-900 truncate" title={patient.doctor}>
                  {patient.doctor}
                </div>
              </div>
            </div>
          </div>

          {/* Admission Timeline Section */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Admission Timeline & Metadata
            </h4>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 divide-y divide-slate-200/60 text-xs">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2 text-slate-500">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Date of Admission:</span>
                </div>
                <span className="font-semibold text-slate-800">
                  {formatDate(patient.admission_date)}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2 text-slate-500">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>System Created At:</span>
                </div>
                <span className="font-medium text-slate-700">
                  {formatDateTime(patient.created_at)}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2 text-slate-500">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Last Updated:</span>
                </div>
                <span className="font-medium text-slate-700">
                  {formatDateTime(patient.updated_at)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Database Record #{patient.id}
          </div>

          <div className="flex items-center space-x-2">
            {isAdmitted && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDischarge(patient);
                }}
                className="px-3.5 py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors flex items-center space-x-1.5"
              >
                <UserMinus className="w-3.5 h-3.5" />
                <span>Discharge Patient</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(patient);
              }}
              className="px-3.5 py-2 text-xs font-semibold text-primary bg-slate-200/80 hover:bg-slate-300 border border-slate-300 rounded-xl transition-colors flex items-center space-x-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
