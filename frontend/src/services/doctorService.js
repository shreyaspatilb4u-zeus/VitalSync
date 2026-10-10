import { MOCK_PROFILES } from '../mock/profiles';
import { MOCK_AVAILABILITY_SLOTS } from '../mock/availabilitySlots';
import { MOCK_APPOINTMENTS } from '../mock/appointments';
import { MOCK_ATTENDANCE } from '../mock/attendance';
import { generateId, toISODateString } from '../lib/utils';

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const doctorService = {
  /**
   * Get all doctors with optional specialty filtering
   */
  async getDoctors(specialty = 'all') {
    await delay(250);
    const doctors = MOCK_PROFILES.filter((p) => p.role === 'doctor');
    if (!specialty || specialty === 'all') {
      return doctors;
    }
    return doctors.filter(
      (d) => d.specialty && d.specialty.toLowerCase() === specialty.toLowerCase()
    );
  },

  /**
   * Get unique list of doctor specialties
   */
  async getSpecialties() {
    await delay(150);
    const doctors = MOCK_PROFILES.filter((p) => p.role === 'doctor');
    const specialties = [...new Set(doctors.map((d) => d.specialty).filter(Boolean))];
    return specialties;
  },

  /**
   * Get doctor by ID
   */
  async getDoctorById(doctorId) {
    await delay(200);
    const doc = MOCK_PROFILES.find((p) => p.id === doctorId && p.role === 'doctor');
    if (!doc) throw new Error('Doctor not found');
    return doc;
  },

  /**
   * Get patient profile by ID
   */
  async getPatientById(patientId) {
    await delay(200);
    const patient = MOCK_PROFILES.find((p) => p.id === patientId && p.role === 'patient');
    if (!patient) throw new Error('Patient not found');
    return patient;
  },

  /**
   * Get roster of patients assigned to or treated by a doctor
   * Includes last visit date and next scheduled appointment date
   */
  async getAssignedPatients(doctorId) {
    await delay(300);
    const allPatients = MOCK_PROFILES.filter((p) => p.role === 'patient');

    return allPatients.map((patient) => {
      // Find appointments with this doctor (or system-wide)
      const patientApts = MOCK_APPOINTMENTS.filter((a) => a.patient_id === patient.id);
      const doctorApts = patientApts.filter((a) => a.doctor_id === doctorId);

      // Find upcoming appointment
      const upcoming = doctorApts.find((a) => a.status === 'scheduled');

      // Find last completed appointment
      const past = doctorApts
        .filter((a) => a.status === 'completed')
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

      return {
        ...patient,
        last_visit: past ? past.created_at : null,
        next_appointment: upcoming ? upcoming.created_at : null,
        total_visits: doctorApts.length,
      };
    });
  },

  /**
   * Get availability slots for a doctor
   */
  async getDoctorAvailability(doctorId) {
    await delay(250);
    return MOCK_AVAILABILITY_SLOTS.filter((s) => s.doctor_id === doctorId).sort(
      (a, b) => new Date(a.slot_start) - new Date(b.slot_start)
    );
  },

  /**
   * Add a new availability slot for a doctor
   */
  async addAvailabilitySlot(doctorId, slotStartISO) {
    await delay(300);
    const newSlot = {
      id: generateId('slot'),
      doctor_id: doctorId,
      slot_start: slotStartISO,
      is_booked: false,
    };
    MOCK_AVAILABILITY_SLOTS.push(newSlot);
    return newSlot;
  },

  /**
   * Remove an unbooked availability slot
   */
  async removeAvailabilitySlot(slotId) {
    await delay(250);
    const index = MOCK_AVAILABILITY_SLOTS.findIndex((s) => s.id === slotId);
    if (index === -1) throw new Error('Slot not found');
    if (MOCK_AVAILABILITY_SLOTS[index].is_booked) {
      throw new Error('Cannot remove a booked slot.');
    }
    const [removed] = MOCK_AVAILABILITY_SLOTS.splice(index, 1);
    return removed;
  },

  /**
   * Get doctor today's attendance record
   */
  async getDoctorTodayAttendance(doctorId) {
    await delay(200);
    const today = toISODateString(new Date(2026, 9, 8)); // Reference date Oct 8, 2026
    const rec = MOCK_ATTENDANCE.find((a) => a.doctor_id === doctorId && a.date === today);
    return rec ? rec.status : 'absent';
  },

  /**
   * Check in or update today's attendance status
   */
  async checkInDoctor(doctorId, status = 'present') {
    await delay(250);
    const today = toISODateString(new Date(2026, 9, 8)); // Reference date Oct 8, 2026
    let rec = MOCK_ATTENDANCE.find((a) => a.doctor_id === doctorId && a.date === today);

    if (rec) {
      rec.status = status;
    } else {
      rec = {
        id: generateId('att'),
        doctor_id: doctorId,
        date: today,
        status,
      };
      MOCK_ATTENDANCE.push(rec);
    }
    return rec;
  },

  /**
   * Get recent 7 days attendance history for this doctor
   */
  async getDoctorAttendanceHistory(doctorId) {
    await delay(250);
    return MOCK_ATTENDANCE.filter((a) => a.doctor_id === doctorId).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  },
};

export default doctorService;
