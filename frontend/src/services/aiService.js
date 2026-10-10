import { MOCK_MEDICAL_RECORDS } from '../mock/medicalRecords';
import { MOCK_PROFILES } from '../mock/profiles';

const delay = (ms = 900) => new Promise((resolve) => setTimeout(resolve, ms));

export const aiService = {
  /**
   * Generates a structured clinical AI summary from patient longitudinal records
   * Simulates an intelligent LLM synthesis with realistic clinical nuance.
   */
  async summarizeHistory(patientId) {
    // Artificial latency to showcase realistic generative AI synthesis
    await delay(1000);

    const patient = MOCK_PROFILES.find((p) => p.id === patientId);
    const records = MOCK_MEDICAL_RECORDS.filter((r) => r.patient_id === patientId);

    if (patientId === 'pat_1') {
      // Eleanor Campbell - Deep Cardiology & Metabolic Summary
      return {
        patient_name: 'Eleanor Campbell',
        generated_at: new Date().toISOString(),
        key_conditions: [
          'Essential Hypertension (Stage 1, concentric LV remodeling noted on echocardiogram)',
          'Mixed Dyslipidemia (LDL 148 mg/dL baseline)',
          'Benign Symptomatic Palpitations (Holter confirmed rare PVCs/PACs < 0.4% burden)',
          'Borderline Pre-diabetes (Fasting glucose 104 mg/dL)',
        ],
        current_medications: [
          'Lisinopril 20 mg PO Daily in the morning (titrated up from 10mg)',
          'Atorvastatin 20 mg PO QHS at bedtime',
          'Vitamin D3 1,000 IU Daily orally',
        ],
        recent_changes: [
          'Blood pressure significantly improved to home average of 124–130 / 78–82 mmHg after Lisinopril titration.',
          'Marked reduction in palpitations following dietary caffeine cessation.',
          'Complete resolution of lower-extremity pretibial pitting edema.',
        ],
        flags_and_risks: [
          'Strong family pedigree of premature coronary artery disease (maternal MI at age 58).',
          'Elevated ASCVD risk warranting strict LDL target < 70-100 mg/dL.',
          'Advise patient to monitor for chest pressure or exertional dyspnea.',
        ],
        suggested_focus_areas: [
          'Follow-up Comprehensive Metabolic Panel and repeat fasting lipid panel in 8 weeks.',
          'Consider Metoprolol succinate 25mg daily if intrusive palpitations recur despite caffeine restriction.',
          'Annual repeat echocardiography to monitor concentric left ventricular remodeling.',
          'Encourage continued adherence to DASH diet and sodium limitation under 2,000mg/day.',
        ],
        disclaimer: 'AI-generated summary. Verify against source records before clinical decisions.',
      };
    }

    if (patientId === 'pat_2') {
      // Robert Hayes - Neurology & Migraine Summary
      return {
        patient_name: 'Robert Hayes',
        generated_at: new Date().toISOString(),
        key_conditions: [
          'Migraine with Visual Aura (ICD-10 G43.109, high-frequency episodic)',
          'Tension-type Cephalea overlay',
        ],
        current_medications: [
          'Topiramate 25 mg PO QHS (titrating weekly toward 50mg BID maintenance)',
          'Sumatriptan 50 mg PO PRN acute migraine onset (max 100mg/24h)',
          'Ondansetron 4 mg PO PRN nausea',
        ],
        recent_changes: [
          'Brain MRI (3D FLAIR) confirmed absence of acute intracranial lesions or vascular malformations.',
          'Sumatriptan successfully aborting attacks within 90 minutes for breakthrough episodes.',
          'Initiated on preventative prophylactic Topiramate therapy due to attack frequency exceeding 5 days/month.',
        ],
        flags_and_risks: [
          'Risk of Topiramate-induced cognitive slowing and peripheral paresthesias; patient monitored.',
          'Hydration monitoring critical to prevent nephrolithiasis secondary to carbonic anhydrase inhibition.',
        ],
        suggested_focus_areas: [
          'Review 6-week daily headache diary to assess reduction in monthly migraine days.',
          'Evaluate tolerability and cognitive symptoms prior to stepping Topiramate up to 100mg daily.',
          'Evaluate CGRP antagonist monoclonal antibodies (e.g. Erenumab) if oral preventive fails or induces adverse effects.',
        ],
        disclaimer: 'AI-generated summary. Verify against source records before clinical decisions.',
      };
    }

    // Dynamic synthesis fallback for other patients
    return {
      patient_name: patient ? patient.full_name : 'Patient Record',
      generated_at: new Date().toISOString(),
      key_conditions: records.length > 0
        ? records.map((r) => r.title)
        : ['Routine Ambulatory Care', 'No major chronic diagnoses documented'],
      current_medications: [
        'Routine maintenance therapy documented in individual clinical encounters',
      ],
      recent_changes: [
        records.length > 0
          ? `Last clinical evaluation on ${new Date(records[0].created_at).toLocaleDateString()}`
          : 'Initial baseline evaluation on file',
      ],
      flags_and_risks: [
        'Standard clinical surveillance; verify patient allergy status and immunization updates.',
      ],
      suggested_focus_areas: [
        'Routine preventive wellness exam and standard metabolic screening.',
        'Review current symptoms and treatment adherence.',
      ],
      disclaimer: 'AI-generated summary. Verify against source records before clinical decisions.',
    };
  },
};

export default aiService;
