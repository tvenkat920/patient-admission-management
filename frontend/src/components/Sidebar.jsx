import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  UserMinus, 
  HeartPulse, 
  X,
  Building2,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  patientFilterStatus,
  setPatientFilterStatus,
  isOpen, 
  onClose 
}) {
  const handleNavClick = (tab, statusFilter = 'All') => {
    setCurrentTab(tab);
    if (tab === 'patients') {
      setPatientFilterStatus(statusFilter);
    }
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      active: currentTab === 'dashboard',
      onClick: () => handleNavClick('dashboard'),
    },
    {
      id: 'patients-all',
      label: 'All Patients',
      icon: Users,
      active: currentTab === 'patients' && patientFilterStatus === 'All',
      onClick: () => handleNavClick('patients', 'All'),
    },
    {
      id: 'patients-admitted',
      label: 'Admitted Patients',
      icon: UserCheck,
      active: currentTab === 'patients' && patientFilterStatus === 'Admitted',
      onClick: () => handleNavClick('patients', 'Admitted'),
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'patients-discharged',
      label: 'Discharged Patients',
      icon: UserMinus,
      active: currentTab === 'patients' && patientFilterStatus === 'Discharged',
      onClick: () => handleNavClick('patients', 'Discharged'),
      badgeColor: 'bg-blue-100 text-blue-800',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-primary text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-xl lg:shadow-none`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-primary-light/40">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shadow-md">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-base tracking-wide text-white block leading-tight">
                MediCare
              </span>
              <span className="text-[10px] text-blue-200 tracking-wider uppercase font-semibold">
                Patient Management
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-primary-light lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          <div>
            <div className="text-[11px] font-semibold text-blue-300 uppercase tracking-wider px-3 mb-2">
              Main Menu
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      item.active
                        ? 'bg-secondary text-white font-semibold shadow-sm'
                        : 'text-slate-200 hover:bg-primary-light/40 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${item.active ? 'text-white' : 'text-blue-300'}`} />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Info Box */}
          <div className="bg-primary-dark/60 rounded-xl p-4 border border-blue-900/50">
            <div className="flex items-center space-x-2 text-blue-300 text-xs font-semibold mb-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>DScribe Health</span>
            </div>
            <p className="text-xs text-blue-100/80 leading-relaxed">
              Standardized hospital administration system for patient records and admission tracking.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-primary-light/40 text-[11px] text-blue-300 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>v1.0.0 Production</span>
          </div>
          <span className="text-blue-400">DScribe Intern</span>
        </div>
      </aside>
    </>
  );
}
