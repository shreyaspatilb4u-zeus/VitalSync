import { isDemoMode } from './mode';
import { mockDoctorService } from './mock/doctorService';
import { supabaseDoctorService } from './supabase/doctorService';

export const doctorService = {
  async getDoctors(specialty = 'all') {
    if (isDemoMode()) return mockDoctorService.getDoctors(specialty);
    return supabaseDoctorService.getDoctors(specialty);
  },

  async getSpecialties() {
    if (isDemoMode()) return mockDoctorService.getSpecialties();
    return supabaseDoctorService.getSpecialties();
  },

  async getDoctorById(doctorId) {
    if (isDemoMode()) return mockDoctorService.getDoctorById(doctorId);
    return supabaseDoctorService.getDoctorById(doctorId);
  },

  async getPatientById(patientId) {
    if (isDemoMode()) return mockDoctorService.getPatientById(patientId);
    return supabaseDoctorService.getPatientById(patientId);
  },

  async getAssignedPatients(doctorId) {
    if (isDemoMode()) return mockDoctorService.getAssignedPatients(doctorId);
    return supabaseDoctorService.getAssignedPatients(doctorId);
  },

  async getDoctorAvailability(doctorId, options) {
    if (isDemoMode()) return mockDoctorService.getDoctorAvailability(doctorId, options);
    return supabaseDoctorService.getDoctorAvailability(doctorId, options);
  },

  async addAvailabilitySlot(doctorId, slotStartISO) {
    if (isDemoMode()) return mockDoctorService.addAvailabilitySlot(doctorId, slotStartISO);
    return supabaseDoctorService.addAvailabilitySlot(doctorId, slotStartISO);
  },

  async removeAvailabilitySlot(slotId) {
    if (isDemoMode()) return mockDoctorService.removeAvailabilitySlot(slotId);
    return supabaseDoctorService.removeAvailabilitySlot(slotId);
  },

  async getDoctorTodayAttendance(doctorId) {
    if (isDemoMode()) return mockDoctorService.getDoctorTodayAttendance(doctorId);
    return supabaseDoctorService.getDoctorTodayAttendance(doctorId);
  },

  async checkInDoctor(doctorId, status = 'present') {
    if (isDemoMode()) return mockDoctorService.checkInDoctor(doctorId, status);
    return supabaseDoctorService.checkInDoctor(doctorId, status);
  },

  async getDoctorAttendanceHistory(doctorId) {
    if (isDemoMode()) return mockDoctorService.getDoctorAttendanceHistory(doctorId);
    return supabaseDoctorService.getDoctorAttendanceHistory(doctorId);
  },
};

export default doctorService;
