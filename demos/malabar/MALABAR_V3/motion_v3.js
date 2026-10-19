/* MALABAR v3: scroll-linked cinematography with native browser APIs.
   No CDN required for local playback. */
(function initMalabarMotion(){
  'use strict';
  const heroStage = document.getElementById('hero-stage');
  const heroFrame = document.querySelector('.hero-frame');
  const heroContent = document.querySelector('.hero-content');
  const events = document.getElementById('eventos');
  const storyChoices = Array.from(document.querySelectorAll('.story-choice'));
  const storyImages = Array.from(document.querySelectorAll('.event-story-image'));
  const storyIndex = document.querySelector('.story-live-index');
  const storyCaption = document.querySelector('.event-caption-label');
  const photoStage = document.querySelector('.space-photo-stage');
  const photoFrame = document.querySelector('.space-photo-frame');
  const gallery = document.getElementById('galeria');
  const galleryTrack = document.querySelector('.gallery-track');
  const galleryViewport = document.querySelector('.gallery-viewport');
  const galleryMeter = document.querySelector('.gallery-meter i');
  const experiencePhoto = document.querySelector('.experience-photo img');
  const experienceSection = document.querySelector('.experience');
  const moment = document.querySelector('.moment');
  const siteMeter = document.querySelector('.site-progress-fill');
  const progressLabels = [
    'Un momento inolvidable',
    'Encuentros que inspiran',
    'Historias para brindar',
    'Una celebraci\u00f3n a tu manera'
  ];
  const clamp = n => Math.max(0,Math.min(1,n));
  const absTop = node => node.getBoundingClientRect().top+window.scrollY;
  const isDesktop = () => window.innerWidth > 950;
  let selectedStory = -1;
  let requestId = 0;
  let words=[];

  function wrapWords(node){
    const walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT);
    const textNodes=[];
    while(walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach(textNode=>{
      const fragment=document.createDocumentFragment();
      textNode.nodeValue.split(/(\s+)/).forEach(part=>{
        if(!part) return;
        if(/^\s+$/.test(part)) fragment.appendChild(document.createTextNode(part));
        else {
          const span=document.createElement('span');
          span.className='motion-word';
          span.textContent=part;
          fragment.appendChild(span);
        }
      });
      textNode.replaceWith(fragment);
    });
    return Array.from(node.querySelectorAll('.motion-word'));
  }

  const intro=document.getElementById('concepto');
  const statement=intro.querySelector('.statement');
  {
    words=wrapWords(statement);
    const revealNodes=document.querySelectorAll('.intro .description,.intro .line-link,.section-head,.space-note,.experience-text,.lead-intro,.footer-cta-inner');
    revealNodes.forEach(node=>node.classList.add('motion-reveal'));
    document.body.classList.add('motion-on');
    if('IntersectionObserver' in window){
      const io=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target);}
        });
      },{threshold:.10,rootMargin:'0px 0px -4% 0px'});
      revealNodes.forEach(node=>io.observe(node));
    }else revealNodes.forEach(node=>node.classList.add('is-visible'));
  }

  function activateStory(index){
    if(index===selectedStory) return;
    selectedStory=index;
    storyChoices.forEach((el,i)=>{
      const active=i===index;
      el.classList.toggle('is-active',active);
      if(active) el.setAttribute('aria-current','step');
      else el.removeAttribute('aria-current');
    });
    storyImages.forEach((el,i)=>{
      el.classList.toggle('is-active',i===index);
      el.setAttribute('aria-hidden',i===index?'false':'true');
    });
    if(storyIndex) storyIndex.textContent=`0${index+1} / 04`;
    if(storyCaption) storyCaption.textContent=progressLabels[index];
  }
  activateStory(0);

  function update(){
    const vh=window.innerHeight;
    const maxScroll=Math.max(1,document.documentElement.scrollHeight-vh);
    siteMeter.style.transform=`scaleX(${clamp(window.scrollY/maxScroll)})`;
    if(isDesktop()){
      // First scene: one sticky hero, cinematic frame shrink, typography dissolves.
      const heroTravel=Math.max(1,heroStage.offsetHeight-vh);
      const hp=clamp((window.scrollY-absTop(heroStage))/heroTravel);
      heroFrame.style.transform=`scale(${(1-hp*.105).toFixed(4)})`;
      heroFrame.style.borderRadius=`${(hp*18).toFixed(1)}px`;
      heroContent.style.opacity=(1-clamp((hp-.13)/.66)).toFixed(3);
      heroContent.style.transform=`translate3d(0,${Math.round(-hp*72)}px,0)`;

      // Event choices respond to scroll progression, plus remain regular links.
      const eventStart=absTop(events)+vh*.21;
      const eventEnd=Math.max(eventStart+1,absTop(events)+events.offsetHeight-vh*.84);
      const ep=clamp((window.scrollY-eventStart)/(eventEnd-eventStart));
      const index=Math.min(storyChoices.length-1,Math.floor(ep*storyChoices.length));
      if(index>=0) activateStory(index);

      // Horizontal image narrative controlled by the vertical scrollbar.
      const galleryTravel=Math.max(1,gallery.offsetHeight-vh);
      const gp=clamp((window.scrollY-absTop(gallery)+77)/galleryTravel);
      const xMax=Math.max(0,galleryTrack.scrollWidth-galleryViewport.clientWidth+Math.max(56,(innerWidth-1460)/2)+35);
      galleryTrack.style.transform=`translate3d(${-Math.round(xMax*gp)}px,0,0)`;
      galleryMeter.style.transform=`scaleX(${gp.toFixed(4)})`;
    }else{
      heroFrame.style.transform='';
      heroFrame.style.borderRadius='';
      heroContent.style.transform='';
      heroContent.style.opacity='';
      galleryTrack.style.transform='';
      galleryMeter.style.transform='';
    }

    // Intro typography: words gain contrast as the narrative unfolds.
    const introRect=intro.getBoundingClientRect();
    const ip=clamp((vh*.75-introRect.top)/Math.max(1,introRect.height+vh*.65));
    words.forEach((node,i)=>{
      const wp=clamp((ip-(i/Math.max(1,words.length-1))*.67)/.32);
      node.style.opacity=(.23+.77*wp).toFixed(3);
      node.style.transform=`translate3d(0,${Math.round((1-wp)*8)}px,0)`;
    });

    // Architectural image grows from framed card to full bleed.
    if(photoFrame){
      const rect=photoStage.getBoundingClientRect();
      const pp=clamp((vh*.82-rect.top)/(vh*.86));
      const inset=(isDesktop()?9:3)*(1-pp);
      photoFrame.style.clipPath=`inset(0 ${inset.toFixed(2)}% 0 ${inset.toFixed(2)}%)`;
    }

    // Gentle background movement: never interfere with pointer interaction.
    if(experiencePhoto && isDesktop()){
      const r=experienceSection.getBoundingClientRect();
      const p=clamp((vh-r.top)/(vh+r.height));
      experiencePhoto.style.transform=`translate3d(0,${Math.round((p-.5)*-32)}px,0) scale(1.055)`;
    }else if(experiencePhoto) experiencePhoto.style.transform='';
    if(moment && isDesktop()){
      const r=moment.getBoundingClientRect();
      const p=clamp((vh-r.top)/(vh+r.height));
      moment.style.setProperty('--moment-shift',`${Math.round((p-.5)*45)}px`);
    }
  }

  function schedule(){
    if(requestId) return;
    requestId=window.requestAnimationFrame(()=>{requestId=0;update();});
  }
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  window.addEventListener('load',schedule,{once:true});
  schedule();

  // Custom cursor is informative only on clickable event choices.
  if(window.matchMedia('(pointer:fine)').matches){
    const cursor=document.querySelector('.motion-cursor');
    if(cursor){
      document.querySelectorAll('.story-choice,.event-card').forEach(a=>{
        a.addEventListener('pointerenter',()=>cursor.classList.add('is-active'));
        a.addEventListener('pointerleave',()=>cursor.classList.remove('is-active'));
      });
      document.addEventListener('pointermove',e=>{
        cursor.style.transform=`translate3d(${Math.round(e.clientX-46)}px,${Math.round(e.clientY-46)}px,0) scale(1)`;
      },{passive:true});
    }
  }
})();
