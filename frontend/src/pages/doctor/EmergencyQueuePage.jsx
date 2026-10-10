import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import emergencyService from '../../services/emergencyService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { SkeletonCard } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { formatDateTime } from '../../lib/utils';
import {
  AlertOctagon,
  Clock,
  CheckCircle,
  Check,
  ShieldCheck,
  RotateCw,
  AlertTriangle,
  User,
} from 'lucide-react';

export default function EmergencyQueuePage() {
  const { user } = useAuth();
  const toast = useToast();

  const [queue, setQueue] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'acknowledged' | 'resolved'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchQueue = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await emergencyService.getEmergencyQueue();
      setQueue(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch emergency queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await emergencyService.updateEmergencyStatus(id, newStatus);
      toast.success(`Emergency request #${id} marked as ${newStatus}`);
      await fetchQueue();
    } catch (err) {
      toast.error(err.message || 'Failed to update request');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredQueue =
    filter === 'all' ? queue : queue.filter((item) => item.status === filter);

  const pendingCount = queue.filter((i) => i.status === 'pending').length;
  const criticalCount = queue.filter(
    (i) => i.severity === 'critical' && i.status !== 'resolved'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Emergency Clinical Triage Queue
            </h1>
            <span className="p-1 rounded bg-red-100 text-red-700">
              <AlertOctagon className="w-5 h-5" />
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Ordered strictly by severity (Critical &gt; High &gt; Moderate) and presentation timestamp.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={RotateCw}
          onClick={fetchQueue}
          loading={loading}
        >
          Refresh Queue
        </Button>
      </div>

      {/* Triage Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-red-700">
            Critical Unresolved
          </p>
          <p className="text-2xl font-extrabold mt-1">{criticalCount}</p>
          <p className="text-xs text-red-600 mt-0.5">Highest triage priority</p>
        </div>

        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            Pending Acknowledgment
          </p>
          <p className="text-2xl font-extrabold mt-1">{pendingCount}</p>
          <p className="text-xs text-amber-600 mt-0.5">Awaiting initial clinician review</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total In Queue
          </p>
          <p className="text-2xl font-extrabold mt-1">{queue.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">All tracked emergency entries</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {['all', 'pending', 'acknowledged', 'resolved'].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
              filter === f
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {f === 'all' ? 'All Requests' : f}
          </button>
        ))}
      </div>

      {/* Queue Content */}
      {loading ? (
        <SkeletonCard count={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchQueue} />
      ) : filteredQueue.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="Emergency queue is clear"
          description="There are currently no active emergency requests matching this filter."
        />
      ) : (
        <div className="space-y-4">
          {filteredQueue.map((item, index) => {
            const isCritical = item.severity === 'critical';
            return (
              <Card
                key={item.id}
                className={`transition-all ${
                  isCritical && item.status !== 'resolved'
                    ? 'border-red-300 ring-1 ring-red-200 bg-red-50/15'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left: Patient, Severity, and Time */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        #{index + 1}
                      </span>
                      <h3 className="text-base font-bold text-slate-800">
                        {item.patient_name || 'Patient'}
                      </h3>
                      <Badge variant={item.severity} size="sm">
                        {item.severity.toUpperCase()}
                      </Badge>
                      <Badge variant={item.status} size="sm" dot>
                        {item.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Reported: {formatDateTime(item.created_at)}</span>
                    </div>

                    {/* Description */}
                    <div className="pt-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                      <span className="font-semibold text-slate-800 block mb-1">
                        Reported Symptoms / Situation:
                      </span>
                      {item.description}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    {item.status === 'pending' && (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={Check}
                        loading={updatingId === item.id}
                        onClick={() => handleUpdateStatus(item.id, 'acknowledged')}
                      >
                        Acknowledge
                      </Button>
                    )}

                    {item.status !== 'resolved' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={CheckCircle}
                        className="hover:border-emerald-500 hover:text-emerald-700"
                        loading={updatingId === item.id}
                        onClick={() => handleUpdateStatus(item.id, 'resolved')}
                      >
                        Resolve Case
                      </Button>
                    )}

                    {item.status === 'resolved' && (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Resolved
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
