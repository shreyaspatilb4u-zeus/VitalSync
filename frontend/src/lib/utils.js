/**
 * Helper utility functions
 */

/**
 * Format ISO date string into readable date (e.g. Oct 14, 2026)
 */
export function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Format ISO date string into readable time (e.g. 09:30 AM)
 */
export function formatTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Format ISO date string into readable date & time
 */
export function formatDateTime(isoString) {
  if (!isoString) return '';
  return `${formatDate(isoString)} at ${formatTime(isoString)}`;
}

/**
 * Format date to YYYY-MM-DD
 */
export function toISODateString(date) {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

/**
 * Generate a friendly ID (e.g. for mock creations)
 */
export function generateId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Classnames joining helper
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Global word limit enforced across portal text inputs
 */
export const MAX_WORD_LIMIT = 200;

/**
 * Count words in a string (whitespace-delimited tokens)
 */
export function countWords(text) {
  if (!text || typeof text !== 'string') return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

/**
 * Enforce a maximum word limit while preserving formatting/newlines within the allowed words
 */
export function enforceWordLimit(text, maxWords = MAX_WORD_LIMIT) {
  if (!text || typeof text !== 'string') return '';
  if (countWords(text) <= maxWords) return text;

  const match = text.match(new RegExp(`^\\s*(?:\\S+\\s+){0,${maxWords - 1}}\\S+`));
  return match ? match[0] : text.trim().split(/\s+/).slice(0, maxWords).join(' ');
}
