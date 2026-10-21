import { supabase } from '../../lib/supabaseClient';
import { toISODateString } from '../../lib/utils';

export const supabaseAdminService = {
  /**
   * Get all doctors roster with today's attendance status
   */
  async getStaffRoster() {
    if (!supabase) return [];

    const today = toISODateString(new Date());

    const [doctorsRes, attendanceRes] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, full_name, role, specialty, created_at')
        .eq('role', 'doctor')
        .order('full_name', { ascending: true }),
      supabase
        .from('attendance')
        .select('doctor_id, status')
        .eq('date', today),
    ]);

    if (doctorsRes.error) {
      throw new Error('Unable to fetch medical staff directory.');
    }

    const attendanceMap = new Map();
    (attendanceRes.data || []).forEach((a) => {
      attendanceMap.set(a.doctor_id, a.status);
    });

    return (doctorsRes.data || []).map((doc) => ({
      ...doc,
      today_status: attendanceMap.get(doc.id) || 'absent',
    }));
  },

  /**
   * Get attendance for a specific date
   */
  async getDailyAttendance(dateString) {
    if (!supabase) return [];

    const date = dateString || toISODateString(new Date());

    const [doctorsRes, attendanceRes] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, full_name, specialty')
        .eq('role', 'doctor')
        .order('full_name', { ascending: true }),
      supabase
        .from('attendance')
        .select('doctor_id, status, date')
        .eq('date', date),
    ]);

    if (doctorsRes.error) {
      throw new Error('Unable to fetch daily attendance.');
    }

    const attendanceMap = new Map();
    (attendanceRes.data || []).forEach((a) => {
      attendanceMap.set(a.doctor_id, a.status);
    });

    return (doctorsRes.data || []).map((doc) => ({
      doctor_id: doc.id,
      doctor_name: doc.full_name,
      specialty: doc.specialty,
      date,
      status: attendanceMap.get(doc.id) || 'absent',
    }));
  },

  /**
   * Update or upsert attendance for a doctor on a date
   */
  async updateDoctorAttendance(doctorId, date, status) {
    if (!supabase) throw new Error('Supabase is not configured.');

    const { data, error } = await supabase
      .from('attendance')
      .upsert(
        {
          doctor_id: doctorId,
          date,
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
   * Bulk save attendance for multiple doctors
   */
  async saveBulkAttendance(date, attendanceList) {
    if (!supabase) throw new Error('Supabase is not configured.');

    const records = attendanceList.map((item) => ({
      doctor_id: item.doctor_id,
      date,
      status: item.status,
    }));

    const { error } = await supabase
      .from('attendance')
      .upsert(records, { onConflict: 'doctor_id,date' });

    if (error) {
      throw new Error('Unable to save bulk attendance.');
    }

    return true;
  },

  /**
   * Get all shift assignments
   */
  async getShifts() {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .order('shift_date', { ascending: true });

    if (error) {
      throw new Error('Unable to load shift schedule.');
    }

    return data || [];
  },

  /**
   * Assign, update or clear shift:
   * set = delete that doctor/day rows then insert; clear = delete
   */
  async updateShift(doctorId, shift_date, shift_type) {
    if (!supabase) throw new Error('Supabase is not configured.');

    // First delete existing shifts for this doctor on this day
    const { error: delError } = await supabase
      .from('shifts')
      .delete()
      .eq('doctor_id', doctorId)
      .eq('shift_date', shift_date);

    if (delError) {
      throw new Error('Unable to clear previous shift assignment.');
    }

    if (!shift_type || shift_type === 'off') {
      return null;
    }

    // Insert new shift
    const { data, error: insError } = await supabase
      .from('shifts')
      .insert({
        doctor_id: doctorId,
        shift_date,
        shift_type,
      })
      .select()
      .single();

    if (insError) {
      throw new Error('Unable to assign shift.');
    }

    return data;
  },

  /**
   * Get hospital operations metrics
   */
  async getHospitalStats() {
    if (!supabase) return null;

    const today = toISODateString(new Date());

    const [doctorsRes, attendanceRes, emergenciesRes, appointmentsRes] = await Promise.all([
      supabase.from('profiles').select('id').eq('role', 'doctor'),
      supabase.from('attendance').select('doctor_id, status').eq('date', today),
      supabase.from('emergency_requests').select('id').eq('status', 'pending'),
      supabase
        .from('appointments')
        .select('id, status, created_at')
        .eq('status', 'scheduled'),
    ]);

    const totalDoctors = doctorsRes.data ? doctorsRes.data.length : 0;
    const attList = attendanceRes.data || [];
    const present = attList.filter((a) => a.status === 'present').length;
    const onLeave = attList.filter((a) => a.status === 'on_leave').length;
    const markedAbsent = attList.filter((a) => a.status === 'absent').length;

    // Absent includes doctors explicitly marked absent plus doctors who have not checked in yet
    const checkedInCount = present + onLeave + markedAbsent;
    const absent = markedAbsent + Math.max(0, totalDoctors - checkedInCount);

    const pendingEmergencies = emergenciesRes.data ? emergenciesRes.data.length : 0;
    const appointmentsToday = appointmentsRes.data ? appointmentsRes.data.length : 0;

    return {
      total_doctors: totalDoctors,
      present_today: present,
      absent_today: absent,
      on_leave_today: onLeave,
      pending_emergencies: pendingEmergencies,
      appointments_today: appointmentsToday,
    };
  },
};

export default supabaseAdminService;
