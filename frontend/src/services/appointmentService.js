import { isDemoMode } from './mode';
import { mockAppointmentService } from './mock/appointmentService';
import { supabaseAppointmentService } from './supabase/appointmentService';

export const appointmentService = {
  async getAppointmentsByPatient(patientId) {
    if (isDemoMode()) {
      return mockAppointmentService.getAppointmentsByPatient(patientId);
    }
    return supabaseAppointmentService.getAppointmentsByPatient(patientId);
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
