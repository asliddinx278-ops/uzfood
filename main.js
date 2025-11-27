/* =========================================================
   MAIN MODULE – 2025 (mahsulot, reyting, sevimlilar, ripple, til, TOP-5)
   ========================================================= */

// API URL - change for production
const API = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://127.0.0.1:8080' 
  : 'https://your-backend.com';

export const FULL_MENU = {
  osh: [
    { id: 1, name: "G‘ijduvoncha osh", price: 25000, img: "https://i.ibb.co/v853GdT/720-460-95-1547113144.jpg", rating: 4.8 },
    { id: 2, name: "Farg‘ona osh", price: 27000, img: "https://i.ibb.co/q3HzJH37/images.jpg", rating: 4.9 },
    { id: 3, name: "Toshkentcha osh", price: 26000, img: "https://i.ibb.co/qzNg3qk/images-1.jpg", rating: 4.7 },
    { id: 4, name: "Qovurma osh", price: 28000, img: "https://i.ibb.co/qF1Rc9pN/images-2.jpg", rating: 4.6 },
    { id: 5, name: "Toy osh", price: 35000, img: "https://i.ibb.co/tTY9cFfS/image1.jpg", rating: 4.9 }
  ],
  shorva: [
    { id: 6, name: "Mastava", price: 12000, img: "https://i.ibb.co/PZtGJQDf/183ce0-3a3bcf40ab8d4a1abeb6d62d30576bd1-mv2.jpg", rating: 4.7 },
    { id: 7, name: "Sho‘rva", price: 13000, img: "https://i.ibb.co/JRxmfbfM/shurpa.jpg", rating: 4.8 },
    { id: 8, name: "Moshxo‘rda", price: 14000, img: "https://i.ibb.co/TB0pgZ1Z/72e038485cae55fa.jpg", rating: 4.6 },
    { id: 9, name: "Lag‘mon sho‘rva", price: 16000, img: "https://i.ibb.co/4Z7pqYv2/hq720.jpg", rating: 4.5 },
    { id: 10, name: "Ilik sho‘rva", price: 20000, img: "https://i.ibb.co/PsbRCGgS/1551335663-15489147748.jpg", rating: 4.9 }
  ],
  kabob: [
    { id: 11, name: "Jigar kabob", price: 18000, img: "https://i.ibb.co/PGv4rR6t/Beef-Shish-Kabob-6.jpg", rating: 4.8 },
    { id: 12, name: "Go‘sht kabob", price: 20000, img: "https://i.ibb.co/whXkSvb3/1200px-Shashlik.jpg", rating: 4.7 }
  ],
  salat: [
    { id: 13, name: "Chimchi", price: 6000, img: "https://i.ibb.co/NgsxmcmP/instagram1080-1024x1024.png", rating: 4.6 },
    { id: 14, name: "Smak", price: 7000, img: "https://i.ibb.co/3yRZS0vt/u-a2f97733b2b393c5c2fb19259e84f229.jpg", rating: 4.5 }
  ],
  ichimlik: [
    { id: 15, name: "Coca-Cola 0.5", price: 6000, img: "https://i.ibb.co/svhHFFCr/images-3.jpg", rating: 4.7 },
    { id: 16, name: "Pepsi 0.5", price: 6000, img: "https://i.ibb.co/sd7gQzRC/cqs8il7frr8a72r836l0.jpg", rating: 4.6 },
    { id: 17, name: "Fanta 0.5", price: 6000, img: "https://i.ibb.co/RkKzybFv/02dae68b7a16df10e2a356fefa05d33e.webp", rating: 4.8 }
  ],
  desert: [
    { id: 18, name: "Shakarap", price: 4000, img: "https://i.ibb.co/9myWgVZb/bfdejixlfomrkzsdmxsq-ogd2pemlkxf.webp", rating: 4.9 },
    { id: 19, name: "Pahlava", price: 8000, img: "https://i.ibb.co/FfvZP2Y/A537-LTKFGSVK7-DWQPCCF5-LAE.jpg", rating: 4.7 },
    { id: 20, name: "Medovik", price: 12000, img: "https://i.ibb.co/C5n5TvFg/Honey-cake-Medovik.jpg", rating: 4.8 }
  ]
};

let currentCat = 'osh';

/* ---------- Til ---------- */
const t = { uz: { add: "Tanlash" }, ru: { add: "Выбрать" }, en: { add: "Select" } };
const lang = localStorage.getItem('lang') || 'uz';

/* ---------- TOP-5 (REST) ---------- */
export async function renderTop5() {
  const box = document.getElementById('top5');
  if (!box) return;
  
  try {
    // Get all products and sort by rating
    const res = await fetch(`${API}/api/products`);
    if (!res.ok) throw new Error('API Error');
    const data = await res.json();
    const products = (data.products || [])
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);
    
    if (products.length === 0) {
      // Fallback: use top 5 from FULL_MENU
      box.innerHTML = '';
      const allItems = Object.values(FULL_MENU).flat().slice(0, 5);
      allItems.forEach(item => box.appendChild(createCard(item)));
    } else {
      box.innerHTML = '';
      products.forEach(item => box.appendChild(createCard(item)));
    }
  } catch (err) {
    console.warn('Top5 API failed, using local:', err);
    box.innerHTML = '';
    const allItems = Object.values(FULL_MENU).flat().slice(0, 5);
    allItems.forEach(item => box.appendChild(createCard(item)));
  }
}

/* ---------- Sevimlilar ---------- */
window.toggleWish = id => {
  let likes = JSON.parse(localStorage.getItem('wish') || '[]');
  if (likes.includes(id)) likes = likes.filter(i => i != id);
  else likes.push(id);
  localStorage.setItem('wish', JSON.stringify(likes));
  renderMenu();
};

/* ---------- Reyting ---------- */
function starRating(r) {
  const full = Math.floor(r);
  const half = r % 1 >= 0.5 ? 1 : 0;
  return '⭐'.repeat(full) + (half ? '⭐' : '') + '☆'.repeat(5 - full - half);
}

/* ---------- Mahsulot Kartochkasi ---------- */
function createCard(item) {
  const isLiked = JSON.parse(localStorage.getItem('wish') || '[]').includes(item.id);
  const card = document.createElement('div');
  card.className = 'menu-card';
  card.innerHTML = `
    <img src="${item.img}" alt="${item.name}">
    <button class="wish-btn ${isLiked ? 'liked' : ''}" onclick="toggleWish(${item.id})">
      <span class="material-symbols-rounded">${isLiked ? 'favorite' : 'favorite_border'}</span>
    </button>
    <div class="menu-info">
      <h3>${item.name}</h3>
      <div class="rate">${starRating(item.rating)} ${item.rating}</div>
      <p class="price">${item.price.toLocaleString()} so‘m</p>
      <button class="add-btn" onclick="addToCart(${item.id},'${item.name}',${item.price},1,'${item.img}')">
        ${t[lang].add}
      </button>
    </div>`;
  return card;
}

/* ---------- Menyu Render ---------- */
export async function renderMenu() {
  const container = document.getElementById('menu');
  container.innerHTML = '<p style="text-align:center; padding:20px;">⏳ Yuklanyapti...</p>';
  
  try {
    // Try to fetch from API first
    const res = await fetch(`${API}/api/products?cat=${currentCat}`);
    if (!res.ok) throw new Error('API Error');
    const data = await res.json();
    const products = data.products || [];
    
    if (products.length === 0) {
      // Fallback to local FULL_MENU if API returns empty
      container.innerHTML = '';
      FULL_MENU[currentCat]?.forEach(item => container.appendChild(createCard(item)));
    } else {
      container.innerHTML = '';
      products.forEach(item => container.appendChild(createCard(item)));
    }
  } catch (err) {
    console.warn('API failed, using local menu:', err);
    // Fallback to local data
    container.innerHTML = '';
    FULL_MENU[currentCat]?.forEach(item => container.appendChild(createCard(item)));
  }
}

/* ---------- Kategoriya Tugmalari ---------- */
export function renderCats() {
  const nav = document.getElementById('cats');
  if (!nav) return; // safety check
  nav.innerHTML = '';
  
  Object.keys(FULL_MENU).forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat[0].toUpperCase() + cat.slice(1);
    btn.className = cat === currentCat ? 'active' : '';
    btn.onclick = () => { currentCat = cat; renderMenu(); renderCats(); };
    nav.appendChild(btn);
  });
}

