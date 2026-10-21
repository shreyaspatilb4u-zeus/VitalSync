import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuth } from '../../context/AuthContext';
import { FlaskConical } from 'lucide-react';

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDemo } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0 transition-all">
        <Topbar onMenuClick={() => setMobileMenuOpen(true)} />

        {/* Small Demo Mode Banner */}
        {isDemo && (
          <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-1.5 text-center text-xs font-medium text-amber-800 flex items-center justify-center gap-2">
            <FlaskConical className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="font-semibold">Demo mode: sample data</span>
            <span className="hidden sm:inline text-amber-600/80">• Changes are stored in-memory only</span>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
