// Admin Dashboard JavaScript
const API_BASE = 'http://localhost:5000/api';
let authToken = null;
let currentAdmin = null;

document.addEventListener('DOMContentLoaded', function() {
    const stored = localStorage.getItem('adminToken');
    if (stored) {
        authToken = stored;
        currentAdmin = JSON.parse(localStorage.getItem('admin'));
        loadDashboard();
    } else {
        window.location.href = 'admin-login.html';
    }
});

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from menu
    document.querySelectorAll('.menu-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    event.target.classList.add('active');
    
    // Load data based on section
    if (sectionId === 'users') loadUsers();
    else if (sectionId === 'drivers') loadDrivers();
    else if (sectionId === 'dispatchers') loadDispatchers();
    else if (sectionId === 'orders') loadOrders();
    else if (sectionId === 'statistics') loadStatistics();
}

async function loadDashboard() {
    try {
        const response = await fetch(`${API_BASE}/admin/dashboard`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        document.getElementById('totalCustomers').textContent = data.total_customers;
        document.getElementById('totalDrivers').textContent = data.total_drivers;
        document.getElementById('totalOrders').textContent = data.total_orders;
        document.getElementById('completedOrders').textContent = data.completed_orders;
    } catch (error) {
        console.error('Dashboard load error:', error);
    }
}

async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE}/admin/users`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const users = await response.json();
        const tbody = document.getElementById('usersBody');
        
        let html = '';
        users.forEach(user => {
            const status = user.is_active ? 
                '<span class="badge badge-active">✅ Faol</span>' :
                '<span class="badge badge-inactive">❌ Faolsiz</span>';
            
            const roleText = {
                'customer': 'Mijoz',
                'driver': 'Haydovchi',
                'dispatcher': 'Dispatcher',
                'admin': 'Admin'
            }[user.role] || user.role;
            
            html += `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.phone}</td>
                    <td><span class="badge badge-${user.role}">${roleText}</span></td>
                    <td>${status}</td>
                    <td>
                        <button class="btn-primary" onclick="toggleUserStatus('${user.id}')">
                            ${user.is_active ? 'Faolsizlashtirish' : 'Faollashtirish'}
                        </button>
                    </td>
                </tr>
            `;
        });
        
        tbody.innerHTML = html;
    } catch (error) {
        console.error('Users load error:', error);
    }
}

async function loadDrivers() {
    try {
        const response = await fetch(`${API_BASE}/admin/users`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const users = await response.json();
        const drivers = users.filter(u => u.role === 'driver');
        const tbody = document.getElementById('driversBody');
        
        let html = '';
        drivers.forEach(driver => {
            const status = driver.is_active ? 
                '<span class="badge badge-active">✅ Faol</span>' :
                '<span class="badge badge-inactive">❌ Faolsiz</span>';
            
            html += `
                <tr>
                    <td>${driver.name}</td>
                    <td>${driver.phone}</td>
                    <td>${status}</td>
                    <td>
                        <button class="btn-danger" onclick="deleteUser('${driver.id}')">O'chirish</button>
                    </td>
                </tr>
            `;
        });
        
        tbody.innerHTML = html;
    } catch (error) {
        console.error('Drivers load error:', error);
    }
}

async function loadDispatchers() {
    try {
        const response = await fetch(`${API_BASE}/admin/users`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const users = await response.json();
        const dispatchers = users.filter(u => u.role === 'dispatcher');
        const tbody = document.getElementById('dispatchersBody');
        
        let html = '';
        dispatchers.forEach(dispatcher => {
            const status = dispatcher.is_active ? 
                '<span class="badge badge-active">✅ Faol</span>' :
                '<span class="badge badge-inactive">❌ Faolsiz</span>';
            
            html += `
                <tr>
                    <td>${dispatcher.name}</td>
                    <td>${dispatcher.phone}</td>
                    <td>${status}</td>
                    <td>
                        <button class="btn-danger" onclick="deleteUser('${dispatcher.id}')">O'chirish</button>
                    </td>
                </tr>
            `;
        });
        
        tbody.innerHTML = html;
    } catch (error) {
        console.error('Dispatchers load error:', error);
    }
}

async function loadOrders() {
    try {
        const response = await fetch(`${API_BASE}/admin/users`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        // Note: This would need a get-all-orders endpoint
        // For now showing placeholder
        const tbody = document.getElementById('ordersBody');
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #999;">Buyurtmalar yuklanmoqda...</td></tr>';
    } catch (error) {
        console.error('Orders load error:', error);
    }
}

async function loadStatistics() {
    try {
        const response = await fetch(`${API_BASE}/admin/dashboard`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        document.getElementById('pendingOrders').textContent = data.pending_orders;
        document.getElementById('activeOrders').textContent = data.active_orders || 0;
        document.getElementById('cancelledOrders').textContent = data.cancelled_orders || 0;
        document.getElementById('completionRate').textContent = 
            data.completion_rate ? data.completion_rate.toFixed(1) + '%' : '0%';
    } catch (error) {
        console.error('Statistics load error:', error);
    }
}

async function toggleUserStatus(userId) {
    try {
        const response = await fetch(`${API_BASE}/admin/users/${userId}/toggle-status`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            alert('✅ Status yangilandi');
            loadUsers();
        } else {
            alert('❌ Xato yuz berdi');
        }
    } catch (error) {
        console.error('Toggle status error:', error);
    }
}

async function deleteUser(userId) {
    if (!confirm('Foydalanuvchini o\'chirasizmi?')) return;
    
    try {
        // This would need a delete-user endpoint
        alert('❌ Shu funksiya hali ishlamaydi');
    } catch (error) {
        console.error('Delete user error:', error);
    }
}

function openAddDriverModal() {
    document.getElementById('modalTitle').textContent = '➕ Yangi Haydovchi Qo\'shish';
    document.getElementById('modalBody').innerHTML = `
        <div class="form-group">
            <label>Ismi</label>
            <input type="text" id="driverName" placeholder="Haydovchining ismini kiriting">
        </div>
        <div class="form-group">
            <label>Telefon</label>
            <input type="tel" id="driverPhone" placeholder="+998901234567">
        </div>
    `;
    document.getElementById('modal').classList.add('active');
}

function openAddDispatcherModal() {
    document.getElementById('modalTitle').textContent = '➕ Yangi Dispatcher Qo\'shish';
    document.getElementById('modalBody').innerHTML = `
        <div class="form-group">
            <label>Ismi</label>
            <input type="text" id="dispatcherName" placeholder="Dispatcher ismini kiriting">
        </div>
        <div class="form-group">
            <label>Telefon</label>
            <input type="tel" id="dispatcherPhone" placeholder="+998901234567">
        </div>
    `;
    document.getElementById('modal').classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

function saveModal() {
    // Implementation would go here
    alert('Saqlash funksiyasi hali ishlamaydi');
}

function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    window.location.href = 'admin-login.html';
}
