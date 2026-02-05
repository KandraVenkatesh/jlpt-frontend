const KEY = "progress";

function readProgress() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

/**
 * Returns viewed count for a type & level
 */
export function getViewed(type, level) {
  const p = readProgress();
  return p?.[type]?.[level]?.length || 0;
}

/**
 * Calculates percentage safely
 */
export function percent(viewed, total) {
  if (!total || total === 0) return 0;
  return Math.round((viewed / total) * 100);
}
