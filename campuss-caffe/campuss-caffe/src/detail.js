const orderListEl = document.getElementById('order-list');

function renderOrderList() {
  const orders = JSON.parse(sessionStorage.getItem('campuss:order') || '[]');
  if (orders.length === 0) {
    orderListEl.innerHTML = '<p>Keranjang pesanan Anda kosong. Silakan kembali ke menu untuk memesan.</p>';
    return;
  }
  
  const total = orders.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  orderListEl.innerHTML = `
    <ul class="order-items-list">
      ${orders.map(item => `
        <li class="order-item">
          <div class="details">
            <span>${escapeHTML(item.title)}</span>
            <br>
            <small>Rp ${item.price.toLocaleString('id-ID')}</small>
          </div>
          <div class="quantity-controls">
            <button class="btn-sm quantity-change" data-id="${escapeHTML(item.id)}" data-change="-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 512 512"><path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256C397.4 512 512 397.4 512 256S397.4 0 256 0zM352 280h-192C146.8 280 136 269.2 136 256c0-13.2 10.8-24 24-24h192C365.2 232 376 242.8 376 256C376 269.2 365.2 280 352 280z"/></svg>
            </button>
            <span>${item.quantity}</span>
            <button class="btn-sm quantity-change" data-id="${escapeHTML(item.id)}" data-change="1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1C5.9 1 1 5.9 1 12s4.9 11 11 11 11-4.9 11-11S18.1 1 12 1zm5 13h-3v3c0 1.1-.9 2-2 2s-2-.9-2-2v-3H7c-1.1 0-2-.9-2-2s.9-2 2-2h3V7c0-1.1.9-2 2-2s2 .9 2 2v3h3c1.1 0 2 .9 2 2s-.9 2-2 2z"/></svg>
            </button>
          </div>
        </li>
      `).join('')}
    </ul>
    <div class="order-summary">
      <div class="order-total">
        <span>Total</span>
        <span>Rp ${total.toLocaleString('id-ID')}</span>
      </div>
      <div class="order-actions">
        <button class="btn" id="checkout">Pesan via WhatsApp</button>
        <button class="btn btn-outline" id="clear-order">Kosongkan Pesanan</button>
      </div>
    </div>
  `;
  
  // Staggered animation for list items
  orderListEl.querySelectorAll('.order-item').forEach((item, index) => {
    item.style.animationDelay = `${index * 50}ms`;
  });

}

function updateQuantity(id, change) {
  const oldTotal = (JSON.parse(sessionStorage.getItem('campuss:order') || '[]')).reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let orders = JSON.parse(sessionStorage.getItem('campuss:order') || '[]');
  const itemIndex = orders.findIndex(o => String(o.id) === id);

  if (itemIndex > -1) {
    orders[itemIndex].quantity += change;
    if (orders[itemIndex].quantity <= 0) {
      // Remove item if quantity is 0 or less
      orders.splice(itemIndex, 1);
    }
  }
  
  sessionStorage.setItem('campuss:order', JSON.stringify(orders));
  renderOrderList();

  // Animate total if it changed
  const newTotal = orders.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  if (oldTotal !== newTotal) {
    document.querySelector('.order-total')?.classList.add('total-pop');
  }
}

function escapeHTML(s='') {
  return String(s).replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
}

function setupEventListeners() {
  orderListEl.addEventListener('click', (e) => {
    // Handle quantity changes
    const quantityBtn = e.target.closest('.quantity-change');
    if (quantityBtn) {
      const id = quantityBtn.dataset.id;
      const change = parseInt(quantityBtn.dataset.change, 10);
      updateQuantity(id, change);
      return;
    }

    // Handle clear order
    if (e.target.closest('#clear-order')) {
      if (confirm('Anda yakin ingin mengosongkan semua pesanan?')) {
        sessionStorage.setItem('campuss:order', '[]');
        renderOrderList();
      }
      return;
    }

    // Handle checkout
    if (e.target.closest('#checkout')) {
      const orders = JSON.parse(sessionStorage.getItem('campuss:order') || '[]');
      if (orders.length > 0) {
        const total = orders.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let message = "Halo Campuss Caffe, saya mau pesan:\n\n";
        orders.forEach(item => {
          message += `- ${item.title} (x${item.quantity})\n`;
        });
        message += `\nTotal: *Rp ${total.toLocaleString('id-ID')}*`;
        const whatsappURL = `https://api.whatsapp.com/send?phone=6285236475117&text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
      }
    }
  });
}

renderOrderList();
setupEventListeners();
