import { supabase } from '../../lib/supabaseClient';

function formatSupabaseAppointment(apt) {
  return {
    ...apt,
    doctor: apt.doctor || null,
    patient: apt.patient || null,
    slot_start: apt.slot ? apt.slot.slot_start : apt.slot_start || apt.created_at,
  };
}

export const supabaseAppointmentService = {
  /**
   * Get all appointments for a patient joined with doctor's profile and slot
   */
  async getAppointmentsByPatient(patientId) {
    if (!supabase) return [];

    let { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        doctor:profiles!doctor_id(id, full_name, specialty),
        slot:availability_slots!slot_id(slot_start)
      `)
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) {
      const fallback = await supabase
        .from('appointments')
        .select(`
          *,
          doctor:profiles!appointments_doctor_id_fkey(id, full_name, specialty),
          slot:availability_slots!appointments_slot_id_fkey(slot_start)
        `)
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      throw new Error('Unable to load your appointments.');
    }

    const formatted = (data || []).map(formatSupabaseAppointment);
    // Sort by slot_start descending
    return formatted.sort((a, b) => new Date(b.slot_start) - new Date(a.slot_start));
  },

  /**
   * Get next upcoming scheduled appointment for patient
   */
  async getNextUpcomingAppointment(patientId) {
    if (!supabase) return null;

    const list = await this.getAppointmentsByPatient(patientId);
    const scheduled = list.filter((a) => a.status === 'scheduled');
    // Sort ascending to get earliest upcoming
    scheduled.sort((a, b) => new Date(a.slot_start) - new Date(b.slot_start));
    return scheduled[0] || null;
  },

  /**
   * Get all appointments for a doctor joined with patient profile and slot
   */
  async getAppointmentsByDoctor(doctorId) {
    if (!supabase) return [];

    let { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:profiles!patient_id(id, full_name, email),
        slot:availability_slots!slot_id(slot_start)
      `)
      .eq('doctor_id', doctorId)
      .order('created_at', { ascending: false });

    if (error) {
      const fallback = await supabase
        .from('appointments')
        .select(`
          *,
          patient:profiles!appointments_patient_id_fkey(id, full_name, email),
          slot:availability_slots!appointments_slot_id_fkey(slot_start)
        `)
        .eq('doctor_id', doctorId)
        .order('created_at', { ascending: false });
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      throw new Error('Unable to load appointments roster.');
    }

    const formatted = (data || []).map(formatSupabaseAppointment);
    return formatted.sort((a, b) => new Date(b.slot_start) - new Date(a.slot_start));
  },

  /**
   * Book an appointment via RPC: book_slot(p_slot_id, p_symptoms)
   */
  async bookAppointment({ slot_id, symptoms }) {
    if (!supabase) throw new Error('Supabase is not configured.');

    const { data, error } = await supabase.rpc('book_slot', {
      p_slot_id: slot_id,
      p_symptoms: symptoms?.trim(),
    });

    if (error) {
      const msg = error.message?.toLowerCase() || '';
      if (msg.includes('booked') || msg.includes('taken') || msg.includes('slot')) {
        throw new Error('This time slot was just taken. Please choose another slot.');
      }
      throw new Error(error.message || 'Unable to complete appointment booking.');
    }

    return data;
  },

  /**
   * Cancel an appointment via RPC: cancel_appointment(p_appointment_id)
   */
  async cancelAppointment(appointmentId) {
    if (!supabase) throw new Error('Supabase is not configured.');

    const { data, error } = await supabase.rpc('cancel_appointment', {
      p_appointment_id: appointmentId,
    });

    if (error) {
      throw new Error(error.message || 'Unable to cancel this appointment.');
    }

    return data;
  },
};

export default supabaseAppointmentService;
