// Driver JavaScript - API Communication
const API_BASE = 'http://localhost:5000/api';
let currentDriver = null;
let authToken = null;
let isAvailable = true;

document.addEventListener('DOMContentLoaded', function() {
    const stored = localStorage.getItem('driverToken');
    if (stored) {
        authToken = stored;
        currentDriver = JSON.parse(localStorage.getItem('driver'));
        loadData();
        setInterval(loadData, 5000); // Refresh every 5 seconds
    } else {
        window.location.href = 'driver-login.html';
    }
});

async function loadData() {
    loadAvailableOrders();
    loadMyOrders();
    loadStatistics();
    updateLocation();
}

async function loadAvailableOrders() {
    try {
        const response = await fetch(`${API_BASE}/driver/available-orders`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const orders = await response.json();
        const container = document.getElementById('availableOrders');
        
        if (!Array.isArray(orders) || orders.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999;">Buyurtma yo\'q</p>';
            return;
        }
        
        let html = '';
        orders.forEach(order => {
            html += `
                <div class="order-item">
                    <div class="order-header">
                        <span class="order-id">#${order.id.substring(0, 8)}</span>
                        <span style="color: #f5576c; font-weight: 600;">👥 ${order.passengers_count}</span>
                    </div>
                    <div class="location-card">
                        <h4>📍 Qayerdan:</h4>
                        <p>${order.pickup_location}</p>
                    </div>
                    ${order.destination_location ? `
                        <div class="location-card">
                            <h4>📍 Qayerga:</h4>
                            <p>${order.destination_location}</p>
                        </div>
                    ` : ''}
                    <div class="info-box">
                        <strong>📞 Mijoz:</strong>
                        ${order.customer_phone}
                    </div>
                    ${order.customer_comment ? `
                        <div class="info-box">
                            <strong>💬 Izohlar:</strong>
                            ${order.customer_comment}
                        </div>
                    ` : ''}
                    <div class="button-group">
                        <button class="btn-accept" onclick="acceptOrder('${order.id}')">
                            ✓ Qabul Qilish
                        </button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading available orders:', error);
    }
}

async function loadMyOrders() {
    try {
        // Get driver's accepted orders
        const response = await fetch(`${API_BASE}/orders`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const orders = await response.json();
        const myOrders = orders.filter(o => 
            !['completed', 'cancelled'].includes(o.status)
        );
        
        const container = document.getElementById('myOrders');
        
        if (myOrders.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999;">Faol buyurtma yo\'q</p>';
            return;
        }
        
        let html = '';
        myOrders.forEach(order => {
            const actions = order.status === 'accepted' 
                ? `<button class="btn-start" onclick="startOrder('${order.id}')">🚗 Boshlash</button>`
                : order.status === 'started'
                ? `<button class="btn-complete" onclick="completeOrder('${order.id}')">✅ Tugatish</button>`
                : '';
            
            html += `
                <div class="order-item">
                    <div class="order-header">
                        <span class="order-id">#${order.id.substring(0, 8)}</span>
                        <span style="color: #17a2b8; font-weight: 600;">
                            ${order.status === 'started' ? '🚗 Yo\'lda' : '✔️ Qabul'}
                        </span>
                    </div>
                    <div class="location-card">
                        <h4>📍 Qayerdan:</h4>
                        <p>${order.pickup_location}</p>
                    </div>
                    <div class="info-box">
                        <strong>📞 Mijoz:</strong>
                        ${order.customer_phone}
                    </div>
                    <div class="button-group">
                        ${actions}
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading my orders:', error);
    }
}

async function acceptOrder(orderId) {
    if (!confirm('Buyurtmani qabul qilasizmi?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/driver/accept-order/${orderId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            alert('✅ Buyurtma qabul qilindi!');
            loadData();
        } else {
            alert('❌ Xato yuz berdi');
        }
    } catch (error) {
        console.error('Error accepting order:', error);
        alert('❌ Xato: ' + error.message);
    }
}

async function startOrder(orderId) {
    if (!confirm('Yo\'lni boshlaysizmi?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/driver/start-order/${orderId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            alert('✅ Yo\'l boshlandi!');
            loadData();
        } else {
            alert('❌ Xato yuz berdi');
        }
    } catch (error) {
        console.error('Error starting order:', error);
        alert('❌ Xato: ' + error.message);
    }
}

async function completeOrder(orderId) {
    const price = prompt('Yakuniy narx kiriting (so\'m):');
    if (!price || isNaN(price)) return;
    
    try {
        const response = await fetch(`${API_BASE}/driver/complete-order/${orderId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ final_price: parseInt(price) })
        });
        
        if (response.ok) {
            alert('✅ Buyurtma tugatildi!');
            loadData();
        } else {
            alert('❌ Xato yuz berdi');
        }
    } catch (error) {
        console.error('Error completing order:', error);
        alert('❌ Xato: ' + error.message);
    }
}

async function loadStatistics() {
    // This would normally fetch from backend
    document.getElementById('completedCount').textContent = Math.floor(Math.random() * 50) + 10;
    document.getElementById('activeCount').textContent = Math.floor(Math.random() * 5) + 1;
    document.getElementById('totalEarnings').textContent = (Math.random() * 1000000).toLocaleString('uz-UZ');
}

async function updateLocation() {
    if (!isAvailable) return;
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                await fetch(`${API_BASE}/driver/update-location`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        is_available: isAvailable
                    })
                });
            } catch (error) {
                console.error('Location update error:', error);
            }
        });
    }
}

function toggleStatus() {
    isAvailable = !isAvailable;
    const btn = document.getElementById('statusToggle');
    if (isAvailable) {
        btn.textContent = '🟢 Faol';
        btn.classList.remove('offline');
        btn.classList.add('online');
    } else {
        btn.textContent = '🔴 Faolsiz';
        btn.classList.remove('online');
        btn.classList.add('offline');
    }
}

function logout() {
    localStorage.removeItem('driverToken');
    localStorage.removeItem('driver');
    window.location.href = 'driver-login.html';
}
