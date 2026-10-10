import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../../components/layout/BrandLogo';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Eye, EyeOff, Lock, Mail, User, AlertCircle, Info } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  /**
   * Client-side UX validation.
   * NOTE: Client-side validation is for UX and hygiene only.
   * Real authoritative validation, duplicate prevention, and password hashing
   * must always happen server-side (e.g. Supabase Auth / PostgreSQL constraints).
   */
  const validate = () => {
    const newErrors = {};
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      newErrors.fullName = 'Full legal name is required.';
    } else if (trimmedName.length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters.';
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
       * on the backend/auth service to prevent privilege escalation.
       */
      const newUser = await register({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
      });

      toast.success(`Account created successfully! Welcome, ${newUser.full_name}`);
      navigate('/patient', { replace: true });
    } catch (err) {
      setErrors({ form: err.message || 'Registration failed. Please try again.' });
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-3">
          <BrandLogo size="large" linkTo={null} />
        </div>
        <p className="text-sm text-slate-500 font-medium">
          Create your patient portal account
        </p>

        {/* Prototype demo notice */}
        <div className="mt-3 mx-4 sm:mx-0 p-2.5 rounded-lg bg-teal-50/70 border border-teal-200/60 text-teal-800 text-xs flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Prototype: demo data only. Do not enter real personal or medical information.</span>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="shadow-md">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">New Patient Registration</h2>
            <p className="text-xs text-slate-500 mt-1">
              Connect with healthcare providers and schedule visits seamlessly.
            </p>
          </div>

          {errors.form && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errors.form}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Eleanor Campbell"
                  className={`block w-full pl-9 pr-3 py-2 text-sm rounded-lg border ${
                    errors.fullName ? 'border-red-300 focus:ring-red-400' : 'border-slate-300 focus:ring-teal-500'
                  } bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2`}
                />
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
            >
              Complete Registration
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-5 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-700">
              Sign in here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
