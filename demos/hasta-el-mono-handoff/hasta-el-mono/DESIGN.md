# Hasta El Moño — Design System

> Bandeja de plata sobre mantel negro.

**Tema:** dark (fijo, con una sección en papel crema)
**Arquetipo:** Lujo silencioso parodiado + Cinemático oscuro — el Sr. Moño es un millonario de mentira: se toma en serio el lujo para hacer chiste con una pizzería de barrio.
**Intensidad:** nivel 1 (techo de celulares de gama media; un solo momento animado: la bandeja)
**Fuente:** brand-kit 16/10/2026 (brand-kit/brand.json) + CONTENT.md

Negro profundo como las fotos del feed, letras blancas recortadas como el logo y una sección de carta en papel crema como la impresa. El peso visual lo cargan la foto de producto sobre negro y la tipografía extendida de la carta. La plata y el guante blanco son del personaje. El dorado de la masa es el único acento: precios y botón de WhatsApp.

## Referencias
Relevadas el 16/10/2026. Se toma método, nunca layout, imágenes, textos ni código. Ninguna es competencia de Tandil.

| Sitio | Rubro | Qué tomamos | Qué no |
|---|---|---|---|
| [Talula's Pizza](https://talulaspizza.com/) (Asbury Park, NJ) — ficha en [Fonts In Use](https://fontsinuse.com/uses/65100/talula-s-pizza-website-and-brand-refresh) | Pizzería (mismo rubro) | Personalidad con humor en una pizzería de barrio; display con carácter solo en titulares + sans legible para carta y horarios; carta y horarios como contenido principal de la web | Su paleta, sus ilustraciones retro, el look de estrellitas y cuadros |
| [Liquid Death](https://liquiddeath.com/) — design system en [webdesignhot](https://www.webdesignhot.com/api/design-md/liquid-death/export/google-alpha) | Bebidas (otro rubro, mismo gesto: lujo/actitud exagerados con ironía) | Blanco y negro estructural sin tercer color; radio 0 en todo; profundidad por inversión negro/crema en vez de sombras; CTAs cortos con actitud; acentos solo en momentos puntuales | Calaveras, estética metal, la condensada; la nuestra es extendida como la carta |
| [Caviar Kaspia NY](https://www.caviarkaspiany.com/) — [Made in Webflow](https://webflow.com/made-in-webflow/website/caviarkaspia-3a92a0def3dbc9d0b86f455189) | Caviar y servicio de mesa (otro rubro, mismo material: platería y servicio de lujo) | El código del servicio de lujo (bandeja, platería, mesa puesta) para parodiarlo con el Sr. Moño; interacciones de "arrastrar/servir" sobre canvas | Su paleta y tipografía; **revisar en vivo antes de usar** (solo se verificó la ficha, no el sitio) |
| [Char — vividsites](https://www.vividsites.app/t/char) | Restaurante a la leña (técnica) | Motivo firma que sale del oficio y reacciona al usuario (en Char, el fuego; acá, la bandeja que recibe lo que sumás); carta corta y fotografiada con la misma luz | El fluido en Three.js y el nivel 3: el techo acá es nivel 1–2 para celulares de gama media |

Lo que define el sistema sale igual del material de la marca: feed sobre negro, carta impresa crema, logo recortado, Sr. Moño, cajas kraft.

## Motivo firma
- **Qué es:** el carrito es **la bandeja del Sr. Moño**: una bandeja de plata vista desde arriba donde cada cosa que sumás aterriza (pizza = disco con la porción que falta, como la O del logo; empanada = media luna; rastapan = óvalo; canastita = flor de repulgue). Al enviar, el pedido sale "Atte." por WhatsApp.
- **Por qué este rubro:** la bandeja y el guante son activos reales del local (posteo del 29/01/2026, foto de rastapan en PedidosYa); la O-pizza es del logo.
- **Dónde aparece:** botón flotante "Bandeja (n)", panel del pedido, separadores de sección (O-pizza), estado vacío.
- **Fallback:** reduced-motion: los ítems aparecen sin caída.

## Colores
| Nombre | Valor | Token | Rol |
|---|---|---|---|
| Negro Moño | #0B0B0D | --negro | Fondo general. |
| Pizarra | #17181A | --pizarra | Bandas alternas y panel (derivado más oscuro que el azulejo #3C4042 para no lavar las fotos). |
| Blanco tiza | #FFFFFF | --tiza | Texto principal sobre negro, logo. |
| Kraft | #D8B99F | --kraft | Texto secundario sobre negro (10.6:1). |
| Crema carta | #FEF7E7 | --crema | Fondo de la sección Carta. |
| Plata | #957F6E / #C9C2B8 | --plata / --plata-luz | Bandeja (anillos), filetes. Nunca texto chico. |
| Dorado horno | #B26D2C → #D08A45 hover | --dorado | Acento único: botón de pedido y precios sobre negro (texto negro encima). |
| Dorado tostado | #8A4A14 | --tostado | Precios sobre crema (6.4:1). |

Regla de acento: dorado solo en el botón de pedido/WhatsApp y en precios.

## Tipografía
### Display — Archivo (eje de ancho 125, peso 800–900)
- La carta impresa usa una sans extendida negra en mayúsculas: es lo más cercano en Google Fonts.
- Display 72–132px, interlineado .88, tracking -0.01em.
### Voz del Sr. Moño — Bodoni Moda itálica
- Solo para las firmas y frases del personaje ("Atte. Sr. Moño"). Nunca en UI ni precios.
### Texto — Archivo (ancho 100)
| Rol | Tamaño | Interlineado | Token |
|---|---|---|---|
| display | clamp(56px, 11vw, 132px) | .88 | --t-display |
| h2 | clamp(36px, 6vw, 72px) | .92 | --t-h2 |
| item carta | 17px, 800, mayúsc., ancho 112 | 1.2 | --t-item |
| body | 16px | 1.5 | --t-body |
| caption | 13px | 1.4 | --t-cap |

## Espaciado y forma
- Ancho máximo 1200px. Secciones 96px desktop / 64px mobile.
- Radios: 0 en todo (carta y cartel son rectos); pill 999px solo en botones y chips; círculo para la bandeja.
- Elevación: plano. Jerarquía por color.

## Movimiento
- micro 160ms · aterrizaje 420ms cubic-bezier(.2,.9,.25,1.2) · reveal 600ms
- Sin Lenis ni GSAP: CSS + JS chico.
- Reduced motion: sin caída en la bandeja, sin marquesina.

## Imagen
Fotos del propietario (IG + PedidosYa), producto sobre negro. Nunca stock. Provisorias en ≈750–950px.

## Voz del copy
Voseo rioplatense, humor del Sr. Moño, frases cortas con datos (horarios, precios, 48 h de reposo). Prohibido: "experiencia gastronómica", "calidad premium", "los mejores".

## No hacer
- No rojo/verde italianos ni manteles a cuadros.
- No cards con sombra ni radios redondeados.
- No íconos genéricos de pizza: la única forma es la O-pizza del logo.

## Estructura de secciones
1. Hero — pizza sobre negro, titular, abierto/cerrado ahora, CTA
2. Marquesina — horarios y dirección
3. Carta + bandeja (P3) — tabs, grande/individual, sumar
4. Rastapan — producto propio
5. Atte. Sr. Moño — personaje
6. El local — fachada, horarios, cómo llegar, Google 4,3 ★
7. Footer — WhatsApp grande

## Componentes
### Botón primario (pedido / WhatsApp)
Fondo `--dorado`, texto `--negro`, pill, 44px de alto mínimo, 700 15px ancho 112. Hover `--dorado-hover`. Foco: outline 2px `--dorado` offset 3px.
### Botón secundario
Borde 1.5px currentColor, fondo transparente, pill. Hover invierte a tiza/negro.
### Navegación
Barra sticky negra con el logo (44px), estado "Abierto ahora · hasta las 23:30 / Cerrado · abre a las 19:30" calculado en hora de Tandil, y botón "Bandeja (n)".
### Ítem de carta
Fila sin card: nombre en mayúsculas extendido 800, ingredientes 14px en `--suave-crema`, a la derecha botones "Grande $X +" / "Individual $X +". Filete 1px `--linea-crema`. Precio desconocido = "a confirmar" (se puede sumar igual y el mensaje lo aclara).
### La bandeja (carrito)
Panel negro: bandeja de plata en SVG vista desde arriba con las fichas (O-pizza, media luna, óvalo, flor), renglones con − / +, total "sin envío", retiro/envío, nombre, dirección si es envío, comentarios, botón "Enviar pedido por WhatsApp" a wa.me/5492494694718 con el mensaje armado y firmado "Atte. [nombre]". Desktop: sticky al costado de la carta. Mobile: hoja desde abajo + barra fija con total.
### Footer
Número de WhatsApp gigante en display extendido, seleccionable, con botón copiar.

## Tokens (CSS)
```css
:root{
  --negro:#0B0B0D; --pizarra:#17181A; --tiza:#FFFFFF; --kraft:#D8B99F;
  --crema:#FEF7E7; --suave-crema:#4A4440; --linea:#2A2B2E; --linea-crema:#D9CDB5;
  --plata:#957F6E; --plata-luz:#C9C2B8;
  --dorado:#B26D2C; --dorado-hover:#D08A45; --tostado:#8A4A14;
  --font-display:"Archivo","Arial Black",system-ui,sans-serif; /* font-stretch:125%; 800–900 */
  --font-sr:"Bodoni Moda","Didot",Georgia,serif;               /* itálica, solo voz del Sr. Moño */
  --font-text:"Archivo",system-ui,sans-serif;
  --text-display:clamp(46px,7vw,104px); --text-h2:clamp(38px,6.4vw,76px);
  --radius-0:0; --radius-pill:999px;
  --ease-land:cubic-bezier(.2,.9,.25,1.2); --ease:cubic-bezier(.2,.8,.2,1);
  --max:1200px;
}
```
Google Fonts: `family=Archivo:wdth,wght@62..125,400..900&family=Bodoni+Moda:ital,opsz,wght@1,6..96,400..600`
