// ui.js — rendering helpers
export function createCard(item) {
  const el = document.createElement('article');
  el.className = 'card';
  el.innerHTML = `
    <div class="img" role="img" aria-label="${escapeHTML(item.title || item.title)}">
      <span>${(item.title||'Coffee')}</span>
    </div>
    <h3>${escapeHTML(item.title || '')}</h3>
    <p>${escapeHTML(item.description || '—')}</p>
    <div class="meta">
      <span class="price">Rp ${item.price.toLocaleString('id-ID')}</span>
      <button class="btn add-order">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg>
        Pesan
      </button>
    </div>
  `;
  // small event for animation
  el.querySelector('.add-order').addEventListener('click', () => {
    const ev = new CustomEvent('campuss:addorder', { detail: item, bubbles: true });
    el.dispatchEvent(ev);
    el.animate([{transform:'scale(1)'},{transform:'scale(1.05)'},{transform:'scale(1)'}],{duration:260});
  });
  return el;
}

export function renderList(container, items) {
  container.innerHTML = '';
  if (!items || items.length === 0) {
    container.innerHTML = '<div class="loading">Tidak ada menu.</div>';
    return;
  }
  const frag = document.createDocumentFragment();
  items.forEach(item => frag.appendChild(createCard(item)));
  container.appendChild(frag);
}

/* small utilities */
export function escapeHTML(s='') {
  return String(s).replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
}
export function truncate(s, n=100) {
  if (!s) return '';
  return s.length > n ? s.slice(0,n-1) + '…' : s;
}
