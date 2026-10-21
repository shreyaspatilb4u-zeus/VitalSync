import { isDemoMode } from './mode';
import { mockEmergencyService } from './mock/emergencyService';
import { supabaseEmergencyService } from './supabase/emergencyService';

export const emergencyService = {
  async createEmergencyRequest({ patient_id, description, severity }) {
    if (isDemoMode()) {
      return mockEmergencyService.createEmergencyRequest({
        patient_id,
        description,
        severity,
      });
    }
    return supabaseEmergencyService.createEmergencyRequest({
      patient_id,
      description,
      severity,
    });
  },

  async getEmergencyQueue() {
    if (isDemoMode()) {
      return mockEmergencyService.getEmergencyQueue();
    }
    return supabaseEmergencyService.getEmergencyQueue();
  },

  async getActiveRequestForPatient(patientId) {
    if (isDemoMode()) {
      return mockEmergencyService.getActiveRequestForPatient(patientId);
    }
    return supabaseEmergencyService.getActiveRequestForPatient(patientId);
  },

  async updateEmergencyStatus(id, newStatus) {
    if (isDemoMode()) {
      return mockEmergencyService.updateEmergencyStatus(id, newStatus);
    }
    return supabaseEmergencyService.updateEmergencyStatus(id, newStatus);
  },

  async getAdminEmergencyLog() {
    if (isDemoMode()) {
      return mockEmergencyService.getAdminEmergencyLog();
    }
    return supabaseEmergencyService.getAdminEmergencyLog();
  },
};

export default emergencyService;
