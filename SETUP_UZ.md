# UZFOOD Setup Instructions (Uzbek)

## ✅ Joriy Holat

Barcha fayllar `D:\python` papkasida organize qilingan:

```
D:\python/
├── Backend (Python):
│   ├── osh1.py          ← Main Telegram bot + API
│   ├── requirements.txt  ← Dependencies
│   └── uzfood.db        ← SQLite database
│
├── Frontend (WebApp):
│   ├── index.html       ← Main page
│   ├── admin.html       ← Admin panel
│   ├── profil.html      ← Profile
│   ├── app.js, main.js, cart.js, etc.  ← JavaScript modules
│   ├── style.css        ← Responsive design
│   ├── manifest.json    ← PWA config
│   └── sw.js            ← Service Worker
│
├── Config:
│   ├── .env.example     ← Environment template (copy to .env)
│   ├── .gitignore       ← Git ignore rules
│   ├── README.md        ← Full documentation
│   └── LICENSE          ← MIT License
└── venv/                ← Python virtual environment
```

---

## 🚀 Qadamlar (Setup Instructions)

### 1️⃣ Backend o'rnatish

```bash
# Terminal/PowerShell da:
cd D:\python

# Virtual environment faollashtirish (Windows)
venv\Scripts\activate

# Dependencies o'rnatish
pip install -r requirements.txt

# .env faylini tayyorlash
# .env.example ni .env ga ko'chiring va to'ldiring:
# - TOKEN: Telegram Bot tokenini @BotFather dan oling
# - ADMIN_IDS: O'zingizning Telegram ID raqamingiz
# - ADMIN_PW: Kuchli parol qo'ying (default: megaadmin)
```

### 2️⃣ Backend ishga tushurish (Local Test)

```bash
# Terminal da (venv faollashtirilgan):
python osh1.py
```

✅ Backend `http://127.0.0.1:8080` da ishlamoqda!

### 3️⃣ WebApp frontend tekshirish

Brauzerda oching:
- **WebApp:** `file://D:/python/index.html`
- **Admin Panel:** `file://D:/python/admin.html?uid=YOUR_TELEGRAM_ID`

Yoki HTTP server orqali:
```bash
# Terminal 2 (yangi):
python -m http.server 8000 --directory D:\python
```

Keyin brauzerda: `http://127.0.0.1:8000/index.html`

### 4️⃣ GitHub Repository yaratish

1. GitHub da [yangi repo](https://github.com/new) yaratish
2. Repo nomi: `uzfood` (yoki boshqa)
3. Description: "Telegram Food Ordering Bot + WebApp"
4. Public qilib yaratish

### 5️⃣ Local Git setup (VS Code Terminal yordamida)

VS Code ichidan terminal oching (\`Ctrl+`\`):

```bash
# Repository URL sizning GitHub repozitoriyasining linkini ko'ring va o'rnating
cd D:\python

# Git config
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Repo initialize (agar hali qilinmagan bo'lsa)
git init

# Barcha fayllarni stage qilish
git add .

# Birinchi commit
git commit -m "Initial commit: UZFOOD Telegram bot + WebApp"

# GitHub remote qo'shish (YOUR_REPO_URL o'rniga sizning repo linkini qo'ying)
git remote add origin https://github.com/YOUR_USERNAME/uzfood.git

# Main branch yaratish va push qilish
git branch -M main
git push -u origin main
```

### 6️⃣ GitHub Pages Deploy (Frontend)

GitHub Settings:
1. Settings → Pages
2. Source: `Deploy from a branch`
3. Branch: `main`, folder: `/ (root)`
4. Save

✅ WebApp ishga tushadi: `https://YOUR_USERNAME.github.io/uzfood/`

### 7️⃣ Backend Deploy (VPS/Render)

#### Option A: Render (Oson, bepul tier)
1. [Render.com](https://render.com) ga kirish
2. "New Web Service" yaratish
3. GitHub repo connect qilish
4. Environment variables qo'shish:
   - `TOKEN=...`
   - `ADMIN_IDS=...`
   - `ADMIN_PW=...`
5. Deploy

#### Option B: Your VPS (Ubuntu/Debian)
```bash
# VPS da:
ssh user@your-server.com

# Repo clone qilish
git clone https://github.com/YOUR_USERNAME/uzfood.git
cd uzfood

# Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Dependencies
pip install -r requirements.txt

# .env faylini yaratish
nano .env
# TOKEN, ADMIN_IDS, ADMIN_PW to'ldiring

# Test
python osh1.py

# Production o'rnatish (systemd service)
# Qo'shimcha qadamlar README.md da
```

---

## 📝 Faylli fayllarni O'zgartirish

**Backend **`osh1.py`:**
- Bot token va admin ID o'zgartirish `.env` da
- Mahsulotlar, promo, reviews qo'shish admin paneldagi CRUD

**Frontend (HTML/JS):**
- `index.html` — Asosiy layout
- `admin.html` — Admin panel UI
- `app.js` — Entry point (theme, nav)
- `main.js` — Menu va mahsulotlar
- `cart.js` — Savat va checkout
- `style.css` — Styling

---

## 🧪 Testing API

```bash
# PowerShell da:
Invoke-RestMethod -Uri http://127.0.0.1:8080/api/products | ConvertTo-Json

# Product qo'shish (admin)
Invoke-RestMethod -Uri http://127.0.0.1:8080/api/products `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body @{secret="megaadmin"; cat="osh"; name="Test Osh"; price=25000; img="https://..."; rating=4.5; visible=1} | ConvertTo-Json
```

---

## 🔑 Muhim Eslatmalar

1. **Token xavfsizlik:** `.env` faylni GitHub ga push qilmang (.gitignore protektiradi)
2. **Admin paroli:** Kuchli parol o'rnating va o'zingiz xotirasida saqlang
3. **CORS:** Backend barcha originlardan requests qabul qiladi (development uchun OK)
4. **Database:** Production da `uzfood.db` faylni backup qiling
5. **Logging:** Backend INFO level da loglarni chop etadi

---

## 📚 Ko'shimcha Manbalari

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Bottle Framework](https://bottlepy.org/)
- [Service Worker MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [GitHub Pages](https://pages.github.com/)

---

## ✨ Tayyor!

**Endi siz:**
- ✅ Backend API ishlamoqda
- ✅ Frontend WebApp brauzerda ko'rinadi
- ✅ Admin panel tahrirlash imkoni
- ✅ GitHub repo yaratilgan
- ✅ Barcha kod organize va dokumentlangan

**Keyingi qadam:** Bot-ni @BotFather dan olib, production ga deploy qilish! 🚀
