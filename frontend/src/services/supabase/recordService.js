import { supabase } from '../../lib/supabaseClient';

export const supabaseRecordService = {
  async getRecordsByPatient(patientId) {
    if (!supabase) return [];

    let { data, error } = await supabase
      .from('medical_records')
      .select('*, doctor:profiles!doctor_id(id, full_name, specialty)')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) {
      const fallback = await supabase
        .from('medical_records')
        .select('*, doctor:profiles!medical_records_doctor_id_fkey(id, full_name, specialty)')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      throw new Error('Unable to fetch patient medical records.');
    }

    return (data || []).map((rec) => ({
      ...rec,
      doctor: rec.doctor || null,
    }));
  },

  async addRecord({ patient_id, doctor_id, title, notes }) {
    if (!supabase) throw new Error('Supabase is not configured.');

    let { data, error } = await supabase
      .from('medical_records')
      .insert({
        patient_id,
        doctor_id,
        title: title.trim(),
        notes: notes.trim(),
      })
      .select('*, doctor:profiles!doctor_id(id, full_name, specialty)')
      .single();

    if (error) {
      const fallback = await supabase
        .from('medical_records')
        .insert({
          patient_id,
          doctor_id,
          title: title.trim(),
          notes: notes.trim(),
        })
        .select('*, doctor:profiles!medical_records_doctor_id_fkey(id, full_name, specialty)')
        .single();
      if (!fallback.error) {
        data = fallback.data;
        error = null;
      }
    }

    if (error) {
      const simple = await supabase
        .from('medical_records')
        .insert({
          patient_id,
          doctor_id,
          title: title.trim(),
          notes: notes.trim(),
        })
        .select()
        .single();
      data = simple.data;
      error = simple.error;
    }

    if (error) {
      throw new Error('Unable to save clinical encounter record.');
    }

    return {
      ...data,
      doctor: data.doctor || null,
    };
  },
};

export default supabaseRecordService;
