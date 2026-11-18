import { isDemoMode } from './mode';
import { mockRecordService } from './mock/recordService';
import { supabaseRecordService } from './supabase/recordService';
import { countWords, MAX_WORD_LIMIT } from '../lib/utils';

export const recordService = {
  async getRecordsByPatient(patientId) {
    if (isDemoMode()) {
      return mockRecordService.getRecordsByPatient(patientId);
    }
    return supabaseRecordService.getRecordsByPatient(patientId);
  },

  async addRecord({ patient_id, doctor_id, title, notes }) {
    if (countWords(title) > MAX_WORD_LIMIT) {
      throw new Error(`Note title cannot exceed ${MAX_WORD_LIMIT} words.`);
    }
    if (countWords(notes) > MAX_WORD_LIMIT) {
      throw new Error(`Clinical notes cannot exceed ${MAX_WORD_LIMIT} words.`);
    }

    if (isDemoMode()) {
      return mockRecordService.addRecord({ patient_id, doctor_id, title, notes });
    }
    return supabaseRecordService.addRecord({ patient_id, doctor_id, title, notes });
  },
};

export default recordService;
