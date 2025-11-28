# SETUP GUIDE - Taxi Management System

## 🚀 Installation & Setup

### Step 1: Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Windows PowerShell or Command Prompt

### Step 2: Install Dependencies

```powershell
cd d:\python
pip install -r requirements.txt
```

**Expected output:**
```
Successfully installed Flask-2.3.3 Flask-CORS-4.0.0 Flask-JWT-Extended-4.5.2 SQLAlchemy-2.0.21 python-telegram-bot-20.3 ...
```

### Step 3: Setup Environment

Copy `.env.example` to `.env`:

```powershell
Copy-Item .env.example .env
```

Edit `.env` file with your settings:
```
DATABASE_URL=sqlite:///taxi_system.db
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN
SECRET_KEY=your-secret-key
JWT_SECRET=your-jwt-secret
DEBUG=True
PORT=5000
```

### Step 4: Initialize System

```powershell
python init_system.py
```

**Output:**
```
🚀 Tizim o'rnatilmoqda...

1️⃣  Admin yaratiladi...
2️⃣  Dispetcherlar yaratiladi...
3️⃣  Haydovchilar yaratiladi...
4️⃣  Mijozlar yaratiladi...
5️⃣  Namuna buyurtmalar yaratiladi...
6️⃣  Haydovchi joylashuvi yangilanimoqda...

✅ Tizim muvaffaqiyatli o'rnatildi!

📋 TEST HISOBLARI:

👤 ADMIN
   Telefon: +998901234567

📞 DISPETCHER
   Telefon: +998902345678

👨‍✈️  HAYDOVCHI
   Telefon: +998902345671
```

---

## 🏃 Running the System

### Terminal 1: Start Web Server

```powershell
cd d:\python
python app.py
```

**Expected output:**
```
 * Running on http://127.0.0.1:5000
```

### Terminal 2: Start Admin Panel

```powershell
cd d:\python
python admin_panel.py
```

### Terminal 3: Start Dispatcher Panel

```powershell
cd d:\python
python dispatcher_panel.py
```

---

## 🧪 Testing

### Test 1: Check Health

```powershell
curl http://localhost:5000/health
```

**Response:**
```json
{"status": "healthy"}
```

### Test 2: Run API Tests

```powershell
python test_api.py
```

### Test 3: Manual API Test

**Register Customer:**
```powershell
$body = @{
    phone = "+998901111111"
    name = "Test Customer"
    role = "customer"
} | ConvertTo-Json

curl -X POST `
  -H "Content-Type: application/json" `
  -d $body `
  http://localhost:5000/api/auth/register
```

---

## 💻 Admin Panel Usage

1. Run `python admin_panel.py`
2. Login with: **+998901234567**
3. Choose from menu:
   - View all users
   - Add drivers
   - Add dispatchers
   - Toggle user status
   - View statistics

---

## 📞 Dispatcher Panel Usage

1. Run `python dispatcher_panel.py`
2. Login with: **+998902345678**
3. Choose from menu:
   - Add order from phone call
   - View pending orders
   - Assign driver to order
   - View all drivers
   - Update order status

---

## 🚕 Web API Flow

### Customer Order Flow:
```
1. Register/Login
2. Create Order
3. Track Status
4. Complete Order
```

### Driver Flow:
```
1. Register/Login
2. Update Location
3. View Available Orders
4. Accept Order
5. Start/Complete Order
```

### Dispatcher Flow:
```
1. Register/Login
2. Receive Phone Call
3. Create Order from Call
4. Assign Driver
5. Monitor Order Progress
```

---

## 📊 Database

Database file: `taxi_system.db` (SQLite)

**Tables:**
- `users` - All system users
- `orders` - Order records
- `dispatcher_calls` - Phone call records
- `driver_locations` - Driver GPS locations

---

## 🔧 Troubleshooting

### Issue: "ModuleNotFoundError"
**Solution:**
```powershell
pip install -r requirements.txt
```

### Issue: "Database locked"
**Solution:**
```powershell
# Delete database and reinitialize
Remove-Item taxi_system.db -ErrorAction SilentlyContinue
python init_system.py
```

### Issue: "Port 5000 already in use"
**Solution:**
```powershell
# Change PORT in .env or kill process
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue).OwningProcess -Force
```

### Issue: "Telegram bot not working"
**Solution:**
1. Get bot token from @BotFather on Telegram
2. Update `.env` file with correct token
3. Restart the application

---

## 🎯 Quick Start Checklist

- [ ] Install Python 3.8+
- [ ] Install dependencies: `pip install -r requirements.txt`
- [ ] Create `.env` file
- [ ] Run: `python init_system.py`
- [ ] Terminal 1: `python app.py`
- [ ] Terminal 2: `python admin_panel.py`
- [ ] Terminal 3: `python dispatcher_panel.py`
- [ ] Test: `curl http://localhost:5000/health`

---

## 📱 API Examples

### Create Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pickup_location": "Mirza Ulugbek ko'\''chasi",
    "destination_location": "Cho'\''lpon-Arbada",
    "passengers_count": 2,
    "order_type": "now"
  }'
```

### Accept Order (Driver)
```bash
curl -X POST http://localhost:5000/api/driver/accept-order/ORDER_ID \
  -H "Authorization: Bearer DRIVER_TOKEN"
```

### Assign Driver (Dispatcher)
```bash
curl -X POST http://localhost:5000/api/dispatcher/assign-driver/ORDER_ID/DRIVER_ID \
  -H "Authorization: Bearer DISPATCHER_TOKEN"
```

---

## 🚀 Deployment

### For Production:

1. **Use PostgreSQL** instead of SQLite:
   ```
   DATABASE_URL=postgresql://user:pass@host/dbname
   ```

2. **Set DEBUG=False**:
   ```
   DEBUG=False
   ```

3. **Generate secure keys**:
   ```powershell
   python -c "import secrets; print(secrets.token_hex(32))"
   ```

4. **Use HTTPS** with SSL certificates

5. **Setup reverse proxy** (Nginx/Apache)

6. **Use process manager** (Gunicorn/uWSGI)

---

## 📞 Support

For issues:
1. Check terminal output for error messages
2. Review `.env` configuration
3. Check database file exists
4. Verify port 5000 is not in use
5. Ensure all dependencies installed

---

Made with ❤️ for Professional Taxi Services
