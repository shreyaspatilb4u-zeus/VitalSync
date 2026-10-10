import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on initial mount
  useEffect(() => {
    let isMounted = true;
    async function initAuth() {
      try {
        const sessionUser = await authService.getCurrentUser();
        if (isMounted && sessionUser) {
          setUser(sessionUser);
          setRole(sessionUser.role);
        }
      } catch {
        if (isMounted) {
          setUser(null);
          setRole(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    initAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const loggedUser = await authService.login(email, password);
    setUser(loggedUser);
    setRole(loggedUser.role);
    return loggedUser;
  };

  const register = async ({ full_name, email, password }) => {
    // New users are strictly assigned 'patient' role
    const newUser = await authService.register({ full_name, email, password });
    setUser(newUser);
    setRole(newUser.role);
    return newUser;
  };

  const demoLogin = async (demoRole = 'patient') => {
    const demoUser = await authService.demoLogin(demoRole);
    setUser(demoUser);
    setRole(demoUser.role);
    return demoUser;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setRole(null);
  };

  const value = {
    user,
    role,
    login,
    register,
    demoLogin,
    logout,
    loading,
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
