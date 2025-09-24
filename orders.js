export function renderOrders() {
  const list = document.getElementById('ordersList');
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  if (!orders.length) {
    list.innerHTML = '<p class="empty">Buyurtmalar yo‘q.</p>';
    return;
  }
  list.innerHTML = orders.map(o => `
    <div class="order-card">
      <div class="top">
        <span><b>#${o.id.slice(-6)}</b></span>
        <span class="status ${o.status}">${o.status}</span>
      </div>
      <div class="items">${o.items.map(it => `${it.name} x${it.q}`).join(', ')}</div>
      <div class="sum">${o.total.toLocaleString()} so‘m</div>
      <div>📍 <a href="https://www.google.com/maps?q=${o.lat},${o.lon}" target="_blank">Xaritada ko‘rish</a></div>
    </div>`).join('');
}
