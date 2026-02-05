const KEY = "progress";

function readProgress() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

function writeProgress(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

/**
 * Mark an item as viewed
 * @param {"kanji" | "vocab"} type
 * @param {"N5" | "N4" | "N3"} level
 * @param {number|string} id
 */
export function markViewed(type, level, id) {
  if (!type || !level || !id) return;

  const progress = readProgress();

  if (!progress[type]) progress[type] = {};
  if (!progress[type][level]) progress[type][level] = [];

  if (!progress[type][level].includes(id)) {
    progress[type][level].push(id);
    writeProgress(progress);
  }
}

/**
 * Get viewed count
 */
export function getViewedCount(type, level) {
  const progress = readProgress();
  return progress?.[type]?.[level]?.length || 0;
}
