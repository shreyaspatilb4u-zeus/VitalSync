import React from 'react';
import Button from '../common/Button';
import { UserCheck, Stethoscope, ShieldCheck } from 'lucide-react';
import { config } from '../../lib/config';

/**
 * =======================================================================
 * PROTOTYPE DEMO LOGIN COMPONENT
 * =======================================================================
 * ARCHITECTURE & SECURITY NOTICE:
 * This component provides one-click mock role access solely for evaluator
 * and prototype demonstration purposes. It connects exclusively to the
 * in-memory mock profile dataset and DOES NOT execute calls against any
 * production authentication endpoint or database.
 *
 * Controlled by VITE_ENABLE_DEMO_LOGIN in environment configuration.
 *
 * PRODUCTION REMOVAL CHECKLIST:
 * When migrating VitalSync to live Supabase Auth, DELETE this file and
 * remove its import and invocation from LoginPage.jsx.
 * =======================================================================
 */
export default function DemoLoginSection({ onDemoLogin, loading, disabled }) {
  if (!config.enableDemoLogin) {
    return null;
  }

  return (
    <div className="mt-8 pt-6 border-t border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
          Demo Testing Only
        </span>
        <span className="text-[11px] text-slate-400">One-click role access</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="text-xs h-9"
          icon={UserCheck}
          loading={loading === 'patient'}
          disabled={disabled || !!loading}
          onClick={() => onDemoLogin('patient')}
        >
          Patient
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="text-xs h-9"
          icon={Stethoscope}
          loading={loading === 'doctor'}
          disabled={disabled || !!loading}
          onClick={() => onDemoLogin('doctor')}
        >
          Doctor
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="text-xs h-9"
          icon={ShieldCheck}
          loading={loading === 'admin'}
          disabled={disabled || !!loading}
          onClick={() => onDemoLogin('admin')}
        >
          Admin
        </Button>
      </div>
      <p className="mt-2 text-[10px] text-slate-400 text-center">
        Easily toggle between Patient, Doctor, and Admin roles for project evaluation.
      </p>
    </div>
  );
}
