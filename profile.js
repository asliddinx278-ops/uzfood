// Profil, sevimlilar va buyurtmalarim uchun yangi kod (fetch API ishlatadi)

const user_id = localStorage.getItem('user_id');

// Profilni yuklash
function loadProfile() {
    fetch(`/api/profile/${user_id}`)
        .then(r => r.json())
        .then(data => {
            if (data.error) return;
            document.getElementById('profile-name').innerText = data.name || '';
            document.getElementById('profile-phone').innerText = data.phone || '';
            document.getElementById('profile-lang').innerText = data.lang || 'uz';
        });
}

// Buyurtmalarimni yuklash
function loadMyOrders() {
    fetch(`/api/orders/user/${user_id}`)
        .then(r => r.json())
        .then(data => {
            let orders = data.orders || [];
            let html = '';
            orders.forEach(o => {
                html += `<div class="order-card">
                    <b>Buyurtma #${o.id.slice(-6)}</b> &nbsp; (${o.status})<br>
                    Sana: ${o.created.substr(0, 19).replace('T',' ')}<br>
                    Narxi: <b>${o.total} so'm</b>
                </div>`;
            });
            document.getElementById('my-orders').innerHTML = orders.length ? html : 'Buyurtmalar topilmadi';
        });
}

// Sevimlilarni yuklash
function loadWishlist() {
    fetch(`/api/favorites?user_id=${user_id}`)
        .then(r => r.json())
        .then(data => {
            let favs = data.favorites || [];
            // Mahsulotlarni olish uchun yana /api/products ga so‘rov yuboring
            fetch('/api/products')
                .then(r => r.json())
                .then(pd => {
                    let html = '';
                    pd.products.filter(p => favs.includes(p.id)).forEach(p => {
                        html += `<div class="fav-card">
                            <img src="${p.img}" width="60">
                            <b>${p.name}</b> &nbsp; <span>${p.price} so'm</span>
                        </div>`;
                    });
                    document.getElementById('wishlist').innerHTML = html || 'Sevimlilar yo‘q';
                });
        });
}

document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    loadMyOrders();
    loadWishlist();
});
