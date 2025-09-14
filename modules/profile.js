export function renderProfile(){
  const tg = window.Telegram?.WebApp || {};
  if(tg.initDataUnsafe?.user){
    const u = tg.initDataUnsafe.user;
    document.getElementById('fullName').textContent = `${u.first_name||''} ${u.last_name||''}`;
    document.getElementById('phone').textContent = u.username ? `@${u.username}` : '+998 ** *** ** **';
    if(u.photo_url) document.getElementById('avatar').src = u.photo_url;
  }
}
