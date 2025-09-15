/* =========================================================
   CART MODULE – 1 000 000 $  (savatda joylashuv yoʻq,
   tasdiqlash bosilgina Telegram location so‘raydi)
   ========================================================= */
const tg = window.Telegram?.WebApp || {};

export let cart = JSON.parse(localStorage.getItem('cart') || '[]');

/* ---------- saqlash + badge ---------- */
export function saveCart(){
  localStorage.setItem('cart', JSON.stringify(cart));
  updateBadge();
}
export function updateBadge(){
  const total = cart.reduce((s,i)=>s+i.qty,0);
  const badge = document.getElementById('cartBadge');
  if(badge) badge.textContent = total||'';
}

/* ---------- savatga qo‘shish ---------- */
export function addToCart(id,name,price,qty,img){
  const exist = cart.find(i=>i.id==id);
  if(exist) exist.qty += qty;
  else cart.push({id,name,price,qty,img});
  saveCart();
  tg.HapticFeedback?.impactLight();
}

/* ---------- sonini o‘zgartirish ---------- */
window.changeQty = (id, delta) => {
  const item = cart.find(i=>i.id==id);
  if(!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(); renderCart();
};

/* ---------- savatni ekranga chiqarish (JOYLASHUV YO‘Q) ---------- */
export function renderCart(){
  const list = document.getElementById('cartList');
  const totalEl = document.getElementById('total');

  if(!cart.length){
    list.innerHTML='<p class="empty">Savat bo‘sh</p>';
    totalEl.textContent='';
    return;
  }

  let html=''; let sum=0;
  cart.forEach(it=>{
    const sub = it.price * it.qty;
    sum+=sub;
    html+=`
      <div class="cart-item">
        <img src="${it.img || 'https://i.imgur.com/8cK9w.jpg'}" alt="${it.name}">
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

  /* ========== JOYLASHUV BO‘LIMI O‘CHIRILDI ========== */
  list.innerHTML = html;
  totalEl.textContent = `Jami: ${sum.toLocaleString()} so‘m`;
}

/* ---------- mahsulotni o‘chirish ---------- */
window.removeItem = id=>{
  cart=cart.filter(i=>i.id!=id);
  saveCart(); renderCart();
};

/* ========== TASDIQLASH: Telegram native location so‘raydi ========== */
document.getElementById('checkoutBtn')?.addEventListener('click',()=>{
  if(!cart.length){alert("Savat bo‘sh!");return;}

  const tg = window.Telegram?.WebApp;
  if(!tg){alert("Iltimos telegram orqali oching!");return;}

  /* Telegram native location dialogi */
  tg.MainButton.text = "Joylashuvni yuborish";
  tg.MainButton.show();
  tg.MainButton.onClick(() => {
      tg.requestLocation(() => {});   // location so‘rovini yuboradi
  });
});
