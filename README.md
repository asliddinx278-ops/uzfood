# UZFOOD – O'zbek Taomlari Telegram Bot + WebApp

**Premium Telegram-bot va WebApp integratsiyasi** — buyurtma, admin panel, sevimlilar, qidirish va multi-language support.

## 🎯 Features

✅ **Telegram WebApp** — O'zbekcha interfeys bilan tez buyurtma  
✅ **Admin Panel** — Real-time zakazlar, mahsulotlar, promo-kodlar  
✅ **Sevimlilar & Qidiruv** — Offline cache va localStorage  
✅ **Multi-Admin** — Unlimited admin users  
✅ **Orders & Locations** — Geolocation support  
✅ **Dark/Light Theme** — Modern responsive design  
✅ **Offline Support** — Service Worker caching  
✅ **Production Ready** — GitHub Pages + VPS integration  

---

## 📋 Project Structure

```
D:\python\uzfood\
├── backend/
│   ├── osh1.py              # Main Telegram bot + REST API
│   ├── requirements.txt      # Python dependencies
│   └── uzfood.db           # SQLite database
├── frontend/
│   ├── index.html          # Main WebApp
│   ├── admin.html          # Admin panel
│   ├── profil.html         # Profile page
│   ├── app.js              # Main entry point
│   ├── main.js             # Menu & products
│   ├── cart.js             # Cart logic
│   ├── profile.js          # Profile management
│   ├── orders.js           # Orders history
│   ├── search.js           # Search functionality
│   ├── wishlist.js         # Favorites
│   ├── style.css           # Responsive design
│   ├── manifest.json       # PWA manifest
│   └── sw.js               # Service Worker
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── README.md               # This file
└── LICENSE                 # MIT License
```

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+** (with pip)
- **Git** (for version control)
- **Telegram Bot Token** (from [@BotFather](https://t.me/botfather))
- **Admin Telegram ID** (your personal Telegram ID)

### 1. Clone Repository

```bash
git clone https://github.com/YOUR-USERNAME/uzfood.git
cd uzfood
```

### 2. Setup Backend

```bash
# Create virtual environment
python -m venv venv

# Activate venv (Windows)
venv\Scripts\activate
# or (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Environment

Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

Edit `.env` and fill in:
```env
TOKEN=YOUR_BOT_TOKEN_FROM_BOTFATHER
ADMIN_IDS=YOUR_TELEGRAM_ID
ADMIN_PW=YOUR_SECRET_PASSWORD
WEB_APP=https://YOUR-GITHUB-USERNAME.github.io/uzfood/
```

### 4. Run Backend Locally

```bash
python osh1.py
```

✅ **Backend runs on:** `http://127.0.0.1:8080`  
✅ **API endpoints ready** for admin panel and frontend

### 5. Deploy WebApp to GitHub Pages

1. Fork this repository
2. Enable GitHub Pages in Settings → Pages → Source: main
3. Frontend will be at: `https://your-github-username.github.io/uzfood/`

### 6. Deploy Backend to VPS/Render

Option A: **Render** (free tier)
```bash
git push heroku main
```

Option B: **Your VPS** (Ubuntu/Debian)
```bash
ssh user@your-vps.com
git clone https://github.com/YOUR-USERNAME/uzfood.git
cd uzfood
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create systemd service for auto-restart
sudo nano /etc/systemd/system/uzfood.service
```

Service file content:
```ini
[Unit]
Description=UZFOOD Telegram Bot
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/uzfood
Environment="PYTHONUNBUFFERED=1"
EnvironmentFile=/home/ubuntu/uzfood/.env
ExecStart=/home/ubuntu/uzfood/venv/bin/python osh1.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Then start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable uzfood
sudo systemctl start uzfood
```

---

## 📱 Usage

### For Users
1. **Start Telegram Bot:** Open bot and press `/start`
2. **Browse Menu:** View all dishes by category
3. **Add to Cart:** Tap dish → "Tanlash" button
4. **Checkout:** Cart tab → "Buyurtma berish"
5. **Share Location:** Allow location permission for delivery
6. **Track Order:** View status in Profile → My Orders

### For Admins
1. **Access Panel:** Bot → Admin Button → Click "Admin panel" link
2. **View Orders:** Real-time incoming orders with status
3. **Manage Products:** Add/Edit/Delete menu items
4. **Promo Codes:** Create discount codes
5. **Send Broadcast:** Message all users at once
6. **View Reviews:** Moderate customer feedback
7. **Export Stats:** Download orders as Excel

---

## 🔌 API Endpoints

All endpoints return JSON and support CORS.

### Public Endpoints
- `GET /api/products` — Get all products (with optional `?cat=osh&visible=1`)
- `GET /api/profile/<user_id>` — Get user profile
- `GET /api/orders/user/<user_id>` — Get user's orders
- `GET /api/favorites?user_id=<id>` — Get user's favorites

### Admin Endpoints (require `uid` or `secret`)
- `POST /api/products` — Create product
- `PUT /api/products/<id>` — Update product
- `DELETE /api/products/<id>` — Delete product
- `GET /api/orders` — Get all orders (filterable by status, phone)
- `PATCH /api/orders/<id>` — Update order status

### Example Admin Request
```bash
curl -X POST http://127.0.0.1:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "megaadmin",
    "cat": "osh",
    "name": "G'\''ijduvoncha osh",
    "price": 25000,
    "img": "https://example.com/osh.jpg",
    "rating": 4.8,
    "visible": 1
  }'
```

---

## 📊 Database Schema

SQLite database `uzfood.db` contains:

- **users** — Telegram user profiles
- **orders** — Customer orders with status tracking
- **products** — Menu items (cat, name, price, img, rating)
- **favorites** — User's saved dishes
- **reviews** — Customer feedback (moderated)
- **promos** — Discount codes
- **stats** — Daily revenue tracking

---

## 🔐 Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` file to repository
- Use strong `ADMIN_PW` (change default `'megaadmin'`)
- Use environment variables for production
- Validate all user inputs on backend
- Use HTTPS in production (Render/VPS provides SSL)

---

## 🛠️ Development

### Local Testing
```bash
# Terminal 1: Backend
python osh1.py

# Terminal 2: Frontend (any HTTP server)
python -m http.server 8000 --directory frontend

# Open browser
http://127.0.0.1:8000
```

### Database Reset
```bash
rm uzfood.db
python osh1.py  # Auto-creates new DB
```

### Enable Debug Logging
```bash
# Add to osh1.py
logging.basicConfig(level=logging.DEBUG)
```

---

## 📦 Dependencies

**Backend (Python):**
- `bottle` — Lightweight REST API framework
- `pytelegrambotapi` — Telegram bot library
- `requests` — HTTP client
- `sqlite3` — Built-in database (no install needed)

**Frontend (Vanilla JS):**
- Material Symbols (Google Fonts) — Icons
- Telegram Web App JS — Telegram integration
- No frameworks! Pure ES6 modules

---

## 📄 License

MIT License — Free to use and modify

---

## 👤 Author

Created by **@asliddinx278-ops**

For issues and feature requests: [GitHub Issues](https://github.com/asliddinx278-ops/uzfood/issues)

---

## 💡 Tips

- Use **theme button** (top-right) to toggle dark/light mode
- Products cache locally — works offline
- Admin panel accessible only with valid UID or ADMIN_PW
- Service Worker enables offline mode

---

**🎉 Ready to go! Deploy and start taking orders! 🎉**
