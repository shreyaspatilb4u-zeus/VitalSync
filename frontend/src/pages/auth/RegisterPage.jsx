import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../../components/layout/BrandLogo';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Eye, EyeOff, Lock, Mail, User, AlertCircle, Info, Database } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { config } from '../../lib/config';
import WordCountBadge from '../../components/common/WordCountBadge';
import { countWords, enforceWordLimit, MAX_WORD_LIMIT } from '../../lib/utils';

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

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const validate = () => {
    const newErrors = {};
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      newErrors.fullName = 'Full legal name is required.';
    } else if (trimmedName.length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters.';
    } else if (countWords(trimmedName) > MAX_WORD_LIMIT) {
      newErrors.fullName = `Name cannot exceed ${MAX_WORD_LIMIT} words.`;
    } else if (trimmedName.length > 100) {
      newErrors.fullName = 'Name cannot exceed 100 characters.';
    }

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

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      /**
       * CRITICAL SECURITY ARCHITECTURE RULE:
       * The client registration payload NEVER sends a role parameter.
       * New self-registered users are unconditionally assigned the 'patient' role
       * on the backend to prevent privilege escalation.
       */
      const newUser = await register({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
      });

      if (newUser?.emailConfirmationRequired) {
        toast.success('Registration successful! Please check your email to verify your account.');
        navigate('/login', { replace: true });
      } else {
        toast.success(`Account created successfully! Welcome, ${newUser.full_name || 'Patient'}`);
        navigate('/patient', { replace: true });
      }
    } catch (err) {
      const msg = err.message || 'Registration failed. Please try again.';
      setErrors({ form: msg });
      toast.error(msg);
    } finally {
      setLoading(false);
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
          Create your patient portal account
        </p>

        {/* Prototype notice */}
        <div className="mt-3 mx-4 sm:mx-0 p-2.5 rounded-lg bg-teal-50/70 border border-teal-200/60 text-teal-800 text-xs flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Do not enter real medical information. This is an educational prototype.</span>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="shadow-md space-y-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">New Patient Registration</h2>
            <p className="text-xs text-slate-500 mt-1">
              Connect with healthcare providers and schedule visits seamlessly.
            </p>
          </div>

          {errors.form && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errors.form}</span>
            </div>
          )}

          {isRealAuthAvailable ? (
            <div className="space-y-4">
              {/* GOOGLE SIGN UP BUTTON */}
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
                  Instant registration for patients via Google authentication
                </p>
              </div>

              {/* DIVIDER */}
              <div className="relative flex items-center justify-center py-1">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  or register with email
                </span>
              </div>

              {/* EMAIL & PASSWORD REGISTRATION FORM */}
              <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
                {/* Full Name Field */}
                <div>
                  <label htmlFor="fullName" className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="fullName"
                      type="text"
                      autoComplete="name"
                      maxLength={100}
                      value={fullName}
                      onChange={(e) => setFullName(enforceWordLimit(e.target.value))}
                      placeholder="Eleanor Campbell"
                      className={`block w-full pl-9 pr-24 py-2 text-sm rounded-lg border ${
                        errors.fullName ? 'border-red-300 focus:ring-red-400' : 'border-slate-300 focus:ring-teal-500'
                      } bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2`}
                    />
                    <WordCountBadge value={fullName} variant="input" />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{errors.fullName}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="reg-email"
                      type="email"
                      autoComplete="email"
                      maxLength={128}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="eleanor@example.com"
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
                    <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    <span className="text-[11px] text-slate-400">Min. 8 characters</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
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

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      maxLength={128}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`block w-full pl-9 pr-3 py-2 text-sm rounded-lg border ${
                        errors.confirmPassword ? 'border-red-300 focus:ring-red-400' : 'border-slate-300 focus:ring-teal-500'
                      } bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2`}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full mt-2"
                  loading={loading}
                  disabled={googleLoading}
                >
                  Create Account
                </Button>
              </form>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <Database className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Supabase Configuration Not Detected</span>
              </div>
              <p>
                Account creation is unavailable while running in demo mode. Please return to the login
                page to test the platform using demo accounts.
              </p>
            </div>
          )}

          {/* Login Link */}
          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-700">
              Sign in here
            </Link>
          </div>
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
