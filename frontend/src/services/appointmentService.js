import { isDemoMode } from './mode';
import { mockAppointmentService } from './mock/appointmentService';
import { supabaseAppointmentService } from './supabase/appointmentService';
import { countChars, MAX_CHAR_LIMIT } from '../lib/utils';

export const appointmentService = {
  async getAppointmentsByPatient(patientId, doctorId = null) {
    if (isDemoMode()) {
      return mockAppointmentService.getAppointmentsByPatient(patientId, doctorId);
    }
    return supabaseAppointmentService.getAppointmentsByPatient(patientId, doctorId);
  },

  async getNextUpcomingAppointment(patientId) {
    if (isDemoMode()) {
      return mockAppointmentService.getNextUpcomingAppointment(patientId);
    }
    return supabaseAppointmentService.getNextUpcomingAppointment(patientId);
  },

  async getAppointmentsByDoctor(doctorId) {
    if (isDemoMode()) {
      return mockAppointmentService.getAppointmentsByDoctor(doctorId);
    }
    return supabaseAppointmentService.getAppointmentsByDoctor(doctorId);
  },

  async bookAppointment({ patient_id, doctor_id, slot_id, symptoms }) {
    const notesText =
      typeof symptoms === 'string' && symptoms.includes('Notes: ')
        ? symptoms.split('Notes: ').slice(1).join('Notes: ')
        : symptoms;
    if (countChars(notesText) > MAX_CHAR_LIMIT) {
      throw new Error(`Symptom description cannot exceed ${MAX_CHAR_LIMIT} characters.`);
    }

    if (isDemoMode()) {
      return mockAppointmentService.bookAppointment({
        patient_id,
        doctor_id,
        slot_id,
        symptoms,
      });
    }
    return supabaseAppointmentService.bookAppointment({
      slot_id,
      symptoms,
    });
  },

  async cancelAppointment(appointmentId) {
    if (isDemoMode()) {
      return mockAppointmentService.cancelAppointment(appointmentId);
    }
    return supabaseAppointmentService.cancelAppointment(appointmentId);
  },
};

export default appointmentService;
