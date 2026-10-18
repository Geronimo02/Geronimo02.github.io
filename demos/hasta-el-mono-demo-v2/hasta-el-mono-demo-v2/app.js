(() => {
  'use strict';
  // This is an offline-only demonstration. There is deliberately no order endpoint,
  // payment integration, WhatsApp handoff, or analytics/tracking request.
  const PRODUCTS = [
    { id: 'p01', group: 'pizzas', name: 'Pizza cl\u00e1sica', price: 12000, image: 'assets/pizza-muzza.webp', alt: 'Pizza real del local fotografiada sobre una base redonda', note: 'Variedad de ejemplo, no verificada en carta.' },
    { id: 'p02', group: 'pizzas', name: 'Pizza especial', price: 15700, image: 'assets/pizza-especial.webp', alt: 'Primer plano de pizza del local con ingredientes', note: 'Nombre y precio ilustrativos.' },
    { id: 'p03', group: 'pizzas', name: 'Pizza de la casa', price: 16500, image: 'assets/horno.webp', alt: 'Pizza real del local vista dentro del horno', note: 'Propuesta de prueba, consultar carta oficial.' },
    { id: 'e01', group: 'empanadas', name: 'Empanada tradicional', price: 2300, image: 'assets/empanada-corte.webp', alt: 'Empanada real del local cortada, con relleno a la vista', note: 'Sabor y precio solo de demostraci\u00f3n.' },
    { id: 'e02', group: 'empanadas', name: 'Empanada abierta', price: 2600, image: 'assets/empanadas-plato.webp', alt: 'Empanadas abiertas del local en un plato', note: 'Variante ilustrativa, sin disponibilidad confirmada.' },
    { id: 'e03', group: 'empanadas', name: 'Empanada de queso', price: 2500, image: 'assets/empanada-queso.webp', alt: 'Empanada real del local cortada con queso', note: 'Producto de prueba, consultar carta oficial.' }
  ];
  const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const format = (number) => '$' + new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(number);
  const state = { cart: {}, filter: 'todos', open: false, lastFocus: null };
  const grid = $('#product-grid');
  const cartItems = $('#cart-items');
  const subtotalNode = $('#cart-subtotal');
  const drawer = $('#cart-drawer');
  const overlay = $('#cart-overlay');
  const noteField = $('#order-notes');
  const copyBtn = $('#copy-order');
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
  function subtotal() { return PRODUCTS.reduce((total, item) => total + item.price * (state.cart[item.id] || 0), 0); }

  function renderProducts() {
    const visible = state.filter === 'todos' ? PRODUCTS : PRODUCTS.filter(p => p.group === state.filter);
    grid.innerHTML = visible.map((p,i) => `
      <article class="product-card" data-product="${p.id}" data-image="${p.image}" data-alt="${p.alt}" data-name="${p.name}" tabindex="0">
        <span class="product-index">${String(PRODUCTS.indexOf(p)+1).padStart(2,'0')}</span>
        <div class="product-main"><span class="product-type">${p.group.toUpperCase()} / DEMO</span><h3>${p.name}</h3><p class="product-note">${p.note}</p></div>
        <div class="product-end"><span class="product-price"><strong>${format(p.price)}</strong><small>FICTICIO</small></span><button class="product-add" type="button" data-add="${p.id}" aria-label="Agregar ${p.name} al pedido demo">+</button></div>
      </article>`).join('');
    const first = visible[0]; if(first) showMenuPreview(first.image,first.alt,first.name,PRODUCTS.indexOf(first)+1);
  }
  function showMenuPreview(path,alt,name,index){
    const img=$('#menu-feature-image');
    if(!img)return;
    if(img.getAttribute('src')!==path){
      img.classList.remove('is-changing');
      void img.offsetWidth;
      img.classList.add('is-changing');
      img.setAttribute('src',path);
      img.setAttribute('alt',alt);
      img.onload=()=>{ img.classList.remove('is-changing'); };
    }
    $('#menu-feature-name').textContent=name.toUpperCase();
    $('.image-window-index').textContent='IMAGEN '+String(index).padStart(2,'0')+' / 06';
  }
  function renderCart() {
    const entries = PRODUCTS.filter(p => state.cart[p.id] > 0);
    const totalCount = count();
    $$('[data-cart-count]').forEach(node => { node.textContent = String(totalCount); });
    subtotalNode.textContent = format(subtotal());
    $('#mobile-cart-total').textContent = format(subtotal()) + ' \u2197';
    mobile.hidden = totalCount === 0 || state.open;
    copyBtn.disabled = totalCount === 0;
    cartItems.innerHTML = entries.length ? entries.map(p => `
      <article class="cart-line-item" data-cart-item="${p.id}">
        <img src="${p.image}" alt="" width="74" height="79">
        <div class="cart-item-content"><h3>${p.name}</h3><p>Art\u00edculo de ejemplo \u00b7 ${format(p.price)} c/u</p>
          <div class="cart-item-row"><div class="stepper"><button data-decrease="${p.id}" type="button" aria-label="Quitar una unidad de ${p.name}">\u2212</button><output aria-label="Cantidad">${state.cart[p.id]}</output><button data-increase="${p.id}" type="button" aria-label="Sumar una unidad de ${p.name}">+</button></div><strong>${format(p.price * state.cart[p.id])}</strong></div>
          <button data-remove="${p.id}" class="remove-item" type="button">Quitar producto</button>
        </div>
      </article>
    `).join('') : `<div class="cart-empty"><span class="cart-empty-icon" aria-hidden="true">\u25ce</span><h3>AC\u00c1 TODAV\u00cdA NO HAY NADA.</h3><p>Eleg\u00ed algunos productos de la carta de ejemplo para probar c\u00f3mo se arma el pedido.</p></div>`;
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
      if (!state.open) toast('Agregado a tu pedido de demostraci\u00f3n');
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
    const details = PRODUCTS.filter(p => state.cart[p.id] > 0).map(p => `- ${state.cart[p.id]} x ${p.name} [EJEMPLO] (${format(state.cart[p.id] * p.price)})`).join('\n');
    const delivery = $('input[name="delivery-type"]:checked').value;
    const notes = noteField.value.trim();
    return [
      'HASTA EL MO\u00d1O - PEDIDO DE PRUEBA',
      '*** DEMO INTERNA / NO ENVIAR AL NEGOCIO ***',
      'Productos, variantes y precios completamente ficticios.', '',
      details, '',
      `Subtotal de ejemplo: ${format(subtotal())}`,
      `Modalidad a modo de ejemplo: ${delivery}`,
      'No se incluye costo de env\u00edo ni se verific\u00f3 disponibilidad.',
      notes ? `Observaciones: ${notes}` : '', '',
      'Este texto sirve para revisar el funcionamiento del carrito. NO es un pedido real.'
    ].filter(Boolean).join('\n');
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
      toast('Resumen de prueba copiado. No se envi\u00f3 a nadie.');
      copyBtn.textContent = 'RESUMEN DEMO COPIADO \u2713';
      window.setTimeout(() => { copyBtn.innerHTML = 'COPIAR COMANDA DE PRUEBA <span aria-hidden="true">\u2197</span>';  }, 2100);
    } catch (_) {
      // Browser may disallow clipboard on file://. Show a selectable text instead.
      const manual = window.prompt('Copi\u00e1 este resumen de demostraci\u00f3n:', value);
      if (manual !== null) toast('El resumen sigue siendo una demo, no un pedido.');
    }
  }
  const hoverProduct = (ev) => {
    const row=ev.target.closest('[data-product]');
    if(!row)return;
    const p=byId[row.dataset.product];
    if(p)showMenuPreview(p.image,p.alt,p.name,PRODUCTS.indexOf(p)+1);
  };
  grid.addEventListener('pointerover',hoverProduct);
  grid.addEventListener('focusin',hoverProduct);
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
  const video = $('#craft-video');
  const toggle = $('#video-toggle');
  toggle.addEventListener('click', async () => {
    if (video.paused) {
      try { await video.play(); toggle.innerHTML = '<span aria-hidden="true">&#10074;&#10074;</span> PAUSAR VIDEO'; toggle.setAttribute('aria-label', 'Pausar video'); }
      catch (_) { toast('No fue posible reproducir el video en este navegador.'); }
    } else { video.pause(); toggle.innerHTML = '<span aria-hidden="true">&#9654;</span> VER EN ACCI&Oacute;N'; toggle.setAttribute('aria-label', 'Reproducir video de preparaci\u00f3n'); }
  });
  video.addEventListener('ended', () => { toggle.innerHTML = '<span aria-hidden="true">&#9654;</span> VER EN ACCI&Oacute;N'; toggle.setAttribute('aria-label', 'Reproducir video de preparaci\u00f3n'); });
  if ('IntersectionObserver' in window) {
    const watcher = new IntersectionObserver(entries => entries.forEach(entry => { if (!entry.isIntersecting && !video.paused) { video.pause(); toggle.innerHTML = '<span aria-hidden="true">&#9654;</span> VER EN ACCI&Oacute;N'; }}));
    watcher.observe(video);

    const revealTargets = $$('.interlude-image img, .interlude-message h2, .oven-figure img, .oven-head h2, .local-photo img, .local-side h2');
    revealTargets.forEach(node => node.classList.add('reveal-on-scroll'));
    const revealWatcher = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealWatcher.unobserve(entry.target);
      }
    }), { threshold: .16 });
    revealTargets.forEach(node => revealWatcher.observe(node));
  }
  initLoadingScreen();
  renderProducts();
  renderCart();
})();
