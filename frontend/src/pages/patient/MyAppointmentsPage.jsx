import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import appointmentService from '../../services/appointmentService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { SkeletonCard } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { formatDate, formatTime } from '../../lib/utils';
import {
  Calendar,
  Clock,
  User,
  CalendarPlus,
  AlertTriangle,
  Ban,
  FileText,
  CheckCircle2,
} from 'lucide-react';

export default function MyAppointmentsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'past'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchAppointments = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentService.getAppointmentsByPatient(user.id);
      setAppointments(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const handleOpenCancelModal = (apt) => {
    setCancelTarget(apt);
  };

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await appointmentService.cancelAppointment(cancelTarget.id);
      toast.success('Your appointment has been cancelled.');
      setCancelTarget(null);
      // Refresh list
      await fetchAppointments();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel appointment');
    } finally {
      setCancelling(false);
    }
  };

  // Filter into upcoming and past by slot time
  const now = new Date();
  const upcomingList = appointments
    .filter((a) => a.status === 'scheduled' && (!a.slot_start || new Date(a.slot_start) >= now))
    .sort((a, b) => new Date(a.slot_start) - new Date(b.slot_start));

  const pastList = appointments
    .filter((a) => a.status !== 'scheduled' || (a.slot_start && new Date(a.slot_start) < now))
    .sort((a, b) => new Date(b.slot_start) - new Date(a.slot_start));

  const displayedList = activeTab === 'upcoming' ? upcomingList : pastList;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">My Appointments</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review your consultations, manage upcoming appointments, and view clinical history.
          </p>
        </div>

        <Link to="/patient/book">
          <Button variant="primary" icon={CalendarPlus} size="md">
            Book New Appointment
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'upcoming'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Upcoming Appointments ({upcomingList.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('past')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'past'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Past & History ({pastList.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <SkeletonCard count={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchAppointments} />
      ) : displayedList.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={
            activeTab === 'upcoming'
              ? 'No upcoming appointments scheduled'
              : 'No past appointments on record'
          }
          description={
            activeTab === 'upcoming'
              ? 'You do not have any pending consultations. Would you like to schedule one?'
              : 'Completed and cancelled appointments will appear here.'
          }
          actionLabel={activeTab === 'upcoming' ? 'Book an Appointment' : null}
          onAction={activeTab === 'upcoming' ? () => navigate('/patient/book') : null}
        />
      ) : (
        <div className="space-y-4">
          {displayedList.map((apt) => (
            <Card key={apt.id} className="transition-all hover:border-slate-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Doctor and Date Details */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center font-bold text-base shrink-0">
                    <User className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-base font-bold text-slate-800">
                        {apt.doctor?.full_name || 'Medical Specialist'}
                      </h3>
                      <Badge variant={apt.status} size="sm">
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </Badge>
                    </div>

                    <p className="text-xs font-semibold text-teal-600">
                      {apt.doctor?.specialty || 'General Consultation'}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(apt.slot_start)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatTime(apt.slot_start)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 justify-end">
                  {apt.status === 'scheduled' && (
                    <Button
                      variant="dangerOutline"
                      size="sm"
                      icon={Ban}
                      onClick={() => handleOpenCancelModal(apt)}
                    >
                      Cancel Appointment
                    </Button>
                  )}
                  {apt.status === 'completed' && (
                    <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completed Visit
                    </span>
                  )}
                </div>
              </div>

              {/* Symptoms snippet */}
              {apt.symptoms && (
                <div className="mt-3.5 pt-3 border-t border-slate-100 text-xs text-slate-600 bg-slate-50/60 p-3 rounded-lg">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700 mb-1">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>Intake Notes & Symptoms:</span>
                  </div>
                  <p>{apt.symptoms}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        title="Confirm Appointment Cancellation"
      >
        {cancelTarget && (
          <div className="space-y-4">
            <div className="p-3 bg-red-50 rounded-lg border border-red-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs text-red-700">
                <p className="font-semibold">Are you sure you want to cancel this visit?</p>
                <p className="mt-0.5">
                  Your appointment with{' '}
                  <span className="font-bold">{cancelTarget.doctor?.full_name}</span> on{' '}
                  <span className="font-bold">{formatDate(cancelTarget.slot_start)}</span> at{' '}
                  <span className="font-bold">{formatTime(cancelTarget.slot_start)}</span> will be
                  released back into the available pool.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              You may book a different appointment time anytime from the booking portal.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCancelTarget(null)}
                disabled={cancelling}
              >
                Keep Appointment
              </Button>
              <Button
                variant="danger"
                size="sm"
                loading={cancelling}
                onClick={handleConfirmCancel}
              >
                Yes, Cancel Appointment
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
