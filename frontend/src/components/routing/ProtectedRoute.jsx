import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * ARCHITECTURE & SECURITY NOTICE:
 * Client-side route guards (ProtectedRoute & RoleRoute) provide UX convenience,
 * optimistic screen gating, and smooth redirect transitions only.
 * They DO NOT provide cryptographic or authoritative security boundaries.
 * Authoritative security and access control MUST always be enforced at the database
 * and API layer using Supabase Row Level Security (RLS) policies and verified JWT claims.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          <p className="text-sm font-medium text-slate-500">Checking credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
