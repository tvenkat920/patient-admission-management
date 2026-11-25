import React from 'react';
import { Eye, Edit3, UserMinus, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { formatDate } from '../utils/validators';

export default function PatientTable({
  patients = [],
  isLoading = false,
  onView,
  onEdit,
  onDischarge,
  onDelete,
}) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="p-8 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-4">
              <div className="h-4 bg-slate-200 rounded w-1/12"></div>
              <div className="h-4 bg-slate-200 rounded w-2/12"></div>
              <div className="h-4 bg-slate-200 rounded w-1/12"></div>
              <div className="h-4 bg-slate-200 rounded w-2/12"></div>
              <div className="h-4 bg-slate-200 rounded w-2/12"></div>
              <div className="h-4 bg-slate-200 rounded w-2/12"></div>
              <div className="h-4 bg-slate-200 rounded w-2/12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Clock className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-slate-800 mb-1">
          No patient records found
        </h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          No patients match your current filter or search criteria. Try modifying your filters or add a new patient.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">Patient ID</th>
              <th className="py-3.5 px-4 sm:px-6">Patient Name</th>
              <th className="py-3.5 px-3">Age / Gender</th>
              <th className="py-3.5 px-4">Ward</th>
              <th className="py-3.5 px-4">Department</th>
              <th className="py-3.5 px-4">Doctor</th>
              <th className="py-3.5 px-4">Admission Date</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {patients.map((patient) => {
              const isAdmitted = patient.status === 'Admitted';

              return (
                <tr 
                  key={patient.id} 
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Patient ID */}
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-primary whitespace-nowrap">
                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {patient.patient_id}
                    </span>
                  </td>

                  {/* Patient Name */}
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900 whitespace-nowrap">
                    {patient.name}
                  </td>

                  {/* Age / Gender */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="font-medium">{patient.age} yrs</span>
                    <span className="text-slate-400 mx-1">•</span>
                    <span className="text-slate-500">{patient.gender}</span>
                  </td>

                  {/* Ward */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                      {patient.ward}
                    </span>
                  </td>

                  {/* Department */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-800">
                    {patient.department}
                  </td>

                  {/* Doctor */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                    {patient.doctor}
                  </td>

                  {/* Admission Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                    {formatDate(patient.admission_date)}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {isAdmitted ? (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>Admitted</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        <CheckCircle2 className="w-3 h-3 text-blue-500" />
                        <span>Discharged</span>
                      </span>
                    )}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1">
                      {/* View Button */}
                      <button
                        type="button"
                        onClick={() => onView(patient)}
                        title="View Patient Details"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => onEdit(patient)}
                        title="Edit Patient"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-secondary hover:bg-blue-50 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Discharge Button */}
                      <button
                        type="button"
                        onClick={() => onDischarge(patient)}
                        disabled={!isAdmitted}
                        title={isAdmitted ? 'Discharge Patient' : 'Patient already discharged'}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isAdmitted
                            ? 'text-slate-500 hover:text-amber-600 hover:bg-amber-50'
                            : 'text-slate-300 cursor-not-allowed'
                        }`}
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => onDelete(patient)}
                        title="Delete Patient"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
