import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import doctorService from '../../services/doctorService';
import appointmentService from '../../services/appointmentService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { SkeletonCard } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { formatDate, formatTime, toISODateString } from '../../lib/utils';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Check,
  Stethoscope,
  Activity,
  ArrowRight,
  ArrowLeft,
  CalendarCheck,
  AlertCircle,
} from 'lucide-react';

const COMMON_SYMPTOMS = [
  'Chest Pain or Heart Palpitations',
  'Severe Headache or Migraine with Aura',
  'Shortness of Breath or Respiratory Congestion',
  'Joint Pain, Knee Stiffness, or Musculoskeletal Issue',
  'Skin Rash, Lesion, or Dermatological Irritation',
  'Fever, Cough, or Pediatric Viral Symptoms',
  'Abdominal Cramping or Digestive Distress',
  'Chronic Fatigue or Unexplained Lethargy',
  'Routine Preventive Wellness Checkup',
];

const DURATIONS = [
  'Less than 24 hours',
  '1 to 3 days',
  '4 to 7 days',
  '1 to 3 weeks',
  'Over a month (Chronic)',
];

export default function BookAppointmentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Wizard state
  const [step, setStep] = useState(1);

  // Step 1: Symptoms Form
  const [mainSymptom, setMainSymptom] = useState(COMMON_SYMPTOMS[0]);
  const [duration, setDuration] = useState(DURATIONS[1]);
  const [severity, setSeverity] = useState(4);
  const [symptomNotes, setSymptomNotes] = useState('');
  const [step1Errors, setStep1Errors] = useState({});

  // Step 2: Doctor Selection
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  // Step 3: Calendar & Slot Selection
  const [doctorSlots, setDoctorSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 9, 1)); // Oct 2026
  const [selectedDate, setSelectedDate] = useState('2026-10-12'); // Default to a date with available slots
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch doctors and specialties
  useEffect(() => {
    async function fetchDoctorsData() {
      setLoadingDoctors(true);
      try {
        const [docs, specs] = await Promise.all([
          doctorService.getDoctors('all'),
          doctorService.getSpecialties(),
        ]);
        setDoctors(docs);
        setSpecialties(specs);
      } catch (err) {
        toast.error('Failed to load doctors roster');
      } finally {
        setLoadingDoctors(false);
      }
    }
    fetchDoctorsData();
  }, []);

  // Fetch slots whenever selected doctor changes
  useEffect(() => {
    if (!selectedDoctor) return;
    async function fetchSlots() {
      setLoadingSlots(true);
      setSelectedSlot(null);
      try {
        const slots = await doctorService.getDoctorAvailability(selectedDoctor.id);
        setDoctorSlots(slots);
      } catch (err) {
        toast.error('Failed to load availability slots');
      } finally {
        setLoadingSlots(false);
      }
    }
    fetchSlots();
  }, [selectedDoctor]);

  // Validate Step 1 (Clinical Symptom Intake)
  // NOTE: Client-side validation is for UX and hygiene only. Authoritative validation must happen server-side.
  const handleProceedToStep2 = () => {
    const errs = {};
    const trimmedNotes = symptomNotes.trim();
    if (!mainSymptom) errs.mainSymptom = 'Please choose a primary symptom';
    if (!trimmedNotes) {
      errs.symptomNotes = 'Please describe your symptoms briefly for the doctor.';
    } else if (trimmedNotes.length > 1000) {
      errs.symptomNotes = 'Symptom description cannot exceed 1000 characters.';
    }
    if (Object.keys(errs).length > 0) {
      setStep1Errors(errs);
      return;
    }
    setStep1Errors({});
    setStep(2);
  };

  // Validate Step 2
  const handleProceedToStep3 = () => {
    if (!selectedDoctor) {
      toast.warning('Please select a doctor to continue.');
      return;
    }
    setStep(3);
  };

  // Final Booking Execution
  const handleConfirmBooking = async () => {
    if (!selectedSlot) {
      toast.warning('Please select an available time slot.');
      return;
    }

    setBookingLoading(true);
    try {
      const fullSymptomDescription = `${mainSymptom} (Duration: ${duration}, Severity: ${severity}/10). Notes: ${symptomNotes.trim()}`;

      await appointmentService.bookAppointment({
        patient_id: user.id,
        doctor_id: selectedDoctor.id,
        slot_id: selectedSlot.id,
        symptoms: fullSymptomDescription,
      });

      toast.success(
        `Appointment booked with ${selectedDoctor.full_name} for ${formatDate(selectedSlot.slot_start)}!`
      );
      navigate('/patient/appointments');
    } catch (err) {
      toast.error(err.message || 'Failed to complete booking');
    } finally {
      setBookingLoading(false);
    }
  };

  // Calendar Helpers
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const todayStr = toISODateString(new Date(2026, 9, 8)); // Project reference date Oct 8, 2026

  // Filter slots for selected date
  const slotsForSelectedDate = doctorSlots.filter((s) => {
    return s.slot_start.startsWith(selectedDate);
  });

  const filteredDoctors =
    selectedSpecialty === 'all'
      ? doctors
      : doctors.filter(
          (d) => d.specialty && d.specialty.toLowerCase() === selectedSpecialty.toLowerCase()
        );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Step Indicator Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Book an Appointment</h1>
        <p className="text-sm text-slate-500 mt-1">
          Complete the 3-step clinical booking intake to secure your consultation.
        </p>
      </div>

      {/* Progress Bar / Step Pills */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-xl">
        <button
          type="button"
          onClick={() => setStep(1)}
          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            step === 1
              ? 'bg-white text-teal-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
            step === 1 ? 'bg-teal-100 text-teal-800' : 'bg-slate-200 text-slate-600'
          }`}>
            1
          </span>
          <span className="hidden sm:inline">1. Symptoms</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (mainSymptom && symptomNotes.trim()) setStep(2);
          }}
          disabled={!mainSymptom || !symptomNotes.trim()}
          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${
            step === 2
              ? 'bg-white text-teal-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
            step === 2 ? 'bg-teal-100 text-teal-800' : 'bg-slate-200 text-slate-600'
          }`}>
            2
          </span>
          <span className="hidden sm:inline">2. Choose Doctor</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (selectedDoctor) setStep(3);
          }}
          disabled={!selectedDoctor}
          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${
            step === 3
              ? 'bg-white text-teal-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
            step === 3 ? 'bg-teal-100 text-teal-800' : 'bg-slate-200 text-slate-600'
          }`}>
            3
          </span>
          <span className="hidden sm:inline">3. Slot & Confirm</span>
        </button>
      </div>

      {/* ================= STEP 1: SYMPTOMS ================= */}
      {step === 1 && (
        <Card className="space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-800">Step 1: Clinical Symptom Intake</h2>
            <p className="text-xs text-slate-500 mt-1">
              Provide structured information regarding your symptoms to match with appropriate specialists.
            </p>
          </div>

          <div className="space-y-5">
            {/* Primary Symptom Dropdown */}
            <div>
              <label htmlFor="mainSymptom" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Primary Symptom / Consultation Category
              </label>
              <select
                id="mainSymptom"
                value={mainSymptom}
                onChange={(e) => setMainSymptom(e.target.value)}
                className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {COMMON_SYMPTOMS.map((symp) => (
                  <option key={symp} value={symp}>
                    {symp}
                  </option>
                ))}
              </select>
              {step1Errors.mainSymptom && (
                <p className="mt-1 text-xs text-red-600">{step1Errors.mainSymptom}</p>
              )}
            </div>

            {/* Duration Selector */}
            <div>
              <label htmlFor="duration" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Symptom Duration
              </label>
              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {DURATIONS.map((dur) => (
                  <option key={dur} value={dur}>
                    {dur}
                  </option>
                ))}
              </select>
            </div>

            {/* Severity Slider (1-10) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="severity" className="text-xs font-semibold text-slate-700">
                  Severity Level (1 - 10)
                </label>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    severity <= 3
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : severity <= 6
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {severity <= 3 ? 'Mild' : severity <= 6 ? 'Moderate' : 'Severe'} ({severity}/10)
                  </span>
                </div>
              </div>
              <input
                id="severity"
                type="range"
                min="1"
                max="10"
                value={severity}
                onChange={(e) => setSeverity(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>1 - Minimal</span>
                <span>5 - Moderate</span>
                <span>10 - Very Severe</span>
              </div>
            </div>

            {/* Free-text Clinical Notes */}
            <div>
              <label htmlFor="symptomNotes" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Detailed Description & Clinical Notes
              </label>
              <textarea
                id="symptomNotes"
                rows={4}
                maxLength={1000}
                value={symptomNotes}
                onChange={(e) => setSymptomNotes(e.target.value)}
                placeholder="Describe your symptoms in detail (e.g., when they occur, what aggravates them, any medications taken, relevant history)..."
                className={`w-full p-3 bg-white border ${
                  step1Errors.symptomNotes ? 'border-red-300 ring-1 ring-red-400' : 'border-slate-300'
                } rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500`}
              />
              {step1Errors.symptomNotes && (
                <p className="mt-1 text-xs text-red-600">{step1Errors.symptomNotes}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button
              variant="primary"
              size="md"
              icon={ArrowRight}
              iconPosition="right"
              onClick={handleProceedToStep2}
            >
              Continue to Doctor Selection
            </Button>
          </div>
        </Card>
      )}

      {/* ================= STEP 2: CHOOSE DOCTOR ================= */}
      {step === 2 && (
        <Card className="space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Step 2: Select Attending Physician</h2>
              <p className="text-xs text-slate-500 mt-1">
                Choose a medical practitioner specialized in your condition.
              </p>
            </div>
          </div>

          {/* Specialty Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setSelectedSpecialty('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedSpecialty === 'all'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Specialties
            </button>
            {specialties.map((spec) => (
              <button
                key={spec}
                type="button"
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedSpecialty === spec
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>

          {/* Doctors Grid */}
          {loadingDoctors ? (
            <SkeletonCard count={3} />
          ) : filteredDoctors.length === 0 ? (
            <EmptyState
              icon={Stethoscope}
              title="No doctors in this specialty"
              description="Please select another specialty filter."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDoctors.map((doc) => {
                const isSelected = selectedDoctor?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoctor(doc)}
                    className={`cursor-pointer p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/40 shadow-sm ring-1 ring-teal-500'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {doc.full_name
                        .replace('Dr. ', '')
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-sm font-bold text-slate-800 truncate">{doc.full_name}</p>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-teal-600 mt-0.5">{doc.specialty}</p>
                      <p className="text-[11px] text-slate-400 mt-1 truncate">{doc.email}</p>
                      <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Accepting new patients</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button
              variant="secondary"
              size="md"
              icon={ArrowLeft}
              onClick={() => setStep(1)}
            >
              Back to Symptoms
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={ArrowRight}
              iconPosition="right"
              disabled={!selectedDoctor}
              onClick={handleProceedToStep3}
            >
              Continue to Schedule
            </Button>
          </div>
        </Card>
      )}

      {/* ================= STEP 3: CALENDAR, SLOTS & CONFIRMATION ================= */}
      {step === 3 && (
        <div className="space-y-6">
          <Card className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-800">
                Step 3: Select Date & Available Time Slot
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Viewing schedule for <span className="font-semibold text-teal-700">{selectedDoctor?.full_name}</span> ({selectedDoctor?.specialty}).
              </p>
            </div>

            {/* Calendar + Slot Selection Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Interactive Month Calendar (7 cols) */}
              <div className="lg:col-span-7 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
                      aria-label="Previous month"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
                      aria-label="Next month"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Day of Week Headers */}
                <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 mb-2">
                  <span>Su</span>
                  <span>Mo</span>
                  <span>Tu</span>
                  <span>We</span>
                  <span>Th</span>
                  <span>Fr</span>
                  <span>Sa</span>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty offsets */}
                  {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-9" />
                  ))}

                  {/* Day Buttons */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const dayDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(
                      dayNum
                    ).padStart(2, '0')}`;

                    // Past date check (prevent selecting past dates)
                    const isPast = dayDateStr < todayStr;
                    const isSelected = selectedDate === dayDateStr;

                    // Check if doctor has any slots on this day
                    const hasSlots = doctorSlots.some((s) => s.slot_start.startsWith(dayDateStr));

                    return (
                      <button
                        key={dayDateStr}
                        type="button"
                        disabled={isPast}
                        onClick={() => setSelectedDate(dayDateStr)}
                        className={`h-9 rounded-lg text-xs font-semibold relative flex flex-col items-center justify-center transition-all ${
                          isPast
                            ? 'text-slate-300 cursor-not-allowed bg-transparent'
                            : isSelected
                            ? 'bg-teal-600 text-white shadow-xs font-bold'
                            : 'text-slate-700 hover:bg-white hover:shadow-xs'
                        }`}
                      >
                        <span>{dayNum}</span>
                        {hasSlots && !isPast && !isSelected && (
                          <span className="w-1 h-1 rounded-full bg-teal-500 absolute bottom-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right: Slots Grid for Selected Date (5 cols) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Available Slots
                  </h4>
                  <span className="text-xs text-slate-500 font-medium">
                    {formatDate(`${selectedDate}T00:00:00.000Z`)}
                  </span>
                </div>

                {loadingSlots ? (
                  <div className="py-8 flex justify-center">
                    <SkeletonCard count={1} />
                  </div>
                ) : slotsForSelectedDate.length === 0 ? (
                  <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 p-4">
                    <Clock className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-medium text-slate-600">
                      No slots available on this date
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Please pick another day highlighted on the calendar.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {slotsForSelectedDate.map((slot) => {
                      const isSelected = selectedSlot?.id === slot.id;
                      const isBooked = slot.is_booked;

                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={isBooked}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-2.5 rounded-lg text-xs font-medium border text-center transition-all ${
                            isBooked
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                              : isSelected
                              ? 'bg-teal-600 text-white border-teal-600 shadow-sm font-bold'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-teal-400 hover:bg-teal-50/30'
                          }`}
                        >
                          <div>{formatTime(slot.slot_start)}</div>
                          <div className="text-[10px] opacity-80 mt-0.5">
                            {isBooked ? 'Booked' : 'Available'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Summary Preview Box */}
            <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-100 space-y-3">
              <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                <CalendarCheck className="w-4 h-4 text-teal-600" />
                <span>Booking Summary</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
                <div>
                  <span className="text-slate-400 block text-[11px]">Physician</span>
                  <span className="font-semibold text-slate-800">{selectedDoctor?.full_name}</span>
                  <span className="text-teal-600 block">{selectedDoctor?.specialty}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Appointment Slot</span>
                  {selectedSlot ? (
                    <span className="font-semibold text-slate-800">
                      {formatDate(selectedSlot.slot_start)} at {formatTime(selectedSlot.slot_start)}
                    </span>
                  ) : (
                    <span className="text-amber-600 italic">No slot selected yet</span>
                  )}
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Primary Concern</span>
                  <span className="font-semibold text-slate-800 truncate block">
                    {mainSymptom}
                  </span>
                  <span className="text-slate-500">
                    Severity: {severity}/10 • {duration}
                  </span>
                </div>
              </div>
            </div>

            {/* Back / Confirm Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button
                variant="secondary"
                size="md"
                icon={ArrowLeft}
                onClick={() => setStep(2)}
              >
                Back to Doctors
              </Button>
              <Button
                variant="primary"
                size="md"
                icon={Check}
                disabled={!selectedSlot}
                loading={bookingLoading}
                onClick={handleConfirmBooking}
              >
                Confirm & Book Appointment
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
