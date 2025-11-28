# 🚕 Taxi Management System - Complete Repository Index

## 📋 Project Overview

This is a **Professional Taxi Management System** - a complete web-based solution for taxi ordering, driver management, dispatcher coordination, and system administration.

**GitHub Repository**: https://github.com/asliddinx278-ops/taxi

---

## 📁 Project Structure

```
taxi/
├── 🐍 Python Backend Files
│   ├── main.py                     ✅ Main entry point (all-in-one)
│   ├── config.py                   ✅ Configuration settings
│   ├── models.py                   ✅ Database models (SQLAlchemy ORM)
│   ├── app.py                      ✅ Flask web server & REST API
│   ├── telegram_bot.py             ✅ Telegram bot integration
│   ├── notifications.py            ✅ Real-time notifications
│   ├── dispatcher_panel.py         ✅ Dispatcher CLI interface
│   ├── admin_panel.py              ✅ Admin CLI interface
│   ├── init_system.py              ✅ System initialization script
│   ├── test_api.py                 ✅ API testing script
│   └── requirements.txt            ✅ Python dependencies
│
├── 🌐 Web Frontend Files
│   ├── customer.html               ✅ Customer web interface
│   ├── customer.js                 ✅ Customer app logic
│   ├── driver.html                 ✅ Driver web interface
│   ├── driver.js                   ✅ Driver app logic
│   ├── admin.html                  ✅ Admin dashboard
│   └── admin.js                    ✅ Admin dashboard logic
│
├── 📚 Documentation Files
│   ├── README.md                   ✅ Project overview
│   ├── SETUP.md                    ✅ Installation & setup guide
│   ├── DOCUMENTATION.md            ✅ Complete API reference
│   └── INDEX.md                    ✅ This file
│
├── ⚙️ Configuration Files
│   ├── .env.example                ✅ Environment variables template
│   ├── .gitignore                  ✅ Git ignore rules
│   ├── requirements.txt            ✅ Python dependencies
│   └── package.json                (Optional) Node.js dependencies
│
├── 🚀 Startup Scripts
│   ├── main.py                     ✅ Universal entry point
│   ├── start.bat                   ✅ Windows batch script
│   └── start.sh                    ✅ Linux/Mac shell script
│
└── 📊 Database
    └── taxi_system.db              (Generated after init)
```

---

## ✨ Features

### 👤 Customer Features
- ✅ Phone-based login (no password)
- ✅ Create orders (now or scheduled)
- ✅ Select 1-4 passengers
- ✅ Add pickup/destination locations
- ✅ Real-time order tracking
- ✅ Order history
- ✅ Cancel orders
- ✅ Telegram bot integration

### 👨‍✈️ Driver Features
- ✅ Real-time available orders
- ✅ Accept orders near location
- ✅ GPS location updates
- ✅ View customer details & phone
- ✅ Start/complete orders
- ✅ Set final price
- ✅ Order history
- ✅ Real-time notifications

### 📞 Dispatcher Features
- ✅ Receive phone calls
- ✅ Create orders from calls
- ✅ View all pending orders
- ✅ View drivers with location
- ✅ Assign drivers to orders
- ✅ Monitor order progress
- ✅ Track call history
- ✅ Daily statistics

### 🔐 Admin Features
- ✅ User management (add/remove)
- ✅ Driver management
- ✅ Dispatcher management
- ✅ View all orders
- ✅ System statistics
- ✅ Revenue tracking
- ✅ Activate/deactivate users
- ✅ Performance monitoring

---

## 🚀 Quick Start

### 1. Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Git

### 2. Clone Repository
```bash
git clone https://github.com/asliddinx278-ops/taxi.git
cd taxi
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Setup Environment
```bash
cp .env.example .env
# Edit .env with your settings
```

### 5. Initialize System
```bash
python main.py --init
```

### 6. Start Web Server
```bash
# Terminal 1
python main.py --start-web
# Or: python app.py
```

### 7. Start Admin Panel (Optional)
```bash
# Terminal 2
python admin_panel.py
```

### 8. Start Dispatcher Panel (Optional)
```bash
# Terminal 3
python dispatcher_panel.py
```

---

## 📱 Access Points

| Component | URL/Command | Port |
|-----------|-----------|------|
| Web API | http://localhost:5000 | 5000 |
| Health Check | http://localhost:5000/health | 5000 |
| Customer App | http://localhost:5000/customer.html | 5000 |
| Driver App | http://localhost:5000/driver.html | 5000 |
| Admin Dashboard | http://localhost:5000/admin.html | 5000 |
| Admin Panel (CLI) | `python admin_panel.py` | CLI |
| Dispatcher Panel (CLI) | `python dispatcher_panel.py` | CLI |

---

## 🧪 Test Accounts

After running `python main.py --init`:

| Role | Phone | Function |
|------|-------|----------|
| Admin | +998901234567 | System management |
| Dispatcher | +998902345678 | Order dispatch |
| Driver | +998902345671 | Order fulfillment |
| Customer | +998903345671 | Order placement |

---

## 📡 API Endpoints

### Authentication
```
POST /api/auth/register       # Register new user
POST /api/auth/login          # Login with phone
```

### Customer
```
POST   /api/orders                   # Create order
GET    /api/orders                   # Get customer's orders
GET    /api/orders/<id>              # Get order details
POST   /api/orders/<id>/cancel       # Cancel order
```

### Driver
```
POST   /api/driver/update-location         # Update GPS
GET    /api/driver/available-orders        # Get pending orders
POST   /api/driver/accept-order/<id>      # Accept order
POST   /api/driver/start-order/<id>       # Start delivery
POST   /api/driver/complete-order/<id>    # Complete order
```

### Dispatcher
```
POST   /api/dispatcher/create-order-from-call      # Create from call
GET    /api/dispatcher/pending-orders              # Get pending
GET    /api/dispatcher/available-drivers           # Get drivers
POST   /api/dispatcher/assign-driver/<id>/<did>   # Assign driver
```

### Admin
```
GET    /api/admin/dashboard            # Dashboard stats
GET    /api/admin/users                # Get all users
POST   /api/admin/users/<id>/toggle-status  # Toggle status
```

---

## 🗂️ File Descriptions

### Python Files

#### Core Application
- **main.py** - Universal entry point with CLI commands
- **config.py** - Configuration & environment settings
- **models.py** - SQLAlchemy ORM database models
- **app.py** - Flask web server & REST API
- **requirements.txt** - Python package dependencies

#### Features
- **telegram_bot.py** - Telegram bot integration
- **notifications.py** - Real-time notification system
- **init_system.py** - Database initialization with test data

#### CLI Interfaces
- **admin_panel.py** - Admin control panel (terminal UI)
- **dispatcher_panel.py** - Dispatcher panel (terminal UI)

#### Testing
- **test_api.py** - API endpoint testing script

### Web Frontend Files

#### HTML Templates
- **customer.html** - Customer ordering interface
- **driver.html** - Driver order management
- **admin.html** - Admin dashboard

#### JavaScript
- **customer.js** - Customer app logic & API calls
- **driver.js** - Driver app logic & location updates
- **admin.js** - Admin dashboard functionality

### Documentation
- **README.md** - Main project documentation
- **SETUP.md** - Installation & configuration guide
- **DOCUMENTATION.md** - Complete API reference
- **INDEX.md** - This file (repository index)

### Configuration
- **.env.example** - Environment variables template
- **.gitignore** - Git ignore rules
- **requirements.txt** - Python dependencies

### Startup Scripts
- **start.bat** - Windows batch startup script
- **start.sh** - Linux/Mac shell startup script

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│              Web Browsers (Clients)                 │
│  Customer  │  Driver  │  Admin  │  Dispatcher      │
└──────────────────────┬──────────────────────────────┘
                       │
         ┌─────────────▼─────────────┐
         │   Flask Web Server        │
         │   REST API (Port 5000)    │
         │   ├─ Authentication      │
         │   ├─ Orders              │
         │   ├─ Drivers             │
         │   ├─ Dispatchers         │
         │   └─ Admin               │
         └─────────────┬─────────────┘
                       │
         ┌─────────────▼─────────────┐
         │   SQLite/PostgreSQL       │
         │   ├─ Users               │
         │   ├─ Orders              │
         │   ├─ Locations           │
         │   └─ Call Records        │
         └───────────────────────────┘

         ┌──────────────────────────┐
         │   Telegram Bot API       │
         │   (Async Integration)    │
         └──────────────────────────┘

         ┌──────────────────────────┐
         │   CLI Interfaces         │
         │   ├─ Admin Panel         │
         │   └─ Dispatcher Panel    │
         └──────────────────────────┘
```

---

## 🛠️ Commands Reference

### Main Entry Point
```bash
python main.py --help          # Show help
python main.py --init          # Initialize system
python main.py --start-web     # Start web server
python main.py --admin-panel   # Show admin panel info
```

### Specific Components
```bash
python app.py                  # Start web server
python admin_panel.py          # Start admin panel
python dispatcher_panel.py     # Start dispatcher panel
python init_system.py          # Initialize database
python test_api.py             # Run API tests
```

### Quick Start Scripts
```bash
# Windows
start.bat

# Linux/Mac
bash start.sh
```

---

## 📊 Database Schema

### Users Table
- id (UUID)
- phone (unique)
- name
- role (customer/driver/dispatcher/admin)
- telegram_id
- is_active
- created_at, updated_at

### Orders Table
- id (UUID)
- customer_id, driver_id, dispatcher_id
- pickup_location, destination_location
- passengers_count, order_type
- status (pending/assigned/accepted/started/completed/cancelled)
- estimated_price, final_price
- customer_phone, customer_comment
- created_at, assigned_at, started_at, completed_at

### DriverLocations Table
- id (UUID)
- driver_id
- latitude, longitude
- is_available
- updated_at

### DispatcherCalls Table
- id (UUID)
- order_id, dispatcher_id
- customer_phone, customer_name, customer_location
- passenger_count, notes
- call_status, received_at, completed_at

---

## 🔧 Configuration

Edit `.env` file:

```env
# Database
DATABASE_URL=sqlite:///taxi_system.db

# Telegram
TELEGRAM_BOT_TOKEN=YOUR_TOKEN

# Security
SECRET_KEY=your-secret-key
JWT_SECRET=your-jwt-secret

# Server
DEBUG=True
PORT=5000
```

---

## 📚 Documentation Files

1. **README.md** - Start here! Project overview and features
2. **SETUP.md** - Installation and configuration guide
3. **DOCUMENTATION.md** - Complete API reference
4. **INDEX.md** - This file (repository structure)

---

## 🚀 Deployment

### Production Checklist
- [ ] Change DEBUG=False
- [ ] Generate new SECRET_KEY and JWT_SECRET
- [ ] Use PostgreSQL instead of SQLite
- [ ] Setup HTTPS/SSL certificate
- [ ] Configure reverse proxy (Nginx)
- [ ] Use process manager (Gunicorn)
- [ ] Setup monitoring/logging
- [ ] Configure backups
- [ ] Setup rate limiting
- [ ] Implement payment processing

---

## 🐛 Troubleshooting

### Module Not Found
```bash
pip install -r requirements.txt
```

### Database Locked
```bash
rm taxi_system.db
python main.py --init
```

### Port Already in Use
```bash
# Windows: Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac: Change PORT in .env
PORT=5001
```

### API Connection Error
- Check if web server is running: `python app.py`
- Verify port 5000 is accessible
- Check firewall settings

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👨‍💻 Author

**Asliddin X**
- GitHub: [@asliddinx278-ops](https://github.com/asliddinx278-ops)
- Repository: https://github.com/asliddinx278-ops/taxi

---

## 📞 Support

For issues and questions:

1. Check documentation files
2. Review error logs
3. Check GitHub issues
4. Create new issue if needed

---

## 🎯 Roadmap

- [x] Core API development
- [x] Web frontend (HTML/JS)
- [x] Admin panel
- [x] Dispatcher panel
- [ ] Mobile apps (iOS/Android)
- [ ] Payment integration
- [ ] SMS notifications
- [ ] Advanced analytics
- [ ] Machine learning for optimal routing

---

**Made with ❤️ for Professional Taxi Services**

Last Updated: 2025-11-28
