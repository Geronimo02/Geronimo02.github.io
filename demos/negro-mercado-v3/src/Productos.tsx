import { business } from './data';
import { PillLink } from './App';

export default function Productos() {
  return (
    <>
      <section className="page-hero page-hero-stack products-hero">
        <div className="hero-ghost hero-ghost-sm" aria-hidden="true">ö</div>
        <p className="tag tag-green">productos</p>
        <h1 className="big-title">para llevar<span>.</span></h1>
        <p className="strip">un poco más</p>
        <p className="lead">Acá van a vivir los productos que Negro Mercado confirme para venta: café en grano, cajas, regalos. Hoy todavía no hay artículos con precio y stock validados.</p>
      </section>

      <section className="products-duo">
        <div className="duo-card duo-green">
          <p className="ghost-o ghost-o-light" aria-hidden="true">ö</p>
          <div>
            <h2>próximamente<br />por acá.</h2>
            <p>Mientras tanto, consultá los productos disponibles hoy directamente con el local.</p>
            <PillLink href={`https://wa.me/${business.whatsapp}`} tone="cream" external>Consultar por WhatsApp</PillLink>
          </div>
        </div>
        <div className="duo-card duo-mint">
          <p className="eyebrow eyebrow-brown">Ya podés pedir</p>
          <h2>Lo de la carta,<br />para llevar.</h2>
          <p>Sumá café, fríos y vermú al pedido y lo coordinamos por WhatsApp.</p>
          <PillLink href="/carta/" tone="outline">Ver la carta</PillLink>
        </div>
      </section>

      <section className="future">
        <p className="script">así van a verse</p>
        <h2 className="section-title">los productos.</h2>
        <div className="future-grid">
          {[1, 2, 3].map((n) => (
            <article className="future-card" key={n}>
              <div>[FOTO DEL PRODUCTO]</div>
              <h3>[Nombre del producto]</h3>
              <p>[Descripción corta]</p>
              <strong>[$ PRECIO]</strong>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
