import React from 'react';
import { cn } from '../../lib/utils';

export default function Card({
  children,
  className = '',
  padding = 'normal',
  hover = false,
  ...props
}) {
  const paddingMap = {
    none: '',
    sm: 'p-4',
    normal: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-slate-200 shadow-sm transition-all',
        hover && 'hover:shadow-md hover:border-slate-300',
        paddingMap[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
