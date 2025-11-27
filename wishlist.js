/* =========================================================
   WISHLIST – 2025 (sevimlilar ro‘yxati)
   ========================================================= */
import { FULL_MENU } from './main.js';

export function renderWishlist() {
  const likes = JSON.parse(localStorage.getItem('wish') || '[]');
  const container = document.getElementById('wishList');
  if (!likes.length) {
    container.innerHTML = '<p class="empty">Sevimlilar yo‘q.</p>';
    return;
  }
  container.innerHTML = '';
  Object.values(FULL_MENU).flat()
    .filter(i => likes.includes(i.id))
    .forEach(item => {
      const card = document.createElement('div');
      card.className = 'menu-card';
      card.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <div class="menu-info">
          <h3>${item.name}</h3>
          <div class="rate">⭐ ${item.rating}</div>
          <p class="price">${item.price.toLocaleString()} so‘m</p>
          <button class="add-btn" onclick="addToCart(${item.id},'${item.name}',${item.price},1,'${item.img}')">Tanlash</button>
        </div>`;
      container.appendChild(card);
    });
}
