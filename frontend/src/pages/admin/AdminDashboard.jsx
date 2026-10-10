import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { SkeletonCard, SkeletonTable } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import {
  Users,
  Calendar,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  Palmtree,
  ArrowRight,
  ShieldCheck,
  CalendarRange,
  Search,
  Stethoscope,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, attData] = await Promise.all([
        adminService.getHospitalStats(),
        adminService.getDailyAttendance(),
      ]);
      setStats(statsData);
      setAttendance(attData);
    } catch (err) {
      setError(err.message || 'Failed to load administration dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const filteredAttendance = attendance.filter((item) => {
    const matchesSearch =
      item.doctor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ? true : item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Hospital Operations Command Center
            </h1>
            <span className="p-1 rounded bg-purple-100 text-purple-700">
              <ShieldCheck className="w-5 h-5" />
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time staff deployment, shift allocations, and hospital-wide attendance oversight.
          </p>
        </div>

        {/* Quick Nav Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link to="/admin/shifts">
            <Button variant="primary" size="md" icon={CalendarRange}>
              Shift Scheduler
            </Button>
          </Link>
          <Link to="/admin/attendance">
            <Button variant="secondary" size="md" icon={CheckCircle2}>
              Manage Attendance
            </Button>
          </Link>
        </div>
      </div>

      {/* STAT CARDS (5 key metrics) */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} count={1} />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchDashboardData} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          {/* Doctors Present */}
          <Card className="border-emerald-200 bg-emerald-50/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                  Present Today
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1">
                  {stats?.present_today}
                </p>
                <span className="text-[11px] text-emerald-600 font-medium">On clinical duty</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </Card>

          {/* Doctors Absent */}
          <Card className="border-red-200 bg-red-50/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-red-800 uppercase tracking-wider">
                  Absent
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-red-700 mt-1">
                  {stats?.absent_today}
                </p>
                <span className="text-[11px] text-red-600 font-medium">Not checked in</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                <XCircle className="w-5 h-5" />
              </div>
            </div>
          </Card>

          {/* On Leave */}
          <Card className="border-amber-200 bg-amber-50/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                  On Leave
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-700 mt-1">
                  {stats?.on_leave_today}
                </p>
                <span className="text-[11px] text-amber-600 font-medium">Approved off-duty</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Palmtree className="w-5 h-5" />
              </div>
            </div>
          </Card>

          {/* Pending Emergencies */}
          <Card className="border-red-300 bg-red-50/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-red-800 uppercase tracking-wider">
                  Pending Emergencies
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-red-700 mt-1">
                  {stats?.pending_emergencies}
                </p>
                <Link
                  to="/admin/emergencies"
                  className="text-[11px] font-semibold text-red-700 underline mt-0.5 block"
                >
                  View live triage →
                </Link>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-200 text-red-800 flex items-center justify-center">
                <AlertOctagon className="w-5 h-5 animate-pulse" />
              </div>
            </div>
          </Card>

          {/* Appointments Today */}
          <Card className="border-teal-200 bg-teal-50/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
                  Appointments
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-teal-700 mt-1">
                  {stats?.appointments_today}
                </p>
                <span className="text-[11px] text-teal-600 font-medium">Scheduled today</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TODAY'S ATTENDANCE TABLE */}
      <Card className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Today's Physician Duty Roster & Attendance
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status across all clinical departments.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search physician or specialty..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-48 sm:w-60"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Statuses</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="on_leave">On Leave</option>
            </select>
          </div>
        </div>

        {loading ? (
          <SkeletonTable rows={6} cols={4} />
        ) : filteredAttendance.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No records found"
            description="No staff match your current search and filter criteria."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Physician Name</th>
                  <th className="py-3 px-4">Medical Specialty</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Attendance Status</th>
                  <th className="py-3 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredAttendance.map((doc) => (
                  <tr key={doc.doctor_id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[11px]">
                          {doc.doctor_name
                            .replace('Dr. ', '')
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <span>{doc.doctor_name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-teal-700 font-semibold">{doc.specialty}</td>
                    <td className="py-3.5 px-4 text-slate-500">{doc.date}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={doc.status} size="sm" dot>
                        {doc.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link to="/admin/attendance">
                        <Button variant="ghost" size="sm" className="text-xs h-7">
                          Edit Status
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
    </div>
  );
}
