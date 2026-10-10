# VitalSync — Smart Hospital Portal

> **Security & Prototype Notice**:  
> **Demo data only. Do not enter real personal or medical information.**  
> VitalSync is an educational capstone prototype. All patient records, clinical data, and provider profiles are synthetic and simulated.

---

## Overview

VitalSync is an integrated clinical intelligence and hospital operations management prototype. It provides automated triage queueing, physician scheduling, role-based workflows (Patient, Doctor, Admin), and patient appointment management.

---

## Project Structure

```
.
├── frontend/               # React 18 + Vite SPA client
│   ├── src/                # Components, pages, services, and mock clinical seed data
│   ├── vercel.json         # Vercel deployment config with hardened security headers
│   ├── .env.example        # Environment variable configuration template
│   └── package.json        # Dependencies and scripts
├── backend/                # Planned Supabase / API backend definitions
├── SECURITY.md             # Security policy, PHI notice, and vulnerability reporting
└── README.md               # Project documentation
```

---

## Frontend Setup & Local Development

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Production build & preview:
   ```bash
   npm run build
   npm run preview
   ```

---

## Security & Privacy Highlights

- **No Stored Credentials**: Authentication state is maintained in-memory. Passwords, tokens, and role flags are never written to `localStorage` or `sessionStorage`.
- **Role Isolation**: Client-side route guards segregate `/patient`, `/doctor`, and `/admin`. Real enforcement in production is designed for Supabase Row Level Security (RLS).
- **Hardened Deployment**: Configured with strict Content-Security-Policy (CSP), HSTS, nosniff, frame-ancestors 'none', and disabled production sourcemaps.
- **Privacy by Design**: Administrative dashboards cannot view or inspect protected patient symptoms or clinical consultation notes.

---

## License & Disclaimer

Developed for academic/educational demonstration purposes only. Not intended for production diagnostic or clinical healthcare use without verified HIPAA/regulatory compliance and backend cryptographic security.
