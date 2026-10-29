import { useEffect, useMemo, useState } from 'react';
import Home from './Home';
import Carta from './Carta';
import Pedido from './Pedido';
import Productos from './Productos';
import Panel from './Panel';
import { MenuProvider, useMenu } from './menu';
import { captureTable, readTable } from './table';
import { business, coffeeAddOns, formatARS, menu, type MenuItem } from './data';

export type CartLine = { key: string; itemId: string; variant: string; addOnId?: string; quantity: number };
export type Cart = {
  lines: CartLine[];
  count: number;
  add: (item: MenuItem, variant: string, addOnId?: string) => void;
  setQty: (key: string, quantity: number) => void;
  clear: () => void;
};

const cartKey = 'negro-mercado-v3-cart';

function readCart(): CartLine[] {
  try {
    const value = JSON.parse(localStorage.getItem(cartKey) || '[]');
    return Array.isArray(value) ? value.filter((l) => l && typeof l.itemId === 'string' && typeof l.quantity === 'number') : [];
  } catch { return []; }
}

export function Wordmark({ light = false, size = 'md' }: { light?: boolean; size?: 'md' | 'sm' }) {
  return (
    <span className={`wordmark ${light ? 'wordmark-light' : ''} wordmark-${size}`}>
      <span className="wordmark-main">negrö</span>
      <span className="wordmark-sub">mercado</span>
    </span>
  );
}

export function PillLink({ href, children, tone = 'green', external = false }: { href: string; children: React.ReactNode; tone?: 'green' | 'cream' | 'outline'; external?: boolean }) {
  return (
    <a className={`pill pill-${tone}`} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {children}<span className="pill-arrow" aria-hidden="true">↗</span>
    </a>
  );
}

function Header({ count, path, table }: { count: number; path: string; table: number | null }) {
  const [open, setOpen] = useState(false);
  const link = (href: string, label: string, match?: string) => (
    <a href={href} aria-current={match && path === match ? 'page' : undefined} onClick={() => setOpen(false)}>{label}</a>
  );
  return (
    <header className="site-header">
      <div className="header-bar">
        <a className="brand-link" href="/" aria-label="Negro Mercado, inicio"><Wordmark /></a>
        <nav className="main-nav" aria-label="Principal">
          {link('/carta/', 'La carta', '/carta')}
          {link('/productos/', 'Productos', '/productos')}
          {link('/#local', 'El local')}
        </nav>
        <div className="header-actions">
          {table && <a className="table-chip" href="/carta/" aria-label={`Estás en la mesa ${table}`}>Mesa {table}</a>}
          <a className="cart-pill" href="/pedido/" aria-label={`Ver pedido, ${count} productos`} aria-current={path === '/pedido' ? 'page' : undefined}>
            Pedido <span className="cart-count">{count}</span>
          </a>
          <button className="menu-toggle" aria-expanded={open} aria-label={open ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setOpen(!open)}>{open ? '✕' : '☰'}</button>
        </div>
      </div>
      {open && (
        <nav className="mobile-nav" aria-label="Móvil">
          <span className="mobile-nav-title">Páginas</span>
          {link('/', 'Inicio')}{link('/carta/', 'La carta')}{link('/productos/', 'Productos')}{link('/#local', 'El local')}{link('/pedido/', `Pedido (${count})`)}
        </nav>
      )}
    </header>
  );
}

function CartBar({ cart, path }: { cart: Cart; path: string }) {
  const { items } = useMenu();
  if (cart.count === 0 || path === '/pedido') return null;
  const total = cart.lines.reduce((sum, l) => {
    const item = items.find((m) => m.id === l.itemId);
    const v = item?.variants.find((x) => x.label === l.variant);
    const add = coffeeAddOns.find((x) => x.id === l.addOnId);
    return sum + ((v?.price || 0) + (add?.price || 0)) * l.quantity;
  }, 0);
  return (
    <a className="cart-bar" href="/pedido/">
      <span><b>{cart.count}</b> {cart.count === 1 ? 'producto' : 'productos'}</span>
      <span className="cart-bar-total">{formatARS(total)}</span>
      <span className="cart-bar-go">Ver pedido →</span>
    </a>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <Wordmark light />
      <p>{business.address} · {business.hoursWeek} · {business.hoursWeekend}</p>
      <a href={business.instagram} target="_blank" rel="noopener noreferrer">@negromercado.ok ↗</a>
      <p className="footer-note">Demo con datos ficticios. Imágenes ilustrativas; precios y productos de ejemplo.</p>
    </footer>
  );
}

export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export default function App() {
  const [lines, setLines] = useState<CartLine[]>(readCart);
  const [toast, setToast] = useState('');
  if (captureTable()) window.history.replaceState(null, '', '/carta/');
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const table = readTable()?.table ?? null;

  useEffect(() => { try { localStorage.setItem(cartKey, JSON.stringify(lines)); } catch { /* sin almacenamiento */ } }, [lines]);

  const cart = useMemo<Cart>(() => ({
    lines,
    count: lines.reduce((n, l) => n + l.quantity, 0),
    add: (item, variant, addOnId) => {
      setToast(`${item.name} sumado al pedido`);
      const key = `${item.id}:${variant}:${addOnId || ''}`;
      setLines((cur) => cur.some((l) => l.key === key)
        ? cur.map((l) => (l.key === key ? { ...l, quantity: l.quantity + 1 } : l))
        : [...cur, { key, itemId: item.id, variant, addOnId, quantity: 1 }]);
    },
    setQty: (key, quantity) => setLines((cur) => (quantity < 1 ? cur.filter((l) => l.key !== key) : cur.map((l) => (l.key === key ? { ...l, quantity } : l)))),
    clear: () => setLines([]),
  }), [lines]);

  useReveal([path]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 1800); return () => clearTimeout(t); }, [toast]);

  if (path === '/panel') return <Panel />;

  return (
    <MenuProvider>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <Header count={cart.count} path={path} table={table} />
      <main id="contenido">
        {path === '/carta' ? <Carta cart={cart} />
          : path === '/productos' ? <Productos />
          : path === '/pedido' ? <Pedido cart={cart} table={readTable()} />
          : <Home cart={cart} />}
      </main>
      <Footer />
      <CartBar cart={cart} path={path} />
      <div className={`toast ${toast ? 'on' : ''}`} role="status" aria-live="polite">{toast}</div>
    </MenuProvider>
  );
}

export { formatARS, menu, coffeeAddOns, business };
