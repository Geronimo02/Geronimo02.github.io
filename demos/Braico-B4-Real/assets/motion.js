/* BRAICO B3 / Micro-movimientos propios. No frameworks ni red. */
(function(){
  'use strict';
  const fine = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const $ = s => document.querySelector(s);
  const recipe = $('#recipe-stage');
  const toggle = $('#recipe-toggle');
  const state = $('#recipe-state');
  const label = toggle && toggle.querySelector('.button-label');
  // B4: el control del ingrediente lo gestiona b4-corte.js.
  if ('IntersectionObserver' in window) {
    const sections = ['.counter-heading','.counter-stage','.recipe-copy','.recipe-art','.menu-header','.featured-picks','.homage-text','.visit-copy'];
    const nodes = sections.map(s => $(s)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('b3-shown');
          observer.unobserve(entry.target);
        }
      }
    }, {rootMargin:'0px 0px 60px 0px',threshold:0.08});
    nodes.forEach(node => {node.setAttribute('data-b3-reveal','');observer.observe(node);});
    document.documentElement.classList.add('b3-animated');
  }
  if (!fine) return;
  function trackTilt(target, surface, max, xvar, yvar){
    if(!target || !surface) return;
    surface.addEventListener('pointermove', e=> {
      const rect=surface.getBoundingClientRect();
      const nx=Math.max(-1,Math.min(1, (e.clientX-rect.left)/rect.width*2-1));
      const ny=Math.max(-1,Math.min(1, (e.clientY-rect.top)/rect.height*2-1));
      target.style.setProperty(xvar,(-ny*max).toFixed(2)+'deg');
      target.style.setProperty(yvar,(nx*max).toFixed(2)+'deg');
    }, {passive:true});
    surface.addEventListener('pointerleave',()=>{
      target.style.setProperty(xvar,'0deg');target.style.setProperty(yvar,'0deg');
    });
  }
  const heroMedia=$('.hero-media');
  trackTilt($('#hero-tilt'),heroMedia,3,'--heroRX','--heroRY');
  if(heroMedia) {
    heroMedia.addEventListener('pointermove',e=>{
      const r=heroMedia.getBoundingClientRect();
      const nx=(e.clientX-r.left)/r.width-.5, ny=(e.clientY-r.top)/r.height-.5;
      const seal=$('#seal-depth');
      if(seal){seal.style.setProperty('--sealX',(nx*9).toFixed(1)+'px');seal.style.setProperty('--sealY',(ny*9).toFixed(1)+'px');}
    },{passive:true});
    heroMedia.addEventListener('pointerleave',()=>{
      const seal=$('#seal-depth');if(seal){seal.style.setProperty('--sealX','0px');seal.style.setProperty('--sealY','0px');}
    });
  }
  document.querySelectorAll('.feature-tile').forEach(tile=>trackTilt(tile,tile,2.8,'--tiltX','--tiltY'));
  trackTilt($('.recipe-stage'), recipe, 1.7,'--recipeX','--recipeY');
})();
