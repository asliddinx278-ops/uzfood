# 🚕 Taxi Management System - Hammasini O'z Ichiga Olgan Backend

## 📝 Tezkor Boshlanish

### 1️⃣ Dependency O'rnatish
```bash
pip install -r requirements.txt
```

### 2️⃣ Sistemani Initsializatsiya Qilish
```bash
python taxi_system.py --init
```

### 3️⃣ Web Serverni Ishga Tushirish
```bash
python taxi_system.py --start-web
```

## 🌐 Kirishl Nuqtalari

| Komponenta | URL | Status |
|-----------|-----|--------|
| Customer App | http://localhost:5000/customer.html | ✅ Ishlaydi |
| Driver Pro App | http://localhost:5000/driver_pro.html | ✅ Yangi! |
| Driver Login | http://localhost:5000/driver_login.html | ✅ Yangi! |
| Admin Panel | http://localhost:5000/admin_panel_driver_registration.html | ✅ Yangi! |
| Admin Login | http://localhost:5000/admin_login.html | ✅ Yangi! |
| Admin Dashboard | http://localhost:5000/admin_dashboard_money.html | ✅ Yangi! |
| REST API | http://localhost:5000/api | ✅ Ishlaydi |
| Health Check | http://localhost:5000/health | ✅ Ishlaydi |

## 📱 Test Hisoblari

Sistemani `init` qilgandan keyin quyidagi test hisobi mavjud:

```
Admin:       +998901234567
Dispatcher:  +998902345678
Driver 1:    +998902345671
Customer 1:  +998903345671
```

## 🔌 Barcha API Endpoints

### Authentication
```
POST /api/auth/register      - Yangi user ro'yxatga olish
POST /api/auth/login         - Telefon orqali kirish
```

### Customer Orders
```
POST   /api/orders                    - Yangi buyurtma yaratish
GET    /api/orders                    - Mening buyurtmalarim
POST   /api/orders/<id>/cancel        - Buyurtmani bekor qilish
```

### Driver Operations
```
POST   /api/driver/update-location    - GPS joylashuvini yangilash
GET    /api/driver/available-orders   - Mavjud buyurtmalar
POST   /api/driver/accept-order/<id>  - Buyurtmani qabul qilish
POST   /api/driver/start-order/<id>   - Yetkazishni boshlash
POST   /api/driver/complete-order/<id> - Yetkazishni tugatish
```

### Dispatcher Operations
```
POST   /api/dispatcher/create-order-from-call      - Qo'ng'iroqdan buyurtma
GET    /api/dispatcher/pending-orders              - Kutilayotgan buyurtmalar
GET    /api/dispatcher/available-drivers           - Mavjud haydovchilar
POST   /api/dispatcher/assign-driver/<id>/<id>     - Haydovchini tayinlash
```

### Admin Operations
```
GET    /api/admin/dashboard            - Dashboard statistikasi
GET    /api/admin/users                - Barcha userlar
POST   /api/admin/users/<id>/toggle-status - User statusini o'zgartirish
```

## 📂 Fayl Tuzilishi

```
taxi_system.py           ← 🔥 BARCHA BACKEND KODI BU FAYLDA
                            ├── Config (Konfiguratsiya)
                            ├── Models (Modellar)
                            ├── Database (Database)
                            ├── Flask App (Web Server)
                            ├── API Endpoints
                            └── Init System (Initsializatsiya)

customer.html            ← Mijoz interfeysi
customer.js              ← Mijoz logikasi

driver.html              ← Haydovchi interfeysi
driver.js                ← Haydovchi logikasi

admin.html               ← Admin paneli
admin.js                 ← Admin logikasi

.env.example             ← Konfiguratsiya shablon
requirements.txt         ← Python dependencies
```

## 🚀 Ishga Tushirish Variantlari

### Variant 1: Sistemani initsializatsiya qilib, serverni ishga tushirish
```bash
python taxi_system.py --init
python taxi_system.py --start-web
```

### Variant 2: Faqat serverni ishga tushirish (data mavjud deb faraz)
```bash
python taxi_system.py --start-web
```

### Variant 3: Systemani o'zgartirish va test qilish
```bash
# Sistemani test qilish
python test_api.py

# Dispatcher panelini ishga tushirish
python dispatcher_panel.py

# Admin panelini ishga tushirish
python admin_panel.py
```

## 🗄️ Database

**Default:** SQLite (`taxi_system.db`)

**Production:** PostgreSQL o'rnatish

.env faylida `DATABASE_URL` ning qiymatini o'zgartiring:
```env
DATABASE_URL=postgresql://user:password@localhost/taxi_db
```

## ⚙️ Konfiguratsiya

`.env.example` ni `.env` ga nusxa qilib, o'zingizning sozlamalarini kiriting:

```env
DATABASE_URL=sqlite:///taxi_system.db
TELEGRAM_BOT_TOKEN=your_token_here
SECRET_KEY=your-secret-key
JWT_SECRET=your-jwt-secret
DEBUG=True
PORT=5000
```

## 🔐 Xavfsizlik

**Diqqat:** Production uchun:
- `DEBUG=False` qiling
- Yangi `SECRET_KEY` va `JWT_SECRET` generatsiya qiling
- HTTPS/SSL sertifikat o'rnatishni amalga oshiring
- Reverse proxy (Nginx) o'rnatishni amalga oshiring

## 📊 Qo'shimcha Utilities

### `init_system.py` - Test data bilan sistemani initsializatsiya qilish
```bash
python init_system.py
```

### `test_api.py` - Barcha API endpoints ni test qilish
```bash
python test_api.py
```

### `dispatcher_panel.py` - Dispatcher CLI interfeysi
```bash
python dispatcher_panel.py
```

### `admin_panel.py` - Admin CLI interfeysi
```bash
python admin_panel.py
```

## 🛠️ Muammolarni Hal Qilish

### Faylni qayta o'rnatish kerak
```bash
rm taxi_system.db
python taxi_system.py --init
```

### Port allaqachon band
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Module topilmadi
```bash
pip install -r requirements.txt
```

## 📚 Dokumentatsiya

- `README.md` - Loyihaning umumiy tavsifi
- `SETUP.md` - Batafsil o'rnatish qo'llanmasi
- `DOCUMENTATION.md` - API to'liq ma'lumotlari
- `INDEX.md` - Repository tuzilishi

## 🎯 Asosiy Xususiyatlar

✅ **Complete Backend**
- 20+ REST API endpoints
- JWT token-based authentication
- Real-time order tracking
- Multi-role system (Customer, Driver, Dispatcher, Admin)
- Order lifecycle management (6 states)

✅ **Web Frontend**
- Customer ordering interface
- Driver order management
- Admin dashboard
- Real-time order updates

✅ **Database**
- SQLAlchemy ORM
- 5 main models with relationships
- SQLite/PostgreSQL support

✅ **Security**
- Phone-based authentication
- JWT tokens
- Role-based access control

## 🚀 Production Checklist

- [ ] SQLite'ni PostgreSQL bilan almashtirib qo'ying
- [ ] DEBUG=False qiling
- [ ] Yangi SECRET_KEY generatsiya qiling
- [ ] Yangi JWT_SECRET generatsiya qiling
- [ ] SSL sertifikat o'rnatishni amalga oshiring
- [ ] Reverse proxy (Nginx) o'rnatishni amalga oshiring
- [ ] Logging o'rnatishni amalga oshiring
- [ ] Backup stategi o'rnatishni amalga oshiring
- [ ] Rate limiting o'rnatishni amalga oshiring
- [ ] Monitoring o'rnatishni amalga oshiring

## 📞 Qo'llab-Quvvatlash

Muammolarga qo'yilgan javoblar:

1. Dokumentatsiyani o'qib chiqing
2. Error loglarini tekshiring
3. GitHub issues ni ko'ring
4. Yangi issue yarating

## 📄 Litsenziya

MIT License - Tafsilotlar uchun LICENSE faylini ko'ring

---

**Asliddin X** tomonidan yaratilgan

🌐 GitHub: https://github.com/asliddinx278-ops/taxi
