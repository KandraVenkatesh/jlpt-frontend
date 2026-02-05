// src/utils/favorites.js

const KEY_MAP = {
  vocab: "favorites_vocab",
  kanji: "favorites_kanji",
};

export function getFavorites(type) {
  return JSON.parse(localStorage.getItem(KEY_MAP[type]) || "[]");
}

export function isFavorite(type, id) {
  return getFavorites(type).some(item => item.id === id);
}

export function toggleFavorite(type, item) {
  const key = KEY_MAP[type];
  const current = getFavorites(type);

  const exists = current.some(x => x.id === item.id);
  const updated = exists
    ? current.filter(x => x.id !== item.id)
    : [...current, item];

  localStorage.setItem(key, JSON.stringify(updated));
  return updated; // IMPORTANT: return updated list
}
