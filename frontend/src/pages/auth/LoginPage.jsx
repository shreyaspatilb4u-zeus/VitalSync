import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../../components/layout/BrandLogo';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Info, Database, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import DemoLoginSection from '../../components/auth/DemoLoginSection';
import { config } from '../../lib/config';

function GoogleLogo({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

function getSafeRedirectPath(candidatePath, userRole) {
  const roleHome = {
    doctor: '/doctor',
    admin: '/admin',
    patient: '/patient',
  }[userRole] || '/patient';

  if (!candidatePath || typeof candidatePath !== 'string') {
    return roleHome;
  }

  // Reject paths with schemes, double-slashes, or backslashes
  if (
    !candidatePath.startsWith('/') ||
    candidatePath.startsWith('//') ||
    candidatePath.startsWith('/\\') ||
    candidatePath.includes('\\') ||
    candidatePath.includes('://')
  ) {
    return roleHome;
  }

  // Role authorization safety
  if (userRole === 'patient' && (candidatePath.startsWith('/doctor') || candidatePath.startsWith('/admin'))) {
    return roleHome;
  }
  if (userRole === 'doctor' && (candidatePath.startsWith('/patient') || candidatePath.startsWith('/admin'))) {
    return roleHome;
  }
  if (userRole === 'admin' && (candidatePath.startsWith('/patient') || candidatePath.startsWith('/doctor'))) {
    return roleHome;
  }

  return candidatePath;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showStaffLogin, setShowStaffLogin] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(null);

  const { user, role, loading: authLoading, login, signInWithGoogle, demoLogin, authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const isRealAuthAvailable = config.isSupabaseConfigured;

  // Check whether the URL has OAuth query/hash parameters from Google return
  const hasAuthParamsInUrl =
    typeof window !== 'undefined' &&
    (window.location.hash.includes('access_token') ||
      window.location.search.includes('code=') ||
      window.location.hash.includes('type=recovery'));

  // Handle OAuth error parameters in URL (e.g., user cancellation or access denial)
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const searchParams = new URLSearchParams(window.location.search);
    const errorParam = hashParams.get('error') || searchParams.get('error');
    const errorDesc = hashParams.get('error_description') || searchParams.get('error_description');

    if (errorParam || errorDesc) {
      window.history.replaceState({}, document.title, window.location.pathname);
      const isCancellation =
        (errorParam + ' ' + (errorDesc || '')).toLowerCase().includes('cancel') ||
        (errorParam + ' ' + (errorDesc || '')).toLowerCase().includes('denied');
      const friendlyMsg = isCancellation
        ? 'Google sign-in was cancelled.'
        : (errorDesc || 'Unable to sign in with Google. Please try again.');
      setErrors((prev) => ({ ...prev, form: friendlyMsg }));
      toast.error(friendlyMsg);
    }
  }, [toast]);

  // Navigate to appropriate role portal once authenticated
  useEffect(() => {
    if (!authLoading && user && role) {
      const rawFrom = location.state?.from?.pathname;
      const safeTarget = getSafeRedirectPath(rawFrom, role);
      navigate(safeTarget, { replace: true });
    }
  }, [user, role, authLoading, navigate, location.state]);

  const validateStaffForm = () => {
    const newErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      newErrors.email = 'Email address is required.';
    } else if (trimmedEmail.length > 128) {
      newErrors.email = 'Email address cannot exceed 128 characters.';
    } else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      newErrors.email = 'Please provide a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    } else if (password.length > 128) {
      newErrors.password = 'Password cannot exceed 128 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const redirectByRole = (userRole) => {
    const rawFrom = location.state?.from?.pathname;
    const safeTarget = getSafeRedirectPath(rawFrom, userRole);
    navigate(safeTarget, { replace: true });
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrors({});
    try {
      await signInWithGoogle();
      // Supabase redirects browser to Google OAuth provider
    } catch (err) {
      setGoogleLoading(false);
      const msg = err.message || 'Google sign-in could not be initiated. Please try again.';
      setErrors({ form: msg });
      toast.error(msg);
    }
  };

  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    if (!validateStaffForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const loggedUser = await login(email.trim(), password);
      toast.success(`Welcome back, ${loggedUser.full_name}`);
      redirectByRole(loggedUser.role);
    } catch (err) {
      const msg = err.message || 'Invalid email or password.';
      setErrors({ form: msg });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoRole) => {
    setDemoLoading(demoRole);
    setErrors({});
    try {
      const demoUser = await demoLogin(demoRole);
      toast.success(`Signed in as demo ${demoRole}: ${demoUser.full_name}`);
      redirectByRole(demoUser.role);
    } catch (err) {
      toast.error(`Demo sign-in failed: ${err.message}`);
    } finally {
      setDemoLoading(null);
    }
  };

  // Show a full loading state while Google OAuth callback or profile session is resolving to prevent flicker
  if (authLoading && (hasAuthParamsInUrl || user)) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="flex justify-center mb-4">
            <BrandLogo size="large" linkTo={null} />
          </div>
          <Card className="shadow-md p-8 text-center space-y-4">
            <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-base font-bold text-slate-800">Signing in...</h2>
            <p className="text-xs text-slate-500">
              Verifying your credentials and loading your clinical profile. Please wait a moment.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-3">
          <BrandLogo size="large" linkTo={null} />
        </div>
        <p className="text-sm text-slate-500 font-medium">
          Unified clinical intelligence & patient care platform
        </p>

        {/* Prototype notice */}
        <div className="mt-3 mx-4 sm:mx-0 p-2.5 rounded-lg bg-teal-50/70 border border-teal-200/60 text-teal-800 text-xs flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Do not enter real medical information. This is an educational prototype.</span>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="shadow-md space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Sign in to your account</h2>
            <p className="text-xs text-slate-500 mt-1">
              {isRealAuthAvailable
                ? 'Sign in with Google for patient access, or use staff credentials.'
                : 'Demo mode active. Use the demo testing buttons below.'}
            </p>
          </div>

          {(errors.form || authError) && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errors.form || authError}</span>
            </div>
          )}

          {isRealAuthAvailable ? (
            <div className="space-y-5">
              {/* PROMINENT "CONTINUE WITH GOOGLE" BUTTON */}
              <div>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading || loading}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg border border-slate-300 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {googleLoading ? (
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <GoogleLogo className="w-5 h-5 shrink-0" />
                  )}
                  <span>{googleLoading ? 'Redirecting to Google...' : 'Continue with Google'}</span>
                </button>
                <p className="text-[11px] text-center text-slate-400 mt-1.5">
                  Instant, secure access for patients via Google authentication
                </p>
              </div>

              {/* DIVIDER */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  or
                </span>
              </div>

              {/* COLLAPSED STAFF LOGIN SECTION */}
              <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setShowStaffLogin((prev) => !prev)}
                  className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-slate-900 focus:outline-none"
                  aria-expanded={showStaffLogin}
                >
                  <span className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    Staff Sign-In (Email & Password)
                  </span>
                  {showStaffLogin ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {showStaffLogin && (
                  <form onSubmit={handleStaffSubmit} className="mt-4 space-y-3.5 pt-3 border-t border-slate-200" noValidate>
                    {/* Email Field */}
                    <div>
                      <label htmlFor="staff-email" className="block text-xs font-semibold text-slate-700 mb-1">
                        Staff Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          id="staff-email"
                          type="email"
                          autoComplete="email"
                          maxLength={128}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="doctor@vitalsync.org"
                          className={`block w-full pl-9 pr-3 py-2 text-sm rounded-lg border ${
                            errors.email ? 'border-red-300 focus:ring-red-400' : 'border-slate-300 focus:ring-teal-500'
                          } bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2`}
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-600 font-medium">{errors.email}</p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label htmlFor="staff-password" className="block text-xs font-semibold text-slate-700">
                          Password
                        </label>
                        <span className="text-[11px] text-slate-400">Min. 8 characters</span>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          id="staff-password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          maxLength={128}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className={`block w-full pl-9 pr-10 py-2 text-sm rounded-lg border ${
                            errors.password ? 'border-red-300 focus:ring-red-400' : 'border-slate-300 focus:ring-teal-500'
                          } bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-xs text-red-600 font-medium">{errors.password}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full mt-2"
                      loading={loading}
                    >
                      Sign In
                    </Button>
                  </form>
                )}
              </div>
            </div>
          ) : (
            /* FALLBACK NOTICE WHEN SUPABASE IS NOT CONFIGURED */
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <Database className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Supabase Configuration Not Detected</span>
              </div>
              <p>
                Real account authentication is currently offline. You can test all role-based features
                immediately using the one-click demo profiles below.
              </p>
            </div>
          )}

          {/* DEMO LOGIN SECTION (DEMO BUTTONS, CLEARLY SEPARATED) */}
          <DemoLoginSection
            onDemoLogin={handleDemoLogin}
            loading={demoLoading}
            disabled={loading || googleLoading}
          />
        </Card>

        {/* Public Footer Links */}
        <div className="mt-6 text-center text-xs text-slate-400 space-x-3">
          <Link to="/privacy" className="hover:text-slate-600 transition-colors">
            Privacy
          </Link>
          <span>&bull;</span>
          <Link to="/terms" className="hover:text-slate-600 transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </div>
  );
}
