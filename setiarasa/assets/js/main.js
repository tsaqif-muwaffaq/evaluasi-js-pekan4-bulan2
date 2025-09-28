/* =========================================================
   Setia Rasa - Main JS
   Semua logika interaktif website
========================================================= */

// 🌐 API sumber data resep (TheMealDB)
const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

// =========================================================
// TOMBOL KEMBALI
// =========================================================
const backButtons = document.querySelectorAll('.back-button');
backButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    window.history.back();
  });
});

// =========================================================
// HAMBURGER MENU
// =========================================================
const hamburger = document.getElementById('hamburgerMenu');
const nav = document.querySelector('.nav');

if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburger.classList.toggle('active');
  });
}

// =========================================================
// RENDER MENU DARI API
// =========================================================
async function loadMenu(searchQuery = "") {
  try {
    const res = await fetch(API_URL + searchQuery);
    const data = await res.json();

    const menuContainer = document.getElementById("menuList");
    const featured = document.getElementById("featured-menu");
    const menuDropdown = document.getElementById("menu"); // Ambil elemen select

    if (!data.meals) {
      if (menuContainer) menuContainer.innerHTML = "<p>Tidak ada menu ditemukan.</p>";
      return;
    }

    // Render semua menu di halaman menu.html
    if (menuContainer) {
      menuContainer.innerHTML = data.meals
        .map(
          (meal) => `
          <div class="menu-card">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="menu-card-content">
              <h4>${meal.strMeal}</h4>
              <p>${meal.strArea} - ${meal.strCategory}</p>
              <button class="btn btn-sm add-to-cart-btn" data-meal-name="${meal.strMeal}">+ Keranjang</button>
            </div>
          </div>
        `
        )
        .join("");
    }

    // Render 3 menu unggulan di halaman index.html
    if (featured) {
      featured.innerHTML = data.meals
        .slice(0, 3)
        .map(
          (meal) => `
          <div class="menu-card">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="menu-card-content">
              <h4>${meal.strMeal}</h4>
              <p>${meal.strArea}</p>
              <button class="btn btn-sm add-to-cart-btn" data-meal-name="${meal.strMeal}">+ Keranjang</button>
            </div>
          </div>
        `
        )
        .join("");
    }

    // Render opsi menu di dropdown halaman pesan.html
    if (menuDropdown) {
      // Kosongkan opsi lama, sisakan placeholder
      menuDropdown.innerHTML = '<option value="">-- Pilih Menu --</option>';
      menuDropdown.innerHTML += data.meals
        .map(
          (meal) => `<option value="${meal.strMeal}">${meal.strMeal}</option>`
        )
        .join("");
    }
  } catch (err) {
    console.error("Gagal mengambil data:", err);
    const menuContainer = document.getElementById("menuList");
    const menuDropdown = document.getElementById("menu");
    if (menuContainer || menuDropdown) menuContainer.innerHTML = "<p>Gagal memuat data menu.</p>";
  }
  // Setelah menu dimuat, tambahkan event listener ke tombol keranjang
  setupAddToCartButtons();
}

// =========================================================
// SEARCH & FILTER MENU
// =========================================================
const searchBtn = document.getElementById("searchBtn");
if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    const query = document.getElementById("searchMenu").value;
    loadMenu(query);
  });
}

// =========================================================
// 🛒 SHOPPING CART LOGIC
// =========================================================
function setupAddToCartButtons() {
  const cartButtons = document.querySelectorAll('.add-to-cart-btn');
  cartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const mealName = button.dataset.mealName;
      addToCart(mealName);
      alert(`"${mealName}" telah ditambahkan ke keranjang!`);
    });
  });
}

function addToCart(mealName) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItem = cart.find(item => item.name === mealName);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name: mealName, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
}

function displayCartItems() {
  const cartContainer = document.getElementById('cartItems');
  if (!cartContainer) return;

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Keranjang Anda kosong. Silakan pilih menu.</p>';
    return;
  }

  cartContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span>${item.name} (x${item.quantity})</span>
    </div>
  `).join('');
}
// =========================================================
// FORM TESTIMONI
// =========================================================
const testimoniForm = document.getElementById("testimoniForm");
if (testimoniForm) {
  testimoniForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = document.getElementById("nama").value;
    const pesan = document.getElementById("pesan").value;

    // Simpan ke localStorage
    const testimonis = JSON.parse(localStorage.getItem("testimonis") || "[]");
    testimonis.push({ nama, pesan });
    localStorage.setItem("testimonis", JSON.stringify(testimonis));

    alert("Testimoni berhasil dikirim!");
    testimoniForm.reset();
    renderTestimoni();
  });
}

// Render testimoni dari localStorage
function renderTestimoni() {
  const container = document.getElementById("testimoniList");
  if (!container) return;

  const testimonis = JSON.parse(localStorage.getItem("testimonis") || "[]");
  container.innerHTML += testimonis
    .map(
      (t) => `
      <div class="testimoni-card">
        <p class="quote">"${t.pesan}"</p>
        <h4>– ${t.nama}</h4>
        <span>⭐⭐⭐⭐⭐</span>
      </div>
    `
    )
    .join("");
}

// =========================================================
// FORM PEMESANAN
// =========================================================
const orderForm = document.getElementById("orderForm");
if (orderForm) {
  orderForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nama = document.getElementById("nama").value;
    const alamat = document.getElementById("alamat").value;
    const telepon = document.getElementById("telepon").value;
    const pembayaran = document.getElementById("pembayaran").value;
    const catatan = document.getElementById("catatan").value;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
      alert("Keranjang Anda kosong. Silakan pilih menu terlebih dahulu.");
      return;
    }

    // 1. Format Pesan untuk WhatsApp
    const menuItemsText = cart.map(item => `- ${item.name} (x${item.quantity})`).join('\n');
    const totalPorsi = cart.reduce((total, item) => total + item.quantity, 0);

    let message = `Halo Setia Rasa, saya mau pesan:\n\n`;
    message += `*Nama:* ${nama}\n`;
    message += `*Telepon:* ${telepon}\n`;
    message += `*Alamat Pengantaran:*\n${alamat}\n\n`;
    message += `*Pesanan:*\n${menuItemsText}\n\n`;
    message += `*Total Porsi:* ${totalPorsi}\n`;
    message += `*Metode Pembayaran:* ${pembayaran}\n`;
    if (catatan) {
      message += `*Catatan:* ${catatan}\n`;
    }
    message += `\nTerima kasih!`;

    // 2. Buat URL WhatsApp
    const whatsappNumber = "6285767571976"; // Nomor tanpa '+' atau '0' di depan
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    // 3. Arahkan pengguna ke WhatsApp
    window.open(whatsappURL, '_blank');

    // 4. Kosongkan keranjang dan reset form setelah pesanan dikirim
    localStorage.removeItem('cart');
    orderForm.reset();
    displayCartItems(); // Perbarui tampilan keranjang menjadi kosong

    alert("Anda akan diarahkan ke WhatsApp untuk mengirim pesanan.");
  });
}

// =========================================================
// PRE-FILL FORM DARI URL
// =========================================================
function prefillOrderForm() {
  const params = new URLSearchParams(window.location.search);
  const menuToSelect = params.get('menu');
  const menuDropdown = document.getElementById('menu');

  if (menuToSelect && menuDropdown) {
    // Tunggu sebentar agar opsi dropdown dimuat oleh API
    setTimeout(() => {
      menuDropdown.value = menuToSelect;
    }, 500); // 0.5 detik delay
  }
}

// =========================================================
// INIT saat halaman dimuat
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
  loadMenu();      // Ambil data menu saat halaman dibuka
  renderTestimoni(); // Render testimoni tersimpan jika ada
  displayCartItems(); // Tampilkan item keranjang di halaman pesan
  prefillOrderForm(); // Cek jika ada menu yang perlu di-prefill
});
