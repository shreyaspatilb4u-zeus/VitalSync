import React, { useEffect, useRef } from 'react';
import { countChars, MAX_CHAR_LIMIT } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';

/**
 * Live character count indicator positioned in the corner of text inputs and textareas.
 * Turns amber near the limit (>= 90%), turns red at the limit, and pops up a toast
 * notification when the character limit is reached.
 */
export default function CharCountBadge({
  value,
  maxChars = MAX_CHAR_LIMIT,
  variant = 'textarea', // 'textarea' | 'input' | 'compact'
  className = '',
}) {
  const toast = useToast();
  const toastRef = useRef(toast);
  toastRef.current = toast;

  const chars = countChars(value);
  const isAtLimit = chars >= maxChars;
  const isNearLimit = !isAtLimit && chars >= Math.floor(maxChars * 0.9);
  const wasAtLimitRef = useRef(false);

  useEffect(() => {
    if (isAtLimit && !wasAtLimitRef.current) {
      toastRef.current.warning(
        `Maximum limit of ${maxChars} characters reached.`,
        'Character Limit Reached'
      );
      wasAtLimitRef.current = true;
    } else if (!isAtLimit) {
      wasAtLimitRef.current = false;
    }
  }, [isAtLimit, maxChars]);

  const colorClass = isAtLimit
    ? 'text-red-600 font-semibold'
    : isNearLimit
    ? 'text-amber-600 font-semibold'
    : 'text-slate-400 font-medium';

  if (variant === 'textarea') {
    return (
      <span
        aria-live="polite"
        className={`pointer-events-none select-none absolute bottom-2 right-3 text-[11px] px-1.5 py-0.5 rounded transition-colors ${
          isAtLimit
            ? 'bg-red-50 border border-red-200 text-red-600 font-semibold'
            : `bg-white/90 ${colorClass}`
        } ${className}`}
      >
        {isAtLimit ? `Limit reached · ${chars} / ${maxChars} chars` : `${chars} / ${maxChars} chars`}
      </span>
    );
  }

  return (
    <span
      aria-live="polite"
      className={`pointer-events-none select-none absolute inset-y-0 right-2.5 flex items-center text-[10px] ${colorClass} ${className}`}
    >
      {variant === 'compact'
        ? isAtLimit
          ? `${chars}/${maxChars}!`
          : `${chars}/${maxChars}`
        : isAtLimit
        ? `Limit · ${chars}/${maxChars}`
        : `${chars} / ${maxChars} chars`}
    </span>
  );
}
