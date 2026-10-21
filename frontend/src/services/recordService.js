import { isDemoMode } from './mode';
import { mockRecordService } from './mock/recordService';
import { supabaseRecordService } from './supabase/recordService';

export const recordService = {
  async getRecordsByPatient(patientId) {
    if (isDemoMode()) {
      return mockRecordService.getRecordsByPatient(patientId);
    }
    return supabaseRecordService.getRecordsByPatient(patientId);
  },

  async addRecord({ patient_id, doctor_id, title, notes }) {
    if (isDemoMode()) {
      return mockRecordService.addRecord({ patient_id, doctor_id, title, notes });
    }
    return supabaseRecordService.addRecord({ patient_id, doctor_id, title, notes });
  },
};

export default recordService;
