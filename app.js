import { renderTop5, renderMenu, renderCats } from '/uzfood/modules/main.js';
import { renderCart, updateBadge }            from '/uzfood/modules/cart.js';
import { renderSearch }                      from '/uzfood/modules/search.js';
import { renderProfile }                     from '/uzfood/modules/profile.js';

const tg = window.Telegram?.WebApp || {};
tg.expand?.();

/* ---------- Bottom Nav Click ---------- */
document.querySelectorAll('.nav-item').forEach(btn=>{
  btn.onclick = ()=>{
    const page = btn.dataset.page;
    showPage(page);
    document.querySelectorAll('.nav-item').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  };
});

function showPage(name){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(`page-${name}`).classList.add('active');
  if(name==='main')   { renderTop5(); renderCats(); renderMenu(); }
  if(name==='cart')   { renderCart(); }
  if(name==='search') { renderSearch(); }
  if(name==='profile'){ renderProfile(); }
}

/* ---------- Init ---------- */
showPage('main');
updateBadge();
