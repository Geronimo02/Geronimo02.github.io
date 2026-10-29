import { useEffect, useRef, useState } from 'react';
import { business, formatARS, menu } from './data';
import { PillLink, type Cart } from './App';

const img = (name: string) => `/images/${name}.webp`;

const heroTabs = [
  { id: 'cafe', label: 'Café', file: 'hero-cup-illustration', alt: 'Vaso de café verde con salpicadura y granos', bg: '#cfe3d2' },
  { id: 'croissant', label: 'Croissant', file: 'croissant-split', alt: 'Croissant abierto', bg: '#f3e2c7' },
  { id: 'vermu', label: 'Vermú', file: 'vermu-illustration', alt: 'Vaso de vermú rojo con rodaja de naranja', bg: '#f1c9c3' },
] as const;

const railProducts = [
  { id: 'latte', file: 'latte-illustration', alt: 'Latte con corazón en taza blanca', tint: '#efe9dc' },
  { id: 'espresso', file: 'espresso-illustration', alt: 'Espresso en vaso de vidrio', tint: '#e3ebe2' },
  { id: 'iced-latte', file: 'iced-coffee-illustration', alt: 'Café helado con leche y granos', tint: '#e3ebe2' },
  { id: 'limonada', file: 'lemonade-illustration', alt: 'Limonada con menta y rodaja de limón', tint: '#f3e2c7' },
  { id: 'vermu-vaso', file: 'vermu-illustration', alt: 'Vaso de vermú rojo con naranja', tint: '#f1d9d3' },
];

const marquee = ['Tandil', 'Café', 'Pastelería', 'Vermú'];

function useHeroParallax(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = Math.max(-40, Math.min(600, -el.getBoundingClientRect().top));
      el.style.setProperty('--sy', String(y));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', onScroll, { passive: true });
    return () => { removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [ref]);
}

export default function Home({ cart }: { cart: Cart }) {
  const hero = useRef<HTMLElement>(null);
  const [tab, setTab] = useState<(typeof heroTabs)[number]['id']>('cafe');
  useHeroParallax(hero);
  const active = heroTabs.find((t) => t.id === tab)!;

  return (
    <>
      <section className="hero" id="inicio" ref={hero}>
        <div className="hero-ghost" aria-hidden="true">ö</div>
        <div className="hero-copy">
          <p className="tag tag-outline">buenos momentos</p>
          <h1><img className="hero-title" src={img('un-rato-en-negro')} alt="Un rato en negro. Café del bueno." width="1400" height="700" /></h1>
          <p className="eyebrow">Un lugar para quedarse</p>
          <p className="lead">Café de especialidad, pastelería y algo rico para disfrutar en Tandil.</p>
          <PillLink href="/carta/">Ver la carta</PillLink>
        </div>
        <div className="hero-stage">
          <div className="hero-disc" style={{ background: active.bg }} />
          {heroTabs.map((t) => (
            <img key={t.id} className={`hero-product hero-product-${t.id} ${t.id === tab ? 'is-on' : ''}`} src={img(t.file)} alt={t.id === tab ? t.alt : ''} aria-hidden={t.id !== tab} />
          ))}
          {[1, 2, 3].map((n) => <img key={n} className={`bean bean-${n}`} src={img('coffee-bean-illustration')} alt="" aria-hidden="true" />)}
          <div className="hero-tabs" role="group" aria-label="Elegí qué mirar">
            {heroTabs.map((t) => (
              <button key={t.id} aria-pressed={t.id === tab} className={t.id === tab ? 'on' : ''} onClick={() => setTab(t.id)}>{t.label}</button>
            ))}
          </div>
          <span className="stage-note">Composiciones ilustrativas</span>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((g) => (
            <div className="marquee-group" key={g}>
              {[...marquee, ...marquee].map((w, i) => <span key={i}>{w}<b>ö</b></span>)}
            </div>
          ))}
        </div>
      </div>

      <section className="rail-section" id="carta">
        <div className="section-head" data-reveal>
          <h2><img src={img('la-carta-manuscrita')} alt="La carta. ¿Qué te tienta hoy?" width="900" height="321" /></h2>
          <p>Deslizá, elegí y sumalo al pedido. Lo cerramos por WhatsApp con el local.</p>
        </div>
        <div className="rail" tabIndex={0} aria-label="Productos de la carta">
          {railProducts.map((r) => {
            const item = menu.find((m) => m.id === r.id)!;
            const variant = item.variants[0];
            return (
              <article className="rail-card" style={{ background: r.tint }} key={r.id}>
                <div className="rail-card-top">
                  <p>{item.category}</p>
                  <button onClick={() => cart.add(item, variant.label)} aria-label={`Sumar ${item.name} al pedido`}>sumar +</button>
                </div>
                <div className="rail-art"><img src={img(r.file)} alt={r.alt} loading="lazy" /></div>
                <div className="rail-card-foot"><h3>{item.name}</h3><p>desde {formatARS(variant.price)}</p></div>
              </article>
            );
          })}
        </div>
        <p className="fine">Imágenes ilustrativas. Precios de la carta compartida, a confirmar con el local.</p>
      </section>

      <div className="checker" aria-hidden="true" />

      <section className="craft" id="oficio">
        <img className="bean bean-craft-1" src={img('coffee-bean-illustration')} alt="" aria-hidden="true" />
        <img className="bean bean-craft-2" src={img('coffee-bean-illustration')} alt="" aria-hidden="true" />
        <p className="script script-brown" data-reveal>desde 2020</p>
        <h2 className="craft-title" data-reveal>el oficio se<br />nota en <span>cada capa.</span></h2>
        <div className="craft-grid">
          <article className="craft-card craft-photo" data-reveal>
            <img src={img('barista')} alt="Imagen ilustrativa de un barista preparando café" loading="lazy" />
            <div className="craft-caption"><h3>Café de especialidad</h3><p>Espresso, filtrados y fríos, hechos al momento.</p></div>
          </article>
          <article className="craft-card craft-paper" data-reveal>
            <p className="eyebrow eyebrow-brown">Laminados</p>
            <img src={img('croissant-split')} alt="Croissant abierto" loading="lazy" />
            <div><h3>Masa, manteca y tiempo.</h3><p>El alfajor de almendras nos acompaña desde el principio.</p></div>
          </article>
          <article className="craft-card craft-photo" data-reveal>
            <img src={img('coffee-table')} alt="Imagen ilustrativa de una mesa con croissant y café" loading="lazy" />
            <div className="craft-caption"><h3>Pastelería del día</h3><p>Consultá al equipo qué salió hoy del horno.</p></div>
          </article>
        </div>
      </section>

      <section className="place" id="local">
        <div className="place-copy" data-reveal>
          <h2>donde pasan<br />las cosas<br />buenas<span>.</span></h2>
          <p className="address">Avellaneda 702, esquina 9 de Julio</p>
          <p className="muted">Tandil, Buenos Aires · Pet friendly</p>
          <dl>
            <dt>Lunes a viernes</dt><dd>7:30 a 20:30</dd>
            <dt>Sábados y domingos</dt><dd>9:00 a 20:30</dd>
          </dl>
          <PillLink href={business.map} external>Cómo llegar</PillLink>
        </div>
        <div className="place-photos" data-reveal>
          <img className="place-a" src={img('cafe-interior')} alt="Imagen ilustrativa del interior del local" loading="lazy" />
          <img className="place-b" src={img('coffee-table')} alt="Imagen ilustrativa de una mesa con café y croissant" loading="lazy" />
          <span>Fotos ilustrativas, faltan las del local.</span>
        </div>
      </section>

      <section className="cta-band">
        <div className="cta-ghost" aria-hidden="true">ö</div>
        <div data-reveal>
          <p className="script">tu pedido</p>
          <h2>{cart.count ? 'casi listo.' : 'armá el tuyo.'}</h2>
          <p>{cart.count ? 'Revisalo y mandalo por WhatsApp. El local lo confirma.' : 'Sumá productos desde la carta y los mandamos por WhatsApp. Sin cobro online.'}</p>
        </div>
        <div className="cta-card" data-reveal>
          <p className="eyebrow">Resumen</p>
          <strong>{cart.count} producto{cart.count === 1 ? '' : 's'}</strong>
          <p>El local confirma disponibilidad y precio final.</p>
          <PillLink href="/pedido/" tone="green">Ver mi pedido</PillLink>
        </div>
      </section>
    </>
  );
}
