/**
 * Mock Availability Slots Seed Data
 * Schema: id, doctor_id, slot_start (ISO string), is_booked (boolean)
 */

export const MOCK_AVAILABILITY_SLOTS = [
  // Dr. Sarah Jenkins (doc_1) - Cardiology
  { id: 'slot_1', doctor_id: 'doc_1', slot_start: '2026-10-12T09:00:00.000Z', is_booked: true },
  { id: 'slot_2', doctor_id: 'doc_1', slot_start: '2026-10-12T10:00:00.000Z', is_booked: false },
  { id: 'slot_3', doctor_id: 'doc_1', slot_start: '2026-10-12T11:30:00.000Z', is_booked: false },
  { id: 'slot_4', doctor_id: 'doc_1', slot_start: '2026-10-13T09:30:00.000Z', is_booked: false },
  { id: 'slot_5', doctor_id: 'doc_1', slot_start: '2026-10-13T14:00:00.000Z', is_booked: false },
  { id: 'slot_6', doctor_id: 'doc_1', slot_start: '2026-10-14T10:00:00.000Z', is_booked: false },
  { id: 'slot_7', doctor_id: 'doc_1', slot_start: '2026-10-15T15:30:00.000Z', is_booked: false },

  // Dr. Marcus Vance (doc_2) - Neurology
  { id: 'slot_8', doctor_id: 'doc_2', slot_start: '2026-10-12T09:30:00.000Z', is_booked: true },
  { id: 'slot_9', doctor_id: 'doc_2', slot_start: '2026-10-12T11:00:00.000Z', is_booked: false },
  { id: 'slot_10', doctor_id: 'doc_2', slot_start: '2026-10-13T10:00:00.000Z', is_booked: false },
  { id: 'slot_11', doctor_id: 'doc_2', slot_start: '2026-10-13T13:30:00.000Z', is_booked: false },
  { id: 'slot_12', doctor_id: 'doc_2', slot_start: '2026-10-14T09:00:00.000Z', is_booked: false },
  { id: 'slot_13', doctor_id: 'doc_2', slot_start: '2026-10-15T14:00:00.000Z', is_booked: false },

  // Dr. Elena Rostova (doc_3) - Pediatrics
  { id: 'slot_14', doctor_id: 'doc_3', slot_start: '2026-10-12T10:00:00.000Z', is_booked: false },
  { id: 'slot_15', doctor_id: 'doc_3', slot_start: '2026-10-12T11:00:00.000Z', is_booked: true },
  { id: 'slot_16', doctor_id: 'doc_3', slot_start: '2026-10-13T09:00:00.000Z', is_booked: false },
  { id: 'slot_17', doctor_id: 'doc_3', slot_start: '2026-10-13T10:30:00.000Z', is_booked: false },
  { id: 'slot_18', doctor_id: 'doc_3', slot_start: '2026-10-14T11:30:00.000Z', is_booked: false },
  { id: 'slot_19', doctor_id: 'doc_3', slot_start: '2026-10-15T16:00:00.000Z', is_booked: false },

  // Dr. David Chen (doc_4) - Orthopedics
  { id: 'slot_20', doctor_id: 'doc_4', slot_start: '2026-10-12T08:30:00.000Z', is_booked: false },
  { id: 'slot_21', doctor_id: 'doc_4', slot_start: '2026-10-12T10:00:00.000Z', is_booked: false },
  { id: 'slot_22', doctor_id: 'doc_4', slot_start: '2026-10-13T14:30:00.000Z', is_booked: false },
  { id: 'slot_23', doctor_id: 'doc_4', slot_start: '2026-10-14T10:00:00.000Z', is_booked: false },
  { id: 'slot_24', doctor_id: 'doc_4', slot_start: '2026-10-15T11:00:00.000Z', is_booked: false },

  // Dr. Priya Sharma (doc_5) - Dermatology
  { id: 'slot_25', doctor_id: 'doc_5', slot_start: '2026-10-12T13:00:00.000Z', is_booked: false },
  { id: 'slot_26', doctor_id: 'doc_5', slot_start: '2026-10-12T14:30:00.000Z', is_booked: false },
  { id: 'slot_27', doctor_id: 'doc_5', slot_start: '2026-10-13T11:00:00.000Z', is_booked: false },
  { id: 'slot_28', doctor_id: 'doc_5', slot_start: '2026-10-14T09:30:00.000Z', is_booked: false },
  { id: 'slot_29', doctor_id: 'doc_5', slot_start: '2026-10-15T15:00:00.000Z', is_booked: false },

  // Dr. James Wilson (doc_6) - Internal Medicine
  { id: 'slot_30', doctor_id: 'doc_6', slot_start: '2026-10-12T09:00:00.000Z', is_booked: true },
  { id: 'slot_31', doctor_id: 'doc_6', slot_start: '2026-10-12T10:30:00.000Z', is_booked: false },
  { id: 'slot_32', doctor_id: 'doc_6', slot_start: '2026-10-13T09:30:00.000Z', is_booked: false },
  { id: 'slot_33', doctor_id: 'doc_6', slot_start: '2026-10-13T11:30:00.000Z', is_booked: false },
  { id: 'slot_34', doctor_id: 'doc_6', slot_start: '2026-10-14T14:00:00.000Z', is_booked: false },
  { id: 'slot_35', doctor_id: 'doc_6', slot_start: '2026-10-15T10:00:00.000Z', is_booked: false },
  { id: 'slot_36', doctor_id: 'doc_6', slot_start: '2026-10-16T11:00:00.000Z', is_booked: false },
];
