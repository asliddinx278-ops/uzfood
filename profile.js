// Zamonaviy, interaktiv va kengaytirilgan profile.js

const user_id = localStorage.getItem('user_id');

// Loader va error
function showLoader(show) {
    document.getElementById('profile-loader').style.display = show ? 'block' : 'none';
}
function showError(msg) {
    document.getElementById('profile-error').innerText = msg;
    setTimeout(()=>{document.getElementById('profile-error').innerText=''},4000);
}

// Profilni yuklash va ko‘rsatish
function loadProfile() {
    showLoader(true);
    fetch(`/api/profile/${user_id}`)
        .then(r => r.json())
        .then(data => {
            if (data.error) return showError(data.error);
            document.getElementById('profile-name').innerText = data.name || '';
            document.getElementById('profile-phone').innerText = data.phone || '';
            document.getElementById('profile-lang').innerText = langName(data.lang || 'uz');
            document.getElementById('lang-select').value = data.lang || 'uz';
            if (data.photo_url) {
                document.getElementById('profile-photo').src = data.photo_url;
            }
        })
        .catch(() => showError("Profil yuklanmadi"))
        .finally(() => showLoader(false));
}

// Profil maydonini tahrirlash (prompt bilan)
function editProfileField(field, label, type='text') {
    let current = document.getElementById('profile-' + field).innerText;
    let value = prompt(`Yangi ${label} kiriting:`, current);
    if (value && value !== current) {
        if(field==="phone" && !/^\+?\d{9,15}$/.test(value)) return showError("Telefon raqam noto'g'ri!");
        updateProfileField(field, value);
    }
}

// Tilni almashtirish
function changeLang(sel) {
    updateProfileField('lang', sel.value);
}

// Backendga yangilangan qiymatni yuborish
function updateProfileField(field, value) {
    showLoader(true);
    fetch(`/api/profile/${user_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value })
    })
    .then(r => r.json())
    .then(() => loadProfile())
    .catch(() => showError("Saqlashda xatolik"))
    .finally(() => showLoader(false));
}

// Profil rasmini yuklash
function uploadProfilePic(input) {
    if (!input.files.length) return;
    let file = input.files[0];
    let formData = new FormData();
    formData.append("pic", file);
    showLoader(true);
    fetch(`/api/profile-pic/${user_id}`, {
        method: 'POST',
        body: formData
    })
    .then(r=>r.json())
    .then(() => loadProfile())
    .catch(() => showError("Rasm yuklanmadi"))
    .finally(() => showLoader(false));
}

// Sevimlilar
function loadWishlist() {
    showLoader(true);
    fetch(`/api/favorites?user_id=${user_id}`)
        .then(r => r.json())
        .then(data => {
            let favs = data.favorites || [];
            fetch('/api/products')
                .then(r => r.json())
                .then(pd => {
                    let html = '';
                    pd.products.filter(p => favs.includes(p.id)).forEach(p => {
                        html += `<div class="fav-card">
                            <img src="${p.img}" width="50">
                            <b>${p.name}</b> <span>${p.price} so'm</span>
                            <button onclick="toggleFavorite(${p.id}, true)">❤️</button>
                        </div>`;
                    });
                    document.getElementById('wishlist').innerHTML = html || 'Sevimlilar yo‘q';
                });
        })
        .catch(()=>showError("Sevimlilar yuklanmadi"))
        .finally(()=>showLoader(false));
}

// Sevimlilardan olib tashlash yoki qo‘shish
function toggleFavorite(product_id, is_fav) {
    fetch('/api/favorites', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            user_id,
            product_id,
            action: is_fav ? 'remove' : 'add'
        })
    }).then(() => loadWishlist());
}

// Buyurtmalarim
function loadMyOrders() {
    showLoader(true);
    fetch(`/api/orders/user/${user_id}`)
        .then(r => r.json())
        .then(data => {
            let orders = data.orders || [];
            let html = '';
            orders.forEach(o => {
                html += `<div class="order-card" onclick="showOrderDetail('${o.id}')">
                    <b>Buyurtma #${o.id.slice(-6)}</b> (${o.status})<br>
                    Sana: ${o.created.substr(0, 19).replace('T',' ')}<br>
                    Narxi: <b>${o.total} so'm</b>
                </div>`;
            });
            document.getElementById('my-orders').innerHTML = orders.length ? html : 'Buyurtmalar topilmadi';
        })
        .catch(()=>showError("Buyurtmalar yuklanmadi"))
        .finally(()=>showLoader(false));
}

// Buyurtma tafsilotlari (modal yoki alert)
function showOrderDetail(order_id) {
    fetch(`/api/orders?user_id=${user_id}`)
        .then(r => r.json())
        .then(data => {
            let order = (data.orders||[]).find(o=>o.id===order_id);
            if (order) {
                let txt = `Buyurtma #${order.id.slice(-6)}\nVaqti: ${order.created.substr(0,19).replace('T',' ')}\nNarxi: ${order.total} so'm\nHolati: ${order.status}\n\nTarkibi:\n`;
                JSON.parse(order.items).forEach(i=>{txt+=`- ${i.name} (${i.qty} x ${i.price})\n`});
                alert(txt);
            }
        });
}

// Til nomi uchun
function langName(code) {
    return code === 'ru' ? "Русский" : (code === 'en' ? "English" : "O‘zbekcha");
}

// Responsive: mobil uchun elementlar o‘lchamini CSS bilan moslashtiring!

// DOM yuklanganda ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    loadMyOrders();
    loadWishlist();
});
