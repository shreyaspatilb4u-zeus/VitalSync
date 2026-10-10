import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { SkeletonTable } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import {
  Stethoscope,
  Search,
  CalendarRange,
  Mail,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export default function StaffPage() {
  const [roster, setRoster] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStaff = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getStaffRoster();
      setRoster(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch medical staff directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const specialties = ['all', ...new Set(roster.map((d) => d.specialty).filter(Boolean))];

  const filteredRoster = roster.filter((doc) => {
    const matchesSearch =
      doc.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.email && doc.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSpecialty =
      specialtyFilter === 'all' ? true : doc.specialty === specialtyFilter;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Medical Staff Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Registered attending physicians, medical specialties, and active hospital status.
          </p>
        </div>

        <Link to="/admin/shifts">
          <Button variant="primary" size="md" icon={CalendarRange}>
            Open Shift Scheduler
          </Button>
        </Link>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doctor by name or email..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Specialty Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {specialties.map((spec) => (
            <button
              key={spec}
              type="button"
              onClick={() => setSpecialtyFilter(spec)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                specialtyFilter === spec
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {spec === 'all' ? 'All Specialties' : spec}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Table */}
      {loading ? (
        <SkeletonTable rows={6} cols={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchStaff} />
      ) : filteredRoster.length === 0 ? (
        <EmptyState
          icon={Stethoscope}
          title="No physicians found"
          description="Try clearing your search query or specialty filter."
        />
      ) : (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Physician Name</th>
                  <th className="py-3.5 px-5">Specialty</th>
                  <th className="py-3.5 px-5">Official Email</th>
                  <th className="py-3.5 px-5">Today's Attendance</th>
                  <th className="py-3.5 px-5 text-right">Roster Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredRoster.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Doctor Name & Avatar */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-xs shrink-0">
                          {doc.full_name
                            .replace('Dr. ', '')
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{doc.full_name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">ID: {doc.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Specialty */}
                    <td className="py-4 px-5 font-semibold text-teal-700">
                      {doc.specialty}
                    </td>

                    {/* Email */}
                    <td className="py-4 px-5 text-slate-600 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{doc.email || '—'}</span>
                      </div>
                    </td>

                    {/* Attendance status */}
                    <td className="py-4 px-5">
                      <Badge variant={doc.today_status} size="sm" dot>
                        {doc.today_status.toUpperCase()}
                      </Badge>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-5 text-right">
                      <Link to="/admin/shifts">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={CalendarRange}
                          className="hover:border-teal-500 hover:text-teal-700"
                        >
                          View Shift Schedule
                        </Button>
                      </Link>
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
