import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { SkeletonTable } from '../../components/common/LoadingSkeleton';
import ErrorState from '../../components/common/ErrorState';
import { formatDate } from '../../lib/utils';
import {
  CalendarRange,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RotateCw,
  Sun,
  Sunset,
  Moon,
} from 'lucide-react';

// The 7 days in current schedule cycle
const WEEK_DAYS = [
  { date: '2026-10-08', label: 'Thu, Oct 8' },
  { date: '2026-10-09', label: 'Fri, Oct 9' },
  { date: '2026-10-10', label: 'Sat, Oct 10' },
  { date: '2026-10-11', label: 'Sun, Oct 11' },
  { date: '2026-10-12', label: 'Mon, Oct 12' },
  { date: '2026-10-13', label: 'Tue, Oct 13' },
  { date: '2026-10-14', label: 'Wed, Oct 14' },
];

export default function ShiftSchedulerPage() {
  const toast = useToast();

  const [doctors, setDoctors] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingCell, setUpdatingCell] = useState(null); // 'docId_date'

  const fetchScheduleData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [docs, shiftList] = await Promise.all([
        adminService.getStaffRoster(),
        adminService.getShifts(),
      ]);
      setDoctors(docs);
      setShifts(shiftList);
    } catch (err) {
      setError(err.message || 'Failed to load shift schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduleData();
  }, []);

  const handleShiftChange = async (doctorId, shiftDate, newType) => {
    const cellKey = `${doctorId}_${shiftDate}`;
    setUpdatingCell(cellKey);
    try {
      await adminService.updateShift(doctorId, shiftDate, newType);
      toast.success(
        newType === 'off'
          ? `Shift removed for ${shiftDate}`
          : `Assigned ${newType} shift for ${shiftDate}`
      );
      // Refresh shifts
      const updatedShifts = await adminService.getShifts();
      setShifts(updatedShifts);
    } catch (err) {
      toast.error('Failed to update shift');
    } finally {
      setUpdatingCell(null);
    }
  };

  // Find shift for doctor on date
  const getShiftType = (doctorId, date) => {
    const found = shifts.find((s) => s.doctor_id === doctorId && s.shift_date === date);
    return found ? found.shift_type : 'off';
  };

  // Calculate daily coverage (Morning, Evening, Night)
  const getDailyCoverage = (date) => {
    const dayShifts = shifts.filter((s) => s.shift_date === date);
    const coveredTypes = new Set(dayShifts.map((s) => s.shift_type));

    // Full 24-hr clinical coverage requires morning, evening, and night
    const count = ['morning', 'evening', 'night'].filter((type) =>
      coveredTypes.has(type)
    ).length;

    return {
      coveredCount: count,
      totalNeeded: 3,
      isFullyCovered: count === 3,
      missingTypes: ['morning', 'evening', 'night'].filter((type) => !coveredTypes.has(type)),
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Hospital Shift Scheduler
            </h1>
            <span className="p-1 rounded bg-teal-100 text-teal-700">
              <CalendarRange className="w-5 h-5" />
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Weekly 24/7 staff coverage matrix. Days with incomplete shift coverage are highlighted in amber.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={RotateCw}
          onClick={fetchScheduleData}
          loading={loading}
        >
          Refresh Grid
        </Button>
      </div>

      {/* Legend & Instructions */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-bold text-slate-700">Shift Types:</span>
          <span className="flex items-center gap-1.5 text-amber-700">
            <Sun className="w-3.5 h-3.5" />
            <span>Morning (08:00 - 16:00)</span>
          </span>
          <span className="flex items-center gap-1.5 text-blue-700">
            <Sunset className="w-3.5 h-3.5" />
            <span>Evening (16:00 - 00:00)</span>
          </span>
          <span className="flex items-center gap-1.5 text-purple-700">
            <Moon className="w-3.5 h-3.5" />
            <span>Night (00:00 - 08:00)</span>
          </span>
        </div>

        <div className="text-slate-500">
          Click any dropdown to modify physician allocation in real time.
        </div>
      </div>

      {loading ? (
        <SkeletonTable rows={6} cols={8} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchScheduleData} />
      ) : (
        /* ================= SHIFT MATRIX TABLE ================= */
        <Card padding="none" className="overflow-hidden border-slate-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              {/* Daily Coverage Indicator Header */}
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200">
                  <th className="py-3 px-4 font-bold text-slate-600 uppercase tracking-wider sticky left-0 bg-slate-100 z-10 w-52">
                    Coverage Indicator
                  </th>
                  {WEEK_DAYS.map((day) => {
                    const coverage = getDailyCoverage(day.date);
                    return (
                      <th
                        key={day.date}
                        className={`py-3 px-3 text-center border-l border-slate-200 transition-colors ${
                          coverage.isFullyCovered
                            ? 'bg-emerald-50/50'
                            : 'bg-amber-50/90'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-bold text-slate-800">{day.label}</span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              coverage.isFullyCovered
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}
                          >
                            {coverage.isFullyCovered ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                            )}
                            <span>
                              {coverage.coveredCount} of {coverage.totalNeeded} Covered
                            </span>
                          </span>
                        </div>
                      </th>
                    );
                  })}
                </tr>

                {/* Subheader */}
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-4 sticky left-0 bg-slate-50 z-10">Physician & Specialty</th>
                  {WEEK_DAYS.map((day) => (
                    <th key={day.date} className="py-2.5 px-3 text-center border-l border-slate-200">
                      Assigned Shift
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Doctors Rows */}
              <tbody className="divide-y divide-slate-100">
                {doctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Doctor Info (Sticky Left) */}
                    <td className="py-3 px-4 font-bold text-slate-800 sticky left-0 bg-white z-10 shadow-xs border-r border-slate-200">
                      <p className="truncate text-slate-800">{doc.full_name}</p>
                      <p className="text-[10px] text-teal-700 font-semibold truncate">
                        {doc.specialty}
                      </p>
                    </td>

                    {/* Day Cells */}
                    {WEEK_DAYS.map((day) => {
                      const currentShift = getShiftType(doc.id, day.date);
                      const isCellUpdating = updatingCell === `${doc.id}_${day.date}`;

                      const shiftColors = {
                        morning: 'bg-amber-50 text-amber-900 border-amber-300',
                        evening: 'bg-blue-50 text-blue-900 border-blue-300',
                        night: 'bg-purple-50 text-purple-900 border-purple-300',
                        off: 'bg-white text-slate-400 border-slate-200',
                      };

                      return (
                        <td
                          key={day.date}
                          className="py-2 px-2 border-l border-slate-100 text-center"
                        >
                          <select
                            value={currentShift}
                            disabled={isCellUpdating}
                            onChange={(e) =>
                              handleShiftChange(doc.id, day.date, e.target.value)
                            }
                            className={`w-full py-1.5 px-2 rounded-lg text-xs font-semibold border focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all ${
                              shiftColors[currentShift] || shiftColors.off
                            }`}
                          >
                            <option value="off">Off Duty</option>
                            <option value="morning">Morning</option>
                            <option value="evening">Evening</option>
                            <option value="night">Night</option>
                          </select>
                        </td>
                      );
                    })}
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
