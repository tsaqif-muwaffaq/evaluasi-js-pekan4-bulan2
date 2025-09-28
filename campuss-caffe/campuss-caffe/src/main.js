import { fetchCoffees } from './modules/api.js';
import { loadCache, saveCache, savePrefs, loadPrefs } from './modules/storage.js';
import { renderList } from './modules/ui.js';
import './theme.js';

const listEl = document.getElementById('list');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');
const themeToggle = document.getElementById('themeToggle');
let coffees = [];
let type = 'hot'; // could be toggled later

async function load() {
  loadingEl.hidden = false;
  errorEl.hidden = true;
  // try cache first
  const cached = loadCache();
  if (cached && Array.isArray(cached)) {
    coffees = cached;
    renderList(listEl, coffees);
  }
  try {
    const res = await fetchCoffees(type);
    coffees = res;
    saveCache(type, res);
    renderList(listEl, coffees);
  } catch (err) {
    console.error(err);
    errorEl.hidden = false;
    errorEl.textContent = 'Terjadi kesalahan saat memuat menu. Coba muat ulang.';
    if (!cached) listEl.innerHTML = '';
  } finally {
    loadingEl.hidden = true;
  }
}

function wire() {
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    const filtered = coffees.filter(c => (c.title||'').toLowerCase().includes(q) || (c.description||'').toLowerCase().includes(q));
    renderList(listEl, applySort(filtered));
  });
  sortSelect.addEventListener('change', () => {
    renderList(listEl, applySort(coffees.slice()));
    savePrefs({ sort: sortSelect.value });
  });
  document.addEventListener('campuss:addorder', ev => {
    const item = ev.detail;
    const orders = JSON.parse(sessionStorage.getItem('campuss:order')||'[]');
    const existingItem = orders.find(o => String(o.id) === String(item.id));
    if (existingItem) {
      existingItem.quantity++;
    } else {
      orders.push({id: item.id, title: item.title, price: item.price, quantity: 1});
    }
    sessionStorage.setItem('campuss:order', JSON.stringify(orders));
    // Show confirmation instead of redirecting
    alert(`"${item.title}" telah ditambahkan ke pesanan.`);
  });

  // restore prefs
  const prefs = loadPrefs() || {};
  if (prefs.sort) sortSelect.value = prefs.sort;
}

function applySort(arr) {
  const v = sortSelect.value;
  if (v === 'alpha') return arr.sort((a,b)=> (a.title||'').localeCompare(b.title||''));
  if (v === 'alpha-desc') return arr.sort((a,b)=> (b.title||'').localeCompare(a.title||''));
  return arr;
}

// init
wire();
load();
