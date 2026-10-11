const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const core=require('./cart-core.js');
global.window=global;
require('./menu.js');
const menu=global.SUSHI_FAN_MENU;

test('la carta demo tiene productos distintos, importes válidos y fotos locales',()=>{
  assert.equal(menu.demo,true);
  assert.equal(menu.whatsappNumber,null);
  assert.ok(menu.products.length>=8);
  assert.equal(new Set(menu.products.map(p=>p.id)).size,menu.products.length);
  for(const product of menu.products){
    assert.ok(product.id&&product.category&&product.name&&product.description);
    assert.ok(fs.existsSync(path.join(__dirname,product.photo)),product.photo);
    assert.ok((product.variants?.length?product.variants.every(v=>core.validPrice(v.priceCents)):core.validPrice(product.priceCents)),product.name);
  }
});

test('un pedido de muestra con variantes conserva cantidades y genera enlace compartible',()=>{
  const lines=[{id:'tabla-fan',variantId:'',quantity:1},{id:'gyozas',variantId:'6',quantity:2},{id:'gyozas',variantId:'12',quantity:1}];
  assert.equal(core.subtotal(lines,menu.products),3490000+2*820000+1490000);
  const message=core.message(lines,menu.products,{name:'Cliente demo',mode:'pickup',demo:true});
  assert.match(message,/DEMO — PEDIDO DE PRUEBA/);
  assert.match(message,/2 × Gyozas Doradas — 6 unidades/);
  assert.match(message,/1 × Gyozas Doradas — 12 unidades/);
  const url=core.whatsappUrl(message,menu.whatsappNumber);
  assert.match(url,/^https:\/\/wa\.me\/\?text=/);
  assert.equal(decodeURIComponent(url.split('?text=')[1]),message);
});
