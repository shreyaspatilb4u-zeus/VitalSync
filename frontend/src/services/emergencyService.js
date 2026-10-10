import { MOCK_EMERGENCY_REQUESTS } from '../mock/emergencyRequests';
import { MOCK_PROFILES } from '../mock/profiles';
import { generateId } from '../lib/utils';

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

const SEVERITY_WEIGHT = {
  critical: 3,
  high: 2,
  moderate: 1,
};

function hydrateEmergency(emg) {
  const patient = MOCK_PROFILES.find((p) => p.id === emg.patient_id);
  return {
    ...emg,
    patient_name: patient ? patient.full_name : 'Unknown Patient',
  };
}

export const emergencyService = {
  /**
   * Submit an emergency request
   */
  async createEmergencyRequest({ patient_id, description, severity }) {
    await delay(350);
    if (!description || !severity) {
      throw new Error('Please describe the emergency and specify the severity.');
    }

    const newRequest = {
      id: generateId('emg'),
      patient_id,
      description: description.trim(),
      severity,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    MOCK_EMERGENCY_REQUESTS.unshift(newRequest);
    return hydrateEmergency(newRequest);
  },

  /**
   * Get sorted emergency triage queue (Doctors & Clinical staff)
   * Sorted by severity descending (critical -> high -> moderate), then created_at ascending (oldest first)
   */
  async getEmergencyQueue() {
    await delay(300);
    const hydrated = MOCK_EMERGENCY_REQUESTS.map(hydrateEmergency);

    return hydrated.sort((a, b) => {
      // First sort by severity
      const diff = (SEVERITY_WEIGHT[b.severity] || 0) - (SEVERITY_WEIGHT[a.severity] || 0);
      if (diff !== 0) return diff;
      // Second sort by time (oldest first)
      return new Date(a.created_at) - new Date(b.created_at);
    });
  },

  /**
   * Get patient's latest active emergency request and queue position
   */
  async getActiveRequestForPatient(patientId) {
    await delay(200);
    const active = MOCK_EMERGENCY_REQUESTS.find(
      (e) => e.patient_id === patientId && e.status !== 'resolved'
    );
    if (!active) return null;

    // Calculate queue position among non-resolved items
    const queue = await this.getEmergencyQueue();
    const activeQueue = queue.filter((e) => e.status !== 'resolved');
    const index = activeQueue.findIndex((e) => e.id === active.id);

    return {
      ...hydrateEmergency(active),
      queue_position: index >= 0 ? index + 1 : 1,
      total_in_queue: activeQueue.length,
    };
  },

  /**
   * Update emergency request status (Acknowledge or Resolve)
   */
  async updateEmergencyStatus(id, newStatus) {
    await delay(250);
    const emg = MOCK_EMERGENCY_REQUESTS.find((e) => e.id === id);
    if (!emg) throw new Error('Emergency request not found.');

    emg.status = newStatus;
    return hydrateEmergency(emg);
  },

  /**
   * Admin read-only view of all requests.
   * Enforces privacy: returns only id, severity, status, created_at, patient identifier.
   */
  async getAdminEmergencyLog() {
    await delay(250);
    return MOCK_EMERGENCY_REQUESTS.map((e) => {
      const patient = MOCK_PROFILES.find((p) => p.id === e.patient_id);
      return {
        id: e.id,
        patient_name: patient ? patient.full_name : 'Patient Record',
        severity: e.severity,
        status: e.status,
        created_at: e.created_at,
      };
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
};

export default emergencyService;
