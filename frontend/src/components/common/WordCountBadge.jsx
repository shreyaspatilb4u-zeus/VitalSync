import React from 'react';
import { countWords, MAX_WORD_LIMIT } from '../../lib/utils';

/**
 * Live word count indicator positioned in the corner of text inputs and textareas.
 * Turns amber near the limit (>= 90%) and red when the limit is reached.
 */
export default function WordCountBadge({
  value,
  maxWords = MAX_WORD_LIMIT,
  variant = 'textarea', // 'textarea' | 'input' | 'compact'
  className = '',
}) {
  const words = countWords(value);
  const isAtLimit = words >= maxWords;
  const isNearLimit = !isAtLimit && words >= Math.floor(maxWords * 0.9);

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
        {words} / {maxWords} words
      </span>
    );
  }

  return (
    <span
      aria-live="polite"
      className={`pointer-events-none select-none absolute inset-y-0 right-2.5 flex items-center text-[10px] ${colorClass} ${className}`}
    >
      {variant === 'compact' ? `${words}/${maxWords}w` : `${words} / ${maxWords} words`}
    </span>
  );
}
