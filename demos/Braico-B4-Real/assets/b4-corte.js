
/* BRAICO B4 | Animación fotográfica independiente, sin frameworks. */
(function(){
'use strict';
const art=document.querySelector('#recipe-stage');
const toggle=document.querySelector('#recipe-toggle');
const slider=document.querySelector('#b4-slider');
if(!art||!toggle||!slider)return;
const state=document.querySelector('#recipe-state');
const whole=document.querySelector('#b4-whole');
const slices=[...document.querySelectorAll('.b4-slice')];
const keys=[...document.querySelectorAll('.b4-key')];
const label=toggle.querySelector('.button-label');
const pct=document.querySelector('#b4-pct');
const detail={
 'pan-superior':['PAN SUPERIOR','El pan de la representación visual. El tipo exacto no está confirmado en la carta.'],
 'dijon':['MOSTAZA DIJON','La salsa Dijon aparece expresamente en la receta de Carlitos.'],
 'pepinillos':['PEPINILLOS','El toque fresco y ácido que figura en la combinación original.'],
 'mortadela-pistachos':['MORTADELA CON PISTACHOS','El ingrediente protagonista que le da identidad a Carlitos.'],
 'queso-tybo':['QUESO TYBO','El queso de la receta original publicada por Braico.'],
 'aceite-oliva':['ACEITE DE OLIVA','Presente en la descripción de Carlitos de diciembre de 2025.'],
 'pan-inferior':['BASE DE PAN','Soporte visual orientativo. El tipo de pan requiere confirmación.']
};
let selected='mortadela-pistachos';
let drag=false;
function setSelected(key){
 if(!detail[key])return;selected=key;
 keys.forEach(k=>k.setAttribute('aria-pressed',String(k.dataset.key===key)));
 slices.forEach(s=>s.classList.toggle('is-selected',s.dataset.layer===key));
 document.querySelector('#b4-detail-index').textContent=String(Object.keys(detail).indexOf(key)+1).padStart(2,'0')+' / 07';
 document.querySelector('#b4-detail-name').textContent=detail[key][0];
 document.querySelector('#b4-detail-text').textContent=detail[key][1];
}
function move(value){
 const p=Math.max(0,Math.min(100,Number(value)||0));
 const factor=p/100;
 slider.value=String(p); slider.style.setProperty('--fill',p+'%');
 pct.textContent=String(Math.round(p)).padStart(2,'0')+'%';
 const open=p>40;
 art.classList.toggle('is-open',open);
 art.dataset.view=open?'open':'closed';
 toggle.setAttribute('aria-pressed',String(open));
 toggle.setAttribute('aria-label',open?'Juntar las capas del Carlitos ilustrativo':'Separar las capas del Carlitos ilustrativo');
 label.textContent=open?'VOLVER A ARMAR':'ABRIR EL CARLITOS';
 state.textContent=open?'RECETA / ABIERTA':'RECETA / CERRADA';
 whole.style.opacity=String(Math.max(0,1-factor*1.55));
 whole.style.transform=`translate(-50%,-50%) scale(${(1-factor*.15).toFixed(3)})`;
 const alpha=Math.min(1,Math.max(0,(factor-.04)*2.2));
 slices.forEach(el=>{
  const fit=window.innerWidth<=560?.84:(window.innerWidth<=850?.89:1);
  const x=Number(el.dataset.x)*factor*fit;
  const y=Number(el.dataset.y)*factor*fit;
  el.style.opacity=String(alpha);
  el.style.transform=`translate(-50%,-50%) translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0px) scale(${(.74+.26*factor).toFixed(3)})`;
  el.setAttribute('aria-hidden',String(!open));
  el.tabIndex=open?0:-1;
 });
}
toggle.addEventListener('click',()=>move(Number(slider.value)>40?0:100));
slider.addEventListener('input',()=>move(slider.value));
slider.addEventListener('pointerdown',()=>{drag=true;art.classList.add('is-scrubbing');});
['pointerup','pointercancel','blur'].forEach(ev=>slider.addEventListener(ev,()=>{drag=false;art.classList.remove('is-scrubbing');}));
keys.forEach(key=>{
 const select=()=>{if(Number(slider.value)<80)move(100);setSelected(key.dataset.key);};
 key.addEventListener('click',select);
 key.addEventListener('focus',()=>{if(Number(slider.value)>=60)setSelected(key.dataset.key);});
});
slices.forEach(s=>{s.addEventListener('click',()=>setSelected(s.dataset.layer));s.addEventListener('focus',()=>setSelected(s.dataset.layer));});
const style=document.createElement('style');style.textContent='.b4-art.is-scrubbing .b4-slice,.b4-art.is-scrubbing .b4-whole{transition:none!important}';document.head.append(style);
setSelected(selected);move(0);
})();
