/**
 * Mock Medical Records Seed Data
 * Schema: id, patient_id, doctor_id, title, notes, created_at
 * Includes long, realistic clinical notes for Eleanor Campbell (pat_1) and Robert Hayes (pat_2)
 */

export const MOCK_MEDICAL_RECORDS = [
  // --- Eleanor Campbell (pat_1) ---
  {
    id: 'rec_101',
    patient_id: 'pat_1',
    doctor_id: 'doc_6',
    title: 'Comprehensive Internal Medicine Evaluation & Metabolic Workup',
    notes: `PATIENT DEMOGRAPHICS: 54-year-old female presenting for routine chronic disease follow-up.
CHIEF COMPLAINT: Persistent morning lethargy, episodic peripheral edema in lower extremities, and elevated ambulatory blood pressure readings.
VITAL SIGNS: BP 142/88 mmHg, HR 78 bpm regular, RR 16, SpO2 98% room air, BMI 27.4.
CLINICAL HISTORY:
1. Essential Hypertension (diagnosed 2021), currently managed on Lisinopril 10mg daily. Compliance confirmed by patient.
2. Mild Dyslipidemia, dietary management attempted over past 12 months with limited efficacy.
3. Family history notable for early maternal myocardial infarction at age 58.
PHYSICAL EXAMINATION:
- HEENT: Normocephalic, atraumatic, no scleral icterus, moist mucous membranes.
- Cardiovascular: S1/S2 present, regular rate and rhythm. No murmurs, gallops, or rubs.
- Extremities: Trace 1+ bilateral pitting pretibial edema without erythema or calf tenderness.
LABORATORY & DIAGNOSTIC RESULTS:
- Fasting Lipid Panel: Total Cholesterol 228 mg/dL, LDL 148 mg/dL, HDL 46 mg/dL, Triglycerides 170 mg/dL.
- Comprehensive Metabolic Panel: Serum creatinine 0.88 mg/dL, eGFR > 60 mL/min/1.73m2, fasting glucose 104 mg/dL (borderline pre-diabetes).
ASSESSMENT & CLINICAL PLAN:
- Hypertension suboptimal on current monotherapy; titrate Lisinopril to 20mg once daily in morning.
- Dyslipidemia requires pharmacotherapy; initiate Atorvastatin 20mg once daily at bedtime.
- Repeat lipid profile, renal function, and electrolytes in 8 weeks. Advised on DASH dietary guidelines and daily sodium limitation (<2,000mg).`,
    created_at: '2026-06-14T09:30:00.000Z',
  },
  {
    id: 'rec_102',
    patient_id: 'pat_1',
    doctor_id: 'doc_1',
    title: 'Cardiology Consultation: Holter Monitoring & Echocardiogram',
    notes: `CARDIOLOGY CONSULT NOTE
REASON FOR CONSULTATION: Investigation of intermittent palpitations occurring 2-3 times weekly, typically during periods of occupational stress and post-caffeine consumption. No reported syncope or true presyncope.
DIAGNOSTIC STUDIES REVIEW:
- 12-Lead ECG: Normal sinus rhythm at 72 bpm. PR interval 158 ms, QRS duration 86 ms, QTc 418 ms. Non-specific minor T-wave flattening in lead III.
- Transthoracic Echocardiogram (TTE): Normal left ventricular size and systolic function with calculated LVEF of 60-65%. Mild concentric left ventricular hypertrophy consistent with chronic hypertensive history. No hemodynamically significant valvular stenosis or regurgitation. Right ventricular systolic pressure estimated at 24 mmHg (normal).
- 48-Hour Ambulatory Holter Monitor: Baseline sinus rhythm with diurnal variation (minimum 52 bpm nocturnal, maximum 124 bpm). Recorded isolated premature ventricular contractions (PVC burden < 0.4%) and rare premature atrial contractions (PACs). No episodes of sustained supraventricular tachycardia, ventricular tachycardia, or pauses > 2.0 seconds.
IMPRESSION:
Benign isolated ectopic beats in the setting of well-compensated concentric LV remodeling. High likelihood of caffeine-induced exacerbation alongside chronic sympathetic activation.
RECOMMENDATIONS:
- Discontinue high-caffeine energy drinks and restrict dark coffee to 1 cup before noon.
- Patient encouraged to maintain low-impact aerobic conditioning (30 minutes brisk walking 5 days/week).
- Metoprolol succinate 25mg daily discussed as an adjunct option should palpitations become functionally intrusive.
- Scheduled 6-month cardiovascular surveillance visit.`,
    created_at: '2026-08-04T14:15:00.000Z',
  },
  {
    id: 'rec_103',
    patient_id: 'pat_1',
    doctor_id: 'doc_1',
    title: 'Cardiovascular Progress Review & Medication Reconciliation',
    notes: `PROGRESS ENCOUNTER NOTE
SUBJECTIVE: Patient reports adherence to titrated Lisinopril 20mg and Atorvastatin 20mg. Palpitations significantly decreased after reducing caffeine intake. Home blood pressure log demonstrates sustained improvement, averaging 124-130 / 78-82 mmHg. Reports no muscle cramps, myalgias, or dizziness.
OBJECTIVE:
- Blood Pressure: 126/80 mmHg in right arm seated.
- Heart Rate: 68 bpm regular.
- Lungs: Clear to auscultation bilaterally.
- Lower Extremities: Pitting edema resolved completely.
CURRENT PHARMACOTHERAPY:
1. Lisinopril 20 mg PO Daily (Hypertension)
2. Atorvastatin 20 mg PO QHS (Dyslipidemia)
3. Vitamin D3 1,000 IU Daily (Bone health supplement)
PLAN:
- Maintain current dosing of Lisinopril and Atorvastatin.
- Comprehensive metabolic panel and lipid panel scheduled prior to next scheduled appointment.
- Advised patient regarding red-flag symptoms: sudden chest pressure radiating to left arm or jaw requires urgent emergency medical evaluation.`,
    created_at: '2026-09-28T15:00:00.000Z',
  },

  // --- Robert Hayes (pat_2) ---
  {
    id: 'rec_104',
    patient_id: 'pat_2',
    doctor_id: 'doc_2',
    title: 'Neurological Initial Consultation: Refractory Migraine Cephalea',
    notes: `NEUROLOGICAL CONSULTATION
CHIEF COMPLAINT: Recurrent throbbing hemicranial headaches with accompanying aura, nausea, and phonophobia lasting 12 to 24 hours per episode.
HISTORY OF PRESENT ILLNESS: 42-year-old male presenting with escalating frequency of severe headaches (averaging 5-6 days per month). Episodes precede visual scintillating scotoma by 20 minutes. Over-the-counter NSAIDs (Ibuprofen 400mg) provide negligible relief.
NEUROLOGICAL EXAMINATION:
- Mental Status: Alert, fully oriented x 4, fluent speech without paraphasias.
- Cranial Nerves: II-XII intact. Extraocular movements full without nystagmus. Pupils 3mm briskly reactive to light. Visual fields full to confrontation. Fundoscopic exam demonstrates sharp optic disc margins, no papilledema.
- Motor/Sensory: 5/5 strength throughout all four extremities. Sensation to light touch, pinprick, and proprioception preserved bilaterally.
- Reflexes: 2+ symmetric throughout, bilateral plantars flexor.
- Cerebellar: Rapid alternating movements crisp, finger-to-nose without dysmetria, normal tandem gait.
IMPRESSION:
Migraine with visual aura (ICD-10 G43.109) with transformation toward high-frequency episodic migraine. Medication overuse headache ruled out at this juncture.
PLAN:
- Brain MRI without contrast ordered to formally exclude structural/vascular intracranial pathology.
- Initiate abortive migraine therapy: Sumatriptan 50mg PO at onset of aura/pain (maximum 100mg in 24 hours).
- Prescribed Ondansetron 4mg PO for headache-associated nausea.
- Headache diary initiated; follow up in 6 weeks with scan results.`,
    created_at: '2026-08-10T11:00:00.000Z',
  },
  {
    id: 'rec_105',
    patient_id: 'pat_2',
    doctor_id: 'doc_2',
    title: 'Neuroimaging Review & Preventive Regimen Formulation',
    notes: `NEUROLOGY FOLLOW-UP NOTE
DIAGNOSTIC REVIEW:
- Brain MRI with 3D FLAIR: No evidence of acute intracranial hemorrhage, mass effect, midline shift, or acute territorial infarction. Minimal non-specific subcortical white matter hyperintensities in bilateral frontal lobes, commonly seen in patients with chronic migraine. Ventricles and sulci age-appropriate.
CLINICAL PROGRESS:
Patient utilized Sumatriptan for 3 discrete attacks over the past month with good symptom cessation within 90 minutes. However, frequency remains problematic at 6 attacks monthly.
UPDATED TREATMENT STRATEGY:
- Transition to preventative migraine regimen: Initiate Topiramate 25mg daily at bedtime, titrating by 25mg weekly to a target dose of 50mg BID.
- Extensive counseling provided regarding potential cognitive slowing, paresthesias, and hydration necessity to mitigate nephrolithiasis risk.
- Maintain Sumatriptan 50mg for acute breakthrough attacks.`,
    created_at: '2026-09-20T10:15:00.000Z',
  },

  // --- Sofia Martinez (pat_3) ---
  {
    id: 'rec_106',
    patient_id: 'pat_3',
    doctor_id: 'doc_3',
    title: 'Pediatric Pulmonology: Cough Variant Asthma Assessment',
    notes: `Pediatric consultation for recurrent nocturnal dry coughing and exercise intolerance. Spirometry reveals mild reversible airway obstruction with 14% improvement in FEV1 post-albuterol. Started on low-dose Fluticasone propionate inhaler 44mcg 2 puffs BID with spacer. Albuterol MDI prescribed for PRN rescue.`,
    created_at: '2026-08-15T10:00:00.000Z',
  },

  // --- Liam Johnson (pat_4) ---
  {
    id: 'rec_107',
    patient_id: 'pat_4',
    doctor_id: 'doc_6',
    title: 'Endocrine Review: Type 2 Diabetes Mellitus Management',
    notes: `Follow-up of Type 2 DM. Most recent HbA1c 7.6% (previous 7.9%). Renal functions intact (creatinine 0.95). Patient compliant with Metformin 1,000mg twice daily with meals. Added lifestyle modifications and continuous glucose monitoring trial. Diabetic foot exam showed intact protective sensation to 10g monofilament.`,
    created_at: '2026-07-20T14:00:00.000Z',
  },

  // --- Maya Patel (pat_5) ---
  {
    id: 'rec_108',
    patient_id: 'pat_5',
    doctor_id: 'doc_5',
    title: 'Dermatology: Moderate Atopic Dermatitis Management',
    notes: `Erythematous scaly plaques involving bilateral antecubital fossae and dorsum of hands. Severe pruritus disrupting sleep. Prescribed Triamcinolone acetonide 0.1% ointment twice daily for 2 weeks with transition to barrier ceramide moisturizers. Patch test planned if contact allergy suspected.`,
    created_at: '2026-09-22T13:45:00.000Z',
  },
];
