import { supabase } from '../../lib/supabaseClient';
import { clearDemoMode } from '../mode';

/**
 * Supabase Authentication & Profile Resolution Service
 *
 * Security Requirements:
 * 1. For real users, the role must ALWAYS come from the profiles table:
 *    select role from profiles where id = auth user id.
 *    NEVER trust user_metadata, localStorage, or client-supplied role flags.
 * 2. Sign-up sends only email, password, and full_name. Never send a role.
 * 3. If the profile row is missing, sign out immediately and show an error.
 * 4. No console.log of user data, sessions, tokens, or query results.
 */

// Helper to safely fetch and validate authoritative profile from PostgreSQL
async function fetchAuthoritativeProfile(userId) {
  if (!supabase || !userId) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, specialty, created_at')
    .eq('id', userId)
    .maybeSingle();

  if (error || !profile) {
    return null;
  }

  return profile;
}

export const supabaseAuthService = {
  /**
   * Get the current authenticated Supabase session and authoritative profile
   */
  async getCurrentUser() {
    if (!supabase) return null;

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return null;
    }

    let profile = await fetchAuthoritativeProfile(session.user.id);
    if (!profile) {
      // Brief pause to allow any asynchronous database trigger to complete profile creation
      await new Promise((resolve) => setTimeout(resolve, 600));
      profile = await fetchAuthoritativeProfile(session.user.id);
    }

    if (!profile) {
      await supabase.auth.signOut();
      throw new Error('Your user profile could not be found. Please contact administration.');
    }

    return {
      id: session.user.id,
      email: session.user.email,
      full_name: profile.full_name || session.user.email.split('@')[0],
      role: profile.role, // Strictly from profiles table
      specialty: profile.specialty || null,
      created_at: profile.created_at,
      profile,
    };
  },

  /**
   * Initiate Google OAuth sign-in for patients
   * redirectTo is strictly fixed to window.location.origin + '/login'
   */
  async signInWithGoogle() {
    if (!supabase) {
      throw new Error('Supabase authentication is not configured. Please use Demo Mode.');
    }

    const fixedRedirectTo = `${window.location.origin}/login`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: fixedRedirectTo,
        queryParams: {
          prompt: 'select_account',
        },
      },
    });

    if (error) {
      throw new Error(error.message || 'Failed to initiate Google sign-in.');
    }

    return data;
  },

  /**
   * Login with email and password via Supabase Auth
   */
  async login(email, password) {
    if (!supabase) {
      throw new Error('Supabase authentication is not configured. Please use Demo Mode.');
    }

    const trimmedEmail = email?.trim() || '';
    if (!trimmedEmail || !password) {
      throw new Error('Please enter both email and password.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });

    if (error) {
      // Map database/auth error to friendly UI message
      const msg = error.message?.toLowerCase() || '';
      if (
        msg.includes('invalid login credentials') ||
        msg.includes('invalid_grant') ||
        msg.includes('email not confirmed')
      ) {
        throw new Error('Invalid email or password.');
      }
      throw new Error(error.message || 'Unable to sign in. Please check your credentials.');
    }

    if (!data?.user) {
      throw new Error('Authentication succeeded but user session is missing.');
    }

    // Role MUST come strictly from the profiles table
    const profile = await fetchAuthoritativeProfile(data.user.id);
    if (!profile) {
      await supabase.auth.signOut();
      throw new Error('Your user profile was not found. Please contact administration.');
    }

    clearDemoMode();

    return {
      id: data.user.id,
      email: data.user.email,
      full_name: profile.full_name || data.user.email.split('@')[0],
      role: profile.role,
      specialty: profile.specialty || null,
      created_at: profile.created_at,
      profile,
    };
  },

  /**
   * Register a new account via Supabase Auth.
   * Sends ONLY email, password, and full_name. Never sends a role.
   */
  async register({ full_name, email, password }) {
    if (!supabase) {
      throw new Error('Supabase authentication is not configured. Please use Demo Mode.');
    }

    const trimmedName = full_name?.trim() || '';
    const trimmedEmail = email?.trim() || '';

    if (!trimmedName || !trimmedEmail || !password) {
      throw new Error('All registration fields are required.');
    }

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      throw new Error('Full legal name must be between 2 and 100 characters.');
    }
    if (trimmedEmail.length > 128 || !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      throw new Error('Please provide a valid email address.');
    }
    if (password.length < 8 || password.length > 128) {
      throw new Error('Password must be at least 8 characters long.');
    }

    // Sign up sends ONLY email, password, and full_name in user_metadata. Role is omitted.
    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: {
          full_name: trimmedName,
        },
      },
    });

    if (error) {
      const msg = error.message?.toLowerCase() || '';
      if (
        msg.includes('already registered') ||
        msg.includes('user already exists') ||
        msg.includes('unique constraint')
      ) {
        throw new Error('An account with this email already exists.');
      }
      throw new Error(error.message || 'Registration failed. Please try again.');
    }

    if (!data?.user) {
      throw new Error('Registration completed but user session was not created.');
    }

    // Wait briefly for database trigger to generate profile row if needed
    let profile = await fetchAuthoritativeProfile(data.user.id);
    if (!profile) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      profile = await fetchAuthoritativeProfile(data.user.id);
    }

    if (!profile) {
      await supabase.auth.signOut();
      throw new Error('Your user profile could not be created. Please contact administration.');
    }

    clearDemoMode();

    return {
      id: data.user.id,
      email: data.user.email,
      full_name: profile.full_name || trimmedName,
      role: profile.role,
      specialty: profile.specialty || null,
      created_at: profile.created_at,
      profile,
    };
  },

  /**
   * Listen to Supabase auth state changes
   */
  onAuthStateChange(callback) {
    if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
    return supabase.auth.onAuthStateChange(callback);
  },

  /**
   * Sign out of Supabase
   */
  async logout() {
    clearDemoMode();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // Ignore network errors on signout
      }
    }
    return true;
  },
};

export default supabaseAuthService;
