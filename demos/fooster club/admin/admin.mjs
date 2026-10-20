import {
  getLiveCatalog,
  saveLiveCatalog,
  updateProduct,
  getLiveOrders,
  updateOrderStatus,
  getLiveCategories,
  resetDemoAll,
} from '../catalog-storage.mjs';

const currency = value => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const getImgSrc = path => {
  if (!path) return null;
  if (path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://')) return path;
  return `../${encodeURI(path)}`;
};

// Estado local de la vista
let currentCategoryFilter = 'all';
let currentStatusFilter = 'all';
let searchQuery = '';
let activeTicketOrderId = null;

// Elementos del DOM: KPIs superiores
const kpiTotalProducts = document.querySelector('#kpi-total-products');
const kpiActiveBadge = document.querySelector('#kpi-active-badge');
const kpiTotalOrders = document.querySelector('#kpi-total-orders');
const kpiOutStock = document.querySelector('#kpi-out-stock');
const kpiPausedBadge = document.querySelector('#kpi-paused-badge');
const tabCountProducts = document.querySelector('#tab-count-products');
const tabCountOrders = document.querySelector('#tab-count-orders');

// Contenedores principales
const productsListContainer = document.querySelector('#products-list');
const categoryChipsContainer = document.querySelector('#category-chips');
const ordersTableBody = document.querySelector('#orders-table-body');
const categoriesGrid = document.querySelector('#categories-grid');
const searchInput = document.querySelector('#search-input');

// Toast
const toastNotice = document.querySelector('#toast-notice');
const toastMessage = document.querySelector('#toast-message');

// Modal Producto e imágenes
const modalProduct = document.querySelector('#modal-product');
const formProduct = document.querySelector('#form-product');
const modalProductTitle = document.querySelector('#modal-product-title');
const prodFileInput = document.querySelector('#prod-file-input');
const prodImageUrlInput = document.querySelector('#prod-image-url');
const prodPreviewThumb = document.querySelector('#prod-preview-thumb');
const btnRemoveImage = document.querySelector('#btn-remove-image');

// Modal Ticket Comanda
const modalOrderDetail = document.querySelector('#modal-order-detail');
const ticketOrderId = document.querySelector('#ticket-order-id');
const ticketCustomerName = document.querySelector('#ticket-customer-name');
const ticketCustomerPhone = document.querySelector('#ticket-customer-phone');
const ticketDeliveryMode = document.querySelector('#ticket-delivery-mode');
const ticketPaymentMethod = document.querySelector('#ticket-payment-method');
const ticketAddress = document.querySelector('#ticket-address');
const ticketItemsBody = document.querySelector('#ticket-items-body');
const ticketSubtotalVal = document.querySelector('#ticket-subtotal-val');
const ticketTotalVal = document.querySelector('#ticket-total-val');
const ticketNotesBox = document.querySelector('#ticket-notes-box');
const ticketNotesText = document.querySelector('#ticket-notes-text');
const btnTicketToggleStatus = document.querySelector('#btn-ticket-toggle-status');
const btnTicketPrint = document.querySelector('#btn-ticket-print');

// Modal Reset
const modalConfirmReset = document.querySelector('#modal-confirm-reset');

// Elementos de pantalla de ingresos
const revTotalIncome = document.querySelector('#rev-total-income');
const revTotalOrdersSub = document.querySelector('#rev-total-orders-sub');
const revAvgTicket = document.querySelector('#rev-avg-ticket');
const revItemsSold = document.querySelector('#rev-items-sold');
const revSuccessRate = document.querySelector('#rev-success-rate');
const hourlyChartBars = document.querySelector('#hourly-chart-bars');
const topSellersList = document.querySelector('#top-sellers-list');
const revChannelDelivery = document.querySelector('#rev-channel-delivery');
const revChannelTakeaway = document.querySelector('#rev-channel-takeaway');

let toastTimeout = null;
function showToast(message) {
  if (toastTimeout) clearTimeout(toastTimeout);
  toastMessage.textContent = message;
  toastNotice.classList.add('show');
  toastTimeout = setTimeout(() => {
    toastNotice.classList.remove('show');
  }, 3200);
}

// 1. Renderizar KPIs y contadores
function renderKPIs() {
  const products = getLiveCatalog();
  const orders = getLiveOrders();

  const total = products.length;
  const outOfStock = products.filter(p => p.available === false).length;
  const active = total - outOfStock;

  if (kpiTotalProducts) kpiTotalProducts.innerHTML = `${total}<span class="dot">.</span>`;
  if (kpiActiveBadge) kpiActiveBadge.textContent = `${active} Activos`;
  if (kpiTotalOrders) kpiTotalOrders.innerHTML = `${orders.length}<span class="dot">.</span>`;
  if (kpiOutStock) kpiOutStock.innerHTML = `${outOfStock}<span class="dot">.</span>`;
  if (kpiPausedBadge) kpiPausedBadge.textContent = `${outOfStock} Pausados`;

  if (tabCountProducts) tabCountProducts.textContent = total;
  if (tabCountOrders) tabCountOrders.textContent = orders.length;
}

// 2. Renderizar Chips de Categorías
function renderCategoryChips() {
  const categories = getLiveCategories();
  if (!categoryChipsContainer) return;

  categoryChipsContainer.innerHTML = `
    <button type="button" class="filter-chip ${currentCategoryFilter === 'all' ? 'active' : ''}" data-cat="all">
      Todas (${getLiveCatalog().length})
    </button>
  ` + categories.map(cat => {
    const count = getLiveCatalog().filter(p => p.category === cat.id).length;
    return `
      <button type="button" class="filter-chip ${currentCategoryFilter === cat.id ? 'active' : ''}" data-cat="${cat.id}">
        ${escapeHtml(cat.name)} (${count})
      </button>
    `;
  }).join('');

  categoryChipsContainer.querySelectorAll('[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentCategoryFilter = btn.dataset.cat;
      renderCategoryChips();
      renderProductsList();
    });
  });

  // Poblar select del modal también
  const prodCategorySelect = document.querySelector('#prod-category');
  if (prodCategorySelect) {
    prodCategorySelect.innerHTML = categories.map(cat => `
      <option value="${cat.id}">${escapeHtml(cat.name)}</option>
    `).join('');
  }
}

// 3. Renderizar Lista de Productos
function renderProductsList() {
  const products = getLiveCatalog();
  const categories = getLiveCategories();

  // Filtrado
  const filtered = products.filter(p => {
    if (currentCategoryFilter !== 'all' && p.category !== currentCategoryFilter) return false;
    
    if (currentStatusFilter === 'available' && p.available === false) return false;
    if (currentStatusFilter === 'out' && p.available !== false) return false;
    if (currentStatusFilter === 'featured' && !p.featured) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = (p.name || '').toLowerCase().includes(q);
      const matchDesc = (p.description || '').toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }

    return true;
  });

  if (!productsListContainer) return;

  if (!filtered.length) {
    productsListContainer.innerHTML = `
      <div style="text-align: center; padding: 48px 20px; background: var(--cream); border: 1px dashed var(--line); border-radius: 16px;">
        <p style="font-size: 1.1rem; color: var(--muted); margin-bottom: 8px;">No se encontraron platos con esos filtros.</p>
        <button type="button" class="pill pill-light pill-sm" id="btn-clear-filters" style="border: 1px solid var(--line); color: var(--burgundy);">Limpiar filtros</button>
      </div>
    `;
    productsListContainer.querySelector('#btn-clear-filters')?.addEventListener('click', () => {
      currentCategoryFilter = 'all';
      currentStatusFilter = 'all';
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      document.querySelectorAll('[data-status-filter]').forEach(b => b.classList.toggle('active', b.dataset.statusFilter === 'all'));
      renderCategoryChips();
      renderProductsList();
    });
    return;
  }

  productsListContainer.innerHTML = filtered.map(p => {
    const isAvailable = p.available !== false;
    const catName = categories.find(c => c.id === p.category)?.name || p.category;
    const priceDisplay = currency(p.demoPriceArs || 0);
    const imgSrc = getImgSrc(p.imageUrl);

    return `
      <article class="product-row ${!isAvailable ? 'is-out' : ''}" data-id="${p.id}">
        <!-- Miniatura -->
        <div class="product-thumb">
          ${imgSrc ? `<img src="${imgSrc}" alt="${escapeHtml(p.name)}" loading="lazy">` : `<span class="thumb-mark">f.</span>`}
        </div>

        <!-- Detalles -->
        <div class="product-details">
          <div class="product-meta-tags">
            <span class="cat-pill">${escapeHtml(catName)}</span>
            ${p.featured ? `<span class="featured-pill"><svg class="admin-inline-icon" aria-hidden="true"><use href="#admin-star"/></svg>Destacado</span>` : ''}
          </div>
          <h2 class="product-name">${escapeHtml(p.name)}</h2>
          <p class="product-desc">${escapeHtml(p.description || 'Sin descripción ingresada.')}</p>
        </div>

        <!-- Precio con edición rápida -->
        <div class="product-price-col">
          <span class="price-label-small">Precio Carta</span>
          <button type="button" class="price-clickable" data-quick-price="${p.id}" title="Clic para editar precio rápidamente">
            ${priceDisplay}
            <svg class="edit-icon-tiny admin-inline-icon" aria-hidden="true"><use href="#admin-pencil"/></svg>
          </button>
        </div>

        <!-- Switch Disponibilidad -->
        <div class="product-status-col">
          <label class="switch-wrapper" title="${isAvailable ? 'Disponible' : 'Agotado'}">
            <input type="checkbox" class="switch-input" data-toggle-available="${p.id}" ${isAvailable ? 'checked' : ''}>
            <span class="switch-track">
              <span class="switch-thumb"></span>
            </span>
          </label>
          <span class="status-text-badge ${isAvailable ? 'is-available' : 'is-out'}">
            ${isAvailable ? '● Disponible' : '✕︎ Agotado'}
          </span>
        </div>

        <!-- Acciones -->
        <div class="product-actions-col">
          <button type="button" class="pill pill-light pill-sm" style="border: 1px solid var(--line); color: var(--burgundy);" data-edit-prod="${p.id}">
            Editar plato
          </button>
        </div>
      </article>
    `;
  }).join('');

  // Event Listeners en la lista
  // A. Toggle switch de disponibilidad
  productsListContainer.querySelectorAll('[data-toggle-available]').forEach(input => {
    input.addEventListener('change', () => {
      const id = input.dataset.toggleAvailable;
      const willBeAvailable = input.checked;
      const updated = updateProduct(id, { available: willBeAvailable });
      renderKPIs();
      renderProductsList();
      showToast(`${updated.name}: ${willBeAvailable ? 'Activado como Disponible' : 'Marcado como Agotado'} · Reflejado en la carta`);
    });
  });

  // B. Edición rápida de precio
  productsListContainer.querySelectorAll('[data-quick-price]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.quickPrice;
      const current = getLiveCatalog().find(p => p.id === id);
      if (!current) return;

      const inputVal = window.prompt(`Modificar precio para "${current.name}" (actual: $${current.demoPriceArs}):`, current.demoPriceArs);
      if (inputVal === null) return;

      const numVal = parseInt(inputVal.replace(/[^\d]/g, ''), 10);
      if (isNaN(numVal) || numVal < 0) {
        alert('Por favor ingresá un precio válido mayor o igual a 0.');
        return;
      }

      updateProduct(id, { demoPriceArs: numVal });
      renderProductsList();
      showToast(`${current.name}: Precio modificado a ${currency(numVal)} · Guardado y sincronizado con la carta`);
    });
  });

  // C. Abrir modal completo de edición
  productsListContainer.querySelectorAll('[data-edit-prod]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.editProd;
      const current = getLiveCatalog().find(p => p.id === id);
      if (!current) return;
      openProductModal(current);
    });
  });
}

// 4. Renderizar Pedidos Demo con Comanda y Alto Contraste
function renderOrdersTable() {
  const orders = getLiveOrders();
  if (!ordersTableBody) return;

  if (!orders.length) {
    ordersTableBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; color: var(--muted); padding: 32px;">
          No hay pedidos registrados todavía.
        </td>
      </tr>
    `;
    return;
  }

  ordersTableBody.innerHTML = orders.map(order => {
    const isPending = order.status === 'Pendiente';
    return `
      <tr class="order-row-clickable" data-open-ticket="${order.id}">
        <td><span class="order-id-badge">${escapeHtml(order.id)}</span></td>
        <td><strong>${escapeHtml(order.customer)}</strong></td>
        <td style="color: var(--muted); font-size: 0.8rem;">${escapeHtml(order.timestamp)}</td>
        <td class="order-items-cell">${escapeHtml(order.items)}</td>
        <td><strong class="mono" style="color: var(--orange); font-size: 0.95rem;">${currency(order.total)}</strong></td>
        <td><span style="font-size: 0.74rem; color: var(--burgundy); font-weight: 700; text-transform: uppercase;">${escapeHtml(order.mode || 'Delivery')}</span></td>
        <td>
          <button type="button" class="order-status-pill ${isPending ? 'pendiente' : 'confirmado'}" data-toggle-order="${order.id}" title="Clic para alternar estado">
            ${isPending ? 'Pendiente' : '✓︎ Confirmado'}
          </button>
        </td>
        <td style="text-align: right;">
          <button type="button" class="order-detail-btn" data-ticket-btn="${order.id}" title="Ver ticket y comanda de cocina">
            Ticket ↗︎
          </button>
        </td>
      </tr>
    `;
  }).join('');

  // Evento para alternar estado rápido
  ordersTableBody.querySelectorAll('[data-toggle-order]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = btn.dataset.toggleOrder;
      const current = getLiveOrders().find(o => o.id === id);
      if (!current) return;
      const nextStatus = current.status === 'Pendiente' ? 'Confirmado' : 'Pendiente';
      updateOrderStatus(id, nextStatus);
      renderOrdersTable();
      renderRevenueDashboard();
      showToast(`Pedido ${id} marcado como ${nextStatus}`);
    });
  });

  // Abrir comanda al hacer clic en fila o botón
  ordersTableBody.querySelectorAll('[data-open-ticket]').forEach(row => {
    row.addEventListener('click', e => {
      if (e.target.closest('[data-toggle-order]')) return;
      const id = row.dataset.openTicket;
      openTicketModal(id);
    });
  });
}

// 5. Abrir Modal de Comanda / Ticket de Cocina
function openTicketModal(orderId) {
  const orders = getLiveOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order || !modalOrderDetail) return;

  activeTicketOrderId = order.id;

  ticketOrderId.textContent = `PEDIDO #${order.id} · FOSTER CLUB TANDIL`;
  ticketCustomerName.textContent = order.customer || 'Cliente Mostrador';
  ticketCustomerPhone.textContent = order.phone || '249 455-8912';
  ticketDeliveryMode.innerHTML = order.mode === 'Delivery'
    ? '<svg class="admin-inline-icon" aria-hidden="true"><use href="#admin-bike"/></svg>Delivery a domicilio'
    : '<svg class="admin-inline-icon" aria-hidden="true"><use href="#admin-bag"/></svg>Retiro por local (Takeaway)';
  ticketPaymentMethod.textContent = order.paymentMethod || 'Mercado Pago (QR)';
  ticketAddress.textContent = order.address || (order.mode === 'Delivery' ? 'Av. España 482, Piso 2A' : 'Mostrador Constitución 501');

  // Breakdown de productos
  const items = order.itemsList && order.itemsList.length > 0 ? order.itemsList : [
    { name: order.items || 'Selección del cliente', qty: order.itemsCount || 1, price: order.total, subtotal: order.total, note: '' }
  ];

  ticketItemsBody.innerHTML = items.map(item => `
    <tr>
      <td style="font-weight: 700; width: 40px; color: var(--burgundy);">${item.qty} ×</td>
      <td>
        <strong>${escapeHtml(item.name)}</strong>
        ${item.note ? `<span class="ticket-item-note">Nota: ${escapeHtml(item.note)}</span>` : ''}
      </td>
      <td class="mono" style="text-align: right; color: var(--muted);">${currency(item.price || (item.subtotal / item.qty))}</td>
      <td class="mono" style="text-align: right; font-weight: 700; color: var(--ink);">${currency(item.subtotal)}</td>
    </tr>
  `).join('');

  ticketSubtotalVal.textContent = currency(order.total);
  ticketTotalVal.textContent = currency(order.total);

  if (order.notes) {
    ticketNotesBox.style.display = 'block';
    ticketNotesText.textContent = order.notes;
  } else {
    ticketNotesBox.style.display = 'none';
  }

  // Estado en botón de comanda
  const isPending = order.status === 'Pendiente';
  btnTicketToggleStatus.textContent = isPending ? '✓︎ Marcar como confirmado' : 'Volver a estado pendiente';
  btnTicketToggleStatus.className = `pill ${isPending ? 'pill-orange' : 'pill-burgundy'} pill-sm`;

  modalOrderDetail.classList.add('open');
}

// Acciones dentro del Ticket
if (btnTicketToggleStatus) {
  btnTicketToggleStatus.addEventListener('click', () => {
    if (!activeTicketOrderId) return;
    const orders = getLiveOrders();
    const current = orders.find(o => o.id === activeTicketOrderId);
    if (!current) return;

    const next = current.status === 'Pendiente' ? 'Confirmado' : 'Pendiente';
    updateOrderStatus(activeTicketOrderId, next);
    closeModals();
    renderOrdersTable();
    renderRevenueDashboard();
    showToast(`Comanda #${activeTicketOrderId} actualizada a ${next}`);
  });
}

if (btnTicketPrint) {
  btnTicketPrint.addEventListener('click', () => {
    showToast('Simulando envío a impresora térmica de comandas Foster Club');
  });
}

// 6. Pantalla de Ingresos & Métricas Comerciales
function renderRevenueDashboard() {
  const orders = getLiveOrders();
  if (!revTotalIncome) return;

  const totalIncome = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const totalCount = orders.length || 1;
  const avgTicket = Math.round(totalIncome / totalCount);

  // Platos totales vendidos
  const itemsSold = orders.reduce((sum, o) => sum + (Number(o.itemsCount) || 2), 0);
  const confirmedCount = orders.filter(o => o.status === 'Confirmado').length;
  const successRate = Math.round((confirmedCount / totalCount) * 100);

  revTotalIncome.textContent = currency(totalIncome);
  revTotalOrdersSub.textContent = `En ${orders.length} pedidos registrados hoy`;
  revAvgTicket.textContent = currency(avgTicket);
  revItemsSold.textContent = `${itemsSold} un.`;
  revSuccessRate.textContent = `${successRate}%`;

  // Distribución Horaria
  if (hourlyChartBars) {
    const hourlyData = [
      { label: 'Almuerzo (11:30 - 15h)', amount: Math.round(totalIncome * 0.28), orders: 5, pct: 28 },
      { label: 'Merienda (15:00 - 19h)', amount: Math.round(totalIncome * 0.16), orders: 3, pct: 16 },
      { label: 'Cena / Noche (19:30 - 24h)', amount: Math.round(totalIncome * 0.56), orders: 10, pct: 56 },
    ];

    hourlyChartBars.innerHTML = hourlyData.map(h => `
      <div class="hourly-bar-row">
        <span class="hourly-bar-label">${h.label}</span>
        <div class="hourly-bar-track">
          <div class="hourly-bar-fill" style="width: ${h.pct}%;">
            ${h.pct}% · ${h.orders} pedidos
          </div>
        </div>
        <span class="hourly-bar-val">${currency(h.amount)}</span>
      </div>
    `).join('');
  }

  // Ranking Top 5 Platos
  if (topSellersList) {
    const topDishes = [
      { name: 'Da Bacon Burger', sold: 11, revenue: 163900, pct: 100 },
      { name: 'Underground Burger', sold: 9, revenue: 130500, pct: 82 },
      { name: 'Cheese Burger', sold: 7, revenue: 87500, pct: 64 },
      { name: 'Papas Foster con Trufa', sold: 6, revenue: 53400, pct: 55 },
      { name: 'Oreo Milkshake', sold: 4, revenue: 35600, pct: 36 },
    ];

    topSellersList.innerHTML = topDishes.map((dish, i) => `
      <div class="ranking-item">
        <div class="ranking-info-row">
          <span class="ranking-name">
            <span class="ranking-badge-pos">${i + 1}</span>
            ${dish.name}
          </span>
          <span class="mono" style="font-weight: 700; color: var(--orange);">
            ${dish.sold} un. · ${currency(dish.revenue)}
          </span>
        </div>
        <div class="ranking-bar-track">
          <div class="ranking-bar-fill" style="width: ${dish.pct}%;"></div>
        </div>
      </div>
    `).join('');
  }

  // Canales
  const deliveryOrders = orders.filter(o => (o.mode || '').toLowerCase().includes('delivery')).length;
  const deliveryPct = Math.round((deliveryOrders / totalCount) * 100);
  if (revChannelDelivery) revChannelDelivery.textContent = `${deliveryPct}%`;
  if (revChannelTakeaway) revChannelTakeaway.textContent = `${100 - deliveryPct}%`;
}

document.querySelector('#btn-print-report')?.addEventListener('click', () => {
  showToast('Simulación: Reporte diario de ventas generado y listo para enviar');
});

// 7. Renderizar Grid de Categorías
function renderCategoriesGrid() {
  const categories = getLiveCategories();
  const products = getLiveCatalog();
  if (!categoriesGrid) return;

  categoriesGrid.innerHTML = categories.map(cat => {
    const items = products.filter(p => p.category === cat.id);
    const activeItems = items.filter(p => p.available !== false).length;

    return `
      <div style="background: var(--cream); border: 1px solid var(--line); border-radius: 18px; padding: 22px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
          <h3 style="font-size: 1.25rem; color: var(--burgundy);">${escapeHtml(cat.name)}</h3>
          <span class="mono" style="font-size: 0.72rem; color: var(--orange); font-weight: 700;">${items.length} PLATOS</span>
        </div>
        <p style="font-size: 0.84rem; color: var(--muted); margin-bottom: 16px;">${escapeHtml(cat.intro || 'Categoría de carta Foster Club.')}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--line); padding-top: 14px;">
          <span style="font-size: 0.78rem; color: #15803d; font-weight: 700;">● ${activeItems} disponibles</span>
          <button type="button" class="pill pill-light pill-sm" style="border: 1px solid var(--line); color: var(--burgundy);" data-filter-by-cat="${cat.id}">
            Ver platos →︎
          </button>
        </div>
      </div>
    `;
  }).join('');

  categoriesGrid.querySelectorAll('[data-filter-by-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentCategoryFilter = btn.dataset.filterByCat;
      switchTab('tab-products');
      renderCategoryChips();
      renderProductsList();
    });
  });
}

// 8. Manejo de Pestañas
function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.style.display = panel.id === tabId ? 'block' : 'none';
  });
  if (tabId === 'tab-revenue') {
    renderRevenueDashboard();
  }
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// 9. Filtros rápidos de estado
document.querySelectorAll('[data-status-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-status-filter]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentStatusFilter = btn.dataset.statusFilter;
    renderProductsList();
  });
});

// 10. Buscador en tiempo real
if (searchInput) {
  searchInput.addEventListener('input', e => {
    searchQuery = e.target.value;
    renderProductsList();
  });
}

// 11. Modal de Producto & Gestión de Imágenes
function updateProductImagePreview(url) {
  if (prodImageUrlInput) prodImageUrlInput.value = url || '';
  if (!prodPreviewThumb) return;

  const imgSrc = getImgSrc(url);
  if (imgSrc) {
    prodPreviewThumb.innerHTML = `<img src="${imgSrc}" alt="Previsualización">`;
  } else {
    prodPreviewThumb.innerHTML = '<span class="thumb-mark">f.</span>';
  }

  // Marcar chip activo si coincide con preset
  document.querySelectorAll('.preset-chip-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.preset === url);
  });
}

// Subida de imagen desde equipo local (FileReader a base64)
if (prodFileInput) {
  prodFileInput.addEventListener('change', e => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor seleccioná un archivo de imagen válido (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = evt => {
      const base64 = evt.target.result;
      updateProductImagePreview(base64);
      showToast('✓︎ Imagen cargada con éxito');
    };
    reader.readAsDataURL(file);
  });
}

// Selección de fotos predefinidas
document.querySelectorAll('.preset-chip-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const preset = btn.dataset.preset;
    updateProductImagePreview(preset);
  });
});

// Quitar imagen
if (btnRemoveImage) {
  btnRemoveImage.addEventListener('click', () => {
    if (prodFileInput) prodFileInput.value = '';
    updateProductImagePreview('');
    showToast('Imagen quitada. Se usará el monograma Foster.');
  });
}

function openProductModal(prod = null) {
  if (!modalProduct || !formProduct) return;

  if (prod) {
    modalProductTitle.textContent = `Editar: ${prod.name}`;
    formProduct.elements.id.value = prod.id;
    formProduct.elements.name.value = prod.name || '';
    formProduct.elements.category.value = prod.category || 'burgers';
    formProduct.elements.demoPriceArs.value = prod.demoPriceArs || 0;
    formProduct.elements.description.value = prod.description || '';
    formProduct.elements.available.checked = prod.available !== false;
    formProduct.elements.featured.checked = Boolean(prod.featured);
    updateProductImagePreview(prod.imageUrl || '');
  } else {
    modalProductTitle.textContent = 'Crear nuevo plato demo';
    formProduct.reset();
    formProduct.elements.id.value = '';
    formProduct.elements.category.value = currentCategoryFilter !== 'all' ? currentCategoryFilter : 'burgers';
    formProduct.elements.available.checked = true;
    formProduct.elements.featured.checked = false;
    updateProductImagePreview('');
  }

  modalProduct.classList.add('open');
}

function closeModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
  activeTicketOrderId = null;
}

document.querySelectorAll('[data-close-modal]').forEach(b => b.addEventListener('click', closeModals));
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModals();
  });
});

// Botón Nuevo Plato
document.querySelector('#btn-add-product')?.addEventListener('click', () => openProductModal(null));

// Guardar formulario de producto
if (formProduct) {
  formProduct.addEventListener('submit', e => {
    e.preventDefault();
    const id = formProduct.elements.id.value;
    const name = formProduct.elements.name.value.trim();
    const category = formProduct.elements.category.value;
    const price = parseInt(formProduct.elements.demoPriceArs.value, 10) || 0;
    const description = formProduct.elements.description.value.trim();
    const available = formProduct.elements.available.checked;
    const featured = formProduct.elements.featured.checked;
    const imageUrl = formProduct.elements.imageUrl.value.trim() || null;

    if (!name) return;

    if (id) {
      updateProduct(id, { name, category, demoPriceArs: price, description, available, featured, imageUrl });
      showToast(`Plato "${name}" actualizado con éxito · Sincronizado en la carta`);
    } else {
      const products = getLiveCatalog();
      const newId = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') + '-' + Date.now().toString().slice(-4);
      const newProduct = {
        id: newId,
        name,
        category,
        description,
        demoPriceArs: price,
        priceArs: null,
        available,
        featured,
        imageUrl,
        modifiers: [],
        verified: true,
        orderingEnabled: true,
      };
      products.unshift(newProduct);
      saveLiveCatalog(products);
      showToast(`Nuevo plato "${name}" creado · Ya aparece en la carta pública`);
    }

    closeModals();
    renderKPIs();
    renderProductsList();
    renderCategoryChips();
  });
}

// 12. Restablecer Demo
document.querySelector('#btn-reset-demo')?.addEventListener('click', () => {
  modalConfirmReset?.classList.add('open');
});

document.querySelector('#btn-execute-reset')?.addEventListener('click', () => {
  resetDemoAll();
  closeModals();
  renderAll();
  showToast('✓︎ Demo restablecida con éxito a sus valores originales');
});

// 13. Sincronización en tiempo real
function renderAll() {
  renderKPIs();
  renderCategoryChips();
  renderProductsList();
  renderOrdersTable();
  renderRevenueDashboard();
  renderCategoriesGrid();
}

window.addEventListener('storage', event => {
  if (event.key === 'foster_demo_products_v1' || event.key === 'foster_demo_orders_v1') {
    renderAll();
    showToast('Actualización recibida desde otra pestaña en vivo');
  }
});

window.addEventListener('foster-orders-updated', () => {
  renderKPIs();
  renderOrdersTable();
  renderRevenueDashboard();
});

window.addEventListener('foster-catalog-updated', () => {
  renderKPIs();
  renderProductsList();
});

// Inicialización
renderAll();
