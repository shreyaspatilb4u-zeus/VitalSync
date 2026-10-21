import { MOCK_PROFILES } from '../../mock/profiles';
import { MOCK_ATTENDANCE } from '../../mock/attendance';
import { MOCK_SHIFTS } from '../../mock/shifts';
import { MOCK_EMERGENCY_REQUESTS } from '../../mock/emergencyRequests';
import { MOCK_APPOINTMENTS } from '../../mock/appointments';
import { generateId, toISODateString } from '../../lib/utils';

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

const REFERENCE_TODAY = '2026-10-08';

function getEffectiveToday() {
  const machineDate = toISODateString(new Date());
  const hasRecords = MOCK_ATTENDANCE.some((a) => a.date === machineDate);
  return hasRecords ? machineDate : REFERENCE_TODAY;
}

export const mockAdminService = {
  async getStaffRoster() {
    await delay(250);
    const today = getEffectiveToday();
    const doctors = MOCK_PROFILES.filter((p) => p.role === 'doctor');

    return doctors.map((doc) => {
      const todayAttendance = MOCK_ATTENDANCE.find(
        (a) => a.doctor_id === doc.id && a.date === today
      );
      return {
        ...doc,
        today_status: todayAttendance ? todayAttendance.status : 'present',
      };
    });
  },

  async getDailyAttendance(dateString) {
    await delay(250);
    const date = dateString || getEffectiveToday();
    const doctors = MOCK_PROFILES.filter((p) => p.role === 'doctor');

    return doctors.map((doc) => {
      const rec = MOCK_ATTENDANCE.find(
        (a) => a.doctor_id === doc.id && a.date === date
      );
      return {
        doctor_id: doc.id,
        doctor_name: doc.full_name,
        specialty: doc.specialty,
        date,
        status: rec ? rec.status : 'absent',
      };
    });
  },

  async updateDoctorAttendance(doctorId, date, status) {
    await delay(200);
    let record = MOCK_ATTENDANCE.find(
      (a) => a.doctor_id === doctorId && a.date === date
    );

    if (record) {
      record.status = status;
    } else {
      record = {
        id: generateId('att'),
        doctor_id: doctorId,
        date,
        status,
      };
      MOCK_ATTENDANCE.push(record);
    }
    return record;
  },

  async saveBulkAttendance(date, attendanceList) {
    await delay(300);
    for (const item of attendanceList) {
      await this.updateDoctorAttendance(item.doctor_id, date, item.status);
    }
    return true;
  },

  async getShifts() {
    await delay(250);
    return [...MOCK_SHIFTS];
  },

  async updateShift(doctorId, shift_date, shift_type) {
    await delay(200);
    let shift = MOCK_SHIFTS.find(
      (s) => s.doctor_id === doctorId && s.shift_date === shift_date
    );

    if (shift) {
      if (!shift_type || shift_type === 'off') {
        const idx = MOCK_SHIFTS.indexOf(shift);
        MOCK_SHIFTS.splice(idx, 1);
        return null;
      }
      shift.shift_type = shift_type;
      return shift;
    } else if (shift_type && shift_type !== 'off') {
      const newShift = {
        id: generateId('shf'),
        doctor_id: doctorId,
        shift_date,
        shift_type,
      };
      MOCK_SHIFTS.push(newShift);
      return newShift;
    }
    return null;
  },

  async getHospitalStats() {
    await delay(300);
    const today = getEffectiveToday();

    const todayAttendance = MOCK_ATTENDANCE.filter((a) => a.date === today);
    const present = todayAttendance.filter((a) => a.status === 'present').length;
    const absent = todayAttendance.filter((a) => a.status === 'absent').length;
    const onLeave = todayAttendance.filter((a) => a.status === 'on_leave').length;

    const pendingEmergencies = MOCK_EMERGENCY_REQUESTS.filter(
      (e) => e.status === 'pending'
    ).length;

    const appointmentsToday = MOCK_APPOINTMENTS.filter((a) => {
      return a.created_at.startsWith(today) || (a.slot_id && a.status === 'scheduled');
    }).length;

    return {
      present_today: present || 4,
      absent_today: absent || 1,
      on_leave_today: onLeave || 1,
      pending_emergencies: pendingEmergencies,
      appointments_today: appointmentsToday || 4,
    };
  },
};

export default mockAdminService;
