import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { isDemoMode } from '../services/mode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [isDemo, setIsDemo] = useState(isDemoMode());
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        if (isDemoMode()) {
          const demoUser = await authService.getCurrentUser();
          if (isMounted) {
            if (demoUser) {
              setUser(demoUser);
              setProfile(demoUser);
              setRole(demoUser.role);
              setIsDemo(true);
            } else {
              setUser(null);
              setProfile(null);
              setRole(null);
              setIsDemo(false);
            }
          }
        } else {
          const sessionUser = await authService.getCurrentUser();
          if (isMounted) {
            if (sessionUser) {
              setUser(sessionUser);
              setProfile(sessionUser.profile || sessionUser);
              setRole(sessionUser.role);
              setIsDemo(false);
            } else {
              setUser(null);
              setProfile(null);
              setRole(null);
              setIsDemo(false);
            }
          }
        }
      } catch (err) {
        if (isMounted) {
          setUser(null);
          setProfile(null);
          setRole(null);
          setIsDemo(false);
          setAuthError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initAuth();

    // Listen to real Supabase auth events
    const { data: authListener } = authService.onAuthStateChange(async (event, session) => {
      if (isDemoMode()) return;

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          try {
            const freshUser = await authService.getCurrentUser();
            if (isMounted && freshUser) {
              setUser(freshUser);
              setProfile(freshUser.profile || freshUser);
              setRole(freshUser.role);
              setIsDemo(false);
            }
          } catch (err) {
            if (isMounted) {
              setUser(null);
              setProfile(null);
              setRole(null);
              setIsDemo(false);
              setAuthError(err.message);
            }
          }
        }
      } else if (event === 'SIGNED_OUT') {
        if (isMounted) {
          setUser(null);
          setProfile(null);
          setRole(null);
          setIsDemo(false);
        }
      }
    });

    return () => {
      isMounted = false;
      if (authListener?.subscription?.unsubscribe) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    const loggedUser = await authService.login(email, password);
    setUser(loggedUser);
    setProfile(loggedUser.profile || loggedUser);
    setRole(loggedUser.role);
    setIsDemo(false);
    return loggedUser;
  };

  const register = async ({ full_name, email, password }) => {
    setAuthError(null);
    const newUser = await authService.register({ full_name, email, password });
    setUser(newUser);
    setProfile(newUser.profile || newUser);
    setRole(newUser.role);
    setIsDemo(false);
    return newUser;
  };

  const demoLogin = async (demoRole = 'patient') => {
    setAuthError(null);
    const demoUser = await authService.demoLogin(demoRole);
    setUser(demoUser);
    setProfile(demoUser);
    setRole(demoUser.role);
    setIsDemo(true);
    return demoUser;
  };

  const logout = async () => {
    setAuthError(null);
    await authService.logout();
    setUser(null);
    setProfile(null);
    setRole(null);
    setIsDemo(false);
  };

  const value = {
    user,
    profile,
    role,
    loading,
    isDemo,
    authError,
    login,
    register,
    demoLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
