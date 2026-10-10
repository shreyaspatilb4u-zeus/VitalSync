# Security Policy

## Student Prototype Notice
VitalSync is an educational software engineering and capstone prototype developed for clinical workflow simulation and demonstration purposes.

- **Synthetic Data**: All data contained in this repository—including patient names, clinical encounters, diagnostic reports, appointment records, shifts, and contact information—is entirely **fictional and simulated**.
- **No Real PHI**: This repository contains **no Protected Health Information (PHI)** and no personally identifiable clinical records.
- **Demo Data Only**: Do not input or store real personal, medical, or clinical information into this prototype.

---

## Architecture & Security Model
1. **Frontend Isolation**: Client-side authentication in this prototype is in-memory and simulated for evaluation. Passwords, session tokens, and role flags are never stored in `localStorage` or `sessionStorage`.
2. **Planned Backend Security**: When connected to Supabase in production, authoritative authorization must be enforced via PostgreSQL Row Level Security (RLS) policies and cryptographically signed JWT sessions.
3. **HTTP Security Headers**: Production deployments via Vercel enforce strict security headers:
   - Content-Security-Policy (CSP)
   - X-Frame-Options (`DENY`)
   - X-Content-Type-Options (`nosniff`)
   - Strict-Transport-Security (HSTS with subdomains)
   - Permissions-Policy restricting camera, microphone, and geolocation
   - Strict Referrer-Policy (`strict-origin-when-cross-origin`)

---

## Reporting Security Issues
If you identify a security vulnerability, sensitive data leakage, or unintended bug in this repository:

1. Please submit an advisory or private report via GitHub Issues:  
   `https://github.com/<your-username>/<your-repo>/issues` (or the repository security tab once published).
2. Please do not publish proof-of-concept exploits publicly prior to review.
3. As this is an academic student project, fixes will be applied on a best-effort basis during active project development.
