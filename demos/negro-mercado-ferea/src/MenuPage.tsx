import { useEffect, useMemo, useState } from 'react';
import { categories, coffeeAddOns, formatARS, menu, type MenuItem } from './data';
import './menu.css';

type Props = { addItem: (item: MenuItem, variant: string, addOnId?: string) => void };

function visualFor(item: MenuItem) {
  if (['espresso','espresso-largo','macchiato','cortado-chico','americano'].includes(item.id)) return 'espresso-illustration.png';
  if (item.category === 'Cafetería') return 'latte-illustration.png';
  if (item.category === 'Fríos' && item.id !== 'red-matcha') return 'iced-coffee-illustration.png';
  if (item.id === 'limonada') return 'lemonade-illustration.png';
  if (item.category === 'Vermutería') return 'vermu-illustration.png';
  return null;
}

export default function MenuPage({ addItem }: Props) {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Record<string,string>>({});
  const [selectedAddOn, setSelectedAddOn] = useState<Record<string,string>>({});
  const items = useMemo(() => menu.filter(item => item.published && item.name.toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es'))), [query]);
  const groups = categories.slice(1).map((name, index) => ({name, index, items: items.filter(item => item.category === name)})).filter(group => group.items.length);

  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>('.menu-group')];
    const observer = new IntersectionObserver(entries => {
      const intersecting = entries.filter(entry => entry.isIntersecting).sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (intersecting[0]) setActiveCategory(intersecting[0].target.getAttribute('data-category') || 'Todos');
    }, {rootMargin: '-8% 0px -68% 0px'});
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [query]);

  function goToCategory(name: string) {
    if (query) setQuery('');
    setActiveCategory(name);
    requestAnimationFrame(() => {
      if (name === 'Todos') document.querySelector('.menu-page .page-hero')?.scrollIntoView({behavior:'smooth'});
      else document.getElementById(`menu-category-${categories.indexOf(name)}`)?.scrollIntoView({behavior:'smooth'});
    });
  }

  return <main className="menu-page">
    <section className="page-hero" data-reveal><span className="eyebrow badge">NUESTRA CARTA</span><h1 className="menu-hero-lockup"><img src="/images/la-carta-manuscrita.png" alt="La carta. ¿Qué te tienta hoy?" /></h1><p>Encontrá tu café, algo fresco o un vermú para compartir.</p></section>
    <div className="menu-layout">
      <aside className="category-panel"><h2>CATEGORÍAS</h2><nav aria-label="Categorías de la carta">{categories.map(name => <button className={activeCategory === name ? 'selected' : ''} onClick={() => goToCategory(name)} key={name} aria-current={activeCategory === name ? 'true' : undefined}>{name}</button>)}</nav></aside>
      <div className="menu-content">
        <div className="menu-tools"><label htmlFor="search">BUSCAR EN LA CARTA</label><input id="search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Café, vermú, limonada..." /></div>
        <p className="menu-notice">Productos y precios de la carta compartida. Las imágenes son ilustrativas; presentación y disponibilidad se confirman con el local. S, D y T conservan las siglas impresas.</p>
        {groups.map(group => <section className="menu-group" id={`menu-category-${group.index + 1}`} data-category={group.name} key={group.name}>
          <h2 data-reveal>{group.name}</h2>
          <div className="product-grid">{group.items.map(item => {
            const variant = item.variants.find(v => v.label === selected[item.id]) ?? item.variants[0];
            const addOnId = selectedAddOn[item.id] || '';
            const addOn = coffeeAddOns.find(a => a.id === addOnId);
            const milkEligible = item.category === 'Cafetería' && !['espresso','espresso-largo','americano'].includes(item.id);
            const visual = visualFor(item);
            return <article className="product-card" key={item.id} data-reveal>
              <div className="product-card-head"><div><span className="product-index">NEGRO MERCADO / {group.name}</span><h3>{item.name}</h3></div><button className="add-button" onClick={() => addItem(item, variant.label, addOnId || undefined)} aria-label={`Agregar ${item.name} ${variant.label} al pedido`}>SUMAR <span>+</span></button></div>
              <div className={`menu-product-art ${visual ? '' : 'menu-product-art-abstract'}`}>{visual ? <img src={`/images/${visual}`} alt={`Imagen ilustrativa de la categoría ${group.name}`} loading="lazy" /> : <span aria-hidden="true">◉<small>{group.name}</small></span>}</div>
              {item.description && <p className="menu-product-description">{item.description}</p>}
              {milkEligible && <label className="add-on-select">LECHE VEGETAL <select value={addOnId} onChange={event => setSelectedAddOn({...selectedAddOn,[item.id]:event.target.value})}><option value="">Sin adicional</option>{coffeeAddOns.map(a => <option key={a.id} value={a.id}>{a.label} +{formatARS(a.price)}</option>)}</select></label>}
              <div className="product-actions"><div className="variant-row" role="group" aria-label={`Opción de ${item.name}`}>{item.variants.map(v => <button key={v.label} className={variant.label === v.label ? 'active' : ''} onClick={() => setSelected({...selected,[item.id]:v.label})} aria-pressed={variant.label === v.label}>{v.label}</button>)}</div><strong>{formatARS(variant.price + (addOn?.price || 0))}</strong></div>
            </article>;
          })}</div>
        </section>)}
        {items.length === 0 && <p className="empty-state">No encontramos productos con esa búsqueda.</p>}
      </div>
    </div>
  </main>;
}
