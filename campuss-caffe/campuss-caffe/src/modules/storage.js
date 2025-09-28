// storage.js — caching helper
const CACHE_KEY = 'campuss:coffeeCache:v1';
const PREF_KEY = 'campuss:preferences:v1';

export function saveCache(type, data) {
  const payload = { type, ts: Date.now(), data };
  localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
}

export function loadCache(maxAge = 1000 * 60 * 60) { // 1 hour default
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (Date.now() - obj.ts > maxAge) return null;
    return obj.data;
  } catch { return null; }
}

export function savePrefs(prefs) {
  const cur = loadPrefs() || {};
  localStorage.setItem(PREF_KEY, JSON.stringify({...cur, ...prefs}));
}
export function loadPrefs() {
  try { return JSON.parse(localStorage.getItem(PREF_KEY)); } catch { return null; }
}
