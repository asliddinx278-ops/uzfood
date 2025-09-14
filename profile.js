/* =========================================================
   PROFILE MODULE – 1 000 000 $
   ========================================================= */
const tg = window.Telegram?.WebApp || {};

export function renderProfile(){
  const u = tg.initDataUnsafe?.user;
  const card = document.querySelector('.profile-card');

  const ava = document.getElementById('avatar');
  if(u?.photo_url) ava.src = u.photo_url;
  else ava.src = 'https://i.pravatar.cc/120';

  const nameEl = document.getElementById('fullName');
  nameEl.textContent = [u?.first_name, u?.last_name].filter(Boolean).join(' ') || 'Foydalanuvchi';

  const phoneEl = document.getElementById('phone');
  if(u?.phone_number) {
    phoneEl.textContent = formatPhone(u.phone_number);
  } else if(u?.username) {
    phoneEl.textContent = `@${u.username}`;
  } else {
    phoneEl.textContent = '+998 ** *** ** **';
  }

  const extra = document.getElementById('profileExtra');
  if(!extra) {
    const block = document.createElement('div');
    block.id = 'profileExtra';
    block.className = 'profile-extra';
    card.appendChild(block);
  }
  document.getElementById('profileExtra').innerHTML = `
    <div class="info-row"><span>ID:</span><span>${u?.id || 'noma’lum'}</span></div>
    <div class="info-row"><span>Til:</span><span>${u?.language_code || 'uz'}</span></div>
    <div class="info-row"><span>Premium:</span><span>${u?.is_premium ? '✅' : '❌'}</span></div>
  `;
}

function formatPhone(raw) {
  const digits = raw.replace(/\D/g, '');
  if(digits.length === 12 && digits.startsWith('998')) {
    return `+998 ${digits.slice(3,5)} ${digits.slice(5,8)} ${digits.slice(8)}`;
  }
  return raw;
}
