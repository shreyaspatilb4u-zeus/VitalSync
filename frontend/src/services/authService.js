import { isDemoMode, clearDemoMode } from './mode';
import { mockAuthService } from './mock/authService';
import { supabaseAuthService } from './supabase/authService';

/**
 * Public Auth Service Facade
 * Dispatches to mockAuthService or supabaseAuthService based on isDemoMode().
 */
export const authService = {
  async getCurrentUser() {
    if (isDemoMode()) {
      return mockAuthService.getCurrentUser();
    }
    return supabaseAuthService.getCurrentUser();
  },

  async login(email, password) {
    // Real login with email/password uses Supabase
    return supabaseAuthService.login(email, password);
  },

  async register({ full_name, email, password }) {
    // Real user registration uses Supabase
    return supabaseAuthService.register({ full_name, email, password });
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
