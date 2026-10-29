import { useEffect, useState } from 'react';
import Home from './Home';
import MenuPage from './MenuPage';
import { business, coffeeAddOns, formatARS, menu, type MenuItem } from './data';

type CartLine = { key: string; itemId: string; variant: string; addOnId?: string; quantity: number };
const cartKey = 'negro-mercado-cart-v1';
const img = (name: string) => `/images/${name}.jpg`;

function readCart(): CartLine[] {
  try {
    const value = JSON.parse(localStorage.getItem(cartKey) || '[]');
    return Array.isArray(value) ? value.filter((line) => line && typeof line.itemId === 'string' && typeof line.quantity === 'number') : [];
  } catch { return []; }
}

function Mark({ light = false }: { light?: boolean }) {
  return <img className={`brand-mark ${light ? 'brand-mark-light' : ''}`} src={img('negro-symbol')} alt="Símbolo de Negro Mercado" width="42" height="42" />;
}

function ButtonLink({ href, children, outline = false, onClick }: { href: string; children: React.ReactNode; outline?: boolean; onClick?: () => void }) {
  return <a className={`pill-button ${outline ? 'pill-outline' : ''}`} href={href} onClick={onClick}><span className="rolling-label"><span>{children}</span><span aria-hidden="true">{children}</span></span><span className="button-arrow" aria-hidden="true"><span className="icon-arrow icon-flush" /></span></a>;
}

function useSiteMotion(path: string) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) return;
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0.09, rootMargin: '0px 0px -50px 0px'});
    targets.forEach(target => observer.observe(target));

    const parallax = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
    let frame = 0;
    const update = () => {
      frame = 0;
      parallax.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > innerHeight + 100) return;
        const shift = Math.max(-45, Math.min(45, (innerHeight / 2 - (rect.top + rect.height / 2)) * 0.065));
        element.style.setProperty('--parallax-y', `${shift.toFixed(1)}px`);
      });
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
      document.documentElement.classList.remove('motion-ready');
    };
  }, [path]);
}

function Header({ count, openCart }: { count: number; openCart: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => { setMobileOpen(false); }, []);
  return <header className="site-header">
    <div className="header-inner">
      <nav className="desktop-nav" aria-label="Navegación principal">
        <a href="/">Inicio</a><a href="/#historia">Historia</a><a href="/carta/">Carta</a><a href="/productos/">Productos</a><a href="/#local">El local</a>
      </nav>
      <a className="brand" href="/" aria-label="Negro Mercado, inicio"><Mark /><span>NEGRO<br />MERCADO</span></a>
      <div className="header-actions"><button className="cart-link" onClick={openCart} aria-label={`Abrir carrito, ${count} productos`}>PEDIDO <span>{count}</span></button><button className="mobile-toggle" aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}><span></span><span></span></button></div>
    </div>
    {mobileOpen && <nav className="mobile-nav" aria-label="Navegación móvil"><span className="mobile-nav-heading">PÁGINAS</span><a href="/" onClick={() => setMobileOpen(false)}>Inicio</a><a href="/#historia" onClick={() => setMobileOpen(false)}>Nuestra historia</a><a href="/carta/" onClick={() => setMobileOpen(false)}>Carta</a><a href="/productos/" onClick={() => setMobileOpen(false)}>Productos</a><a href="/#local" onClick={() => setMobileOpen(false)}>El local</a><button onClick={() => {setMobileOpen(false);openCart();}}>Ver pedido ({count})</button></nav>}
  </header>;
}

function ProductsPage() {
  return <main className="products-page"><section className="page-hero" data-reveal><span className="eyebrow badge">PRODUCTOS</span><h1>PARA LLEVAR<br /><span className="tilt-strip">UN POCO MÁS</span></h1><p>Esta sección está preparada para los productos que Negro Mercado confirme para venta. Todavía no hay artículos publicados con precio y stock validados.</p></section><div className="products-empty" data-reveal><Mark /><h2>PRÓXIMAMENTE<br />POR ACÁ.</h2><p>Mientras tanto, podés consultar los productos disponibles hoy directamente con el local.</p><ButtonLink href={`https://wa.me/${business.whatsapp}`}>CONSULTAR POR WHATSAPP</ButtonLink></div></main>;
}

function Cart({ lines, setLines, close }: { lines: CartLine[]; setLines: (lines: CartLine[]) => void; close: () => void }) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [notes, setNotes] = useState('');
  const [review, setReview] = useState(false);
  const enriched = lines.map(line => {const item = menu.find(m => m.id === line.itemId); const variant = item?.variants.find(v => v.label === line.variant); const addOn = coffeeAddOns.find(a => a.id === line.addOnId); return {...line,item,variant,addOn};}).filter(line => line.item && line.variant);
  const subtotal = enriched.reduce((sum,line) => sum + ((line.variant?.price || 0) + (line.addOn?.price || 0)) * line.quantity,0);
  const count = enriched.reduce((sum,line) => sum + line.quantity,0);
  const update = (key:string, quantity:number) => setLines(quantity < 1 ? lines.filter(line => line.key !== key) : lines.map(line => line.key === key ? {...line,quantity} : line));
  const message = `Hola, soy ${name.trim()}. Quiero consultar por este pedido de Negro Mercado:\n\n${enriched.map(line => `• ${line.quantity} × ${line.item!.name} (${line.variant!.label}${line.addOn ? ` + ${line.addOn.label}` : ''}) — ${formatARS((line.variant!.price + (line.addOn?.price || 0)) * line.quantity)}`).join('\n')}\n\nSubtotal de referencia: ${formatARS(subtotal)}\nContacto: ${contact.trim()}${notes.trim() ? `\nObservaciones: ${notes.trim()}` : ''}\n\n¿Me confirman disponibilidad, modalidad de entrega y total final? Entiendo que el pedido queda sujeto a confirmación por este chat.`;
  const valid = count > 0 && name.trim().length >= 2 && contact.trim().length >= 6;
  return <div className="drawer-wrap" role="presentation" onMouseDown={event => {if (event.target === event.currentTarget) close();}}><aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Tu pedido"><div className="drawer-header"><div><span className="eyebrow">NEGRO MERCADO</span><h2>TU PEDIDO <sup>{count}</sup></h2></div><button onClick={close} aria-label="Cerrar carrito"><span className="icon-close" aria-hidden="true" /></button></div>{count === 0 ? <div className="cart-empty"><p>Tu pedido todavía está vacío.</p><ButtonLink href="/carta/" onClick={close}>EXPLORAR CARTA</ButtonLink></div> : <><div className="cart-scroll"><div className="cart-items">{enriched.map(line => <div className="cart-item" key={line.key}><div><h3>{line.item!.name}</h3><p>{line.variant!.label}{line.addOn ? ` + ${line.addOn.label}` : ''} · {formatARS(line.variant!.price + (line.addOn?.price || 0))}</p></div><div className="qty"><button onClick={() => update(line.key,line.quantity-1)} aria-label={`Quitar una unidad de ${line.item!.name}`}>−</button><span>{line.quantity}</span><button onClick={() => update(line.key,line.quantity+1)} aria-label={`Sumar una unidad de ${line.item!.name}`}>+</button></div><button className="remove" onClick={() => update(line.key,0)}>Eliminar</button></div>)}</div><div className="cart-subtotal"><span>SUBTOTAL DE REFERENCIA</span><strong>{formatARS(subtotal)}</strong></div><p className="cart-disclaimer">El precio y la disponibilidad se confirman por WhatsApp. El pedido aún no está aceptado.</p><div className="checkout-form"><label>Tu nombre<input value={name} onChange={event => setName(event.target.value)} autoComplete="name" required /></label><label>Tu contacto<input value={contact} onChange={event => setContact(event.target.value)} autoComplete="tel" required /></label><label>Observaciones<textarea value={notes} onChange={event => setNotes(event.target.value)} rows={3} placeholder="Aclaraciones para el local" /></label><p>La modalidad de entrega se coordina con el local por WhatsApp.</p></div></div><div className="drawer-footer">{review && <p className="review-message">Revisá los productos, cantidades y datos. Al continuar se abrirá WhatsApp con el mensaje listo para enviar.</p>}<button className="checkout-button" disabled={!valid} onClick={() => {if (!review) {setReview(true); return;} window.open(`https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer');}}> {review ? <>CONTINUAR POR WHATSAPP <span className="icon-arrow icon-flush" aria-hidden="true" /></> : <>REVISAR PEDIDO <span className="icon-arrow-right icon-flush" aria-hidden="true" /></>}</button>{!valid && <small>Ingresá nombre y contacto para continuar.</small>}</div></>}</aside></div>;
}

function Footer({ openCart }: { openCart: () => void }) {
  return <footer className="site-footer"><div className="footer-cta"><span className="eyebrow badge">TE ESPERAMOS EN TANDIL</span><h2>VENÍ POR TU<br /><em>PRÓXIMO CAFÉ.</em></h2><ButtonLink href="/carta/">VER LA CARTA</ButtonLink></div><div className="footer-main"><div className="footer-brand"><Mark light /><span>NEGRO<br />MERCADO</span></div><div><h3>ENCONTRANOS</h3><p>{business.address}</p><a href={business.map} target="_blank" rel="noreferrer">CÓMO LLEGAR <span className="icon-arrow icon-flush" aria-hidden="true" /></a></div><div><h3>HORARIOS</h3><p>{business.hoursWeek}<br />{business.hoursWeekend}</p><p>Pet friendly</p></div><div><h3>SEGUINOS</h3><a href={business.instagram} target="_blank" rel="noreferrer">INSTAGRAM <span className="icon-arrow icon-flush" aria-hidden="true" /></a><button onClick={openCart}>TU PEDIDO <span className="icon-arrow icon-flush" aria-hidden="true" /></button></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} NEGRO MERCADO</span><span>FOTOS EDITORIALES ILUSTRATIVAS · DATOS DE CARTA A CONFIRMAR</span><a href="/#inicio">VOLVER ARRIBA <span className="icon-arrow-up icon-flush" aria-hidden="true" /></a></div></footer>;
}

export default function App() {
  const [lines, setLines] = useState<CartLine[]>(readCart);
  const [cartOpen, setCartOpen] = useState(false);
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  useSiteMotion(path);
  useEffect(() => { localStorage.setItem(cartKey, JSON.stringify(lines)); }, [lines]);
  useEffect(() => { document.body.classList.toggle('cart-is-open', cartOpen); return () => document.body.classList.remove('cart-is-open'); }, [cartOpen]);
  useEffect(() => { const handler = (e:KeyboardEvent) => {if (e.key === 'Escape') setCartOpen(false);}; window.addEventListener('keydown',handler); return () => window.removeEventListener('keydown',handler); }, []);
  function addItem(item:MenuItem,variant:string,addOnId?:string) { const key = `${item.id}:${variant}:${addOnId || ''}`; setLines(current => current.some(line => line.key === key) ? current.map(line => line.key === key ? {...line,quantity:line.quantity+1} : line) : [...current,{key,itemId:item.id,variant,addOnId,quantity:1}]); setCartOpen(true); }
  const count = lines.reduce((sum,line) => sum + line.quantity,0);
  return <><Header count={count} openCart={() => setCartOpen(true)} />{path === '/carta' ? <MenuPage addItem={addItem} /> : path === '/productos' ? <ProductsPage /> : <Home addItem={addItem} />}<Footer openCart={() => setCartOpen(true)} />{cartOpen && <Cart lines={lines} setLines={setLines} close={() => setCartOpen(false)} />}</>;
}
