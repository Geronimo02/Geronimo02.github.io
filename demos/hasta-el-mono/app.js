(() => {
  'use strict';
  // La carta y el número receptor se habilitan solo al confirmar los datos con el local.
  const checkout = window.HastaCheckout;
  const ORDER_PHONE = document.body.dataset.orderPhone || '';
  const PRODUCTS_CONFIRMED = document.body.dataset.productsConfirmed === 'true';
  let ORDER_ENABLED = false;
  if (PRODUCTS_CONFIRMED) {
    try { checkout.buildWhatsAppUrl(ORDER_PHONE, ''); ORDER_ENABLED = true; }
    catch (_) { /* El botón queda deshabilitado hasta confirmar el número. */ }
  }
  const PRODUCTS = [
    { id: 'p01', group: 'pizzas', name: 'Pizza cl\u00e1sica', image: 'assets/pizza-muzza.webp', alt: 'Pizza real del local fotografiada sobre una base redonda' },
    { id: 'p02', group: 'pizzas', name: 'Pizza especial', image: 'assets/pizza-especial.webp', alt: 'Primer plano de pizza del local con ingredientes' },
    { id: 'p03', group: 'pizzas', name: 'Pizza de la casa', image: 'assets/horno.webp', alt: 'Pizza real del local vista dentro del horno' },
    { id: 'e01', group: 'empanadas', name: 'Empanada tradicional', image: 'assets/empanada-corte.webp', alt: 'Empanada real del local cortada, con relleno a la vista' },
    { id: 'e02', group: 'empanadas', name: 'Empanada abierta', image: 'assets/empanadas-plato.webp', alt: 'Empanadas abiertas del local en un plato' },
    { id: 'e03', group: 'empanadas', name: 'Empanada de queso', image: 'assets/empanada-queso.webp', alt: 'Empanada real del local cortada con queso' }
  ];
  const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const state = { cart: {}, filter: 'pizzas', open: false, lastFocus: null };
  const grid = $('#product-grid');
  const cartItems = $('#cart-items');
  const subtotalNode = $('#cart-subtotal');
  const drawer = $('#cart-drawer');
  const overlay = $('#cart-overlay');
  const noteField = $('#order-notes');
  const copyBtn = $('#copy-order');
  const sendBtn = $('#send-order');
  const orderForm = $('#checkout-form');
  const customerNameField = $('#customer-name');
  const addressField = $('#delivery-address');
  const deliveryFields = $('#delivery-fields');
  const checkoutError = $('#checkout-error');
  const mobile = $('.mobile-cart');
  const toastNode = $('#toast');
  let toastTimeout;

  function finishLoading() {
    const loader = $('#loading-screen');
    if (loader) loader.classList.add('is-done');
  }

  function initLoadingScreen() {
    const started = performance.now();
    const dismiss = () => {
      const remaining = Math.max(0, 650 - (performance.now() - started));
      window.setTimeout(finishLoading, remaining);
    };
    if (document.readyState === 'complete') dismiss();
    else window.addEventListener('load', dismiss, { once: true });
    window.setTimeout(finishLoading, 2200);
  }

  function toast(message) {
    window.clearTimeout(toastTimeout);
    toastNode.textContent = message;
    toastNode.classList.add('visible');
    toastTimeout = window.setTimeout(() => toastNode.classList.remove('visible'), 2400);
  }
  function count() { return Object.values(state.cart).reduce((total, qty) => total + qty, 0); }

  function renderProducts() {
    const visible = state.filter === 'todos' ? PRODUCTS : PRODUCTS.filter(p => p.group === state.filter);
    grid.innerHTML = visible.map((p) => `
      <article class="product-card" data-product="${p.id}">
        <div class="product-photo"><img src="${p.image}" alt="${p.alt}" loading="lazy"></div>
        <div class="product-main"><h3>${p.name}</h3><p class="product-note">Disponibilidad a confirmar con el local.</p></div>
        <div class="product-end"><span class="product-price"><strong>Consultar</strong></span><button class="product-add" type="button" data-add="${p.id}" aria-label="Agregar ${p.name} a la comanda">+</button></div>
      </article>`).join('');
  }
  function renderCart() {
    const entries = PRODUCTS.filter(p => state.cart[p.id] > 0);
    const totalCount = count();
    $$('[data-cart-count]').forEach(node => { node.textContent = String(totalCount); });
    $('#cart-summary-label').textContent = totalCount === 1 ? 'producto' : 'productos';
    subtotalNode.textContent = 'A confirmar';
    $('#mobile-cart-total').textContent = totalCount + (totalCount === 1 ? ' producto \u2197' : ' productos \u2197');
    mobile.hidden = totalCount === 0 || state.open;
    copyBtn.disabled = totalCount === 0;
    sendBtn.disabled = totalCount === 0 || !ORDER_ENABLED;
    cartItems.innerHTML = entries.length ? entries.map(p => `
      <article class="cart-line-item" data-cart-item="${p.id}">
        <img src="${p.image}" alt="" width="74" height="79">
        <div class="cart-item-content"><h3>${p.name}</h3><p>Precio a confirmar</p>
          <div class="cart-item-row"><div class="stepper"><button data-decrease="${p.id}" type="button" aria-label="Quitar una unidad de ${p.name}">\u2212</button><output aria-label="Cantidad">${state.cart[p.id]}</output><button data-increase="${p.id}" type="button" aria-label="Sumar una unidad de ${p.name}">+</button></div><strong>Consultar</strong></div>
          <button data-remove="${p.id}" class="remove-item" type="button">Quitar producto</button>
        </div>
      </article>
    `).join('') : `<div class="cart-empty"><span class="cart-empty-icon" aria-hidden="true">\u25ce</span><h3>AC\u00c1 TODAV\u00cdA NO HAY NADA.</h3><p>${PRODUCTS_CONFIRMED ? 'Elegí productos de la carta para armar tu pedido.' : 'Elegí algunos productos de la carta de ejemplo para probar cómo se arma el pedido.'}</p></div>`;
  }
  function bumpCart() {
    $$('.cart-number').forEach(node => {
      node.classList.remove('bump');
      void node.offsetWidth;
      node.classList.add('bump');
    });
  }
  function updateQty(id, change) {
    if (!byId[id]) return;
    const next = Math.max(0, Math.min(99, (state.cart[id] || 0) + change));
    if (next === 0) delete state.cart[id];
    else state.cart[id] = next;
    renderCart();
    if (change > 0) {
      bumpCart();
      if (!state.open) toast(PRODUCTS_CONFIRMED ? 'Agregado a tu pedido' : 'Agregado a la comanda de prueba');
    }
  }
  function openCart() {
    if (state.open) return;
    state.lastFocus = document.activeElement;
    state.open = true;
    mobile.hidden = true;
    overlay.hidden = false;
    document.body.classList.add('cart-open');
    drawer.inert = false;
    drawer.setAttribute('aria-hidden', 'false');
    window.requestAnimationFrame(() => {
      overlay.classList.add('visible');
      drawer.classList.add('open');
      $('#close-cart').focus();
    });
  }
  function closeCart() {
    if (!state.open) return;
    state.open = false;
    drawer.classList.remove('open');
    overlay.classList.remove('visible');
    document.body.classList.remove('cart-open');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.inert = true;
    mobile.hidden = count() === 0;
    window.setTimeout(() => { if (!state.open) overlay.hidden = true; }, 240);
    if (state.lastFocus && typeof state.lastFocus.focus === 'function') state.lastFocus.focus();
  }
  function orderText() {
    const items = PRODUCTS.filter(p => state.cart[p.id] > 0).map(p => ({
      name: p.name,
      quantity: state.cart[p.id],
    }));
    if (!PRODUCTS_CONFIRMED) {
      return [
        'HASTA EL MO\u00d1O - SELECCI\u00d3N DE PRUEBA',
        'La carta actual contiene productos de ejemplo. NO enviar como pedido real.',
        ...items.map(item => `${item.quantity} x ${item.name}`)
      ].join('\n');
    }
    return checkout.buildOrderMessage({
      customerName: customerNameField.value,
      fulfillment: $('input[name="delivery-type"]:checked').value,
      address: addressField.value,
      notes: noteField.value,
      items
    });
  }

  function updateDeliveryFields() {
    const delivery = $('input[name="delivery-type"]:checked').value === 'delivery';
    deliveryFields.hidden = !delivery;
    addressField.required = delivery;
  }

  function sendOrder(event) {
    event.preventDefault();
    if (!ORDER_ENABLED || count() === 0) return;
    const items = PRODUCTS.filter(p => state.cart[p.id] > 0).map(p => ({ name: p.name, quantity: state.cart[p.id] }));
    const errors = checkout.validateOrder({
      customerName: customerNameField.value,
      fulfillment: $('input[name="delivery-type"]:checked').value,
      address: addressField.value,
      items
    });
    checkoutError.hidden = true;
    customerNameField.removeAttribute('aria-invalid');
    addressField.removeAttribute('aria-invalid');
    if (Object.keys(errors).length) {
      checkoutError.textContent = Object.values(errors)[0];
      checkoutError.hidden = false;
      if (errors.customerName) { customerNameField.setAttribute('aria-invalid', 'true'); customerNameField.focus(); }
      else if (errors.address) { addressField.setAttribute('aria-invalid', 'true'); addressField.focus(); }
      return;
    }
    try {
      window.open(checkout.buildWhatsAppUrl(ORDER_PHONE, orderText()), '_blank', 'noopener,noreferrer');
    } catch (_) {
      checkoutError.textContent = 'No se pudo abrir WhatsApp. Revisá el número del local.';
      checkoutError.hidden = false;
    }
  }
  async function copyOrder() {
    if (count() === 0) return;
    const value = orderText();
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(value);
      else {
        const node = document.createElement('textarea');
        node.value = value;
        node.style.position = 'fixed'; node.style.opacity = '0';
        document.body.appendChild(node); node.select();
        const ok = document.execCommand('copy');
        node.remove();
        if (!ok) throw new Error('Clipboard unavailable');
      }
      toast('Resumen copiado. No se envió a nadie.');
      copyBtn.textContent = 'RESUMEN COPIADO \u2713';
      window.setTimeout(() => { copyBtn.textContent = 'COPIAR RESUMEN'; }, 2100);
    } catch (_) {
      // Browser may disallow clipboard on file://. Show a selectable text instead.
      const manual = window.prompt('Copiá este resumen:', value);
      if (manual !== null) toast('Resumen listo para copiar.');
    }
  }
  grid.addEventListener('click', (ev) => {
    const button = ev.target.closest('[data-add]');
    if (button) updateQty(button.dataset.add, 1);
  });
  cartItems.addEventListener('click', (ev) => {
    const button = ev.target.closest('button');
    if (!button) return;
    if (button.dataset.increase) updateQty(button.dataset.increase, 1);
    else if (button.dataset.decrease) updateQty(button.dataset.decrease, -1);
    else if (button.dataset.remove) { delete state.cart[button.dataset.remove]; renderCart(); }
  });
  $$('.menu-tab').forEach(button => button.addEventListener('click', () => {
    state.filter = button.dataset.filter;
    $$('.menu-tab').forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-selected', String(selected));
    });
    renderProducts();
  }));
  $$('[data-open-cart]').forEach(button => button.addEventListener('click', openCart));
  $('#close-cart').addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);
  document.addEventListener('keydown', (ev) => {
    if (!state.open) return;
    if (ev.key === 'Escape') { ev.preventDefault(); closeCart(); }
    else if (ev.key === 'Tab') {
      const focusable = $$('button:not([disabled]), input:not([disabled]), textarea:not([disabled])', drawer).filter(el => el.getClientRects().length);
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
      else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
    }
  });
  copyBtn.addEventListener('click', copyOrder);
  orderForm.addEventListener('submit', sendOrder);
  $$('input[name="delivery-type"]').forEach(input => input.addEventListener('change', updateDeliveryFields));
  [customerNameField, addressField].forEach(input => input.addEventListener('input', () => {
    input.removeAttribute('aria-invalid');
    checkoutError.hidden = true;
  }));
  updateDeliveryFields();
  if (ORDER_ENABLED) {
    $('.cart-mini').textContent = 'PEDIDO ONLINE';
    $('.header-bag').setAttribute('aria-label', 'Abrir comanda');
    $('.cart-warning').textContent = 'Revisá el pedido en WhatsApp y tocá Enviar para mandarlo al local.';
    $('#checkout-help').textContent = 'Se abre WhatsApp con tu pedido listo. El local confirma disponibilidad y precio final.';
    $('.demo-note').textContent = 'El local confirma disponibilidad, precios y costo de envío por WhatsApp.';
  } else if (PRODUCTS_CONFIRMED) {
    $('#checkout-help').textContent = 'Falta confirmar el número de WhatsApp para habilitar los pedidos.';
  }
  const video = $('#craft-video');
  const toggle = $('#video-toggle');
  const videoFrame = $('.video-frame');
  async function toggleVideo() {
    if (video.paused) {
      try { await video.play(); videoFrame.classList.add('is-playing'); toggle.innerHTML = '<span aria-hidden="true">Ⅱ</span>'; toggle.setAttribute('aria-label', 'Pausar video'); }
      catch (_) { toast('No fue posible reproducir el video en este navegador.'); }
    } else { video.pause(); videoFrame.classList.remove('is-playing'); toggle.innerHTML = '<span aria-hidden="true">▶︎</span>'; toggle.setAttribute('aria-label', 'Reproducir video de preparación'); }
  }
  toggle.addEventListener('click', toggleVideo);
  $('#video-jump').addEventListener('click', (ev) => { ev.preventDefault(); video.scrollIntoView({ behavior: 'smooth', block: 'center' }); if (video.paused) toggleVideo(); });
  video.addEventListener('ended', () => { videoFrame.classList.remove('is-playing'); toggle.innerHTML = '<span aria-hidden="true">▶︎</span>'; toggle.setAttribute('aria-label', 'Reproducir video de preparación'); });
  const navToggle = $('#nav-toggle');
  const siteNav = $('#site-nav');
  navToggle.addEventListener('click', () => {
    const opening = navToggle.getAttribute('aria-expanded') !== 'true';
    navToggle.setAttribute('aria-expanded', String(opening));
    navToggle.setAttribute('aria-label', opening ? 'Cerrar menú' : 'Abrir menú');
    siteNav.classList.toggle('open', opening);
  });
  $$('#site-nav a').forEach(link => link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú');
  }));
  if ('IntersectionObserver' in window) {
    const watcher = new IntersectionObserver(entries => entries.forEach(entry => { if (!entry.isIntersecting && !video.paused) { video.pause(); videoFrame.classList.remove('is-playing'); toggle.innerHTML = '<span aria-hidden="true">▶︎</span>'; }}));
    watcher.observe(video);
  }
  initLoadingScreen();
  renderProducts();
  renderCart();
})();
