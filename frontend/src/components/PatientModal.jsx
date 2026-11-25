import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, AlertCircle } from 'lucide-react';
import { validatePatientForm } from '../utils/validators';

export default function PatientModal({
  isOpen,
  mode = 'add', // 'add' or 'edit'
  patient = null,
  options = {},
  isLoading = false,
  onClose,
  onSubmit,
}) {
  const isEdit = mode === 'edit';

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    ward: '',
    department: '',
    doctor: '',
    admission_date: new Date().toISOString().split('T')[0],
    status: 'Admitted',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  // Pre-fill form when editing
  useEffect(() => {
    if (isEdit && patient) {
      setFormData({
        name: patient.name || '',
        age: patient.age !== undefined ? patient.age : '',
        gender: patient.gender || '',
        ward: patient.ward || '',
        department: patient.department || '',
        doctor: patient.doctor || '',
        admission_date: patient.admission_date || new Date().toISOString().split('T')[0],
        status: patient.status || 'Admitted',
      });
      setErrors({});
      setServerError('');
    } else if (!isEdit && isOpen) {
      // Default blank values
      setFormData({
        name: '',
        age: '',
        gender: options.genders?.[0] || 'Male',
        ward: options.wards?.[0] || 'General Ward',
        department: options.departments?.[0] || 'Cardiology',
        doctor: (options.doctors_by_department?.[options.departments?.[0] || 'Cardiology']?.[0]) || '',
        admission_date: new Date().toISOString().split('T')[0],
        status: 'Admitted',
      });
      setErrors({});
      setServerError('');
    }
  }, [isEdit, patient, isOpen, options]);

  // Available doctors based on chosen department
  const availableDoctors = formData.department && options.doctors_by_department
    ? options.doctors_by_department[formData.department] || options.doctors || []
    : options.doctors || [];

  const handleDepartmentChange = (e) => {
    const newDept = e.target.value;
    const deptDoctors = options.doctors_by_department?.[newDept] || [];
    setFormData((prev) => ({
      ...prev,
      department: newDept,
      doctor: deptDoctors.length > 0 ? deptDoctors[0] : '',
    }));
    // Clear validation error on change
    if (errors.department) setErrors((prev) => ({ ...prev, department: null }));
    if (errors.doctor) setErrors((prev) => ({ ...prev, doctor: null }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // Frontend validation
    const { isValid, errors: validationErrors } = validatePatientForm(formData, options);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    try {
      const payload = {
        ...formData,
        age: parseInt(formData.age, 10),
        name: formData.name.trim(),
      };
      await onSubmit(payload);
    } catch (err) {
      if (err.response?.data?.detail) {
        setServerError(err.response.data.detail);
      } else {
        setServerError(err.userMessage || 'Failed to save patient. Please check all fields.');
      }
    }
  };

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white">
              {isEdit ? <Save className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isEdit ? `Edit Patient (${patient?.patient_id})` : 'Register New Patient'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEdit ? 'Update existing admission details' : 'Fill in patient registration details'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Server error banner */}
        {serverError && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-2.5 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{serverError}</div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1">
          {/* Patient Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Patient Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe (letters & spaces only)"
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-secondary focus:ring-secondary/20'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.name}</p>
            )}
          </div>

          {/* Age & Gender Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Age (years) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="age"
                min="0"
                max="120"
                value={formData.age}
                onChange={handleChange}
                placeholder="0 - 120"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.age
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-secondary focus:ring-secondary/20'
                }`}
              />
              {errors.age && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.age}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gender <span className="text-rose-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.gender
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-secondary focus:ring-secondary/20'
                }`}
              >
                <option value="">Select Gender</option>
                {options.genders?.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              {errors.gender && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.gender}</p>
              )}
            </div>
          </div>

          {/* Ward & Department Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assigned Ward <span className="text-rose-500">*</span>
              </label>
              <select
                name="ward"
                value={formData.ward}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.ward
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-secondary focus:ring-secondary/20'
                }`}
              >
                <option value="">Select Ward</option>
                {options.wards?.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
              {errors.ward && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.ward}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department <span className="text-rose-500">*</span>
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleDepartmentChange}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.department
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-secondary focus:ring-secondary/20'
                }`}
              >
                <option value="">Select Department</option>
                {options.departments?.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {errors.department && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.department}</p>
              )}
            </div>
          </div>

          {/* Attending Doctor */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Attending Doctor <span className="text-rose-500">*</span>
            </label>
            <select
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.doctor
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-secondary focus:ring-secondary/20'
              }`}
            >
              <option value="">Select Doctor</option>
              {availableDoctors.map((doc) => (
                <option key={doc} value={doc}>{doc}</option>
              ))}
            </select>
            {errors.doctor && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.doctor}</p>
            )}
          </div>

          {/* Admission Date & Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admission Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="admission_date"
                max={todayStr}
                value={formData.admission_date}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.admission_date
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-secondary focus:ring-secondary/20'
                }`}
              />
              {errors.admission_date && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.admission_date}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admission Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:border-secondary focus:ring-secondary/20 focus:outline-none focus:ring-2 transition-all"
              >
                <option value="Admitted">Admitted</option>
                <option value="Discharged">Discharged</option>
              </select>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 flex items-center space-x-2 disabled:opacity-50"
            >
              {isLoading && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              )}
              <span>{isEdit ? 'Save Changes' : 'Register Patient'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
