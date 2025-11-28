#!/usr/bin/env python3
# Initialize System - Create test data for demonstration
from models import *
from config import DATABASE_URL
from datetime import datetime

def init_system():
    """Initialize system with test data"""
    print("🚀 Tizim o'rnatilmoqda...\n")
    
    # Initialize database
    engine = init_db(DATABASE_URL)
    db = get_session(engine)
    
    try:
        # Check if admin exists
        admin = db.query(User).filter_by(role=UserRole.ADMIN).first()
        if admin:
            print("✅ Tizim allaqachon o'rnatilgan!")
            return
        
        # Create Admin
        print("1️⃣  Admin yaratilmoqda...")
        admin = User(
            phone="+998901234567",
            name="Tizim Administratori",
            role=UserRole.ADMIN,
            is_active=True
        )
        db.add(admin)
        
        # Create Dispatchers
        print("2️⃣  Dispetcherlar yaratilmoqda...")
        dispatcher1 = User(
            phone="+998902345678",
            name="Dispetcher 1",
            role=UserRole.DISPATCHER,
            is_active=True
        )
        dispatcher2 = User(
            phone="+998903345678",
            name="Dispetcher 2",
            role=UserRole.DISPATCHER,
            is_active=True
        )
        db.add_all([dispatcher1, dispatcher2])
        
        # Create Drivers
        print("3️⃣  Haydovchilar yaratilmoqda...")
        drivers = []
        for i in range(1, 6):
            driver = User(
                phone=f"+99890234567{i}",
                name=f"Haydovchi {i}",
                role=UserRole.DRIVER,
                is_active=True
            )
            drivers.append(driver)
            db.add(driver)
        
        # Create Customers
        print("4️⃣  Mijozlar yaratilmoqda...")
        customers = []
        for i in range(1, 4):
            customer = User(
                phone=f"+99890345678{i}",
                name=f"Mijoz {i}",
                role=UserRole.CUSTOMER,
                is_active=True
            )
            customers.append(customer)
            db.add(customer)
        
        db.commit()
        
        # Create sample orders
        print("5️⃣  Namuna buyurtmalar yaratilmoqda...")
        
        for i, customer in enumerate(customers):
            order = Order(
                customer_id=customer.id,
                driver_id=drivers[i].id if i < len(drivers) else None,
                dispatcher_id=dispatcher1.id,
                pickup_location="Mirza Ulugbek ko'chasi, Tashkent",
                destination_location="Cho'lpon-Arbada" if i % 2 == 0 else "Fergona ko'chasi",
                pickup_latitude=41.2995 + (i * 0.01),
                pickup_longitude=69.2401 + (i * 0.01),
                passengers_count=1 + (i % 4),
                order_time=datetime.utcnow(),
                order_type="now",
                customer_phone=customer.phone,
                customer_comment="Iltimos, shoshiling" if i % 2 == 0 else "Avtomobildagi suv berol",
                status=OrderStatus.COMPLETED if i == 0 else (OrderStatus.STARTED if i == 1 else OrderStatus.PENDING),
                final_price=50000 if i == 0 else None
            )
            db.add(order)
        
        # Add driver locations
        print("6️⃣  Haydovchi joylashuvi yangilanimoqda...")
        for i, driver in enumerate(drivers):
            location = DriverLocation(
                driver_id=driver.id,
                latitude=41.2995 + (i * 0.02),
                longitude=69.2401 + (i * 0.02),
                is_available=True
            )
            db.add(location)
        
        db.commit()
        
        print("\n✅ Tizim muvaffaqiyatli o'rnatildi!\n")
        print("📋 TEST HISOBLARI:\n")
        print("👤 ADMIN")
        print("   Telefon: +998901234567")
        print("   Parol: Yo'q (Telefon orqali kirish)\n")
        print("📞 DISPETCHER")
        print("   Telefon: +998902345678\n")
        print("👨‍✈️  HAYDOVCHI")
        print("   Telefon: +998902345671\n")
        print("🚀 Quyidagi komandalardi ishga tushuring:\n")
        print("   1. python app.py              # Web serverni ishga tushirish")
        print("   2. python admin_panel.py      # Admin paneli")
        print("   3. python dispatcher_panel.py # Dispetcher paneli")
        print()
    
    except Exception as e:
        print(f"❌ Xato: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == '__main__':
    init_system()
