# Las Pizzas del Tano — Design System

> Leña encendida detrás del cartel de hierro de Mitre 582.

**Tema:** light (crema) con hero oscuro de horno
**Arquetipo:** Editorial cálido + afiche/flyer impreso — la marca ya se comunica con flyers mecanografiados en papel crema; la web es ese flyer con el horno de fondo.
**Intensidad:** nivel 1 (vivo). Público local, celulares de gama media.
**Fuente:** brand-kit/brand.json (16/10/2026)

El peso visual lo cargan dos cosas reales del local: la foto del horno a leña y el cartel colgante de la puerta. Todo lo demás es papel crema con tinta de máquina de escribir, como sus flyers. El bordó es superficie para momentos (franja de estado, el 29), el amarillo es solo acento sobre bordó y CTA. El verde del óvalo aparece una sola vez: el sello de ñoquis.

## Direcciones evaluadas
| | Concepto | Motivo | Por qué no / sí |
|---|---|---|---|
| **A (elegida)** | Leña bajo el cartel de hierro | Cartel colgante que se hamaca con el scroll + carta mecanografiada | Usa los dos activos físicos que más se ven del local |
| B | Flyer de papel crema pegado en la pared | Collage de flyers, óvalos, cinta | Fuerte pero depende de piezas de IG que no tenemos en alta |
| C | Neón 582 sobre la vereda de Mitre | Glow amarillo, noche | El neón es una sola foto; la marca de día es crema, no noche |

## Referencias
| Sitio | Rubro | Qué tomamos | Qué no | Captura |
|---|---|---|---|---|
| Menu DOMENICA PIZZA — Nguyen Truong Giang, behance.net/gallery/242595687 (pasada por Gero, 17/10/2026) | carta de pizzería napolitana | Pliegos editoriales por plato: foto cenital recortada en círculo que se sale del borde, nombre en serif grande, descripción y precio grande debajo, palabra de categoría gigante en vertical en tono claro, fondo crema con textura de lino; alterna izquierda/derecha | Sus fotos, su paleta marrón, su sans Montserrat, su logo con bandera italiana, sus textos | — (vista en Chrome) |

El resto sale del material de la marca (IG, ola.click, fotos del propietario en Google).

## Hero (cambio 17/10/2026)
- Foto del neón de la entrada, nombre en neón amarillo (Yellowtail) que titila al cargar, 582 calado.
- Cartel de neón con la hora de Tandil: ABIERTO verde #5DFF9A / CERRADO rojo #FF5A4E, ambos encendidos con zumbido lento; se apaga la animación en reduced-motion.
- El cartel de hierro colgante sale del hero (queda en site/index-horno.html).

## Motivo firma
- **Qué es:** el cartel de hierro "LAS PIZZAS DEL TANO" que cuelga sobre la vereda, dibujado en SVG, colgado del borde superior del hero. Se hamaca con la velocidad del scroll (péndulo amortiguado) y vuelve a quieto.
- **Por qué este rubro:** es literalmente el cartel de la puerta (foto del propietario, feb 2024). Nadie más en Tandil lo tiene.
- **Dónde aparece:** hero (grande), favicon/esquina del footer (chico, quieto).
- **Tercer gesto:** pliegos de "Las de la casa" — la pizza en círculo gira 8° al entrar en pantalla (receta propia, CSS transition).
- **Segundo gesto:** la carta como ticket mecanografiado con puntos guía hasta el precio; en desktop la foto del ítem aparece al lado del cursor como una foto sujeta con cinta.
- **Fallback:** reduced-motion → cartel quieto, fotos de carta en miniatura fija.

## Colores
| Nombre | Valor | Token | Rol |
|---|---|---|---|
| Crema flyer | #F6EAD0 | --c-paper | fondo general. No va sobre fotos |
| Lino (marca de agua) | #E6D3A8 | — | palabra vertical PIZZA en los pliegos. Nunca texto que haya que leer |
| Tinta | #2A1A14 | --c-ink | texto, puntos guía |
| Tinta suave | #6B5A4E | --c-ink-2 | descripciones (5,5:1 sobre crema) |
| Bordó Tano | #8C0C10 | --c-bordo | franja de estado, sección 29, botón secundario |
| Amarillo cartel | #FCDC58 | --c-yellow | CTA "Pedir" y texto sobre bordó. Nunca texto sobre crema |
| Verde óvalo | #1E6B3A | --c-green | solo el sello ÑOQUIS |
| Carbón leña | #1A0F0B | --c-coal | hero y footer |

Regla de acento: amarillo solo en el CTA de pedir y en datos sobre bordó.

## Tipografía
### Display — Young Serif (Google Fonts)
- Sustituto: Georgia, serif
- Peso 400 (única)
- Tamaños: clamp(64px, 11vw, 176px) display; 56–96 h2
- Interlineado 0.92, tracking -0.02em
- Rol: titulares, wordmark provisorio, citas

### Texto — Courier Prime (Google Fonts)
- Sustituto: "Courier New", monospace
- Pesos 400 / 700
- Rol: todo lo demás: carta, precios, datos, botones. Es la voz de sus flyers.

| Rol | Tamaño | Interlineado | Tracking | Token |
|---|---|---|---|---|
| display | clamp(64,11vw,176) | .92 | -.02em | --t-display |
| h2 | clamp(48,7vw,104) | .95 | -.015em | --t-h2 |
| h3 | 22 | 1.2 | .04em uppercase | --t-h3 |
| body | 17 | 1.55 | 0 | --t-body |
| caption | 13 | 1.4 | .08em uppercase | --t-cap |

## Espaciado y forma
- Densidad: cómoda
- Ancho máximo: 1240px
- Gap entre secciones: 144px desktop / 88px mobile
- Radios: 0 en todo. Excepción: el óvalo del sello y el botón pill de Pedir (999px), como el óvalo de sus flyers.
- Elevación: plano. Única sombra: foto flotante de carta (sombra dura 6px 6px 0 tinta).

## Componentes
- **Botón Pedir:** pill amarillo, texto tinta 700 mono, borde 2px tinta; hover invierte a tinta/amarillo.
- **Botón secundario:** borde 2px, sin relleno, mono 700.
- **Nav:** wordmark "Tano®" izq, índice "01 Carta · 02 El 29 · 03 Salón · 04 Mitre 582" y Pedir der. Mobile: wordmark + Pedir; índice en barra fija inferior.
- **Ítem de carta:** nombre MAYÚSCULA 700 · puntos guía · precio; descripción debajo en tinta suave.
- **Ticket de promo:** borde punteado + muescas laterales.
- **Footer:** "MITRE 582" a ancho completo en Young Serif.

### Comanda (carrito P3)
- Botón "+" circular 44px con borde tinta en cada ítem; en los pliegos, pill amarillo "Sumar a la comanda". Al tocar: sello (scale 1.3→1, rotate -6°, 500ms, cubic-bezier(.2,1.6,.4,1)).
- Flotante: ticket crema con sombra dura 6px, "Comanda · n · $total". En celular va en la barra inferior.
- Panel: papel térmico #FBF7EC con bordes dentados (mask radial), se "imprime" de arriba hacia abajo (clip-path, 450ms); cada línea nueva baja impresa.
- Líneas: cantidad × nombre … precio, −/+/sacar; las promos "a elección" piden qué pizza.
- Envío/retiro, horario (lo antes posible solo si está abierto; si no, agendado 20–23:30), pago, nombre, aclaraciones. Mensaje armado para WhatsApp.
- DEMO: no abre WhatsApp; muestra el mensaje y "Copiar".

## Movimiento
- Duraciones: micro 160ms · reveal 600ms · cartel: física (spring k=.06, damping .9)
- Easing: cubic-bezier(.2,.8,.2,1)
- Scroll: nativo (sin Lenis; no hace falta)
- Técnicas: cartel péndulo (hero), reveal por línea del titular (hero), foto-cinta que sigue al cursor (carta, desktop), contador al próximo 29 (sección 29)
- Reduced motion: se apagan péndulo, reveal y foto flotante

## Imagen
Solo fotos del propietario (Google Maps) y de su carta (ola.click). Sin stock, sin generadas. Hero con scrim carbón de abajo hacia arriba para el titular.

## Voz del copy
Rioplatense, voseo, frases cortas, datos (direcciones, horas, precios). Prohibido: "experiencia", "pasión", "auténtico".

## Hacer
- Precios siempre con fecha de captura
- Estado abierto/cerrado real en hora de Tandil

## No hacer (anti-decisiones)
- Nada de mantel a cuadros como fondo (es el cliché de toda pizzería)
- Nada de iconos de pizza/emoji como ilustración
- Nada de cards con radio y sombra suave

## Estructura de secciones
1. Hero horno + cartel — ganas y pedir
2. Franja estado — ¿está abierto?
3. Las de la casa — 5 pliegos editoriales (Messi, Tana, Sicilia, Asadito, Margherita)
3b. Carta completa — ticket mecanografiado para escanear
4. El 29 de ñoquis — ritual
5. Promos — mesa grande
6. Salón — venir
7. Reseñas — confianza
8. Mitre 582 — llegar

## Tokens
```css
:root{
  --c-paper:#F6EAD0; --c-ink:#2A1A14; --c-ink-2:#6B5A4E; --c-bordo:#8C0C10;
  --c-yellow:#FCDC58; --c-green:#1E6B3A; --c-coal:#1A0F0B;
  --f-display:"Young Serif",Georgia,serif; --f-text:"Courier Prime","Courier New",monospace;
  --t-display:clamp(64px,11vw,176px); --t-h2:clamp(48px,7vw,104px);
  --ease:cubic-bezier(.2,.8,.2,1); --max:1240px;
}
```
