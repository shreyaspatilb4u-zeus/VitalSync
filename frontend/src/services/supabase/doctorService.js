import { supabase } from '../../lib/supabaseClient';
import { toISODateString } from '../../lib/utils';

export const supabaseDoctorService = {
  /**
   * Get all doctors with optional specialty filtering
   */
  async getDoctors(specialty = 'all') {
    if (!supabase) return [];

    let query = supabase
      .from('profiles')
      .select('id, full_name, role, specialty, created_at')
      .eq('role', 'doctor')
      .order('full_name', { ascending: true });

    if (specialty && specialty !== 'all') {
      query = query.ilike('specialty', specialty);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error('Unable to fetch doctors directory.');
    }
    return data || [];
  },

  /**
   * Get unique list of doctor specialties
   */
  async getSpecialties() {
    if (!supabase) return [];

    const doctors = await this.getDoctors('all');
    const specialties = [...new Set(doctors.map((d) => d.specialty).filter(Boolean))];
    return specialties;
  },

  /**
   * Get doctor profile by ID
   */
  async getDoctorById(doctorId) {
    if (!supabase) throw new Error('Supabase is not configured.');

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role, specialty, created_at')
      .eq('id', doctorId)
      .eq('role', 'doctor')
      .single();

    if (error || !data) {
      throw new Error('Physician not found.');
    }
    return data;
  },

  /**
   * Get patient profile by ID
   */
  async getPatientById(patientId) {
    if (!supabase) throw new Error('Supabase is not configured.');

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role, specialty, created_at')
      .eq('id', patientId)
      .eq('role', 'patient')
      .single();

    if (error || !data) {
      throw new Error('Patient not found.');
    }
    return data;
  },

  /**
   * Get assigned patients roster for a doctor
   * Phase 3: appointments where doctor_id = current user, joined with patient profile, de-duplicated by patient
   */
  async getAssignedPatients(doctorId) {
    if (!supabase) return [];

    let { data, error } = await supabase
      .from('appointments')
      .select(`
        id,
        created_at,
        status,
        patient_id,
        patient:profiles!patient_id(id, full_name, email, role)
      `)
      .eq('doctor_id', doctorId)
      .order('created_at', { ascending: false });

    if (error) {
      const fallback = await supabase
        .from('appointments')
        .select(`
          id,
          created_at,
          status,
          patient_id,
          patient:profiles!appointments_patient_id_fkey(id, full_name, email, role)
        `)
        .eq('doctor_id', doctorId)
        .order('created_at', { ascending: false });
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      throw new Error('Unable to fetch assigned patients roster.');
    }

    const patientMap = new Map();

    (data || []).forEach((apt) => {
      const p = apt.patient;
      if (!p || !p.id) return;

      if (!patientMap.has(p.id)) {
        patientMap.set(p.id, {
          id: p.id,
          full_name: p.full_name,
          email: p.email,
          role: p.role,
          appointments: [],
        });
      }
      patientMap.get(p.id).appointments.push(apt);
    });

    return Array.from(patientMap.values()).map((pat) => {
      const apts = pat.appointments;
      const upcoming = apts.find((a) => a.status === 'scheduled');
      const past = apts
        .filter((a) => a.status === 'completed')
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

      return {
        id: pat.id,
        full_name: pat.full_name,
        email: pat.email,
        role: pat.role,
        last_visit: past ? past.created_at : null,
        next_appointment: upcoming ? upcoming.created_at : null,
        total_visits: apts.length,
      };
    });
  },

  /**
   * Get availability slots for a doctor
   */
  async getDoctorAvailability(doctorId) {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('availability_slots')
      .select('*')
      .eq('doctor_id', doctorId)
      .order('slot_start', { ascending: true });

    if (error) {
      throw new Error('Unable to fetch availability slots.');
    }

    return data || [];
  },

  /**
   * Add a new availability slot
   */
  async addAvailabilitySlot(doctorId, slotStartISO) {
    if (!supabase) throw new Error('Supabase is not configured.');

    const { data, error } = await supabase
      .from('availability_slots')
      .insert({
        doctor_id: doctorId,
        slot_start: slotStartISO,
        is_booked: false,
      })
      .select()
      .single();

    if (error) {
      throw new Error('Unable to create availability slot.');
    }

    return data;
  },

  /**
   * Remove an unbooked slot
   */
  async removeAvailabilitySlot(slotId) {
    if (!supabase) throw new Error('Supabase is not configured.');

    const { data, error } = await supabase
      .from('availability_slots')
      .delete()
      .eq('id', slotId)
      .eq('is_booked', false)
      .select();

    if (error || !data || data.length === 0) {
      throw new Error('Cannot remove slot. It may be booked or does not exist.');
    }

    return data[0];
  },

  /**
   * Get doctor's attendance for today
   */
  async getDoctorTodayAttendance(doctorId) {
    if (!supabase) return 'absent';

    const today = toISODateString(new Date());
    const { data, error } = await supabase
      .from('attendance')
      .select('status')
      .eq('doctor_id', doctorId)
      .eq('date', today)
      .maybeSingle();

    if (error || !data) {
      return 'absent';
    }

    return data.status || 'absent';
  },

  /**
   * Check in today's attendance status (handles unique conflict gracefully via upsert)
   */
  async checkInDoctor(doctorId, status = 'present') {
    if (!supabase) throw new Error('Supabase is not configured.');

    const today = toISODateString(new Date());
    const { data, error } = await supabase
      .from('attendance')
      .upsert(
        {
          doctor_id: doctorId,
          date: today,
          status,
        },
        { onConflict: 'doctor_id,date' }
      )
      .select()
      .single();

    if (error) {
      throw new Error('Unable to update attendance record.');
    }

    return data;
  },

  /**
   * Get recent 7 days attendance history for this doctor
   */
  async getDoctorAttendanceHistory(doctorId) {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('doctor_id', doctorId)
      .order('date', { ascending: false })
      .limit(7);

    if (error) {
      throw new Error('Unable to load attendance history.');
    }

    return data || [];
  },
};

export default supabaseDoctorService;
