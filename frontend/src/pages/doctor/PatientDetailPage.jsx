import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import doctorService from '../../services/doctorService';
import recordService from '../../services/recordService';
import appointmentService from '../../services/appointmentService';
import aiService from '../../services/aiService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { SkeletonCard, SkeletonLine } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { formatDate, formatTime } from '../../lib/utils';
import {
  Sparkles,
  Copy,
  RotateCw,
  AlertTriangle,
  FileText,
  Calendar,
  User,
  Plus,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Pill,
  HeartPulse,
  TrendingUp,
  ShieldAlert,
  ClipboardList,
} from 'lucide-react';

export default function PatientDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();

  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // AI Summary State
  const [aiSummary, setAiSummary] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Add Note Modal State
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const fetchPatientData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [pat, recs, apts] = await Promise.all([
        doctorService.getPatientById(id),
        recordService.getRecordsByPatient(id),
        appointmentService.getAppointmentsByPatient(id, user?.id),
      ]);
      setPatient(pat);
      setRecords(recs);
      setAppointments(apts);
    } catch (err) {
      setError(err.message || 'Failed to load patient record');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, [id, user]);

  // Generate / Regenerate AI Summary
  const handleGenerateAiSummary = async () => {
    setAiLoading(true);
    try {
      const summary = await aiService.summarizeHistory(id);
      setAiSummary(summary);
      toast.success('Clinical AI summary generated successfully.');
    } catch (err) {
      toast.error('Failed to generate AI summary.');
    } finally {
      setAiLoading(false);
    }
  };

  // Copy Summary to Clipboard
  const handleCopySummary = async () => {
    if (!aiSummary) return;

    const formattedText = `VITALSYNC AI MEDICAL HISTORY SUMMARY
Patient: ${patient?.full_name} (${patient?.id})
Generated: ${new Date(aiSummary.generated_at).toLocaleString()}

1. KEY CONDITIONS:
${aiSummary.key_conditions.map((c) => `- ${c}`).join('\n')}

2. CURRENT MEDICATIONS:
${aiSummary.current_medications.map((m) => `- ${m}`).join('\n')}

3. RECENT CHANGES:
${aiSummary.recent_changes.map((r) => `- ${r}`).join('\n')}

4. FLAGS & RISKS:
${aiSummary.flags_and_risks.map((f) => `- ${f}`).join('\n')}

5. SUGGESTED FOCUS AREAS:
${aiSummary.suggested_focus_areas.map((s) => `- ${s}`).join('\n')}

DISCLAIMER: ${aiSummary.disclaimer}`;

    try {
      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      toast.success('AI summary copied to clipboard.');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      toast.error('Unable to copy to clipboard.');
    }
  };

  // Add Medical Record Note
  // NOTE: Client-side validation is for UX and hygiene only.
  // Authoritative validation and medical record authorization must be enforced server-side via Supabase RLS.
  const handleSaveNote = async (e) => {
    e.preventDefault();
    const trimmedTitle = noteTitle.trim();
    const trimmedContent = noteContent.trim();

    if (!trimmedTitle || !trimmedContent) {
      toast.warning('Please provide both note title and clinical notes.');
      return;
    }
    if (trimmedTitle.length > 120) {
      toast.warning('Note title cannot exceed 120 characters.');
      return;
    }
    if (trimmedContent.length > 2000) {
      toast.warning('Clinical notes cannot exceed 2000 characters.');
      return;
    }

    setSavingNote(true);
    try {
      await recordService.addRecord({
        patient_id: id,
        doctor_id: user.id,
        title: trimmedTitle,
        notes: trimmedContent,
      });
      toast.success('Clinical record note saved.');
      setShowAddNoteModal(false);
      setNoteTitle('');
      setNoteContent('');
      // Refetch records
      const updatedRecords = await recordService.getRecordsByPatient(id);
      setRecords(updatedRecords);
    } catch (err) {
      toast.error(err.message || 'Failed to save note');
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonCard count={2} />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="space-y-4">
        <Link to="/doctor/patients">
          <Button variant="ghost" size="sm" icon={ArrowLeft}>
            Back to Patients Roster
          </Button>
        </Link>
        <ErrorState message={error || 'Patient not found'} onRetry={fetchPatientData} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back Button */}
      <div>
        <Link
          to="/doctor/patients"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Patients Roster</span>
        </Link>
      </div>

      {/* Patient Header Card */}
      <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-slate-200">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold text-lg shrink-0">
            {patient.full_name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-slate-800">{patient.full_name}</h1>
              <Badge variant="patient" size="sm">
                PATIENT
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              ID: <span className="font-mono">{patient.id}</span> • Email: {patient.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <Button
            variant="secondary"
            size="sm"
            icon={Plus}
            onClick={() => setShowAddNoteModal(true)}
          >
            Add Encounter Note
          </Button>
        </div>
      </Card>

      {/* ================= AI MEDICAL HISTORY SUMMARY CARD ================= */}
      <Card className="border-teal-200 bg-gradient-to-b from-teal-50/20 via-white to-white shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-teal-600 text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-800">
                  AI Medical History Summary
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 px-2 py-0.5 rounded border border-teal-200">
                  VitalSync Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Automated clinical synthesis extracted from longitudinal EHR progress notes.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          {aiSummary && !aiLoading && (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={Copy}
                onClick={handleCopySummary}
              >
                {copied ? 'Copied!' : 'Copy Summary'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={RotateCw}
                onClick={handleGenerateAiSummary}
              >
                Regenerate
              </Button>
            </div>
          )}
        </div>

        {/* AI Content Area */}
        {aiLoading ? (
          <div className="py-6 space-y-4 animate-pulse">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-700">
              <RotateCw className="w-4 h-4 animate-spin text-teal-600" />
              <span>Analyzing clinical records and generating longitudinal synthesis...</span>
            </div>
            <div className="space-y-3 pt-2">
              <SkeletonLine className="h-4 w-3/4" />
              <SkeletonLine className="h-4 w-full" />
              <SkeletonLine className="h-4 w-5/6" />
              <SkeletonLine className="h-4 w-2/3" />
            </div>
          </div>
        ) : !aiSummary ? (
          <div className="py-8 text-center max-w-md mx-auto space-y-3">
            <p className="text-xs text-slate-600">
              No AI summary generated for this patient yet. Click below to analyze past encounters,
              prescriptions, risk metrics, and diagnostic logs.
            </p>
            <Button
              variant="primary"
              size="md"
              icon={Sparkles}
              onClick={handleGenerateAiSummary}
            >
              Generate AI Medical History Summary
            </Button>
          </div>
        ) : (
          /* Render Structured AI Sections */
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Key Conditions */}
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-teal-600" />
                  <span>Key Conditions & Diagnoses</span>
                </h3>
                <ul className="text-xs text-slate-700 space-y-1.5 pl-1">
                  {aiSummary.key_conditions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 2. Current Medications */}
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-teal-600" />
                  <span>Current Medications</span>
                </h3>
                <ul className="text-xs text-slate-700 space-y-1.5 pl-1">
                  {aiSummary.current_medications.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 3. Recent Changes */}
            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Recent Clinical Changes & Progress</span>
              </h3>
              <ul className="text-xs text-slate-700 space-y-1.5 pl-1">
                {aiSummary.recent_changes.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 4. Flags and Risks */}
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2">
                <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Flags & Clinical Risks</span>
                </h3>
                <ul className="text-xs text-amber-800 space-y-1.5 pl-1">
                  {aiSummary.flags_and_risks.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 5. Suggested Focus Areas */}
              <div className="p-4 rounded-xl bg-teal-50/40 border border-teal-200 space-y-2">
                <h3 className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4 text-teal-600" />
                  <span>Suggested Clinical Focus Areas</span>
                </h3>
                <ul className="text-xs text-teal-800 space-y-1.5 pl-1">
                  {aiSummary.suggested_focus_areas.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* MANDATORY DISCLAIMER */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-500">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="font-medium">{aiSummary.disclaimer}</p>
            </div>
          </div>
        )}
      </Card>

      {/* ================= MEDICAL RECORDS TIMELINE ================= */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-800">Medical Records & Clinical Notes</h3>
            <p className="text-xs text-slate-500">Longitudinal encounter documentation.</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={Plus}
            onClick={() => setShowAddNoteModal(true)}
          >
            Add Note
          </Button>
        </div>

        {records.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No medical records on file"
            description="Encounter notes added during appointments will be listed in chronological order."
          />
        ) : (
          <div className="space-y-4">
            {records.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2.5 hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
                  <h4 className="text-sm font-bold text-slate-800">{rec.title}</h4>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(rec.created_at)}</span>
                    {rec.doctor && (
                      <span className="text-slate-500 font-medium">
                        • {rec.doctor.full_name} ({rec.doctor.specialty})
                      </span>
                    )}
                  </div>
                </div>

                {/* Clinical Notes Text */}
                <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                  {rec.notes}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ================= APPOINTMENT HISTORY ================= */}
      <Card className="space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-800">Appointment Consultation History</h3>
          <p className="text-xs text-slate-500">Scheduled and previous consultations.</p>
        </div>

        {appointments.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No appointment history"
            description="Past visits with any hospital specialist will be shown here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Physician</th>
                  <th className="py-3 px-3">Specialty</th>
                  <th className="py-3 px-3">Reported Symptoms</th>
                  <th className="py-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      {formatDate(apt.slot_start)} at {formatTime(apt.slot_start)}
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      {apt.doctor?.full_name || 'Assigned Physician'}
                    </td>
                    <td className="py-3 px-3 text-teal-600 font-medium">
                      {apt.doctor?.specialty || 'General Practice'}
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                      {apt.symptoms}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Badge variant={apt.status} size="sm">
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Encounter Note Modal */}
      <Modal
        isOpen={showAddNoteModal}
        onClose={() => setShowAddNoteModal(false)}
        title="Add Clinical Encounter Note"
        description={`Record official diagnostic impression for ${patient.full_name}`}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveNote} className="space-y-4">
          <div>
            <label htmlFor="noteTitle" className="block text-xs font-semibold text-slate-700 mb-1">
              Note Title / Encounter Type
            </label>
            <input
              id="noteTitle"
              type="text"
              maxLength={120}
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="e.g., Cardiology Routine Follow-up Note"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label htmlFor="noteContent" className="block text-xs font-semibold text-slate-700 mb-1">
              Clinical Findings & Assessment Notes
            </label>
            <textarea
              id="noteContent"
              rows={6}
              maxLength={2000}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Enter subjective history, objective examination, diagnostic evaluation, assessment and plan..."
              className="w-full p-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowAddNoteModal(false)}
              disabled={savingNote}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={savingNote}
            >
              Save to Medical Records
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
