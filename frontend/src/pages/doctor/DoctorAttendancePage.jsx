import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import doctorService from '../../services/doctorService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { SkeletonCard } from '../../components/common/LoadingSkeleton';
import ErrorState from '../../components/common/ErrorState';
import { formatDate } from '../../lib/utils';
import {
  CheckCircle2,
  Calendar,
  Clock,
  UserCheck,
  Palmtree,
  ShieldCheck,
  RotateCw,
} from 'lucide-react';

export default function DoctorAttendancePage() {
  const { user } = useAuth();
  const toast = useToast();

  const [todayStatus, setTodayStatus] = useState('present');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchAttendance = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [today, hist] = await Promise.all([
        doctorService.getDoctorTodayAttendance(user.id),
        doctorService.getDoctorAttendanceHistory(user.id),
      ]);
      setTodayStatus(today);
      setHistory(hist);
    } catch (err) {
      toast.error('Failed to load attendance records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [user]);

  const handleSetStatus = async (newStatus) => {
    setUpdating(true);
    try {
      await doctorService.checkInDoctor(user.id, newStatus);
      setTodayStatus(newStatus);
      toast.success(
        newStatus === 'present'
          ? 'Checked in successfully for today!'
          : `Duty status updated to ${newStatus.replace('_', ' ')}.`
      );
      await fetchAttendance();
    } catch (err) {
      toast.error('Failed to update attendance status.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-2">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Doctor Daily Attendance & Duty Check-in
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Record your daily physical or tele-health shift status for hospital administration.
        </p>
      </div>

      {loading ? (
        <SkeletonCard count={2} />
      ) : (
        <>
          {/* Today's Check-in Action Card */}
          <Card className="border-teal-200 bg-gradient-to-r from-teal-50/30 to-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-100 px-2 py-0.5 rounded border border-teal-200">
                  Today's Recorded Status
                </span>
                <div className="flex items-center gap-3 mt-2">
                  <h2 className="text-2xl font-extrabold text-slate-800 capitalize">
                    {todayStatus.replace('_', ' ')}
                  </h2>
                  <Badge variant={todayStatus} size="lg" dot>
                    {todayStatus.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Active for: {user?.full_name} ({user?.specialty})
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5">
                <Button
                  variant={todayStatus === 'present' ? 'primary' : 'secondary'}
                  size="md"
                  icon={CheckCircle2}
                  loading={updating}
                  onClick={() => handleSetStatus('present')}
                >
                  {todayStatus === 'present' ? 'Checked In' : 'Check In Today'}
                </Button>

                <Button
                  variant={todayStatus === 'on_leave' ? 'secondary' : 'outline'}
                  size="md"
                  icon={Palmtree}
                  loading={updating}
                  onClick={() => handleSetStatus('on_leave')}
                >
                  Mark On Leave
                </Button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>
                Verified hospital attendance log. Synchronized with the Hospital Admin Control Center.
              </span>
            </div>
          </Card>

          {/* 7-Day History Table */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">
                Recent 7-Day Attendance Log
              </h3>
              <Button
                variant="ghost"
                size="sm"
                icon={RotateCw}
                onClick={fetchAttendance}
              >
                Refresh
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Attending Doctor</th>
                    <th className="py-3 px-4">Recorded Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {history.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/60">
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDate(`${record.date}T00:00:00.000Z`)}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {user?.full_name} ({user?.specialty})
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={record.status} size="sm" dot>
                          {record.status.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
