> ESTADO ACTUAL (17/10/2026): demo P3 local construida, NO publicada, NO conectada a WhatsApp. Cualquier accion futura de produccion requiere una nueva aprobacion explicita.

# Hasta el Moño — Signature Launch / preauditoría (NO DEPLOY)

**Fecha:** 17/10/2026 · **Estado:** Demo en definición de diseño. No sitio funcional ni repo inspeccionado. Se actualizó la identidad/documentación; no se tocó GitHub/Cloudflare ni se conectó WhatsApp real.

## Alcance provisional
- Plan P3: carta, carrito, resumen de pedido y WhatsApp — **pendiente de carta y aprobación de usuario**.
- Ruta técnica posible: estático HTML/CSS/JS o Astro; Cloudflare Workers + Static Assets para proyecto nuevo. Si el dominio no delega NS, Pages con CNAME. **No se verificó ninguna cuenta ni se seleccionó un dominio.**
- Si solo necesitan catálogo sin carrito: P2, ajustar alcance y precio antes del build.

## NAP para preparar SEO
- Nombre: Hasta el Moño Pizzas y Empanadas.
- Dirección: Av. Santamarina 54, Tandil, Buenos Aires.
- Horario **según Instagram aportado:** todos los días 11:30–14:30 y 19:30–23:30. **Confirmar antes de schema** (directorios contienen intervalos distintos).
- Catálogo WhatsApp visible: `https://wa.me/c/5492494694718`; usar como salida a catálogo solo si se aprueba. No inventar destino de pedidos.

## SEO propuesto
- Title: `Hasta el Moño | Pizzas y empanadas en Tandil`
- Description: `Conocé Hasta el Moño en Av. Santamarina 54, Tandil. Mirá pizzas y empanadas y consultá cómo hacer tu pedido.`
- Estructurados: `Restaurant` solo con datos verificados, URL real, teléfono de pedidos confirmado y `openingHoursSpecification` correcto.
- OpenGraph con foto aportada y logo original solo **con permiso del titular**.
- Sitemap/canonical para URL oficial; `noindex` para demo, Search Console y Google Business solo con acceso permitido.

## Rendimiento y seguridad — objetivos NO medidos
- LCP <2,5s, INP <200ms, CLS <0,1; PageSpeed objetivo 90+ perf / 95+ accesibilidad (no observado).
- WebP responsive en `content/`; el clip MP4 no debe bloquear LCP ni reproducirse automáticamente en mobile sin consideración de datos.
- Controles con altura >=44 px, visible focus, navegación por teclado y contraste AA.
- `robots noindex` en previews, CSP/HSTS y headers tras verificar hosting real.
- No secretos, no números de WhatsApp automáticos de pedidos, sin servicios pagos sin aprobación.

## Puertas de aprobación
1. Selección A/B/C, plan P2/P3 y contenido.
2. Obtener precios/carta y derechos de imágenes/logotipo.
3. Crear/inspeccionar repo, rama preview con permiso cuando corresponda.
4. QA móvil/desktop, funcional y Lighthouse real.
5. **Aprobación explícita para producción, WhatsApp receptor, dominio, DNS y cualquier gasto.**

**Aún NO existen:** preview, web publicada, `ENTREGA.md`, Lighthouse, dominio, credenciales o webhook. No afirmar lo contrario.
