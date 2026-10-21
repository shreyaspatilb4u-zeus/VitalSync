import { MOCK_PROFILES } from '../../mock/profiles';
import { generateId } from '../../lib/utils';
import { config } from '../../lib/config';
import { setDemoMode, clearDemoMode } from '../mode';

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

let currentUser = null;

const DEMO_SESSION_FLAG_KEY = 'vitalsync_demo_session_active_id';
try {
  const savedId = sessionStorage.getItem(DEMO_SESSION_FLAG_KEY);
  if (savedId) {
    const matchedProfile = MOCK_PROFILES.find((p) => p.id === savedId);
    if (matchedProfile) {
      currentUser = matchedProfile;
    }
  }
} catch {
  // Storage unavailable, fallback to pure in-memory state
}

function persistSession(user) {
  currentUser = user;
  try {
    if (user && user.id) {
      sessionStorage.setItem(DEMO_SESSION_FLAG_KEY, user.id);
    } else {
      sessionStorage.removeItem(DEMO_SESSION_FLAG_KEY);
    }
  } catch {
    // Ignore storage issues
  }
}

export const mockAuthService = {
  async getCurrentUser() {
    await delay(150);
    return currentUser;
  },

  async login(email, password) {
    await delay(300);
    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    const trimmedEmail = email.trim();
    if (trimmedEmail.length > 128 || password.length > 128) {
      throw new Error('Input length exceeds maximum allowed limit.');
    }

    const normalizedEmail = trimmedEmail.toLowerCase();
    const found = MOCK_PROFILES.find(
      (p) => p.email && p.email.toLowerCase() === normalizedEmail
    );

    if (!found) {
      if (trimmedEmail.includes('@')) {
        const fallbackPatient = {
          id: generateId('pat'),
          full_name: trimmedEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' '),
          role: 'patient',
          specialty: null,
          email: normalizedEmail,
        };
        persistSession(fallbackPatient);
        setDemoMode(true);
        return fallbackPatient;
      }
      throw new Error('Invalid email or password. Use demo login or registered email.');
    }

    persistSession(found);
    setDemoMode(true);
    return found;
  },

  async register({ full_name, email, password }) {
    await delay(350);
    if (!full_name || !email || !password) {
      throw new Error('All fields are required.');
    }

    const trimmedName = full_name.trim();
    const trimmedEmail = email.trim();

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      throw new Error('Full legal name must be between 2 and 100 characters.');
    }
    if (trimmedEmail.length > 128 || !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      throw new Error('Please provide a valid email address under 128 characters.');
    }
    if (password.length < 8 || password.length > 128) {
      throw new Error('Password must be between 8 and 128 characters.');
    }

    const normalizedEmail = trimmedEmail.toLowerCase();
    const existing = MOCK_PROFILES.find(
      (p) => p.email && p.email.toLowerCase() === normalizedEmail
    );
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const newPatient = {
      id: generateId('pat'),
      full_name: trimmedName,
      role: 'patient',
      specialty: null,
      email: normalizedEmail,
    };

    MOCK_PROFILES.push(newPatient);
    persistSession(newPatient);
    setDemoMode(true);
    return newPatient;
  },

  async demoLogin(role = 'patient') {
    if (!config.enableDemoLogin) {
      throw new Error('Demo login is disabled in this environment.');
    }

    await delay(200);
    let profile;

    if (role === 'doctor') {
      profile = MOCK_PROFILES.find((p) => p.id === 'doc_1');
    } else if (role === 'admin') {
      profile = MOCK_PROFILES.find((p) => p.id === 'admin_1');
    } else {
      profile = MOCK_PROFILES.find((p) => p.id === 'pat_1');
    }

    if (!profile) {
      throw new Error(`Demo user for role ${role} not found.`);
    }

    persistSession(profile);
    setDemoMode(true);
    return profile;
  },

  async logout() {
    await delay(150);
    persistSession(null);
    clearDemoMode();
    return true;
  },
};

export default mockAuthService;
