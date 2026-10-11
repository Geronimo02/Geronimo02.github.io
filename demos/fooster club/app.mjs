import { assets, categories, config, products } from './data.mjs';
import { addLine, buildWhatsAppMessage, changeQuantity, getTotals, revalidateCart, whatsappUrl } from './cart-core.mjs';

const page = document.body.dataset.page;
const base = document.body.dataset.base || '';
const storageKey = 'foster-cart-v1';
const currency = value => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const photo = path => `${base}${encodeURI(path)}`;
const canOrder = product => config.orderingLive && product.verified && product.available && product.orderingEnabled && Number.isSafeInteger(product.priceArs) && product.priceArs >= 0;
let cart = [];
let storageWarning = '';

function loadCart() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const saved = JSON.parse(raw);
    if (saved.version !== 1 || !Array.isArray(saved.lines)) return [];
    const valid = revalidateCart(saved.lines, products);
    if (valid.length !== saved.lines.length) storageWarning = 'Algunos productos guardados cambiaron o dejaron de estar disponibles y se quitaron del pedido.';
    return valid;
  } catch {
    storageWarning = 'No se pudo recuperar el pedido guardado. Podés seguir explorando la carta.';
    return [];
  }
}

function saveCart() {
  try { localStorage.setItem(storageKey, JSON.stringify({ version: 1, lines: cart })); }
  catch { storageWarning = 'No se pudo guardar el pedido en este navegador. La selección seguirá disponible mientras esta página esté abierta.'; }
}

function updateBadges() {
  const totals = getTotals(cart, products);
  document.querySelectorAll('.cart-count').forEach(node => { node.textContent = totals.count; });
  const mobile = document.querySelector('.mobile-cart-bar');
  if (mobile) {
    mobile.hidden = totals.count === 0;
    document.querySelector('#mobile-cart-total').textContent = currency(totals.total);
  }
}

function setupDialogs() {
  const menu = document.querySelector('#site-menu');
  document.querySelectorAll('[data-open-menu]').forEach(button => button.addEventListener('click', () => menu?.showModal()));
  document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => button.closest('dialog')?.close()));
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); });
  });
  document.querySelectorAll('.site-menu nav a').forEach(link => link.addEventListener('click', () => menu?.close()));
  document.querySelectorAll('[data-open-cart]').forEach(button => button.addEventListener('click', openCart));
  if (menu) menu.addEventListener('close', () => document.querySelector('[data-open-menu]')?.focus());
}

function renderFeatured() {
  const mount = document.querySelector('#featured-list');
  if (!mount) return;
  const groups = [
    [{ title: 'BURGERS', ids: ['underground', 'da-bacon', 'crispy-queen'], descriptions: true }],
    [
      { title: 'BAGELS', ids: ['salmon', 'trufa-melt'], descriptions: true },
      { title: 'FRIED CHICKEN', ids: ['balde-x4'], descriptions: true },
    ],
    [
      { title: 'MILKSHAKES', ids: ['oreo', 'chocolate-mani', 'cookie'], descriptions: false },
      { title: 'SIDES', ids: ['papas-clasicas', 'papas-foster', 'aros-de-cebolla'], descriptions: false },
    ],
  ];
  mount.innerHTML = groups.map(sections => `<div class="featured-column">${sections.map(group => `<div class="featured-group"><h3>${group.title}</h3>${group.ids.map(id => {
    const product = products.find(item => item.id === id);
    return `<div class="featured-item"><strong>${escapeHtml(product.name)}</strong>${group.descriptions ? `<p>${escapeHtml(product.description)}</p>` : ''}</div>`;
  }).join('')}</div>`).join('')}</div>`).join('');
}

function renderMenu() {
  const nav = document.querySelector('#category-nav');
  const content = document.querySelector('#menu-content');
  if (!nav || !content) return;
  nav.innerHTML = `<a href="#categorias" class="category-link" data-all>Carta completa</a>` + categories.map(category => `<a href="#${category.id}" class="category-link" data-category="${category.id}">${escapeHtml(category.name)}</a>`).join('');
  content.innerHTML = categories.map((category, index) => {
    const items = products.filter(product => product.category === category.id);
    return `<section class="menu-section" id="${category.id}" aria-labelledby="title-${category.id}"><div class="section-heading"><span class="section-number">0${index + 1} / ${String(items.length).padStart(2, '0')} OPCIONES</span><div><h2 id="title-${category.id}">${escapeHtml(category.name)}<span class="dot">.</span></h2><p>${escapeHtml(category.intro)}</p></div></div><div class="product-grid">${items.length ? items.map(product => `<button class="product-card" type="button" data-product="${product.id}" aria-label="Ver detalle de ${escapeHtml(product.name)}"><span class="product-image" aria-hidden="true">${product.imageUrl ? `<img src="${photo(product.imageUrl)}" alt="" width="100" height="100" loading="lazy">` : '<span class="product-mark">f.</span>'}</span><span class="product-copy"><strong>${escapeHtml(product.name)}</strong><span>${escapeHtml(product.description)}</span><small>${canOrder(product) ? currency(product.priceArs) : 'PRECIO POR CONFIRMAR'}</small></span><span class="product-arrow" aria-hidden="true">↗</span></button>`).join('') : '<p class="menu-empty">Todavía no hay productos en esta categoría.</p>'}</div></section>`;
  }).join('');
  content.addEventListener('click', event => {
    const button = event.target.closest('[data-product]');
    if (button) openProduct(button.dataset.product);
  });
  const links = [...nav.querySelectorAll('[data-category]')];
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      links.forEach(link => { link.classList.toggle('active', link.dataset.category === entry.target.id); });
    }
  }, { rootMargin: '-25% 0px -62% 0px' });
  content.querySelectorAll('.menu-section').forEach(section => observer.observe(section));
  nav.querySelector('[data-all]').addEventListener('click', event => { event.preventDefault(); document.querySelector('#categorias').scrollIntoView({ behavior: 'smooth' }); });
  const linkedCategory = categories.find(category => location.hash === `#${category.id}`);
  if (linkedCategory) requestAnimationFrame(() => document.getElementById(linkedCategory.id)?.scrollIntoView({ behavior: 'auto' }));
}

function openProduct(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;
  const dialog = document.querySelector('#product-dialog');
  const mount = document.querySelector('#product-detail');
  const groups = product.modifiers || [];
  mount.innerHTML = `<div class="detail-art">${product.imageUrl ? `<img class="detail-photo" src="${photo(product.imageUrl)}" alt="Fotografía ilustrativa de comida" width="800" height="800"><span>FOTO ILUSTRATIVA · DEMO</span>` : `<img src="${photo(assets.mascot)}" alt="" width="270" height="230">`}</div><div class="detail-content"><p class="eyebrow">${escapeHtml(categories.find(category => category.id === product.category)?.name || '')} / FOSTER CLUB</p><h2 id="product-dialog-title">${escapeHtml(product.name)}<span class="dot">.</span></h2><p>${escapeHtml(product.description)}</p><strong class="detail-price">${canOrder(product) ? currency(product.priceArs) : 'PRECIO POR CONFIRMAR'}</strong><p class="detail-status">${canOrder(product) ? 'Elegí cantidad e indicaciones para sumar al pedido.' : 'Este producto forma parte de una carta de referencia. Esperamos la confirmación del precio y disponibilidad para habilitar pedidos.'}</p><form id="product-form"><input type="hidden" name="productId" value="${escapeHtml(product.id)}"><label class="field-label" for="product-quantity">Cantidad</label><div class="qty-control"><button type="button" data-step="-1" aria-label="Restar una unidad">−</button><input id="product-quantity" name="quantity" type="number" min="1" max="20" value="1" inputmode="numeric"><button type="button" data-step="1" aria-label="Sumar una unidad">+</button></div>${groups.map(group => `<fieldset class="modifier-group"><legend>${escapeHtml(group.label)}</legend>${group.options.map(option => `<label><input type="checkbox" name="option" value="${escapeHtml(option.id)}" ${option.available && option.verified && Number.isSafeInteger(option.priceArs) ? '' : 'disabled'}>${escapeHtml(option.label)} <span>${option.verified && Number.isSafeInteger(option.priceArs) ? currency(option.priceArs) : 'Por confirmar'}</span></label>`).join('')}</fieldset>`).join('')}<label class="field-label" for="product-note">Indicaciones para este producto</label><textarea id="product-note" name="note" maxlength="180" rows="3" placeholder="Ej.: sin cebolla"></textarea><button class="pill pill-orange detail-add" type="submit" ${canOrder(product) ? '' : 'disabled'}>${canOrder(product) ? 'Agregar al pedido' : 'Pedido no disponible'}</button></form></div>`;
  const form = mount.querySelector('#product-form');
  form.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {
    const input = form.elements.quantity;
    input.value = Math.min(20, Math.max(1, Number(input.value || 1) + Number(button.dataset.step)));
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!canOrder(product)) return;
    const quantity = Number(form.elements.quantity.value);
    const selectedOptions = [...form.querySelectorAll('input[name="option"]:checked')].map(input => ({ optionId: input.value, quantity: 1 }));
    const next = addLine(cart, { productId: product.id, quantity, selectedOptions, note: form.elements.note.value });
    if (next === cart) return;
    cart = next; saveCart(); updateBadges(); dialog.close(); openCart();
  });
  dialog.showModal();
  document.body.classList.add('dialog-open');
}

function openCart() {
  renderCart();
  const dialog = document.querySelector('#cart-dialog');
  dialog?.showModal();
  document.body.classList.add('dialog-open');
}

function renderCart() {
  const mount = document.querySelector('#cart-body');
  if (!mount) return;
  const totals = getTotals(cart, products);
  const formEnabled = cart.length > 0 && config.orderingLive && /^[1-9]\d{7,14}$/.test(config.whatsappNumber || '') && (config.pickupEnabled || config.deliveryEnabled);
  mount.innerHTML = `${storageWarning ? `<p class="cart-notice" role="status">${escapeHtml(storageWarning)}</p>` : ''}${!cart.length ? `<div class="cart-empty"><img src="${photo(assets.mascot)}" alt="" width="210" height="170"><h3>El plan empieza acá.</h3><p>Explorá la carta y encontrá algo que te guste. Los pedidos se habilitarán cuando la información comercial esté confirmada.</p><button class="pill pill-orange" type="button" data-close-cart>Volver a la carta</button></div>` : `<div class="cart-lines">${cart.map(line => { const product = products.find(item => item.id === line.productId); return `<article class="cart-line"><div><h3>${escapeHtml(product.name)}</h3>${line.selectedOptions.map(selected => { const option = product.modifiers.flatMap(group => group.options).find(item => item.id === selected.optionId); return `<p>+ ${escapeHtml(option.label)} ×${selected.quantity}</p>`; }).join('')}${line.note ? `<p>Nota: ${escapeHtml(line.note)}</p>` : ''}<strong>${currency((product.priceArs + line.selectedOptions.reduce((sum, selected) => sum + product.modifiers.flatMap(group => group.options).find(item => item.id === selected.optionId).priceArs * selected.quantity, 0)) * line.quantity)}</strong></div><div class="cart-line-actions"><button type="button" data-qty="-1" data-line="${escapeHtml(line.lineId)}" aria-label="Restar ${escapeHtml(product.name)}">−</button><span>${line.quantity}</span><button type="button" data-qty="1" data-line="${escapeHtml(line.lineId)}" aria-label="Sumar ${escapeHtml(product.name)}">+</button><button type="button" class="remove" data-remove data-line="${escapeHtml(line.lineId)}">Quitar</button></div></article>`; }).join('')}</div><div class="cart-totals"><div><span>Productos</span><strong>${currency(totals.productsTotal)}</strong></div><div><span>Adicionales</span><strong>${currency(totals.extrasTotal)}</strong></div><div class="total"><span>Total estimado</span><strong>${currency(totals.total)}</strong></div></div>`}<div class="order-gate">${formEnabled ? '' : '<strong>Pedidos todavía no disponibles.</strong><p>Faltan precios vigentes, modalidad de entrega o WhatsApp oficial. La carta se puede explorar mientras Foster confirma esos datos.</p>'}</div>${formEnabled ? `<form id="order-form"><label for="customer-name">Tu nombre</label><input id="customer-name" name="name" maxlength="80" required><label for="order-mode">Modalidad</label><select id="order-mode" name="mode" required>${config.pickupEnabled ? '<option value="Retiro en local">Retiro en local</option>' : ''}${config.deliveryEnabled ? '<option value="Delivery">Delivery</option>' : ''}</select>${config.deliveryEnabled ? '<label for="customer-address">Dirección si elegís delivery</label><input id="customer-address" name="address" maxlength="150">' : ''}<label for="order-notes">Observaciones generales</label><textarea id="order-notes" name="notes" maxlength="200" rows="3"></textarea><p class="order-disclaimer">El pedido se enviará por WhatsApp. No queda confirmado hasta que el local te responda.</p><button class="pill pill-orange" type="submit">Enviar pedido por WhatsApp ↗</button><button class="text-button" type="button" data-clear-cart>Vaciar pedido</button></form>` : ''}`;
  mount.querySelector('[data-close-cart]')?.addEventListener('click', () => document.querySelector('#cart-dialog').close());
  mount.querySelectorAll('[data-qty]').forEach(button => button.addEventListener('click', () => {
    const line = cart.find(item => item.lineId === button.dataset.line);
    cart = changeQuantity(cart, line.lineId, line.quantity + Number(button.dataset.qty));
    saveCart(); updateBadges(); renderCart();
  }));
  mount.querySelectorAll('[data-remove]').forEach(button => button.addEventListener('click', () => { cart = changeQuantity(cart, button.dataset.line, 0); saveCart(); updateBadges(); renderCart(); }));
  mount.querySelector('[data-clear-cart]')?.addEventListener('click', () => { cart = []; saveCart(); updateBadges(); renderCart(); });
  mount.querySelector('#order-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const details = Object.fromEntries(new FormData(form));
    if (details.mode === 'Delivery' && (!config.deliveryEnabled || !details.address?.trim())) { form.elements.address?.setCustomValidity('Ingresá una dirección para delivery.'); form.reportValidity(); return; }
    if (details.mode !== 'Delivery' && details.mode !== 'Retiro en local') return;
    const message = buildWhatsAppMessage(cart, products, details);
    const url = whatsappUrl(config.whatsappNumber, message);
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  });
}

document.querySelectorAll('[data-year]').forEach(node => { node.textContent = new Date().getFullYear(); });
cart = loadCart();
setupDialogs();
updateBadges();
if (page === 'home') {
  renderFeatured();
  const header = document.querySelector('.site-header');
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 36);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}
if (page === 'carta') {
  renderMenu();
  if (location.hash === '#pedido') openCart();
}
