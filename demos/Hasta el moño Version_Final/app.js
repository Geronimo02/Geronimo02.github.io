(() => {
  'use strict';

  // Prototipo deliberadamente local: no hay endpoints, pagos, analítica ni envío a WhatsApp.
  const PRODUCTS = [
    {
      id: 'p01', group: 'pizzas', name: 'Muzza clásica', price: 8900,
      image: 'Nuevos assest/Carta-assets-PNG/09-pizza-natural.png', alt: 'Pizza ilustrativa con una porción levantada', cutout: true,
      note: 'Salsa de tomate, muzza, olivas y orégano fresco.'
    },
    {
      id: 'p02', group: 'pizzas', name: 'Fugazzetta', price: 9500,
      image: 'assets/photos/pizza-especial.webp', alt: 'Fotografía ilustrativa de una pizza',
      note: 'Muzza, cebolla caramelizada y un toque de orégano.'
    },
    {
      id: 'p03', group: 'pizzas', name: 'Napolitana', price: 9800,
      image: 'assets/photos/pizza-real.webp', alt: 'Fotografía ilustrativa de una pizza',
      note: 'Muzza, tomate en rodajas, ajo, albahaca fresca y olivas.'
    },
    {
      id: 'p04', group: 'pizzas', name: 'Cuatro quesos', price: 10500,
      image: 'assets/photos/pizza-muzza.webp', alt: 'Fotografía ilustrativa de una pizza',
      note: 'Muzza, provoleta, azul, parmesano y un toque de oliva.'
    },
    {
      id: 'p05', group: 'pizzas', name: 'Jamón y morrones', price: 9800,
      image: 'assets/photos/pizza-especial.webp', alt: 'Fotografía ilustrativa de una pizza',
      note: 'Muzza, jamón cocido, morrones asados y orégano.'
    },
    {
      id: 'e01', group: 'empanadas', name: 'Empanada de carne', price: 3200,
      image: 'assets/photos/empanada-corte.webp', alt: 'Empanada real cortada con relleno a la vista',
      note: 'Carne cortada a cuchillo, cebolla, morrón y especias.'
    }
  ];

  const byId = Object.fromEntries(PRODUCTS.map((product) => [product.id, product]));
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  if (document.documentElement.classList.contains('intro-visible')) {
    const heroImage = $('.hero-food');
    const delay = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
    const imageReady = heroImage?.decode ? heroImage.decode().catch(() => {}) : Promise.resolve();
    Promise.all([delay(800), Promise.race([imageReady, delay(1600)])])
      .then(() => document.documentElement.classList.remove('intro-visible'));
  }
  const money = (value) => '$' + new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(value);
  const state = { cart: {}, filter: 'todos', selected: PRODUCTS[0].id, cartOpen: false, lastFocus: null };

  const grid = $('#product-grid');
  const cartItems = $('#cart-items');
  const cartDrawer = $('#cart-drawer');
  const cartOverlay = $('#cart-overlay');
  const subtotalNode = $('#cart-subtotal');
  const noteField = $('#order-notes');
  const copyButton = $('#copy-order');
  const mobileCart = $('.mobile-cart');
  const toastNode = $('#toast');
  let toastTimer;

  function countItems() {
    return Object.values(state.cart).reduce((total, quantity) => total + quantity, 0);
  }

  function subtotal() {
    return PRODUCTS.reduce((total, product) => total + product.price * (state.cart[product.id] || 0), 0);
  }

  function toast(message) {
    window.clearTimeout(toastTimer);
    toastNode.textContent = message;
    toastNode.classList.add('visible');
    toastTimer = window.setTimeout(() => toastNode.classList.remove('visible'), 2300);
  }

  function showProduct(product) {
    if (!product) return;
    state.selected = product.id;
    const image = $('#menu-feature-image');
    image.classList.toggle('is-cutout', Boolean(product.cutout));
    if (image.getAttribute('src') !== product.image) {
      image.classList.add('is-changing');
      window.setTimeout(() => {
        image.src = product.image;
        image.alt = product.alt;
        image.onload = () => image.classList.remove('is-changing');
      }, 120);
    }
    $('#menu-feature-name').textContent = product.name;
    $$('[data-product]', grid).forEach((card) => card.classList.toggle('selected', card.dataset.product === product.id));
  }

  function renderProducts() {
    const visible = state.filter === 'todos' ? PRODUCTS : PRODUCTS.filter((product) => product.group === state.filter);
    if (!visible.some((product) => product.id === state.selected)) state.selected = visible[0]?.id;

    grid.innerHTML = visible.map((product) => `
      <article class="product-card${product.id === state.selected ? ' selected' : ''}" data-product="${product.id}" tabindex="0" aria-label="Ver ${product.name}">
        <div class="product-main">
          <h3>${product.name}</h3>
          <p class="product-note">${product.note}</p>
        </div>
        <div class="product-end">
          <span class="product-price"><strong>${money(product.price)}</strong></span>
          <button class="product-add" type="button" data-add="${product.id}" aria-label="Agregar ${product.name} a la comanda de prueba">+</button>
        </div>
        <img class="selection-frame" src="Nuevos assest/Carta-assets-PNG/18-borde-seleccion-rojo.png" alt="" aria-hidden="true">
      </article>
    `).join('');

    showProduct(byId[state.selected]);
  }

  function renderCart() {
    const chosen = PRODUCTS.filter((product) => state.cart[product.id] > 0);
    const totalCount = countItems();
    $$('[data-cart-count]').forEach((node) => { node.textContent = String(totalCount); });
    subtotalNode.textContent = money(subtotal());
    $('#mobile-cart-total').textContent = money(subtotal()) + ' ↗';
    mobileCart.hidden = totalCount === 0 || state.cartOpen;
    copyButton.disabled = totalCount === 0;

    cartItems.innerHTML = chosen.length ? chosen.map((product) => `
      <article class="cart-line-item" data-cart-item="${product.id}">
        <img src="${product.image}" alt="" width="80" height="84">
        <div class="cart-item-content">
          <h3>${product.name}</h3>
          <p>Artículo de ejemplo · ${money(product.price)} c/u</p>
          <div class="cart-item-row">
            <div class="stepper">
              <button type="button" data-decrease="${product.id}" aria-label="Quitar una unidad de ${product.name}">−</button>
              <output aria-label="Cantidad">${state.cart[product.id]}</output>
              <button type="button" data-increase="${product.id}" aria-label="Agregar una unidad de ${product.name}">+</button>
            </div>
            <strong>${money(product.price * state.cart[product.id])}</strong>
          </div>
          <button type="button" class="remove-item" data-remove="${product.id}">Quitar producto</button>
        </div>
      </article>
    `).join('') : `
      <div class="cart-empty">
        <strong>Acá todavía<br>no hay nada.</strong>
        <p>Elegí productos de la carta de ejemplo para probar cómo se arma la comanda.</p>
      </div>
    `;
  }

  function changeQuantity(id, change) {
    if (!byId[id]) return;
    const next = Math.max(0, Math.min(99, (state.cart[id] || 0) + change));
    if (next === 0) delete state.cart[id];
    else state.cart[id] = next;
    renderCart();

    if (change > 0) {
      $$('.order-pill strong').forEach((node) => {
        node.classList.remove('bump');
        void node.offsetWidth;
        node.classList.add('bump');
      });
      if (!state.cartOpen) toast('Agregado a tu comanda de demostración');
    }
  }

  function openCart() {
    if (state.cartOpen) return;
    state.cartOpen = true;
    state.lastFocus = document.activeElement;
    mobileCart.hidden = true;
    cartOverlay.hidden = false;
    document.body.classList.add('cart-open');
    cartDrawer.inert = false;
    cartDrawer.setAttribute('aria-hidden', 'false');
    window.requestAnimationFrame(() => {
      cartOverlay.classList.add('visible');
      cartDrawer.classList.add('open');
      $('#close-cart').focus();
    });
  }

  function closeCart() {
    if (!state.cartOpen) return;
    state.cartOpen = false;
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('visible');
    document.body.classList.remove('cart-open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    cartDrawer.inert = true;
    mobileCart.hidden = countItems() === 0;
    window.setTimeout(() => { if (!state.cartOpen) cartOverlay.hidden = true; }, 240);
    state.lastFocus?.focus?.();
  }

  function orderSummary() {
    const lines = PRODUCTS
      .filter((product) => state.cart[product.id] > 0)
      .map((product) => `- ${state.cart[product.id]} x ${product.name} [EJEMPLO] (${money(product.price * state.cart[product.id])})`)
      .join('\n');
    const note = noteField.value.trim();
    return [
      'HASTA EL MOÑO — COMANDA DE PRUEBA',
      '*** DEMO / NO ENVIAR AL NEGOCIO ***',
      'Productos y precios ilustrativos.', '',
      lines, '',
      `Subtotal ficticio: ${money(subtotal())}`,
      note ? `Observaciones: ${note}` : '', '',
      'Este texto solo sirve para revisar la interfaz. No es un pedido real.'
    ].filter(Boolean).join('\n');
  }

  async function copyOrder() {
    if (!countItems()) return;
    const summary = orderSummary();
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(summary);
      else {
        const helper = document.createElement('textarea');
        helper.value = summary;
        helper.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
        document.body.appendChild(helper);
        helper.select();
        const copied = document.execCommand('copy');
        helper.remove();
        if (!copied) throw new Error('Clipboard unavailable');
      }
      toast('Resumen demo copiado. No se envió a nadie.');
      copyButton.textContent = 'Comanda demo copiada ✓';
      window.setTimeout(() => { copyButton.innerHTML = 'Copiar comanda de prueba <span aria-hidden="true">↗</span>'; }, 1900);
    } catch (_) {
      window.prompt('Copiá este resumen de demostración:', summary);
    }
  }

  grid.addEventListener('pointerover', (event) => {
    const card = event.target.closest('[data-product]');
    if (card) showProduct(byId[card.dataset.product]);
  });
  grid.addEventListener('focusin', (event) => {
    const card = event.target.closest('[data-product]');
    if (card) showProduct(byId[card.dataset.product]);
  });
  grid.addEventListener('click', (event) => {
    const addButton = event.target.closest('[data-add]');
    if (addButton) {
      event.stopPropagation();
      changeQuantity(addButton.dataset.add, 1);
      return;
    }
    const card = event.target.closest('[data-product]');
    if (card) showProduct(byId[card.dataset.product]);
  });
  grid.addEventListener('keydown', (event) => {
    if (!['Enter', ' '].includes(event.key) || event.target.matches('button')) return;
    const card = event.target.closest('[data-product]');
    if (card) {
      event.preventDefault();
      showProduct(byId[card.dataset.product]);
    }
  });

  $$('.menu-tab').forEach((button) => button.addEventListener('click', () => {
    state.filter = button.dataset.filter;
    $$('.menu-tab').forEach((tab) => {
      const selected = tab === button;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });
    renderProducts();
  }));

  cartItems.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.increase) changeQuantity(button.dataset.increase, 1);
    else if (button.dataset.decrease) changeQuantity(button.dataset.decrease, -1);
    else if (button.dataset.remove) {
      delete state.cart[button.dataset.remove];
      renderCart();
    }
  });

  $$('[data-open-cart]').forEach((button) => button.addEventListener('click', openCart));
  $('#close-cart').addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);
  copyButton.addEventListener('click', copyOrder);

  document.addEventListener('keydown', (event) => {
    if (!state.cartOpen) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeCart();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = $$('button:not([disabled]), textarea:not([disabled]), a[href]', cartDrawer)
      .filter((element) => element.getClientRects().length);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const menuToggle = $('#menu-toggle');
  const mobileNav = $('#mobile-nav');
  menuToggle.addEventListener('click', () => {
    const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(opening));
    menuToggle.setAttribute('aria-label', opening ? 'Cerrar menú' : 'Abrir menú');
    mobileNav.hidden = !opening;
  });
  $$('a', mobileNav).forEach((link) => link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
    mobileNav.hidden = true;
  }));

  const video = $('#craft-video');
  const videoButton = $('#video-toggle');
  const playMark = $('.play-mark');
  async function toggleVideo() {
    if (video.paused) {
      try {
        await video.play();
        videoButton.innerHTML = '<span aria-hidden="true">Ⅱ</span> Pausar proceso';
        videoButton.setAttribute('aria-label', 'Pausar video de preparación');
        playMark.hidden = true;
        $('.video-card').classList.add('is-playing');
      } catch (_) {
        toast('No fue posible reproducir el video en este navegador.');
      }
    } else {
      video.pause();
      videoButton.innerHTML = '<span aria-hidden="true">▶</span> Ver el proceso';
      videoButton.setAttribute('aria-label', 'Reproducir video de preparación');
      playMark.hidden = false;
      $('.video-card').classList.remove('is-playing');
    }
  }
  videoButton.addEventListener('click', toggleVideo);
  $('.video-card').addEventListener('click', toggleVideo);
  video.addEventListener('ended', () => {
    videoButton.innerHTML = '<span aria-hidden="true">▶</span> Ver el proceso';
    videoButton.setAttribute('aria-label', 'Reproducir video de preparación');
    playMark.hidden = false;
    $('.video-card').classList.remove('is-playing');
  });

  if ('IntersectionObserver' in window) {
    const targets = $$('.menu-heading, .menu-visual, .product-card, .kitchen-copy, .polaroid, .local-copy h2, .local-visual, .cta-copy');
    targets.forEach((target) => target.classList.add('reveal'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .12 });
    targets.forEach((target) => observer.observe(target));

    const videoObserver = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting && !video.paused) toggleVideo();
    });
    videoObserver.observe(video);
  }

  renderProducts();
  renderCart();
})();
