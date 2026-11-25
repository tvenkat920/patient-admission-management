import React from 'react';
import { Menu, Calendar, Bell, Plus, Activity } from 'lucide-react';

export default function Navbar({ 
  pageTitle, 
  breadcrumb, 
  onToggleSidebar, 
  onOpenAddModal 
}) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left: Mobile hamburger & Page Title / Breadcrumbs */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center space-x-2 text-xs font-medium text-slate-400">
              <span>Hospital OS</span>
              <span>/</span>
              <span className="text-secondary">{breadcrumb || pageTitle}</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-primary tracking-tight">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Right: Date, Live Pulse & Quick Action */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* Current Date Badge */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-surface border border-slate-200 text-xs font-medium text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-secondary" />
            <span>{currentDate}</span>
          </div>

          {/* System Status indicator */}
          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live System</span>
          </div>

          {/* Quick Add Patient button */}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Add Patient</span>
          </button>
        </div>
      </div>
    </header>
  );
}
