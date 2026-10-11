(function(root){
  'use strict';
  const wholeCurrency = new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',minimumFractionDigits:0,maximumFractionDigits:0});
  const fractionalCurrency = new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',minimumFractionDigits:2,maximumFractionDigits:2});
  const money = cents => (cents%100===0?wholeCurrency:fractionalCurrency).format(cents/100);
  const validPrice = value => Number.isSafeInteger(value) && value >= 0;
  const variantFor = (product,variantId) => product.variants?.find(v => v.id === variantId) || null;
  function pricedProduct(product,variantId){
    if(!product) return null;
    if(product.variants?.length){const variant=variantFor(product,variantId);return variant && validPrice(variant.priceCents)?{product,variant,priceCents:variant.priceCents}:null;}
    return !variantId && validPrice(product.priceCents)?{product,variant:null,priceCents:product.priceCents}:null;
  }
  function normalizeCart(raw,products){
    if(!Array.isArray(raw)) return {lines:[],changed:!!raw};
    const merged=new Map();let changed=false;
    for(const entry of raw){
      const product=products.find(p=>p.id===entry?.id);
      const variantId=typeof entry?.variantId==='string'?entry.variantId:'';
      const priced=pricedProduct(product,variantId);
      const qty=Number.isSafeInteger(entry?.quantity)?entry.quantity:0;
      if(!priced || qty<1 || qty>99){changed=true;continue;}
      const key=entry.id+'::'+variantId;
      if(merged.has(key)){merged.get(key).quantity=Math.min(99,merged.get(key).quantity+qty);changed=true;}
      else merged.set(key,{id:entry.id,variantId,quantity:qty});
    }
    return {lines:[...merged.values()],changed};
  }
  function details(lines,products){return lines.map(line=>{
    const priced=pricedProduct(products.find(p=>p.id===line.id),line.variantId);
    return priced?{...line,...priced,subtotalCents:priced.priceCents*line.quantity}:null;
  }).filter(Boolean);}
  function subtotal(lines,products){return details(lines,products).reduce((sum,line)=>sum+line.subtotalCents,0);}
  function message(lines,products,customer){
    const rows=details(lines,products);if(!rows.length) throw new Error('El pedido está vacío');
    const name=customer.name.trim(),address=(customer.address||'').trim(),mode=customer.mode;
    if(!name || (mode==='delivery'&&!address) || !['delivery','pickup'].includes(mode)) throw new Error('Faltan datos del pedido');
    const parts=customer.demo?['*DEMO — PEDIDO DE PRUEBA. NO ES UN PEDIDO REAL*','','¡Hola, Sushi Fan! Quiero consultar este pedido:','']:['¡Hola, Sushi Fan! Quiero consultar este pedido:',''];
    for(const row of rows){parts.push(`${row.quantity} × ${row.product.name}${row.variant?' — '+row.variant.name:''}`,`Precio unitario: ${money(row.priceCents)}`,`Subtotal: ${money(row.subtotalCents)}`,'');}
    parts.push(`Subtotal de productos: ${money(subtotal(lines,products))}`,`Modalidad: ${mode==='delivery'?'Delivery':'Retiro en Juncal 689'}`,`Nombre: ${name}`);
    if(mode==='delivery') parts.push(`Dirección: ${address}`);
    if(customer.reference?.trim() && mode==='delivery') parts.push(`Referencia: ${customer.reference.trim()}`);
    if(customer.notes?.trim()) parts.push(`Observaciones: ${customer.notes.trim()}`);
    if(mode==='delivery') parts.push('Delivery: costo de envío a confirmar');
    parts.push('¿Me confirman disponibilidad, importe final y tiempo estimado?');
    return parts.join('\n');
  }
  function whatsappUrl(message,number){
    if(number && !/^\d{10,15}$/.test(number)) throw new Error('Número de WhatsApp inválido');
    return `https://wa.me/${number||''}?text=${encodeURIComponent(message)}`;
  }
  const api={money,validPrice,pricedProduct,normalizeCart,details,subtotal,message,whatsappUrl};
  root.SushiFanCartCore=api;
  if(typeof module!=='undefined'&&module.exports) module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
