import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { parsePublicOverrides, type Overrides, type PromoOverride } from '../lib/carta-store';
import '../styles/carrito.css';
import '../styles/admin.css';

interface Item { id: string; name: string; category: string; price: number | null; online: boolean }
interface Props { items: Item[] }

const PW_KEY = 'cp-admin-pw';
const money = (n: number) => '$' + Math.round(n).toLocaleString('es-AR');
const blankPromo = (): PromoOverride => ({ active: false, title: '', text: '', startsAt: '', endsAt: '', ctaLabel: 'Pedir', ctaHref: '/carta' });

type View = 'cargando' | 'login' | 'editor';

export default function Admin({ items }: Props) {
  const [view, setView] = useState<View>('cargando');
  const [pw, setPw] = useState('');
  const [pwInput, setPwInput] = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [soldOut, setSoldOut] = useState<string[]>([]);
  const [promo, setPromo] = useState<PromoOverride>(blankPromo());
  const [saved, setSaved] = useState('');
  const [initial, setInitial] = useState('');
  const [status, setStatus] = useState<{ kind: 'ok' | 'err'; text: string; details?: string[] } | null>(null);
  const [filter, setFilter] = useState('');
  const statusRef = useRef<HTMLDivElement>(null);

  const snapshot = (p: Record<string, string>, s: string[], pr: PromoOverride) => JSON.stringify({ p, s: [...s].sort(), pr });
  const dirty = view === 'editor' && snapshot(prices, soldOut, promo) !== initial;

  const hydrate = (ov: Overrides) => {
    const p: Record<string, string> = {};
    Object.entries(ov.prices).forEach(([id, v]) => { p[id] = String(v); });
    const pr = ov.promo ?? blankPromo();
    setPrices(p); setSoldOut(ov.soldOut); setPromo(pr);
    setSaved(ov.updatedAt);
    setInitial(snapshot(p, ov.soldOut, pr));
  };

  const call = async (password: string, method: 'GET' | 'PUT', body?: unknown) => {
    const res = await fetch('/api/admin/menu', {
      method,
      headers: { authorization: `Bearer ${password}`, ...(body ? { 'content-type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    let data: any = null;
    try { data = await res.json(); } catch { /* respuesta sin JSON */ }
    return { res, data };
  };

  const enter = async (password: string, remember = true) => {
    setBusy(true); setLoginErr('');
    try {
      const { res, data } = await call(password, 'GET');
      if (res.status === 401) { sessionStorage.removeItem(PW_KEY); setView('login'); setLoginErr('Esa contraseña no es correcta.'); return; }
      if (res.status === 503) { setView('login'); setLoginErr(data?.error ?? 'El panel todavía no está configurado.'); return; }
      if (res.status === 404 || !data?.ok) { setView('login'); setLoginErr('El panel solo funciona con el sitio publicado (o con "wrangler pages dev"). No encuentro el servidor.'); return; }
      if (remember) sessionStorage.setItem(PW_KEY, password);
      setPw(password);
      hydrate(parsePublicOverrides(data.overrides));
      setView('editor');
    } catch {
      setView('login'); setLoginErr('No pude conectarme. Revisá tu conexión e intentá de nuevo.');
    } finally { setBusy(false); }
  };

  useEffect(() => {
    const stored = sessionStorage.getItem(PW_KEY);
    if (stored) enter(stored); else setView('login');
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const f = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', f);
    return () => window.removeEventListener('beforeunload', f);
  }, [dirty]);

  const save = async () => {
    setBusy(true); setStatus(null);
    const body = {
      prices: Object.fromEntries(Object.entries(prices).filter(([, v]) => v !== '').map(([id, v]) => [id, Number(v)])),
      soldOut,
      promo: promo.title || promo.text || promo.active ? promo : null,
    };
    try {
      const { res, data } = await call(pw, 'PUT', body);
      if (res.status === 401) { sessionStorage.removeItem(PW_KEY); setView('login'); setLoginErr('La sesión venció. Entrá de nuevo.'); return; }
      if (!res.ok) { setStatus({ kind: 'err', text: data?.error ?? 'No se pudo guardar.', details: data?.details }); setTimeout(() => statusRef.current?.focus(), 30); return; }
      hydrate(parsePublicOverrides(data.overrides));
      setStatus({ kind: 'ok', text: 'Guardado. Se ve en la web en menos de un minuto.' });
      setTimeout(() => statusRef.current?.focus(), 30);
    } catch {
      setStatus({ kind: 'err', text: 'No pude conectarme. No se guardó nada.' });
    } finally { setBusy(false); }
  };

  const discard = () => {
    const s = JSON.parse(initial);
    setPrices(s.p); setSoldOut(s.s); setPromo(s.pr); setStatus(null);
  };

  const logout = () => { sessionStorage.removeItem(PW_KEY); setPw(''); setPwInput(''); setView('login'); setStatus(null); };

  const groups = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const map = new Map<string, Item[]>();
    for (const it of items) {
      if (q && !it.name.toLowerCase().includes(q) && !it.category.toLowerCase().includes(q)) continue;
      if (!map.has(it.category)) map.set(it.category, []);
      map.get(it.category)!.push(it);
    }
    return [...map.entries()];
  }, [items, filter]);

  const changedCount = Object.values(prices).filter((v) => v !== '').length + soldOut.length;

  if (view === 'cargando') return <p class="note">Cargando…</p>;

  if (view === 'login') {
    return (
      <form class="pedido adm-login" onSubmit={(e) => { e.preventDefault(); if (pwInput) enter(pwInput); }} aria-labelledby="adm-title">
        <header class="pedido-head">
          <p class="kicker">Solo para el equipo</p>
          <h1 id="adm-title" class="display-m">Panel de la carta</h1>
          <p class="note">Entrá con la contraseña para cambiar precios, marcar lo que se agotó o activar una promo.</p>
        </header>
        <label class="fld"><span>Contraseña</span>
          <input type="password" autocomplete="current-password" value={pwInput} aria-invalid={!!loginErr} aria-describedby={loginErr ? 'adm-err' : undefined} onInput={(e) => setPwInput((e.target as HTMLInputElement).value)} />
        </label>
        {loginErr && <p class="err" id="adm-err" role="alert">{loginErr}</p>}
        <button type="submit" class="btn btn--wine btn--block" disabled={busy || !pwInput}>{busy ? 'Entrando…' : 'Entrar'}</button>
      </form>
    );
  }

  return (
    <div class="adm">
      <header class="adm-top">
        <div>
          <p class="kicker">Solo para el equipo</p>
          <h1 class="display-m">Panel de la carta</h1>
          <p class="note">Lo que guardes se ve en la web, en la carta del QR y en el pedido, en menos de un minuto.{saved && <> Último cambio: {new Date(saved).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}.</>}</p>
        </div>
        <button type="button" class="link-btn" onClick={logout}>Salir</button>
      </header>

      <div ref={statusRef} tabIndex={-1} class="adm-status-wrap" aria-live="polite">
        {status && (
          <div class={`adm-status adm-status--${status.kind}`} role={status.kind === 'err' ? 'alert' : 'status'}>
            <p><strong>{status.text}</strong></p>
            {status.details && <ul>{status.details.map((d) => <li key={d}>{d}</li>)}</ul>}
          </div>
        )}
      </div>

      <section class="adm-card" aria-labelledby="adm-promo">
        <h2 id="adm-promo" class="display-m">Promo en la cinta de arriba</h2>
        <label class="adm-check"><input type="checkbox" checked={promo.active} onChange={(e) => setPromo({ ...promo, active: (e.target as HTMLInputElement).checked })} /> <span>Mostrar esta promo en la web</span></label>
        <label class="fld"><span>Título (hasta 60 letras)</span>
          <input type="text" maxLength={60} placeholder="Ej: Martes de pizza" value={promo.title} onInput={(e) => setPromo({ ...promo, title: (e.target as HTMLInputElement).value })} />
        </label>
        <label class="fld"><span>Texto (hasta 220 letras)</span>
          <textarea rows={2} maxLength={220} placeholder="Ej: Pedí una pizza y llevate una gaseosa de 1 L. Para retiro y delivery." value={promo.text} onInput={(e) => setPromo({ ...promo, text: (e.target as HTMLTextAreaElement).value })} />
        </label>
        <div class="row2">
          <label class="fld"><span>Empieza</span><input type="datetime-local" value={promo.startsAt} onInput={(e) => setPromo({ ...promo, startsAt: (e.target as HTMLInputElement).value })} /></label>
          <label class="fld"><span>Termina</span><input type="datetime-local" value={promo.endsAt} onInput={(e) => setPromo({ ...promo, endsAt: (e.target as HTMLInputElement).value })} /></label>
        </div>
        <div class="row2">
          <label class="fld"><span>Texto del botón</span><input type="text" maxLength={30} value={promo.ctaLabel} onInput={(e) => setPromo({ ...promo, ctaLabel: (e.target as HTMLInputElement).value })} /></label>
          <label class="fld"><span>Adónde lleva</span><input type="text" maxLength={200} value={promo.ctaHref} placeholder="/carta" onInput={(e) => setPromo({ ...promo, ctaHref: (e.target as HTMLInputElement).value })} /></label>
        </div>
        <p class="small">Horario de Argentina. La promo se muestra sola entre esas dos fechas. Si queda apagada se guarda como borrador.</p>
      </section>

      <section class="adm-card" aria-labelledby="adm-items">
        <h2 id="adm-items" class="display-m">Precios y productos agotados</h2>
        <p class="small">Dejá el precio vacío para usar el original. "Agotado" bloquea el producto en la carta y en el pedido hasta que lo destildes. {changedCount > 0 && <strong>{changedCount} cambio{changedCount === 1 ? '' : 's'} cargado{changedCount === 1 ? '' : 's'}.</strong>}</p>
        <label class="fld"><span>Buscar producto</span>
          <input type="search" placeholder="Ej: milanesa" value={filter} onInput={(e) => setFilter((e.target as HTMLInputElement).value)} />
        </label>
        {groups.length === 0 && <p class="note">No hay productos con ese nombre.</p>}
        {groups.map(([cat, list]) => (
          <fieldset class="adm-cat" key={cat}>
            <legend>{cat}</legend>
            <ul class="adm-list">
              {list.map((it) => {
                const value = prices[it.id] ?? '';
                const gone = soldOut.includes(it.id);
                return (
                  <li class={`adm-row${gone ? ' is-gone' : ''}${value ? ' is-changed' : ''}`} key={it.id}>
                    <div class="adm-name">
                      <p>{it.name}</p>
                      <p class="adm-base">Original: {it.price === null ? 'Consultar' : money(it.price)}{!it.online && ' · solo en el local'}</p>
                    </div>
                    <label class="adm-price">
                      <span class="visually-hidden">Precio de hoy de {it.name}</span>
                      <span class="adm-peso" aria-hidden="true">$</span>
                      <input type="text" inputMode="numeric" maxLength={7} placeholder={it.price === null ? '—' : String(it.price)} value={value} onInput={(e) => setPrices({ ...prices, [it.id]: (e.target as HTMLInputElement).value.replace(/[^0-9]/g, '') })} />
                    </label>
                    <label class="adm-check adm-gone">
                      <input type="checkbox" checked={gone} onChange={(e) => setSoldOut((e.target as HTMLInputElement).checked ? [...soldOut, it.id] : soldOut.filter((x) => x !== it.id))} />
                      <span>Agotado<span class="visually-hidden"> ({it.name})</span></span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        ))}
      </section>

      <div class="adm-bar" role="region" aria-label="Guardar cambios">
        <p class="adm-bar-msg">{dirty ? 'Tenés cambios sin guardar.' : 'Todo guardado.'}</p>
        <button type="button" class="btn btn--outline" onClick={discard} disabled={!dirty || busy}>Descartar</button>
        <button type="button" class="btn btn--wine" onClick={save} disabled={!dirty || busy}>{busy ? 'Guardando…' : 'Guardar cambios'}</button>
      </div>
    </div>
  );
}
