import React from 'react';
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  Building2, 
  Plus, 
  ArrowRight, 
  Activity, 
  PieChart, 
  ShieldCheck 
} from 'lucide-react';
import StatCard from '../components/StatCard';
import PatientTable from '../components/PatientTable';

export default function DashboardPage({
  stats,
  isLoading,
  onOpenAddModal,
  onViewAllPatients,
  onViewPatient,
  onEditPatient,
  onDischargePatient,
  onDeletePatient,
}) {
  const totalPatients = stats?.total_patients || 0;
  const admittedPatients = stats?.currently_admitted || 0;
  const dischargedPatients = stats?.discharged_patients || 0;
  const totalDepartments = stats?.total_departments || 6;
  const recentPatients = stats?.recent_patients || [];

  const wardBreakdown = stats?.ward_breakdown || {};
  const departmentBreakdown = stats?.department_breakdown || {};

  return (
    <div className="space-y-6">
      {/* Welcome Banner with Quick Add */}
      <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-blue-100 mb-3 backdrop-blur-sm">
            <Activity className="w-3.5 h-3.5 text-blue-200" />
            <span>Hospital Operations Center</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Patient Admission Management
          </h2>
          <p className="mt-2 text-sm text-blue-100/90 leading-relaxed">
            Monitor real-time patient admissions, bed occupancy, department distribution, and discharge lifecycles across all hospital wards.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white text-primary hover:bg-blue-50 text-xs sm:text-sm font-bold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-white/40 active:scale-95"
            >
              <Plus className="w-4 h-4 text-primary" />
              <span>Register New Patient</span>
            </button>

            <button
              type="button"
              onClick={() => onViewAllPatients('All')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition-all backdrop-blur-sm"
            >
              <span>View All Records</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-8 -bottom-12 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Patients"
          value={totalPatients}
          subtitle="Cumulative admissions"
          icon={Users}
          colorVariant="navy"
          onClick={() => onViewAllPatients('All')}
        />
        <StatCard
          title="Currently Admitted"
          value={admittedPatients}
          subtitle="Active hospital beds"
          icon={UserCheck}
          colorVariant="green"
          onClick={() => onViewAllPatients('Admitted')}
        />
        <StatCard
          title="Discharged Patients"
          value={dischargedPatients}
          subtitle="Successfully discharged"
          icon={UserMinus}
          colorVariant="blue"
          onClick={() => onViewAllPatients('Discharged')}
        />
        <StatCard
          title="Total Departments"
          value={totalDepartments}
          subtitle="Operational medical units"
          icon={Building2}
          colorVariant="orange"
        />
      </div>

      {/* Patient Admission Overview Section (Ward & Department Breakdowns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ward Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Ward Occupancy Distribution
              </h3>
              <p className="text-xs text-slate-500">
                Patient count across hospital wards
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
              5 Wards
            </span>
          </div>

          <div className="space-y-3">
            {Object.entries(wardBreakdown).map(([wardName, count]) => {
              const percentage = totalPatients > 0 ? Math.round((count / totalPatients) * 100) : 0;
              return (
                <div key={wardName} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{wardName}</span>
                    <span className="font-semibold text-slate-900">
                      {count} <span className="text-slate-400 font-normal">({percentage}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-secondary rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Department Patient Load
              </h3>
              <p className="text-xs text-slate-500">
                Patient distribution by medical specialty
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
              6 Specialties
            </span>
          </div>

          <div className="space-y-3">
            {Object.entries(departmentBreakdown).map(([deptName, count]) => {
              const percentage = totalPatients > 0 ? Math.round((count / totalPatients) * 100) : 0;
              return (
                <div key={deptName} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{deptName}</span>
                    <span className="font-semibold text-slate-900">
                      {count} <span className="text-slate-400 font-normal">({percentage}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-light rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Patients Table Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Recent Patient Admissions
            </h3>
            <p className="text-xs text-slate-500">
              Latest patient admissions stored in the hospital database
            </p>
          </div>

          <button
            type="button"
            onClick={() => onViewAllPatients('All')}
            className="text-xs font-semibold text-secondary hover:text-secondary-dark flex items-center space-x-1 hover:underline"
          >
            <span>View All Patients</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <PatientTable
          patients={recentPatients}
          isLoading={isLoading}
          onView={onViewPatient}
          onEdit={onEditPatient}
          onDischarge={onDischargePatient}
          onDelete={onDeletePatient}
        />
      </div>
    </div>
  );
}
