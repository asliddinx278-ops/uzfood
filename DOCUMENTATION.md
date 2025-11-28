# 🚕 Professional Taxi Management System - Complete Documentation

## 📖 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Installation](#installation)
5. [Running the System](#running-the-system)
6. [API Reference](#api-reference)
7. [User Roles](#user-roles)
8. [Database Schema](#database-schema)
9. [Troubleshooting](#troubleshooting)

---

## System Overview

Professional web-based taxi management system with:
- **Customer App** - Order taxi with flexible scheduling
- **Driver App** - Accept and complete orders
- **Dispatcher Panel** - Receive phone calls, assign drivers
- **Admin Panel** - System management and statistics
- **Telegram Bot** - Mobile ordering and notifications

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    WEB BROWSER                           │
│  (Customer / Driver / Dispatcher / Admin Interfaces)    │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────┐
│                   FLASK WEB SERVER                       │
│  Port: 5000                                             │
│  ├─ REST API (CRUD)                                     │
│  ├─ JWT Authentication                                 │
│  └─ WebSocket Support (for real-time updates)         │
└────────────┬─────────────────────────────┬─────────────┘
             │                             │
┌────────────▼────────┐      ┌─────────────▼──────────┐
│   SQLite Database   │      │   Telegram Bot API    │
│  (Local/PostgreSQL) │      │   (python-telegram)   │
│  ├─ Users          │      │                       │
│  ├─ Orders         │      │   Commands:           │
│  ├─ Locations      │      │   /start              │
│  └─ Call Records   │      │   /order              │
└────────────────────┘      │   /status             │
                            └───────────────────────┘

┌──────────────────────────────────────────────────────────┐
│              OFFLINE PANELS (CLI)                        │
│  ├─ Admin Panel (admin_panel.py)                        │
│  └─ Dispatcher Panel (dispatcher_panel.py)              │
└──────────────────────────────────────────────────────────┘
```

---

## Features

### 👤 Customer Features

| Feature | Description |
|---------|-------------|
| **Register/Login** | Phone number based authentication |
| **Order Now** | Immediate taxi request |
| **Schedule Later** | Book for specific time |
| **Passenger Count** | Select 1-4 passengers |
| **Comments** | Add special requests |
| **Order Tracking** | Real-time order status |
| **Order History** | View past orders |
| **Telegram Support** | Order via Telegram bot |

### 👨‍✈️ Driver Features

| Feature | Description |
|---------|-------------|
| **Register/Login** | Phone number based |
| **View Orders** | See all pending orders |
| **Accept Orders** | Accept nearby orders |
| **Location Update** | Send GPS location |
| **Order Details** | Full customer info |
| **Start Order** | Begin delivery |
| **Complete Order** | Finish delivery, set price |
| **Order History** | View completed orders |

### 📞 Dispatcher Features

| Feature | Description |
|---------|-------------|
| **Phone Integration** | Receive customer calls |
| **Quick Order Entry** | Create order from call |
| **Auto Assign** | Auto-assign nearest drivers |
| **Manual Assign** | Choose specific driver |
| **Driver Management** | View all drivers & locations |
| **Order Tracking** | Monitor all orders |
| **Statistics** | View daily metrics |
| **Call History** | Log of all calls |

### 🔐 Admin Features

| Feature | Description |
|---------|-------------|
| **User Management** | Add/remove/activate users |
| **Driver Management** | Manage all drivers |
| **Dispatcher Management** | Manage dispatcher team |
| **System Statistics** | Complete metrics |
| **Revenue Tracking** | Income calculation |
| **Order Analytics** | Completion rates |
| **Performance Monitoring** | System health checks |
| **User Reports** | Detailed user activity |

---

## Installation

### Prerequisites
- Windows, Linux, or Mac
- Python 3.8+
- pip package manager

### Step-by-step

**1. Install Dependencies:**
```bash
cd d:\python
pip install -r requirements.txt
```

**2. Setup Environment:**
```bash
copy .env.example .env
# Edit .env with your settings
```

**3. Initialize Database:**
```bash
python init_system.py
```

**Expected Output:**
```
✓ Admin created
✓ Dispatchers created
✓ Drivers created
✓ Customers created
✓ Sample orders created
```

---

## Running the System

### Quick Start (Recommended)

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
bash start.sh
```

### Manual Start (3 Terminals)

**Terminal 1 - Web Server:**
```bash
python app.py
# Output: Running on http://127.0.0.1:5000
```

**Terminal 2 - Admin Panel:**
```bash
python admin_panel.py
# Login with: +998901234567
```

**Terminal 3 - Dispatcher Panel:**
```bash
python dispatcher_panel.py
# Login with: +998902345678
```

### Test Connection
```bash
curl http://localhost:5000/health
# Response: {"status": "healthy"}
```

---

## API Reference

### Authentication Endpoints

**Register User**
```
POST /api/auth/register
Content-Type: application/json

{
  "phone": "+998901234567",
  "name": "John Doe",
  "role": "customer"  // customer|driver|dispatcher|admin
}

Response: 201 Created
{
  "user": {...},
  "access_token": "eyJ0eXAiOiJKV1QiLC..."
}
```

**Login**
```
POST /api/auth/login
Content-Type: application/json

{
  "phone": "+998901234567"
}

Response: 200 OK
{
  "user": {...},
  "access_token": "..."
}
```

### Customer Endpoints

**Create Order**
```
POST /api/orders
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "pickup_location": "Mirza Ulugbek ko'chasi",
  "destination_location": "Cho'lpon-Arbada",
  "pickup_latitude": 41.2995,
  "pickup_longitude": 69.2401,
  "passengers_count": 2,
  "order_type": "now",  // now|scheduled
  "comment": "Iltimos shoshiling"
}

Response: 201 Created
{"message": "Order created", "order": {...}}
```

**Get Orders**
```
GET /api/orders
Authorization: Bearer TOKEN

Response: 200 OK
[
  {"id": "123", "status": "pending", ...},
  {"id": "124", "status": "completed", ...}
]
```

**Cancel Order**
```
POST /api/orders/ORDER_ID/cancel
Authorization: Bearer TOKEN

Response: 200 OK
{"message": "Order cancelled", "order": {...}}
```

### Driver Endpoints

**Update Location**
```
POST /api/driver/update-location
Authorization: Bearer TOKEN

{
  "latitude": 41.2995,
  "longitude": 69.2401,
  "is_available": true
}

Response: 200 OK
```

**Get Available Orders**
```
GET /api/driver/available-orders
Authorization: Bearer TOKEN

Response: 200 OK
[{...}, {...}]
```

**Accept Order**
```
POST /api/driver/accept-order/ORDER_ID
Authorization: Bearer TOKEN

Response: 200 OK
{"message": "Order accepted", "order": {...}}
```

**Start Order**
```
POST /api/driver/start-order/ORDER_ID
Authorization: Bearer TOKEN

Response: 200 OK
```

**Complete Order**
```
POST /api/driver/complete-order/ORDER_ID
Authorization: Bearer TOKEN

{
  "final_price": 50000
}

Response: 200 OK
```

### Dispatcher Endpoints

**Create Order from Call**
```
POST /api/dispatcher/create-order-from-call
Authorization: Bearer TOKEN

{
  "customer_phone": "+998905555555",
  "customer_name": "Ali",
  "pickup_location": "Fergona ko'chasi",
  "destination_location": "Universitetda",
  "passengers_count": 1,
  "notes": "Shoshiling!"
}

Response: 201 Created
```

**Get Pending Orders**
```
GET /api/dispatcher/pending-orders
Authorization: Bearer TOKEN

Response: 200 OK
[{...}]
```

**Get Available Drivers**
```
GET /api/dispatcher/available-drivers
Authorization: Bearer TOKEN

Response: 200 OK
[
  {
    "id": "driver_1",
    "name": "Haydovchi 1",
    "phone": "+998902345671",
    "location": {
      "latitude": 41.2995,
      "longitude": 69.2401,
      "is_available": true
    }
  }
]
```

**Assign Driver**
```
POST /api/dispatcher/assign-driver/ORDER_ID/DRIVER_ID
Authorization: Bearer TOKEN

Response: 200 OK
```

### Admin Endpoints

**Dashboard Stats**
```
GET /api/admin/dashboard
Authorization: Bearer TOKEN

Response: 200 OK
{
  "total_customers": 100,
  "total_drivers": 25,
  "total_orders": 500,
  "completed_orders": 480,
  "pending_orders": 15,
  "completion_rate": 96.0
}
```

**Get All Users**
```
GET /api/admin/users
Authorization: Bearer TOKEN

Response: 200 OK
[{...}]
```

**Toggle User Status**
```
POST /api/admin/users/USER_ID/toggle-status
Authorization: Bearer TOKEN

Response: 200 OK
```

---

## User Roles

### CUSTOMER
- Create orders
- View own orders
- Cancel orders
- Track orders
- **Cannot**: Accept orders, assign drivers

### DRIVER
- View available orders
- Accept orders
- Update location
- Start/complete orders
- **Cannot**: Create orders, assign drivers

### DISPATCHER
- Create orders (from calls)
- View all pending orders
- View all drivers
- Assign drivers to orders
- View statistics
- **Cannot**: Create customer orders directly

### ADMIN
- Full system access
- User management
- View all data
- System statistics
- **Cannot**: Accept or complete orders

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  role ENUM('customer', 'driver', 'dispatcher', 'admin'),
  telegram_id VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME,
  updated_at DATETIME
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id VARCHAR(36) PRIMARY KEY,
  customer_id VARCHAR(36) FOREIGN KEY,
  driver_id VARCHAR(36) FOREIGN KEY,
  dispatcher_id VARCHAR(36) FOREIGN KEY,
  pickup_location VARCHAR(255),
  destination_location VARCHAR(255),
  pickup_latitude FLOAT,
  pickup_longitude FLOAT,
  passengers_count INT,
  order_time DATETIME,
  order_type VARCHAR(20),
  status ENUM('pending', 'assigned', 'accepted', 'started', 'completed', 'cancelled'),
  estimated_price FLOAT,
  final_price FLOAT,
  customer_phone VARCHAR(20),
  customer_comment VARCHAR(500),
  created_at DATETIME,
  assigned_at DATETIME,
  started_at DATETIME,
  completed_at DATETIME
);
```

### DispatcherCalls Table
```sql
CREATE TABLE dispatcher_calls (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) FOREIGN KEY,
  dispatcher_id VARCHAR(36) FOREIGN KEY,
  customer_phone VARCHAR(20),
  customer_name VARCHAR(100),
  customer_location VARCHAR(255),
  passenger_count INT,
  notes VARCHAR(500),
  call_status VARCHAR(20),
  received_at DATETIME,
  completed_at DATETIME
);
```

### DriverLocations Table
```sql
CREATE TABLE driver_locations (
  id VARCHAR(36) PRIMARY KEY,
  driver_id VARCHAR(36) FOREIGN KEY,
  latitude FLOAT,
  longitude FLOAT,
  is_available BOOLEAN,
  updated_at DATETIME
);
```

---

## Troubleshooting

### "ModuleNotFoundError: No module named 'flask'"
**Solution:**
```bash
pip install -r requirements.txt
```

### "Database is locked"
**Solution:**
```bash
del taxi_system.db
python init_system.py
```

### "Address already in use (port 5000)"
**Solution:**
```bash
# Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change PORT in .env
PORT=5001
```

### "JWT token expired"
**Solution:**
- Login again to get new token
- Or increase `JWT_EXPIRATION_HOURS` in config.py

### "Telegram bot not responding"
**Solution:**
1. Verify bot token in `.env`
2. Check internet connection
3. Verify telegram API is not blocked
4. Restart application

### "AttributeError: 'NoneType' object has no attribute..."
**Solution:**
```bash
# Reinitialize database
python init_system.py
```

---

## 📞 Test Accounts

After running `init_system.py`:

| Role | Phone | Password |
|------|-------|----------|
| Admin | +998901234567 | Phone-based |
| Dispatcher 1 | +998902345678 | Phone-based |
| Dispatcher 2 | +998903345678 | Phone-based |
| Driver 1 | +998902345671 | Phone-based |
| Driver 2 | +998902345672 | Phone-based |
| Customer 1 | +998903345671 | Phone-based |
| Customer 2 | +998903345672 | Phone-based |

---

## 🚀 Next Steps

1. **Production Deployment**
   - Switch to PostgreSQL
   - Set DEBUG=False
   - Use HTTPS
   - Setup load balancer

2. **Advanced Features**
   - Payment integration
   - SMS notifications
   - Email alerts
   - Advanced analytics

3. **Mobile Apps**
   - iOS app
   - Android app
   - Cross-platform support

---

Made with ❤️ for Professional Taxi Services
