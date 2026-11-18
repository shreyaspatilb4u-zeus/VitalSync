import React from 'react';
import { countChars, MAX_CHAR_LIMIT } from '../../lib/utils';

/**
 * Live character count indicator positioned in the corner of text inputs and textareas.
 * Turns amber near the limit (>= 90%) and red when the limit is reached.
 */
export default function CharCountBadge({
  value,
  maxChars = MAX_CHAR_LIMIT,
  variant = 'textarea', // 'textarea' | 'input' | 'compact'
  className = '',
}) {
  const chars = countChars(value);
  const isAtLimit = chars >= maxChars;
  const isNearLimit = !isAtLimit && chars >= Math.floor(maxChars * 0.9);

  const colorClass = isAtLimit
    ? 'text-red-600 font-semibold'
    : isNearLimit
    ? 'text-amber-600 font-semibold'
    : 'text-slate-400 font-medium';

  if (variant === 'textarea') {
    return (
      <span
        aria-live="polite"
        className={`pointer-events-none select-none absolute bottom-2 right-3 text-[11px] bg-white/90 px-1.5 py-0.5 rounded ${colorClass} ${className}`}
      >
        {chars} / {maxChars} chars
      </span>
    );
  }

  return (
    <span
      aria-live="polite"
      className={`pointer-events-none select-none absolute inset-y-0 right-2.5 flex items-center text-[10px] ${colorClass} ${className}`}
    >
      {variant === 'compact' ? `${chars}/${maxChars}` : `${chars} / ${maxChars} chars`}
    </span>
  );
}
