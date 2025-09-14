/* =========================================================
   SEARCH MODULE – 1 000 000 $
   ========================================================= */
import { FULL_MENU } from './main.js';

export function renderSearch(){
  const inp = document.getElementById('searchInp');
  const res = document.getElementById('searchRes');

  inp.oninput = () => {
    const q = inp.value.trim().toLowerCase();
    if(!q){ res.innerHTML=''; return; }

    const found = Object.values(FULL_MENU)
                       .flat()
                       .filter(item => item.name.toLowerCase().includes(q));

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
                  onclick="import('./cart.js').then(m=>m.addToCart(${it.id},'${it.name}',${it.price},1))">
            Tanlash
          </button>
        </div>`;
      res.appendChild(card);
    });
  };

  inp.oninput();
}
