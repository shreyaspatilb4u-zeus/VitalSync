import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../../components/layout/BrandLogo';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Info, Database } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import DemoLoginSection from '../../components/auth/DemoLoginSection';
import { config } from '../../lib/config';

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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(null);

  const { login, demoLogin, authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const validate = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const user = await login(email.trim(), password);
      toast.success(`Welcome back, ${user.full_name}`);
      redirectByRole(user.role);
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
      const user = await demoLogin(demoRole);
      toast.success(`Signed in as demo ${demoRole}: ${user.full_name}`);
      redirectByRole(user.role);
    } catch (err) {
      toast.error(`Demo sign-in failed: ${err.message}`);
    } finally {
      setDemoLoading(null);
    }
  };

  const isRealAuthAvailable = config.isSupabaseConfigured;

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
        <Card className="shadow-md">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Sign in to your account</h2>
            <p className="text-xs text-slate-500 mt-1">
              {isRealAuthAvailable
                ? 'Enter your credentials to access your healthcare portal.'
                : 'Demo mode active. Use the demo testing buttons below.'}
            </p>
          </div>

          {(errors.form || authError) && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errors.form || authError}</span>
            </div>
          )}

          {isRealAuthAvailable ? (
            /* REAL MODE LOGIN FORM */
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    maxLength={128}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
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
                  <label htmlFor="password" className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <span className="text-[11px] text-slate-400">Min. 8 characters</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
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

              {/* Registration Link */}
              <div className="mt-5 text-center text-xs text-slate-500">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-teal-600 hover:text-teal-700">
                  Create account
                </Link>
              </div>
            </form>
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
            disabled={loading}
          />
        </Card>
      </div>
    </div>
  );
}
