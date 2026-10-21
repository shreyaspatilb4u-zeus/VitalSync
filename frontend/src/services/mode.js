/**
 * Application Mode Service
 * Distinguishes between Demo Mode (in-memory mock data only) and Real Mode (Supabase Auth & Postgres).
 *
 * Security Notice:
 * The demo flag is strictly a harmless client-side UI/routing flag.
 * A demo session never contacts Supabase, and real sessions never read mock data.
 * Real sessions rely solely on validated Supabase JWTs and Row Level Security (RLS).
 */

const DEMO_MODE_STORAGE_KEY = 'vitalsync_session_mode';

let inMemoryDemoMode = false;

// Initialize from sessionStorage if available
try {
  inMemoryDemoMode = sessionStorage.getItem(DEMO_MODE_STORAGE_KEY) === 'demo';
} catch {
  // Storage unavailable fallback
}

export function isDemoMode() {
  return inMemoryDemoMode;
}

export function setDemoMode(isDemo) {
  inMemoryDemoMode = Boolean(isDemo);
  try {
    if (inMemoryDemoMode) {
      sessionStorage.setItem(DEMO_MODE_STORAGE_KEY, 'demo');
    } else {
      sessionStorage.removeItem(DEMO_MODE_STORAGE_KEY);
    }
  } catch {
    // Storage unavailable
  }
}

export function clearDemoMode() {
  inMemoryDemoMode = false;
  try {
    sessionStorage.removeItem(DEMO_MODE_STORAGE_KEY);
  } catch {
    // Storage unavailable
  }
}

export default {
  isDemoMode,
  setDemoMode,
  clearDemoMode,
};
