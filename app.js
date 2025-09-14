/* =========================================================
   100 000 $  BOT  –  PREMIUM  APP.JS  (yangi dizayn uchun)
   ========================================================= */

import { renderTop5, renderMenu, renderCats } from '/uzfood/modules/main.js';
import { renderCart, updateBadge }            from '/uzfood/modules/cart.js';
import { renderSearch }                      from '/uzfood/modules/search.js';
import { renderProfile }                     from '/uzfood/modules/profile.js';

/* ---------- Telegram WebApp ---------- */
const tg = window.Telegram?.WebApp || {};
tg.expand?.();

/* ---------- Theme Toggle (yangi) ---------- */
const themeBtn = document.getElementById('themeBtn');
if (themeBtn) {
  themeBtn.onclick = () => {
    document.body.classList.toggle('dark');
    const icon = themeBtn.querySelector('span');
    icon.textContent = document.body.classList.contains('dark')
      ? 'brightness_7'
      : 'brightness_4';
  };
}

/* ---------- Bottom Nav ---------- */
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.onclick = () => {
    const page = btn.dataset.page;
    showPage(page);
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  };
});

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${name}`).classList.add('active');

  if (name === 'main')    { renderTop5(); renderCats(); renderMenu(); }
  if (name === 'cart')    { renderCart(); }
  if (name === 'search')  { renderSearch(); }
  if (name === 'profile') { renderProfile(); }
}

/* ---------- Initial Load ---------- */
showPage('main');
updateBadge();
