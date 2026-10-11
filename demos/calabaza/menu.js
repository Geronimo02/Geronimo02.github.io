(() => {
  "use strict";
  const data = window.CALABAZA_DATA;
  const storageKey = "calabaza-centro-demo-cart-v1";
  const weekItems = data.viandas?.demoPreview || data.viandas?.enabled ? (data.viandas.weekMenu || []) : [];
  const weekProducts = weekItems.map((item, index) => ({
    id: `vianda-${data.viandas.weekStart || "muestra"}-${index}`,
    name: `Vianda ${item.day}: ${item.dish}`,
    price: item.price,
    available: Number.isFinite(item.price) && item.price >= 0,
    isVianda: true
  }));
  const products = new Map([...data.products, ...weekProducts].map((product) => [product.id, product]));
  const money = (amount) => new Intl.NumberFormat("es-AR", {
    style: "currency", currency: "ARS", maximumFractionDigits: 0
  }).format(amount);
  const menuSections = document.getElementById("menu-sections");
  const categoryList = document.querySelector(".category-list");
  const cartContent = document.getElementById("cart-content");
  const cartTotal = document.getElementById("cart-total");
  const orderPanel = document.getElementById("pedido");
  const cartBackdrop = document.getElementById("cart-backdrop");
  const cartClose = document.getElementById("cart-close");
  const headerCartLink = document.getElementById("header-cart-link");
  const mobileMedia = window.matchMedia("(max-width: 800px)");
  let cartTrigger = null;
  const reviewButton = document.getElementById("review-button");
  const cartStep = document.getElementById("cart-step");
  const reviewSection = document.getElementById("revisar");
  const checkoutScroll = document.querySelector(".checkout-scroll");
  const branchSelect = document.getElementById("order-branch");
  const branchFeedback = document.getElementById("branch-feedback");
  const destinationNote = document.getElementById("destination-note");
  const orderForm = document.getElementById("order-form");
  const modeSelect = document.getElementById("order-mode");
  const addressField = document.querySelector(".address-field");
  const addressInput = addressField.querySelector("input");
  const messagePreview = document.getElementById("message-preview");
  const mobileCart = document.getElementById("mobile-cart");
  const feedback = document.getElementById("form-feedback");
  const weekGrid = document.getElementById("week-grid");
  const weekTotal = document.getElementById("week-total");
  let cart = loadCart();
  const branches = new Map(data.branches.map((branch) => [branch.id, branch]));
  const requestedBranch = new URLSearchParams(window.location.search).get("local");
  let savedBranch = "";
  try { savedBranch = localStorage.getItem("calabaza-order-branch-v1"); } catch { /* Funciona sin almacenamiento. */ }
  if (branches.has(requestedBranch)) branchSelect.value = requestedBranch;
  else if (branches.has(savedBranch)) branchSelect.value = savedBranch;
  const selectedBranch = () => branches.get(branchSelect.value);

  function closeMobileCart(restoreFocus = true) {
    if (!document.body.classList.contains("cart-open")) return;
    document.body.classList.remove("cart-open");
    cartBackdrop.hidden = true;
    mobileCart.setAttribute("aria-expanded", "false");
    orderPanel.removeAttribute("role");
    orderPanel.removeAttribute("aria-modal");
    if (restoreFocus && cartTrigger && !cartTrigger.hidden) requestAnimationFrame(() => cartTrigger.focus());
  }
  function openMobileCart(trigger = mobileCart) {
    if (!mobileMedia.matches) {
      orderPanel.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    cartTrigger = trigger;
    cartBackdrop.hidden = false;
    document.body.classList.add("cart-open");
    mobileCart.setAttribute("aria-expanded", "true");
    orderPanel.setAttribute("role", "dialog");
    orderPanel.setAttribute("aria-modal", "true");
    requestAnimationFrame(() => cartClose.focus());
    setTimeout(() => {
      if (document.body.classList.contains("cart-open") && !orderPanel.contains(document.activeElement)) cartClose.focus();
    }, 350);
  }
  mobileCart.addEventListener("click", () => openMobileCart(mobileCart));
  headerCartLink.addEventListener("click", (event) => {
    if (mobileMedia.matches) {
      event.preventDefault();
      openMobileCart(headerCartLink);
    }
  });
  cartClose.addEventListener("click", () => closeMobileCart());
  cartBackdrop.addEventListener("click", () => closeMobileCart());
  mobileMedia.addEventListener("change", (event) => {
    if (!event.matches) closeMobileCart(false);
  });
  document.addEventListener("keydown", (event) => {
    if (!document.body.classList.contains("cart-open")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeMobileCart();
    } else if (event.key === "Tab") {
      const focusable = [...orderPanel.querySelectorAll("button:not([disabled]),select,input,textarea,a[href]")]
        .filter((item) => item.getClientRects().length);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!orderPanel.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  function loadCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (!Array.isArray(saved)) return {};
      const valid = {};
      for (const item of saved) {
        const product = products.get(item.id);
        if (product?.available && Number.isSafeInteger(item.qty) && item.qty > 0 && item.qty <= (product.isVianda ? 1 : 99)) {
          valid[item.id] = { qty: item.qty, note: typeof item.note === "string" ? item.note.slice(0, 180) : "" };
        }
      }
      return valid;
    } catch { return {}; }
  }
  function saveCart() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(Object.entries(cart).map(([id, item]) => ({ id, qty: item.qty, note: item.note }))));
    } catch { /* La demo también funciona sin almacenamiento disponible. */ }
  }
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function renderMenu() {
    data.categories.forEach((category) => {
      const link = el("a", "", category.label);
      link.href = "#" + category.id;
      categoryList.append(link);
      const section = el("section", "menu-category");
      section.id = category.id;
      section.setAttribute("aria-labelledby", category.id + "-title");
      const titleRow = el("div", "category-title");
      const title = el("h2", "", category.label);
      title.id = category.id + "-title";
      titleRow.append(title, el("span", "", "Productos de muestra"));
      section.append(titleRow);
      const grid = el("div", "product-grid");
      data.products.filter((product) => product.category === category.id).forEach((product, index) => {
        const card = el("article", "product-card");
        card.id = "product-" + product.id;
        const visual = el("div", "product-visual");
        if (product.image) {
          visual.classList.add("has-photo");
          const photo = el("img");
          photo.src = product.image;
          photo.alt = product.imageAlt + ". Foto ilustrativa: no corresponde a un plato confirmado de Calabaza.";
          photo.loading = "lazy";
          visual.append(photo);
        }
        visual.append(el("span", "visual-index", String(index + 1).padStart(2, "0")));
        visual.append(el("span", "visual-caption", product.image ? "FOTO ILUSTRATIVA" : "FOTO PENDIENTE"));
        const body = el("div", "product-body");
        const info = el("div", "product-info");
        info.append(el("span", "sample-tag", "Dato de muestra"), el("h3", "", product.name), el("p", "", product.description));
        const actions = el("div", "product-actions");
        actions.append(el("span", "price", money(product.price)));
        if (product.available) {
          const button = el("button", "add-button", "Agregar");
          button.type = "button";
          button.setAttribute("aria-label", "Agregar " + product.name);
          button.addEventListener("click", () => changeQty(product.id, 1));
          actions.append(button);
        } else {
          card.classList.add("is-sold-out");
          actions.append(el("span", "product-soldout", "Agotado"));
        }
        body.append(info, actions);
        card.append(visual, body);
        grid.append(card);
      });
      section.append(grid);
      menuSections.append(section);
    });
    if (data.products.some((product) => product.available && product.roulette)) {
      const rouletteLink = el("a", "week-nav-link", "Ruleta de platos");
      rouletteLink.href = "#ruleta";
      categoryList.append(rouletteLink);
    }
    if (data.viandas.demoPreview || data.viandas.enabled) {
      const weekLink = el("a", "week-nav-link", "Viandas de muestra");
      weekLink.href = "#armar-semana";
      categoryList.append(weekLink);
    }
  }
  function renderWeekMenu() {
    const weekSection = document.getElementById("armar-semana");
    if ((!data.viandas.demoPreview && !data.viandas.enabled) || !weekItems.length) {
      weekSection.hidden = true;
      return;
    }
    const start = data.viandas.weekStart ? new Date(data.viandas.weekStart + "T12:00:00") : null;
    const hasDates = start && !Number.isNaN(start.getTime());
    const toggle = document.getElementById("week-toggle");
    const weekFeedback = document.getElementById("week-feedback");
    const choices = [];
    const updateWeekSummary = () => {
      const selected = choices.filter((input) => input.checked);
      const inCart = choices.filter((input) => Boolean(cart[input.value]));
      const changed = choices.some((input) => input.checked !== Boolean(cart[input.value]));
      weekTotal.textContent = money(selected.reduce((sum, input) => sum + products.get(input.value).price, 0));
      toggle.disabled = !changed;
      toggle.textContent = selected.length
        ? changed ? `${inCart.length ? "Actualizar" : "Agregar"} ${selected.length} ${selected.length === 1 ? "día" : "días"} al pedido` : `${selected.length} ${selected.length === 1 ? "día" : "días"} en el pedido`
        : inCart.length ? "Quitar viandas del pedido" : "Elegí días para continuar";
      weekFeedback.textContent = selected.length
        ? `${selected.length} ${selected.length === 1 ? "día elegido" : "días elegidos"}. ${changed ? "Actualizá el ticket para consultar por WhatsApp." : "Ya están en el ticket de muestra."}`
        : inCart.length ? "Actualizá el ticket para quitar las viandas." : "Elegí solo los días que querés, por ejemplo lunes, miércoles y viernes.";
    };
    weekItems.forEach((item, index) => {
      const card = el("article", "week-day");
      const heading = el("div", "week-day-heading");
      heading.append(el("span", "", item.day));
      if (hasDates) {
        const date = new Date(start);
        date.setDate(start.getDate() + index);
        const time = el("time", "", date.toLocaleDateString("es-AR", { day: "2-digit", month: "short" }));
        time.dateTime = date.toISOString().slice(0, 10);
        heading.append(time);
      }
      const product = weekProducts[index];
      const choiceLabel = el("label", "week-select");
      const choice = el("input", "week-day-choice");
      choice.type = "checkbox";
      choice.value = product.id;
      choice.checked = Boolean(cart[product.id]);
      choice.disabled = !product.available;
      choice.setAttribute("aria-label", `Elegir vianda del ${item.day}: ${item.dish}`);
      choiceLabel.append(choice, el("span", "", "Elegir"));
      heading.append(choiceLabel);
      card.append(heading, el("h3", "week-dish", item.dish), el("p", "week-detail", item.detail));
      card.append(el("strong", "week-day-price", Number.isFinite(item.price) ? money(item.price) : "Precio pendiente"));
      card.classList.toggle("is-selected", choice.checked);
      choice.addEventListener("change", () => {
        card.classList.toggle("is-selected", choice.checked);
        choiceLabel.querySelector("span").textContent = choice.checked ? "Elegido" : "Elegir";
        updateWeekSummary();
      });
      choiceLabel.querySelector("span").textContent = choice.checked ? "Elegido" : "Elegir";
      choices.push(choice);
      weekGrid.append(card);
    });
    toggle.addEventListener("click", () => {
      choices.forEach((input) => {
        if (input.checked) cart[input.value] = { qty: 1, note: cart[input.value]?.note || "" };
        else delete cart[input.value];
      });
      saveCart();
      renderCart();
      updateWeekSummary();
      if (choices.some((input) => input.checked)) openMobileCart(toggle);
    });
    updateWeekSummary();
  }
  function renderRoulette() {
    const options = data.products.filter((product) => product.available && product.roulette).slice(0, 8);
    const canvas = document.getElementById("roulette-canvas");
    const ctx = canvas.getContext("2d");
    const wheel = document.getElementById("roulette-wheel");
    const spinButton = document.getElementById("roulette-spin");
    const result = document.getElementById("roulette-result");
    if (!ctx || !options.length) {
      document.getElementById("ruleta").hidden = true;
      return;
    }
    const colors = ["#672d38", "#aa634a", "#343c36", "#a8864b", "#4f6051", "#4f4562"];
    const center = canvas.width / 2;
    const arc = Math.PI * 2 / options.length;
    options.forEach((product, index) => {
      const start = -Math.PI / 2 - arc / 2 + index * arc;
      const middle = start + arc / 2;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, center - 4, start, start + arc);
      ctx.closePath();
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();
      ctx.strokeStyle = "#f7f5ef";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.save();
      ctx.fillStyle = "#fff";
      ctx.font = "700 27px Manrope, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "#0006";
      ctx.shadowBlur = 5;
      ctx.fillText(product.wheelLabel || product.name, center + Math.cos(middle) * 185, center + Math.sin(middle) * 185, 155);
      ctx.restore();
    });
    let rotation = 0;
    let spinning = false;
    spinButton.addEventListener("click", () => {
      if (spinning) return;
      spinning = true;
      spinButton.disabled = true;
      spinButton.textContent = "Girando…";
      result.hidden = true;
      const winnerIndex = Math.floor(Math.random() * options.length);
      const segmentDegrees = 360 / options.length;
      const current = ((rotation % 360) + 360) % 360;
      const target = (360 - winnerIndex * segmentDegrees) % 360;
      rotation += 360 * 5 + ((target - current + 360) % 360);
      const winner = options[winnerIndex];
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (window.innerWidth <= 800) wheel.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
      const finish = () => {
        const photo = winner.image ? el("img") : null;
        if (photo) {
          photo.src = winner.image;
          photo.alt = (winner.imageAlt || winner.name) + ". Foto ilustrativa.";
        }
        const copy = el("div");
        copy.append(el("span", "sample-tag", "Resultado de muestra"), el("h3", "", winner.name), el("p", "", winner.description));
        const add = el("button", "roulette-add", "Agregar al pedido de muestra");
        add.type = "button";
        add.addEventListener("click", () => {
          changeQty(winner.id, 1);
          add.textContent = "Agregado al pedido ";
          const check = document.createElement("span");
          check.className = "icon-check";
          check.setAttribute("aria-hidden", "true");
          add.append(check);
        });
        copy.append(add);
        result.classList.toggle("no-photo", !photo);
        result.replaceChildren(...(photo ? [photo, copy] : [copy]));
        result.hidden = false;
        if (window.innerWidth <= 800) result.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
        spinButton.disabled = false;
        spinButton.textContent = "Girar otra vez ";
        const arrow = document.createElement("span");
        arrow.className = "icon-arrow";
        arrow.setAttribute("aria-hidden", "true");
        spinButton.append(arrow);
        spinning = false;
      };
      wheel.style.transform = `rotate(${rotation}deg)`;
      if (reducedMotion) finish();
      else wheel.addEventListener("transitionend", finish, { once: true });
    });
  }
  function changeQty(id, delta) {
    const product = products.get(id);
    if (!product?.available) return;
    const next = Math.max(0, Math.min(99, (cart[id]?.qty || 0) + delta));
    if (!next) delete cart[id];
    else cart[id] = { qty: next, note: cart[id]?.note || "" };
    saveCart();
    renderCart();
  }
  function subtotal() {
    return Object.entries(cart).reduce((total, [id, item]) => total + products.get(id).price * item.qty, 0);
  }
  function renderCart() {
    cartContent.replaceChildren();
    const entries = Object.entries(cart);
    if (!entries.length) {
      const empty = el("div", "cart-empty");
      const image = el("img");
      image.src = "img/optimized/mascota-base.png";
      image.alt = "";
      empty.append(image, el("p", "", "Todavía no agregaste productos de muestra."));
      cartContent.append(empty);
    }
    for (const [id, item] of entries) {
      const product = products.get(id);
      const row = el("div", "cart-item");
      const head = el("div", "cart-item-head");
      head.append(el("span", "", product.name), el("span", "", money(product.price * item.qty)));
      const qty = el("div", "qty-row");
      if (product.isVianda) qty.append(el("span", "week-cart-count", "1 vianda"));
      else {
        const minus = el("button", "", "−");
        minus.type = "button";
        minus.setAttribute("aria-label", "Quitar una unidad de " + product.name);
        minus.addEventListener("click", () => changeQty(id, -1));
        const plus = el("button", "", "+");
        plus.type = "button";
        plus.setAttribute("aria-label", "Agregar una unidad de " + product.name);
        plus.disabled = item.qty >= 99;
        plus.addEventListener("click", () => changeQty(id, 1));
        qty.append(minus, el("span", "", String(item.qty)), plus);
      }
      const remove = el("button", "remove-button", "Quitar");
      remove.type = "button";
      remove.setAttribute("aria-label", "Quitar " + product.name + " del pedido");
      remove.addEventListener("click", () => {
        delete cart[id];
        saveCart();
        renderCart();
        if (product.isVianda) {
          const choice = [...weekGrid.querySelectorAll(".week-day-choice")].find((input) => input.value === id);
          if (choice) {
            choice.checked = false;
            choice.dispatchEvent(new Event("change"));
          }
        }
      });
      qty.append(remove);
      const note = el("label", "cart-note-label", "Observación para este producto");
      const input = el("input", "cart-note");
      input.type = "text";
      input.maxLength = 180;
      input.placeholder = "Opcional";
      input.value = item.note;
      input.addEventListener("input", () => { cart[id].note = input.value; saveCart(); updateMessage(); });
      note.append(input);
      row.append(head, el("span", "sample-tag", "Muestra"), qty, note);
      cartContent.append(row);
    }
    const total = money(subtotal());
    cartTotal.textContent = total;
    reviewButton.disabled = !entries.length;
    mobileCart.hidden = !entries.length;
    mobileCart.querySelector("span").textContent = total;
    if (!entries.length) {
      reviewSection.hidden = true;
      cartStep.hidden = false;
      orderPanel.classList.remove("is-reviewing");
      orderPanel.setAttribute("aria-labelledby", "order-title");
      closeMobileCart(false);
    }
    updateMessage();
  }
  function message() {
    const form = new FormData(orderForm);
    const name = String(form.get("name") || "").trim();
    const mode = String(form.get("mode") || "retiro");
    const address = String(form.get("address") || "").trim();
    const notes = String(form.get("notes") || "").trim();
    const branch = selectedBranch();
    const lines = [`Hola, ${branch?.name || "Calabaza"}. Quisiera consultar por este pedido de la carta de muestra:`, ""];
    for (const [id, item] of Object.entries(cart)) {
      const product = products.get(id);
      lines.push(`• ${item.qty} × ${product.name} — ${money(item.qty * product.price)}`);
      if (item.note.trim()) lines.push("  Observación: " + item.note.trim());
    }
    lines.push("", "Subtotal de muestra: " + money(subtotal()));
    if (branch) lines.push("Sucursal: " + branch.name + " — " + branch.address);
    lines.push("Modalidad (sin confirmar): " + (mode === "envio" ? "Envío" : "Retiro"));
    if (name) lines.push("Nombre: " + name);
    if (mode === "envio" && address) lines.push("Dirección: " + address);
    if (notes) lines.push("Observaciones: " + notes);
    lines.push("", "Los platos y precios de la web son de muestra. ¿Me confirman disponibilidad, modalidad, precio final y horario antes de tomar el pedido?");
    return lines.join("\n");
  }
  function updateMessage() {
    messagePreview.textContent = message();
    const branch = selectedBranch();
    destinationNote.textContent = branch
      ? `Se abrirá WhatsApp de ${branch.name} (${branch.whatsappDisplay}). Revisá el mensaje y tocá Enviar allí. Disponibilidad, precio final, modalidad y horario requieren confirmación.`
      : "Elegí una sucursal en el ticket para preparar el destino de WhatsApp.";
  }
  branchSelect.addEventListener("change", () => {
    try { localStorage.setItem("calabaza-order-branch-v1", branchSelect.value); } catch { /* Funciona sin almacenamiento. */ }
    branchFeedback.textContent = "";
    updateMessage();
  });
  reviewButton.addEventListener("click", () => {
    if (!selectedBranch()) {
      branchFeedback.textContent = "Elegí Belgrano o Centro antes de continuar.";
      branchSelect.focus();
      return;
    }
    cartStep.hidden = true;
    reviewSection.hidden = false;
    orderPanel.classList.add("is-reviewing");
    orderPanel.setAttribute("aria-labelledby", "review-title");
    checkoutScroll.scrollTop = 0;
    if (!mobileMedia.matches) {
      const menuTop = orderPanel.parentElement.getBoundingClientRect().top + window.scrollY - 25;
      window.scrollTo({ top: menuTop, behavior: "smooth" });
    }
    orderForm.elements.name.focus({ preventScroll: true });
  });
  document.getElementById("close-review").addEventListener("click", () => {
    reviewSection.hidden = true;
    cartStep.hidden = false;
    orderPanel.classList.remove("is-reviewing");
    orderPanel.setAttribute("aria-labelledby", "order-title");
    reviewButton.focus({ preventScroll: true });
  });
  modeSelect.addEventListener("change", () => {
    const delivery = modeSelect.value === "envio";
    addressField.hidden = !delivery;
    addressInput.required = delivery;
    updateMessage();
  });
  orderForm.addEventListener("input", updateMessage);
  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!Object.keys(cart).length || !orderForm.reportValidity()) return;
    const branch = selectedBranch();
    if (!branch) {
      feedback.textContent = "Elegí una sucursal en el ticket antes de abrir WhatsApp.";
      branchSelect.focus();
      return;
    }
    const number = String(branch.whatsappNumber || "").replace(/\D/g, "");
    if (!/^\d{10,15}$/.test(number)) {
      feedback.textContent = "No se pudo abrir WhatsApp. Copiá el mensaje para consultar al restaurante.";
      return;
    }
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message())}`;
    window.open(url, "_blank", "noopener,noreferrer");
    feedback.textContent = `Se abrió WhatsApp de ${branch.name} con el mensaje preparado. Revisalo y tocá Enviar allí.`;
  });
  document.getElementById("copy-message").addEventListener("click", async () => {
    if (!orderForm.reportValidity()) return;
    try {
      await navigator.clipboard.writeText(message());
      feedback.textContent = "Mensaje copiado. Pegalo en WhatsApp para consultarlo con el restaurante.";
    } catch {
      feedback.textContent = "No se pudo copiar automáticamente. Podés seleccionar el texto de la vista previa.";
    }
  });
  renderMenu();
  renderRoulette();
  renderWeekMenu();
  renderCart();
})();
