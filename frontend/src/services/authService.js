import { isDemoMode, clearDemoMode } from './mode';
import { mockAuthService } from './mock/authService';
import { supabaseAuthService } from './supabase/authService';
import { config } from '../lib/config';

/**
 * Public Auth Service Facade
 * Dispatches to mockAuthService or supabaseAuthService based on isDemoMode() / config.
 */
export const authService = {
  async getCurrentUser() {
    if (isDemoMode() || !config.isSupabaseConfigured) {
      return mockAuthService.getCurrentUser();
    }
    return supabaseAuthService.getCurrentUser();
  },

  async login(email, password) {
    if (!config.isSupabaseConfigured || isDemoMode()) {
      return mockAuthService.login(email, password);
    }
    return supabaseAuthService.login(email, password);
  },

  async register({ full_name, email, password }) {
    if (!config.isSupabaseConfigured || isDemoMode()) {
      return mockAuthService.register({ full_name, email, password });
    }
    return supabaseAuthService.register({ full_name, email, password });
  },

  async signInWithGoogle() {
    // Patient OAuth sign-in uses Supabase Google provider
    return supabaseAuthService.signInWithGoogle();
  },

  async demoLogin(role = 'patient') {
    // Demo login exclusively uses mock implementation
    return mockAuthService.demoLogin(role);
  },

  async logout() {
    if (isDemoMode()) {
      await mockAuthService.logout();
    } else {
      await supabaseAuthService.logout();
    }
    clearDemoMode();
    return true;
  },

  onAuthStateChange(callback) {
    return supabaseAuthService.onAuthStateChange(callback);
  },
};

export default authService;
