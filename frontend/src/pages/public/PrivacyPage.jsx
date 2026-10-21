import React from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../../components/layout/BrandLogo';
import Card from '../../components/common/Card';
import { ArrowLeft, Shield, Mail, Database, AlertCircle, Info, Lock } from 'lucide-react';

export default function PrivacyPage() {
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
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Privacy Policy</h1>
                <p className="text-xs text-slate-500 mt-0.5">Last updated: {lastUpdated}</p>
              </div>
            </div>
          </div>

          {/* Prototype Notice Alert */}
          <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200/80 text-teal-900 text-sm flex items-start gap-3">
            <Info className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-teal-950">Educational Prototype Notice</p>
              <p className="text-xs text-teal-800 leading-relaxed">
                VitalSync is a student educational prototype, not a commercial service.
              </p>
            </div>
          </div>

          {/* Plain-English Privacy Points */}
          <div className="space-y-6 text-sm text-slate-700">
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-teal-600" />
                Sign-In & Google Account Data
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-6">
                When you sign in with Google, we receive only your name and email address from Google.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-600" />
                No Selling or Sharing
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-6">
                We do not sell or share your personal data with third parties or advertisers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-teal-600" />
                Data Storage & Supabase
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-6">
                Data entered in the app (appointments, symptoms, emergency requests) is stored in our Supabase database.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2 text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Do Not Enter Real Medical Information
              </h2>
              <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm ml-6">
                Do not enter real medical information. The prototype uses demo data only.
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-600" />
                Data Deletion Requests
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-6">
                To ask for your data to be deleted, contact{' '}
                <a
                  href="mailto:shreyaspatilb4u@gmail.com"
                  className="font-semibold text-teal-600 hover:text-teal-700 underline underline-offset-2"
                >
                  shreyaspatilb4u@gmail.com
                </a>
                .
              </p>
            </section>
          </div>

          {/* Card Footer */}
          <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <span>VitalSync &copy; {new Date().getFullYear()} &bull; Educational Prototype</span>
            <div className="flex items-center gap-3">
              <Link to="/terms" className="text-teal-600 hover:text-teal-700 font-medium">
                Terms of Service
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
