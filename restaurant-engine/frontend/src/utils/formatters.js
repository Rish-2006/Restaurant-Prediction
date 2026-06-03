/**
 * formatters.js
 * Display formatting helpers — numbers, labels, colours.
 */

export const PRICE_LABELS      = ['', '$', '$$', '$$$', '$$$$'];
export const PRICE_LABELS_FULL = ['', 'Budget', 'Mid-range', 'Premium', 'Luxury'];
export const PRICE_COLORS      = ['', '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'];
export const PIE_COLORS        = ['#10B981','#3B82F6','#8B5CF6','#F59E0B','#EF4444','#EC4899','#06B6D4','#84CC16'];

/** Return a hex colour for a given rating value */
export function ratingColor(r) {
  if (r >= 4.5) return '#10B981';
  if (r >= 4.0) return '#22C55E';
  if (r >= 3.5) return '#F59E0B';
  if (r >= 3.0) return '#EF4444';
  return '#94A3B8';
}

/** Format large numbers: 1200 → "1.2k" */
export function formatVotes(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

/** Capitalise first letter */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
