import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * ARCHITECTURE & SECURITY NOTICE:
 * Client-side route guards (ProtectedRoute & RoleRoute) provide UX convenience,
 * optimistic screen gating, and clean navigation boundaries only.
 * They DO NOT provide cryptographic or authoritative security boundaries.
 * In production with Supabase connected, real authorization and data protection
 * MUST always be enforced at the database layer through Row Level Security (RLS)
 * policies tied to auth.uid() and validated role claims.
 */
export default function RoleRoute({ allowedRole, children }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          <p className="text-sm font-medium text-slate-500">Verifying authorization...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role !== allowedRole) {
    // Redirect wrong-role user to their authorized home workspace
    const homePaths = {
      patient: '/patient',
      doctor: '/doctor',
      admin: '/admin',
    };
    return <Navigate to={homePaths[role] || '/login'} replace />;
  }

  return children;
}
