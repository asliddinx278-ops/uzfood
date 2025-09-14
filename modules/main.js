/* =========================================================
   MAIN MODULE – PREMIUM (rasm bilan)
   ========================================================= */

// 1. Rasmlar – **imgur** CDN (o‘zingiznikiga almashtiring)
const IMAGES = {
  osh:      'https://i.ibb.co/tTY9cFfS/image1.jpg'
  shorva:   'https://i.imgur.com/N4R5XYZ.jpg',
  kabob:    'https://i.imgur.com/9aB1CDE.jpg',
  salat:    'https://i.imgur.com/2fG3HIJ.jpg',
  ichimlik: 'https://i.imgur.com/8cK9w.jpg',
  desert:   'https://i.imgur.com/7dL4MNO.jpg'
};

export const FULL_MENU = {
  osh: [
    {id:1, name:"G‘ijduvoncha osh",   price:25000, img: IMAGES.osh},
    {id:2, name:"Farg‘ona osh",       price:27000, img: IMAGES.osh},
    {id:3, name:"Toshkentcha osh",    price:26000, img: IMAGES.osh},
    {id:4, name:"Qovurma osh",        price:28000, img: IMAGES.osh},
    {id:5, name:"Toy osh",            price:35000, img: IMAGES.osh}
  ],
  shorva: [
    {id:6, name:"Mastava",        price:12000, img: IMAGES.shorva},
    {id:7, name:"Sho‘rva",        price:13000, img: IMAGES.shorva},
    {id:8, name:"Moshxo‘rda",     price:14000, img: IMAGES.shorva}
  ],
  kabob: [
    {id:9,  name:"Jigar kabob",  price:18000, img: IMAGES.kabob},
    {id:10, name:"Go‘sht kabob", price:20000, img: IMAGES.kabob}
  ],
  salat: [
    {id:11, name:"Chimchi", price:6000, img: IMAGES.salat},
    {id:12, name:"Smak",    price:7000, img: IMAGES.salat}
  ],
  ichimlik: [
    {id:13, name:"Coca-Cola 0.5", price:6000, img: IMAGES.ichimlik}
  ],
  desert: [
    {id:14, name:"Shakarap", price:4000, img: IMAGES.desert}
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
        <div class="porc">
          <button data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" data-q="1">1</button>
          <button data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" data-q="2">2</button>
          <button data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" data-q="3">3</button>
        </div>
      </div>`;
    container.appendChild(card);
  });

  /* add-to-cart */
  document.querySelectorAll('.porc button').forEach(b =>
    b.addEventListener('click', e => {
      const { id, name, price, q } = e.target.dataset;
      import('/uzfood/modules/cart.js').then(m => m.addToCart(id, name, price, +q));
    })
  );
}
