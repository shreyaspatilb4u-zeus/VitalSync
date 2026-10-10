import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import appointmentService from '../../services/appointmentService';
import doctorService from '../../services/doctorService';
import emergencyService from '../../services/emergencyService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { SkeletonCard, SkeletonTable } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { formatDate, formatTime } from '../../lib/utils';
import {
  Calendar,
  Users,
  AlertOctagon,
  Clock,
  ArrowRight,
  CheckCircle2,
  Stethoscope,
  Activity,
  UserCheck,
} from 'lucide-react';

export default function DoctorDashboard() {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [patientCount, setPatientCount] = useState(0);
  const [pendingEmergencies, setPendingEmergencies] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState('present');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDoctorOverview = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [apts, patients, emergencies, att] = await Promise.all([
        appointmentService.getAppointmentsByDoctor(user.id),
        doctorService.getAssignedPatients(user.id),
        emergencyService.getEmergencyQueue(),
        doctorService.getDoctorTodayAttendance(user.id),
      ]);

      setAppointments(apts);
      setPatientCount(patients.length);
      // Filter pending emergencies
      const pending = emergencies.filter((e) => e.status === 'pending');
      setPendingEmergencies(pending);
      setTodayAttendance(att);
    } catch (err) {
      setError(err.message || 'Failed to load doctor overview.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorOverview();
  }, [user]);

  // Today's appointments (or upcoming scheduled)
  const scheduledApts = appointments.filter((a) => a.status === 'scheduled');

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            Welcome, <span className="text-teal-600">{user?.full_name}</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Clinical Overview • {user?.specialty || 'Medical Specialist'} • VitalSync Care Command
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/doctor/patients">
            <Button variant="secondary" size="md" icon={Users}>
              My Patients
            </Button>
          </Link>
          <Link to="/doctor/emergency">
            <Button variant="danger" size="md" icon={AlertOctagon}>
              Emergency Queue ({pendingEmergencies.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* PENDING EMERGENCY BANNER */}
      {pendingEmergencies.length > 0 && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-red-900 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-red-100 text-red-700 shrink-0">
              <AlertOctagon className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <p className="text-sm font-bold text-red-800">
                {pendingEmergencies.length} Pending Emergency Triage{' '}
                {pendingEmergencies.length === 1 ? 'Request' : 'Requests'}
              </p>
              <p className="text-xs text-red-700">
                Immediate patient cases require physician acknowledgment and triage review.
              </p>
            </div>
          </div>
          <Link to="/doctor/emergency">
            <Button variant="danger" size="sm" icon={ArrowRight} iconPosition="right">
              Review Queue Now
            </Button>
          </Link>
        </div>
      )}

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="border-teal-100 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Scheduled Consultations
              </p>
              <p className="text-3xl font-extrabold text-slate-800 mt-1">
                {scheduledApts.length}
              </p>
              <p className="text-xs text-teal-600 mt-1">Active upcoming visits</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-blue-100 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Assigned Patients
              </p>
              <p className="text-3xl font-extrabold text-slate-800 mt-1">{patientCount}</p>
              <p className="text-xs text-blue-600 mt-1">Longitudinal care roster</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Today's Duty Status
              </p>
              <div className="mt-1">
                <Badge variant={todayAttendance} size="lg" dot>
                  {todayAttendance.toUpperCase()}
                </Badge>
              </div>
              <Link
                to="/doctor/attendance"
                className="text-xs font-medium text-slate-500 hover:text-teal-600 mt-1 inline-block"
              >
                Change status →
              </Link>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* TODAY'S APPOINTMENTS TABLE */}
      {loading ? (
        <SkeletonTable rows={4} cols={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchDoctorOverview} />
      ) : (
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Upcoming & Scheduled Consultations
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review patient intakes and access longitudinal histories.
              </p>
            </div>
            <Link to="/doctor/patients">
              <Button variant="outline" size="sm" icon={Users}>
                All Patients
              </Button>
            </Link>
          </div>

          {appointments.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No appointments scheduled"
              description="Your schedule is clear. Bookings made by patients will appear here."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Patient Name</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Primary Concern</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {apt.patient?.full_name || 'Patient'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="flex items-center gap-1.5 text-xs font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDate(apt.slot_start)}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {formatTime(apt.slot_start)}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs truncate">
                        {apt.symptoms || 'General clinical follow-up'}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={apt.status} size="sm">
                          {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link to={`/doctor/patients/${apt.patient_id}`}>
                          <Button variant="secondary" size="sm" icon={ArrowRight} iconPosition="right">
                            Patient Record
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
