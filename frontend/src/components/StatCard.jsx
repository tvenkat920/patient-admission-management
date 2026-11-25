import React from 'react';

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  colorVariant = 'blue',
  onClick
}) {
  const colorStyles = {
    navy: {
      bg: 'bg-primary/10',
      text: 'text-primary',
      border: 'border-primary/20',
      hover: 'hover:border-primary/40',
      badge: 'bg-primary/10 text-primary',
    },
    blue: {
      bg: 'bg-secondary/10',
      text: 'text-secondary',
      border: 'border-secondary/20',
      hover: 'hover:border-secondary/40',
      badge: 'bg-secondary/10 text-secondary',
    },
    green: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-600',
      border: 'border-emerald-500/20',
      hover: 'hover:border-emerald-500/40',
      badge: 'bg-emerald-50 text-emerald-700',
    },
    orange: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-600',
      border: 'border-amber-500/20',
      hover: 'hover:border-amber-500/40',
      badge: 'bg-amber-50 text-amber-700',
    },
  };

  const currentTheme = colorStyles[colorVariant] || colorStyles.blue;

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
      } ${currentTheme.hover}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase mb-1.5">
            {title}
          </p>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {value}
            </span>
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${currentTheme.bg}`}>
          <Icon className={`w-6 h-6 ${currentTheme.text}`} />
        </div>
      </div>
    </div>
  );
}
