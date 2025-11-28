# 🚕 Professional Taxi Management System

[![GitHub](https://img.shields.io/badge/GitHub-asliddinx278--ops%2Ftaxi-blue?logo=github)](https://github.com/asliddinx278-ops/taxi)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.8+-blue?logo=python)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.3-lightgrey?logo=flask)](https://flask.palletsprojects.com/)

**Professional web-based taxi management system with customer app, driver tracking, dispatcher integration, and admin control panel.**

### 📋 Features

#### 👤 Customer Features
- **Easy Ordering**: Order taxi now or schedule for later
- **Passenger Count**: Select 1-4 passengers
- **Location-based**: Set pickup and destination locations
- **Order Tracking**: Track order status in real-time
- **Comments**: Add special requests or comments
- **Order History**: View all previous orders
- **Telegram Integration**: Order via Telegram bot

#### 👨‍✈️ Driver Features
- **Available Orders**: See all pending orders
- **Accept Orders**: Accept orders near your location
- **Real-time Updates**: Get live order information
- **Location Tracking**: Update your location
- **Order Details**: Full customer information and phone number
- **Complete Orders**: Mark orders as completed

#### 📞 Dispatcher Features (2-in-1 Panel)
- **Phone Call Orders**: Create orders from customer phone calls
- **Customer Management**: Store customer location and phone
- **Driver Assignment**: Assign drivers to orders
- **Order Management**: Track all order statuses
- **Available Drivers**: View all drivers and their locations
- **Call History**: Keep records of all phone calls
- **Instant Notifications**: Get notifications for new orders

#### 🔐 Admin Features (Complete System Management)
- **User Management**: Add/remove drivers and dispatchers
- **System Statistics**: View all system metrics
- **Order Analytics**: Track completed, pending, cancelled orders
- **User Activation**: Activate/deactivate users
- **Revenue Tracking**: Monitor total revenue
- **System Health**: Check system status and performance

---

## 📁 Project Structure

```
d:\python\
├── config.py                 # Configuration settings
├── models.py                # Database models (SQLAlchemy)
├── app.py                    # Main Flask web application
├── telegram_bot.py          # Telegram bot handler
├── dispatcher_panel.py       # Dispatcher CLI panel
├── admin_panel.py           # Admin CLI panel
├── requirements.txt         # Python dependencies
└── taxi_system.db           # SQLite database (auto-created)
```

---

## 🚀 Installation

### 1. Install Python 3.8+

### 2. Install Dependencies

```bash
cd d:\python
pip install -r requirements.txt
```

### 3. Setup Environment Variables

Create `.env` file:

```env
DATABASE_URL=sqlite:///taxi_system.db
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN_HERE
SECRET_KEY=your-secret-key-here
JWT_SECRET=your-jwt-secret-here
DEBUG=True
PORT=5000
WEB_APP_URL=http://localhost:5000
```

### 4. Initialize Database

The database is automatically initialized when you run the application.

---

## 🏃 Running the System

### Start Web Server (API & Web App)

```bash
python app.py
```

Server runs at: `http://localhost:5000`

### Start Dispatcher Panel

```bash
python dispatcher_panel.py
```

**Dispatcher Login**: Use dispatcher's phone number

**Features**:
- 📞 Create orders from phone calls
- ⏳ View pending orders
- 👨‍✈️ Assign drivers to orders
- 📊 View system statistics
- 👥 View all drivers with their location

### Start Admin Panel

```bash
python admin_panel.py
```

**Admin Login**: Use admin's phone number

**Features**:
- 👥 Manage all users (customers, drivers, dispatchers)
- ➕ Add new drivers and dispatchers
- 🔄 Activate/deactivate users
- 📋 View all orders
- 📊 System statistics and revenue

---

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with phone number

### Customer Endpoints
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get customer's orders
- `GET /api/orders/<order_id>` - Get order details
- `POST /api/orders/<order_id>/cancel` - Cancel order

### Driver Endpoints
- `POST /api/driver/update-location` - Update driver location
- `GET /api/driver/available-orders` - Get available orders
- `POST /api/driver/accept-order/<order_id>` - Accept order
- `POST /api/driver/start-order/<order_id>` - Start delivery
- `POST /api/driver/complete-order/<order_id>` - Complete order

### Dispatcher Endpoints
- `POST /api/dispatcher/create-order-from-call` - Create order from call
- `GET /api/dispatcher/pending-orders` - Get pending orders
- `GET /api/dispatcher/available-drivers` - Get available drivers
- `POST /api/dispatcher/assign-driver/<order_id>/<driver_id>` - Assign driver

### Admin Endpoints
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users/<user_id>/toggle-status` - Toggle user status

---

## 🤖 Telegram Bot

### Bot Commands

```
/start           - Start bot
/phone +998...   - Register phone
/order           - Create order
/status          - Check order status
/driver          - Driver menu
/dispatcher      - Dispatcher menu
/admin           - Admin menu
```

### Features
- Phone registration
- Quick order creation
- Order status tracking
- Automatic notifications

---

## 📊 Database Models

### User
- id, phone, name, role, telegram_id, is_active, created_at

### Order
- id, customer_id, driver_id, dispatcher_id
- pickup_location, destination_location
- passengers_count, order_time, order_type
- status, price, customer_phone, comments

### DispatcherCall
- id, order_id, dispatcher_id
- customer_phone, customer_location
- passenger_count, notes, timestamps

### DriverLocation
- driver_id, latitude, longitude, is_available, updated_at

---

## 🔐 User Roles

1. **CUSTOMER** - Place orders, track status
2. **DRIVER** - Accept and complete orders
3. **DISPATCHER** - Receive calls, assign drivers
4. **ADMIN** - Manage entire system

---

## 🎯 Order Status Flow

```
PENDING → ASSIGNED → ACCEPTED → STARTED → COMPLETED
   ↓         ↓         ↓         ↓
   └─────────────────→ CANCELLED
```

---

## 🛠️ Development

### Adding New Features

1. Add model changes to `models.py`
2. Add API routes to `app.py`
3. Update database: `init_db(DATABASE_URL)`
4. Test via `/health` endpoint

### Customization

Edit `config.py` for:
- Database type
- Telegram bot token
- Server port
- JWT settings
- Auto-assign radius

---

## ⚠️ Important Notes

- Change `SECRET_KEY` and `JWT_SECRET` in production
- Use PostgreSQL instead of SQLite for production
- Set `DEBUG=False` in production
- Implement proper authentication in production
- Add HTTPS for secure connections

---

## 📞 Support

For issues or questions:
1. Check error logs
2. Verify database connection
3. Check Telegram bot token validity
4. Review configuration settings

---

## 📝 License

Professional Taxi Management System 2024

---

## 🎓 Tutorial

### Create First Admin

```bash
python
from models import *
from config import DATABASE_URL

engine = init_db(DATABASE_URL)
db = get_session(engine)

admin = User(
    phone="+998901234567",
    name="Admin",
    role=UserRole.ADMIN,
    is_active=True
)
db.add(admin)
db.commit()
```

### Create Test Data

```bash
# Run dispatcher_panel.py
# Run admin_panel.py to add drivers/dispatchers
# Use Telegram bot or API to create orders
```

---

## 🚀 Next Steps

1. ✅ Setup database and install dependencies
2. ✅ Run admin panel to add users
3. ✅ Start web server
4. ✅ Test via API or Telegram bot
5. ✅ Integrate dispatcher phone system
6. ✅ Deploy to production

---

Made with ❤️ for Professional Taxi Services
