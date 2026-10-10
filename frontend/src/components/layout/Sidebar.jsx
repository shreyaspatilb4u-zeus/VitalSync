import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarPlus,
  CalendarCheck,
  AlertOctagon,
  Users,
  Clock,
  CheckCircle2,
  CalendarRange,
  ShieldAlert,
  X,
  Stethoscope,
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

export default function Sidebar({ isOpen, onClose }) {
  const { role, user } = useAuth();

  // Navigation items by role
  const getNavItems = () => {
    if (role === 'patient') {
      return [
        { label: 'Dashboard', path: '/patient', icon: LayoutDashboard, end: true },
        { label: 'Book Appointment', path: '/patient/book', icon: CalendarPlus },
        { label: 'My Appointments', path: '/patient/appointments', icon: CalendarCheck },
        { label: 'Emergency', path: '/patient/emergency', icon: AlertOctagon, highlight: true },
      ];
    }
    if (role === 'doctor') {
      return [
        { label: 'Overview', path: '/doctor', icon: LayoutDashboard, end: true },
        { label: 'My Patients', path: '/doctor/patients', icon: Users },
        { label: 'Emergency Queue', path: '/doctor/emergency', icon: AlertOctagon, highlight: true },
        { label: 'Availability', path: '/doctor/availability', icon: Clock },
        { label: 'Attendance', path: '/doctor/attendance', icon: CheckCircle2 },
      ];
    }
    if (role === 'admin') {
      return [
        { label: 'Overview', path: '/admin', icon: LayoutDashboard, end: true },
        { label: 'Staff Directory', path: '/admin/staff', icon: Stethoscope },
        { label: 'Shift Scheduler', path: '/admin/shifts', icon: CalendarRange },
        { label: 'Attendance Manager', path: '/admin/attendance', icon: CheckCircle2 },
        { label: 'Emergency Log', path: '/admin/emergencies', icon: ShieldAlert },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-0 -translate-x-full md:translate-x-0'
        )}
      >
        {/* Header / Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
          <BrandLogo />
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Portal Identifier */}
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/60">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {role === 'patient' && 'Patient Portal'}
            {role === 'doctor' && 'Doctor Workspace'}
            {role === 'admin' && 'Hospital Administration'}
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    onClose();
                  }
                }}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group select-none',
                    isActive
                      ? item.highlight
                        ? 'bg-red-50 text-red-700 font-semibold border border-red-200'
                        : 'bg-teal-50 text-teal-700 font-semibold border border-teal-100'
                      : item.highlight
                      ? 'text-red-600 hover:bg-red-50/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )
                }
              >
                <Icon
                  className={cn(
                    'w-5 h-5 shrink-0 transition-colors',
                    item.highlight ? 'text-red-500' : 'text-slate-400 group-hover:text-slate-600'
                  )}
                />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Card at bottom of Sidebar */}
        {user && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 font-semibold flex items-center justify-center text-sm border border-teal-200 shrink-0">
                {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{user.full_name}</p>
                <p className="text-xs text-slate-500 truncate capitalize">
                  {user.specialty || user.role}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
