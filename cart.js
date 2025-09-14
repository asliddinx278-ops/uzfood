/* =========================================================
   CART MODULE – 1 000 000 $
   ========================================================= */
const tg = window.Telegram?.WebApp || {};

export let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let currentLocation = null;

export function saveCart(){
  localStorage.setItem('cart', JSON.stringify(cart));
  updateBadge();
}
export function updateBadge(){
  const total = cart.reduce((s,i)=>s+i.qty,0);
  const badge = document.getElementById('cartBadge');
  if(badge) badge.textContent = total||'';
}

export function addToCart(id,name,price,qty,img){
  const exist = cart.find(i=>i.id==id);
  if(exist) exist.qty += qty;
  else cart.push({id,name,price,qty,img});
  saveCart();
  tg.HapticFeedback?.impactLight();
}

window.changeQty = (id, delta) => {
  const item = cart.find(i=>i.id==id);
  if(!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(); renderCart();
};

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
  document.getElementById('getLocBtn').onclick = getLocation;
}

window.removeItem = id=>{
  cart=cart.filter(i=>i.id!=id);
  saveCart(); renderCart();
};

function getLocation(){
  if(!navigator.geolocation){ alert('Brauzer joylashuvni qo‘llab-quvvatlamaydi'); return; }
  const btn = document.getElementById('getLocBtn');
  btn.textContent = 'Yuborilmoqda...'; btn.disabled = true;
  navigator.geolocation.getCurrentPosition(
    pos=>{
      currentLocation = { lat: pos.coords.latitude, lon: pos.coords.longitude };
      document.getElementById('locText').textContent = `Lat: ${currentLocation.lat.toFixed(5)}, Lon: ${currentLocation.lon.toFixed(5)}`;
      btn.textContent = 'Yuborildi ✅';
    },
    err=>{
      btn.textContent = 'Xato ❌'; btn.disabled = false;
      alert('Joylashuvni olishda xato: ' + err.message);
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
  );
}

document.getElementById('checkoutBtn')?.addEventListener('click',()=>{
  if(!cart.length){alert("Savat bo‘sh!");return;}
  if(!currentLocation){alert("Iltimos joylashuvni yuboring!");return;}
  const order = {
    items: cart,
    total: cart.reduce((s,i)=>s+i.price*i.qty,0),
    location: currentLocation
  };
  window.Telegram?.WebApp?.sendData(JSON.stringify(order));
});
