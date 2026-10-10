import React from 'react';
import { cn } from '../../lib/utils';

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
}) {
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-medium px-2.5 py-1',
    lg: 'text-sm font-medium px-3 py-1.5',
  };

  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
    primary: 'bg-teal-50 text-teal-700 border border-teal-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
    info: 'bg-sky-50 text-sky-700 border border-sky-200',

    // Role specific
    patient: 'bg-teal-50 text-teal-800 border border-teal-200',
    doctor: 'bg-blue-50 text-blue-800 border border-blue-200',
    admin: 'bg-purple-50 text-purple-800 border border-purple-200',

    // Appointment status
    scheduled: 'bg-teal-50 text-teal-700 border border-teal-200',
    completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    cancelled: 'bg-slate-100 text-slate-600 border border-slate-200',

    // Emergency severity
    critical: 'bg-red-100 text-red-800 border border-red-300 font-semibold',
    high: 'bg-orange-100 text-orange-800 border border-orange-200',
    moderate: 'bg-amber-50 text-amber-800 border border-amber-200',

    // Emergency status
    pending: 'bg-amber-50 text-amber-800 border border-amber-200',
    acknowledged: 'bg-blue-50 text-blue-800 border border-blue-200',
    resolved: 'bg-emerald-50 text-emerald-800 border border-emerald-200',

    // Attendance status
    present: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    absent: 'bg-red-50 text-red-700 border border-red-200',
    on_leave: 'bg-amber-50 text-amber-700 border border-amber-200',
  };

  const dotColor = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    moderate: 'bg-amber-500',
    present: 'bg-emerald-500',
    absent: 'bg-red-500',
    on_leave: 'bg-amber-500',
    scheduled: 'bg-teal-500',
    completed: 'bg-emerald-500',
    cancelled: 'bg-slate-400',
  }[variant] || 'bg-current';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full select-none',
        sizeStyles[size],
        variantStyles[variant] || variantStyles.default,
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dotColor)} />}
      {children}
    </span>
  );
}
