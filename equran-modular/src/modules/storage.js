export const storage = {
  setCached(key, value) {
    const payload = { ts: Date.now(), data: value };
    try {
      localStorage.setItem(key, JSON.stringify(payload));
    } catch (e) {
      console.warn('localStorage set failed', e);
    }
  },
  getCached(key, maxAge = 1000 * 60 * 60 * 24) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (Date.now() - obj.ts > maxAge) {
        localStorage.removeItem(key);
        return null;
      }
      return obj.data;
    } catch (e) {
      return null;
    }
  },
  clear(key) { try { localStorage.removeItem(key); } catch {} }
};
