const test=require('node:test');
const assert=require('node:assert/strict');
const cart=require('./cart-core.js');

const products=[
  {id:'tabla',name:'Tabla confirmada',priceCents:1250050},
  {id:'roll',name:'Roll confirmado',variants:[{id:'salmon',name:'Salmón',priceCents:480000},{id:'veggie',name:'Veggie',priceCents:450000}]},
  {id:'pendiente',name:'Producto sin precio'}
];

test('recalcula importes desde el catálogo y separa variantes',()=>{
  const saved=[{id:'roll',variantId:'salmon',quantity:1},{id:'roll',variantId:'salmon',quantity:2},{id:'roll',variantId:'veggie',quantity:1},{id:'tabla',variantId:'',quantity:2}];
  const normalized=cart.normalizeCart(saved,products);
  assert.equal(normalized.lines.length,3);
  assert.equal(normalized.lines[0].quantity,3);
  assert.equal(cart.subtotal(normalized.lines,products),3*480000+450000+2*1250050);
  assert.match(cart.money(1250050),/12\.500,50/);
});

test('descarta productos sin precio, eliminados y cantidades inválidas',()=>{
  const normalized=cart.normalizeCart([{id:'pendiente',variantId:'',quantity:1},{id:'no-existe',variantId:'',quantity:1},{id:'tabla',variantId:'',quantity:0}],products);
  assert.deepEqual(normalized.lines,[]);
  assert.equal(normalized.changed,true);
});

test('prepara mensaje completo de delivery con importes y datos',()=>{
  const lines=[{id:'roll',variantId:'veggie',quantity:2}];
  const text=cart.message(lines,products,{name:'Ana',mode:'delivery',address:'San Martín 25',reference:'Timbre 2',notes:'Sin salsa'});
  for(const fragment of ['2 × Roll confirmado — Veggie','Precio unitario:','Subtotal de productos:','Modalidad: Delivery','Dirección: San Martín 25','Referencia: Timbre 2','Observaciones: Sin salsa','costo de envío a confirmar','¿Me confirman disponibilidad']) assert.ok(text.includes(fragment),fragment);
  assert.equal(cart.subtotal(lines,products),900000);
  assert.equal(decodeURIComponent(encodeURIComponent(text)),text);
});

test('retiro no pide dirección y el carrito vacío no genera enlace',()=>{
  const text=cart.message([{id:'tabla',variantId:'',quantity:1}],products,{name:'Sol',mode:'pickup'});
  assert.match(text,/Retiro en Juncal 689/);
  assert.doesNotMatch(text,/Dirección:|costo de envío/);
  assert.throws(()=>cart.message([],products,{name:'Sol',mode:'pickup'}));
  assert.throws(()=>cart.message([{id:'tabla',variantId:'',quantity:1}],products,{name:'Sol',mode:'delivery'}));
});

test('identifica el pedido ficticio dentro del mensaje de demostración',()=>{
  const text=cart.message([{id:'tabla',variantId:'',quantity:1}],products,{name:'Demo',mode:'pickup',demo:true});
  assert.match(text,/DEMO — PEDIDO DE PRUEBA/);
  assert.match(text,/Tabla confirmada/);
  const share=cart.whatsappUrl(text,null);
  assert.match(share,/^https:\/\/wa\.me\/\?text=/);
  assert.equal(decodeURIComponent(share.split('?text=')[1]),text);
  assert.match(cart.whatsappUrl(text,'5492494333204'),/^https:\/\/wa\.me\/5492494333204\?text=/);
});
