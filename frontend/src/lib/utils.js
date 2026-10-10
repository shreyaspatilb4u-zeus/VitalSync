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
