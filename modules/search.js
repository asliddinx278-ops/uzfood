/* =========================================================
   SEARCH MODULE – PREMIUM (to‘liq, rasm bilan)
   ========================================================= */

import { FULL_MENU } from '/uzfood/modules/main.js';

export function renderSearch(){
  const inp = document.getElementById('searchInp');
  const res = document.getElementById('searchRes');

  /* birinchi yuklaganda bo‘sh bo‘lsa */
  if(!inp || !res) return;

  inp.oninput = () => {
    const q = inp.value.trim().toLowerCase();
    if(!q){ res.innerHTML=''; return; }

    /* nom bo‘yicha qidirish */
    const found = Object.values(FULL_MENU)
                       .flat()
                       .filter(item => item.name.toLowerCase().includes(q));

    /* natijani chiqarish */
    res.innerHTML = '';
    if(!found.length){ res.innerHTML='<p class="empty">Hech narsa topilmadi</p>'; return; }

    found.forEach(it=>{
      const card = document.createElement('div');
      card.className = 'menu-card';
      card.innerHTML = `
        <img src="${it.img}" alt="${it.name}">
        <div class="menu-info">
          <h3>${it.name}</h3>
          <p class="price">${it.price.toLocaleString()} so‘m</p>
          <button class="add-btn"
                  onclick="import('/uzfood/modules/cart.js')
                          .then(m=>m.addToCart(${it.id},'${it.name}',${it.price},1))">
            Tanlash
          </button>
        </div>`;
      res.appendChild(card);
    });
  };

  /* birinchi ochilganda bo‘sh holat */
  inp.oninput();
      }
