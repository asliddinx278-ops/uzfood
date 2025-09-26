/* =========================================================
   PROFILE – 2025 (telefon raqam saqlanadi + ko‘rsatiladi)
   ========================================================= */
const tg = window.Telegram?.WebApp || {};

export function renderProfile() {
  const u = tg.initDataUnsafe?.user;
  const ava = document.getElementById('avatar');
  if (u?.photo_url) ava.src = u.photo_url;

  document.getElementById('fullName').textContent =
    [u?.first_name, u?.last_name].filter(Boolean).join(' ') || 'Foydalanuvchi';

  // ✅ Telefon – doim localStorage dan
  const savedPhone = localStorage.getItem('phone');
  document.getElementById('phone').textContent = savedPhone
    ? formatPhone(savedPhone)
    : '+998 ** *** ** **';

  document.getElementById('profileExtra').innerHTML = `
    <div class="info-row"><span>ID:</span><span>${u?.id || 'noma’lum'}</span></div>
    <div class="info-row"><span>Til:</span><span>${window.lang.toUpperCase()}</span></div>
    <div class="info-row"><span>Ballar:</span><span>${localStorage.getItem('points') || 0}</span></div>
  `;
}

function formatPhone(raw) {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('998')) {
    return `+998 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  return raw;
}

export function phoneHandler() {
  const phone = prompt("Telefon raqamingizni kiriting (masalan: +998901234567):", "+998");
  if (phone && phone.length >= 12) {
    localStorage.setItem('phone', phone);
    renderProfile(); // ✅ yangilab ko‘rsatadi
    tg.showAlert('✅ Raqam saqlandi!');
  } else {
    tg.showAlert('❌ Raqam noto‘g‘ri!');
  }
}

/* ---------- Sahifalar ---------- */
window.openWishlist = () => { window.showPage('wish'); };
window.openOrders   = () => { window.showPage('orders'); };
window.openLang     = () => {
  const next = { uz: 'ru', ru: 'en', en: 'uz' };
  window.lang = next[window.lang];
  localStorage.setItem('lang', window.lang);
  location.reload();
};
window.openSupport  = () => { tg.openTelegramLink('https://t.me/asliddinx278'); };
