
/* PANINARO B4 | Animazione fotografica indipendente, senza framework. */
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
 'pan-superior':['PANE SUPERIORE','Il pane della rappresentazione visiva. Il tipo esatto è da confermare.'],
 'dijon':['SENAPE DIJON','La senape Dijon è presente nella ricetta.'],
 'pepinillos':['CETRIOLINI','Il tocco fresco e acidulo della ricetta.'],
 'mortadela-pistachos':['MORTADELLA AL PISTACCHIO','L’ingrediente protagonista di Santo Stefano.'],
 'queso-tybo':['FORMAGGIO TYBO','Il formaggio della ricetta.'],
 'aceite-oliva':['OLIO D’OLIVA','Presente nella descrizione della ricetta.'],
 'pan-inferior':['BASE DI PANE','Supporto visivo orientativo. Il tipo di pane è da confermare.']
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
 toggle.setAttribute('aria-label',open?'Chiudi gli strati di Santo Stefano':'Separa gli strati di Santo Stefano');
 label.textContent=open?'RICOMPONI':'APRI SANTO STEFANO';
 state.textContent=open?'RICETTA / APERTA':'RICETTA / CHIUSA';
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
