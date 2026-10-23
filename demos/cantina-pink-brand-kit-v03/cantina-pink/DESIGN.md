# DESIGN — Web Cantina Pink

Contrato de diseño de la web. Interpreta `BRAND.md` v0.3 (que manda) y no lo contradice. Todo valor de CSS sale de `design-tokens.css` + `src/styles/global.css`; si un componente necesita un valor nuevo, primero se agrega acá.

Referencias: basado solo en material de la marca (BRAND.md, captura del feed, logo). No hay carpeta `referencias/` todavía.

## Concepto
**Salsa roja sobre mantel a cuadros, al mediodía de San Martín y Yrigoyen.**
Cantina popular con humor, platos que llegan a la mesa y cartelería borgoña. Nada de minimalismo premium ni de rosa fucsia.

## Motivo firma: poner la mesa
- **El mantel se tiende:** bandas de cuadros rojo/blanco que se despliegan de izquierda a derecha (`scaleX` 0→1, 900 ms) al entrar en pantalla. Solo en bandas y separadores, nunca bajo texto.
- **Los platos llegan a la mesa:** en el scroll escénico del inicio, los recortes cenitales se acercan, escalan y se acomodan sobre el mantel según el avance del scroll.
- **La placa del feed:** fondo borgoña con trama de mantel en vino oscuro, titular serif pesado en crema y precio en pastilla crema (`por $19.900`). Sale directo de las piezas «PASTA LIBRE» y «29 DE ÑOQUIS».

## Arquetipo e intensidad
Cartelería gastronómica editorial + bodegón popular. **Nivel 2 (cinemático) solo en una sección** del inicio; el resto, nivel 1 (reveals). `/mesa` es nivel 0: tiene que abrir rápido en el celular.

## Color (brand.json v0.3)
| Token | HEX | Uso |
|---|---|---|
| `--ink` | #3B1719 | texto, titulares |
| `--wine` | #741F25 | placas, botón primario, pie |
| `--red` | #A12B2B | mantel, CTA de pedido |
| `--green` | #4A6244 | solo acento del logo y marcador `[COMPLETAR]` |
| `--paper` | #E8D8BF | barra superior (coincide con el fondo del logo) |
| `--cream` | #FFF7E9 | fondo general, texto sobre vino |
| `--line` | ink 18 % | bordes 1px |
| mantel | red 72 % sobre #FFFDF8 | bandas de cuadros |

Pares de texto permitidos: los de BRAND.md §12 (todos ≥ 5.18:1). No usar rojo ni verde como texto sobre crema en tamaños chicos.

## Tipografía
- Display: **Fraunces** variable (solo eje de peso, 36 KB), 700–800. Propuesta de producción, no la tipografía original.
- Texto e interfaz: **DM Sans** 400/500/700.
- Escala: `.display-xl` clamp(3rem,7vw,6.25rem)/.98 · `.display-l` clamp(2.25rem,5vw,4rem)/1.03 · `.display-m` clamp(1.625rem,3vw,2.25rem)/1.08 · body 1rem/1.6 · `.kicker` 13px 700, versalitas con tracking .14em.

## Espacio, grilla y radios
- Ancho máx. 1200px; gutters 20/32/48px (breakpoints 640/960).
- Espacios 4·8·12·16·24·32·48·64·96.
- Radios: 8px (fotos, placas, sellos), 999px (botones, pastillas, tags). Nada de 12–16px genérico en todo.
- Sombras: ninguna, salvo **una sombra dura** (`0 18px 0` ink 12 %) bajo los recortes apoyados en el mantel.

## Componentes
`Header` (barra papel, logo original, menú móvil a pantalla completa sobre placa) · `Footer` (dirección gigante, horario, contacto) · `Logo` · `Recorte` (usa PNG/WebP real si existe, si no la ilustración SVG) · `PhotoSlot` (foto real o placeholder con brief) · `MenuItemRow` (fila con puntos guía y precio) · `Pending` (marcador `[COMPLETAR]`) · `Icon` · botones `.btn--wine/red/cream/outline` · `.placa` · `.mantel` · `.price-pill` · `.sello` · `.tag`.

## Movimiento
| Gesto | Detalle | Reduced motion |
|---|---|---|
| Plato a la mesa | opacity 0→1, translateY 12px→0, 420 ms `cubic-bezier(.22,1,.36,1)`, una vez | sin transición |
| Mantel que se tiende | scaleX 0→1, 900 ms | estático |
| Poner la mesa (scroll) | translate/scale/rotate atados al scroll, suavizado con lerp en rAF; amplitud 40 % en celular | composición final estática |
| Sello | opacity 180 ms | sin transición |
| Entre páginas | View Transitions de Astro | desactivadas |

Solo `transform` y `opacity`. Nunca secuestrar el scroll.

## Anti-decisiones
1. No rosa/fucsia ni degradados: el nombre dice Pink, la marca no.
2. No grilla de 3 cards con íconos: especialidades como placas y filas de carta.
3. No cuadros bajo texto ni como textura de fondo de toda la página.
4. No recrear ni retocar el logo con CSS.
5. No fotos de stock ni recortes de la captura del feed: ilustraciones provisorias declaradas hasta tener originales.

## Tests de identidad
- Con el logo de otro bodegón: la placa «PASTA LIBRE por $19.900», el 29 de ñoquis y la dirección gigante de San Martín 501 delatan que es Cantina Pink.
- Lo recordable: los platos llegando al mantel con el scroll.
