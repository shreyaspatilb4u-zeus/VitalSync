import React from 'react';
import { Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BrandLogo({ size = 'default', linkTo = '/' }) {
  const isLarge = size === 'large';

  const content = (
    <div className="flex items-center gap-2.5 select-none group">
      <div className={`flex items-center justify-center rounded-lg bg-teal-50 text-teal-600 border border-teal-100 group-hover:bg-teal-100 transition-colors ${
        isLarge ? 'w-10 h-10' : 'w-8 h-8'
      }`}>
        <Activity className={isLarge ? 'w-6 h-6' : 'w-4 h-4'} strokeWidth={2.5} />
      </div>
      <div className="flex items-baseline tracking-tight">
        <span className={`font-bold text-slate-400 ${isLarge ? 'text-2xl' : 'text-xl'}`}>
          Vital
        </span>
        <span className={`font-bold text-teal-500 ${isLarge ? 'text-2xl' : 'text-xl'}`}>
          Sync
        </span>
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-flex items-center focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
