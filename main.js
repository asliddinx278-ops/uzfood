/* =========================================================
   MAIN MODULE – 1 000 000 $
   ========================================================= */
// rasmilar – imgur
export const FULL_MENU = {
  osh: [
    { id: 1, name: "G‘ijduvoncha osh", price: 25000, img: "https://i.ibb.co/v853GdT/720-460-95-1547113144.jpg" },
    { id: 2, name: "Farg‘ona osh",     price: 27000, img: "https://i.ibb.co/q3HzJH37/images.jpg" },
    { id: 3, name: "Toshkentcha osh",  price: 26000, img: "https://i.ibb.co/qzNg3qk/images-1.jpg" },
    { id: 4, name: "Qovurma osh",      price: 28000, img: "https://i.ibb.co/qF1Rc9pN/images-2.jpg" },
    { id: 5, name: "Toy osh",          price: 35000, img: "https://i.ibb.co/tTY9cFfS/image1.jpg" }
  ],
  shorva: [
    { id: 6,  name: "Mastava",         price: 12000, img: "https://i.ibb.co/PZtGJQDf/183ce0-3a3bcf40ab8d4a1abeb6d62d30576bd1-mv2.jpg" },
    { id: 7,  name: "Sho‘rva",         price: 13000, img: "https://i.ibb.co/JRxmfbfM/shurpa.jpg" },
    { id: 8,  name: "Moshxo‘rda",      price: 14000, img: "https://i.ibb.co/TB0pgZ1Z/72e038485cae55fa.jpg" },
    { id: 9,  name: "Lag‘mon sho‘rva", price: 16000, img: "https://i.ibb.co/4Z7pqYv2/hq720.jpg" },
    { id: 10, name: "Ilik sho‘rva",    price: 20000, img: "https://i.ibb.co/PsbRCGgS/1551335663-15489147748.jpg" }
  ],
  kabob: [
    { id: 11, name: "Jigar kabob",  price: 18000, img: "https://i.ibb.co/PGv4rR6t/Beef-Shish-Kabob-6.jpg" },
    { id: 12, name: "Go‘sht kabob", price: 20000, img: "https://i.ibb.co/whXkSvb3/1200px-Shashlik.jpg" }
  ],
  salat: [
    { id: 13, name: "Chimchi", price: 6000, img: "https://i.ibb.co/NgsxmcmP/instagram1080-1024x1024.png" },
    { id: 14, name: "Smak",    price: 7000, img: "https://i.ibb.co/3yRZS0vt/u-a2f97733b2b393c5c2fb19259e84f229.jpg" }
  ],
  ichimlik: [
    { id: 15, name: "Coca-Cola 0.5", price: 6000, img: "https://i.ibb.co/svhHFFCr/images-3.jpg" },
    { id: 16, name: "Pepsi 0.5",     price: 6000, img: "https://i.ibb.co/sd7gQzRC/cqs8il7frr8a72r836l0.jpg" },
    { id: 17, name: "Fanta 0.5",     price: 6000, img: "https://i.ibb.co/RkKzybFv/02dae68b7a16df10e2a356fefa05d33e.webp" }
  ],
  desert: [
    { id: 18, name: "Shakarap", price: 4000,  img: "https://i.ibb.co/9myWgVZb/bfdejixlfomrkzsdmxsq-ogd2pemlkxf.webp" },
    { id: 19, name: "Pahlava",  price: 8000,  img: "https://i.ibb.co/FfvZP2Y/A537-LTKFGSVK7-DWQPCCF5-LAE.jpg" },
    { id: 20, name: "Medovik",  price: 12000, img: "https://i.ibb.co/C5n5TvFg/Honey-cake-Medovik.jpg" }
  ]
};

let currentCat = 'osh';

/* ---------- TOP-5 ---------- */
export async function renderTop5(){
  try {
    const res = await fetch('/.netlify/functions/top5');
    const top = await res.json();
    const box = document.getElementById('top5');
    box.innerHTML = top.map((f,i)=>`
      <div class="top5-item">
        ${i+1}. ${f.name} (${f.count})
      </div>`).join('');
  } catch (e) {
    document.getElementById('top5').innerHTML = '';
  }
}

/* ---------- KATEGORIYA ---------- */
export function renderCats(){
  const nav = document.getElementById('cats');
  nav.innerHTML = '';
  Object.keys(FULL_MENU).forEach(cat=>{
    const btn = document.createElement('button');
    btn.textContent = cat[0].toUpperCase() + cat.slice(1);
    btn.className = cat === currentCat ? 'active' : '';
    btn.onclick = () => { currentCat = cat; renderMenu(); };
    nav.appendChild(btn);
  });
}

/* ---------- MENYU (horizontal card + rasm) ---------- */
export function renderMenu(){
  const container = document.getElementById('menu');
  container.innerHTML = '';
  FULL_MENU[currentCat].forEach(item=>{
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="menu-info">
        <h3>${item.name}</h3>
        <p class="price">${item.price.toLocaleString()} so‘m</p>
        <button class="add-btn"
                onclick="import('./cart.js').then(m=>m.addToCart(${item.id},'${item.name}',${item.price},1,'${item.img}'))">
          Tanlash
        </button>
      </div>`;
    container.appendChild(card);
  });
}

