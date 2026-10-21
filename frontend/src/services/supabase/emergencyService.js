import { supabase } from '../../lib/supabaseClient';

const SEVERITY_WEIGHT = {
  critical: 3,
  high: 2,
  moderate: 1,
};

function hydrateEmergency(emg) {
  return {
    ...emg,
    patient_name: emg.patient ? emg.patient.full_name : 'Patient Record',
  };
}

export const supabaseEmergencyService = {
  /**
   * Submit an emergency triage request
   */
  async createEmergencyRequest({ patient_id, description, severity }) {
    if (!supabase) throw new Error('Supabase is not configured.');

    const trimmedDesc = description?.trim() || '';
    if (!trimmedDesc || !severity) {
      throw new Error('Please describe the emergency and specify the severity.');
    }

    let { data, error } = await supabase
      .from('emergency_requests')
      .insert({
        patient_id,
        description: trimmedDesc,
        severity,
        status: 'pending',
      })
      .select('*, patient:profiles!patient_id(full_name)')
      .single();

    if (error) {
      const fallback = await supabase
        .from('emergency_requests')
        .insert({
          patient_id,
          description: trimmedDesc,
          severity,
          status: 'pending',
        })
        .select('*, patient:profiles!emergency_requests_patient_id_fkey(full_name)')
        .single();
      if (!fallback.error) {
        data = fallback.data;
        error = null;
      }
    }

    if (error) {
      const simple = await supabase
        .from('emergency_requests')
        .insert({
          patient_id,
          description: trimmedDesc,
          severity,
          status: 'pending',
        })
        .select()
        .single();
      data = simple.data;
      error = simple.error;
    }

    if (error) {
      throw new Error('Unable to submit emergency triage request.');
    }

    return hydrateEmergency(data);
  },

  /**
   * Get sorted emergency triage queue (Doctors & Clinical staff)
   * Sorted by severity descending (critical -> high -> moderate), then created_at ascending (oldest first)
   */
  async getEmergencyQueue() {
    if (!supabase) return [];

    let { data, error } = await supabase
      .from('emergency_requests')
      .select('*, patient:profiles!patient_id(full_name)')
      .order('created_at', { ascending: true });

    if (error) {
      const fallback = await supabase
        .from('emergency_requests')
        .select('*, patient:profiles!emergency_requests_patient_id_fkey(full_name)')
        .order('created_at', { ascending: true });
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      throw new Error('Unable to load emergency queue.');
    }

    const hydrated = (data || []).map(hydrateEmergency);

    return hydrated.sort((a, b) => {
      const diff = (SEVERITY_WEIGHT[b.severity] || 0) - (SEVERITY_WEIGHT[a.severity] || 0);
      if (diff !== 0) return diff;
      return new Date(a.created_at) - new Date(b.created_at);
    });
  },

  /**
   * Get patient's latest active emergency request and queue position
   */
  async getActiveRequestForPatient(patientId) {
    if (!supabase) return null;

    let { data, error } = await supabase
      .from('emergency_requests')
      .select('*, patient:profiles!patient_id(full_name)')
      .eq('patient_id', patientId)
      .neq('status', 'resolved')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      const fallback = await supabase
        .from('emergency_requests')
        .select('*, patient:profiles!emergency_requests_patient_id_fkey(full_name)')
        .eq('patient_id', patientId)
        .neq('status', 'resolved')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      data = fallback.data;
      error = fallback.error;
    }

    if (error || !data) {
      return null;
    }

    // Calculate queue position among non-resolved items in the emergency queue
    let queue = [];
    try {
      queue = await this.getEmergencyQueue();
    } catch {
      queue = [data];
    }
    const activeQueue = (queue || []).filter((e) => e.status !== 'resolved');
    const index = activeQueue.findIndex((e) => e.id === data.id);

    return {
      ...hydrateEmergency(data),
      queue_position: index >= 0 ? index + 1 : 1,
      total_in_queue: activeQueue.length,
    };
  },

  /**
   * Read all emergency requests belonging to a specific patient for status history
   */
  async getPatientEmergencyRequests(patientId) {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('emergency_requests')
      .select('id, patient_id, description, severity, status, created_at')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error('Unable to load emergency history.');
    }

    return (data || []).map((e) => ({
      ...e,
      patient_name: 'You',
    }));
  },

  /**
   * Update emergency request status (Acknowledge or Resolve)
   */
  async updateEmergencyStatus(id, newStatus) {
    if (!supabase) throw new Error('Supabase is not configured.');

    let { data, error } = await supabase
      .from('emergency_requests')
      .update({ status: newStatus })
      .eq('id', id)
      .select('*, patient:profiles!patient_id(full_name)')
      .single();

    if (error) {
      const fallback = await supabase
        .from('emergency_requests')
        .update({ status: newStatus })
        .eq('id', id)
        .select('*, patient:profiles!emergency_requests_patient_id_fkey(full_name)')
        .single();
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      const simple = await supabase
        .from('emergency_requests')
        .update({ status: newStatus })
        .eq('id', id)
        .select()
        .single();
      data = simple.data;
      error = simple.error;
    }

    if (error) {
      throw new Error('Unable to update emergency request status.');
    }

    return hydrateEmergency(data);
  },

  /**
   * Admin read-only view of all requests.
   * Privacy Rule: Never requests symptoms or medical details.
   * Returns only id, severity, status, created_at, patient identifier.
   */
  async getAdminEmergencyLog() {
    if (!supabase) return [];

    let { data, error } = await supabase
      .from('emergency_requests')
      .select('id, severity, status, created_at, patient:profiles!patient_id(full_name)')
      .order('created_at', { ascending: false });

    if (error) {
      const fallback = await supabase
        .from('emergency_requests')
        .select('id, severity, status, created_at, patient:profiles!emergency_requests_patient_id_fkey(full_name)')
        .order('created_at', { ascending: false });
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      throw new Error('Unable to load emergency operations log.');
    }

    return (data || []).map((e) => ({
      id: e.id,
      patient_name: e.patient ? e.patient.full_name : 'Patient Record',
      severity: e.severity,
      status: e.status,
      created_at: e.created_at,
    }));
  },
};

export default supabaseEmergencyService;
