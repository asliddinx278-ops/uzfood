import telebot, sqlite3, json, os, time, threading
from telebot.types import (
    InlineKeyboardMarkup, InlineKeyboardButton,
    ReplyKeyboardMarkup, KeyboardButton,
    WebAppInfo
)

TOKEN   = os.getenv("TOKEN")   or "7589919425:AAG9bMalFe7ZZi434bUrdKLy_gTEvtJFCxI"
ADMIN_IDS = list(map(int, (os.getenv("ADMIN_IDS") or "7961099561").split(",")))  # 99890xxxx 99890yyyy ...
WEB_APP  = "https://asliddinx278-ops.github.io/uzfood/"
ADMIN_PW = os.getenv("ADMIN_PW") or "1234"

bot = telebot.TeleBot(TOKEN, threaded=False)
conn = sqlite3.connect("uzfood.db", check_same_thread=False)
cur  = conn.cursor()
cur.execute("""CREATE TABLE IF NOT EXISTS users(
               id INTEGER PRIMARY KEY,
               phone TEXT,
               name TEXT)""")
cur.execute("""CREATE TABLE IF NOT EXISTS orders(
               id TEXT PRIMARY KEY,
               user_id INTEGER,
               phone TEXT,
               items TEXT,
               total INTEGER,
               status TEXT,
               lat REAL,
               lon REAL,
               created TEXT)""")
cur.execute("""CREATE TABLE IF NOT EXISTS admins(
               id INTEGER PRIMARY KEY,
               name TEXT)""")
conn.commit()

# ---------- START ----------
@bot.message_handler(commands=['start'])
def start(m):
    uid = m.from_user.id
    if uid in ADMIN_IDS:
        bot.send_message(uid, "👋 Admin panel: /login")
    row = cur.execute("SELECT phone FROM users WHERE id=?", (uid,)).fetchone()
    if row:
        send_main_menu(uid)
    else:
        kb = ReplyKeyboardMarkup(resize_keyboard=True, one_time_keyboard=True)
        kb.add(KeyboardButton("📱 Telefon raqamni yuborish", request_contact=True))
        bot.send_message(uid, "🍴 <b>O‘zbek milliy taomlari</b>\nBuyurtma berish uchun telefon raqamingizni yuboring:", parse_mode='HTML', reply_markup=kb)

@bot.message_handler(content_types=['contact'])
def contact(m):
    uid = m.from_user.id
    phone = m.contact.phone_number.replace("+", "")
    name  = " ".join(filter(None, [m.from_user.first_name, m.from_user.last_name]))
    cur.execute("INSERT OR IGNORE INTO users(id,phone,name) VALUES(?,?,?)", (uid, phone, name))
    conn.commit()
    send_main_menu(uid)

def send_main_menu(uid):
    markup = InlineKeyboardMarkup(row_width=1)
    markup.add(
        InlineKeyboardButton("🍽 Buyurtma berish", web_app=WebAppInfo(url=WEB_APP)),
        InlineKeyboardButton("ℹ Bot haqida", callback_data="about")
    )
    bot.send_photo(uid, photo="https://i.ibb.co/20mqx4f8/metbex1-8.jpg",
                   caption="🍴 <b>O‘zbek milliy taomlari</b>\n\nTanlang:", parse_mode='HTML', reply_markup=markup)

# ---------- WebApp data ----------
@bot.message_handler(content_types=['web_app_data'])
def web_app_data(m):
    uid = m.from_user.id
    data = json.loads(m.web_app_data.data)
    items = data['items']
    total = data['total']
    loc   = data.get('location', {})
    phone = cur.execute("SELECT phone FROM users WHERE id=?", (uid,)).fetchone()[0]
    order_id = 'o' + str(uid) + str(int(time.time()*1000))
    cur.execute("""INSERT INTO orders(id,user_id,phone,items,total,status,lat,lon,created)
                   VALUES(?,?,?,?,?,?,?,?,?)""",
                (order_id, uid, phone, json.dumps(items), total, 'yangi',
                 loc.get('lat'), loc.get('lon'), datetime.utcnow().isoformat()))
    conn.commit()
    # admins
    text = f"""🆕 <b>Yangi buyurtma</b>
👤 {m.from_user.first_name or ''} {m.from_user.last_name or ''}
📞 +{phone}
📦 {len(items)} ta
💰 {total:,} so‘m
📍 <a href='https://www.google.com/maps?q={loc.get('lat')},{loc.get('lon')}'>Xaritada</a>"""
    for ad in ADMIN_IDS:
        bot.send_message(ad, text, parse_mode='HTML', disable_web_page_preview=True)
    bot.send_message(uid, f"✅ Buyurtma qabul qilindi!\nJami: {total:,} so‘m\nTez orada yetkazamiz.")

# ---------- INLINE ----------
@bot.callback_query_handler(func=lambda c: c.data=="about")
def about(c):
    bot.answer_callback_query(c.id, "Bu bot orqali o‘zbek milliy taomlarini onlayn buyurtma qilishingiz mumkin.", show_alert=True)

# ---------- ADMIN COMMANDS ----------
@bot.message_handler(commands=['login'])
def login(m):
    if m.from_user.id not in ADMIN_IDS: return
    bot.send_message(m.from_user.id, f"🔗 <a href='https://asliddinx278-ops.github.io/uzfood/admin.html'>Admin-panelga o‘tish</a>\nParol: <code>{ADMIN_PW}</code>", parse_mode='HTML')

# ---------- SIMPLE BACKEND (bottle) ----------
from bottle import Bottle, request, response, run
import datetime

api = Bottle()

@api.route('/api/login', method='POST')
def login():
    return {"ok": request.json.get("password") == ADMIN_PW}

@api.route('/api/orders', method='GET')
def get_orders():
    status = request.params.status
    phone  = request.params.phone
    rows = cur.execute("SELECT * FROM orders ORDER BY created DESC").fetchall()
    orders = []
    for r in rows:
        if status and r[5] != status: continue
        if phone  and phone not in r[2]: continue
        orders.append({
            "id":r[0], "user_id":r[1], "phone":r[2],
            "items":json.loads(r[3]), "total":r[4], "status":r[5],
            "lat":r[6], "lon":r[7], "created":r[8]
        })
    return {"orders": orders}

@api.route('/api/orders/<order_id>', method='PATCH')
def patch_order(order_id):
    data = request.json
    cur.execute("UPDATE orders SET status=? WHERE id=?", (data.get('status'), order_id))
    conn.commit()
    row = cur.execute("SELECT * FROM orders WHERE id=?", (order_id,)).fetchone()
    order = {
        "id":row[0], "user_id":row[1], "phone":row[2],
        "items":json.loads(row[3]), "total":row[4], "status":row[5],
        "lat":row[6], "lon":row[7], "created":row[8]
    }
    # userga
    bot.send_message(row[1], f"🔄 Buyurtmangiz holati: <b>{row[5]}</b>", parse_mode='HTML')
    # admins
    for ad in ADMIN_IDS:
        bot.send_message(ad, f"🔄 Buyurtma <b>{order_id[-6:]}</b> holati → <b>{row[5]}</b>", parse_mode='HTML')
    return order

def run_api():
    run(api, host='0.0.0.0', port=8080, quiet=True)

if __name__ == '__main__':
    threading.Thread(target=run_api, daemon=True).start()
    print("Bot ishga tushdi...")
    bot.infinity_polling(skip_pending=True)
