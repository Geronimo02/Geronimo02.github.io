(()=>{
 document.documentElement.classList.add('js-ready');
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.08});
 document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
 const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav-links');
 toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});
 nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle?.setAttribute('aria-expanded','false')}));
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const mobile=matchMedia('(max-width: 800px)');
 const stages=[...document.querySelectorAll('.scroll-stage')];
 const progressBar=document.createElement('div');
 progressBar.className='scroll-progress';
 document.body.appendChild(progressBar);
 const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
 const ease=t=>t*t*(3-2*t);
 let scheduled=false;

 function setVar(el,name,val){ if(el) el.style.setProperty(name,val); }

 function update(){
  scheduled=false;
  progressBar.style.width=`${100*scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)}%`;
  if(reduced.matches){return}
  const isMobile=mobile.matches;
  for(const stage of stages){
   const r=stage.getBoundingClientRect();
   if(r.bottom < -innerHeight || r.top > innerHeight*1.5) continue;

   const travel=Math.max(1,stage.offsetHeight-innerHeight);
   const p=clamp(-r.top/travel);
   const intro=ease(clamp((p-.04)/.32));
   const outro=ease(clamp((p-.76)/.24));
   const k=isMobile?0.28:1;

   const stat=stage.querySelector('.hero-statue');
   if(stat){
    setVar(stat,'--hero-shift-x',`${(-12+36*intro-20*outro)*k}px`);
    setVar(stat,'--hero-shift-y',`${(p*46)*k}px`);
    setVar(stat,'--hero-scale',`${1+(.034*p)*k}`);
    stat.style.opacity=String(1-.22*outro);
    const giant=stage.querySelector('.giant-logo');
    if(giant) setVar(giant,'--logo-shift-y',`${p*45*k}px`);
   }

   const section=stage.querySelector('.editorial-section');
   const subject=stage.querySelector('.editorial-visual img');
   if(subject){
     const reverse=section?.classList.contains('reverse');
     const dir=reverse ? -1 : 1;
     setVar(subject,'--editorial-shift-x',`${dir*(1-intro)*58*k}px`);
     setVar(subject,'--editorial-shift-y',`${(-10+26*p)*k}px`);
     setVar(subject,'--editorial-scale',`${1+(.04*p)*k}`);
     subject.style.opacity=String(isMobile?1: .88+.12*intro-.10*outro);
   }

   const copy=stage.querySelector('.editorial-copy');
   if(copy && !isMobile){
    setVar(copy,'--copy-shift-x',`${(-1)*(1-intro)*34}px`);
    setVar(copy,'--copy-shift-y',`${20*(1-intro)-12*outro}px`);
    copy.style.opacity=String(.68+.32*intro-.1*outro);
   }

   const product=stage.querySelector('.product-hero-image');
   if(product){
    setVar(product,'--scene-shift-x',`${14*(1-intro)*k}px`);
    setVar(product,'--scene-shift-y',`${(-18+34*p)*k}px`);
    setVar(product,'--scene-scale',`${1+.04*p*k}`);
   }

   const flavor=stage.querySelector('.flavor-scene-image img');
   if(flavor){
    // keep mostly vertical motion to avoid blank bands on the sides
    const flavorX = stage.querySelector('.flavor-left') ? -10 : 10;
    setVar(flavor,'--scene-shift-x',`${flavorX*(1-intro)*k}px`);
    setVar(flavor,'--scene-shift-y',`${(-16+30*p)*k}px`);
    setVar(flavor,'--scene-scale',`${1+.045*p*k}`);
   }
  }
 }

 function schedule(){ if(!scheduled){ scheduled=true; requestAnimationFrame(update); } }
 addEventListener('scroll',schedule,{passive:true});
 addEventListener('resize',schedule,{passive:true});
 schedule();
})();
