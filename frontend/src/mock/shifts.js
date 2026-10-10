/**
 * Mock Shifts Seed Data
 * Schema: id, doctor_id, shift_date (YYYY-MM-DD), shift_type ('morning'|'evening'|'night')
 * 7 days of shifts for 6 doctors
 */

export const MOCK_SHIFTS = [
  // Thursday 2026-10-08
  { id: 'shf_01', doctor_id: 'doc_1', shift_date: '2026-10-08', shift_type: 'morning' },
  { id: 'shf_02', doctor_id: 'doc_2', shift_date: '2026-10-08', shift_type: 'morning' },
  { id: 'shf_03', doctor_id: 'doc_4', shift_date: '2026-10-08', shift_type: 'evening' },
  { id: 'shf_04', doctor_id: 'doc_6', shift_date: '2026-10-08', shift_type: 'night' },

  // Friday 2026-10-09
  { id: 'shf_05', doctor_id: 'doc_1', shift_date: '2026-10-09', shift_type: 'morning' },
  { id: 'shf_06', doctor_id: 'doc_3', shift_date: '2026-10-09', shift_type: 'morning' },
  { id: 'shf_07', doctor_id: 'doc_5', shift_date: '2026-10-09', shift_type: 'evening' },
  { id: 'shf_08', doctor_id: 'doc_2', shift_date: '2026-10-09', shift_type: 'night' },

  // Saturday 2026-10-10
  { id: 'shf_09', doctor_id: 'doc_4', shift_date: '2026-10-10', shift_type: 'morning' },
  { id: 'shf_10', doctor_id: 'doc_6', shift_date: '2026-10-10', shift_type: 'evening' },
  // Under-covered night shift on Saturday

  // Sunday 2026-10-11
  { id: 'shf_11', doctor_id: 'doc_3', shift_date: '2026-10-11', shift_type: 'morning' },
  { id: 'shf_12', doctor_id: 'doc_5', shift_date: '2026-10-11', shift_type: 'night' },

  // Monday 2026-10-12
  { id: 'shf_13', doctor_id: 'doc_1', shift_date: '2026-10-12', shift_type: 'morning' },
  { id: 'shf_14', doctor_id: 'doc_2', shift_date: '2026-10-12', shift_type: 'morning' },
  { id: 'shf_15', doctor_id: 'doc_3', shift_date: '2026-10-12', shift_type: 'evening' },
  { id: 'shf_16', doctor_id: 'doc_4', shift_date: '2026-10-12', shift_type: 'night' },

  // Tuesday 2026-10-13
  { id: 'shf_17', doctor_id: 'doc_5', shift_date: '2026-10-13', shift_type: 'morning' },
  { id: 'shf_18', doctor_id: 'doc_6', shift_date: '2026-10-13', shift_type: 'morning' },
  { id: 'shf_19', doctor_id: 'doc_1', shift_date: '2026-10-13', shift_type: 'evening' },
  { id: 'shf_20', doctor_id: 'doc_2', shift_date: '2026-10-13', shift_type: 'night' },

  // Wednesday 2026-10-14
  { id: 'shf_21', doctor_id: 'doc_3', shift_date: '2026-10-14', shift_type: 'morning' },
  { id: 'shf_22', doctor_id: 'doc_4', shift_date: '2026-10-14', shift_type: 'morning' },
  { id: 'shf_23', doctor_id: 'doc_5', shift_date: '2026-10-14', shift_type: 'evening' },
  { id: 'shf_24', doctor_id: 'doc_6', shift_date: '2026-10-14', shift_type: 'night' },
];
