import React, { useState, useEffect } from 'react';
import emergencyService from '../../services/emergencyService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { SkeletonTable } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { formatDateTime } from '../../lib/utils';
import {
  ShieldAlert,
  Clock,
  RotateCw,
  Lock,
  AlertOctagon,
  ShieldCheck,
} from 'lucide-react';

export default function AdminEmergenciesPage() {
  const [emergencies, setEmergencies] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmergencies = async () => {
    setLoading(true);
    setError(null);
    try {
      // Calls privacy-enforced admin log (never returns clinical symptoms or medical records)
      const data = await emergencyService.getAdminEmergencyLog();
      setEmergencies(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch emergency log');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergencies();
  }, []);

  const filteredEmergencies = emergencies.filter((item) => {
    const matchesStatus = statusFilter === 'all' ? true : item.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' ? true : item.severity === severityFilter;
    return matchesStatus && matchesSeverity;
  });

  const pendingCount = emergencies.filter((e) => e.status === 'pending').length;
  const criticalCount = emergencies.filter((e) => e.severity === 'critical').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Hospital Emergency Operations Log
            </h1>
            <span className="p-1 rounded bg-red-100 text-red-700">
              <AlertOctagon className="w-5 h-5" />
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time logistical monitoring of incoming triage requests and operational response status.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={RotateCw}
          onClick={fetchEmergencies}
          loading={loading}
        >
          Refresh Log
        </Button>
      </div>

      {/* PRIVACY BY DESIGN MANDATORY NOTICE */}
      <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 flex items-start gap-3 shadow-xs">
        <Lock className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <p className="font-bold text-purple-800">
            Privacy by Design: Protected Health Information (PHI) Shielded
          </p>
          <p className="text-purple-700 leading-relaxed">
            In compliance with patient confidentiality and hospital governance regulations, symptom
            descriptions and clinical medical records are strictly restricted to licensed attending
            physicians and are hidden from administrative views.
          </p>
        </div>
      </div>

      {/* Operational Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-red-700">
            Critical Cases Total
          </p>
          <p className="text-2xl font-extrabold mt-1">{criticalCount}</p>
          <p className="text-xs text-red-600 mt-0.5">Level 1 Emergency Triage</p>
        </div>

        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            Pending Acknowledgment
          </p>
          <p className="text-2xl font-extrabold mt-1">{pendingCount}</p>
          <p className="text-xs text-amber-600 mt-0.5">Awaiting physician response</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            All Logged Requests
          </p>
          <p className="text-2xl font-extrabold mt-1">{emergencies.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Total recorded emergency admissions</p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Status Filter */}
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold text-slate-500 mr-1">Status:</span>
          {['all', 'pending', 'acknowledged', 'resolved'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1 sm:ml-4">
          <span className="text-xs font-bold text-slate-500 mr-1">Severity:</span>
          {['all', 'critical', 'high', 'moderate'].map((sev) => (
            <button
              key={sev}
              type="button"
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize transition-all ${
                severityFilter === sev
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Log Table */}
      {loading ? (
        <SkeletonTable rows={5} cols={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchEmergencies} />
      ) : filteredEmergencies.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No emergency records matching filters"
          description="Try resetting your status and severity filters."
        />
      ) : (
        <Card padding="none" className="overflow-hidden border-slate-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Request ID</th>
                  <th className="py-3.5 px-5">Patient Name</th>
                  <th className="py-3.5 px-5">Triage Severity</th>
                  <th className="py-3.5 px-5">Operational Status</th>
                  <th className="py-3.5 px-5 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredEmergencies.map((emg) => (
                  <tr key={emg.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-5 font-mono font-bold text-slate-700">
                      {emg.id}
                    </td>

                    <td className="py-4 px-5 font-bold text-slate-800">
                      {emg.patient_name}
                    </td>

                    <td className="py-4 px-5">
                      <Badge variant={emg.severity} size="sm">
                        {emg.severity.toUpperCase()}
                      </Badge>
                    </td>

                    <td className="py-4 px-5">
                      <Badge variant={emg.status} size="sm" dot>
                        {emg.status.toUpperCase()}
                      </Badge>
                    </td>

                    <td className="py-4 px-5 text-right text-slate-500">
                      <div className="flex items-center justify-end gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDateTime(emg.created_at)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
