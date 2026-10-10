import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import doctorService from '../../services/doctorService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { SkeletonTable } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { formatDate } from '../../lib/utils';
import {
  Users,
  Search,
  ArrowRight,
  User,
  Calendar,
  Sparkles,
  FileText,
} from 'lucide-react';

export default function PatientsRosterPage() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatients = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await doctorService.getAssignedPatients(user.id);
      setPatients(data);
    } catch (err) {
      setError(err.message || 'Failed to load patients roster');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [user]);

  const filteredPatients = patients.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      p.full_name.toLowerCase().includes(q) ||
      (p.email && p.email.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">My Patients Roster</h1>
          <p className="text-sm text-slate-500 mt-1">
            Access longitudinal health histories and AI Medical Summaries for assigned patients.
          </p>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient by legal name or email..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredPatients.length} of {patients.length} patients
        </span>
      </div>

      {/* Roster Table */}
      {loading ? (
        <SkeletonTable rows={6} cols={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchPatients} />
      ) : filteredPatients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No patients found"
          description={
            searchQuery
              ? `No patients matching "${searchQuery}". Check the spelling and try again.`
              : 'There are currently no patients assigned to your care roster.'
          }
        />
      ) : (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Patient Name</th>
                  <th className="py-3.5 px-5">Email Address</th>
                  <th className="py-3.5 px-5">Last Consultation</th>
                  <th className="py-3.5 px-5">Next Appointment</th>
                  <th className="py-3.5 px-5 text-right">Clinical Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPatients.map((pat) => (
                  <tr key={pat.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Patient Name & Avatar */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center font-bold text-xs shrink-0">
                          {pat.full_name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{pat.full_name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">ID: {pat.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-5 text-xs text-slate-600 font-mono">
                      {pat.email || '—'}
                    </td>

                    {/* Last Visit */}
                    <td className="py-4 px-5 text-xs text-slate-600">
                      {pat.last_visit ? (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDate(pat.last_visit)}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No prior visits</span>
                      )}
                    </td>

                    {/* Next Appointment */}
                    <td className="py-4 px-5 text-xs">
                      {pat.next_appointment ? (
                        <span className="inline-flex items-center gap-1.5 font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                          <Calendar className="w-3 h-3 text-teal-600" />
                          <span>{formatDate(pat.next_appointment)}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">None scheduled</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-5 text-right">
                      <Link to={`/doctor/patients/${pat.id}`}>
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={Sparkles}
                          className="hover:border-teal-500 hover:text-teal-700"
                        >
                          View Records & AI Summary
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
