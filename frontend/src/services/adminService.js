import { isDemoMode } from './mode';
import { mockAdminService } from './mock/adminService';
import { supabaseAdminService } from './supabase/adminService';

export const adminService = {
  async getStaffRoster() {
    if (isDemoMode()) return mockAdminService.getStaffRoster();
    return supabaseAdminService.getStaffRoster();
  },

  async getDailyAttendance(dateString) {
    if (isDemoMode()) return mockAdminService.getDailyAttendance(dateString);
    return supabaseAdminService.getDailyAttendance(dateString);
  },

  async updateDoctorAttendance(doctorId, date, status) {
    if (isDemoMode()) return mockAdminService.updateDoctorAttendance(doctorId, date, status);
    return supabaseAdminService.updateDoctorAttendance(doctorId, date, status);
  },

  async saveBulkAttendance(date, attendanceList) {
    if (isDemoMode()) return mockAdminService.saveBulkAttendance(date, attendanceList);
    return supabaseAdminService.saveBulkAttendance(date, attendanceList);
  },

  async getShifts() {
    if (isDemoMode()) return mockAdminService.getShifts();
    return supabaseAdminService.getShifts();
  },

  async updateShift(doctorId, shift_date, shift_type) {
    if (isDemoMode()) return mockAdminService.updateShift(doctorId, shift_date, shift_type);
    return supabaseAdminService.updateShift(doctorId, shift_date, shift_type);
  },

  async getHospitalStats() {
    if (isDemoMode()) return mockAdminService.getHospitalStats();
    return supabaseAdminService.getHospitalStats();
  },
};

export default adminService;
