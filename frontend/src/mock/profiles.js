/**
 * Mock Profiles Seed Data
 * Schema: id, full_name, role ('patient'|'doctor'|'admin'), specialty
 * All emails use the reserved example.com domain for privacy and demo safety.
 */
export const MOCK_PROFILES = [
  // Doctors (6)
  {
    id: 'doc_1',
    full_name: 'Dr. Sarah Jenkins',
    role: 'doctor',
    specialty: 'Cardiology',
    email: 'dr.jenkins@example.com',
  },
  {
    id: 'doc_2',
    full_name: 'Dr. Marcus Vance',
    role: 'doctor',
    specialty: 'Neurology',
    email: 'dr.vance@example.com',
  },
  {
    id: 'doc_3',
    full_name: 'Dr. Elena Rostova',
    role: 'doctor',
    specialty: 'Pediatrics',
    email: 'dr.rostova@example.com',
  },
  {
    id: 'doc_4',
    full_name: 'Dr. David Chen',
    role: 'doctor',
    specialty: 'Orthopedics',
    email: 'dr.chen@example.com',
  },
  {
    id: 'doc_5',
    full_name: 'Dr. Priya Sharma',
    role: 'doctor',
    specialty: 'Dermatology',
    email: 'dr.sharma@example.com',
  },
  {
    id: 'doc_6',
    full_name: 'Dr. James Wilson',
    role: 'doctor',
    specialty: 'Internal Medicine',
    email: 'dr.wilson@example.com',
  },

  // Patients (8)
  {
    id: 'pat_1',
    full_name: 'Eleanor Campbell',
    role: 'patient',
    specialty: null,
    email: 'eleanor.campbell@example.com',
  },
  {
    id: 'pat_2',
    full_name: 'Robert Hayes',
    role: 'patient',
    specialty: null,
    email: 'robert.hayes@example.com',
  },
  {
    id: 'pat_3',
    full_name: 'Sofia Martinez',
    role: 'patient',
    specialty: null,
    email: 'sofia.martinez@example.com',
  },
  {
    id: 'pat_4',
    full_name: 'Liam Johnson',
    role: 'patient',
    specialty: null,
    email: 'liam.johnson@example.com',
  },
  {
    id: 'pat_5',
    full_name: 'Maya Patel',
    role: 'patient',
    specialty: null,
    email: 'maya.patel@example.com',
  },
  {
    id: 'pat_6',
    full_name: 'Benjamin Lee',
    role: 'patient',
    specialty: null,
    email: 'benjamin.lee@example.com',
  },
  {
    id: 'pat_7',
    full_name: 'Grace Taylor',
    role: 'patient',
    specialty: null,
    email: 'grace.taylor@example.com',
  },
  {
    id: 'pat_8',
    full_name: 'Samuel Green',
    role: 'patient',
    specialty: null,
    email: 'samuel.green@example.com',
  },

  // Admin (1)
  {
    id: 'admin_1',
    full_name: 'Arthur King',
    role: 'admin',
    specialty: 'Hospital Operations',
    email: 'admin@example.com',
  },
];
