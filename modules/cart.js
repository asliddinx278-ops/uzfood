/* =========================================================
   CART MODULE – PORSIYA + NARX + LOCATION
   ========================================================= */

const tg = window.Telegram?.WebApp || {};

export let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let currentLocation = null; // {lat, lon}

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
export function addToCart(id,name,price,qty){
  const exist = cart.find(i=>i.id==id);
  if(exist) exist.qty += qty;
  else cart.push({id,name,price,qty});
  saveCart();
  tg.HapticFeedback?.impactLight();
}

/* ---------- porsiya o‘zgartirganda narx ---------- */
window.changeQty = (id, delta) => {
  const item = cart.find(i=>i.id==id);
  if(!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(); renderCart();
};

/* ---------- savatni ekranga chiqarish ---------- */
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
        <img src="https://i.imgur.com/8cK9w.jpg" alt="${it.name}">
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

  /* umumiy narx + joylashuv */
  list.innerHTML = html + `
    <div class="loc-box">
      <span class="material-symbols-rounded">location_on</span>
      <div>
        <div class="label">Yetkazish manzili</div>
        <div class="value" id="locText">Yuborilmagan</div>
      </div>
      <button id="getLocBtn">Joylashuvni yuborish</button>
    </div>`;

  totalEl.textContent=`Jami: ${sum.toLocaleString()} so‘m`;

  /* joylashuv tugmasi */
  document.getElementById('getLocBtn').onclick = getLocation;
}

/* ---------- mahsulotni o‘chirish ---------- */
window.removeItem = id=>{
  cart=cart.filter(i=>i.id!=id);
  saveCart(); renderCart();
};

/* ---------- joylashuv olish ---------- */
function getLocation(){
  if(!navigator.geolocation){ alert('Brauzingiz joylashuvni qo‘llab-quvvatlamaydi'); return; }

  const btn = document.getElementById('getLocBtn');
  btn.textContent = 'Yuborilmoqda...';
  btn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    pos=>{
      currentLocation = { lat: pos.coords.latitude, lon: pos.coords.longitude };
      document.getElementById('locText').textContent =
        `Lat: ${currentLocation.lat.toFixed(5)}, Lon: ${currentLocation.lon.toFixed(5)}`;
      btn.textContent = 'Yuborildi ✅';
    },
    err=>{
      btn.textContent = 'Xato ❌';
      btn.disabled = false;
      alert('Joylashuvni olishda xato: ' + err.message);
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
  );
}

/* ---------- rasmiylashtirish ---------- */
document.getElementById('checkoutBtn')?.addEventListener('click',()=>{
  if(!cart.length){alert("Savat bo‘sh!");return;}
  if(!currentLocation){alert("Iltimos joylashuvni yuboring!");return;}

  const order = {
    items: cart,
    total: cart.reduce((s,i)=>s+i.price*i.qty,0),
    location: currentLocation
  };

  /* admin-ga yuborish */
  tg.sendData(JSON.stringify(order));
});
        
