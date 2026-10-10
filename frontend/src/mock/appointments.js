/**
 * Mock Appointments Seed Data
 * Schema: id, patient_id, doctor_id, slot_id, symptoms, status ('scheduled'|'completed'|'cancelled'), created_at
 */

export const MOCK_APPOINTMENTS = [
  // Upcoming appointment for Eleanor Campbell (pat_1) with Dr. Sarah Jenkins (doc_1)
  {
    id: 'apt_101',
    patient_id: 'pat_1',
    doctor_id: 'doc_1',
    slot_id: 'slot_1',
    symptoms: 'Intermittent chest palpitations and shortness of breath upon mild exertion.',
    status: 'scheduled',
    created_at: '2026-10-06T14:22:00.000Z',
  },
  // Upcoming appointment for Robert Hayes (pat_2) with Dr. Marcus Vance (doc_2)
  {
    id: 'apt_102',
    patient_id: 'pat_2',
    doctor_id: 'doc_2',
    slot_id: 'slot_8',
    symptoms: 'Recurring unilateral migraine with photophobia and dizziness.',
    status: 'scheduled',
    created_at: '2026-10-07T08:15:00.000Z',
  },
  // Upcoming appointment for Sofia Martinez (pat_3) with Dr. Elena Rostova (doc_3)
  {
    id: 'apt_103',
    patient_id: 'pat_3',
    doctor_id: 'doc_3',
    slot_id: 'slot_15',
    symptoms: 'Persistent dry cough, mild wheezing, and nocturnal restlessness.',
    status: 'scheduled',
    created_at: '2026-10-07T11:45:00.000Z',
  },
  // Upcoming appointment for Liam Johnson (pat_4) with Dr. James Wilson (doc_6)
  {
    id: 'apt_104',
    patient_id: 'pat_4',
    doctor_id: 'doc_6',
    slot_id: 'slot_30',
    symptoms: 'General lethargy, elevated fasting glucose logs, routine diabetic check-up.',
    status: 'scheduled',
    created_at: '2026-10-08T09:10:00.000Z',
  },

  // Past completed appointment for Eleanor Campbell (pat_1) with Dr. James Wilson (doc_6)
  {
    id: 'apt_105',
    patient_id: 'pat_1',
    doctor_id: 'doc_6',
    slot_id: null,
    symptoms: 'Annual health checkup, mild fatigue, and elevated blood pressure.',
    status: 'completed',
    created_at: '2026-09-15T10:00:00.000Z',
  },
  // Past completed appointment for Eleanor Campbell (pat_1) with Dr. Sarah Jenkins (doc_1)
  {
    id: 'apt_106',
    patient_id: 'pat_1',
    doctor_id: 'doc_1',
    slot_id: null,
    symptoms: 'Baseline ECG follow-up and discussion of antihypertensive regimen.',
    status: 'completed',
    created_at: '2026-09-28T14:30:00.000Z',
  },
  // Past cancelled appointment for Eleanor Campbell (pat_1) with Dr. David Chen (doc_4)
  {
    id: 'apt_107',
    patient_id: 'pat_1',
    doctor_id: 'doc_4',
    slot_id: null,
    symptoms: 'Mild knee stiffness after prolonged walking.',
    status: 'cancelled',
    created_at: '2026-09-01T11:00:00.000Z',
  },
  // Past completed appointment for Robert Hayes (pat_2) with Dr. Marcus Vance (doc_2)
  {
    id: 'apt_108',
    patient_id: 'pat_2',
    doctor_id: 'doc_2',
    slot_id: null,
    symptoms: 'Initial neurological consultation for tension headaches.',
    status: 'completed',
    created_at: '2026-09-20T09:30:00.000Z',
  },
  // Past completed appointment for Maya Patel (pat_5) with Dr. Priya Sharma (doc_5)
  {
    id: 'apt_109',
    patient_id: 'pat_5',
    doctor_id: 'doc_5',
    slot_id: null,
    symptoms: 'Eczematous flare-up on bilateral forearms.',
    status: 'completed',
    created_at: '2026-09-22T13:00:00.000Z',
  },
];
