    # O‘ZFOOD 2025 – Backend (To‘liq va zamonaviy)
import os, json, time, datetime, sqlite3, threading, random, csv, io, logging
import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton, ReplyKeyboardMarkup, KeyboardButton, WebAppInfo
from bottle import Bottle, request, response, run

TOKEN     = os.getenv("TOKEN")   or "7589919425:AAG9bMalFe7ZZi434bUrdKLy_gTEvtJFCxI"
ADMIN_IDS = list(map(int, (os.getenv("ADMIN_IDS") or "7961099561").split(",")))
ADMIN_PW  = os.getenv("ADMIN_PW") or "megaadmin"
WEB_APP   = "https://asliddinx278-ops.github.io/uzfood/"

bot = telebot.TeleBot(TOKEN, threaded=False)
conn = sqlite3.connect("uzfood.db", check_same_thread=False)
cur  = conn.cursor()

# Basic logging
logging.basicConfig(level=logging.INFO)
# make sqlite rows easy to inspect if needed

# ---------- DB ----------
tables = [
    """CREATE TABLE IF NOT EXISTS users(
       id INTEGER PRIMARY KEY,
       phone TEXT,
       name TEXT,
       lang TEXT DEFAULT 'uz',
       blocked INTEGER DEFAULT 0)""",
    """CREATE TABLE IF NOT EXISTS orders(
       id TEXT PRIMARY KEY,
       user_id INTEGER,
       phone TEXT,
       items TEXT,
       total INTEGER,
       status TEXT,
       lat REAL,
       lon REAL,
       created TEXT)""",
    """CREATE TABLE IF NOT EXISTS products(
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       cat TEXT,
       name TEXT,
       price INTEGER,
       img TEXT,
       rating REAL,
       visible INTEGER DEFAULT 1)""",
    """CREATE TABLE IF NOT EXISTS promos(
       code TEXT PRIMARY KEY,
       discount INTEGER,
       uses INTEGER DEFAULT 0,
       max_uses INTEGER)""",
    """CREATE TABLE IF NOT EXISTS reviews(
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       user_id INTEGER,
       product_id INTEGER,
       stars INTEGER,
       text TEXT,
       visible INTEGER DEFAULT 0)""",
    """CREATE TABLE IF NOT EXISTS stats(
       date TEXT PRIMARY KEY,
       orders INTEGER,
       revenue INTEGER)""",
    # Yangi: favorites
    """CREATE TABLE IF NOT EXISTS favorites(
       user_id INTEGER,
       product_id INTEGER,
       added_at TEXT,
       PRIMARY KEY(user_id, product_id)
    )"""
]
for t in tables: cur.execute(t)
conn.commit()

# ---------- BOT qisqa ----------
@bot.message_handler(commands=['start'])
def start(m):
    uid = m.from_user.id
    name = " ".join(filter(None, [m.from_user.first_name, m.from_user.last_name]))
    cur.execute("INSERT OR IGNORE INTO users(id,name,lang) VALUES(?,?,?)", (uid, name, 'uz'))
    conn.commit()
    send_main_menu(uid)

def send_main_menu(uid):
    markup = InlineKeyboardMarkup(row_width=1)
    markup.add(
        InlineKeyboardButton("🍽 Buyurtma berish", web_app=WebAppInfo(url=WEB_APP)),
        InlineKeyboardButton("ℹ Bot haqida", callback_data="about")
    )
    if uid in ADMIN_IDS:
        markup.add(InlineKeyboardButton("👨‍💼 Admin panel", callback_data="admin"))
    bot.send_photo(
        uid,
        photo="https://i.ibb.co/20mqx4f8/metbex1-8.jpg",
        caption="🍴 <b>O‘zbek milliy taomlari</b>\nTanlang:",
        parse_mode='HTML',
        reply_markup=markup
    )

@bot.callback_query_handler(func=lambda c: c.data == "admin")
def admin_btn(c):
    uid = c.from_user.id
    if uid in ADMIN_IDS:
        url = f"{WEB_APP}admin.html?uid={uid}"
        bot.send_message(uid, f"👨‍💼 <a href='{url}'>Mega-Admin panelga o‘tish</a>", parse_mode='HTML')
    else:
        bot.answer_callback_query(c.id, "❌ Siz admin emassiz.", show_alert=True)

@bot.message_handler(content_types=['web_app_data'])
def web_app_data(m):
    uid = m.from_user.id
    data = json.loads(m.web_app_data.data)
    if data.get('action') == 'order':
        items   = data['items']
        total   = data['total']
        phone   = data.get('phone') or ''
        user    = cur.execute("SELECT name FROM users WHERE id=?", (uid,)).fetchone()
        name    = user[0] if user else ''
        order_id = 'o' + str(uid) + str(int(time.time() * 1000))
        cur.execute("""INSERT INTO orders(id,user_id,phone,items,total,status,lat,lon,created)
                       VALUES(?,?,?,?,?,?,?,?,?)""",
                    (order_id, uid, phone, json.dumps(items), total, 'yangi', None, None, datetime.datetime.utcnow().isoformat()))
        conn.commit()
        bot.send_message(uid, "✅ Buyurtma qabul qilindi!\n📍 Yetkazish manzilini yuboring:", reply_markup=ReplyKeyboardMarkup(resize_keyboard=True).add(KeyboardButton("📍 Joylashuvni yuborish", request_location=True)))
        text = f"""🆕 <b>Yangi buyurtma</b>
👤 {name}
📞 {phone}
📦 {len(items)} ta
💰 {total:,} so‘m"""
        for ad in ADMIN_IDS:
            bot.send_message(ad, text, parse_mode='HTML')

@bot.message_handler(content_types=['location'])
def handle_location(m):
    uid = m.from_user.id
    lat, lon = m.location.latitude, m.location.longitude
    row = cur.execute("SELECT id,items,total,phone FROM orders WHERE user_id=? AND status='yangi' ORDER BY created DESC LIMIT 1", (uid,)).fetchone()
    if not row:
        bot.send_message(uid, "❌ Buyurtma topilmadi.")
        return
    order_id, items_json, total, phone = row
    cur.execute("UPDATE orders SET status='tayyor', lat=?, lon=? WHERE id=?", (lat, lon, order_id))
    conn.commit()
    bot.send_message(uid, "✅ Joylashuv qabul qilindi!\nBuyurtmangiz tez orada yetkaziladi.", reply_markup=ReplyKeyboardMarkup(resize_keyboard=True).add("🍽 Buyurtma berish"))
    text = f"""📍 <b>Joylashuv qabul qilindi</b>
📞 {phone}
📦 {len(json.loads(items_json))} ta
💰 {total:,} so‘m"""
    for ad in ADMIN_IDS:
        bot.send_message(ad, text, parse_mode='HTML')
        bot.send_location(ad, latitude=lat, longitude=lon)

# =========================================================
# BACKEND API (Bottle)
# =========================================================
api = Bottle()

# --- Buyurtmalar (foydalanuvchiga mos) ---
@api.route('/api/orders', method='GET')
def get_orders():
    user_id = request.params.get('user_id')
    status = request.params.status or ''
    phone  = request.params.phone or ''
    q = "SELECT * FROM orders"
    params = []
    if user_id:
        q += " WHERE user_id=?"
        params.append(user_id)
    q += " ORDER BY created DESC"
    rows = cur.execute(q, tuple(params)).fetchall()
    orders = []
    for r in rows:
        if status and r[5] != status: continue
        if phone and phone not in r[2]: continue
        orders.append({
            "id": r[0], "user_id": r[1], "phone": r[2],
            "items": json.loads(r[3]), "total": r[4], "status": r[5],
            "lat": r[6], "lon": r[7], "created": r[8]
        })
    return {"orders": orders}

@api.route('/api/orders/user/<user_id>', method='GET')
def user_orders(user_id):
    rows = cur.execute("SELECT * FROM orders WHERE user_id=? ORDER BY created DESC", (user_id,)).fetchall()
    orders = []
    for r in rows:
        orders.append({
            "id": r[0], "user_id": r[1], "phone": r[2],
            "items": json.loads(r[3]), "total": r[4], "status": r[5],
            "lat": r[6], "lon": r[7], "created": r[8]
        })
    return {"orders": orders}

# --- Sevimlilar (favorites) ---
@api.route('/api/favorites', method='GET')
def get_favorites():
    user_id = request.params.get('user_id')
    if not user_id:
        return {"favorites": []}
    rows = cur.execute("SELECT product_id FROM favorites WHERE user_id=?", (user_id,)).fetchall()
    return {"favorites": [r[0] for r in rows]}

@api.route('/api/favorites', method='POST')
def post_favorites():
    data = request.json
    user_id = data['user_id']
    product_id = data['product_id']
    action = data.get('action', 'add')
    if action == 'add':
        cur.execute("INSERT OR IGNORE INTO favorites(user_id, product_id, added_at) VALUES(?,?,?)",
                    (user_id, product_id, datetime.datetime.utcnow().isoformat()))
    elif action == 'remove':
        cur.execute("DELETE FROM favorites WHERE user_id=? AND product_id=?", (user_id, product_id))
    conn.commit()
    return {"ok": True}

# --- Profil (raqam va til har bir user uchun) ---
@api.route('/api/profile/<user_id>', method='GET')
def get_profile(user_id):
    row = cur.execute("SELECT id, name, phone, lang FROM users WHERE id=?", (user_id,)).fetchone()
    if not row:
        return {"error": "User not found"}
    return {"id": row[0], "name": row[1], "phone": row[2], "lang": row[3]}

@api.route('/api/profile/<user_id>', method='POST')
def update_profile(user_id):
    data = request.json
    name = data.get('name')
    phone = data.get('phone')
    lang = data.get('lang')
    q = "UPDATE users SET "
    params = []
    if name:
        q += "name=?,"
        params.append(name)
    if phone:
        q += "phone=?,"
        params.append(phone)
    if lang:
        q += "lang=?,"
        params.append(lang)
    q = q.rstrip(",") + " WHERE id=?"
    params.append(user_id)
    cur.execute(q, tuple(params))
    conn.commit()
    return {"ok": True}

# --- Mahsulotlar, promokodlar, reviews va boshqalar ---

# Enable CORS for API (useful for WebApp hosted on different origin)
@api.hook('after_request')
def enable_cors():
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, Authorization'

def is_admin_request():
    # admin actions from web-admin will include ?uid=<telegram_id>
    uid = request.params.get('uid')
    data = {}
    if not uid:
        # also allow uid in JSON body for POST/PUT
        try:
            data = request.json or {}
            uid = data.get('uid')
        except Exception:
            uid = None
    # allow admin password via JSON body (used by admin.html)
    try:
        secret = (data.get('secret') if isinstance(data, dict) else None) or request.params.get('secret')
        if secret and secret == ADMIN_PW:
            return True
    except Exception:
        pass
    try:
        return int(uid) in ADMIN_IDS
    except Exception:
        return False


@api.route('/api/products', method=['OPTIONS'])
def options_products():
    return {}

@api.route('/api/products', method=['GET'])
def get_products():
    cat = request.params.get('cat')
    only_visible = request.params.get('visible')
    q = "SELECT id,cat,name,price,img,rating,visible FROM products"
    params = []
    if cat:
        q += " WHERE cat=?"
        params.append(cat)
    q += " ORDER BY id DESC"
    rows = cur.execute(q, tuple(params)).fetchall()
    products = []
    for r in rows:
        if only_visible and str(r[6]) != only_visible:
            continue
        products.append({
            "id": r[0], "cat": r[1], "name": r[2], "price": r[3],
            "img": r[4], "rating": r[5], "visible": r[6]
        })
    return {"products": products}

@api.route('/api/products', method=['POST'])
def post_product():
    if not is_admin_request():
        response.status = 403
        return {"error": "forbidden"}
    data = request.json or {}
    try:
        cur.execute("INSERT INTO products(cat,name,price,img,rating,visible) VALUES(?,?,?,?,?,?)",
                    (data.get('cat', 'default'), data.get('name', 'Unnamed'), int(data.get('price', 0)), data.get('img', ''), float(data.get('rating', 0)), int(data.get('visible', 1))))
        conn.commit()
        pid = cur.execute('SELECT last_insert_rowid()').fetchone()[0]
        logging.info(f"[admin] product created id={pid} name={data.get('name')}")
        return {"ok": True, "id": pid}
    except Exception as e:
        logging.exception('post_product error')
        response.status = 400
        return {"ok": False, "error": str(e)}

@api.route('/api/products/<id:int>', method=['PUT'])
def put_product(id):
    if not is_admin_request():
        response.status = 403
        return {"error": "forbidden"}
    data = request.json or {}
    fields = []
    params = []
    for k in ('cat', 'name', 'price', 'img', 'rating', 'visible'):
        if k in data:
            fields.append(f"{k}=?")
            params.append(data[k])
    if not fields:
        return {"ok": False, "error": "no fields"}
    params.append(id)
    try:
        cur.execute(f"UPDATE products SET {','.join(fields)} WHERE id=?", tuple(params))
        conn.commit()
        logging.info(f"[admin] product updated id={id}")
        return {"ok": True}
    except Exception as e:
        logging.exception('put_product error')
        response.status = 400
        return {"ok": False, "error": str(e)}

@api.route('/api/products/<id:int>', method=['DELETE'])
def delete_product(id):
    if not is_admin_request():
        response.status = 403
        return {"error": "forbidden"}
    try:
        cur.execute("DELETE FROM products WHERE id=?", (id,))
        conn.commit()
        logging.info(f"[admin] product deleted id={id}")
        return {"ok": True}
    except Exception as e:
        logging.exception('delete_product error')
        response.status = 400
        return {"ok": False, "error": str(e)}

# Seed sample products if table is empty (helps web-app show menu)
try:
    count = cur.execute("SELECT COUNT(1) FROM products").fetchone()[0]
except Exception:
    count = 0
if count == 0:
    sample = [
        ("Lavash", "Lavash doner", 30000, "https://i.ibb.co/20mqx4f8/metbex1-8.jpg", 4.5, 1),
        ("Osh", "Plov an'anaviy", 35000, "https://i.ibb.co/LSome.jpg", 4.7, 1),
        ("Salat", "Achchiq salat", 15000, "https://i.ibb.co/salad.jpg", 4.2, 1),
    ]
    try:
        for cat, name, price, img, rating, visible in sample:
            cur.execute("INSERT INTO products(cat,name,price,img,rating,visible) VALUES(?,?,?,?,?,?)",
                        (cat, name, price, img, rating, visible))
        conn.commit()
        logging.info('[setup] seeded sample products')
    except Exception:
        logging.exception('seeding products failed')

# ---------- RUN ----------
def run_api():
    run(api, host='0.0.0.0', port=8080, quiet=True, threaded=True)

if __name__ == '__main__':
    threading.Thread(target=run_api, daemon=True).start()
    bot.infinity_polling(skip_pending=True)