let currentSurahs = [];

function surahItemTemplate(s) {
  return `
  <div class="surah-item" data-id="${s.number}" tabindex="0" role="button" aria-pressed="false">
    <div class="surah-header">
      <div class="surah-number">${s.number}</div>
      <div>
        <div class="surah-name">${s.name}</div>
        <div class="surah-translate">${s.nama_latin || ''} · ${s.numberOfAyahs || ''} ayat</div>
      </div>
    </div>
  </div>
  `;
}

export const ui = {
  renderSurahList(container, surahs) {
    currentSurahs = surahs;
    container.innerHTML = surahs.map(surahItemTemplate).join('') || '<div class="loading">Tidak ada surat.</div>';
    // attach events
    container.querySelectorAll('.surah-item').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-id');
        location.href = `detail.html?id=${id}`;
      });
      el.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.click();
        }
      });
    });
  },

  filterSurahList(q) {
    const container = document.getElementById('surah-list');
    if (!q) {
      container.innerHTML = currentSurahs.map(surahItemTemplate).join('');
    } else {
      const filtered = currentSurahs.filter(s => {
        const hay = (s.number + ' ' + s.name + ' ' + (s.nama_latin || '') + ' ' + (s.arti || '')).toLowerCase();
        return hay.includes(q);
      });
      container.innerHTML = filtered.map(s => {
        const re = new RegExp(q, 'ig');
        const name = s.name.replace(re, m => `<span class="search-highlight">${m}</span>`);
        const latin = (s.nama_latin || '').replace(re, m => `<span class="search-highlight">${m}</span>`);
        return `
        <div class="surah-item" data-id="${s.number}" tabindex="0" role="button">
          <div class="surah-header">
            <div class="surah-number">${s.number}</div>
            <div>
              <div class="surah-name">${name}</div>
              <div class="surah-translate">${latin} · ${s.numberOfAyahs || ''} ayat</div>
            </div>
          </div>
        </div>`;
      }).join('') || '<div class="loading">Hasil tidak ditemukan.</div>';
    }
    // reattach events
    container.querySelectorAll('.surah-item').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-id');
        location.href = `detail.html?id=${id}`;
      });
      el.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
      });
    });
  },

  renderSurahDetail(container, detail) {
    if (!detail || !Array.isArray(detail.ayahs)) {
      container.innerHTML = '<div class="error">Tidak ada ayat.</div>';
      return;
    }
    container.innerHTML = '';
    detail.ayahs.forEach(a => {
      const div = document.createElement('div');
      div.className = 'verse';
      const trans = a.translation || '';
      div.innerHTML = `
        <div class="arab">${a.text || ''}</div>
        <div class="translation">${trans}</div>
      `;
      container.appendChild(div);
    });
  }
};
