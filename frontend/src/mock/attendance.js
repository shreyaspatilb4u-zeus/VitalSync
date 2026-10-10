/**
 * Mock Attendance Seed Data
 * Schema: id, doctor_id, date (YYYY-MM-DD), status ('present'|'absent'|'on_leave')
 * 7 days of attendance records for 6 doctors
 */

export const MOCK_ATTENDANCE = [
  // 2026-10-08 (Today)
  { id: 'att_01', doctor_id: 'doc_1', date: '2026-10-08', status: 'present' },
  { id: 'att_02', doctor_id: 'doc_2', date: '2026-10-08', status: 'present' },
  { id: 'att_03', doctor_id: 'doc_3', date: '2026-10-08', status: 'on_leave' },
  { id: 'att_04', doctor_id: 'doc_4', date: '2026-10-08', status: 'present' },
  { id: 'att_05', doctor_id: 'doc_5', date: '2026-10-08', status: 'absent' },
  { id: 'att_06', doctor_id: 'doc_6', date: '2026-10-08', status: 'present' },

  // 2026-10-07
  { id: 'att_07', doctor_id: 'doc_1', date: '2026-10-07', status: 'present' },
  { id: 'att_08', doctor_id: 'doc_2', date: '2026-10-07', status: 'present' },
  { id: 'att_09', doctor_id: 'doc_3', date: '2026-10-07', status: 'present' },
  { id: 'att_10', doctor_id: 'doc_4', date: '2026-10-07', status: 'present' },
  { id: 'att_11', doctor_id: 'doc_5', date: '2026-10-07', status: 'present' },
  { id: 'att_12', doctor_id: 'doc_6', date: '2026-10-07', status: 'present' },

  // 2026-10-06
  { id: 'att_13', doctor_id: 'doc_1', date: '2026-10-06', status: 'present' },
  { id: 'att_14', doctor_id: 'doc_2', date: '2026-10-06', status: 'absent' },
  { id: 'att_15', doctor_id: 'doc_3', date: '2026-10-06', status: 'present' },
  { id: 'att_16', doctor_id: 'doc_4', date: '2026-10-06', status: 'present' },
  { id: 'att_17', doctor_id: 'doc_5', date: '2026-10-06', status: 'present' },
  { id: 'att_18', doctor_id: 'doc_6', date: '2026-10-06', status: 'on_leave' },

  // 2026-10-05
  { id: 'att_19', doctor_id: 'doc_1', date: '2026-10-05', status: 'present' },
  { id: 'att_20', doctor_id: 'doc_2', date: '2026-10-05', status: 'present' },
  { id: 'att_21', doctor_id: 'doc_3', date: '2026-10-05', status: 'present' },
  { id: 'att_22', doctor_id: 'doc_4', date: '2026-10-05', status: 'present' },
  { id: 'att_23', doctor_id: 'doc_5', date: '2026-10-05', status: 'present' },
  { id: 'att_24', doctor_id: 'doc_6', date: '2026-10-05', status: 'present' },

  // 2026-10-04
  { id: 'att_25', doctor_id: 'doc_1', date: '2026-10-04', status: 'present' },
  { id: 'att_26', doctor_id: 'doc_2', date: '2026-10-04', status: 'present' },
  { id: 'att_27', doctor_id: 'doc_3', date: '2026-10-04', status: 'absent' },
  { id: 'att_28', doctor_id: 'doc_4', date: '2026-10-04', status: 'present' },
  { id: 'att_29', doctor_id: 'doc_5', date: '2026-10-04', status: 'present' },
  { id: 'att_30', doctor_id: 'doc_6', date: '2026-10-04', status: 'present' },

  // 2026-10-03
  { id: 'att_31', doctor_id: 'doc_1', date: '2026-10-03', status: 'on_leave' },
  { id: 'att_32', doctor_id: 'doc_2', date: '2026-10-03', status: 'present' },
  { id: 'att_33', doctor_id: 'doc_3', date: '2026-10-03', status: 'present' },
  { id: 'att_34', doctor_id: 'doc_4', date: '2026-10-03', status: 'present' },
  { id: 'att_35', doctor_id: 'doc_5', date: '2026-10-03', status: 'present' },
  { id: 'att_36', doctor_id: 'doc_6', date: '2026-10-03', status: 'present' },

  // 2026-10-02
  { id: 'att_37', doctor_id: 'doc_1', date: '2026-10-02', status: 'present' },
  { id: 'att_38', doctor_id: 'doc_2', date: '2026-10-02', status: 'present' },
  { id: 'att_39', doctor_id: 'doc_3', date: '2026-10-02', status: 'present' },
  { id: 'att_40', doctor_id: 'doc_4', date: '2026-10-02', status: 'on_leave' },
  { id: 'att_41', doctor_id: 'doc_5', date: '2026-10-02', status: 'present' },
  { id: 'att_42', doctor_id: 'doc_6', date: '2026-10-02', status: 'present' },
];
