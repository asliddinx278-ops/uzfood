/* =========================================================
   1 000 000 $  APP.JS
   ========================================================= */
import { renderTop5, renderMenu, renderCats } from './main.js';
import { renderCart, updateBadge }            from './cart.js';
import { renderSearch }                      from './search.js';
import { renderProfile }                     from './profile.js';

const tg = window.Telegram?.WebApp || {};
tg.expand?.();

/* ---------- Theme Toggle ---------- */
const themeBtn = document.getElementById('themeBtn');
if (themeBtn) {
  themeBtn.onclick = () => {
    document.body.classList.toggle('dark');
    const icon = themeBtn.querySelector('span');
    icon.textContent = document.body.classList.contains('dark') ? 'brightness_7' : 'brightness_4';
    document.body.style.transition = 'background .25s, color .25s';
  };
}

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
  if (name === 'main')    { renderTop5(); renderCats(); renderMenu(); }
  if (name === 'cart')    { renderCart(); }
  if (name === 'search')  { renderSearch(); }
  if (name === 'profile') { renderProfile(); }
}

/* ---------- Initial Load ---------- */
showPage('main');
updateBadge();
