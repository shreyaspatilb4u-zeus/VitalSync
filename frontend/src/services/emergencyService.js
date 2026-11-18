import { isDemoMode } from './mode';
import { mockEmergencyService } from './mock/emergencyService';
import { supabaseEmergencyService } from './supabase/emergencyService';
import { countChars, MAX_CHAR_LIMIT } from '../lib/utils';

export const emergencyService = {
  async createEmergencyRequest({ patient_id, description, severity }) {
    if (countChars(description) > MAX_CHAR_LIMIT) {
      throw new Error(`Emergency description cannot exceed ${MAX_CHAR_LIMIT} characters.`);
    }

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

  async getPatientEmergencyRequests(patientId) {
    if (isDemoMode()) {
      return mockEmergencyService.getPatientEmergencyRequests(patientId);
    }
    return supabaseEmergencyService.getPatientEmergencyRequests(patientId);
  },

  async getAdminEmergencyLog() {
    if (isDemoMode()) {
      return mockEmergencyService.getAdminEmergencyLog();
    }
    return supabaseEmergencyService.getAdminEmergencyLog();
  },
};

export default emergencyService;
