import { MOCK_APPOINTMENTS } from '../mock/appointments';
import { MOCK_AVAILABILITY_SLOTS } from '../mock/availabilitySlots';
import { MOCK_PROFILES } from '../mock/profiles';
import { generateId } from '../lib/utils';

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to hydrate appointment with related profile and slot data
function hydrateAppointment(apt) {
  const doctor = MOCK_PROFILES.find((p) => p.id === apt.doctor_id);
  const patient = MOCK_PROFILES.find((p) => p.id === apt.patient_id);
  const slot = apt.slot_id
    ? MOCK_AVAILABILITY_SLOTS.find((s) => s.id === apt.slot_id)
    : null;

  return {
    ...apt,
    doctor: doctor
      ? { id: doctor.id, full_name: doctor.full_name, specialty: doctor.specialty }
      : null,
    patient: patient
      ? { id: patient.id, full_name: patient.full_name, email: patient.email }
      : null,
    slot_start: slot ? slot.slot_start : apt.created_at,
  };
}

export const appointmentService = {
  /**
   * Get all appointments for a patient
   */
  async getAppointmentsByPatient(patientId) {
    await delay(300);
    const list = MOCK_APPOINTMENTS.filter((a) => a.patient_id === patientId);
    return list.map(hydrateAppointment).sort((a, b) => new Date(b.slot_start) - new Date(a.slot_start));
  },

  /**
   * Get next upcoming appointment for patient
   */
  async getNextUpcomingAppointment(patientId) {
    await delay(200);
    const list = MOCK_APPOINTMENTS.filter(
      (a) => a.patient_id === patientId && a.status === 'scheduled'
    );
    const hydrated = list.map(hydrateAppointment);
    // Sort ascending by slot_start
    hydrated.sort((a, b) => new Date(a.slot_start) - new Date(b.slot_start));
    return hydrated[0] || null;
  },

  /**
   * Get all appointments for a doctor
   */
  async getAppointmentsByDoctor(doctorId) {
    await delay(300);
    const list = MOCK_APPOINTMENTS.filter((a) => a.doctor_id === doctorId);
    return list.map(hydrateAppointment).sort((a, b) => new Date(b.slot_start) - new Date(a.slot_start));
  },

  /**
   * Book a new appointment
   */
  async bookAppointment({ patient_id, doctor_id, slot_id, symptoms }) {
    await delay(400);
    if (!patient_id || !doctor_id || !slot_id || !symptoms) {
      throw new Error('Please fill in all booking details.');
    }

    const slot = MOCK_AVAILABILITY_SLOTS.find((s) => s.id === slot_id);
    if (!slot) {
      throw new Error('Selected time slot does not exist.');
    }
    if (slot.is_booked) {
      throw new Error('This time slot is already booked. Please choose another.');
    }

    // Mark slot as booked
    slot.is_booked = true;

    // Create appointment
    const newAppointment = {
      id: generateId('apt'),
      patient_id,
      doctor_id,
      slot_id,
      symptoms: symptoms.trim(),
      status: 'scheduled',
      created_at: new Date().toISOString(),
    };

    MOCK_APPOINTMENTS.unshift(newAppointment);
    return hydrateAppointment(newAppointment);
  },

  /**
   * Cancel an appointment
   */
  async cancelAppointment(appointmentId) {
    await delay(300);
    const apt = MOCK_APPOINTMENTS.find((a) => a.id === appointmentId);
    if (!apt) throw new Error('Appointment not found');

    apt.status = 'cancelled';

    // Release slot if exists
    if (apt.slot_id) {
      const slot = MOCK_AVAILABILITY_SLOTS.find((s) => s.id === apt.slot_id);
      if (slot) {
        slot.is_booked = false;
      }
    }

    return hydrateAppointment(apt);
  },
};

export default appointmentService;
