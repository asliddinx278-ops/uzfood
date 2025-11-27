/* =========================================================
   CART – 2025 (savat + buyurtma + telefon + animatsiya)
   ========================================================= */
const tg = window.Telegram?.WebApp || {};

window.cart = JSON.parse(localStorage.getItem('cart') || '[]');

export function saveCart() {
  localStorage.setItem('cart', JSON.stringify(window.cart));
  updateBadge();
}

export function updateBadge() {
  const total = window.cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = total || '';
}

export function addToCart(id, name, price, qty, img) {
  const exist = window.cart.find(i => i.id == id);
  if (exist) exist.qty += qty;
  else window.cart.push({ id, name, price, qty, img });
  saveCart();
  tg.HapticFeedback?.impactLight();
  tg.showAlert('✅ Savatga qo‘shildi!');
}

window.changeQty = (id, delta) => {
  const item = window.cart.find(i => i.id == id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
  renderCart();
};

window.removeItem = id => {
  window.cart = window.cart.filter(i => i.id != id);
  saveCart();
  renderCart();
};

export function renderCart() {
  const list = document.getElementById('cartList');
  const totalEl = document.getElementById('total');

  if (!window.cart.length) {
    list.innerHTML = '<p class="empty">Savat bo‘sh</p>';
    totalEl.textContent = '';
    return;
  }

  let html = '';
  let sum = 0;
  window.cart.forEach(it => {
    const sub = it.price * it.qty;
    sum += sub;
    html += `
      <div class="cart-item">
        <img src="${it.img}" alt="${it.name}">
        <div class="cart-details">
          <h4>${it.name}</h4>
          <p>${it.price.toLocaleString()} so‘m</p>
          <div class="counter-row">
            <button onclick="changeQty(${it.id},-1)">−</button>
            <span>${it.qty}</span>
            <button onclick="changeQty(${it.id},+1)">+</button>
          </div>
          <div class="item-total">Jami: ${sub.toLocaleString()} so‘m</div>
        </div>
        <button class="remove-btn" onclick="removeItem(${it.id})">
          <span class="material-symbols-rounded">delete</span>
        </button>
      </div>`;
  });

  list.innerHTML = html;
  totalEl.textContent = `Jami: ${sum.toLocaleString()} so‘m`;
}

// ========== BUYURTMA BERISH ==========
document.getElementById('checkoutBtn')?.addEventListener('click', async () => {
  if (!window.cart.length) {
    tg.showAlert('❌ Savat bo‘sh!');
    return;
  }

  const btn = document.getElementById('checkoutBtn');
  btn.disabled = true;
  btn.textContent = "⏳ Yuborilmoqda...";

  await new Promise(r => setTimeout(r, 600));

  const items = window.cart.map(i => ({ id: i.id, name: i.name, q: i.qty, price: i.price }));
  const total = window.cart.reduce((s, i) => s + i.price * i.qty, 0);
  const phone = localStorage.getItem('phone') || ''; // ✅ telefon

  tg.sendData(JSON.stringify({ action: "order", items, total, phone }));

  btn.textContent = "✅ Buyurtma qabul qilindi!";
  btn.style.background = "#38a169";

  window.cart = [];
  saveCart();
  renderCart();

  setTimeout(() => {
    btn.textContent = "📍 Joylashuvni yuboring...";
    btn.style.background = "#3182ce";
  }, 1000);
});
