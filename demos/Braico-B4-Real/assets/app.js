(function(){
  'use strict';
  const products = window.BRAICO_CATALOG || [];
  const categories = window.BRAICO_CATEGORIES || {};
  const productsById = Object.fromEntries(products.map(p=>[p.id,p]));
  const storageKey = 'braico-signature-demo-cart-v1';
  const $ = s => document.querySelector(s);
  const results = $('#menu-results');
  const title = $('#results-title');
  const count = $('#results-count');
  const moreWrap = $('#more-wrap');
  const moreBtn = $('#show-more');
  const searchInput = $('#menu-search');
  const cartPanel = $('#cart-panel');
  const scrim = $('#cart-scrim');
  const cartItems = $('#cart-items');
  const noteField = $('#order-note');
  const copyBtn = $('#copy-order');
  const shareLink = $('#share-order');
  const toast = $('#toast');
  const orderDetails = $('#order-details');
  const orderMethod = $('#order-method');
  const orderAddress = $('#order-address');
  const cartLiveStatus = $('#cart-live-status');
  const cartReady = $('#cart-ready');
  const progressDots = [...document.querySelectorAll('.cart-progress-dot')];
  let currentCategory = 'h';
  let expanded = false;
  let searchText = '';
  let cart = {};
  let previousFocus = null;
  let toastTimer;

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey)||'{}');
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      Object.entries(saved).forEach(([id,qty])=>{
        if(productsById[id] && Number.isInteger(qty) && qty > 0 && qty <= 99) cart[id] = qty;
      });
    }
  } catch (_) { /* modo local privado o almacenamiento bloqueado */ }

  function normalized(value){return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
  function el(tag,cls,txt){
    const node=document.createElement(tag);
    if(cls) node.className=cls;
    if(txt !== undefined) node.textContent=txt;
    return node;
  }
  function notice(msg){
    toast.textContent=msg;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>toast.classList.remove('visible'),2700);
  }
  function stored(){try {localStorage.setItem(storageKey,JSON.stringify(cart));}catch (_) {}}
  function quantity(){return Object.values(cart).reduce((a,b)=>a+b,0);}
  function updateFilterButtons(){
    document.querySelectorAll('[data-filter]').forEach(button=>{
      const selected=button.dataset.filter === currentCategory;
      button.setAttribute('aria-pressed',selected?'true':'false');
      button.classList.toggle('active',selected);
    });
  }

  function makeCard(p,index){
    const card=el('article','menu-item');
    const number=el('span','item-index',String(index+1).padStart(2,'0'));
    const info=el('div','item-main');
    info.append(el('span','item-tag',p.badge),el('h3','',p.name),el('p','',p.desc),el('small','','PRECIO Y DISPONIBILIDAD A CONFIRMAR'));
    const button=el('button','add-item','+');
    button.type='button'; button.dataset.add=p.id;
    button.setAttribute('aria-label',`Agregar ${p.name} a mi selección`);
    button.title=`Agregar ${p.name}`;
    card.append(number,info,button);
    return card;
  }
  function makeNoResults(isPicadas){
    const container=el('div','menu-empty');
    if(isPicadas){
      container.append(el('h3','','¿UNA PICADA?'),el('p','','Braico ofrece picadas, pero la carta compartida no detalla tamaños ni precios. Podés preparar una consulta sin inventar combinaciones.'));
      const button=el('button','','PREPARAR CONSULTA POR PICADAS ↗︎');
      button.type='button';button.addEventListener('click',()=>{
        noteField.value='Quisiera consultar por las picadas disponibles, tamaños y precios.';
        openCart();
        noteField.focus();
      });
      container.append(button);
    }else{
      container.append(el('h3','','NO ENCONTRAMOS ESA COMBINACIÓN.'),el('p','','Probá buscando otro nombre o volvé a las categorías de la carta.'));
      const button=el('button','','VOLVER A LOS HOMENAJES ↗︎');
      button.type='button';button.addEventListener('click',()=>{searchInput.value='';setCategory('h');});
      container.append(button);
    }
    return container;
  }
  function renderMenu(){
    updateFilterButtons();
    results.replaceChildren();
    if(currentCategory==='p' && !searchText){
      title.textContent='PICADAS / CONSULTAR';count.textContent='SIN LISTA DE PRODUCTOS VALIDADA';
      results.append(makeNoResults(true));moreWrap.hidden=true;return;
    }
    const data = products.filter(p=>
      (currentCategory==='all' || p.cat===currentCategory) &&
      (!searchText || normalized(`${p.name} ${p.desc} ${p.badge}`).includes(normalized(searchText)))
    );
    const hasMore=data.length>9 && !searchText;
    const visible=(!expanded && hasMore)?data.slice(0,9):data;
    const frag=document.createDocumentFragment();
    visible.forEach((p,index)=>frag.append(makeCard(p,index)));
    if(!data.length)frag.append(makeNoResults(false));
    results.append(frag);
    title.textContent=searchText ? `RESULTADOS DE «${searchText.toLocaleUpperCase('es-AR')}»` : (categories[currentCategory]||'').toLocaleUpperCase('es-AR');
    count.textContent=`${visible.length} DE ${data.length} OPCIONES`;
    moreWrap.hidden=!(data.length>9 && !searchText);
    moreBtn.innerHTML='';
    moreBtn.append(document.createTextNode(expanded?'VER MENOS':'VER LAS '+data.length+' OPCIONES'));
    moreBtn.append(el('span','','↘︎'));
  }
  function setCategory(cat){
    if(!categories[cat])return;
    currentCategory=cat;expanded=false;searchText='';searchInput.value='';renderMenu();
  }
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>setCategory(button.dataset.filter)));
  document.querySelectorAll('[data-jump-cat]').forEach(button=>button.addEventListener('click',()=>{
    setCategory(button.dataset.jumpCat);
    $('#menu-tools').scrollIntoView({behavior:'smooth',block:'start'});
  }));
  document.querySelectorAll('[data-story-to-menu]').forEach(a=>a.addEventListener('click',()=>setCategory('h')));
  searchInput.addEventListener('input',()=>{
    searchText=searchInput.value.trim().slice(0,80);expanded=false;
    if(searchText)currentCategory='all';
    renderMenu();
  });
  moreBtn.addEventListener('click',()=>{
    expanded=!expanded;renderMenu();
    if(!expanded) $('#results-title').scrollIntoView({behavior:'smooth',block:'start'});
  });
  results.addEventListener('click',e=>{
    const button=e.target.closest('[data-add]');
    if(!button)return;
    addProduct(button.dataset.add);
  });
  function addProduct(id){
    const p=productsById[id];if(!p)return;
    cart[id]=Math.min(99,(cart[id]||0)+1);
    stored();renderCart();notice(`${p.name} agregado a tu selección`);
  }
  function renderCart(){
    const q=quantity();
    syncOrderFields();
    document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=q);
    $('#cart-qty').textContent=q;
    cartItems.replaceChildren();
    const entries=Object.entries(cart).filter(([id,qty])=>productsById[id]&&qty>0);
    const hasProducts=entries.length>0;
    if(!entries.length){
      const empty=el('div','cart-empty');
      empty.append(el('div','empty-glyph','✳︎'),el('h3','','TODA BUENA ELECCIÓN EMPIEZA ACÁ.'),el('p','','Sumá algún sándwich de la carta para preparar tu consulta.'));
      cartItems.append(empty);
    }else{
      const animateItems=!orderDetails.contains(document.activeElement);
      entries.forEach(([id,qty])=>{
        const product=productsById[id];
        const card=el('div',animateItems?'cart-item cart-item-new':'cart-item');
        const details=el('div','');
        details.append(el('h3','',product.name),el('span','','PRECIO A CONFIRMAR'));
        const controls=el('div','qty-controls');
        const minus=el('button','','−');minus.type='button';minus.dataset.dec=id;minus.setAttribute('aria-label',`Restar una unidad de ${product.name}`);
        const plus=el('button','','+');plus.type='button';plus.dataset.inc=id;plus.setAttribute('aria-label',`Sumar una unidad de ${product.name}`);
        controls.append(minus,el('strong','',qty),plus);
        card.append(details,controls);cartItems.append(card);
      });
    }
    const ready=hasProducts && orderDetails.checkValidity();
    const filledFields=[...orderDetails.elements].filter(field=>field.name && field.value.trim()).length;
    const detailsStep=filledFields >= 4;
    progressDots.forEach((dot,index)=>dot.classList.toggle('is-active',index===0 || (index===1 && hasProducts) || (index===2 && ready)));
    cartLiveStatus.textContent=hasProducts ? `${q} ${q===1?'PRODUCTO':'PRODUCTOS'} · DATOS DEL PEDIDO` : 'ELEGÍ TUS PRODUCTOS PARA EMPEZAR';
    cartReady.textContent=ready?'¡Listo! Revisá la consulta y compartila por WhatsApp.':detailsStep?'Falta completar algún dato obligatorio.':'Completá tus datos para preparar la consulta.';
    cartReady.classList.toggle('is-complete',ready);
    copyBtn.disabled=!ready;
    if(ready){
      shareLink.removeAttribute('aria-disabled');
      shareLink.href='https://api.whatsapp.com/send?text='+encodeURIComponent(orderMessage());
    }else{
      shareLink.setAttribute('aria-disabled','true');shareLink.removeAttribute('href');
    }
  }
  function syncOrderFields(){
    const delivery=orderMethod.value==='Envío a domicilio';
    orderAddress.closest('label').hidden=!delivery;
    orderAddress.required=delivery;
    orderAddress.placeholder=delivery?'Calle, número, barrio y localidad':'Completá solo si pedís envío';
  }
  cartItems.addEventListener('click',e=>{
    const btn=e.target.closest('[data-inc],[data-dec]');if(!btn)return;
    const id=btn.dataset.inc||btn.dataset.dec;
    if(btn.hasAttribute('data-inc'))cart[id]=Math.min(99,(cart[id]||0)+1);
    else {cart[id]=Math.max(0,(cart[id]||0)-1);if(!cart[id])delete cart[id];}
    stored();renderCart();
  });
  function orderMessage(){
    const entries=Object.entries(cart).filter(([id,q])=>productsById[id]&&q>0);
    const data=new FormData(orderDetails);
    const lines=['Hola, quería consultar por estos productos de Braico (carta de referencia: diciembre 2025):','',
      `Nombre: ${data.get('name')}`,
      `WhatsApp / teléfono: ${data.get('phone')}`,
      `Modalidad: ${data.get('method')}`,
      `Para cuándo: ${data.get('when')}`];
    if(data.get('address'))lines.push(`Dirección: ${data.get('address')}`);
    lines.push('','DETALLE DEL PEDIDO:');
    if(entries.length){entries.forEach(([id,q])=>lines.push(`• ${q} x ${productsById[id].name}`));}
    const notes=noteField.value.trim();if(notes)lines.push('',`Indicaciones: ${notes}`);
    lines.push('','¿Me confirman disponibilidad, precios actualizados y cómo puedo hacer el pedido? ¡Gracias!');
    return lines.join('\n');
  }
  async function copyMessage(){
    if(!orderDetails.reportValidity() || !quantity())return;
    const text=orderMessage();
    let done=false;
    if(navigator.clipboard && window.isSecureContext){
      try {await navigator.clipboard.writeText(text);done=true;}catch (_){}
    }
    if(!done){
      const hidden=document.createElement('textarea');hidden.value=text;hidden.style.position='fixed';hidden.style.opacity='0';hidden.style.pointerEvents='none';
      document.body.append(hidden);hidden.focus();hidden.select();
      try{done=document.execCommand('copy');}catch (_){}
      hidden.remove();
    }
    notice(done?'Mensaje copiado. Elegí un contacto para enviarlo.':'No se pudo copiar automáticamente. Seleccioná el texto desde WhatsApp.');
  }
  copyBtn.addEventListener('click',copyMessage);
  orderDetails.addEventListener('input',renderCart);
  orderMethod.addEventListener('change',renderCart);
  function focusables(){return Array.from(cartPanel.querySelectorAll('button:not(:disabled),a[href],input,select,textarea')).filter(n=>n.offsetParent!==null && n.getAttribute('aria-disabled')!=='true');}
  function dialogKey(e){
    if(e.key==='Escape'){closeCart();return;}
    if(e.key!=='Tab')return;
    const els=focusables();if(!els.length)return;
    const first=els[0],last=els[els.length-1];
    if(e.shiftKey && document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus();}
  }
  function openCart(){
    previousFocus=document.activeElement;
    scrim.hidden=false;cartPanel.hidden=false;cartPanel.setAttribute('aria-hidden','false');
    document.body.classList.add('cart-open');renderCart();
    document.addEventListener('keydown',dialogKey);$('#close-cart').focus();
  }
  function closeCart(){
    cartPanel.hidden=true;scrim.hidden=true;cartPanel.setAttribute('aria-hidden','true');
    document.body.classList.remove('cart-open');document.removeEventListener('keydown',dialogKey);
    if(previousFocus && previousFocus.isConnected)previousFocus.focus();
  }
  $('#open-cart').addEventListener('click',openCart);
  $('#open-cart-mobile').addEventListener('click',openCart);
  $('#close-cart').addEventListener('click',closeCart);
  scrim.addEventListener('click',closeCart);
  // Proteger demo contra una falsa confirmación de pedido.
  shareLink.addEventListener('click',e=>{
    if(shareLink.getAttribute('aria-disabled')==='true' || !orderDetails.reportValidity() || !quantity()){e.preventDefault();return;}
    // El enlace de compartir no contiene ningún número de destino.
    shareLink.href='https://api.whatsapp.com/send?text='+encodeURIComponent(orderMessage());
  });

  // Signature Braico: fichero interactivo de nombres reales. Es el mismo inventario que usa el carrito.
  const homenajeProducts=products.filter(p=>p.cat==='h');
  const homenajeIndexButtons=$('#homenaje-names');
  const homenajeName=$('#homenaje-name');
  const homenajeDesc=$('#homenaje-desc');
  const homenajePosition=$('#homenaje-position');
  const homenajeAdd=$('#homenaje-add');
  let homenajeIndex=0;
  function renderHomenaje(scrollChips=false){
    const p=homenajeProducts[homenajeIndex];
    if(!p)return;
    homenajeName.textContent=p.name.toLocaleUpperCase('es-AR');
    homenajeDesc.textContent=p.desc;
    homenajePosition.textContent=`${String(homenajeIndex+1).padStart(2,'0')} / ${String(homenajeProducts.length).padStart(2,'0')}`;
    homenajeAdd.dataset.homenajeAdd=p.id;
    homenajeAdd.setAttribute('aria-label',`Agregar ${p.name} a mi selección`);
    if(scrollChips){
      const card=$('#ticket-flip');
      const nameBox=card.querySelector('.counter-name-box');
      nameBox.classList.remove('b3-turning');homenajePosition.classList.remove('b3-turning');
      void nameBox.offsetWidth; // reiniciar keyframes sin retrasar contenido accesible
      nameBox.classList.add('b3-turning');homenajePosition.classList.add('b3-turning');
    }
    homenajeIndexButtons.querySelectorAll('button').forEach((b,index)=>{
      const active=index===homenajeIndex;
      b.setAttribute('aria-pressed',String(active));
      if(active && scrollChips){
        const left=b.offsetLeft-homenajeIndexButtons.offsetLeft-homenajeIndexButtons.clientWidth/2+b.offsetWidth/2;
        homenajeIndexButtons.scrollTo({left:Math.max(0,left),behavior:'smooth'});
      }
    });
  }
  homenajeProducts.forEach((p,index)=>{
    const button=el('button','',p.name.toLocaleUpperCase('es-AR'));
    button.type='button';button.setAttribute('aria-label',`Ver ingredientes de ${p.name}`);
    button.addEventListener('click',()=>{homenajeIndex=index;renderHomenaje(true);});
    homenajeIndexButtons.append(button);
  });
  $('#homenaje-prev').addEventListener('click',()=>{homenajeIndex=(homenajeIndex-1+homenajeProducts.length)%homenajeProducts.length;renderHomenaje(true);});
  $('#homenaje-next').addEventListener('click',()=>{homenajeIndex=(homenajeIndex+1)%homenajeProducts.length;renderHomenaje(true);});
  homenajeAdd.addEventListener('click',()=>addProduct(homenajeProducts[homenajeIndex].id));
  renderHomenaje();
  const cateringForm=$('#catering-form');
  const cateringStatus=$('#catering-status');
  if(cateringForm){
    cateringForm.addEventListener('submit',e=>{
      e.preventDefault();
      if(!cateringForm.reportValidity())return;
      const data=new FormData(cateringForm);
      const date=String(data.get('date')||'').split('-').reverse().join('/');
      const lines=[
        'Hola, quería consultar por catering en Braico.',
        '',
        `Tipo de evento: ${data.get('event')}`,
        `Fecha estimada: ${date}`,
        `Cantidad de personas: ${data.get('guests')}`,
        `Nombre: ${data.get('name')}`,
        `Contacto: ${data.get('contact')}`
      ];
      const details=String(data.get('details')||'').trim();
      if(details)lines.push(`Consulta: ${details}`);
      lines.push('','¿Me cuentan qué opciones, disponibilidad y presupuesto tienen? ¡Gracias!');
      const whatsappUrl='https://api.whatsapp.com/send?text='+encodeURIComponent(lines.join('\n'));
      cateringStatus.textContent='Abriendo WhatsApp con tu consulta…';
      window.open(whatsappUrl,'_blank','noopener,noreferrer');
    });
  }
  const recipeAdd=$('#recipe-add');
  if(recipeAdd)recipeAdd.addEventListener('click',()=>addProduct('h-carlitos'));
  renderMenu();renderCart();
})();
