import { api } from './modules/api.js';
import { ui } from './modules/ui.js';
import { storage } from './modules/storage.js';

// Router-ish: decide which initializer to run
const path = location.pathname.split('/').pop();
if (path === '' || path === 'index.html') {
  initIndex();
} else if (path === 'detail.html') {
  initDetail();
}

async function initIndex() {
  const searchInput = document.getElementById('search');
  const listEl = document.getElementById('surah-list');
  const loading = document.getElementById('loading');
  const errorEl = document.getElementById('error');

  loading.classList.remove('hidden');
  try {
    let surahs = storage.getCached('surahs');
    if (!surahs) {
      surahs = await api.getSurahList(); // fetch from equran.id
      storage.setCached('surahs', surahs);
    }
    ui.renderSurahList(listEl, surahs);
    loading.classList.add('hidden');
  } catch (err) {
    console.error(err);
    loading.classList.add('hidden');
    errorEl.textContent = 'Gagal memuat daftar surat. Coba muat ulang halaman.';
    errorEl.classList.remove('hidden');
  }

  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    ui.filterSurahList(q);
  });
}

async function initDetail() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const titleEl = document.getElementById('surah-title');
  const versesEl = document.getElementById('verses');
  const loading = document.getElementById('detail-loading');
  const err = document.getElementById('detail-error');

  if (!id) {
    err.textContent = 'ID surat tidak ditemukan.';
    err.classList.remove('hidden');
    loading.classList.add('hidden');
    return;
  }

  try {
    const cached = storage.getCached('surah_'+id);
    let detail;
    if (cached) {
      detail = cached;
    } else {
      detail = await api.getSurahDetail(id); // fetch specific surat from equran.id
      storage.setCached('surah_'+id, detail);
    }
    titleEl.textContent = `${detail.nama_latin || detail.name} — ${detail.arti || ''}`;
    ui.renderSurahDetail(versesEl, detail);
    loading.classList.add('hidden');
  } catch (e) {
    console.error(e);
    loading.classList.add('hidden');
    err.textContent = 'Gagal memuat ayat. Coba lagi nanti.';
    err.classList.remove('hidden');
  }
}
