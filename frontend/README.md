# VitalSync | Smart Hospital Portal Frontend

VitalSync is a modern, responsive, and minimalist healthcare operations platform built for a college capstone project. It provides unified clinical intelligence, automated patient triage, appointment scheduling, physician workflows, and administrative hospital governance.

> **Security & Privacy Notice**:  
> **Demo data only. Do not enter real personal or medical information.**  
> All patient records, clinical encounter notes, and practitioner data in this repository are simulated and fictional.

---

## 1. Tech Stack & Design Architecture

- **Framework**: React 18 + Vite (JavaScript)
- **Routing**: React Router v6 (Nested routes with `ProtectedRoute` & `RoleRoute` guards)
- **Styling**: Tailwind CSS (Strict custom tokens, Inter typography, soft borders, zero heavy gradients)
- **Icons**: Lucide React (`lucide-react`)
- **Visuals**: Lightweight CSS-driven indicators and clean metrics (no heavy charting libraries)
- **Typography**: Inter (via Google Fonts)
- **Color Palette**:
  - Backgrounds: Clean white and slate-50 (`#f8fafc`)
  - Primary Accent: Teal (`#0d9488`, hover `#0f766e`, light tint `#ccfbf1`)
  - Neutrals: Slate text hierarchy (`text-slate-900`, `text-slate-700`, `text-slate-500`)
  - Semantic Status:
    - Red (`#dc2626` / `#ef4444`): Emergency triage & critical alerts only
    - Amber (`#d97706` / `#f59e0b`): Warnings, incomplete shift coverage, pending items
    - Emerald (`#10b981` / `#059669`): Verified attendance, completed visits, success

---

## 2. Demo Mode vs. Real Accounts

VitalSync features a robust dual-mode architecture that allows full evaluation either with zero-configuration simulated demo personas or live Supabase persistence:

| Dimension | Demo Mode (Simulated Prototype) | Real Accounts Mode (Live Supabase) |
|---|---|---|
| **Entry Point** | Click quick-login pills (*Demo Patient*, *Demo Doctor*, *Demo Admin*) on `/login` | Register on `/register` or enter credentials on `/login` |
| **Data Engine** | In-memory reactive state initialized from `src/mock/` | Live PostgreSQL via `@supabase/supabase-js` |
| **Network Requests** | 100% offline; zero database calls | Authenticated requests using Supabase Auth JWT and public Anon key |
| **Calendar Timeline** | Cohesive reference cycle (October 2026) | Live local system dates and real-time timestamps |
| **Role Resolution** | In-memory demo profile role | Authoritatively loaded from PostgreSQL `profiles` table (`role = 'patient' \| 'doctor' \| 'admin'`) |
| **Transactions & RPCs** | In-memory slot locking & status changes | PostgreSQL RPC functions: `book_slot(p_slot_id, p_symptoms)` and `cancel_appointment(p_appointment_id)` |
| **Data Privacy** | Synthetic fictional medical records | Protected by PostgreSQL Row Level Security (RLS); symptoms and records strictly shielded from admin views |
| **AI Summaries** | Deterministic mock clinical EHR extraction | Kept on client mock service to safeguard patient health data privacy |
| **Ideal For** | Classroom evaluation, portfolio walkthroughs, and UI review | Production testing, multi-user concurrency, and persistent clinical records |

### Dual-Mode Facade Architecture
All UI components communicate exclusively with unified service abstractions in `src/services/*.js`. Each service checks `isDemoMode()` (managed in `src/services/mode.js`) to seamlessly dispatch calls to either `src/services/mock/` or `src/services/supabase/` without altering signatures or return shapes.

---

## 3. Directory Structure

```
frontend/
├── .env                              # Safe Supabase connection configuration
├── index.html                        # Application entry, Inter font imports
├── package.json                      # Dependencies & build scripts
├── postcss.config.js                 # PostCSS setup
├── tailwind.config.js                # Theme extension (brand teal, custom shadows, rounded-xl)
├── vite.config.js                    # Vite server configuration
├── README.md                         # This architecture guide & Supabase migration manual
└── src/
    ├── main.jsx                      # App root mount
    ├── App.jsx                       # Router tree, AuthProvider & ToastProvider
    ├── index.css                     # Tailwind directives, focus rings & scrollbars
    ├── lib/
    │   ├── config.js                 # Environment config wrapper (import.meta.env.VITE_*)
    │   └── utils.js                  # Date/time formatters, ID generator, class merging
    ├── context/
    │   ├── AuthContext.jsx           # user, role, login, register, demoLogin, logout
    │   └── ToastContext.jsx          # Accessible floating toast notification provider
    ├── components/
    │   ├── common/
    │   │   ├── Badge.jsx             # Role, appointment status, severity & attendance badges
    │   │   ├── Button.jsx            # Accessible variants (primary, secondary, danger, ghost)
    │   │   ├── Card.jsx              # Rounded-xl cards with thin slate-200 borders
    │   │   ├── EmptyState.jsx        # Polished empty list & table displays
    │   │   ├── ErrorState.jsx        # Friendly retryable error display
    │   │   ├── LoadingSkeleton.jsx   # Card and table loading skeletons
    │   │   └── Modal.jsx             # Accessible modal dialog with focus management
    │   ├── layout/
    │   │   ├── AppLayout.jsx         # Sidebar + Topbar + main content wrapper
    │   │   ├── BrandLogo.jsx         # "Vital" (slate-400) + "Sync" (teal-500) wordmark
    │   │   ├── Sidebar.jsx           # Role-based collapsible sidebar navigation
    │   │   └── Topbar.jsx            # User profile chip, role badge, and logout
    │   └── routing/
    │       ├── ProtectedRoute.jsx    # Redirects unauthenticated sessions to /login
    │       └── RoleRoute.jsx         # Enforces role boundaries (/patient, /doctor, /admin)
    ├── mock/                         # Database schema seed data (SNAKE_CASE)
    │   ├── profiles.js               # 6 doctors, 8 patients, 1 administrator
    │   ├── availabilitySlots.js      # 36 future doctor availability slots
    │   ├── appointments.js           # Scheduled, completed, and cancelled visits
    │   ├── medicalRecords.js         # Deep clinical notes for rich AI summarization
    │   ├── emergencyRequests.js      # Critical, high, and moderate urgency triage items
    │   ├── attendance.js             # 7 days of doctor attendance records
    │   └── shifts.js                 # Weekly morning, evening, and night shift matrix
    ├── services/                     # Asynchronous service layer (UI calls ONLY services)
    │   ├── authService.js
    │   ├── doctorService.js
    │   ├── appointmentService.js
    │   ├── recordService.js
    │   ├── emergencyService.js
    │   ├── adminService.js
    │   └── aiService.js
    └── pages/
        ├── auth/
        │   ├── LoginPage.jsx         # Form + 1-click Demo Logins (Patient / Doctor / Admin)
        │   └── RegisterPage.jsx      # Patient registration (role strictly 'patient')
        ├── patient/
        │   ├── PatientDashboard.jsx  # Greeting, next visit highlight, quick links
        │   ├── BookAppointmentPage.jsx # Guided 3-step wizard (Symptoms -> Doctor -> Calendar & Slots)
        │   ├── MyAppointmentsPage.jsx# Upcoming & Past tabs, cancel confirmation modal
        │   └── EmergencyPage.jsx     # Calm red-accented triage submission & queue position card
        ├── doctor/
        │   ├── DoctorDashboard.jsx   # Today's visits, assigned patients, emergency alert banner
        │   ├── PatientsRosterPage.jsx# Searchable patient directory
        │   ├── PatientDetailPage.jsx # Timeline + AI Medical History Summary (Generate/Copy/Regenerate)
        │   ├── EmergencyQueuePage.jsx# Priority triage queue with Acknowledge and Resolve actions
        │   ├── DoctorAvailabilityPage.jsx # Manage weekly open consultation slots
        │   └── DoctorAttendancePage.jsx   # Check-in today & 7-day attendance history
        └── admin/
            ├── AdminDashboard.jsx    # 5 KPI cards + today's attendance table
            ├── StaffPage.jsx         # Doctor directory & shift links
            ├── ShiftSchedulerPage.jsx# Week matrix with daily coverage indicators
            ├── AttendanceManagerPage.jsx # Date picker & bulk attendance save
            └── AdminEmergenciesPage.jsx  # Read-only emergency overview (Privacy by design)
```

---

## 3. Database Schema Alignment

All mock models strictly mirror the relational PostgreSQL / Supabase schema using `snake_case` column names:

| Table | Primary Columns |
|---|---|
| `profiles` | `id`, `full_name`, `role` ('patient'\|'doctor'\|'admin'), `specialty` |
| `availability_slots` | `id`, `doctor_id`, `slot_start` (ISO timestamptz), `is_booked` (bool) |
| `appointments` | `id`, `patient_id`, `doctor_id`, `slot_id`, `symptoms`, `status` ('scheduled'\|'completed'\|'cancelled'), `created_at` |
| `medical_records` | `id`, `patient_id`, `doctor_id`, `title`, `notes`, `created_at` |
| `emergency_requests`| `id`, `patient_id`, `description`, `severity` ('critical'\|'high'\|'moderate'), `status` ('pending'\|'acknowledged'\|'resolved'), `created_at` |
| `attendance` | `id`, `doctor_id`, `date` (YYYY-MM-DD), `status` ('present'\|'absent'\|'on_leave') |
| `shifts` | `id`, `doctor_id`, `shift_date` (YYYY-MM-DD), `shift_type` ('morning'\|'evening'\|'night') |

---

## 4. Backend Swap Guide (Supabase Integration)

Components **never** import from `src/mock/`. To connect a live Supabase backend, you only need to install `@supabase/supabase-js`, initialize the client in `src/lib/supabaseClient.js`, and swap the internals of each file in `src/services/`.

### 4.1. Supabase Client Setup (`src/lib/supabaseClient.js`)
```javascript
import { createClient } from '@supabase/supabase-js';
import config from './config';

export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
```

### 4.2. Service Function Replacement Directory

Below is the exhaustive index of all functions across all 7 services and their exact Supabase equivalents:

#### `src/services/authService.js`
- `getCurrentUser()`:
  ```javascript
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  return profile;
  ```
- `login(email, password)`:
  ```javascript
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
  return profile;
  ```
- `register({ full_name, email, password })`:
  ```javascript
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name, role: 'patient' } }
  });
  if (error) throw error;
  return data.user;
  ```
- `logout()`:
  ```javascript
  await supabase.auth.signOut();
  ```

#### `src/services/doctorService.js`
- `getDoctors(specialty)`:
  ```javascript
  let query = supabase.from('profiles').select('*').eq('role', 'doctor');
  if (specialty && specialty !== 'all') query = query.ilike('specialty', specialty);
  const { data, error } = await query;
  return data;
  ```
- `getDoctorById(id)`:
  ```javascript
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
  return data;
  ```
- `getDoctorAvailability(doctorId)`:
  ```javascript
  const { data, error } = await supabase.from('availability_slots')
    .select('*')
    .eq('doctor_id', doctorId)
    .order('slot_start', { ascending: true });
  return data;
  ```
- `addAvailabilitySlot(doctorId, slotStartISO)`:
  ```javascript
  const { data, error } = await supabase.from('availability_slots').insert({
    doctor_id: doctorId,
    slot_start: slotStartISO,
    is_booked: false
  }).select().single();
  return data;
  ```
- `removeAvailabilitySlot(slotId)`:
  ```javascript
  const { data, error } = await supabase.from('availability_slots')
    .delete()
    .eq('id', slotId)
    .eq('is_booked', false);
  return data;
  ```
- `getAssignedPatients(doctorId)`:
  ```javascript
  const { data, error } = await supabase.from('profiles')
    .select('*, appointments!inner(*)')
    .eq('role', 'patient')
    .eq('appointments.doctor_id', doctorId);
  return data;
  ```
- `getDoctorTodayAttendance(doctorId)`:
  ```javascript
  const { data } = await supabase.from('attendance')
    .select('status')
    .eq('doctor_id', doctorId)
    .eq('date', new Date().toISOString().split('T')[0])
    .maybeSingle();
  return data ? data.status : 'absent';
  ```
- `checkInDoctor(doctorId, status)`:
  ```javascript
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase.from('attendance').upsert(
    { doctor_id: doctorId, date: today, status },
    { onConflict: 'doctor_id,date' }
  ).select().single();
  return data;
  ```

#### `src/services/appointmentService.js`
- `getAppointmentsByPatient(patientId)`:
  ```javascript
  const { data, error } = await supabase.from('appointments')
    .select('*, doctor:profiles!doctor_id(id, full_name, specialty), slot:availability_slots!slot_id(slot_start)')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });
  return data;
  ```
- `getNextUpcomingAppointment(patientId)`:
  ```javascript
  const { data, error } = await supabase.from('appointments')
    .select('*, doctor:profiles!doctor_id(id, full_name, specialty), slot:availability_slots!slot_id(slot_start)')
    .eq('patient_id', patientId)
    .eq('status', 'scheduled')
    .limit(1)
    .maybeSingle();
  return data;
  ```
- `getAppointmentsByDoctor(doctorId)`:
  ```javascript
  const { data, error } = await supabase.from('appointments')
    .select('*, patient:profiles!patient_id(id, full_name, email), slot:availability_slots!slot_id(slot_start)')
    .eq('doctor_id', doctorId)
    .order('created_at', { ascending: false });
  return data;
  ```
- `bookAppointment({ patient_id, doctor_id, slot_id, symptoms })`:
  ```javascript
  // Transaction or RPC
  await supabase.from('availability_slots').update({ is_booked: true }).eq('id', slot_id);
  const { data, error } = await supabase.from('appointments').insert({
    patient_id, doctor_id, slot_id, symptoms, status: 'scheduled'
  }).select('*, doctor:profiles!doctor_id(*)').single();
  return data;
  ```
- `cancelAppointment(appointmentId)`:
  ```javascript
  const { data: apt } = await supabase.from('appointments').select('slot_id').eq('id', appointmentId).single();
  if (apt?.slot_id) {
    await supabase.from('availability_slots').update({ is_booked: false }).eq('id', apt.slot_id);
  }
  const { data, error } = await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', appointmentId).select().single();
  return data;
  ```

#### `src/services/recordService.js`
- `getRecordsByPatient(patientId)`:
  ```javascript
  const { data, error } = await supabase.from('medical_records')
    .select('*, doctor:profiles!doctor_id(id, full_name, specialty)')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });
  return data;
  ```
- `addRecord({ patient_id, doctor_id, title, notes })`:
  ```javascript
  const { data, error } = await supabase.from('medical_records').insert({
    patient_id, doctor_id, title, notes
  }).select('*, doctor:profiles!doctor_id(*)').single();
  return data;
  ```

#### `src/services/emergencyService.js`
- `createEmergencyRequest({ patient_id, description, severity })`:
  ```javascript
  const { data, error } = await supabase.from('emergency_requests').insert({
    patient_id, description, severity, status: 'pending'
  }).select().single();
  return data;
  ```
- `getEmergencyQueue()`:
  ```javascript
  const { data, error } = await supabase.from('emergency_requests')
    .select('*, patient:profiles!patient_id(full_name)')
    .order('created_at', { ascending: true });
  return data;
  ```
- `getActiveRequestForPatient(patientId)`:
  ```javascript
  const { data, error } = await supabase.from('emergency_requests')
    .select('*')
    .eq('patient_id', patientId)
    .neq('status', 'resolved')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
  ```
- `updateEmergencyStatus(id, newStatus)`:
  ```javascript
  const { data, error } = await supabase.from('emergency_requests')
    .update({ status: newStatus })
    .eq('id', id)
    .select()
    .single();
  return data;
  ```
- `getAdminEmergencyLog()`:
  ```javascript
  // Privacy by design: never select 'description'
  const { data, error } = await supabase.from('emergency_requests')
    .select('id, severity, status, created_at, patient:profiles!patient_id(full_name)')
    .order('created_at', { ascending: false });
  return data;
  ```

#### `src/services/adminService.js`
- `getStaffRoster()`:
  ```javascript
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase.from('profiles')
    .select('*, attendance(status)')
    .eq('role', 'doctor');
  return data;
  ```
- `getDailyAttendance(date)`:
  ```javascript
  const { data, error } = await supabase.from('profiles')
    .select('id, full_name, specialty, attendance(status)')
    .eq('role', 'doctor');
  return data;
  ```
- `updateDoctorAttendance(doctorId, date, status)`:
  ```javascript
  const { data, error } = await supabase.from('attendance')
    .upsert({ doctor_id: doctorId, date, status }, { onConflict: 'doctor_id,date' })
    .select().single();
  return data;
  ```
- `getShifts()`:
  ```javascript
  const { data, error } = await supabase.from('shifts').select('*');
  return data;
  ```
- `updateShift(doctorId, shift_date, shift_type)`:
  ```javascript
  const { data, error } = await supabase.from('shifts')
    .upsert({ doctor_id: doctorId, shift_date, shift_type }, { onConflict: 'doctor_id,shift_date' })
    .select().single();
  return data;
  ```
- `getHospitalStats()`:
  ```javascript
  // Aggregate queries using supabase rpc or count()
  ```

#### `src/services/aiService.js`
- `summarizeHistory(patientId)`:
  ```javascript
  // Fetch patient's longitudinal EHR records
  const { data: records } = await supabase.from('medical_records').select('*').eq('patient_id', patientId);
  // Call Supabase Edge Function with Gemini / Claude / OpenAI API
  const { data: summary, error } = await supabase.functions.invoke('clinical-summary', {
    body: { patient_id: patientId, records }
  });
  return summary;
  ```

---

## 5. Security & Privacy Hygiene

1. **Role-Based Routing Isolation**:
   - `/patient/*` strictly accessible to `role === 'patient'`
   - `/doctor/*` strictly accessible to `role === 'doctor'`
   - `/admin/*` strictly accessible to `role === 'admin'`
   - Unauthenticated sessions redirected to `/login`
2. **Registration Lockdown**:
   - Role cannot be passed in registration payloads; all new users are strictly created as `'patient'`.
3. **Privacy by Design**:
   - Administrators cannot view clinical symptom notes or medical records anywhere in the portal.
4. **Zero Client Secret Leaks**:
   - No API keys or credentials hardcoded. Only `import.meta.env.VITE_*` accessed via `src/lib/config.js`.
5. **No Dangerous HTML Injections**:
   - Zero use of `dangerouslySetInnerHTML`. All rendered user text is sanitized by React's native DOM escaping.

---

## 6. How to Run Locally

### Start Development Server
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

### Validate Production Build
```bash
cd frontend
npm run build
```
Builds cleanly with zero warnings and zero errors into `/frontend/dist`.
