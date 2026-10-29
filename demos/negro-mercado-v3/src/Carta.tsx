import { useMemo, useState } from 'react';
import { coffeeAddOns, formatARS, type MenuItem } from './data';
import { useMenu } from './menu';
import { readTable } from './table';
import type { Cart } from './App';

const img = (name: string) => `/images/${name}.webp`;
const tints: Record<string, string> = {
  'Cafetería': '#efe9dc', 'Fríos': '#e3ebe2', 'Bebidas frías': '#f3e2c7', 'Filtrados y té': '#efe9dc', 'Vermutería': '#f1d9d3',
};

export function artFor(item: MenuItem): string | null {
  if (['espresso', 'espresso-largo', 'macchiato', 'cortado-chico', 'americano'].includes(item.id)) return 'espresso-illustration';
  if (item.category === 'Cafetería') return 'latte-illustration';
  if (item.category === 'Fríos' && item.id !== 'red-matcha') return 'iced-coffee-illustration';
  if (item.id === 'limonada') return 'lemonade-illustration';
  if (item.category === 'Vermutería') return 'vermu-illustration';
  return null;
}

export default function Carta({ cart }: { cart: Cart }) {
  const { items: allItems, categories, soldOut } = useMenu();
  const table = readTable();
  const [cat, setCat] = useState('Todos');
  const [query, setQuery] = useState('');
  const [sel, setSel] = useState<Record<string, string>>({});
  const [milk, setMilk] = useState<Record<string, string>>({});

  const groups = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('es');
    const items = allItems.filter((m) => !q || m.name.toLocaleLowerCase('es').includes(q));
    return categories.slice(1)
      .map((name) => ({ name, items: items.filter((m) => m.category === name) }))
      .filter((g) => g.items.length && (cat === 'Todos' || q || g.name === cat));
  }, [cat, query, allItems, categories]);

  return (
    <>
      <section className="page-hero">
        <div>
          <p className="tag tag-green">nuestra carta</p>
          <h1><img src={img('la-carta-manuscrita')} alt="La carta. ¿Qué te tienta hoy?" width="900" height="321" /></h1>
        </div>
        <p className="lead">Encontrá tu café, algo fresco o un vermú para compartir.</p>
      </section>

      <div className="carta-layout">
        <aside className="carta-side">
          <h2>Categorías</h2>
          <nav aria-label="Categorías de la carta">
            {categories.map((c) => (
              <button key={c} aria-pressed={cat === c && !query} className={cat === c && !query ? 'on' : ''} onClick={() => { setCat(c); setQuery(''); }}>{c}</button>
            ))}
          </nav>
          <p>Pedís desde tu mesa. El equipo te lo lleva.</p>
        </aside>

        <div className="carta-main">
          <p className={`table-banner ${table ? 'on' : ''}`}>{table ? `Estás en la mesa ${table.table}. Sumá lo que quieras y enviá el pedido desde \"Pedido\".` : 'Estás viendo la carta. Para pedir, escaneá el QR de tu mesa.'}</p>
          <label className="search-label" htmlFor="q">Buscar en la carta</label>
          <input id="q" className="search" type="search" placeholder="Café, vermú, limonada…" value={query} onChange={(e) => setQuery(e.target.value)} />
          <p className="notice">Productos y precios de la carta compartida. Las imágenes son ilustrativas; presentación y disponibilidad se confirman con el local. S, D y T conservan las siglas impresas.</p>

          {groups.map((g) => (
            <section className="carta-group" key={g.name}>
              <h2>{g.name}</h2>
              <div className="carta-grid">
                {g.items.map((item) => {
                  const variant = item.variants.find((v) => v.label === sel[item.id]) ?? item.variants[0];
                  const addOnId = milk[item.id] || '';
                  const addOn = coffeeAddOns.find((a) => a.id === addOnId);
                  const milkOk = item.category === 'Cafetería' && !['espresso', 'espresso-largo', 'americano'].includes(item.id);
                  const art = artFor(item);
                  return (
                    <article className="p-card" style={{ background: tints[item.category] }} key={item.id}>
                      <div className="p-card-head">
                        <h3>{item.name}</h3>
                        <button className="p-add" disabled={soldOut.has(item.id)} onClick={() => cart.add(item, variant.label, addOnId || undefined)} aria-label={`Sumar ${item.name} ${variant.label} al pedido`}>{soldOut.has(item.id) ? 'agotado' : 'sumar +'}</button>
                      </div>
                      <div className="p-art">
                        {art ? <img src={img(art)} alt={`Imagen ilustrativa de ${item.category}`} loading="lazy" /> : <span aria-hidden="true">ö</span>}
                      </div>
                      {item.description && <p className="p-desc">{item.description}</p>}
                      {milkOk && (
                        <div className="p-milk" role="group" aria-label="Leche vegetal">
                          <span>Leche vegetal</span>
                          {coffeeAddOns.map((a) => (
                            <button key={a.id} aria-pressed={addOnId === a.id} className={addOnId === a.id ? 'on' : ''} onClick={() => setMilk({ ...milk, [item.id]: addOnId === a.id ? '' : a.id })}>
                              {a.label.startsWith('Leche de avena') ? 'Avena' : 'Almendras'} +{formatARS(a.price)}
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="p-foot">
                        <div role="group" aria-label={`Opción de ${item.name}`}>
                          {item.variants.map((v) => (
                            <button key={v.label} aria-pressed={variant.label === v.label} className={variant.label === v.label ? 'on' : ''} onClick={() => setSel({ ...sel, [item.id]: v.label })}>{v.label}</button>
                          ))}
                        </div>
                        <strong>{formatARS(variant.price + (addOn?.price || 0))}</strong>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
          {groups.length === 0 && <p className="empty">No encontramos productos con esa búsqueda. Probá con otra palabra.</p>}
        </div>
      </div>
    </>
  );
}
