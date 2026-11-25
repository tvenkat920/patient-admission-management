import React from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  SlidersHorizontal,
  X
} from 'lucide-react';
import PatientTable from '../components/PatientTable';

export default function PatientsPage({
  patientsData,
  isLoading,
  filters,
  setFilters,
  onResetFilters,
  options,
  onOpenAddModal,
  onViewPatient,
  onEditPatient,
  onDischargePatient,
  onDeletePatient,
  onPageChange,
}) {
  const { items = [], total = 0, page = 1, pages = 1, limit = 10 } = patientsData || {};

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const hasActiveFilters = 
    Boolean(filters.search) || 
    (filters.ward && filters.ward !== 'All') || 
    (filters.department && filters.department !== 'All') || 
    (filters.doctor && filters.doctor !== 'All') || 
    (filters.status && filters.status !== 'All');

  // Filtered doctor options based on department filter if selected
  const availableDoctors = filters.department && filters.department !== 'All' && options?.doctors_by_department
    ? options.doctors_by_department[filters.department] || options.doctors || []
    : options?.doctors || [];

  return (
    <div className="space-y-5">
      {/* Top Header & Add Patient Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary tracking-tight">
            Patient Registry
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Comprehensive patient records with multi-parameter filtering and search
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Patient</span>
        </button>
      </div>

      {/* Filter and Search Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={handleSearchChange}
            placeholder="Search patients by name or Patient ID (e.g. John, PAT-1001)..."
            className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-slate-400"
          />
          {filters.search && (
            <button
              onClick={() => handleFilterChange('search', '')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-1">
          {/* Ward Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Ward
            </label>
            <select
              value={filters.ward || 'All'}
              onChange={(e) => handleFilterChange('ward', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-secondary focus:outline-none transition-all"
            >
              <option value="All">All Wards</option>
              {options?.wards?.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Department
            </label>
            <select
              value={filters.department || 'All'}
              onChange={(e) => {
                handleFilterChange('department', e.target.value);
                // Reset doctor filter if doctor doesn't belong to new department
                handleFilterChange('doctor', 'All');
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-secondary focus:outline-none transition-all"
            >
              <option value="All">All Departments</option>
              {options?.departments?.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Doctor Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Attending Doctor
            </label>
            <select
              value={filters.doctor || 'All'}
              onChange={(e) => handleFilterChange('doctor', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-secondary focus:outline-none transition-all"
            >
              <option value="All">All Doctors</option>
              {availableDoctors.map((doc) => (
                <option key={doc} value={doc}>{doc}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              value={filters.status || 'All'}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-secondary focus:outline-none transition-all"
            >
              <option value="All">All Statuses</option>
              <option value="Admitted">Admitted</option>
              <option value="Discharged">Discharged</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={onResetFilters}
              disabled={!hasActiveFilters}
              className={`w-full px-3 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center justify-center space-x-1.5 ${
                hasActiveFilters
                  ? 'border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  : 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            <span className="font-medium">Active filters:</span>
            {filters.search && (
              <span className="px-2 py-0.5 rounded-md bg-secondary/10 text-secondary font-medium">
                Search: "{filters.search}"
              </span>
            )}
            {filters.ward && filters.ward !== 'All' && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                Ward: {filters.ward}
              </span>
            )}
            {filters.department && filters.department !== 'All' && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                Dept: {filters.department}
              </span>
            )}
            {filters.doctor && filters.doctor !== 'All' && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                Doctor: {filters.doctor}
              </span>
            )}
            {filters.status && filters.status !== 'All' && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                Status: {filters.status}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Patient Table */}
      <PatientTable
        patients={items}
        isLoading={isLoading}
        onView={onViewPatient}
        onEdit={onEditPatient}
        onDischarge={onDischargePatient}
        onDelete={onDeletePatient}
      />

      {/* Pagination Controls */}
      {total > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 px-4 py-3 sm:px-6 flex items-center justify-between shadow-sm">
          <div className="text-xs text-slate-600">
            Showing <span className="font-semibold">{Math.min((page - 1) * limit + 1, total)}</span> to{' '}
            <span className="font-semibold">{Math.min(page * limit, total)}</span> of{' '}
            <span className="font-semibold">{total}</span> patients
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1 || isLoading}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-semibold text-slate-700 px-2">
              Page {page} of {pages}
            </span>

            <button
              type="button"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= pages || isLoading}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
