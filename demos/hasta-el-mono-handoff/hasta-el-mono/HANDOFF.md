# Handoff — Hasta El Moño (build en VS Code con Claude Code)

Proyecto de **signature-studio**. Etapas 1 (brand-kit), 2 (signature-content) y 3 hasta DESIGN.md (signature-web, pasos 0–4) cerradas el 16/10/2026. Falta: **signature-web pasos 5–7 (construcción, loop de mirar, piso de calidad)** y después **signature-launch**.

## Cómo arrancar
1. Descomprimí esta carpeta dentro de tu workspace (ej. `clientes/hasta-el-mono/`).
2. Abrila en VS Code y abrí Claude Code.
3. Pegá el prompt de abajo.

---

## Prompt para Claude Code

```
Retomá el proyecto web de Hasta El Moño con /signature-studio. Leé PROYECTO.md: estamos en la etapa 3 (signature-web), con la dirección A elegida y DESIGN.md cerrado. Cargá el skill signature-web y seguí desde el paso 5 (Construcción).

Leé en este orden y no contradigas nada:
1. PROYECTO.md — estado, decisiones, provisorios
2. brand-kit/brand.json — marca (fuente de verdad visual)
3. CONTENT.md — copy por sección, oferta, estructura sugerida. No reescribas copy sin motivo; lo marcado [CONFIRMAR] queda marcado
4. DESIGN.md — contrato: tokens, tipografía, componentes, motivo firma (la bandeja del Sr. Moño), referencias, anti-decisiones. Si necesitás un valor que no está, primero agregalo a DESIGN.md
5. data/carta.json — la carta completa (45 ítems). "?" = precio a confirmar
6. content/ — fotos del propietario en WebP (provisorias, ≈750–950 px)
7. boceto/ — boceto navegable hecho en el chat. Usalo solo como referencia de estructura y de la lógica del carrito; el diseño final lo hacés vos desde DESIGN.md

Requisitos:
- Plan P3: carta + carrito que arma el pedido y abre wa.me/5492494694718 con el mensaje (detalle, total "sin envío", retiro/envío, nombre, dirección, comentarios, firma "Atte. [nombre]").
- Estado DEMO: va a demos/hasta-el-mono/ del repo Geronimo02/Geronimo02.github.io → sitio ESTÁTICO (HTML/CSS/JS o Astro con salida estática), con <meta name="robots" content="noindex"> y una franja visible de "Demo".
- Abierto/cerrado calculado en hora America/Argentina/Buenos_Aires (11:30–14:30 y 19:30–23:30 todos los días, [CONFIRMAR]).
- Logo: brand-kit/assets/logo-wordmark-provisorio.svg es PROVISORIO (pierde el moño de la Ñ). No lo redibujes ni le inventes isotipo.
- Nada de stock, nada de rojo/verde italiano, radio 0 salvo pills, sin sombras.
- Nivel de intensidad 1 (CSS + JS chico). Un solo momento animado: la ficha que aterriza en la bandeja. prefers-reduced-motion la apaga.
- Schema LocalBusiness/Restaurant con dirección, teléfono y horarios. OG image con la estética del sitio.

Loop de mirar (obligatorio, mínimo 2 vueltas): levantá el sitio, capturas con Playwright a 1440, 768 y 390 px, y con reduced-motion. Revisá contra DESIGN.md y contra los anti-AI tells del skill, corré los dos tests de la regla madre (logo de competidor / algo que solo puede estar en esta web) y corregí.

Al terminar: actualizá PROYECTO.md (etapa 3, preview, decisiones) y frená para que apruebe la preview antes de pasar a signature-launch.
```

---

## Qué hay en el paquete

| Archivo | Etapa | Qué es |
|---|---|---|
| `PROYECTO.md` | 0 | Estado del proyecto (plan P3, DEMO), decisiones, pendientes y provisorios |
| `brand-kit/brand.json` | 1 | Marca: colores con contraste WCAG, tipografía, logo y diagnóstico, tono, brechas, insumos de diseño, fuentes |
| `brand-kit/assets/` | 1 | Logo de IG (captura) + SVG provisorio en blanco y negro |
| `CONTENT.md` | 2 | Datos del negocio, inventario, carta con precios, shot list, copy por sección, estructura |
| `pedido-cliente.md` | 2 | Mensaje de WhatsApp para pedirle al local fotos y confirmaciones (no enviado) |
| `content/` | 2 | 8 fotos del propietario en WebP |
| `data/carta.json` | 2 | La carta estructurada para el build |
| `DESIGN.md` | 3 | Contrato de diseño: concepto, referencias, motivo firma, tokens, componentes, movimiento, no-hacer |
| `boceto/` | 3 | Boceto navegable del chat (referencia de estructura y carrito, no diseño final) |

Manual de marca navegable: artifact "Hasta El Moño" (Design System) en claude.ai.

## Pendiente del cliente (bloquea producción, no el demo)
Logo en vector · horarios · precios de mostrador · precios de Pollo, Rúcula, Rúcula y cherry y fainá · empanadas fritas · costo y zona de envío · fotos originales.
