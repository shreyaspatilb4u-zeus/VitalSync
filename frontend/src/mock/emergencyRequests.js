/**
 * Mock Emergency Requests Seed Data
 * Schema: id, patient_id, description, severity ('critical'|'high'|'moderate'), status ('pending'|'acknowledged'|'resolved'), created_at
 */

export const MOCK_EMERGENCY_REQUESTS = [
  {
    id: 'emg_001',
    patient_id: 'pat_2',
    description: 'Acute sudden crushing chest pain radiating to the left arm accompanied by heavy diaphoresis and acute nausea.',
    severity: 'critical',
    status: 'pending',
    created_at: '2026-10-08T20:15:00.000Z',
  },
  {
    id: 'emg_002',
    patient_id: 'pat_4',
    description: 'High fever 103.8°F with stiff neck, profound photophobia, confusion, and shivering over the last 3 hours.',
    severity: 'high',
    status: 'acknowledged',
    created_at: '2026-10-08T19:40:00.000Z',
  },
  {
    id: 'emg_003',
    patient_id: 'pat_7',
    description: 'Deep laceration on right forearm from workshop machinery with uncontrolled bleeding through initial pressure bandage.',
    severity: 'moderate',
    status: 'pending',
    created_at: '2026-10-08T21:05:00.000Z',
  },
];
