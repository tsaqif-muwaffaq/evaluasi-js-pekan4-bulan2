// Module: API wrapper for https://equran.id
const BASE = 'https://equran.id/api/v2';

async function safeFetch(url) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } catch (e) {
    // Re-throw after logging so caller can show UI error
    console.error('Fetch error for', url, e);
    throw e;
  }
}

export const api = {
  async getSurahList() {
    const url = `${BASE}/surat`;
    const json = await safeFetch(url);
    if (!json || !json.data) throw new Error('Invalid response for surah list');
    // normalize fields
    return json.data.map(s => ({
      number: s.nomor || s.number || s.id,
      name: s.nama || s.surah || s.name,
      nama_latin: s.nama_latin || s.latin || s.terjemahan || '',
      arti: s.arti || s.translation || '',
      numberOfAyahs: s.jumlah_ayat || s.ayat || s.jumlah || ''
    }));
  },

  async getSurahDetail(id) {
    const url = `${BASE}/surat/${encodeURIComponent(id)}`;
    const json = await safeFetch(url);
    if (!json || !json.data) throw new Error('Invalid response for surah detail');
    const s = json.data;
    return {
      number: s.nomor || s.number || s.id,
      name: s.nama, // v2 API uses 'nama' for Arabic name
      nama_latin: s.nama_latin || s.latin || '',
      arti: s.arti || s.arti_ar || s.translation || '',
      ayahs: (s.ayat || []).map(a => ({
        number: a.nomor || a.number || a.ayat,
        text: a.teksArab || a.arab || '',
        translation: a.teksIndonesia || a.terjemahan || a.arti || ''
      }))
    };
  }
};
