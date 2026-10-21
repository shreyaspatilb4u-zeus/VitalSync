import { MOCK_MEDICAL_RECORDS } from '../../mock/medicalRecords';
import { MOCK_PROFILES } from '../../mock/profiles';
import { generateId } from '../../lib/utils';

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

function hydrateRecord(rec) {
  const doctor = MOCK_PROFILES.find((p) => p.id === rec.doctor_id);
  return {
    ...rec,
    doctor: doctor
      ? { id: doctor.id, full_name: doctor.full_name, specialty: doctor.specialty }
      : null,
  };
}

export const mockRecordService = {
  async getRecordsByPatient(patientId) {
    await delay(300);
    const records = MOCK_MEDICAL_RECORDS.filter((r) => r.patient_id === patientId);
    return records
      .map(hydrateRecord)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async addRecord({ patient_id, doctor_id, title, notes }) {
    await delay(350);
    if (!patient_id || !title || !notes) {
      throw new Error('Title and notes are required.');
    }

    const newRecord = {
      id: generateId('rec'),
      patient_id,
      doctor_id,
      title: title.trim(),
      notes: notes.trim(),
      created_at: new Date().toISOString(),
    };

    MOCK_MEDICAL_RECORDS.unshift(newRecord);
    return hydrateRecord(newRecord);
  },
};

export default mockRecordService;
