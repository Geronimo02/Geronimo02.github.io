const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const home=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const menu=fs.readFileSync(path.join(__dirname,'carta.html'),'utf8');
const sharedIds=['cartDrawer','cartBackdrop','cartCount','cartLines','cartEmpty','orderForm','sendOrder','exploreMenu','menuToggle','mainNav'];

test('la portada enlaza a una carta independiente y ambas páginas tienen carrito',()=>{
  assert.match(home,/<a[^>]+href="carta\.html"[^>]*>Ver la carta/);
  assert.match(home,/<a[^>]+href="carta\.html"[^>]*>Explorar la carta/);
  assert.doesNotMatch(home,/id="menuProducts"/);
  assert.match(menu,/id="menuProducts"/);
  assert.match(menu,/id="menuCategories"/);
  for(const id of sharedIds){assert.match(home,new RegExp(`id="${id}"`),`Inicio: ${id}`);assert.match(menu,new RegExp(`id="${id}"`),`Carta: ${id}`);}
});

test('las imágenes locales de ambas páginas existen',()=>{
  for(const html of [home,menu]){
    const refs=[...html.matchAll(/(?:src|href)="(img\/[^\"]+)"/g)].map(match=>match[1]);
    for(const ref of refs) assert.ok(fs.existsSync(path.join(__dirname,ref)),ref);
  }
});
