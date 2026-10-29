import { useCallback, useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { api, type OrderStatus, type PanelOrder, type PanelProduct } from './api';
import { formatARS } from './data';
import './panel.css';

const pinKey = 'negro-mercado-v3-panel-pin';
type Tab = 'orders' | 'menu' | 'tables';

function ago(ms: number) {
  const m = Math.max(0, Math.round(ms / 60000));
  return m < 1 ? 'recién' : m < 60 ? `hace ${m} min` : `hace ${Math.floor(m / 60)} h ${m % 60} min`;
}

function useBeep() {
  const ctx = useRef<AudioContext | null>(null);
  const [armed, setArmed] = useState(false);
  const arm = () => {
    try { ctx.current = ctx.current || new AudioContext(); void ctx.current.resume(); setArmed(true); } catch { /* sin audio */ }
  };
  const beep = () => {
    const c = ctx.current;
    if (!c) return;
    [660, 880].forEach((f, i) => {
      const o = c.createOscillator(); const g = c.createGain();
      o.frequency.value = f; o.connect(g); g.connect(c.destination);
      g.gain.setValueAtTime(0.0001, c.currentTime + i * 0.18);
      g.gain.exponentialRampToValueAtTime(0.25, c.currentTime + i * 0.18 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + i * 0.18 + 0.16);
      o.start(c.currentTime + i * 0.18); o.stop(c.currentTime + i * 0.18 + 0.18);
    });
  };
  return { armed, arm, beep };
}

function Login({ onPin }: { onPin: (pin: string) => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try { await api.panel.settings(pin); onPin(pin); } catch (err) { setError((err as Error).message); }
  }
  return (
    <main className="panel-login">
      <form onSubmit={submit}>
        <p className="panel-brand">negrö <small>mercado</small></p>
        <h1>Panel del salón</h1>
        <label>PIN<input type="password" inputMode="numeric" autoComplete="current-password" value={pin} onChange={(e) => setPin(e.target.value)} autoFocus /></label>
        {error && <p className="panel-error" role="alert">{error}</p>}
        <button type="submit" disabled={!pin}>Entrar</button>
      </form>
    </main>
  );
}

const nextAction: Partial<Record<OrderStatus, { to: OrderStatus; label: string }>> = {
  new: { to: 'preparing', label: 'Empezar' },
  preparing: { to: 'ready', label: 'Listo' },
  ready: { to: 'delivered', label: 'Entregado' },
};

function Orders({ pin, beep, armed, arm }: { pin: string; beep: () => void; armed: boolean; arm: () => void }) {
  const [orders, setOrders] = useState<PanelOrder[]>([]);
  const [now, setNow] = useState(Date.now());
  const [error, setError] = useState('');
  const seen = useRef<Set<string> | null>(null);
  const [flash, setFlash] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    try {
      const r = await api.panel.orders(pin);
      setOrders(r.orders); setNow(r.now); setError('');
      const ids = new Set(r.orders.filter((o) => o.status === 'new').map((o) => o.id));
      if (seen.current) {
        const fresh = [...ids].filter((id) => !seen.current!.has(id));
        if (fresh.length) { beep(); setFlash(new Set(fresh)); setTimeout(() => setFlash(new Set()), 6000); document.title = `(${fresh.length}) Nuevo pedido · Panel`; }
      }
      seen.current = new Set([...(seen.current || []), ...ids]);
    } catch (e) { setError((e as Error).message); }
  }, [pin, beep]);

  useEffect(() => { void load(); const t = setInterval(load, 4000); return () => clearInterval(t); }, [load]);
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(t); }, []);

  async function move(o: PanelOrder, to: OrderStatus) {
    try { await api.panel.setStatus(pin, o.id, to); await load(); } catch (e) { setError((e as Error).message); }
  }

  const col = (status: OrderStatus, title: string) => {
    const list = orders.filter((o) => o.status === status);
    return (
      <section className={`col col-${status}`} aria-label={title}>
        <h2>{title} <span>{list.length}</span></h2>
        {list.length === 0 && <p className="col-empty">Sin pedidos</p>}
        {list.map((o) => {
          const act = nextAction[o.status];
          return (
            <article className={`ticket ${flash.has(o.id) ? 'flash' : ''}`} key={o.id}>
              <header><strong className="ticket-table">Mesa {o.table}</strong><span>#{o.number} · {ago(now - o.createdAt)}</span></header>
              {o.customer && <p className="ticket-name">{o.customer}</p>}
              <ul>{o.items.map((it, i) => <li key={i}><b>{it.qty}×</b> {it.name} <em>({it.variant}{it.addOn ? ` + ${it.addOn}` : ''})</em></li>)}</ul>
              {o.notes && <p className="ticket-notes">“{o.notes}”</p>}
              <footer>
                <span>{formatARS(o.total)}</span>
                {o.status === 'new' && <button className="ghost" onClick={() => { if (confirm(`¿Cancelar el pedido #${o.number}?`)) void move(o, 'cancelled'); }}>Cancelar</button>}
                {act && <button onClick={() => move(o, act.to)}>{act.label}</button>}
              </footer>
            </article>
          );
        })}
      </section>
    );
  };

  const done = orders.filter((o) => o.status === 'delivered' || o.status === 'cancelled').slice(-12).reverse();
  return (
    <>
      {!armed && <button className="sound" onClick={arm}>🔔 Activar aviso sonoro de pedidos nuevos</button>}
      {error && <p className="panel-error" role="alert">{error}</p>}
      <div className="board">{col('new', 'Nuevos')}{col('preparing', 'En preparación')}{col('ready', 'Listos para llevar')}</div>
      <details className="done"><summary>Entregados y cancelados hoy ({done.length})</summary>
        <ul>{done.map((o) => <li key={o.id}>Mesa {o.table} · #{o.number} · {o.status === 'delivered' ? 'entregado' : 'cancelado'} · {formatARS(o.total)}</li>)}</ul>
      </details>
    </>
  );
}

function ProductRow({ pin, p, onSaved }: { pin: string; p: PanelProduct; onSaved: () => void }) {
  const [draft, setDraft] = useState(p);
  const [msg, setMsg] = useState('');
  const dirty = JSON.stringify(draft) !== JSON.stringify(p);
  async function save() {
    try { await api.panel.saveProduct(pin, draft, false); setMsg('Guardado'); onSaved(); } catch (e) { setMsg((e as Error).message); }
  }
  return (
    <tr className={!draft.published ? 'off' : ''}>
      <td><input aria-label="Nombre" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></td>
      <td><input aria-label="Categoría" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} /></td>
      <td className="prices">
        {draft.variants.map((v, i) => (
          <label key={i}>{v.label}<input inputMode="numeric" aria-label={`Precio ${v.label}`} placeholder="$ falta" value={v.price ?? ''} onChange={(e) => setDraft({ ...draft, variants: draft.variants.map((x, j) => (j === i ? { ...x, price: e.target.value === '' ? null : Number(e.target.value.replace(/\D/g, '')) } : x)) })} /></label>
        ))}
      </td>
      <td><label className="check"><input type="checkbox" checked={draft.available} onChange={(e) => setDraft({ ...draft, available: e.target.checked })} /> Hay</label></td>
      <td><label className="check"><input type="checkbox" checked={draft.published} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} /> En la carta</label></td>
      <td><button disabled={!dirty} onClick={save}>Guardar</button><small>{msg}</small></td>
    </tr>
  );
}

function MenuAdmin({ pin }: { pin: string }) {
  const [products, setProducts] = useState<PanelProduct[]>([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', category: 'Café de especialidad', variant: 'Único', price: '', description: '' });
  const load = useCallback(() => api.panel.products(pin).then((r) => setProducts(r.products)).catch((e) => setError(e.message)), [pin]);
  useEffect(() => { void load(); }, [load]);
  async function add(e: React.FormEvent) {
    e.preventDefault(); setError('');
    try {
      await api.panel.saveProduct(pin, { name: form.name, category: form.category, description: form.description, variants: [{ label: form.variant || 'Único', price: form.price === '' ? null : Number(form.price) }], available: true, published: form.price !== '' }, true);
      setForm({ ...form, name: '', price: '', description: '' }); await load();
    } catch (err) { setError((err as Error).message); }
  }
  return (
    <>
      {error && <p className="panel-error" role="alert">{error}</p>}
      <form className="new-product" onSubmit={add}>
        <h2>Agregar producto</h2>
        <label>Nombre<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>Categoría<input required list="cats" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></label>
        <datalist id="cats">{[...new Set(products.map((p) => p.category))].map((c) => <option key={c} value={c} />)}</datalist>
        <label>Opción<input value={form.variant} onChange={(e) => setForm({ ...form, variant: e.target.value })} /></label>
        <label>Precio ($)<input inputMode="numeric" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value.replace(/\D/g, '') })} placeholder="vacío = borrador" /></label>
        <label className="wide">Descripción<input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        <button type="submit">Agregar</button>
      </form>
      <p className="panel-hint">Un producto sin precio queda como borrador y no aparece en la carta. Desmarcá “Hay” cuando se agote en el día.</p>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Producto</th><th>Categoría</th><th>Precios</th><th>Stock</th><th>Carta</th><th /></tr></thead>
          <tbody>{products.map((p) => <ProductRow key={p.id + JSON.stringify(p)} pin={pin} p={p} onSaved={load} />)}</tbody>
        </table>
      </div>
    </>
  );
}

function Tables({ pin }: { pin: string }) {
  const [tables, setTables] = useState(12);
  const [accepting, setAccepting] = useState(true);
  const [codes, setCodes] = useState<{ table: number; url: string; img: string }[]>([]);
  const [msg, setMsg] = useState('');

  const draw = useCallback(async (n: number) => {
    const out: { table: number; url: string; img: string }[] = [];
    for (let t = 1; t <= n; t++) {
      const r = await api.panel.qr(pin, t);
      out.push({ table: t, url: r.url, img: await QRCode.toDataURL(r.url, { margin: 1, width: 360, errorCorrectionLevel: 'M' }) });
    }
    setCodes(out);
  }, [pin]);

  useEffect(() => { api.panel.settings(pin).then((s) => { setTables(s.tables); setAccepting(s.accepting); return draw(s.tables); }).catch((e) => setMsg(e.message)); }, [pin, draw]);

  async function save() {
    try { await api.panel.saveSettings(pin, { tables, accepting }); setMsg('Guardado'); await draw(tables); } catch (e) { setMsg((e as Error).message); }
  }
  return (
    <>
      <div className="settings">
        <label>Cantidad de mesas<input type="number" min={1} max={80} value={tables} onChange={(e) => setTables(Number(e.target.value))} /></label>
        <label className="check"><input type="checkbox" checked={accepting} onChange={(e) => setAccepting(e.target.checked)} /> Tomando pedidos desde la mesa</label>
        <button onClick={save}>Guardar y regenerar QR</button>
        <button className="ghost" onClick={() => window.print()}>Imprimir QR</button>
        <small>{msg}</small>
      </div>
      <p className="panel-hint">Cada QR lleva el número de mesa y un código propio. Si cambiás el secreto del Worker, hay que imprimirlos de nuevo.</p>
      <div className="qr-grid">
        {codes.map((c) => (
          <figure key={c.table}>
            <img src={c.img} alt={`QR de la mesa ${c.table}`} />
            <figcaption><strong>Mesa {c.table}</strong><span>Escaneá y pedí desde acá</span></figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}

export default function Panel() {
  const [pin, setPin] = useState<string>(() => { try { return sessionStorage.getItem(pinKey) || ''; } catch { return ''; } });
  const [tab, setTab] = useState<Tab>('orders');
  const sound = useBeep();
  useEffect(() => { document.title = 'Panel · Negro Mercado'; }, []);
  if (!pin) return <Login onPin={(p) => { try { sessionStorage.setItem(pinKey, p); } catch { /* nada */ } setPin(p); }} />;
  return (
    <div className="panel">
      <header className="panel-bar">
        <p className="panel-brand">negrö <small>mercado · salón</small></p>
        <nav aria-label="Secciones del panel">
          {([['orders', 'Pedidos'], ['menu', 'Carta'], ['tables', 'Mesas y QR']] as [Tab, string][]).map(([id, label]) => (
            <button key={id} aria-pressed={tab === id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>{label}</button>
          ))}
        </nav>
        <button className="ghost" onClick={() => { try { sessionStorage.removeItem(pinKey); } catch { /* nada */ } setPin(''); }}>Salir</button>
      </header>
      <main>
        {tab === 'orders' && <Orders pin={pin} beep={sound.beep} armed={sound.armed} arm={sound.arm} />}
        {tab === 'menu' && <MenuAdmin pin={pin} />}
        {tab === 'tables' && <Tables pin={pin} />}
      </main>
    </div>
  );
}
