(() => {
  'use strict';
  const source = window.SUSHI_FAN_MENU;
  const key = 'sushi_fan_admin_catalog_v1';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const defaults = () => source.products.map((product, index) => ({...product, available:true, featured: index < 3, priceCents: product.priceCents || product.variants?.find(variant => variant.priceCents)?.priceCents || 0}));
  const defaultCategories = [
    {name:'Tablas', intro:'Selecciones para compartir y celebrar.'},
    {name:'Rolls', intro:'Clásicos y creaciones de autor.'},
    {name:'Nigiri & sashimi', intro:'Cortes frescos, sin vueltas.'},
    {name:'Entradas', intro:'El comienzo perfecto para la mesa.'}
  ];
  let categories = loadCategories();
  let products = load(), category = 'all', status = 'all', query = '';
  let orders = [
    {id:'SF-1024',customer:'Lucía Martínez',mode:'Delivery',address:'Juncal 689, 2A',payment:'Mercado Pago',items:'2 × Tabla Fan',total:69800,status:'Pendiente',notes:'Sin salsa picante.'},
    {id:'SF-1023',customer:'Mateo Torres',mode:'Retiro en local',address:'Juncal 689',payment:'Efectivo',items:'1 × Maki Salmón · 1 × Gyozas Doradas',total:20100,status:'Confirmado',notes:'Retira en 20 minutos.'},
    {id:'SF-1022',customer:'Sofía Benítez',mode:'Delivery',address:'Pinto 640',payment:'Mercado Pago',items:'1 × Tabla Salmón',total:22500,status:'Confirmado',notes:'Tocar timbre.'}
  ];
  let activeOrder = null;
  const $ = selector => document.querySelector(selector);
  function load() {
    const base = defaults();
    try {
      const saved = JSON.parse(localStorage.getItem(key) || 'null');
      if (!Array.isArray(saved)) return base;
      return base.map(product => ({...product, ...(saved.find(item => item.id === product.id) || {})}));
    } catch { return base; }
  }
  function save() { localStorage.setItem(key, JSON.stringify(products.map(({id, priceCents, available, featured, name, category, description, photo, pieces}) => ({id, priceCents, available, featured, name, category, description, photo, pieces})))); }
  function loadCategories() {
    try {
      const saved = JSON.parse(localStorage.getItem('sushi_fan_admin_categories_v1') || 'null');
      return Array.isArray(saved) && saved.length ? saved : defaultCategories.map(item => ({...item}));
    } catch { return defaultCategories.map(item => ({...item})); }
  }
  function saveCategories() { localStorage.setItem('sushi_fan_admin_categories_v1', JSON.stringify(categories)); }
  function toast(message) { const node = $('#toast'); node.textContent = message; node.classList.add('show'); setTimeout(() => node.classList.remove('show'), 2600); }
  function renderKpis() {
    const active = products.filter(p => p.available !== false).length;
    $('#kpiProducts').textContent = products.length; $('#kpiActive').textContent = active; $('#kpiPaused').textContent = products.length - active; $('#tabProducts').textContent = products.length;
  }
  function renderFilters() {
    const categoryNames = categories.map(item => item.name);
    $('#categoryFilters').innerHTML = `<button class="${category === 'all' ? 'active' : ''}" data-category="all">Todas (${products.length})</button>` + categoryNames.map(item => {
      const count = products.filter(p => p.category === item).length;
      return `<button class="${category === item ? 'active' : ''}" data-category="${esc(item)}">${esc(item)} (${count})</button>`;
    }).join('');
    $('#categoryFilters').querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => { category = button.dataset.category; render(); }));
  }
  function renderProducts() {
    const filtered = products.filter(product => (category === 'all' || product.category === category) && (status === 'all' || (status === 'available' ? product.available !== false : status === 'paused' ? product.available === false : product.featured === true)) && (!query || `${product.name} ${product.description}`.toLowerCase().includes(query)));
    $('#productsList').innerHTML = filtered.length ? filtered.map(product => `<article class="product-row ${product.available === false ? 'paused' : ''}" data-id="${esc(product.id)}"><div class="product-visual"><img src="../${esc(product.photo)}" alt=""><span>${product.available === false ? 'PAUSADO' : 'ACTIVO'}</span></div><div class="product-name"><span class="product-category">${esc(product.category)}${product.featured ? ' · ★ DESTACADO' : ''}</span><h3>${esc(product.name)}</h3><p>${esc(product.description || '')}</p><small>${esc(product.pieces || 'Carta demo')}</small></div><label class="price-editor"><span>$</span><input data-price value="${Math.round(product.priceCents / 100)}" inputmode="numeric" aria-label="Precio de ${esc(product.name)}"><small>ARS · por porción</small></label><button class="status-toggle ${product.available === false ? 'paused' : ''}" data-toggle><i></i>${product.available === false ? 'Pausado' : 'Disponible'}</button><div class="row-actions"><button data-edit>Editar</button><button data-save>Guardar</button></div></article>`).join('') : '<div class="orders-placeholder"><p>No se encontraron platos con estos filtros.</p></div>';
    $('#productsList').querySelectorAll('[data-toggle]').forEach(button => button.addEventListener('click', () => { const product = products.find(item => item.id === button.closest('[data-id]').dataset.id); product.available = product.available === false; save(); render(); toast(`${product.name}: ${product.available ? 'disponible' : 'pausado'}`); }));
    $('#productsList').querySelectorAll('[data-save]').forEach(button => button.addEventListener('click', () => { const row = button.closest('[data-id]'); const product = products.find(item => item.id === row.dataset.id); const value = Number(row.querySelector('[data-price]').value); if (!Number.isFinite(value) || value < 0) return toast('Ingresá un precio válido.'); product.priceCents = Math.round(value * 100); save(); render(); toast('Precio actualizado en la carta.'); }));
    $('#productsList').querySelectorAll('[data-edit]').forEach(button => button.addEventListener('click', () => openProductModal(products.find(item => item.id === button.closest('[data-id]').dataset.id))));
  }
  function renderCategories() {
    $('#categoriesList').innerHTML = categories.map((item, index) => {
      const count = products.filter(product => product.category === item.name).length;
      return `<article class="category-card"><div class="category-card-top"><span class="category-index">0${index + 1}</span><button type="button" data-remove-category="${esc(item.name)}" aria-label="Eliminar categoría">×</button></div><strong>${esc(item.name)}</strong><p>${esc(item.intro)}</p><footer><span>${count} productos</span><button type="button" data-edit-category="${esc(item.name)}">Editar descripción</button></footer></article>`;
    }).join('');
    document.querySelectorAll('[data-edit-category]').forEach(button => button.addEventListener('click', () => {
      const item = categories.find(categoryItem => categoryItem.name === button.dataset.editCategory);
      const intro = window.prompt(`Descripción para ${item.name}:`, item.intro);
      if (intro === null || !intro.trim()) return;
      item.intro = intro.trim(); saveCategories(); renderCategories(); toast('Descripción de categoría actualizada.');
    }));
    document.querySelectorAll('[data-remove-category]').forEach(button => button.addEventListener('click', () => toast('Las categorías base de la demo no se eliminan; podés editar su descripción.')));
  }
  function renderOrders() {
    document.querySelector('#panel-orders .orders-table').innerHTML = `<div class="order-row order-head"><span>ID</span><span>Cliente</span><span>Detalle</span><span>Total</span><span>Estado</span></div>` + orders.map(order => `<button class="order-row order-button" type="button" data-order="${order.id}"><span>#${order.id}</span><strong>${esc(order.customer)}</strong><span>${esc(order.items)}</span><b>$ ${order.total.toLocaleString('es-AR')}</b><em class="order-state ${order.status === 'Pendiente' ? 'pending' : 'done'}">${order.status}</em></button>`).join('');
    document.querySelectorAll('[data-order]').forEach(button => button.addEventListener('click', () => openTicket(orders.find(order => order.id === button.dataset.order))));
  }
  function render() { renderKpis(); renderFilters(); renderProducts(); renderCategories(); renderOrders(); }
  document.querySelectorAll('.tabs button').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('.tabs button,.panel').forEach(node => node.classList.remove('active')); button.classList.add('active'); $(`#panel-${button.dataset.tab}`).classList.add('active'); }));
  $('#search').addEventListener('input', event => { query = event.target.value.toLowerCase().trim(); renderProducts(); });
  document.querySelectorAll('[data-status]').forEach(button => button.addEventListener('click', () => { status = button.dataset.status; document.querySelectorAll('[data-status]').forEach(node => node.classList.toggle('active', node === button)); renderProducts(); }));
  $('#resetDemo').addEventListener('click', () => { localStorage.removeItem(key); localStorage.removeItem('sushi_fan_admin_categories_v1'); window.location.reload(); });
  $('#printReport').addEventListener('click', () => { toast('Reporte demo preparado para imprimir.'); window.print(); });
  $('#showOrders').addEventListener('click', () => toast('La actividad de pedidos es ilustrativa en esta demo.'));
  $('#focusSearch').addEventListener('click', () => $('#search').focus());
  function openProductModal(product) {
    $('#productModalTitle').innerHTML = product ? `Editar plato<span>.</span>` : `Nuevo plato<span>.</span>`;
    $('#productId').value = product?.id || ''; $('#productName').value = product?.name || ''; $('#productPrice').value = Math.round((product?.priceCents || 0) / 100);
    $('#productDescription').value = product?.description || ''; $('#productPhoto').value = product?.photo || 'img/demo-rolls-mixtos.jpg'; $('#productAvailable').checked = product?.available !== false;
    $('#productCategory').innerHTML = categories.map(item => `<option ${item.name === (product?.category || (category !== 'all' ? category : categories[0]?.name)) ? 'selected' : ''}>${esc(item.name)}</option>`).join('');
    $('#productModal').classList.add('open'); $('#productName').focus();
  }
  function closeModals() { document.querySelectorAll('.modal.open').forEach(modal => modal.classList.remove('open')); activeOrder = null; }
  function openTicket(order) {
    if (!order) return; activeOrder = order;
    $('#ticketId').textContent = `#${order.id}`; $('#ticketCustomer').textContent = order.customer; $('#ticketMode').textContent = order.mode; $('#ticketAddress').textContent = order.address; $('#ticketPayment').textContent = order.payment; $('#ticketTotal').textContent = `$ ${order.total.toLocaleString('es-AR')}`; $('#ticketNotes').textContent = order.notes;
    $('#ticketItems').innerHTML = `<div><span>${esc(order.items)}</span><strong>$ ${order.total.toLocaleString('es-AR')}</strong></div>`; $('#confirmTicket').textContent = order.status === 'Confirmado' ? 'Marcar pendiente' : 'Marcar confirmado'; $('#ticketModal').classList.add('open');
  }
  document.querySelectorAll('[data-close-modal]').forEach(button => button.addEventListener('click', closeModals));
  document.querySelectorAll('.modal').forEach(modal => modal.addEventListener('click', event => { if (event.target === modal) closeModals(); }));
  $('#newProduct').addEventListener('click', () => openProductModal(null));
  $('#newCategory').addEventListener('click', () => {
    const name = window.prompt('Nombre de la nueva categoría:');
    if (!name || !name.trim()) return;
    if (categories.some(item => item.name.toLowerCase() === name.trim().toLowerCase())) return toast('Esa categoría ya existe.');
    const intro = window.prompt('Descripción breve de la categoría:', 'Una nueva selección de Sushi Fan.');
    categories.push({name:name.trim(), intro:(intro || '').trim() || 'Una nueva selección de Sushi Fan.'});
    saveCategories(); render(); toast('Nueva categoría agregada.');
  });
  $('#productForm').addEventListener('submit', event => {
    event.preventDefault(); const id = $('#productId').value; const data = {name: $('#productName').value.trim(), category: $('#productCategory').value, priceCents: Number($('#productPrice').value) * 100, description: $('#productDescription').value.trim(), photo: $('#productPhoto').value.trim(), available: $('#productAvailable').checked};
    if (!data.name || !Number.isFinite(data.priceCents) || data.priceCents < 0) return toast('Completá nombre y precio válido.');
    if (id) Object.assign(products.find(product => product.id === id), data); else products.unshift({id: `${data.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${Date.now()}`, pieces:'A confirmar', featured:false, ...data});
    save(); closeModals(); render(); toast(id ? 'Plato actualizado en la carta.' : 'Nuevo plato agregado a la carta.');
  });
  $('#confirmTicket').addEventListener('click', () => { if (!activeOrder) return; const orderId = activeOrder.id; activeOrder.status = activeOrder.status === 'Confirmado' ? 'Pendiente' : 'Confirmado'; closeModals(); renderOrders(); toast(`Pedido ${orderId} actualizado.`); });
  $('#printTicket').addEventListener('click', () => window.print());
  render();
})();
