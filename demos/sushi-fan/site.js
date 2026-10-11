(function(){
  'use strict';
  const menu=window.SUSHI_FAN_MENU||{revision:'pendiente',products:[]};
  const products=Array.isArray(menu.products)?menu.products:[];
  const core=window.SushiFanCartCore;
  const $=id=>document.getElementById(id);
  const storageKey='sushifan-cart-v1',revisionKey='sushifan-menu-revision';
  let cart=[],activeCategory='',lastFocus=null,toastTimer;
  const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function toast(message){const el=$('toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3200);}
  function notice(message){const el=$('cartNotice');el.textContent=message;el.hidden=false;}
  function save(){try{localStorage.setItem(storageKey,JSON.stringify(cart));localStorage.setItem(revisionKey,menu.revision);}catch{}}
  function load(){
    try{
      const raw=JSON.parse(localStorage.getItem(storageKey)||'[]');
      const normalized=core.normalizeCart(raw,products);cart=normalized.lines;
      if(normalized.changed) notice('Algunos productos cambiaron o ya no están disponibles. Revisá tu pedido.');
      const previous=localStorage.getItem(revisionKey);
      if(cart.length && previous && previous!==menu.revision) notice('La carta cambió desde tu última visita. Revisá precios y disponibilidad antes de enviar.');
      if(normalized.changed) save();
    }catch{cart=[];notice('No pudimos recuperar tu pedido anterior. Volvé a elegir tus productos.');}
  }
  function configureDemo(){
    if($('demoNotice')) $('demoNotice').hidden=!menu.demo;
    if(menu.demo){
      if($('menuFootnote')) $('menuFootnote').textContent='Carta ficticia para demostración. Las fotos y los precios son ilustrativos. WhatsApp se abre sin destinatario: elegí un contacto sólo si querés compartir la prueba.';
      $('cartEmptyText').textContent='Elegí productos de la carta de muestra para empezar tu pedido.';
      $('sendOrder').textContent='Probar pedido en WhatsApp ↗';
      $('cartDisclaimer').textContent='Demo: el mensaje se prepara sin destinatario. No es un pedido real.';
    }else{
      if($('menuFootnote')) $('menuFootnote').textContent='La carta del restó puede tener precios y disponibilidad diferentes. El local confirma el importe final por WhatsApp.';
      $('cartEmptyText').textContent='Tu tablita empieza acá. Elegí productos de la carta para armar el pedido.';
      $('sendOrder').textContent='Enviar pedido por WhatsApp ↗';
      $('cartDisclaimer').textContent='El pedido queda confirmado cuando te responde el local.';
    }
  }
  function renderMenu(){
    if(!$('menuCategories') || !$('menuProducts')) return;
    const categories=[...new Set(products.map(p=>p.category).filter(Boolean))];
    const confirmed=products.filter(p=>core.pricedProduct(p,p.variants?.find(v=>core.validPrice(v.priceCents))?.id||''));
    $('menuPending').hidden=confirmed.length>0;
    $('menuCategories').hidden=!products.length;
    if(!products.length) return;
    activeCategory=activeCategory&&categories.includes(activeCategory)?activeCategory:categories[0];
    $('menuCategories').innerHTML=categories.map(category=>`<button type="button" role="tab" aria-selected="${category===activeCategory}" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join('');
    $('menuProducts').innerHTML=products.filter(p=>p.category===activeCategory).map(p=>{
      const variants=p.variants?.length?p.variants:[];
      const firstAvailable=variants.find(v=>core.validPrice(v.priceCents));
      const price=core.pricedProduct(p,firstAvailable?.id||'');
      const options=variants.length?`<select class="variant-select" aria-label="Variante de ${escapeHtml(p.name)}">${variants.map(v=>`<option value="${escapeHtml(v.id)}" ${core.validPrice(v.priceCents)?'':'disabled'}>${escapeHtml(v.name)}${core.validPrice(v.priceCents)?' · '+escapeHtml(core.money(v.priceCents)):''}</option>`).join('')}</select>`:'';
      return `<article class="product-card" data-product="${escapeHtml(p.id)}">${menu.demo?'<span class="demo-tag">DEMO</span>':''}${p.photo?`<img src="${escapeHtml(p.photo)}" alt="${escapeHtml(p.name)}" loading="lazy">`:''}<div class="product-info"><span class="product-meta">${escapeHtml(p.pieces||p.category)}</span><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.description||'')}</p>${options}<div class="product-bottom"><strong data-price>${price?core.money(price.priceCents):'Precio a confirmar'}</strong><button type="button" data-add ${price?'':'disabled'}>Agregar al pedido</button></div></div></article>`;
    }).join('');
  }
  function renderCart(){
    const rows=core.details(cart,products);
    const count=rows.reduce((sum,row)=>sum+row.quantity,0);
    $('cartCount').textContent=count;
    document.querySelectorAll('[data-open-cart]').forEach(b=>b.setAttribute('aria-label',`Abrir pedido, ${count} ${count===1?'producto':'productos'}`));
    $('cartEmpty').hidden=rows.length>0;$('orderForm').hidden=rows.length===0;$('sendOrder').disabled=rows.length===0;
    $('cartSubtotal').textContent=core.money(core.subtotal(cart,products));
    $('cartLines').innerHTML=rows.map(row=>`<article class="cart-line" data-id="${escapeHtml(row.id)}" data-variant="${escapeHtml(row.variantId)}"><div><h3>${escapeHtml(row.product.name)}</h3><p>${row.variant?escapeHtml(row.variant.name)+' · ':''}${core.money(row.priceCents)} c/u</p><div class="cart-line-actions"><button type="button" data-quantity="-1" aria-label="Quitar una unidad de ${escapeHtml(row.product.name)}">−</button><span>${row.quantity}</span><button type="button" data-quantity="1" aria-label="Agregar una unidad de ${escapeHtml(row.product.name)}">+</button><button class="remove-line" type="button" data-remove>Eliminar</button></div></div><strong>${core.money(row.subtotalCents)}</strong></article>`).join('');
  }
  function openCart(trigger){lastFocus=trigger||document.activeElement;$('cartBackdrop').hidden=false;$('cartDrawer').inert=false;$('cartDrawer').setAttribute('aria-hidden','false');document.body.classList.add('drawer-open');requestAnimationFrame(()=>$('cartDrawer').classList.add('open'));$('cartClose').focus();}
  function closeCart(){ $('cartDrawer').classList.remove('open');document.body.classList.remove('drawer-open');$('cartBackdrop').hidden=true;$('cartDrawer').setAttribute('aria-hidden','true');$('cartDrawer').inert=true;if(lastFocus?.isConnected)lastFocus.focus(); }
  function setMode(){const delivery=document.querySelector('input[name="mode"]:checked').value==='delivery';$('deliveryFields').hidden=!delivery;$('address').required=delivery;$('shippingNote').hidden=!delivery;}
  function changeQuantity(id,variantId,delta){const line=cart.find(x=>x.id===id&&x.variantId===variantId);if(!line)return;line.quantity+=delta;if(line.quantity<1)cart=cart.filter(x=>x!==line);else line.quantity=Math.min(line.quantity,99);save();renderCart();}
  document.querySelectorAll('[data-open-cart]').forEach(button=>button.addEventListener('click',()=>openCart(button)));
  $('cartClose').addEventListener('click',closeCart);$('cartBackdrop').addEventListener('click',closeCart);
  $('exploreMenu').addEventListener('click',()=>{closeCart();if($('menuProducts')) $('carta').scrollIntoView({behavior:'smooth'});else window.location.href='carta.html#carta';});
  document.addEventListener('keydown',event=>{
    if(!$('cartDrawer').classList.contains('open'))return;
    if(event.key==='Escape'){closeCart();return;}
    if(event.key==='Tab'){
      const focusables=[...$('cartDrawer').querySelectorAll('button:not(:disabled),input:not(:disabled),textarea,select,a[href]')].filter(el=>el.getClientRects().length);
      if(!focusables.length)return;const first=focusables[0],last=focusables.at(-1);
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    }
  });
  $('menuCategories')?.addEventListener('click',event=>{const button=event.target.closest('[data-category]');if(!button)return;activeCategory=button.dataset.category;renderMenu();});
  $('menuProducts')?.addEventListener('change',event=>{const select=event.target.closest('.variant-select');if(!select)return;const card=select.closest('.product-card');const product=products.find(p=>p.id===card.dataset.product);const priced=core.pricedProduct(product,select.value);card.querySelector('[data-price]').textContent=priced?core.money(priced.priceCents):'Precio a confirmar';card.querySelector('[data-add]').disabled=!priced;});
  $('menuProducts')?.addEventListener('click',event=>{const button=event.target.closest('[data-add]');if(!button)return;const card=button.closest('.product-card'),id=card.dataset.product,variantId=card.querySelector('.variant-select')?.value||'';const product=products.find(p=>p.id===id);if(!core.pricedProduct(product,variantId))return;const line=cart.find(x=>x.id===id&&x.variantId===variantId);if(line)line.quantity=Math.min(99,line.quantity+1);else cart.push({id,variantId,quantity:1});save();renderCart();toast('Agregado a tu pedido');});
  $('cartLines').addEventListener('click',event=>{const line=event.target.closest('.cart-line');if(!line)return;const id=line.dataset.id,variantId=line.dataset.variant;if(event.target.closest('[data-remove]')){cart=cart.filter(x=>!(x.id===id&&x.variantId===variantId));save();renderCart();}else{const button=event.target.closest('[data-quantity]');if(button)changeQuantity(id,variantId,Number(button.dataset.quantity));}});
  document.querySelectorAll('input[name="mode"]').forEach(input=>input.addEventListener('change',setMode));
  $('orderForm').addEventListener('submit',event=>{
    event.preventDefault();if(!cart.length)return;
    const customer={name:$('customerName').value,mode:document.querySelector('input[name="mode"]:checked').value,address:$('address').value,reference:$('reference').value,notes:$('notes').value,demo:!!menu.demo};
    try{
      if(!menu.demo && !menu.whatsappNumber) throw new Error('Falta el número confirmado del local');
      const message=core.message(cart,products,customer);
      window.open(core.whatsappUrl(message,menu.demo?null:menu.whatsappNumber),'_blank','noopener,noreferrer');
    }
    catch{toast('Revisá los datos del pedido.');}
  });
  $('menuToggle').addEventListener('click',()=>{const open=$('mainNav').classList.toggle('open');$('menuToggle').setAttribute('aria-expanded',String(open));$('menuToggle').setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');});
  $('mainNav').addEventListener('click',event=>{if(event.target.closest('a')){$('mainNav').classList.remove('open');$('menuToggle').setAttribute('aria-expanded','false');}});
  function initPlatosScroll(){
    const section=$('platosSection'),track=$('platosTrack');
    if(!section || !track) return;
    const desktop=window.matchMedia('(min-width: 761px) and (prefers-reduced-motion: no-preference)');
    let distance=0,frame=0;
    function update(){frame=0;if(!desktop.matches)return;const left=Math.max(0,Math.min(distance,-section.getBoundingClientRect().top));track.style.transform=`translate3d(${-left}px,0,0)`;}
    function measure(){
      track.style.transform='';section.style.height='';
      if(!desktop.matches)return;
      distance=Math.max(0,track.scrollWidth-window.innerWidth);
      section.style.height=`${Math.max(window.innerHeight,600)+distance}px`;
      update();
    }
    window.addEventListener('scroll',()=>{if(!frame&&desktop.matches)frame=requestAnimationFrame(update);},{passive:true});
    window.addEventListener('resize',measure);
    desktop.addEventListener('change',measure);
    measure();
  }
  $('year').textContent=new Date().getFullYear();configureDemo();load();renderMenu();renderCart();setMode();initPlatosScroll();
})();
