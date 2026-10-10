import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import appointmentService from '../../services/appointmentService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { SkeletonCard } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { formatDate, formatTime } from '../../lib/utils';
import {
  CalendarPlus,
  AlertOctagon,
  Calendar,
  Clock,
  User,
  ArrowRight,
  CheckCircle,
  Activity,
  HeartPulse,
} from 'lucide-react';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [upcomingApt, setUpcomingApt] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [next, all] = await Promise.all([
        appointmentService.getNextUpcomingAppointment(user.id),
        appointmentService.getAppointmentsByPatient(user.id),
      ]);
      setUpcomingApt(next);
      // Grab 4 most recent appointments
      setRecentAppointments(all.slice(0, 4));
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            {getTimeGreeting()},{' '}
            <span className="text-teal-600">{user?.full_name?.split(' ')[0] || 'Patient'}</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome to your VitalSync patient portal. Manage consultations and access urgent care.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3">
          <Link to="/patient/book">
            <Button variant="primary" icon={CalendarPlus} size="md">
              Book Appointment
            </Button>
          </Link>
          <Link to="/patient/emergency">
            <Button variant="danger" icon={AlertOctagon} size="md">
              Report Emergency
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SkeletonCard count={1} />
          </div>
          <div>
            <SkeletonCard count={1} />
          </div>
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchDashboardData} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Next Appointment + Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Next Upcoming Appointment Highlight */}
            <Card className="border-teal-100 bg-gradient-to-br from-white to-teal-50/20 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-teal-50 text-teal-600 border border-teal-200">
                    <HeartPulse className="w-5 h-5" />
                  </span>
                  <h2 className="text-base font-semibold text-slate-800">Next Scheduled Visit</h2>
                </div>
                {upcomingApt && (
                  <Badge variant="scheduled" size="sm" dot>
                    Confirmed
                  </Badge>
                )}
              </div>

              {upcomingApt ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-white border border-slate-200">
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Attending Physician
                      </p>
                      <p className="text-base font-bold text-slate-800 mt-0.5">
                        {upcomingApt.doctor?.full_name}
                      </p>
                      <p className="text-xs text-teal-600 font-medium">
                        {upcomingApt.doctor?.specialty}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Date & Time
                      </p>
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 mt-1">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{formatDate(upcomingApt.slot_start)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatTime(upcomingApt.slot_start)}</span>
                      </div>
                    </div>
                  </div>

                  {upcomingApt.symptoms && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="font-semibold text-slate-700">Reported Symptoms: </span>
                      {upcomingApt.symptoms}
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <Link to="/patient/appointments">
                      <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
                        Manage in My Appointments
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-sm text-slate-500 mb-3">
                    You have no upcoming appointments scheduled at this time.
                  </p>
                  <Link to="/patient/book">
                    <Button variant="primary" size="sm" icon={CalendarPlus}>
                      Schedule Your Next Visit
                    </Button>
                  </Link>
                </div>
              )}
            </Card>

            {/* Recent Appointments List */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-slate-800">Recent Appointments</h3>
                <Link
                  to="/patient/appointments"
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {recentAppointments.length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  title="No appointment history"
                  description="Your past and scheduled visits will be listed here."
                />
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {apt.doctor?.full_name || 'Assigned Physician'}
                          </p>
                          <p className="text-xs text-slate-500">
                            {apt.doctor?.specialty} • {formatDate(apt.slot_start)} at{' '}
                            {formatTime(apt.slot_start)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pl-12 sm:pl-0">
                        <Badge variant={apt.status} size="sm">
                          {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right Column: Health Guidance & Quick Stats */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <Card>
              <h3 className="text-base font-semibold text-slate-800 mb-3">Quick Navigation</h3>
              <div className="space-y-2.5">
                <Link
                  to="/patient/book"
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-teal-200 hover:bg-teal-50/40 transition-all text-sm font-medium text-slate-700 group"
                >
                  <div className="flex items-center gap-2.5">
                    <CalendarPlus className="w-4 h-4 text-teal-600" />
                    <span>Book a Consultation</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
                </Link>

                <Link
                  to="/patient/appointments"
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-teal-200 hover:bg-teal-50/40 transition-all text-sm font-medium text-slate-700 group"
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    <span>View Appointments</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
                </Link>

                <Link
                  to="/patient/emergency"
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-red-200 bg-red-50/20 hover:bg-red-50 hover:border-red-300 transition-all text-sm font-medium text-red-700 group"
                >
                  <div className="flex items-center gap-2.5">
                    <AlertOctagon className="w-4 h-4 text-red-600" />
                    <span>Emergency Triage</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-red-400 group-hover:text-red-600 transition-colors" />
                </Link>
              </div>
            </Card>

            {/* Medical Care Notice Card */}
            <Card className="bg-slate-50 border-slate-200">
              <div className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-600 space-y-1.5">
                  <p className="font-semibold text-slate-800">VitalSync Patient Notice</p>
                  <p>
                    Appointment bookings guarantee dedicated physician consultation times.
                    Please arrive 10 minutes prior to your scheduled time or join the virtual clinic link.
                  </p>
                  <p className="text-slate-500 pt-1 border-t border-slate-200">
                    Need emergency attention? Use the dedicated triage service or contact 911 immediately.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
