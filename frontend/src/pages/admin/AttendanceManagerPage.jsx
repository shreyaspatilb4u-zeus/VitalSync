import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { SkeletonTable } from '../../components/common/LoadingSkeleton';
import ErrorState from '../../components/common/ErrorState';
import { formatDate, toISODateString } from '../../lib/utils';
import { isDemoMode } from '../../services/mode';
import {
  CheckCircle2,
  Calendar,
  Save,
  Check,
  XCircle,
  Palmtree,
  RotateCw,
  Sparkles,
} from 'lucide-react';

export default function AttendanceManagerPage() {
  const toast = useToast();

  const [selectedDate, setSelectedDate] = useState(
    isDemoMode() ? '2026-10-08' : toISODateString(new Date())
  );
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchAttendanceForDate = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getDailyAttendance(date);
      setAttendanceList(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceForDate(selectedDate);
  }, [selectedDate]);

  const handleStatusChange = (doctorId, newStatus) => {
    setAttendanceList((prev) =>
      prev.map((item) =>
        item.doctor_id === doctorId ? { ...item, status: newStatus } : item
      )
    );
  };

  const handleMarkAllPresent = () => {
    setAttendanceList((prev) =>
      prev.map((item) => ({ ...item, status: 'present' }))
    );
    toast.info('All physicians marked as Present. Click Save to persist.');
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    try {
      await adminService.saveBulkAttendance(selectedDate, attendanceList);
      toast.success(`Attendance records for ${formatDate(`${selectedDate}T00:00:00.000Z`)} saved successfully.`);
      await fetchAttendanceForDate(selectedDate);
    } catch (err) {
      toast.error('Failed to save attendance records');
    } finally {
      setSaving(false);
    }
  };

  const presentCount = attendanceList.filter((a) => a.status === 'present').length;
  const absentCount = attendanceList.filter((a) => a.status === 'absent').length;
  const onLeaveCount = attendanceList.filter((a) => a.status === 'on_leave').length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Attendance Administration Manager
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pick a date to record, modify, and audit official hospital physician attendance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleMarkAllPresent}
            disabled={loading || saving}
          >
            Mark All Present
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={Save}
            loading={saving}
            disabled={loading}
            onClick={handleSaveAttendance}
          >
            Save Attendance
          </Button>
        </div>
      </div>

      {/* Date Picker & Quick Summary Card */}
      <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-slate-200 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <label htmlFor="attDate" className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
              Select Attendance Date
            </label>
            <input
              id="attDate"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-0.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Quick Tally Pills */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
            {presentCount} Present
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-red-50 text-red-800 border border-red-200">
            {absentCount} Absent
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
            {onLeaveCount} On Leave
          </span>
        </div>
      </Card>

      {/* Doctors Attendance Table */}
      {loading ? (
        <SkeletonTable rows={6} cols={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchAttendanceForDate(selectedDate)} />
      ) : (
        <Card padding="none" className="overflow-hidden border-slate-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-5">Physician Name</th>
                  <th className="py-3 px-5">Specialty</th>
                  <th className="py-3 px-5 text-right">Attendance Status Assignment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {attendanceList.map((doc) => (
                  <tr key={doc.doctor_id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Name */}
                    <td className="py-4 px-5">
                      <p className="font-bold text-slate-800 text-sm">{doc.doctor_name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">ID: {doc.doctor_id}</p>
                    </td>

                    {/* Specialty */}
                    <td className="py-4 px-5 font-semibold text-teal-700">
                      {doc.specialty}
                    </td>

                    {/* Status Toggle Buttons */}
                    <td className="py-4 px-5 text-right">
                      <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 gap-1">
                        {/* Present */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(doc.doctor_id, 'present')}
                          className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                            doc.status === 'present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          Present
                        </button>

                        {/* Absent */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(doc.doctor_id, 'absent')}
                          className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                            doc.status === 'absent'
                              ? 'bg-red-600 text-white shadow-xs'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          Absent
                        </button>

                        {/* On Leave */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(doc.doctor_id, 'on_leave')}
                          className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                            doc.status === 'on_leave'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          On Leave
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Save Button Footer */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-slate-400">
          Changes will not take effect on the hospital dashboard until saved.
        </p>
        <Button
          variant="primary"
          size="md"
          icon={Save}
          loading={saving}
          disabled={loading}
          onClick={handleSaveAttendance}
        >
          Save Attendance Records
        </Button>
      </div>
    </div>
  );
}
