import { useEffect, useRef, useState } from 'react';
import { business, formatARS, menu, type MenuItem } from './data';
import './home.css';

type Props = { addItem: (item: MenuItem, variant: string, addOnId?: string) => void };
const asset = (name: string) => `/images/${name}`;
const featuredIds = ['latte', 'iced-latte', 'vermu-vaso', 'cappuccino'];
const heroProducts = [
  {label: 'CAFÉ', file: 'hero-cup-illustration.png', alt: 'Ilustración de un vaso de café rodeado por café y granos', kind: 'coffee'},
  {label: 'CROISSANT', file: 'croissant-split.webp', alt: 'Ilustración de un croissant abierto', kind: 'croissant'},
  {label: 'VERMÚ', file: 'vermu-illustration.png', alt: 'Ilustración de un vaso de vermú', kind: 'vermu'},
];
const featuredImages: Record<string, string> = {
  latte: 'latte-illustration.png',
  'iced-latte': 'iced-coffee-illustration.png',
  'vermu-vaso': 'vermu-illustration.png',
  cappuccino: 'latte-illustration.png',
};

function Action({href, children, dark = false}: {href: string; children: React.ReactNode; dark?: boolean}) {
  return <a className={`nm-action ${dark ? 'nm-action-dark' : ''}`} href={href}><span className="nm-action-text"><span>{children}</span><span aria-hidden="true">{children}</span></span><span className="nm-action-circle" aria-hidden="true"><span className="icon-arrow icon-flush" /></span></a>;
}

function EditorialPhoto({file, alt, className = ''}: {file: string; alt: string; className?: string}) {
  return <figure className={`nm-photo ${className}`}><img src={asset(file)} alt={alt} loading="lazy" /><figcaption>Imagen ilustrativa</figcaption></figure>;
}

function FlyingBeans({area}: {area: 'hero' | 'story' | 'cup'}) {
  return <div className={`nm-bean-field nm-bean-field-${area}`} aria-hidden="true">{Array.from({length:5},(_,index) => <span className={`nm-flying-bean nm-flying-bean-${index + 1}`} key={index}><img src={asset('coffee-bean-illustration.png')} alt="" /></span>)}</div>;
}

function useCareScroll() {
  useEffect(() => {
    const track = document.querySelector<HTMLElement>('.nm-care-track');
    if (!track) return;
    const cards = [...track.querySelectorAll<HTMLElement>('.nm-care-card')];
    const story = document.querySelector<HTMLElement>('.nm-story');
    const moments = document.querySelector<HTMLElement>('.nm-moments');
    const momentSides = moments ? [...moments.querySelectorAll<HTMLElement>('.nm-moment-side')] : [];
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
      frame = 0;
      if (reduced.matches) return;
      const rect = track.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - innerHeight)));
      const mobile = innerWidth < 761;
      const step = mobile ? Math.min(innerWidth, 430) : Math.min(innerWidth * .47, 710);
      const start = Math.max(20, (innerWidth - cards[0].offsetWidth) / 2);
      cards.forEach((card, index) => {
        const x = start + index * step - progress * step * 2;
        const distance = Math.abs(index - progress * 2);
        const scale = Math.max(.78, 1 - distance * .17);
        const opacity = Math.max(.22, 1 - distance * .34);
        const y = mobile ? 28 + (index - progress * 2) * 24 : 35 + (index - progress * 2) * 65;
        card.style.transform = `translate3d(${x.toFixed(1)}px,${y}px,0) scale(${scale.toFixed(3)})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.zIndex = String(5 - Math.round(distance * 2));
      });
      track.style.setProperty('--care-progress', progress.toFixed(3));
      if (story) {
        const storyRect = story.getBoundingClientRect();
        const storyProgress = Math.max(0, Math.min(1, (innerHeight - storyRect.top) / (storyRect.height + innerHeight)));
        story.style.setProperty('--story-scale', (0.88 + storyProgress * 0.44).toFixed(3));
        story.style.setProperty('--story-lift', `${Math.round(storyProgress * -130)}px`);
      }
      if (moments && momentSides.length) {
        const momentRect = moments.getBoundingClientRect();
        const reveal = Math.max(0, Math.min(1, -momentRect.top / 500));
        momentSides.forEach((card, index) => {
          const direction = index === 0 ? -1 : 1;
          card.style.transform = `translateX(${(direction * (1 - reveal) * 90).toFixed(1)}px) rotate(${(direction * (7 - reveal * 4)).toFixed(1)}deg)`;
          card.style.opacity = (.45 + reveal * .55).toFixed(3);
        });
      }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', onScroll, {passive: true});
    addEventListener('resize', onScroll);
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); if (frame) cancelAnimationFrame(frame); };
  }, []);
}

function useHeroTilt(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    const hero = el?.closest<HTMLElement>('.nm-hero');
    if (!el || !hero || matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = hero.getBoundingClientRect();
        el.style.setProperty('--tilt-x', ((event.clientX - rect.left) / rect.width - .5).toFixed(3));
        el.style.setProperty('--tilt-y', ((event.clientY - rect.top) / rect.height - .5).toFixed(3));
      });
    };
    const onLeave = () => { el.style.setProperty('--tilt-x', '0'); el.style.setProperty('--tilt-y', '0'); };
    hero.addEventListener('pointermove', onMove);
    hero.addEventListener('pointerleave', onLeave);
    return () => { hero.removeEventListener('pointermove', onMove); hero.removeEventListener('pointerleave', onLeave); if (frame) cancelAnimationFrame(frame); };
  }, [ref]);
}

export default function Home({addItem}: Props) {
  const [faq, setFaq] = useState(0);
  const [activeProduct, setActiveProduct] = useState(0);
  const [heroItem, setHeroItem] = useState(0);
  const [outgoingHero, setOutgoingHero] = useState<number | null>(null);
  const [heroPaused, setHeroPaused] = useState(false);
  const heroTransitioning = useRef(false);
  const heroTimer = useRef<number | null>(null);
  const track = useRef<HTMLDivElement>(null);
  const heroVisual = useRef<HTMLDivElement>(null);
  const featured = featuredIds.map(id => menu.find(item => item.id === id)!).filter(Boolean);
  useCareScroll();
  useHeroTilt(heroVisual);

  function showHero(next: number) {
    if (next === heroItem || heroTransitioning.current) return;
    heroTransitioning.current = true;
    setOutgoingHero(heroItem);
    setHeroItem(next);
    heroTimer.current = window.setTimeout(() => {
      setOutgoingHero(null);
      heroTransitioning.current = false;
    }, 900);
  }

  useEffect(() => {
    if (heroPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const interval = window.setInterval(() => {
      if (!document.hidden) showHero((heroItem + 1) % heroProducts.length);
    }, 5000);
    return () => window.clearInterval(interval);
  }, [heroItem, heroPaused]);

  useEffect(() => () => {
    if (heroTimer.current !== null) window.clearTimeout(heroTimer.current);
  }, []);

  function goToProduct(index: number) {
    const next = (index + featured.length) % featured.length;
    const card = track.current?.querySelector<HTMLElement>('.nm-product');
    if (!track.current || !card) return;
    const gap = parseFloat(getComputedStyle(track.current).gap) || 0;
    const margin = parseFloat(getComputedStyle(card).marginRight) || 0;
    track.current.scrollTo({left: next * (card.offsetWidth + margin + gap), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    setActiveProduct(next);
  }

  return <main className="nm-home">
    <section className="nm-hero" id="inicio" data-kind={heroProducts[heroItem].kind}>
      <div className="nm-hero-content">
        <span className="nm-hand-sticker">BUENOS MOMENTOS</span>
        <h1 className="nm-hero-lockup"><img src={asset('un-rato-en-negro.png')} alt="Un rato en negro. Café del bueno." /></h1>
        <div className="nm-hero-bottom"><p className="nm-kicker">UN LUGAR PARA QUEDARSE</p><p>Café de especialidad, pastelería y algo rico para disfrutar en Tandil.</p><Action href="/carta/">VER LA CARTA</Action></div>
      </div>
      <div className="nm-hero-visual" data-parallax ref={heroVisual} onMouseEnter={() => setHeroPaused(true)} onMouseLeave={() => setHeroPaused(false)} onFocusCapture={() => setHeroPaused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setHeroPaused(false); }}>
        <div key={`disc-${heroItem}`} className="nm-hero-disc" aria-hidden="true" />
        {outgoingHero !== null && <div className={`nm-hero-product is-outgoing is-${heroProducts[outgoingHero].kind}`} aria-hidden="true"><img src={asset(heroProducts[outgoingHero].file)} alt="" /></div>}
        <div key={heroItem} className={`nm-hero-product is-current is-${heroProducts[heroItem].kind}`}><img src={asset(heroProducts[heroItem].file)} alt={heroProducts[heroItem].alt} /></div>
        <div className="nm-hero-switcher" role="group" aria-label="Elegí una imagen del giro">{heroProducts.map((product, index) => <button key={product.kind} type="button" className={index === heroItem ? 'active' : ''} aria-pressed={index === heroItem} onClick={() => showHero(index)}>{product.label}</button>)}</div>
        <span>COMPOSICIONES ILUSTRATIVAS</span>
      </div>
      <FlyingBeans area="hero" />
    </section>

    <section className="nm-story" id="historia">
      <div className="nm-story-top" data-reveal><span className="nm-badge nm-badge-light">NUESTRA HISTORIA</span><h2>MÁS QUE CAFÉ.<br />UN MOMENTO<br />PARA VOS.</h2></div>
      <div className="nm-story-drink" data-parallax><img src={asset('iced-coffee-illustration.png')} alt="Ilustración de café frío con hielo" /></div>
      <FlyingBeans area="story" />
      <div className="nm-story-bottom" data-reveal><p>En Avellaneda y 9 de Julio, Negro Mercado reúne café de especialidad, pastelería y vermú. Un punto de encuentro para mañanas con apuro y tardes sin reloj.</p><a href="#carta-destacada" className="nm-story-next" aria-label="Ir a la carta destacada"><span className="icon-arrow-down icon-flush" aria-hidden="true" /><small>DESCUBRÍ MÁS</small></a><span>IMAGEN ILUSTRATIVA</span></div>
    </section>

    <section className="nm-menu-showcase" id="carta-destacada">
      <div className="nm-section-heading" data-reveal><div><span className="nm-badge">NUESTRA CARTA</span><h2>ALGO PARA<br />CADA MOMENTO.</h2></div><Action href="/carta/">VER CARTA COMPLETA</Action></div>
      <div className="nm-product-track" ref={track} onScroll={event => {const card = event.currentTarget.querySelector<HTMLElement>('.nm-product'); if (card) {const gap = parseFloat(getComputedStyle(event.currentTarget).gap) || 0; const margin = parseFloat(getComputedStyle(card).marginRight) || 0; setActiveProduct(Math.round(event.currentTarget.scrollLeft / (card.offsetWidth + margin + gap)));}}} aria-label="Productos destacados">
        {featured.map((item, index) => <article className="nm-product" key={item.id} data-reveal style={{'--reveal-delay': `${index * 70}ms`} as React.CSSProperties}>
          <div className="nm-product-top"><h3>{item.name}</h3><button onClick={() => addItem(item, item.variants[0].label)}>SUMAR AL PEDIDO <b>+</b></button></div>
          <img className="nm-product-image" src={asset(featuredImages[item.id])} alt={`Ilustración de ${item.name}`} loading="lazy" />
          <div className="nm-product-foot"><span>{item.category}</span><strong>DESDE {formatARS(Math.min(...item.variants.map(v => v.price)))}</strong></div>
        </article>)}
      </div>
      <div className="nm-product-controls"><div className="nm-product-dots" role="group" aria-label="Elegir producto destacado">{featured.map((item, index) => <button key={item.id} className={activeProduct === index ? 'active' : ''} onClick={() => goToProduct(index)} aria-label={`Ver ${item.name}`} aria-current={activeProduct === index ? 'true' : undefined} />)}</div><div><button onClick={() => goToProduct(activeProduct - 1)} aria-label="Producto anterior"><span className="icon-arrow-left icon-flush" aria-hidden="true" /></button><button onClick={() => goToProduct(activeProduct + 1)} aria-label="Producto siguiente"><span className="icon-arrow-right icon-flush" aria-hidden="true" /></button></div></div>
      <p className="nm-illustration-note">Los productos ilustrados muestran la composición visual. Los nombres y precios provienen de la carta compartida.</p>
    </section>

    <section className="nm-care" id="oficio">
      <div className="nm-care-intro" data-reveal><span className="nm-badge">HECHO CON CUIDADO</span><h2>BUEN CAFÉ,<br />BUENAS COSAS.</h2><p>Café de especialidad, pastelería y los momentos que se arman alrededor.</p></div>
      <div className="nm-care-track"><div className="nm-care-sticky">
        <article className="nm-care-card"><span className="nm-care-label">ALGO RICO<br />CADA DÍA</span><EditorialPhoto file="coffee-croissant.jpg" alt="Café y croissant ilustrativos" /><div className="nm-care-caption"><h3>UN MOMENTO PARA DISFRUTAR</h3><p>Un café y algo de pastelería para hacer una pausa.</p></div></article>
        <article className="nm-care-card"><span className="nm-care-label">CAFÉ DE<br />ESPECIALIDAD</span><EditorialPhoto file="barista.jpg" alt="Preparación de café ilustrativa" /><div className="nm-care-caption"><h3>EN CADA TAZA</h3><p>La cafetería es parte de la identidad de Negro Mercado.</p></div></article>
        <article className="nm-care-card"><span className="nm-care-label">UN LUGAR<br />PARA VOLVER</span><EditorialPhoto file="coffee-pastry.jpg" alt="Café y pastelería ilustrativos" /><div className="nm-care-caption"><h3>PARA ACOMPAÑAR</h3><p>Pastelería, laminados y buena compañía en Tandil.</p></div></article>
      </div></div>
    </section>

    <div className="nm-marquee" aria-hidden="true"><div><span>CAFÉ <span className="icon-sparkle" aria-hidden="true" /> PASTELERÍA <span className="icon-sparkle" aria-hidden="true" /> VERMÚ <span className="icon-sparkle" aria-hidden="true" /> TANDIL <span className="icon-sparkle" aria-hidden="true" /> </span><span>CAFÉ <span className="icon-sparkle" aria-hidden="true" /> PASTELERÍA <span className="icon-sparkle" aria-hidden="true" /> VERMÚ <span className="icon-sparkle" aria-hidden="true" /> TANDIL <span className="icon-sparkle" aria-hidden="true" /> </span></div></div>

    <section className="nm-place" id="local"><div className="nm-place-title" data-reveal><span className="nm-badge">EL LOCAL</span><h2>DONDE PASAN<br />LAS COSAS BUENAS.</h2></div><div className="nm-place-gallery" data-reveal><EditorialPhoto file="cafe-interior.jpg" alt="Interior de cafetería ilustrativo; no es Negro Mercado" /><EditorialPhoto file="coffee-table.jpg" alt="Café en una mesa, fotografía ilustrativa" /><EditorialPhoto file="barista.jpg" alt="Barra de café ilustrativa" /></div><div className="nm-place-info" data-reveal><p><strong>AVELLANEDA 702</strong><br />Esquina 9 de Julio · Tandil</p><p><strong>HORARIOS</strong><br />{business.hoursWeek}<br />{business.hoursWeekend}</p><p><strong>PET FRIENDLY</strong><br />Tu compañía también es bienvenida.</p><Action href={business.map}>CÓMO LLEGAR</Action></div></section>

    <section className="nm-cup-story"><div className="nm-cup-copy" data-reveal><h2>CADA TAZA<br /><span className="nm-slanted">TIENE UNA HISTORIA</span></h2><h3>DE CAFÉ, OFICIO<br />Y BUENOS MOMENTOS.</h3></div><div className="nm-cup-visual" data-parallax><img src={asset('latte-illustration.png')} alt="Ilustración de un café con arte latte" /></div><FlyingBeans area="cup" /></section>

    <section className="nm-pairing" data-reveal><EditorialPhoto file="coffee-croissant.jpg" alt="Café y croissant ilustrativos" /><div className="nm-pairing-content"><span className="nm-badge">PARA ACOMPAÑAR</span><h2>CAFÉ Y<br />ALGO RICO.</h2><p>Elegí tu café de la carta. Para saber qué hay hoy de pastelería y laminados, consultá al equipo.</p><div className="nm-pairing-line"><span>01 · Latte</span><strong>DESDE {formatARS(5200)}</strong></div><div className="nm-pairing-line"><span>02 · Pastelería del día</span><strong>CONSULTAR</strong></div><Action href="/carta/">VER LA CARTA</Action></div></section>

    <section className="nm-moments"><div className="nm-moments-heading" data-reveal><span className="nm-badge nm-badge-light">ENCUENTROS EN TANDIL</span><h2>HECHO PARA<br />COMPARTIR.</h2></div><div className="nm-moments-card" data-reveal><EditorialPhoto file="barista.jpg" alt="Escena ilustrativa de preparación de café" /><p>Un café para empezar el día. Un vermú para quedarse un rato más. Negro Mercado es un punto de encuentro en Tandil.</p><a href={business.instagram} target="_blank" rel="noreferrer">SEGUÍ EL DÍA A DÍA EN INSTAGRAM <span className="icon-arrow icon-flush" aria-hidden="true" /></a></div><p className="nm-moments-note">Escena ilustrativa; no es un testimonio de cliente.</p><div className="nm-moments-sides"><article className="nm-moment-side"><span>01 / CAFÉ</span><h3>UNA PAUSA<br />A TU RITMO.</h3><p>Espresso, latte y más opciones en la carta de cafetería.</p></article><article className="nm-moment-side"><span>02 / VERMÚ</span><h3>LA TARDE<br />SE COMPARTE.</h3><p>Vermú rojo, blanco o primavera, según la carta.</p></article></div></section>

    <section className="nm-journal"><div className="nm-journal-heading" data-reveal><span className="nm-badge">SEGUÍ LA HISTORIA</span><h2>UN POCO MÁS<br />DE NEGRO.</h2><Action href={business.instagram}>VER INSTAGRAM</Action></div><div className="nm-journal-grid">{[
      ['coffee-table.jpg','CAFÉ','De la primera taza al último sorbo','/carta/'],
      ['coffee-croissant.jpg','PASTELERÍA','Algo rico para acompañar',business.instagram],
      ['vermu-illustration.png','VERMÚ','La tarde también se comparte','/carta/'],
      ['cafe-interior.jpg','TANDIL','Encontranos en Avellaneda 702',business.map],
    ].map(([file,tag,title,url],index) => <a className="nm-journal-card" href={url} key={tag} data-reveal style={{'--reveal-delay': `${index * 70}ms`} as React.CSSProperties}><div className="nm-journal-art"><img src={asset(file)} alt={`Imagen ilustrativa: ${tag.toLowerCase()}`} loading="lazy" /></div><span>{tag} · IMAGEN ILUSTRATIVA</span><h3>{title}</h3></a>)}</div></section>

    <section className="nm-faq"><div data-reveal><span className="nm-badge">PREGUNTAS FRECUENTES</span><h2>ANTES DE<br />VENIR.</h2><p>¿Te queda otra duda? Escribinos y la resolvemos.</p><Action href={`https://wa.me/${business.whatsapp}`}>CONSULTAR</Action></div><div className="nm-faq-list" data-reveal>{[
      ['¿Dónde está Negro Mercado?','En Avellaneda 702, esquina 9 de Julio, Tandil, Buenos Aires.'],
      ['¿Cuáles son los horarios?',`${business.hoursWeek}. ${business.hoursWeekend}.`],
      ['¿Puedo ir con mi mascota?','Sí, Negro Mercado es pet friendly.'],
      ['¿Cómo hago un pedido?','Podés armarlo en la carta y continuar por WhatsApp. El pedido queda sujeto a confirmación del local.'],
    ].map(([question,answer],index) => <div className={`nm-faq-item ${faq === index ? 'open' : ''}`} key={question}><button onClick={() => setFaq(faq === index ? -1 : index)} aria-expanded={faq === index} aria-controls={`nm-faq-${index}`}>{question}<span>{faq === index ? '−' : '+'}</span></button><div id={`nm-faq-${index}`} className="nm-faq-answer" aria-hidden={faq !== index}><p>{answer}</p></div></div>)}</div></section>
  </main>;
}
