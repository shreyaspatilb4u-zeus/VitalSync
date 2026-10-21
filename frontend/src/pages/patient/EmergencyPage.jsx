import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import emergencyService from '../../services/emergencyService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { SkeletonCard } from '../../components/common/LoadingSkeleton';
import { formatDateTime } from '../../lib/utils';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import {
  AlertOctagon,
  PhoneCall,
  ShieldAlert,
  Clock,
  CheckCircle,
  AlertTriangle,
  RotateCw,
  Send,
  HelpCircle,
  History,
} from 'lucide-react';

export default function EmergencyPage() {
  const { user } = useAuth();
  const toast = useToast();

  const [activeRequest, setActiveRequest] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('high');
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchEmergencyData = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [active, list] = await Promise.all([
        emergencyService.getActiveRequestForPatient(user.id),
        emergencyService.getPatientEmergencyRequests(user.id),
      ]);
      setActiveRequest(active);
      setHistory(list || []);
    } catch (err) {
      setError(err.message || 'Failed to load emergency status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergencyData();
  }, [user]);

  /**
   * Client-side UX validation for triage intake.
   * NOTE: Client-side validation is for UX and hygiene only.
   * Real authoritative triage validation and rate-limiting must happen on the server/database.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedDesc = description.trim();
    if (!trimmedDesc) {
      setFormError('Please describe the urgent medical situation.');
      return;
    }
    if (trimmedDesc.length > 1000) {
      setFormError('Emergency description cannot exceed 1000 characters.');
      return;
    }
    if (!confirmed) {
      setFormError('Please verify the emergency confirmation checkbox before submitting.');
      return;
    }

    setSubmitting(true);
    setFormError('');
    try {
      const newReq = await emergencyService.createEmergencyRequest({
        patient_id: user.id,
        description: description.trim(),
        severity,
      });

      toast.success('Emergency triage request submitted to hospital desk.');
      // Refetch active emergency and patient history
      await fetchEmergencyData();
      setDescription('');
      setConfirmed(false);
    } catch (err) {
      setFormError(err.message || 'Failed to submit emergency request.');
      toast.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const pastRequests = history.filter((h) => !activeRequest || h.id !== activeRequest.id);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Prominent Red Disclaimer Alert */}
      <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-3.5 shadow-sm">
        <div className="p-2 rounded-lg bg-red-100 text-red-700 shrink-0 mt-0.5">
          <PhoneCall className="w-5 h-5 animate-pulse" />
        </div>
        <div className="text-xs space-y-1">
          <h2 className="text-sm font-bold text-red-800">
            Immediate Life-Threatening Emergency Notice
          </h2>
          <p className="text-red-700 leading-relaxed">
            For acute life-threatening situations (e.g. cardiac arrest, severe respiratory failure, unconsciousness, severe hemorrhaging),{' '}
            <strong className="font-bold underline">call your local emergency number (911 / 112 / 108) immediately</strong>.
            This portal alerts hospital clinical teams and reserves your triage queue position upon arrival.
          </p>
        </div>
      </div>

      {loading ? (
        <SkeletonCard count={1} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchEmergencyData} />
      ) : activeRequest ? (
        /* ================= ACTIVE EMERGENCY STATUS CARD ================= */
        <Card className="border-red-200 bg-white shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-red-100 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-red-100 text-red-700">
                <AlertOctagon className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Active Emergency Request</h3>
                <p className="text-xs text-slate-500">
                  Request ID: <span className="font-mono">{activeRequest.id}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={activeRequest.severity} size="md">
                {activeRequest.severity.toUpperCase()} SEVERITY
              </Badge>
              <Badge variant={activeRequest.status} size="md" dot>
                {activeRequest.status.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Queue Position Highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Current Triage Queue Position
              </p>
              <p className="text-3xl font-extrabold text-teal-600 mt-1">
                #{activeRequest.queue_position || 1}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Priority order based on clinical severity triage
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Submitted At
              </p>
              <p className="text-sm font-bold text-slate-800 mt-2">
                {formatDateTime(activeRequest.created_at)}
              </p>
              <p className="text-xs text-teal-700 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Monitoring live hospital response</span>
              </p>
            </div>
          </div>

          {/* Clinical Description */}
          <div className="space-y-1 text-xs">
            <span className="font-semibold text-slate-700">Reported Symptoms / Situation:</span>
            <p className="p-3 bg-slate-50 rounded-lg text-slate-800 border border-slate-200">
              {activeRequest.description}
            </p>
          </div>

          {/* Action Step Bar */}
          <div className="p-4 rounded-xl bg-red-50/50 border border-red-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <RotateCw className="w-4 h-4 text-teal-600 animate-spin" />
              <span>Attending clinical triage team has been notified.</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={RotateCw}
              onClick={fetchEmergencyData}
            >
              Refresh Status
            </Button>
          </div>
        </Card>
      ) : (
        /* ================= EMERGENCY SUBMISSION FORM ================= */
        <Card className="border-red-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <span>Report Urgent Emergency Request</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Notify the on-duty emergency physicians immediately.
            </p>
          </div>

          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Severity Level Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Triage Severity Classification
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Critical */}
                <label
                  className={`p-3.5 rounded-xl border cursor-pointer flex flex-col gap-1 transition-all ${
                    severity === 'critical'
                      ? 'border-red-600 bg-red-50/80 shadow-xs ring-1 ring-red-500'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="severity"
                    value="critical"
                    checked={severity === 'critical'}
                    onChange={() => setSeverity('critical')}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-700">Critical</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Acute chest pain, severe asphyxia, loss of consciousness.
                  </p>
                </label>

                {/* High */}
                <label
                  className={`p-3.5 rounded-xl border cursor-pointer flex flex-col gap-1 transition-all ${
                    severity === 'high'
                      ? 'border-orange-500 bg-orange-50/70 shadow-xs ring-1 ring-orange-400'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="severity"
                    value="high"
                    checked={severity === 'high'}
                    onChange={() => setSeverity('high')}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-700">High</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Severe hemorrhage, high fever with altered state, trauma.
                  </p>
                </label>

                {/* Moderate */}
                <label
                  className={`p-3.5 rounded-xl border cursor-pointer flex flex-col gap-1 transition-all ${
                    severity === 'moderate'
                      ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-1 ring-amber-400'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="severity"
                    value="moderate"
                    checked={severity === 'moderate'}
                    onChange={() => setSeverity('moderate')}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-700">Moderate</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Suspected bone fracture, persistent acute discomfort.
                  </p>
                </label>
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <label htmlFor="emergencyDesc" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Describe Current Condition & Symptoms
              </label>
              <textarea
                id="emergencyDesc"
                rows={4}
                maxLength={1000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="State the patient's symptoms, consciousness level, current vital status, and any administered first aid..."
                className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Confirmation Checkbox */}
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <input
                id="emergencyConfirm"
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
              />
              <label htmlFor="emergencyConfirm" className="text-xs text-slate-700 cursor-pointer">
                I understand this request is for clinical triage prioritization and that immediate
                life-threatening crises require emergency dispatch (911).
              </label>
            </div>

            {/* Big Submit Button */}
            <Button
              type="submit"
              variant="danger"
              size="lg"
              className="w-full h-12 text-base font-bold shadow-md gap-2"
              loading={submitting}
              icon={Send}
            >
              Send Emergency Request
            </Button>
          </form>
        </Card>
      )}

      {/* Past Emergency Submissions History */}
      {pastRequests.length > 0 && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-500" />
              <span>Past Emergency Triage Submissions</span>
            </h4>
            <span className="text-xs text-slate-400 font-medium">
              {pastRequests.length} record{pastRequests.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {pastRequests.map((req) => (
              <div key={req.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 first:pt-0 last:pb-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={req.severity} size="sm">
                      {req.severity.toUpperCase()}
                    </Badge>
                    <Badge variant={req.status} size="sm" dot>
                      {req.status.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-slate-400 font-mono">#{req.id.slice(0, 8)}</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {req.description}
                  </p>
                </div>
                <div className="text-xs text-slate-400 shrink-0 flex items-center gap-1 sm:self-center">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatDateTime(req.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
