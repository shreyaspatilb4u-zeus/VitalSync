import { isDemoMode } from './mode';
import { mockRecordService } from './mock/recordService';
import { supabaseRecordService } from './supabase/recordService';
import { countChars, MAX_CHAR_LIMIT } from '../lib/utils';

export const recordService = {
  async getRecordsByPatient(patientId) {
    if (isDemoMode()) {
      return mockRecordService.getRecordsByPatient(patientId);
    }
    return supabaseRecordService.getRecordsByPatient(patientId);
  },

  async addRecord({ patient_id, doctor_id, title, notes }) {
    if (countChars(title) > MAX_CHAR_LIMIT) {
      throw new Error(`Note title cannot exceed ${MAX_CHAR_LIMIT} characters.`);
    }
    if (countChars(notes) > MAX_CHAR_LIMIT) {
      throw new Error(`Clinical notes cannot exceed ${MAX_CHAR_LIMIT} characters.`);
    }

    if (isDemoMode()) {
      return mockRecordService.addRecord({ patient_id, doctor_id, title, notes });
    }
    return supabaseRecordService.addRecord({ patient_id, doctor_id, title, notes });
  },
};

export default recordService;
