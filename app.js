import { renderTop5, renderMenu, renderCats } from './main.js';
import { renderCart, updateBadge } from './cart.js';
import { renderSearch } from './search.js';
import { renderProfile } from './profile.js';

const tg = window.Telegram?.WebApp || {};
tg.expand?.();

/* ---------- Theme ---------- */
const themeBtn = document.getElementById('themeBtn');
themeBtn.onclick = () => {
  document.body.classList.toggle('dark');
  const icon = themeBtn.querySelector('span');
  icon.textContent = document.body.classList.contains('dark') ? 'brightness_7' : 'brightness_4';
};

/* ---------- Language ---------- */
window.lang = localStorage.getItem('lang') || 'uz';
window.t = {
  uz: { main: "Asosiy", search: "Qidiruv", cart: "Savat", profile: "Profil" },
  ru: { main: "Главная", search: "Поиск", cart: "Корзина", profile: "Профиль" },
  en: { main: "Home", search: "Search", cart: "Cart", profile: "Profile" }
};

/* ---------- Bottom Nav ---------- */
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.onclick = () => {
    const page = btn.dataset.page;
    showPage(page);
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    tg.HapticFeedback?.impactLight();
  };
});

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${name}`).classList.add('active');
  if (name === 'main') { renderTop5(); renderCats(); renderMenu(); }
  if (name === 'cart') { renderCart(); }
  if (name === 'search') { renderSearch(); }
  if (name === 'profile') { renderProfile(); }
  if (name === 'wish') { renderWishlist(); }
  if (name === 'orders') { renderOrders(); }
}

/* ---------- MainButton ---------- */
tg.MainButton.setText('Buyurtma berish');
tg.MainButton.onClick(() => {
  if (cart.length) document.getElementById('checkoutBtn').click();
  else tg.showAlert('Savat bo‘sh!');
});

/* ---------- Initial ---------- */
showPage('main');
updateBadge();
