import { mockAiService } from './mock/aiService';

/**
 * AI Clinical Intelligence Service
 *
 * TODO: Replace with secure backend endpoint.
 * Medical records and clinical synthesis must not be sent to any third-party service directly from the frontend.
 * Kept as mock for both modes in this prototype to safeguard patient data privacy.
 */
export const aiService = {
  async summarizeHistory(patientId) {
    return mockAiService.summarizeHistory(patientId);
  },
};

export default aiService;
