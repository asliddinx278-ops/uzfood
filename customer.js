// Customer JavaScript - API Communication
const API_BASE = 'http://localhost:5000/api';
let currentUser = null;
let authToken = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    const stored = localStorage.getItem('authToken');
    if (stored) {
        authToken = stored;
        loadUserData();
        showMainSection();
    } else {
        showLoginSection();
    }
});

function showLoginSection() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('mainSection').style.display = 'none';
}

function showMainSection() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('mainSection').style.display = 'block';
}

function showTab(tabName) {
    // Hide all tabs
    document.getElementById('orderTab').style.display = 'none';
    document.getElementById('activeTab').style.display = 'none';
    document.getElementById('historyTab').style.display = 'none';
    
    // Remove active class
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    if (tabName === 'order') {
        document.getElementById('orderTab').style.display = 'block';
        document.querySelectorAll('.tab-button')[0].classList.add('active');
    } else if (tabName === 'active') {
        document.getElementById('activeTab').style.display = 'block';
        document.querySelectorAll('.tab-button')[1].classList.add('active');
        loadActiveOrders();
    } else if (tabName === 'history') {
        document.getElementById('historyTab').style.display = 'block';
        document.querySelectorAll('.tab-button')[2].classList.add('active');
        loadOrderHistory();
    }
}

async function login() {
    const phone = document.getElementById('loginPhone').value;
    
    if (!phone) {
        alert('Telefon raqamini kiriting!');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.access_token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('user', JSON.stringify(currentUser));
            showMainSection();
        } else {
            alert('Xato: ' + (data.error || 'Kirish amalga oshmadi'));
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Xato: Serverga ulanib bo\'lmadi');
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    showLoginSection();
    document.getElementById('loginPhone').value = '';
}

async function createOrder() {
    const pickupLocation = document.getElementById('pickupLocation').value;
    const destination = document.getElementById('destination').value;
    const passengers = document.getElementById('passengers').value;
    const orderType = document.getElementById('orderType').value;
    const comment = document.getElementById('comment').value;
    
    if (!pickupLocation) {
        alert('Joylashuvi kiriting!');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                pickup_location: pickupLocation,
                destination_location: destination,
                passengers_count: parseInt(passengers),
                order_type: orderType,
                comment: comment
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('✅ Buyurtma muvaffaqiyatli qabul qilindi!\nBuyurtma ID: ' + data.order.id);
            clearForm();
            showTab('active');
        } else {
            alert('❌ Xato: ' + (data.error || 'Buyurtma qabul qilinmadi'));
        }
    } catch (error) {
        console.error('Order creation error:', error);
        alert('❌ Xato: Serverga ulanib bo\'lmadi');
    }
}

async function loadActiveOrders() {
    try {
        const response = await fetch(`${API_BASE}/orders`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const orders = await response.json();
        const activeDiv = document.getElementById('activeOrders');
        
        const activeOrders = orders.filter(o => 
            !['completed', 'cancelled'].includes(o.status)
        );
        
        if (activeOrders.length === 0) {
            activeDiv.innerHTML = '<p style="text-align: center; color: #999;">Faol buyurtma yo\'q</p>';
            return;
        }
        
        let html = '';
        activeOrders.forEach(order => {
            const statusText = {
                'pending': '⏳ Kutilayotgan',
                'assigned': '👨‍✈️ Tayinlangan',
                'accepted': '✔️ Qabul qilgan',
                'started': '🚗 Boshlangan'
            }[order.status] || order.status;
            
            html += `
                <div class="order-card">
                    <h3>Buyurtma #${order.id.substring(0, 8)}</h3>
                    <div class="order-info">
                        <div>📍 ${order.pickup_location}</div>
                        <div><span class="status-badge status-${order.status}">${statusText}</span></div>
                        <div>👥 ${order.passengers_count} kishi</div>
                        <div>⏰ ${new Date(order.created_at).toLocaleTimeString('uz-UZ')}</div>
                    </div>
                </div>
            `;
        });
        
        activeDiv.innerHTML = html;
    } catch (error) {
        console.error('Load active orders error:', error);
    }
}

async function loadOrderHistory() {
    try {
        const response = await fetch(`${API_BASE}/orders`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const orders = await response.json();
        const historyDiv = document.getElementById('orderHistory');
        
        if (orders.length === 0) {
            historyDiv.innerHTML = '<p style="text-align: center; color: #999;">Buyurtma yo\'q</p>';
            return;
        }
        
        let html = '';
        orders.forEach(order => {
            const statusText = {
                'pending': '⏳ Kutilayotgan',
                'assigned': '👨‍✈️ Tayinlangan',
                'accepted': '✔️ Qabul qilgan',
                'started': '🚗 Boshlangan',
                'completed': '✅ Tugatilgan',
                'cancelled': '❌ Bekor'
            }[order.status] || order.status;
            
            html += `
                <div class="order-card">
                    <h3>Buyurtma #${order.id.substring(0, 8)}</h3>
                    <div class="order-info">
                        <div>📍 ${order.pickup_location}</div>
                        <div><span class="status-badge status-${order.status}">${statusText}</span></div>
                        <div>👥 ${order.passengers_count} kishi</div>
                        <div>📅 ${new Date(order.created_at).toLocaleDateString('uz-UZ')}</div>
                    </div>
                </div>
            `;
        });
        
        historyDiv.innerHTML = html;
    } catch (error) {
        console.error('Load history error:', error);
    }
}

function clearForm() {
    document.getElementById('pickupLocation').value = '';
    document.getElementById('destination').value = '';
    document.getElementById('passengers').value = '1';
    document.getElementById('orderType').value = 'now';
    document.getElementById('comment').value = '';
}

async function loadUserData() {
    const stored = localStorage.getItem('user');
    if (stored) {
        currentUser = JSON.parse(stored);
    }
}
