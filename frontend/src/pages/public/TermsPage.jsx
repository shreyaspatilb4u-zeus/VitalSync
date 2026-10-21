import React from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../../components/layout/BrandLogo';
import Card from '../../components/common/Card';
import { ArrowLeft, FileText, AlertTriangle, CheckCircle2, UserCheck, Mail, Info } from 'lucide-react';

export default function TermsPage() {
  const lastUpdated = 'October 21, 2026';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto w-full">
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>
          <BrandLogo size="medium" linkTo="/login" />
        </div>

        {/* Main Card */}
        <Card className="shadow-md p-6 sm:p-10 space-y-8 bg-white border-slate-200">
          <div className="border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Terms of Service</h1>
                <p className="text-xs text-slate-500 mt-0.5">Last updated: {lastUpdated}</p>
              </div>
            </div>
          </div>

          {/* Educational Prototype Notice */}
          <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200/80 text-teal-900 text-sm flex items-start gap-3">
            <Info className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-teal-950">Educational Prototype Status</p>
              <p className="text-xs text-teal-800 leading-relaxed">
                VitalSync is an educational prototype provided as is, with no guarantees.
              </p>
            </div>
          </div>

          {/* Plain-English Terms Points */}
          <div className="space-y-6 text-sm text-slate-700">
            {/* Medical Disclaimer & Emergency Notice */}
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2 text-rose-900">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Medical Disclaimer & Emergencies
              </h2>
              <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm ml-6 leading-relaxed">
                It is not a medical service and must not be used for real medical decisions or emergencies.
                For a real emergency, call your local emergency number.
              </div>
            </section>

            {/* Acceptable Use */}
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                Intended Purpose & User Responsibility
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-6">
                You must provide accurate information and use the app only for its intended purpose.
              </p>
            </section>

            {/* Authentication & Access */}
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-teal-600" />
                Accounts & Authentication
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-6">
                You may sign in with Google or, for staff, email and password.
              </p>
            </section>

            {/* Contact Information */}
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-600" />
                Contact Information
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-6">
                Contact for questions:{' '}
                <a
                  href="mailto:shreyaspatilb4u@gmail.com"
                  className="font-semibold text-teal-600 hover:text-teal-700 underline underline-offset-2"
                >
                  shreyaspatilb4u@gmail.com
                </a>
              </p>
            </section>
          </div>

          {/* Card Footer */}
          <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <span>VitalSync &copy; {new Date().getFullYear()} &bull; Educational Prototype</span>
            <div className="flex items-center gap-3">
              <Link to="/privacy" className="text-teal-600 hover:text-teal-700 font-medium">
                Privacy Policy
              </Link>
              <span>&bull;</span>
              <Link to="/login" className="text-slate-600 hover:text-slate-800 font-medium">
                Sign In
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
